"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardShell } from "@/components/dashboard-shell";
import { Button } from "@/components/ui/button";
import { GitBranch, Zap, Loader2 } from "lucide-react";

const GITHUB_URL_RE = /^https?:\/\/(www\.)?github\.com\/[a-zA-Z0-9._-]+\/[a-zA-Z0-9._-]+(\/)?$/;

export default function ReposPage() {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState("");

  const handleAnalyze = async () => {
    if (!GITHUB_URL_RE.test(url.trim())) {
      setError("Enter a valid GitHub repo URL: https://github.com/owner/repo");
      return;
    }
    setAnalyzing(true);
    setError("");
    try {
      const res = await fetch("/api/repos/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repoUrl: url.trim() }),
      });
      const data = await res.json();
      if (data.courseId) {
        router.push(`/repos/${data.courseId}`);
      } else {
        setError(data.error || "Failed to analyze repo");
      }
    } catch {
      setError("Network error — try again");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <DashboardShell>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-wider">
            Repository Analysis
          </h1>
          <p className="text-muted-foreground mt-2 font-mono text-sm uppercase tracking-widest">
            Paste a GitHub URL — AI creates interactive lessons
          </p>
        </div>

        <div className="border-2 border-white/10 bg-white/5 backdrop-blur-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <GitBranch className="h-5 w-5 text-[#ff2d6f]" />
            <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
              GitHub Repository
            </span>
          </div>
          <div className="flex gap-3">
            <input
              type="url"
              placeholder="https://github.com/user/repo"
              value={url}
              onChange={(e) => { setUrl(e.target.value); setError(""); }}
              onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
              className="flex-1 bg-transparent border-2 border-white/10 px-4 py-3 font-mono text-sm placeholder:text-muted-foreground focus:border-[#ff2d6f] focus:outline-none transition-colors"
            />
            <Button
              onClick={handleAnalyze}
              disabled={analyzing || !url}
              className="bg-[#ff2d6f] text-white hover:bg-[#ff2d6f]/80 font-bold uppercase tracking-wider border-2 border-[#ff2d6f] hover:shadow-[4px_4px_0px_0px] hover:shadow-[#ff2d6f]/30 disabled:opacity-50"
            >
              {analyzing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Zap className="mr-2 h-4 w-4" />
                  Analyze
                </>
              )}
            </Button>
          </div>
          {error && (
            <p className="text-[#ef4444] text-sm mt-2 font-mono">{error}</p>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { step: "01", title: "Paste URL", desc: "Any public GitHub repo" },
            { step: "02", title: "AI Analyzes", desc: "Architecture, patterns, code" },
            { step: "03", title: "Learn & Quiz", desc: "Interactive lessons + tests" },
          ].map((item) => (
            <div
              key={item.step}
              className="border-2 border-white/10 bg-white/5 backdrop-blur-xl p-6"
            >
              <span className="text-3xl font-black text-[#ff2d6f]">
                {item.step}
              </span>
              <h3 className="font-bold uppercase tracking-wider mt-2">
                {item.title}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}
