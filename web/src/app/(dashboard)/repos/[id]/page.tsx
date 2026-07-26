"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { DashboardShell } from "@/components/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, Clock, CheckCircle, GitBranch } from "lucide-react";

interface Course {
  id: number;
  title: string;
  description: string;
  source: string;
  totalModules: number;
  completedModules: number;
}

interface Lesson {
  id: number;
  title: string;
  moduleOrder: number;
  durationMinutes: number;
  completed: boolean;
}

export default function RepoCoursePage() {
  const params = useParams();
  const courseId = Number(params.id);

  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch course info from lessons
    fetch(`/api/courses/${courseId}/lessons`)
      .then((r) => r.json())
      .then((data) => {
        if (data.length > 0) {
          setLessons(data);
          setCourse({
            id: courseId,
            title: data[0].courseId ? `Repository Course` : "Course",
            description: "",
            source: "",
            totalModules: data.length,
            completedModules: 0,
          });
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [courseId]);

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
      <div className="space-y-8">
        <Link
          href="/repos"
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-muted-foreground hover:text-white transition-colors"
        >
          <ArrowLeft className="h-3 w-3" />
          Back to Repositories
        </Link>

        <div className="border-2 border-white/10 bg-white/5 backdrop-blur-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <GitBranch className="h-5 w-5 text-[#ff2d6f]" />
            <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
              Repository Course
            </span>
          </div>
          <h1 className="text-3xl font-black uppercase tracking-wider">
            {lessons[0]?.title || "Course"}
          </h1>
          <p className="text-muted-foreground mt-2">
            {lessons.length} modules generated from repository analysis
          </p>
        </div>

        <div className="space-y-4">
          {lessons.map((lesson) => (
            <Link key={lesson.id} href={`/repos/${courseId}/lessons/${lesson.id}`}>
              <Card className="group border-2 border-white/10 bg-white/5 backdrop-blur-xl transition-all hover:border-[#ff2d6f]/50 hover:shadow-[6px_6px_0px_0px] hover:shadow-[#ff2d6f]/10 cursor-pointer">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-mono text-muted-foreground">
                      {String(lesson.moduleOrder).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="font-bold uppercase tracking-wider">
                        {lesson.title}
                      </h3>
                      <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground font-mono">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {lesson.durationMinutes} min
                        </span>
                        {lesson.completed && (
                          <span className="flex items-center gap-1 text-[#22c55e]">
                            <CheckCircle className="h-3 w-3" />
                            Done
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-[#ff2d6f] transition-colors" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}
