"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { GraduationCap, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
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
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.user) {
        router.push("/");
        router.refresh();
      } else {
        setError(data.error || "Login failed");
      }
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-8 p-8">
      <div className="text-center">
        <div className="w-16 h-16 bg-[#c8ff00] border-4 border-black mx-auto flex items-center justify-center mb-4">
          <GraduationCap className="h-8 w-8 text-black" />
        </div>
        <h1 className="text-4xl font-black uppercase tracking-wider">
          ML <span className="text-[#c8ff00]">Tutor</span>
        </h1>
        <p className="text-muted-foreground mt-2 font-mono text-xs uppercase tracking-widest">
          Sign in to continue learning
        </p>
      </div>

      <form onSubmit={handleSubmit} className="comic-panel bg-[#141414] p-8 space-y-6">
        {error && (
          <div className="border-2 border-[#ef4444] bg-[#ef4444]/10 p-3 text-sm text-[#ef4444] font-mono">
            {error}
          </div>
        )}

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
            "Sign In"
          )}
        </button>

        <p className="text-center text-sm text-muted-foreground">
          No account?{" "}
          <Link href="/signup" className="text-[#c8ff00] font-bold hover:underline">
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
}
