import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { courses, lessons, quizzes } from "@/lib/schema";
import { generateContent, parseJSON, sanitizeForPrompt } from "@/lib/llm";
import { COURSE_SYSTEM_PROMPT, LESSON_SYSTEM_PROMPT, QUIZ_SYSTEM_PROMPT } from "@/lib/prompts";
import { getTopicById } from "@/lib/topics";

interface CourseModule {
  title: string;
  description: string;
  order: number;
  learning_objectives: string[];
}

export async function POST(request: NextRequest) {
  try {
    const { topicId } = await request.json();

    const topic = getTopicById(topicId);
    if (!topic) {
      return NextResponse.json({ error: "Topic not found" }, { status: 404 });
    }

    const coursePrompt = `Create a structured course for: ${topic.title}

Description: ${topic.description}

Suggested subtopics to cover:
${JSON.stringify(topic.subtopics, null, 2)}

Generate a course outline with 5-8 modules.`;

    const courseResponse = await generateContent(coursePrompt, COURSE_SYSTEM_PROMPT);
    const courseData = parseJSON<{ title: string; description: string; modules: CourseModule[] }>(courseResponse);

    const [course] = await db
      .insert(courses)
      .values({
        title: courseData.title,
        description: courseData.description,
        source: `topic:${topicId}`,
        totalModules: courseData.modules.length,
      })
      .returning();

    // Parallelize lesson + quiz generation
    const results = await Promise.allSettled(
      courseData.modules.map(async (mod) => {
        const lessonPrompt = `Create a detailed lesson for this module:

Module: ${mod.title}
Description: ${mod.description}
Learning Objectives: ${mod.learning_objectives.join(", ")}

Include:
1. Introduction (why this matters)
2. Core concepts with explanations
3. Code examples (Python, using common ML libraries)
4. Common misconceptions
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
            durationMinutes: 12,
          })
          .returning();

        const quizPrompt = `Generate 7 quiz questions based on this lesson:

${sanitizeForPrompt(lessonContent).slice(0, 20000)}

Test understanding, not memorization.
Include questions that require applying concepts to new scenarios.`;

        const quizResponse = await generateContent(quizPrompt, QUIZ_SYSTEM_PROMPT);
        const quizData = parseJSON<Array<{
          question: string;
          options: string[];
          correct_index: number;
          explanation: string;
          difficulty: string;
        }>>(quizResponse);

        for (const q of quizData) {
          await db.insert(quizzes).values({
            lessonId: lesson.id,
            question: q.question,
            options: JSON.stringify(q.options),
            correctIndex: q.correct_index,
            explanation: q.explanation,
            difficulty: q.difficulty,
          });
        }

        return lesson;
      })
    );

    const successful = results.filter((r) => r.status === "fulfilled").length;

    return NextResponse.json({
      courseId: course.id,
      title: courseData.title,
      modulesGenerated: successful,
    });
  } catch (error) {
    console.error("Course generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate course" },
      { status: 500 }
    );
  }
}
