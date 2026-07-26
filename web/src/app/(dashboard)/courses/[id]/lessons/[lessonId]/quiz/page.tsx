"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { DashboardShell } from "@/components/dashboard-shell";
import { QuizCard } from "@/components/quiz-card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Trophy, CheckCircle, XCircle, RotateCcw } from "lucide-react";

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty: string;
}

interface QuizResult {
  quizId: number;
  correct: boolean;
  correctIndex: number;
  explanation: string;
  question: string;
  options: string[];
}

export default function QuizPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = Number(params.id);
  const lessonId = Number(params.lessonId);

  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState<{
    score: number;
    correct: number;
    total: number;
    passed: boolean;
    results: QuizResult[];
  } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch(`/api/courses/${courseId}/lessons/${lessonId}`)
      .then((res) => res.json())
      .then((data) => {
        setQuestions(data.quizzes || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [courseId, lessonId]);

  const handleSelect = (questionId: number, optionIndex: number) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const answerArray = Object.entries(answers).map(([quizId, selectedIndex]) => ({
        quizId: Number(quizId),
        selectedIndex,
      }));

      const res = await fetch(`/api/courses/${courseId}/quiz/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId, answers: answerArray }),
      });

      const data = await res.json();
      setResults(data);
      setSubmitted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetry = () => {
    setAnswers({});
    setSubmitted(false);
    setResults(null);
  };

  if (loading) {
    return (
      <DashboardShell>
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin h-8 w-8 border-2 border-[#c8ff00] border-t-transparent rounded-full" />
        </div>
      </DashboardShell>
    );
  }

  if (questions.length === 0) {
    return (
      <DashboardShell>
        <div className="text-center py-20">
          <h1 className="text-4xl font-black uppercase tracking-wider mb-4">
            No Questions Available
          </h1>
          <Link href={`/courses/${courseId}/lessons/${lessonId}`}>
            <Button variant="outline" className="border-2 border-white/20">
              Back to Lesson
            </Button>
          </Link>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Back link */}
        <Link
          href={`/courses/${courseId}/lessons/${lessonId}`}
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-muted-foreground hover:text-white transition-colors"
        >
          <ArrowLeft className="h-3 w-3" />
          Back to Lesson
        </Link>

        {/* Results Screen */}
        {submitted && results ? (
          <div className="space-y-6">
            {/* Score Card */}
            <div
              className={`border-2 p-8 text-center backdrop-blur-xl ${
                results.passed
                  ? "border-[#22c55e]/50 bg-[#22c55e]/5"
                  : "border-[#ef4444]/50 bg-[#ef4444]/5"
              }`}
            >
              {results.passed ? (
                <Trophy className="h-16 w-16 mx-auto mb-4 text-[#22c55e]" />
              ) : (
                <XCircle className="h-16 w-16 mx-auto mb-4 text-[#ef4444]" />
              )}
              <h1 className="text-5xl font-black uppercase tracking-wider mb-2">
                {results.score}%
              </h1>
              <p className="text-lg font-mono uppercase tracking-widest text-muted-foreground">
                {results.correct}/{results.total} correct
              </p>
              <p
                className={`mt-4 text-sm font-mono uppercase tracking-widest ${
                  results.passed ? "text-[#22c55e]" : "text-[#ef4444]"
                }`}
              >
                {results.passed ? "PASSED — Well done!" : "FAILED — Review and try again"}
              </p>
            </div>

            {/* Review */}
            <h2 className="text-xl font-bold uppercase tracking-wider">
              Review Answers
            </h2>
            {results.results.map((r, i) => (
              <QuizCard
                key={r.quizId}
                question={{
                  id: r.quizId,
                  question: r.question,
                  options: r.options,
                  correctIndex: r.correctIndex,
                  explanation: r.explanation,
                  difficulty: "medium",
                }}
                index={i}
                selectedAnswer={
                  answers[r.quizId] ?? null
                }
                showResult={true}
                onSelect={() => {}}
              />
            ))}

            {/* Retry */}
            <div className="flex gap-4">
              <Button
                onClick={handleRetry}
                variant="outline"
                className="border-2 border-white/20"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Retry Quiz
              </Button>
              <Link href={`/courses/${courseId}`}>
                <Button className="bg-[#c8ff00] text-black hover:bg-[#c8ff00]/80 font-bold uppercase tracking-wider border-2 border-[#c8ff00]">
                  Back to Course
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Quiz Header */}
            <div className="border-2 border-white/10 bg-white/5 backdrop-blur-xl p-6">
              <h1 className="text-3xl font-black uppercase tracking-wider">
                Quiz
              </h1>
              <p className="text-muted-foreground mt-2 font-mono text-sm">
                {questions.length} questions — Answer all to submit
              </p>
              <div className="flex gap-2 mt-4">
                {Object.keys(answers).length === questions.length ? (
                  <span className="text-[10px] font-mono uppercase tracking-widest px-2 py-1 border border-[#22c55e] text-[#22c55e]">
                    All answered
                  </span>
                ) : (
                  <span className="text-[10px] font-mono uppercase tracking-widest px-2 py-1 border border-white/10 text-muted-foreground">
                    {Object.keys(answers).length}/{questions.length} answered
                  </span>
                )}
              </div>
            </div>

            {/* Questions */}
            {questions.map((q, i) => (
              <QuizCard
                key={q.id}
                question={q}
                index={i}
                selectedAnswer={answers[q.id] ?? null}
                showResult={false}
                onSelect={(idx) => handleSelect(q.id, idx)}
              />
            ))}

            {/* Submit */}
            <div className="sticky bottom-4 z-10">
              <Button
                onClick={handleSubmit}
                disabled={
                  Object.keys(answers).length !== questions.length || submitting
                }
                className="w-full bg-[#c8ff00] text-black hover:bg-[#c8ff00]/80 font-bold uppercase tracking-wider border-2 border-[#c8ff00] hover:shadow-[4px_4px_0px_0px] hover:shadow-[#c8ff00]/30 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <div className="animate-spin h-4 w-4 border-2 border-black border-t-transparent rounded-full" />
                ) : (
                  <>
                    <Trophy className="mr-2 h-4 w-4" />
                    Submit Quiz
                  </>
                )}
              </Button>
            </div>
          </>
        )}
      </div>
    </DashboardShell>
  );
}
