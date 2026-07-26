import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { flashcards, lessons } from "@/lib/schema";
import { eq, and } from "drizzle-orm";
import { getSession } from "@/lib/auth";
import { generateContent, parseJSON, sanitizeForPrompt } from "@/lib/llm";

const FLASHCARD_PROMPT = `Generate 8-10 flashcards from this lesson content.
Each flashcard should test a key concept.

Output ONLY a JSON array:
[
    {
        "front": "Question or concept to recall",
        "back": "Concise answer or explanation"
    }
]

Rules:
- Front should be a clear question or prompt
- Back should be 1-2 sentences max
- Mix difficulty levels
- Focus on concepts, not syntax`;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; lessonId: string }> }
) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { lessonId } = await params;
    const lid = Number(lessonId);

    // Get existing flashcards
    const existing = await db
      .select()
      .from(flashcards)
      .where(and(eq(flashcards.lessonId, lid), eq(flashcards.userId, session.userId)));

    if (existing.length > 0) {
      return NextResponse.json({ cards: existing });
    }

    // Fetch lesson content
    const [lesson] = await db.select().from(lessons).where(eq(lessons.id, lid)).limit(1);
    if (!lesson) return NextResponse.json({ error: "Lesson not found" }, { status: 404 });

    // Generate flashcards via LLM
    const response = await generateContent(
      `Lesson: ${lesson.title}\n\nContent:\n${sanitizeForPrompt(lesson.content).slice(0, 15000)}`,
      FLASHCARD_PROMPT
    );
    const parsed = parseJSON<Array<{ front: string; back: string }>>(response);

    // Save to DB
    const now = new Date();
    const values = parsed.map((card) => ({
      lessonId: lid,
      userId: session.userId,
      front: card.front,
      back: card.back,
      box: 0,
      nextReview: now,
    }));

    const saved = await db.insert(flashcards).values(values).returning();

    return NextResponse.json({ cards: saved });
  } catch (error) {
    console.error("Flashcards error:", error);
    return NextResponse.json({ error: "Failed to load flashcards" }, { status: 500 });
  }
}
