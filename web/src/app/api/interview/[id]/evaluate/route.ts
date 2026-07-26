import { NextRequest, NextResponse } from "next/server";
import { generateContent, parseJSON, sanitizeForPrompt } from "@/lib/llm";
import { EVALUATE_SYSTEM_PROMPT } from "@/lib/interview-prompts";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { questions, answers, topic } = await request.json();

    if (!Array.isArray(questions) || !Array.isArray(answers) || !topic) {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const prompt = `Evaluate these interview answers for the topic: ${sanitizeForPrompt(topic)}

Questions and Answers:
${questions.map((q: any, i: number) => `
Q${i + 1} (${q.category}): ${q.question}
A: ${sanitizeForPrompt(answers[i] || "No answer")}
Ideal points: ${q.ideal_points.join(", ")}
`).join("\n")}

Score each answer on accuracy (1-5), depth (1-5), clarity (1-5).
Be strict but fair.`;

    const response = await generateContent(prompt, EVALUATE_SYSTEM_PROMPT);
    const evaluations = parseJSON<Array<{
      question_index: number;
      accuracy: number;
      depth: number;
      clarity: number;
      overall: number;
      feedback: string;
      missing_points: string[];
    }>>(response);

    const avgScore = evaluations.reduce((sum, e) => sum + e.overall, 0) / evaluations.length;
    const passed = avgScore >= 3.5;

    return NextResponse.json({
      evaluations,
      avgScore: Math.round(avgScore * 10) / 10,
      passed,
      verdict: passed
        ? "PASSED — You demonstrated strong understanding"
        : "NEEDS REVIEW — Some areas need deeper study",
    });
  } catch (error) {
    console.error("Interview evaluate error:", error);
    return NextResponse.json({ error: "Failed to evaluate" }, { status: 500 });
  }
}
