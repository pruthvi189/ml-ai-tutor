"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { DashboardShell } from "@/components/dashboard-shell";
import { QuizCard } from "@/components/quiz-card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Trophy, XCircle, RotateCcw } from "lucide-react";

export default function RepoQuizPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = Number(params.id);
  const lessonId = Number(params.lessonId);

  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch(`/api/repos/${courseId}/lessons/${lessonId}`)
      .then((r) => r.json())
      .then((d) => { setQuestions(d.quizzes || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [courseId, lessonId]);

  const handleSelect = (qId: number, idx: number) => {
    if (submitted) return;
    setAnswers((p) => ({ ...p, [qId]: idx }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const answerArray = Object.entries(answers).map(([quizId, selectedIndex]) => ({
        quizId: Number(quizId), selectedIndex,
      }));
      const res = await fetch(`/api/repos/${courseId}/quiz/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId, answers: answerArray }),
      });
      const data = await res.json();
      setResults(data);
      setSubmitted(true);
    } catch {} finally { setSubmitting(false); }
  };

  if (loading) {
    return (
      <DashboardShell>
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin h-8 w-8 border-2 border-[#ff2d6f] border-t-transparent rounded-full" />
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <div className="max-w-3xl mx-auto space-y-8">
        <Link
          href={`/repos/${courseId}/lessons/${lessonId}`}
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-muted-foreground hover:text-white transition-colors"
        >
          <ArrowLeft className="h-3 w-3" /> Back to Lesson
        </Link>

        {submitted && results ? (
          <div className="space-y-6">
            <div className={`border-2 p-8 text-center backdrop-blur-xl ${results.passed ? "border-[#22c55e]/50 bg-[#22c55e]/5" : "border-[#ef4444]/50 bg-[#ef4444]/5"}`}>
              {results.passed ? <Trophy className="h-16 w-16 mx-auto mb-4 text-[#22c55e]" /> : <XCircle className="h-16 w-16 mx-auto mb-4 text-[#ef4444]" />}
              <h1 className="text-5xl font-black uppercase tracking-wider mb-2">{results.score}%</h1>
              <p className="text-lg font-mono uppercase tracking-widest text-muted-foreground">{results.correct}/{results.total} correct</p>
            </div>
            {results.results?.map((r: any, i: number) => (
              <QuizCard
                key={r.quizId}
                question={{ id: r.quizId, question: r.question, options: r.options, correctIndex: r.correctIndex, explanation: r.explanation, difficulty: "medium" }}
                index={i}
                selectedAnswer={answers[r.quizId] ?? null}
                showResult={true}
                onSelect={() => {}}
              />
            ))}
            <div className="flex gap-4">
              <Button onClick={() => { setAnswers({}); setSubmitted(false); setResults(null); }} variant="outline" className="border-2 border-white/20">
                <RotateCcw className="mr-2 h-4 w-4" /> Retry
              </Button>
              <Link href={`/repos/${courseId}`}>
                <Button className="bg-[#ff2d6f] text-white font-bold uppercase tracking-wider border-2 border-[#ff2d6f]">Back to Course</Button>
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="border-2 border-white/10 bg-white/5 backdrop-blur-xl p-6">
              <h1 className="text-3xl font-black uppercase tracking-wider">Quiz</h1>
              <p className="text-muted-foreground mt-2 font-mono text-sm">{questions.length} questions</p>
            </div>
            {questions.map((q: any, i: number) => (
              <QuizCard
                key={q.id}
                question={q}
                index={i}
                selectedAnswer={answers[q.id] ?? null}
                showResult={false}
                onSelect={(idx) => handleSelect(q.id, idx)}
              />
            ))}
            <Button
              onClick={handleSubmit}
              disabled={Object.keys(answers).length !== questions.length || submitting}
              className="w-full bg-[#ff2d6f] text-white font-bold uppercase tracking-wider border-2 border-[#ff2d6f] hover:shadow-[4px_4px_0px_0px] hover:shadow-[#ff2d6f]/30 disabled:opacity-50"
            >
              {submitting ? <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" /> : <><Trophy className="mr-2 h-4 w-4" /> Submit Quiz</>}
            </Button>
          </>
        )}
      </div>
    </DashboardShell>
  );
}
