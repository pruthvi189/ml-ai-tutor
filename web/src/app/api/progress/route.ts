import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { userProgress, courses, lessons, quizAttempts } from "@/lib/schema";
import { eq, count } from "drizzle-orm";

const XP_VALUES = {
  LESSON_COMPLETE: 25,
  QUIZ_PASS: 50,
  QUIZ_PERFECT: 100,
  REPO_ANALYZE: 75,
  INTERVIEW_PASS: 150,
} as const;

export async function GET() {
  try {
    let progress = await db.select().from(userProgress).limit(1);
    if (progress.length === 0) {
      const [newProgress] = await db.insert(userProgress).values({}).returning();
      progress = [newProgress];
    }

    const totalCourses = await db.select({ value: count() }).from(courses);
    const completedLessons = await db.select({ value: count() }).from(lessons).where(eq(lessons.completed, true));
    const passedQuizzes = await db.select({ value: count() }).from(quizAttempts).where(eq(quizAttempts.correct, true));

    const xp = progress[0].totalXp;
    const level = Math.floor(xp / 500) + 1;
    const xpInLevel = xp % 500;

    return NextResponse.json({
      xp,
      level,
      xpInLevel,
      xpToNext: 500,
      totalCourses: totalCourses[0].value,
      completedLessons: completedLessons[0].value,
      passedQuizzes: passedQuizzes[0].value,
      xpValues: XP_VALUES,
    });
  } catch (error) {
    console.error("Progress fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch progress" }, { status: 500 });
  }
}

// POST now only accepts action types, not raw XP
export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json();

    if (!(action in XP_VALUES)) {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    const xpGain = XP_VALUES[action as keyof typeof XP_VALUES];

    let progress = await db.select().from(userProgress).limit(1);
    if (progress.length === 0) {
      const [newProgress] = await db.insert(userProgress).values({}).returning();
      progress = [newProgress];
    }

    const newTotalXp = progress[0].totalXp + xpGain;
    const newLevel = Math.floor(newTotalXp / 500) + 1;

    await db
      .update(userProgress)
      .set({ totalXp: newTotalXp, level: newLevel, updatedAt: new Date() })
      .where(eq(userProgress.id, progress[0].id));

    return NextResponse.json({ xp: newTotalXp, level: newLevel, gained: xpGain, action });
  } catch (error) {
    console.error("Progress update error:", error);
    return NextResponse.json({ error: "Failed to update progress" }, { status: 500 });
  }
}
