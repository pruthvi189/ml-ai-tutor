"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { DashboardShell } from "@/components/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getTopicById } from "@/lib/topics";
import { ArrowLeft, ArrowRight, Send, Mic, Brain, Target, CheckCircle, XCircle, Trophy, Zap } from "lucide-react";

interface InterviewQuestion {
  question: string;
  category: string;
  ideal_points: string[];
}

interface Evaluation {
  question_index: number;
  accuracy: number;
  depth: number;
  clarity: number;
  overall: number;
  feedback: string;
  missing_points: string[];
}

export default function InterviewSessionPage() {
  const params = useParams();
  const router = useRouter();
  const topicId = params.id as string;
  const topic = getTopicById(topicId);

  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [answers, setAnswers] = useState<string[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [phase, setPhase] = useState<"loading" | "intro" | "interview" | "evaluating" | "results">("intro");
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [avgScore, setAvgScore] = useState(0);
  const [passed, setPassed] = useState(false);
  const [verdict, setVerdict] = useState("");

  const startInterview = async () => {
    setPhase("loading");
    try {
      const res = await fetch("/api/interview/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: topic?.title || topicId }),
      });
      const data = await res.json();
      setQuestions(data.questions);
      setAnswers(new Array(data.questions.length).fill(""));
      setPhase("interview");
    } catch {
      setPhase("intro");
    }
  };

  const handleAnswer = (text: string) => {
    const newAnswers = [...answers];
    newAnswers[currentQ] = text;
    setAnswers(newAnswers);
  };

  const nextQuestion = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      evaluateAnswers();
    }
  };

  const prevQuestion = () => {
    if (currentQ > 0) setCurrentQ(currentQ - 1);
  };

  const evaluateAnswers = async () => {
    setPhase("evaluating");
    try {
      const res = await fetch(`/api/interview/${topicId}/evaluate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questions, answers, topic: topic?.title }),
      });
      const data = await res.json();
      setEvaluations(data.evaluations);
      setAvgScore(data.avgScore);
      setPassed(data.passed);
      setVerdict(data.verdict);
      setPhase("results");
    } catch {
      setPhase("results");
    }
  };

  if (!topic) {
    return (
      <DashboardShell>
        <div className="text-center py-20">
          <h1 className="text-4xl font-black uppercase tracking-wider mb-4">Topic Not Found</h1>
          <Link href="/interview"><Button variant="outline" className="border-2 border-white/20">Back</Button></Link>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <div className="max-w-3xl mx-auto space-y-8">
        <Link href="/interview" className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-muted-foreground hover:text-white transition-colors">
          <ArrowLeft className="h-3 w-3" /> Back to Interview
        </Link>

        {/* Intro */}
        {phase === "intro" && (
          <div className="border-2 border-[#a855f7] bg-[#a855f7]/5 backdrop-blur-xl p-8 text-center">
            <Mic className="h-16 w-16 mx-auto mb-4 text-[#a855f7]" />
            <h1 className="text-3xl font-black uppercase tracking-wider mb-2">
              Interview: {topic.title}
            </h1>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              6 open-ended questions. Answer honestly — the AI evaluates understanding, not keywords.
            </p>
            <Button onClick={startInterview} className="bg-[#a855f7] text-white hover:bg-[#a855f7]/80 font-bold uppercase tracking-wider border-2 border-[#a855f7] hover:shadow-[4px_4px_0px_0px] hover:shadow-[#a855f7]/30">
              <Zap className="mr-2 h-4 w-4" /> Start Interview
            </Button>
          </div>
        )}

        {/* Loading */}
        {phase === "loading" && (
          <div className="border-2 border-white/10 bg-white/5 p-12 text-center">
            <div className="animate-spin h-12 w-12 border-4 border-[#a855f7] border-t-transparent rounded-full mx-auto mb-4" />
            <p className="font-mono uppercase tracking-widest text-muted-foreground">Generating questions...</p>
          </div>
        )}

        {/* Interview */}
        {phase === "interview" && questions.length > 0 && (
          <>
            {/* Progress */}
            <div className="flex items-center gap-2">
              {questions.map((_, i) => (
                <div key={i} className={`h-2 flex-1 transition-all ${i <= currentQ ? "bg-[#a855f7]" : "bg-white/10"}`} />
              ))}
            </div>

            {/* Question */}
            <Card className="border-2 border-[#a855f7]/50 bg-white/5 backdrop-blur-xl">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
                    Q{currentQ + 1}/{questions.length}
                  </span>
                  <span className="text-[9px] font-mono uppercase tracking-widest px-2 py-0.5 border border-[#a855f7] text-[#a855f7]">
                    {questions[currentQ].category}
                  </span>
                </div>
                <h2 className="text-xl font-bold mb-6">{questions[currentQ].question}</h2>
                <textarea
                  value={answers[currentQ]}
                  onChange={(e) => handleAnswer(e.target.value)}
                  placeholder="Type your answer here... Explain in your own words."
                  className="w-full min-h-[200px] bg-transparent border-2 border-white/10 p-4 font-mono text-sm placeholder:text-muted-foreground focus:border-[#a855f7] focus:outline-none resize-none transition-colors"
                />
              </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex justify-between">
              <Button onClick={prevQuestion} disabled={currentQ === 0} variant="outline" className="border-2 border-white/20">
                Previous
              </Button>
              <Button
                onClick={nextQuestion}
                disabled={!answers[currentQ]}
                className="bg-[#a855f7] text-white font-bold uppercase tracking-wider border-2 border-[#a855f7] hover:shadow-[4px_4px_0px_0px] hover:shadow-[#a855f7]/30 disabled:opacity-50"
              >
                {currentQ === questions.length - 1 ? (
                  <><Send className="mr-2 h-4 w-4" /> Submit Interview</>
                ) : (
                  <>Next <ArrowRight className="ml-2 h-4 w-4" /></>
                )}
              </Button>
            </div>
          </>
        )}

        {/* Evaluating */}
        {phase === "evaluating" && (
          <div className="border-2 border-[#a855f7] bg-[#a855f7]/5 p-12 text-center">
            <Brain className="h-16 w-16 mx-auto mb-4 text-[#a855f7] animate-pulse" />
            <p className="text-xl font-bold uppercase tracking-wider">Evaluating your answers...</p>
            <p className="text-muted-foreground text-sm mt-2 font-mono">AI is analyzing accuracy, depth, and clarity</p>
          </div>
        )}

        {/* Results */}
        {phase === "results" && (
          <div className="space-y-6">
            {/* Score Card */}
            <div className={`border-2 p-8 text-center backdrop-blur-xl ${passed ? "border-[#22c55e] bg-[#22c55e]/5" : "border-[#ef4444] bg-[#ef4444]/5"}`}>
              {passed ? (
                <Trophy className="h-16 w-16 mx-auto mb-4 text-[#22c55e]" />
              ) : (
                <XCircle className="h-16 w-16 mx-auto mb-4 text-[#ef4444]" />
              )}
              <h1 className="text-5xl font-black uppercase tracking-wider mb-2">{avgScore}/5</h1>
              <p className="font-mono uppercase tracking-widest text-muted-foreground">{verdict}</p>
            </div>

            {/* Per-question feedback */}
            <h2 className="text-xl font-bold uppercase tracking-wider">Detailed Feedback</h2>
            {evaluations.map((ev, i) => (
              <Card key={i} className="border-2 border-white/10 bg-white/5 backdrop-blur-xl">
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs font-mono text-muted-foreground">Q{i + 1}</span>
                    <div className="flex gap-2">
                      {[
                        { label: "ACC", score: ev.accuracy },
                        { label: "DEP", score: ev.depth },
                        { label: "CLR", score: ev.clarity },
                      ].map((dim) => (
                        <span key={dim.label} className={`text-[9px] font-mono uppercase tracking-widest px-1.5 py-0.5 border ${dim.score >= 4 ? "border-[#22c55e] text-[#22c55e]" : dim.score >= 3 ? "border-[#f97316] text-[#f97316]" : "border-[#ef4444] text-[#ef4444]"}`}>
                          {dim.label}:{dim.score}
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-sm mb-2">{questions[i]?.question}</p>
                  <p className="text-xs text-muted-foreground italic mb-2">Your answer: "{answers[i]?.slice(0, 200)}..."</p>
                  <p className="text-sm text-white/80">{ev.feedback}</p>
                  {ev.missing_points.length > 0 && (
                    <div className="mt-3 p-3 border border-[#f97316]/30 bg-[#f97316]/5">
                      <p className="text-[9px] font-mono uppercase tracking-widest text-[#f97316] mb-1">Points to review:</p>
                      {ev.missing_points.map((p, j) => (
                        <p key={j} className="text-xs text-muted-foreground">• {p}</p>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}

            <div className="flex gap-4">
              <Button onClick={() => { setPhase("intro"); setCurrentQ(0); setQuestions([]); setEvaluations([]); }} variant="outline" className="border-2 border-white/20">
                Retry Interview
              </Button>
              <Link href="/interview">
                <Button className="bg-[#a855f7] text-white font-bold uppercase tracking-wider border-2 border-[#a855f7]">Back to Topics</Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
