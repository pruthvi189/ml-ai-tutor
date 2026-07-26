import { DashboardShell } from "@/components/dashboard-shell";
import { StatCard } from "@/components/stat-card";
import { BookOpen, GitBranch, Trophy, Target, Zap, Mic } from "lucide-react";
import Link from "next/link";
import { db } from "@/lib/db";
import { courses, lessons, quizAttempts, userProgress } from "@/lib/schema";
import { eq, count } from "drizzle-orm";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

async function getStats(userId: number) {
  try {
    const progress = await db.select().from(userProgress).where(eq(userProgress.userId, userId)).limit(1);
    const xp = progress[0]?.totalXp ?? 0;
    const level = progress[0]?.level ?? 1;

    const courseCount = await db.select({ value: count() }).from(courses);
    const lessonCount = await db.select({ value: count() }).from(lessons).where(eq(lessons.completed, true));
    const quizCount = await db.select({ value: count() }).from(quizAttempts).where(eq(quizAttempts.correct, true));

    return {
      courses: courseCount[0]?.value ?? 0,
      lessons: lessonCount[0]?.value ?? 0,
      quizzes: quizCount[0]?.value ?? 0,
      xp,
      level,
    };
  } catch {
    return { courses: 0, lessons: 0, quizzes: 0, xp: 0, level: 1 };
  }
}

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const stats = await getStats(session.userId);
  const masteryPct = stats.lessons > 0 ? Math.min(100, Math.round((stats.quizzes / Math.max(stats.lessons, 1)) * 100)) : 0;

  return (
    <DashboardShell>
      <div className="space-y-8">
        <div className="relative comic-panel bg-[#141414] p-8 md:p-12 overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#c8ff00] opacity-5 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#ff2d6f] opacity-5 blur-3xl" />
          <div className="relative z-10">
            <h1 className="text-6xl md:text-8xl font-black uppercase tracking-wider leading-none">
              ML
              <br />
              <span className="text-[#c8ff00]">Tutor</span>
            </h1>
            <p className="text-muted-foreground mt-4 max-w-lg font-mono text-sm uppercase tracking-widest">
              AI-powered learning for machine learning concepts and GitHub
              repositories. Built for interview readiness.
            </p>
            <div className="flex gap-3 mt-6">
              <Link href="/courses">
                <button className="bg-[#c8ff00] text-black px-6 py-3 font-black uppercase tracking-wider border-3 border-black hover:translate-x-[-3px] hover:translate-y-[-3px] hover:shadow-[6px_6px_0px_0px] hover:shadow-[#c8ff00] transition-all">
                  <Zap className="inline mr-2 h-4 w-4" />
                  Start Learning
                </button>
              </Link>
              <Link href="/repos">
                <button className="bg-[#ff2d6f] text-white px-6 py-3 font-black uppercase tracking-wider border-3 border-black hover:translate-x-[-3px] hover:translate-y-[-3px] hover:shadow-[6px_6px_0px_0px] hover:shadow-[#ff2d6f] transition-all">
                  <GitBranch className="inline mr-2 h-4 w-4" />
                  Analyze Repo
                </button>
              </Link>
              <Link href="/interview">
                <button className="bg-[#a855f7] text-white px-6 py-3 font-black uppercase tracking-wider border-3 border-black hover:translate-x-[-3px] hover:translate-y-[-3px] hover:shadow-[6px_6px_0px_0px] hover:shadow-[#a855f7] transition-all">
                  <Mic className="inline mr-2 h-4 w-4" />
                  Interview
                </button>
              </Link>
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Courses" value={String(stats.courses)} description="Start your first course" icon={BookOpen} color="#c8ff00" />
          <StatCard title="Repos" value={String(stats.courses)} description="Analyze a GitHub repo" icon={GitBranch} color="#ff2d6f" />
          <StatCard title="XP" value={String(stats.xp)} description={`Level ${stats.level}`} icon={Trophy} color="#facc15" />
          <StatCard title="Mastery" value={`${masteryPct}%`} description="Pass to master topics" icon={Target} color="#a855f7" />
        </div>

        <div>
          <h2 className="text-xl font-black uppercase tracking-wider mb-4 flex items-center gap-3">
            <span className="text-[#c8ff00]">//</span> Quick Start
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { title: "RAG", desc: "Retrieval-Augmented Generation", href: "/courses/rag", color: "#c8ff00" },
              { title: "Transformers", desc: "Attention & architecture", href: "/courses/transformers", color: "#00d4ff" },
              { title: "LangChain", desc: "LLM framework fundamentals", href: "/courses/langchain", color: "#ff2d6f" },
            ].map((topic) => (
              <Link key={topic.title} href={topic.href}>
                <div
                  className="comic-panel bg-[#141414] p-5 comic-hover cursor-pointer h-full halftone"
                  style={{ borderColor: topic.color, boxShadow: `4px 4px 0px 0px ${topic.color}` }}
                >
                  <div className="w-3 h-3 mb-3" style={{ background: topic.color }} />
                  <h3 className="font-black uppercase tracking-wider text-lg">{topic.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{topic.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
