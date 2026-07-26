import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { lessons } from "@/lib/schema";
import { eq, asc } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: courseId } = await params;

    const courseLessons = await db
      .select()
      .from(lessons)
      .where(eq(lessons.courseId, Number(courseId)))
      .orderBy(asc(lessons.moduleOrder));

    return NextResponse.json(
      courseLessons.map((l) => ({
        ...l,
        keyConcepts: JSON.parse(l.keyConcepts || "[]"),
      }))
    );
  } catch (error) {
    console.error("Lessons fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch lessons" },
      { status: 500 }
    );
  }
}
