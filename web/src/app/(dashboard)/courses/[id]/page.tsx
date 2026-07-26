"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { DashboardShell } from "@/components/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getTopicById } from "@/lib/topics";
import { BookOpen, Clock, CheckCircle, ArrowRight, Zap } from "lucide-react";

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

export default function CoursePage() {
  const params = useParams();
  const topicId = params.id as string;

  const topic = getTopicById(topicId);
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);

  const generateCourse = async () => {
    setGenerating(true);
    try {
      const res = await fetch("/api/courses/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topicId }),
      });
      const data = await res.json();
      if (data.courseId) {
        setCourse({
          id: data.courseId,
          title: data.title,
          description: topic?.description || "",
          source: `topic:${topicId}`,
          totalModules: data.modulesGenerated,
          completedModules: 0,
        });
        fetchLessons(data.courseId);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setGenerating(false);
    }
  };

  const fetchLessons = async (courseId: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/courses/${courseId}/lessons`);
      if (res.ok) {
        const data = await res.json();
        setLessons(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!topic) {
    return (
      <DashboardShell>
        <div className="text-center py-20">
          <h1 className="text-4xl font-black uppercase tracking-wider mb-4">
            Topic Not Found
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

  return (
    <DashboardShell>
      <div className="space-y-8">
        <div>
          <Link
            href="/courses"
            className="text-xs font-mono uppercase tracking-widest text-muted-foreground hover:text-white transition-colors"
          >
            ← Back to Learning Paths
          </Link>
          <h1 className="text-4xl font-black uppercase tracking-wider mt-4">
            {topic.title}
          </h1>
          <p className="text-muted-foreground mt-2 max-w-2xl">
            {topic.description}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {topic.subtopics.map((st) => (
            <span
              key={st}
              className="text-[10px] font-mono uppercase tracking-widest px-3 py-1.5 border-2 border-white/10 text-muted-foreground"
            >
              {st}
            </span>
          ))}
        </div>

        {!course ? (
          <div className="border-2 border-white/10 bg-white/5 backdrop-blur-xl p-8 text-center">
            <Zap className="h-12 w-12 mx-auto mb-4 text-[#c8ff00]" />
            <h2 className="text-2xl font-bold uppercase tracking-wider mb-2">
              Ready to Generate
            </h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              AI will create a structured course with {topic.subtopics.length} modules,
              each with lessons and quizzes.
            </p>
            <Button
              onClick={generateCourse}
              disabled={generating}
              className="bg-[#c8ff00] text-black hover:bg-[#c8ff00]/80 font-bold uppercase tracking-wider border-2 border-[#c8ff00] hover:shadow-[4px_4px_0px_0px] hover:shadow-[#c8ff00]/30"
            >
              {generating ? (
                <>
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-black border-t-transparent rounded-full" />
                  Generating Course...
                </>
              ) : (
                <>
                  <Zap className="mr-2 h-4 w-4" />
                  Generate Course
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-xl font-bold uppercase tracking-wider">
              Modules
            </h2>
            {lessons.map((lesson) => (
              <Link
                key={lesson.id}
                href={`/courses/${course.id}/lessons/${lesson.id}`}
              >
                <Card className="group border-2 border-white/10 bg-white/5 backdrop-blur-xl transition-all hover:border-[#c8ff00]/50 hover:shadow-[6px_6px_0px_0px] hover:shadow-[#c8ff00]/10 cursor-pointer">
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
                              Completed
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-[#c8ff00] transition-colors" />
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
