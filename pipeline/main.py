import json
import os
import time

from pipeline.config import Settings
from pipeline.generation.course import CourseGenerator
from pipeline.generation.exercise import ExerciseGenerator
from pipeline.generation.lesson import LessonGenerator
from pipeline.generation.quiz import QuizGenerator
from pipeline.ingestion.repo import RepoIngestor
from pipeline.ingestion.topic import TopicIngestor
from pipeline.llm.client import LLMClient


def run_pipeline(source_type: str, source_value: str):
    """Run the full pipeline: source -> course -> lessons -> quizzes -> exercises."""
    settings = Settings()
    llm = LLMClient()

    print(f"\n{'=' * 60}")
    print("ML AI Tutor - Pipeline Validation")
    print(f"{'=' * 60}\n")

    # Step 1: Ingest source
    print("[1/5] Ingesting source...")
    if source_type == "repo":
        ingestor = RepoIngestor()
        source_data = ingestor.pack_remote(source_value)
        print(
            f"  Packed {source_data['total_files']} files, "
            f"{source_data['total_tokens']} tokens"
        )
    elif source_type == "topic":
        ingestor = TopicIngestor()
        source_data = ingestor.get_topic(source_value)
        print(f"  Topic: {source_data['title']}")
    else:
        raise ValueError(f"Unknown source type: {source_type}")

    # Step 2: Generate course structure
    print("\n[2/5] Generating course structure...")
    course_gen = CourseGenerator(llm)
    if source_type == "repo":
        course = course_gen.generate_from_repo(
            source_data["content"], source_value
        )
    else:
        course = course_gen.generate_from_topic(source_data)
    print(f"  Course: {course.title}")
    print(f"  Modules: {len(course.modules)}")

    # Step 3: Generate lessons for each module
    print("\n[3/5] Generating lessons...")
    lesson_gen = LessonGenerator(llm)
    lessons = []
    for i, module in enumerate(course.modules):
        print(f"  Module {i + 1}/{len(course.modules)}: {module.title}")
        lesson = lesson_gen.generate(
            module.title,
            module.description,
            module.learning_objectives if hasattr(module, "learning_objectives") else [],
        )
        lessons.append(lesson)

    # Step 4: Generate quizzes
    print("\n[4/5] Generating quizzes...")
    quiz_gen = QuizGenerator(llm)
    quizzes = []
    for i, lesson in enumerate(lessons):
        print(f"  Quiz {i + 1}/{len(lessons)}: {lesson.title}")
        quiz = quiz_gen.generate(lesson.content)
        quizzes.append(quiz)

    # Step 5: Generate exercises
    print("\n[5/5] Generating exercises...")
    exercise_gen = ExerciseGenerator(llm)
    exercises = []
    for i, lesson in enumerate(lessons):
        print(f"  Exercises {i + 1}/{len(lessons)}: {lesson.title}")
        ex = exercise_gen.generate(lesson.content)
        exercises.append(ex)

    # Save output
    output_dir = settings.output_dir
    os.makedirs(output_dir, exist_ok=True)

    output = {
        "course": course.model_dump(),
        "lessons": [l.model_dump() for l in lessons],
        "quizzes": [[q.model_dump() for q in quiz] for quiz in quizzes],
        "exercises": [[e.model_dump() for e in ex] for ex in exercises],
    }

    safe_name = source_value.replace("https://github.com/", "").replace("/", "_")
    output_file = os.path.join(output_dir, f"{source_type}_{safe_name}.json")
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(output, f, indent=2)

    print(f"\n{'=' * 60}")
    print("Pipeline complete!")
    print(f"Output saved to: {output_file}")
    print(f"{'=' * 60}")


if __name__ == "__main__":
    import sys

    if len(sys.argv) < 3:
        print("Usage: python -m pipeline.main <repo|topic> <value>")
        print("Examples:")
        print("  python -m pipeline.main topic rag")
        print(
            "  python -m pipeline.main repo https://github.com/langchain-ai/langchain"
        )
        sys.exit(1)

    run_pipeline(sys.argv[1], sys.argv[2])
