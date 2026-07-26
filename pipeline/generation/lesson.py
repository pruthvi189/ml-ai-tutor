from pipeline.llm.client import LLMClient
from pipeline.models.schemas import Lesson


SYSTEM_PROMPT = """You are an expert ML tutor creating lesson content.
Write clear, engaging lessons that build understanding step by step.

Format lessons in Markdown with:
- Clear section headings
- Code examples with explanations
- Analogies and real-world examples
- Key takeaways at the end

Target audience: CS student preparing for ML interviews.
Tone: Clear, conversational, not overly academic.
Length: 10-15 minute read (800-1200 words)."""


class LessonGenerator:
    def __init__(self, llm: LLMClient):
        self.llm = llm

    def generate(
        self,
        module_title: str,
        module_description: str,
        learning_objectives: list[str],
    ) -> Lesson:
        prompt = f"""Create a detailed lesson for this module:

Module: {module_title}
Description: {module_description}
Learning Objectives: {', '.join(learning_objectives)}

Include:
1. Introduction (why this matters)
2. Core concepts with explanations
3. Code examples (Python, using common ML libraries)
4. Common misconceptions
5. Key takeaways
6. Interview tips for this topic"""

        response = self.llm.generate(prompt, system=SYSTEM_PROMPT)

        code_examples = self._extract_code_blocks(response)

        return Lesson(
            title=module_title,
            content=response,
            key_concepts=learning_objectives,
            code_examples=code_examples,
            duration_minutes=12,
        )

    def _extract_code_blocks(self, markdown: str) -> list[str]:
        import re

        return re.findall(r"```python\n(.*?)```", markdown, re.DOTALL)
