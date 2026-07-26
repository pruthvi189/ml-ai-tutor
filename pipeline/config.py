from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    gemini_api_key: str
    groq_api_key: str | None = None
    model_primary: str = "gemini-2.5-flash"
    model_fallback: str = "groq/llama-3.3-70b"
    output_dir: str = "output"
    max_retries: int = 3
    rate_limit_delay: float = 6.0

    model_config = {"env_file": ".env"}
