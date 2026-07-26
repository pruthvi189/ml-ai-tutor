import json
import re

from pipeline.llm.client import LLMClient
from pipeline.models.schemas import QuizQuestion


SYSTEM_PROMPT = """You are creating quiz questions to test understanding
of ML concepts. Generate multiple-choice questions that test deep
understanding, not just recall.

Rules:
- 4 options per question (A, B, C, D)
- Only one correct answer
- Distractors should be plausible misconceptions
- Include explanation for correct answer
- Mix difficulty: 2 easy, 3 medium, 2 hard per quiz

Output as JSON array:
[
    {
        "question": "Question text?",
        "options": ["A. ...", "B. ...", "C. ...", "D. ..."],
        "correct_index": 0,
        "explanation": "Why this is correct...",
        "difficulty": "easy|medium|hard"
    }
]"""


class QuizGenerator:
    def __init__(self, llm: LLMClient):
        self.llm = llm

    def generate(
        self, lesson_content: str, num_questions: int = 7
    ) -> list[QuizQuestion]:
        prompt = f"""Generate {num_questions} quiz questions based on this lesson:

{lesson_content[:20000]}

Test understanding, not memorization.
Include questions that require applying concepts to new scenarios."""

        response = self.llm.generate(prompt, system=SYSTEM_PROMPT)
        data = self._parse_json(response)
        return [QuizQuestion(**q) for q in data]

    def _parse_json(self, text: str) -> list:
        json_match = re.search(r"```json?\s*\n(.*?)\n```", text, re.DOTALL)
        if json_match:
            return json.loads(json_match.group(1))
        return json.loads(text)
