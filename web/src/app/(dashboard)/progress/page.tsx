"use client";

import { useEffect, useState } from "react";
import { DashboardShell } from "@/components/dashboard-shell";
import { Trophy, BookOpen, Brain, Target, Zap, TrendingUp, Star } from "lucide-react";

interface Progress {
  xp: number;
  level: number;
  xpInLevel: number;
  xpToNext: number;
  totalCourses: number;
  totalLessons: number;
  completedLessons: number;
  passedQuizzes: number;
}

const EMPTY: Progress = {
  xp: 0,
  level: 1,
  xpInLevel: 0,
  xpToNext: 500,
  totalCourses: 0,
  totalLessons: 0,
  completedLessons: 0,
  passedQuizzes: 0,
};

export default function ProgressPage() {
  const [progress, setProgress] = useState<Progress>(EMPTY);

  useEffect(() => {
    fetch("/api/progress")
      .then((r) => r.json())
      .then((data) => {
        if (data && typeof data.xp === "number") {
          setProgress(data);
        }
      })
      .catch(() => {});
  }, []);

  const xpPercent = progress.xpToNext > 0 ? (progress.xpInLevel / progress.xpToNext) * 100 : 0;

  return (
    <DashboardShell>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-wider flex items-center gap-3">
            <span className="text-[#facc15]">//</span> Progress
          </h1>
          <p className="text-muted-foreground mt-2 font-mono text-sm uppercase tracking-widest">
            Your learning journey
          </p>
        </div>

        <div className="comic-panel-lime bg-[#c8ff00]/5 p-8 halftone relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 border-4 border-[#c8ff00] bg-black flex items-center justify-center">
                  <span className="text-4xl font-black text-[#c8ff00]">{progress.level}</span>
                </div>
                <div>
                  <h2 className="text-3xl font-black uppercase tracking-wider">Level {progress.level}</h2>
                  <p className="text-muted-foreground font-mono text-sm">{progress.xp} XP total</p>
                </div>
              </div>
              <TrendingUp className="h-10 w-10 text-[#c8ff00]" />
            </div>
            <div className="w-full h-6 bg-black border-3 border-[#333]">
              <div
                className="h-full bg-[#c8ff00] transition-all duration-500"
                style={{ width: `${xpPercent}%` }}
              />
            </div>
            <p className="text-[9px] font-mono uppercase tracking-[0.2em] text-muted-foreground mt-2">
              {progress.xpInLevel} / {progress.xpToNext} XP to Level {progress.level + 1}
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: BookOpen, label: "Courses", value: progress.totalCourses, color: "#c8ff00" },
            { icon: Brain, label: "Lessons", value: progress.completedLessons, color: "#ff2d6f" },
            { icon: Target, label: "Quizzes", value: progress.passedQuizzes, color: "#00d4ff" },
            { icon: Zap, label: "Total XP", value: progress.xp, color: "#facc15" },
          ].map((stat) => (
            <div key={stat.label} className="comic-panel bg-[#141414] p-5">
              <div className="flex items-center justify-between mb-3">
                <stat.icon className="h-5 w-5" style={{ color: stat.color }} />
              </div>
              <p className="text-4xl font-black" style={{ color: stat.color }}>{stat.value}</p>
              <p className="text-[9px] font-mono uppercase tracking-[0.2em] text-muted-foreground mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="comic-panel bg-[#141414] p-6 halftone">
          <h2 className="text-lg font-black uppercase tracking-wider mb-4 flex items-center gap-2">
            <Star className="h-5 w-5 text-[#facc15]" />
            XP Sources
          </h2>
          <div className="space-y-3">
            {[
              { action: "Complete a lesson", xp: "+25 XP", color: "#c8ff00" },
              { action: "Pass a quiz", xp: "+50 XP", color: "#ff2d6f" },
              { action: "Perfect quiz score", xp: "+100 XP", color: "#a855f7" },
              { action: "Analyze a repository", xp: "+75 XP", color: "#00d4ff" },
              { action: "Pass interview", xp: "+150 XP", color: "#facc15" },
            ].map((item) => (
              <div key={item.action} className="flex items-center justify-between py-3 border-b-2 border-[#333] last:border-0">
                <span className="text-sm font-bold">{item.action}</span>
                <span className="font-mono text-sm font-black" style={{ color: item.color }}>{item.xp}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
