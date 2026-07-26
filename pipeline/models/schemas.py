from pydantic import BaseModel


class QuizQuestion(BaseModel):
    question: str
    options: list[str]
    correct_index: int
    explanation: str
    difficulty: str


class CodingExercise(BaseModel):
    title: str
    description: str
    starter_code: str
    expected_output: str
    hints: list[str]
    difficulty: str


class Lesson(BaseModel):
    title: str
    content: str
    key_concepts: list[str]
    code_examples: list[str]
    duration_minutes: int


class CourseModule(BaseModel):
    title: str
    description: str
    order: int
    lessons: list[Lesson] = []
    quiz: list[QuizQuestion] = []
    exercises: list[CodingExercise] = []


class Course(BaseModel):
    title: str
    description: str
    source: str
    modules: list[CourseModule]
    total_estimated_hours: float
