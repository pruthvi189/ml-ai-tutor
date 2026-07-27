"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

const LINES = [
  "$ connecting to ml-tutor-server...",
  "ERROR: connection timed out",
  "$ retrying... (attempt 3/3)",
  "FATAL: service_unavailable",
  "$ initiating diagnostics...",
  "CHECK: database.............. OK",
  "CHECK: auth_service.......... OK",
  "CHECK: this_page............ MISSING",
  "$ reason: page does not exist or is under maintenance",
  "$ suggested_action: return_home",
]

const GLITCH_CHARS = "!@#$%^&*()_+-=[]{}|;:',.<>?/~`"

export default function NotFound() {
  const [displayedLines, setDisplayedLines] = useState<string[]>([])
  const [currentLine, setCurrentLine] = useState(0)
  const [currentChar, setCurrentChar] = useState(0)
  const [cursorVisible, setCursorVisible] = useState(true)
  const [glitchActive, setGlitchActive] = useState(false)

  // Cursor blink
  useEffect(() => {
    const interval = setInterval(() => setCursorVisible((v) => !v), 530)
    return () => clearInterval(interval)
  }, [])

  // Random glitch flicker
  useEffect(() => {
    const glitch = () => {
      setGlitchActive(true)
      setTimeout(() => setGlitchActive(false), 150)
    }
    const interval = setInterval(glitch, 3000 + Math.random() * 4000)
    return () => clearInterval(interval)
  }, [])

  // Typewriter effect
  useEffect(() => {
    if (currentLine >= LINES.length) return

    const line = LINES[currentLine]
    if (currentChar < line.length) {
      const speed = line.startsWith("ERROR") || line.startsWith("FATAL") ? 30 : 20
      const timeout = setTimeout(() => {
        setDisplayedLines((prev) => {
          const updated = [...prev]
          updated[currentLine] = line.substring(0, currentChar + 1)
          return updated
        })
        setCurrentChar(currentChar + 1)
      }, speed)
      return () => clearTimeout(timeout)
    } else {
      const timeout = setTimeout(() => {
        setCurrentLine(currentLine + 1)
        setCurrentChar(0)
        setDisplayedLines((prev) => [...prev, ""])
      }, 300)
      return () => clearTimeout(timeout)
    }
  }, [currentLine, currentChar])

  return (
    <div className="w-full h-screen bg-[#0a0a0a] flex flex-col items-center justify-center overflow-hidden relative font-mono">
      {/* Scanlines */}
      <div className="absolute inset-0 pointer-events-none z-10 opacity-[0.03]"
        style={{
          background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)",
        }}
      />

      {/* Glitch overlay */}
      {glitchActive && (
        <div className="absolute inset-0 pointer-events-none z-20">
          <div className="absolute inset-0 bg-[#c8ff00]/5 mix-blend-screen" />
          <div
            className="absolute w-full h-[3px] bg-[#ff2d6f]/30"
            style={{ top: `${Math.random() * 100}%` }}
          />
          <div
            className="absolute w-full h-[2px] bg-[#00d4ff]/30"
            style={{ top: `${Math.random() * 100}%` }}
          />
        </div>
      )}

      {/* Background 404 */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <h1
          className={`text-[20vw] font-black text-white/[0.03] leading-none select-none transition-all duration-75 ${
            glitchActive ? "translate-x-1 text-[#ff2d6f]/10" : ""
          }`}
          style={{
            textShadow: glitchActive ? "3px 0 #c8ff00, -3px 0 #00d4ff" : "none",
          }}
        >
          404
        </h1>
      </div>

      {/* Terminal window */}
      <div className="relative z-10 w-[90%] max-w-2xl">
        {/* Terminal header */}
        <div className="flex items-center gap-2 px-4 py-3 bg-[#1a1a1a] border-b border-white/10">
          <div className="w-3 h-3 rounded-full bg-[#ff2d6f]" />
          <div className="w-3 h-3 rounded-full bg-[#facc15]" />
          <div className="w-3 h-3 rounded-full bg-[#c8ff00]" />
          <span className="ml-3 text-[10px] text-white/30 uppercase tracking-widest">
            ml-tutor — terminal
          </span>
        </div>

        {/* Terminal body */}
        <div className="bg-[#111111] border border-white/10 border-t-0 p-6 min-h-[300px] max-h-[400px] overflow-y-auto">
          {displayedLines.map((line, i) => {
            const isError = line.startsWith("ERROR") || line.startsWith("FATAL")
            const isCheck = line.startsWith("CHECK")
            const isOk = line.includes("... OK")
            const isMissing = line.includes("MISSING")

            return (
              <div key={i} className="mb-1 flex items-start gap-2">
                <span className="text-[#c8ff00]/50 select-none shrink-0">
                  {i === currentLine - 1 && i === displayedLines.length - 1 ? ">" : " "}
                </span>
                <span
                  className={`text-sm leading-relaxed ${
                    isError
                      ? "text-[#ff2d6f] font-bold"
                      : isMissing
                      ? "text-[#facc15] font-bold"
                      : isOk
                      ? "text-[#c8ff00]"
                      : isCheck && !isOk
                      ? "text-[#ff2d6f]"
                      : "text-white/60"
                  }`}
                >
                  {line}
                  {i === currentLine && currentLine < LINES.length && (
                    <span
                      className={`inline-block w-2 h-4 ml-0.5 align-middle ${
                        cursorVisible ? "bg-[#c8ff00]" : "bg-transparent"
                      }`}
                    />
                  )}
                </span>
              </div>
            )
          })}

          {/* Final cursor */}
          {currentLine >= LINES.length && (
            <div className="mt-4 flex items-center gap-2">
              <span className="text-[#c8ff00]/50">❯</span>
              <span
                className={`inline-block w-2 h-4 ${
                  cursorVisible ? "bg-[#c8ff00]" : "bg-transparent"
                }`}
              />
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 mt-6 justify-center">
          <Link
            href="/"
            className="group relative inline-flex items-center gap-2 px-6 py-3 bg-[#c8ff00] text-black font-bold uppercase tracking-wider text-sm border-3 border-black hover:translate-x-[-3px] hover:translate-y-[-3px] hover:shadow-[6px_6px_0px_0px_#c8ff00] transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square" strokeLinejoin="miter">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to Home
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-6 py-3 bg-transparent text-white/60 font-bold uppercase tracking-wider text-sm border-2 border-white/10 hover:border-[#00d4ff] hover:text-[#00d4ff] transition-all"
          >
            Try Login
          </Link>
        </div>
      </div>

      {/* Bottom branding */}
      <div className="absolute bottom-6 left-0 right-0 text-center z-10">
        <p className="text-[9px] font-mono uppercase tracking-[0.3em] text-white/15">
          ML Tutor — Error 404 — Page Not Found
        </p>
      </div>
    </div>
  )
}
