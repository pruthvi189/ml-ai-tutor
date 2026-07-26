import json
import re

from pipeline.llm.client import LLMClient
from pipeline.models.schemas import Course, CourseModule


SYSTEM_PROMPT = """You are an expert ML/AI educator creating structured courses.
Generate a course outline as JSON matching this schema:
{
    "title": "Course Title",
    "description": "Brief description",
    "modules": [
        {
            "title": "Module Title",
            "description": "What this module covers",
            "order": 1,
            "learning_objectives": ["objective1", "objective2"]
        }
    ]
}
Focus on building understanding, not memorization.
Order modules from fundamentals to advanced.
Each module should be completable in 15-30 minutes."""


class CourseGenerator:
    def __init__(self, llm: LLMClient):
        self.llm = llm

    def generate_from_topic(self, topic: dict) -> Course:
        prompt = f"""Create a structured course for: {topic['title']}

Description: {topic['description']}

Suggested subtopics to cover:
{json.dumps(topic['subtopics'], indent=2)}

Generate a course outline with 5-8 modules."""

        response = self.llm.generate(prompt, system=SYSTEM_PROMPT)
        data = self._parse_json(response)

        modules = [
            CourseModule(
                title=m["title"],
                description=m["description"],
                order=m["order"],
            )
            for m in data["modules"]
        ]

        return Course(
            title=data["title"],
            description=data["description"],
            source=f"topic:{topic['title']}",
            modules=modules,
            total_estimated_hours=len(modules) * 0.5,
        )

    def generate_from_repo(self, repo_content: str, repo_url: str) -> Course:
        prompt = f"""Analyze this repository and create a structured course
to help someone understand how it works.

Repository: {repo_url}

Repository content (summarized):
{repo_content[:50000]}

Create a course outline with 4-8 modules covering:
1. Architecture overview
2. Core components
3. Data flow
4. Key patterns and design decisions
5. How to contribute/extend"""

        response = self.llm.generate(prompt, system=SYSTEM_PROMPT)
        data = self._parse_json(response)

        modules = [
            CourseModule(
                title=m["title"],
                description=m["description"],
                order=m["order"],
            )
            for m in data["modules"]
        ]

        return Course(
            title=data["title"],
            description=data["description"],
            source=f"repo:{repo_url}",
            modules=modules,
            total_estimated_hours=len(modules) * 0.5,
        )

    def _parse_json(self, text: str) -> dict:
        json_match = re.search(r"```json?\s*\n(.*?)\n```", text, re.DOTALL)
        if json_match:
            return json.loads(json_match.group(1))
        return json.loads(text)
