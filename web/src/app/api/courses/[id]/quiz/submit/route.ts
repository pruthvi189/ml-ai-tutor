import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { quizzes, quizAttempts } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { getSession } from "@/lib/auth";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { lessonId, answers } = await request.json();

    if (!Array.isArray(answers) || answers.length === 0) {
      return NextResponse.json({ error: "No answers provided" }, { status: 400 });
    }

    let correctCount = 0;
    const results = [];

    for (const answer of answers) {
      if (!answer.quizId || typeof answer.selectedIndex !== "number") continue;

      const [quiz] = await db
        .select()
        .from(quizzes)
        .where(eq(quizzes.id, answer.quizId))
        .limit(1);

      if (!quiz) continue;

      const isCorrect = quiz.correctIndex === answer.selectedIndex;
      if (isCorrect) correctCount++;

      await db.insert(quizAttempts).values({
        quizId: answer.quizId,
        userId: session.userId,
        selectedIndex: answer.selectedIndex,
        correct: isCorrect,
      });

      results.push({
        quizId: answer.quizId,
        correct: isCorrect,
        correctIndex: quiz.correctIndex,
        explanation: quiz.explanation,
        question: quiz.question,
        options: JSON.parse(quiz.options),
      });
    }

    const score = results.length > 0 ? Math.round((correctCount / results.length) * 100) : 0;

    return NextResponse.json({
      score,
      correct: correctCount,
      total: results.length,
      results,
      passed: score >= 70,
    });
  } catch (error) {
    console.error("Quiz submit error:", error);
    return NextResponse.json({ error: "Failed to submit quiz" }, { status: 500 });
  }
}
