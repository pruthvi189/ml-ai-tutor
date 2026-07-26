"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { DashboardShell } from "@/components/dashboard-shell";
import { LessonContent } from "@/components/lesson-content";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen, Brain } from "lucide-react";

export default function RepoLessonPage() {
  const params = useParams();
  const courseId = Number(params.id);
  const lessonId = Number(params.lessonId);

  const [lesson, setLesson] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/repos/${courseId}/lessons/${lessonId}`)
      .then((r) => r.json())
      .then((d) => { setLesson(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [courseId, lessonId]);

  if (loading) {
    return (
      <DashboardShell>
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin h-8 w-8 border-2 border-[#ff2d6f] border-t-transparent rounded-full" />
        </div>
      </DashboardShell>
    );
  }

  if (!lesson) {
    return (
      <DashboardShell>
        <div className="text-center py-20">
          <h1 className="text-4xl font-black uppercase tracking-wider mb-4">Not Found</h1>
          <Link href="/repos"><Button variant="outline" className="border-2 border-white/20">Back</Button></Link>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <div className="max-w-4xl mx-auto space-y-8">
        <Link
          href={`/repos/${courseId}`}
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-muted-foreground hover:text-white transition-colors"
        >
          <ArrowLeft className="h-3 w-3" /> Back to Course
        </Link>

        <div className="border-2 border-white/10 bg-white/5 backdrop-blur-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="h-5 w-5 text-[#ff2d6f]" />
            <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Lesson</span>
          </div>
          <h1 className="text-3xl font-black uppercase tracking-wider">{lesson.title}</h1>
        </div>

        <div className="border-2 border-white/10 bg-white/5 backdrop-blur-xl p-6 md:p-10">
          <LessonContent content={lesson.content} />
        </div>

        <div className="border-2 border-[#ff2d6f]/30 bg-[#ff2d6f]/5 backdrop-blur-xl p-6 text-center">
          <Brain className="h-10 w-10 mx-auto mb-4 text-[#ff2d6f]" />
          <h2 className="text-xl font-bold uppercase tracking-wider mb-2">Test Your Understanding</h2>
          <Link href={`/repos/${courseId}/lessons/${lessonId}/quiz`}>
            <Button className="bg-[#ff2d6f] text-white hover:bg-[#ff2d6f]/80 font-bold uppercase tracking-wider border-2 border-[#ff2d6f] hover:shadow-[4px_4px_0px_0px] hover:shadow-[#ff2d6f]/30">
              <Brain className="mr-2 h-4 w-4" /> Start Quiz
            </Button>
          </Link>
        </div>
      </div>
    </DashboardShell>
  );
}
