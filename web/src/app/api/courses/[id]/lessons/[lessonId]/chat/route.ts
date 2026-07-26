import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { lessons, chatMessages } from "@/lib/schema";
import { eq, and, desc } from "drizzle-orm";
import { getSession } from "@/lib/auth";
import { generateContent, sanitizeForPrompt } from "@/lib/llm";

const CHAT_SYSTEM = `You are an ML tutor helping a student understand a specific lesson.
Be concise, clear, and encouraging. Use analogies when helpful.
If the student is confused, break it down simpler.
Keep responses under 150 words unless they ask for detail.
Reference specific concepts from the lesson when relevant.`;

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; lessonId: string }> }
) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { lessonId } = await params;
    const lid = Number(lessonId);
    const { message, history } = await request.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message required" }, { status: 400 });
    }

    const [lesson] = await db.select().from(lessons).where(eq(lessons.id, lid)).limit(1);
    if (!lesson) return NextResponse.json({ error: "Lesson not found" }, { status: 404 });

    // Save user message
    await db.insert(chatMessages).values({
      lessonId: lid,
      userId: session.userId,
      role: "user",
      content: message.slice(0, 5000),
    });

    // Build context
    const recentHistory = Array.isArray(history) ? history.slice(-6) : [];
    const historyText = recentHistory
      .map((m: { role: string; content: string }) => `${m.role}: ${m.content}`)
      .join("\n");

    const prompt = `Lesson: ${lesson.title}
Key concepts: ${lesson.keyConcepts}

Lesson content (reference):
${sanitizeForPrompt(lesson.content).slice(0, 10000)}

${historyText ? `Recent conversation:\n${historyText}\n` : ""}
Student: ${message}`;

    const reply = await generateContent(prompt, CHAT_SYSTEM);

    // Save assistant message
    await db.insert(chatMessages).values({
      lessonId: lid,
      userId: session.userId,
      role: "assistant",
      content: reply.slice(0, 5000),
    });

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Chat error:", error);
    return NextResponse.json({ error: "Failed to get response" }, { status: 500 });
  }
}
