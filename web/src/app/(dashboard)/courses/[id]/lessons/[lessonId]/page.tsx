"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { DashboardShell } from "@/components/dashboard-shell";
import { LessonContent } from "@/components/lesson-content";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen, Brain } from "lucide-react";

interface Lesson {
  id: number;
  courseId: number;
  title: string;
  content: string;
  keyConcepts: string;
  durationMinutes: number;
}

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = Number(params.id);
  const lessonId = Number(params.lessonId);

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/courses/${courseId}/lessons/${lessonId}`)
      .then((res) => res.json())
      .then((data) => {
        setLesson(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [courseId, lessonId]);

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
          <h1 className="text-4xl font-black uppercase tracking-wider mb-4">
            Lesson Not Found
          </h1>
          <Link href="/courses">
            <Button variant="outline" className="border-2 border-white/20">
              Back to Courses
            </Button>
          </Link>
        </div>
      </DashboardShell>
    );
  }

  const concepts = JSON.parse(lesson.keyConcepts || "[]");

  return (
    <DashboardShell>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Back link */}
        <Link
          href={`/courses/${courseId}`}
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-muted-foreground hover:text-white transition-colors"
        >
          <ArrowLeft className="h-3 w-3" />
          Back to Course
        </Link>

        {/* Lesson Header */}
        <div className="border-2 border-white/10 bg-white/5 backdrop-blur-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="h-5 w-5 text-[#c8ff00]" />
            <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
              Lesson
            </span>
          </div>
          <h1 className="text-3xl font-black uppercase tracking-wider">
            {lesson.title}
          </h1>
          <div className="flex flex-wrap gap-2 mt-4">
            {concepts.map((concept: string) => (
              <span
                key={concept}
                className="text-[10px] font-mono uppercase tracking-widest px-2 py-1 border border-white/10 text-muted-foreground"
              >
                {concept}
              </span>
            ))}
          </div>
        </div>

        {/* Lesson Content */}
        <div className="border-2 border-white/10 bg-white/5 backdrop-blur-xl p-6 md:p-10">
          <LessonContent content={lesson.content} />
        </div>

        {/* Quiz CTA */}
        <div className="border-2 border-[#c8ff00]/30 bg-[#c8ff00]/5 backdrop-blur-xl p-6 text-center">
          <Brain className="h-10 w-10 mx-auto mb-4 text-[#c8ff00]" />
          <h2 className="text-xl font-bold uppercase tracking-wider mb-2">
            Test Your Understanding
          </h2>
          <p className="text-muted-foreground text-sm mb-4">
            Take a 7-question quiz to check your comprehension
          </p>
          <Link href={`/courses/${courseId}/lessons/${lessonId}/quiz`}>
            <Button className="bg-[#c8ff00] text-black hover:bg-[#c8ff00]/80 font-bold uppercase tracking-wider border-2 border-[#c8ff00] hover:shadow-[4px_4px_0px_0px] hover:shadow-[#c8ff00]/30">
              <Brain className="mr-2 h-4 w-4" />
              Start Quiz
            </Button>
          </Link>
        </div>
      </div>
    </DashboardShell>
  );
}
