"""Simple runner for pipeline validation."""
import sys

from pipeline.main import run_pipeline

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python run_pipeline.py <repo|topic> <value>")
        print("\nExamples:")
        print("  python run_pipeline.py topic rag")
        print("  python run_pipeline.py topic langchain")
        print(
            "  python run_pipeline.py repo https://github.com/langchain-ai/langchain"
        )
        sys.exit(1)

    run_pipeline(sys.argv[1], sys.argv[2])
