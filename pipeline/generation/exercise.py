import json
import re

from pipeline.llm.client import LLMClient
from pipeline.models.schemas import CodingExercise


SYSTEM_PROMPT = """You are creating coding exercises to reinforce ML concepts.
Each exercise should:
- Have a clear problem statement
- Include starter code
- Specify expected output
- Provide 2-3 hints
- Be completable in 10-15 minutes

Output as JSON array:
[
    {
        "title": "Exercise title",
        "description": "Problem statement with requirements",
        "starter_code": "def solve():\\n    # Your code here\\n    pass",
        "expected_output": "Expected result",
        "hints": ["Hint 1", "Hint 2"],
        "difficulty": "easy|medium|hard"
    }
]"""


class ExerciseGenerator:
    def __init__(self, llm: LLMClient):
        self.llm = llm

    def generate(
        self, lesson_content: str, num_exercises: int = 3
    ) -> list[CodingExercise]:
        prompt = f"""Create {num_exercises} coding exercises based on this lesson:

{lesson_content[:20000]}

Exercises should reinforce the key concepts.
Include starter code and expected output."""

        response = self.llm.generate(prompt, system=SYSTEM_PROMPT)
        data = self._parse_json(response)
        return [CodingExercise(**e) for e in data]

    def _parse_json(self, text: str) -> list:
        json_match = re.search(r"```json?\s*\n(.*?)\n```", text, re.DOTALL)
        if json_match:
            return json.loads(json_match.group(1))
        return json.loads(text)
