"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Eye, EyeOff } from "lucide-react"
import { AppInput } from "@/components/ui/app-input"
import { ParticleBackground } from "@/components/particle-background"

export default function SignupPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      })
      const data = await res.json()
      if (data.user) {
        router.push("/")
        router.refresh()
      } else {
        setError(data.error || "Signup failed")
      }
    } catch {
      setError("Network error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-screen w-full bg-[#0a0a0a] flex items-center justify-center p-4">
      <div className="card w-[95%] lg:w-[75%] md:w-[60%] flex justify-between h-[600px] max-h-[90vh]">
        {/* Left — Form */}
        <div
          className="w-full lg:w-1/2 px-6 lg:px-14 flex flex-col relative overflow-hidden"
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {/* Mouse-tracking gradient orb */}
          <div
            className={`absolute pointer-events-none w-[500px] h-[500px] rounded-full blur-3xl transition-opacity duration-200 ${
              isHovering ? "opacity-100" : "opacity-0"
            }`}
            style={{
              background: "linear-gradient(135deg, rgba(200,255,0,0.15), rgba(0,212,255,0.1), rgba(168,85,247,0.1))",
              transform: `translate(${mousePosition.x - 250}px, ${mousePosition.y - 250}px)`,
              transition: "transform 0.1s ease-out",
            }}
          />

          <div className="relative z-10 flex flex-col justify-center h-full">
            <form onSubmit={handleSubmit} className="grid gap-2">
              <div className="grid gap-5 mb-2">
                <h1 className="text-3xl md:text-4xl font-black uppercase tracking-wider">
                  Sign Up
                </h1>

                {/* Social icons */}
                <div className="flex items-center justify-center">
                  <ul className="flex gap-3 md:gap-4">
                    {[
                      {
                        href: "/maintenance",
                        icon: (
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2" />
                          </svg>
                        ),
                        gradient: "bg-[#c8ff00]",
                      },
                      {
                        href: "/maintenance",
                        icon: (
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                          </svg>
                        ),
                        gradient: "bg-white",
                      },
                      {
                        href: "/maintenance",
                        icon: (
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                          </svg>
                        ),
                        gradient: "bg-[#00d4ff]",
                      },
                    ].map((social, index) => (
                      <li key={index} className="list-none">
                        <a
                          href={social.href}
                          className="w-[2.5rem] md:w-[3rem] h-[2.5rem] md:h-[3rem] bg-white/5 rounded-full flex justify-center items-center relative z-[1] border-2 border-white/10 overflow-hidden group"
                        >
                          <div
                            className={`absolute inset-0 w-full h-full ${social.gradient} scale-y-0 origin-bottom transition-transform duration-500 ease-in-out group-hover:scale-y-100`}
                          />
                          <span className="text-[1.2rem] text-white/60 transition-all duration-500 ease-in-out z-[2] group-hover:text-black group-hover:rotate-y-[360deg]">
                            {social.icon}
                          </span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <span className="text-sm text-white/40 text-center">or use your email</span>

              {error && (
                <div className="border-2 border-[#ef4444] bg-[#ef4444]/10 p-3 text-sm text-[#ef4444] font-mono">
                  {error}
                </div>
              )}

              <div className="grid gap-4 items-center">
                <AppInput
                  placeholder="Name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <AppInput
                  placeholder="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <div className="relative">
                  <AppInput
                    placeholder="Password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 z-30 text-white/30 hover:text-[#c8ff00] transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex gap-4 justify-center items-center mt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="group/button relative inline-flex justify-center items-center overflow-hidden rounded-md bg-white/10 px-6 py-2 text-sm font-bold text-white transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg hover:shadow-[#c8ff00]/20 cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                  ) : (
                    <span className="text-sm px-2 py-1">Create Account</span>
                  )}
                  <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-13deg)_translateX(-100%)] group-hover/button:duration-1000 group-hover/button:[transform:skew(-13deg)_translateX(100%)]">
                    <div className="relative h-full w-8 bg-[#c8ff00]/20" />
                  </div>
                </button>
              </div>

              <p className="text-center text-sm text-white/40 lg:hidden mt-4">
                Already have an account?{" "}
                <Link href="/login" className="text-[#c8ff00] font-bold hover:underline">
                  Sign In
                </Link>
              </p>
            </form>
          </div>
        </div>

        {/* Right — Particles */}
        <div className="hidden lg:block w-1/2 h-full overflow-hidden relative">
          <ParticleBackground />
          <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-[#0a0a0a] to-transparent z-20 pointer-events-none">
            <p className="text-[9px] font-mono uppercase tracking-[0.3em] text-white/40 mb-2">
              Start Your Journey
            </p>
            <h2 className="text-2xl font-black uppercase tracking-wider text-white/80">
              Learn <span className="text-[#ff2d6f]">AI</span> the Right Way
            </h2>
            <p className="text-sm text-white/40 mt-2">
              Not memorization. Real understanding.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
