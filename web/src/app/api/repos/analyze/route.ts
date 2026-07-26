import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { courses, lessons, quizzes } from "@/lib/schema";
import { generateContent, parseJSON, sanitizeForPrompt } from "@/lib/llm";
import { COURSE_SYSTEM_PROMPT, LESSON_SYSTEM_PROMPT, QUIZ_SYSTEM_PROMPT } from "@/lib/prompts";

interface CourseModule {
  title: string;
  description: string;
  order: number;
  learning_objectives: string[];
}

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

async function fetchGitHubRepo(url: string): Promise<{ content: string; name: string; description: string }> {
  const parsed = new URL(url);
  if (parsed.hostname !== "github.com") {
    throw new Error("Only github.com URLs are supported");
  }

  const pathParts = parsed.pathname.replace(/\.git$/, "").split("/").filter(Boolean);
  if (pathParts.length < 2) {
    throw new Error("Invalid GitHub URL — need owner/repo");
  }

  const [owner, repo] = pathParts;
  const repoName = `${owner}/${repo}`;
  const headers: Record<string, string> = { Accept: "application/vnd.github.v3+json" };
  if (GITHUB_TOKEN) headers.Authorization = `Bearer ${GITHUB_TOKEN}`;

  let readme = "";
  try {
    const readmeRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/readme`, { headers });
    if (readmeRes.ok) {
      const data = await readmeRes.json();
      readme = Buffer.from(data.content, "base64").toString("utf-8");
    }
  } catch {}

  let tree = "";
  try {
    const treeRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/trees/HEAD?recursive=1`, { headers });
    if (treeRes.ok) {
      const data = await treeRes.json();
      tree = (data.tree || [])
        .filter((f: any) => f.type === "blob")
        .slice(0, 100)
        .map((f: any) => `${f.path} (${f.size}b)`)
        .join("\n");
    }
  } catch {}

  let info: any = {};
  try {
    const infoRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers });
    if (infoRes.ok) info = await infoRes.json();
  } catch {}

  return {
    content: `Repository: ${repoName}\n\nDescription: ${info.description || "N/A"}\n\nLanguage: ${info.language || "N/A"}\n\nFile Structure:\n${tree}\n\nREADME:\n${readme.slice(0, 30000)}`,
    name: repoName,
    description: info.description || `Codebase analysis of ${repoName}`,
  };
}

export async function POST(request: NextRequest) {
  try {
    const { repoUrl } = await request.json();

    if (!repoUrl || typeof repoUrl !== "string") {
      return NextResponse.json({ error: "repoUrl is required" }, { status: 400 });
    }

    const repoData = await fetchGitHubRepo(repoUrl);

    // Step 1: Generate course structure
    const coursePrompt = `Analyze this repository and create a structured course
to help someone understand how it works.

Repository: ${repoData.name}

Repository content:
${sanitizeForPrompt(repoData.content).slice(0, 50000)}

Create a course outline with 4-8 modules covering:
1. Architecture overview
2. Core components
3. Data flow
4. Key patterns and design decisions
5. How to contribute/extend`;

    const courseResponse = await generateContent(coursePrompt, COURSE_SYSTEM_PROMPT);
    const courseData = parseJSON<{ title: string; description: string; modules: CourseModule[] }>(courseResponse);

    const [course] = await db
      .insert(courses)
      .values({
        title: courseData.title,
        description: courseData.description,
        source: `repo:${repoData.name}`,
        totalModules: courseData.modules.length,
      })
      .returning();

    // Step 2: Generate lessons + quizzes in parallel
    const lessonResults = await Promise.allSettled(
      courseData.modules.map(async (mod) => {
        const lessonPrompt = `Create a detailed lesson for this module about the repository ${repoData.name}:

Module: ${mod.title}
Description: ${sanitizeForPrompt(mod.description)}
Learning Objectives: ${mod.learning_objectives.join(", ")}

Repository context:
${sanitizeForPrompt(repoData.content).slice(0, 30000)}

Include:
1. Introduction (why this matters)
2. Core concepts with code examples from the actual repo
3. How the code works step by step
4. Common patterns used
5. Key takeaways
6. Interview tips for this topic`;

        const lessonContent = await generateContent(lessonPrompt, LESSON_SYSTEM_PROMPT);

        const [lesson] = await db
          .insert(lessons)
          .values({
            courseId: course.id,
            moduleOrder: mod.order,
            title: mod.title,
            content: lessonContent,
            keyConcepts: JSON.stringify(mod.learning_objectives),
            durationMinutes: 15,
          })
          .returning();

        // Generate quiz for this lesson
        const quizPrompt = `Generate 7 quiz questions based on this lesson about the ${repoData.name} repository:

${sanitizeForPrompt(lessonContent).slice(0, 20000)}

Test understanding of the codebase, not just memorization.`;

        const quizResponse = await generateContent(quizPrompt, QUIZ_SYSTEM_PROMPT);
        const quizData = parseJSON<Array<{
          question: string;
          options: string[];
          correct_index: number;
          explanation: string;
          difficulty: string;
        }>>(quizResponse);

        if (quizData.length > 0) {
          await db.insert(quizzes).values(
            quizData.map((q) => ({
              lessonId: lesson.id,
              question: q.question,
              options: JSON.stringify(q.options),
              correctIndex: q.correct_index,
              explanation: q.explanation,
              difficulty: q.difficulty,
            }))
          );
        }

        return lesson;
      })
    );

    const successfulLessons = lessonResults.filter((r) => r.status === "fulfilled").length;

    return NextResponse.json({
      courseId: course.id,
      title: courseData.title,
      repoName: repoData.name,
      modulesGenerated: successfulLessons,
    });
  } catch (error) {
    console.error("Repo analysis error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to analyze repository" },
      { status: 500 }
    );
  }
}
