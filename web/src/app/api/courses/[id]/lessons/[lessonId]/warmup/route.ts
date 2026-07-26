import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { lessons } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { getSession } from "@/lib/auth";
import { generateContent, parseJSON, sanitizeForPrompt } from "@/lib/llm";

const WARMUP_PROMPT = `Generate 5 quick warm-up quiz questions for this lesson.
These test PRIOR knowledge needed for the lesson — foundational concepts.

Output ONLY a JSON array:
[
    {
        "question": "Quick question?",
        "options": ["A. ...", "B. ...", "C. ...", "D. ..."],
        "correctIndex": 0,
        "explanation": "Brief explanation"
    }
]

Rules:
- 4 options each
- Test prerequisites, not the lesson content itself
- Keep questions short and direct
- Mix: 2 easy, 2 medium, 1 hard`;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; lessonId: string }> }
) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { lessonId } = await params;
    const lid = Number(lessonId);

    const [lesson] = await db.select().from(lessons).where(eq(lessons.id, lid)).limit(1);
    if (!lesson) return NextResponse.json({ error: "Lesson not found" }, { status: 404 });

    const response = await generateContent(
      `Lesson: ${lesson.title}\n\nKey concepts covered:\n${lesson.keyConcepts}\n\nLesson content preview:\n${sanitizeForPrompt(lesson.content).slice(0, 8000)}`,
      WARMUP_PROMPT
    );

    const questions = parseJSON(response);
    return NextResponse.json({ questions });
  } catch (error) {
    console.error("Warmup error:", error);
    return NextResponse.json({ error: "Failed to generate warmup" }, { status: 500 });
  }
}
