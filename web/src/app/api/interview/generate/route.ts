import { NextRequest, NextResponse } from "next/server";
import { generateContent, parseJSON, sanitizeForPrompt } from "@/lib/llm";
import { INTERVIEW_SYSTEM_PROMPT } from "@/lib/interview-prompts";

export async function POST(request: NextRequest) {
  try {
    const { topic, lessonContent } = await request.json();

    if (!topic || typeof topic !== "string") {
      return NextResponse.json({ error: "topic is required" }, { status: 400 });
    }

    const prompt = `Generate 6 interview questions for a candidate who just studied this topic:

Topic: ${sanitizeForPrompt(topic)}

Key content they studied:
${sanitizeForPrompt(lessonContent || "").slice(0, 15000) || "General ML knowledge"}

Generate questions that test TRUE understanding, not memorization.
Start with foundational, move to applied, end with deep-dive.`;

    const response = await generateContent(prompt, INTERVIEW_SYSTEM_PROMPT);
    const questions = parseJSON<Array<{
      question: string;
      category: string;
      ideal_points: string[];
    }>>(response);

    return NextResponse.json({ questions });
  } catch (error) {
    console.error("Interview generate error:", error);
    return NextResponse.json({ error: "Failed to generate interview" }, { status: 500 });
  }
}
