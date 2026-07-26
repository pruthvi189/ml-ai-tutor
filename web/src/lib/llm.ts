const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

interface GroqResponse {
  choices: Array<{ message: { content: string } }>;
}

async function callGroq(prompt: string, system: string): Promise<string> {
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: system },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 8192,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Groq API error: ${res.status} ${err}`);
  }

  const data: GroqResponse = await res.json();
  return data.choices[0]?.message?.content ?? "";
}

async function callGemini(prompt: string, system: string): Promise<string> {
  if (!GEMINI_API_KEY) throw new Error("No Gemini key");

  const { GoogleGenAI } = await import("@google/genai");
  const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    config: {
      systemInstruction: system,
      temperature: 0.7,
      maxOutputTokens: 8192,
    },
    contents: prompt,
  });
  return response.text ?? "";
}

export async function generateContent(
  prompt: string,
  system: string,
  temperature: number = 0.7
): Promise<string> {
  if (GROQ_API_KEY) {
    try {
      return await callGroq(prompt, system);
    } catch (e) {
      console.warn("Groq failed, trying Gemini:", (e as Error).message);
    }
  }

  if (GEMINI_API_KEY) {
    try {
      return await callGemini(prompt, system);
    } catch (e) {
      console.warn("Gemini failed:", (e as Error).message);
    }
  }

  throw new Error("No LLM provider available. Set GROQ_API_KEY or GEMINI_API_KEY in .env");
}

// Sanitize user content before injecting into prompts
export function sanitizeForPrompt(userContent: string): string {
  // Strip potential instruction injection patterns
  return userContent
    .replace(/```[\s\S]*?```/g, "[code block removed]")
    .replace(/system instruction:/gi, "user note:")
    .replace(/ignore previous/gi, "ignore prior")
    .replace(/you are now/gi, "you were previously")
    .slice(0, 10000);
}

export function parseJSON<T = any>(text: string): T {
  try {
    const match = text.match(/```json?\s*\n([\s\S]*?)\n```/);
    const raw = match ? match[1] : text;
    return JSON.parse(raw.trim()) as T;
  } catch {
    throw new Error(
      `Failed to parse LLM response as JSON: ${text.slice(0, 200)}...`
    );
  }
}
