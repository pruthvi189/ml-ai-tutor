import os
import time

from google import genai
from google.genai import types


class LLMClient:
    def __init__(self, model: str = "gemini-2.5-flash"):
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("GEMINI_API_KEY environment variable is required")
        self.client = genai.Client(api_key=api_key)
        self.model = model
        self.last_call_time = 0.0
        self.min_interval = 6.0

    def generate(self, prompt: str, system: str = "", temperature: float = 0.7) -> str:
        elapsed = time.time() - self.last_call_time
        if elapsed < self.min_interval:
            time.sleep(self.min_interval - elapsed)

        response = self.client.models.generate_content(
            model=self.model,
            config=types.GenerateContentConfig(
                system_instruction=system,
                temperature=temperature,
                max_output_tokens=8192,
            ),
            contents=prompt,
        )
        self.last_call_time = time.time()
        return response.text
