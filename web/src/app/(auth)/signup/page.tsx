"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { GraduationCap, Eye, EyeOff, Zap, Brain, Mic, BookOpen, Target, Trophy } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (data.user) {
        router.push("/");
        router.refresh();
      } else {
        setError(data.error || "Signup failed");
      }
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Left Side — Visuals */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[#0a0a0a] border-r-4 border-black">
        <div className="absolute inset-0 halftone opacity-30" />
        <div className="absolute top-20 left-20 w-64 h-64 bg-[#c8ff00] blur-[120px] opacity-20" />
        <div className="absolute bottom-32 right-16 w-48 h-48 bg-[#ff2d6f] blur-[100px] opacity-20" />
        <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-[#00d4ff] blur-[80px] opacity-15" />
        <div className="absolute inset-0 speed-lines opacity-20" />

        <div className="relative z-10 flex flex-col justify-center p-16 w-full">
          <div className="flex items-center gap-4 mb-12">
            <div className="w-16 h-16 bg-[#c8ff00] border-4 border-black flex items-center justify-center">
              <GraduationCap className="h-8 w-8 text-black" />
            </div>
            <div>
              <h1 className="text-5xl font-black uppercase tracking-wider leading-none">
                ML <span className="text-[#c8ff00]">Tutor</span>
              </h1>
              <p className="text-[9px] font-mono uppercase tracking-[0.2em] text-muted-foreground mt-1">
                AI-Powered Learning Platform
              </p>
            </div>
          </div>

          <div className="space-y-4 mb-12">
            {[
              { icon: BookOpen, text: "Interactive lessons on ML concepts", color: "#c8ff00" },
              { icon: Brain, text: "AI quizzes that test real understanding", color: "#ff2d6f" },
              { icon: Mic, text: "Mock interviews with AI scoring", color: "#a855f7" },
              { icon: Zap, text: "Analyze any GitHub repo instantly", color: "#00d4ff" },
              { icon: Target, text: "Spaced repetition flashcards", color: "#facc15" },
              { icon: Trophy, text: "XP and level progression system", color: "#22c55e" },
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-4 group">
                <div
                  className="w-10 h-10 border-3 border-black flex items-center justify-center shrink-0 group-hover:translate-x-[-2px] group-hover:translate-y-[-2px] group-hover:shadow-[4px_4px_0px_0px] transition-all"
                  style={{ background: f.color }}
                >
                  <f.icon className="h-5 w-5 text-black" />
                </div>
                <span className="text-sm font-bold text-white/80">{f.text}</span>
              </div>
            ))}
          </div>

          <div className="border-2 border-white/10 bg-white/5 p-4 flex items-center justify-between">
            <div className="text-center px-4">
              <p className="text-2xl font-black text-[#c8ff00]">6</p>
              <p className="text-[9px] font-mono uppercase tracking-widest text-muted-foreground">ML Topics</p>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div className="text-center px-4">
              <p className="text-2xl font-black text-[#ff2d6f]">AI</p>
              <p className="text-[9px] font-mono uppercase tracking-widest text-muted-foreground">Powered</p>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div className="text-center px-4">
              <p className="text-2xl font-black text-[#facc15]">∞</p>
              <p className="text-[9px] font-mono uppercase tracking-widest text-muted-foreground">Practice</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side — Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-[#0f0f0f]">
        <div className="w-full max-w-md space-y-8">
          <div className="lg:hidden text-center">
            <div className="w-16 h-16 bg-[#c8ff00] border-4 border-black mx-auto flex items-center justify-center mb-4">
              <GraduationCap className="h-8 w-8 text-black" />
            </div>
            <h1 className="text-4xl font-black uppercase tracking-wider">
              ML <span className="text-[#c8ff00]">Tutor</span>
            </h1>
          </div>

          <div className="lg:hidden">
            <h2 className="text-2xl font-black uppercase tracking-wider">Create Account</h2>
            <p className="text-muted-foreground mt-1 font-mono text-xs uppercase tracking-widest">
              Start your ML learning journey
            </p>
          </div>

          <div className="hidden lg:block">
            <h2 className="text-3xl font-black uppercase tracking-wider">Sign Up</h2>
            <p className="text-muted-foreground mt-2 font-mono text-xs uppercase tracking-widest">
              Create your account — it&apos;s free
            </p>
          </div>

          <form onSubmit={handleSubmit} className="comic-panel bg-[#141414] p-8 space-y-5">
            {error && (
              <div className="border-2 border-[#ef4444] bg-[#ef4444]/10 p-3 text-sm text-[#ef4444] font-mono">
                {error}
              </div>
            )}

            <div>
              <label className="text-[9px] font-mono uppercase tracking-[0.2em] text-muted-foreground block mb-2">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-transparent border-2 border-white/10 px-4 py-3 font-mono text-sm placeholder:text-muted-foreground focus:border-[#c8ff00] focus:outline-none transition-colors"
                placeholder="Your name"
              />
            </div>

            <div>
              <label className="text-[9px] font-mono uppercase tracking-[0.2em] text-muted-foreground block mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-transparent border-2 border-white/10 px-4 py-3 font-mono text-sm placeholder:text-muted-foreground focus:border-[#c8ff00] focus:outline-none transition-colors"
                placeholder="you@email.com"
              />
            </div>

            <div>
              <label className="text-[9px] font-mono uppercase tracking-[0.2em] text-muted-foreground block mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full bg-transparent border-2 border-white/10 px-4 py-3 pr-12 font-mono text-sm placeholder:text-muted-foreground focus:border-[#c8ff00] focus:outline-none transition-colors"
                  placeholder="min 6 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#c8ff00] text-black py-3 font-black uppercase tracking-wider border-3 border-black hover:translate-x-[-3px] hover:translate-y-[-3px] hover:shadow-[6px_6px_0px_0px] hover:shadow-[#c8ff00] transition-all disabled:opacity-50"
            >
              {loading ? (
                <div className="animate-spin h-4 w-4 border-2 border-black border-t-transparent rounded-full mx-auto" />
              ) : (
                "Create Account"
              )}
            </button>

            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="text-[#c8ff00] font-bold hover:underline">
                Sign In
              </Link>
            </p>
          </form>

          <div className="flex justify-center gap-2 mt-8">
            <div className="w-3 h-3 bg-[#c8ff00] border-2 border-black" />
            <div className="w-3 h-3 bg-[#ff2d6f] border-2 border-black" />
            <div className="w-3 h-3 bg-[#00d4ff] border-2 border-black" />
            <div className="w-3 h-3 bg-[#facc15] border-2 border-black" />
            <div className="w-3 h-3 bg-[#a855f7] border-2 border-black" />
          </div>
        </div>
      </div>
    </>
  );
}
