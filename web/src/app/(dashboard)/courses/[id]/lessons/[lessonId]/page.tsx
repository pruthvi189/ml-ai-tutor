"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { DashboardShell } from "@/components/dashboard-shell";
import { LessonContent } from "@/components/lesson-content";
import { FlashcardDeck } from "@/components/flashcard";
import { WarmupQuiz } from "@/components/warmup-quiz";
import { ChatWidget } from "@/components/chat-widget";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen, Brain, Zap, Layers, MessageSquare } from "lucide-react";

interface Lesson {
  id: number;
  courseId: number;
  title: string;
  content: string;
  keyConcepts: string;
  durationMinutes: number;
}

interface Flashcard {
  id: number;
  front: string;
  back: string;
  box: number;
}

interface WarmupQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

type Phase = "warmup" | "lesson" | "flashcards";

const PHASES = [
  { key: "warmup" as Phase, label: "Warm-Up", icon: Zap, color: "#facc15" },
  { key: "lesson" as Phase, label: "Lesson", icon: BookOpen, color: "#c8ff00" },
  { key: "flashcards" as Phase, label: "Flashcards", icon: Layers, color: "#00d4ff" },
];

export default function LessonPage() {
  const params = useParams();
  const courseId = Number(params.id);
  const lessonId = Number(params.lessonId);

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [phase, setPhase] = useState<Phase>("warmup");

  // Warmup
  const [warmupQuestions, setWarmupQuestions] = useState<WarmupQuestion[]>([]);
  const [warmupLoading, setWarmupLoading] = useState(false);
  const [warmupDone, setWarmupDone] = useState(false);

  // Flashcards
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [flashcardsLoading, setFlashcardsLoading] = useState(false);

  useEffect(() => {
    fetch(`/api/courses/${courseId}/lessons/${lessonId}`)
      .then((res) => res.json())
      .then((data) => {
        setLesson(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [courseId, lessonId]);

  // Load warmup when entering warmup phase
  useEffect(() => {
    if (phase === "warmup" && warmupQuestions.length === 0 && lesson) {
      setWarmupLoading(true);
      fetch(`/api/courses/${courseId}/lessons/${lessonId}/warmup`)
        .then((r) => r.json())
        .then((data) => {
          setWarmupQuestions(data.questions || []);
          setWarmupLoading(false);
        })
        .catch(() => setWarmupLoading(false));
    }
  }, [phase, lesson, courseId, lessonId, warmupQuestions.length]);

  // Load flashcards when entering flashcards phase
  useEffect(() => {
    if (phase === "flashcards" && flashcards.length === 0 && lesson) {
      setFlashcardsLoading(true);
      fetch(`/api/courses/${courseId}/lessons/${lessonId}/flashcards`)
        .then((r) => r.json())
        .then((data) => {
          setFlashcards(data.cards || []);
          setFlashcardsLoading(false);
        })
        .catch(() => setFlashcardsLoading(false));
    }
  }, [phase, lesson, courseId, lessonId, flashcards.length]);

  if (loading) {
    return (
      <DashboardShell>
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin h-8 w-8 border-2 border-[#c8ff00] border-t-transparent rounded-full" />
        </div>
      </DashboardShell>
    );
  }

  if (!lesson) {
    return (
      <DashboardShell>
        <div className="text-center py-20">
          <h1 className="text-4xl font-black uppercase tracking-wider mb-4">Lesson Not Found</h1>
          <Link href="/courses"><Button variant="outline" className="border-2 border-white/20">Back to Courses</Button></Link>
        </div>
      </DashboardShell>
    );
  }

  const concepts = JSON.parse(lesson.keyConcepts || "[]");

  return (
    <DashboardShell>
      <div className="max-w-4xl mx-auto space-y-6">
        <Link
          href={`/courses/${courseId}`}
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-muted-foreground hover:text-white transition-colors"
        >
          <ArrowLeft className="h-3 w-3" />
          Back to Course
        </Link>

        {/* Lesson Header */}
        <div className="border-2 border-white/10 bg-white/5 backdrop-blur-xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <BookOpen className="h-5 w-5 text-[#c8ff00]" />
            <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Lesson</span>
          </div>
          <h1 className="text-3xl font-black uppercase tracking-wider">{lesson.title}</h1>
          <div className="flex flex-wrap gap-2 mt-4">
            {concepts.map((c: string) => (
              <span key={c} className="text-[10px] font-mono uppercase tracking-widest px-2 py-1 border border-white/10 text-muted-foreground">{c}</span>
            ))}
          </div>
        </div>

        {/* Phase Tabs */}
        <div className="flex gap-2">
          {PHASES.map((p) => {
            const active = phase === p.key;
            const done = (p.key === "warmup" && warmupDone) || (p.key === "lesson" && phase === "flashcards") || (p.key === "flashcards" && phase === "flashcards");
            return (
              <button
                key={p.key}
                onClick={() => setPhase(p.key)}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider border-2 transition-all ${
                  active
                    ? `border-current bg-current/10`
                    : done
                    ? "border-[#22c55e]/50 text-[#22c55e]"
                    : "border-white/10 text-muted-foreground hover:border-white/30"
                }`}
                style={active ? { color: p.color, borderColor: p.color } : undefined}
              >
                <p.icon className="h-3 w-3" />
                {p.label}
              </button>
            );
          })}
          <Link href={`/courses/${courseId}/lessons/${lessonId}/quiz`} className="ml-auto">
            <Button className="bg-[#c8ff00] text-black hover:bg-[#c8ff00]/80 font-bold uppercase tracking-wider border-2 border-[#c8ff00] text-xs">
              <Brain className="mr-2 h-3 w-3" />
              Full Quiz
            </Button>
          </Link>
        </div>

        {/* Phase Content */}
        {phase === "warmup" && (
          <div className="space-y-4">
            {warmupLoading ? (
              <div className="comic-panel bg-[#141414] p-12 text-center">
                <div className="animate-spin h-8 w-8 border-2 border-[#facc15] border-t-transparent rounded-full mx-auto mb-4" />
                <p className="text-muted-foreground font-mono text-sm">Generating warm-up questions...</p>
              </div>
            ) : warmupQuestions.length > 0 ? (
              <WarmupQuiz questions={warmupQuestions} onComplete={() => setWarmupDone(true)} />
            ) : (
              <div className="comic-panel bg-[#141414] p-8 text-center">
                <p className="text-muted-foreground text-sm">No warm-up available. Jump to the lesson!</p>
                <Button onClick={() => setPhase("lesson")} className="mt-4 bg-[#c8ff00] text-black font-bold uppercase tracking-wider border-2 border-[#c8ff00]">
                  Start Lesson
                </Button>
              </div>
            )}
            {!warmupLoading && (
              <Button onClick={() => setPhase("lesson")} variant="outline" className="border-2 border-white/20 w-full">
                Skip to Lesson <ArrowLeft className="ml-2 h-3 w-3 rotate-180" />
              </Button>
            )}
          </div>
        )}

        {phase === "lesson" && (
          <div className="border-2 border-white/10 bg-white/5 backdrop-blur-xl p-6 md:p-10">
            <LessonContent content={lesson.content} />
          </div>
        )}

        {phase === "flashcards" && (
          <div className="space-y-4">
            {flashcardsLoading ? (
              <div className="comic-panel bg-[#141414] p-12 text-center">
                <div className="animate-spin h-8 w-8 border-2 border-[#00d4ff] border-t-transparent rounded-full mx-auto mb-4" />
                <p className="text-muted-foreground font-mono text-sm">Generating flashcards...</p>
              </div>
            ) : (
              <FlashcardDeck cards={flashcards} />
            )}
          </div>
        )}
      </div>

      {/* Chat Widget */}
      <ChatWidget lessonId={lessonId} courseId={courseId} />
    </DashboardShell>
  );
}
