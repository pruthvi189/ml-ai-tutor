import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { lessons, quizzes } from "@/lib/schema";
import { eq, and } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; lessonId: string }> }
) {
  try {
    const { id: courseId, lessonId } = await params;

    const [lesson] = await db
      .select()
      .from(lessons)
      .where(and(eq(lessons.id, Number(lessonId)), eq(lessons.courseId, Number(courseId))))
      .limit(1);

    if (!lesson) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
    }

    const lessonQuizzes = await db
      .select()
      .from(quizzes)
      .where(eq(quizzes.lessonId, lesson.id));

    return NextResponse.json({
      ...lesson,
      quizzes: lessonQuizzes.map((q) => ({
        ...q,
        options: JSON.parse(q.options),
      })),
    });
  } catch (error) {
    console.error("Lesson fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch lesson" },
      { status: 500 }
    );
  }
}
