"use client"

import * as React from "react"
import { useState } from "react"

interface AppInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  icon?: React.ReactNode
}

const AppInput = React.forwardRef<HTMLInputElement, AppInputProps>(
  ({ label, icon, className = "", ...props }, ref) => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
    const [isHovering, setIsHovering] = useState(false)

    const handleMouseMove = (e: React.MouseEvent) => {
      const rect = e.currentTarget.getBoundingClientRect()
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })
    }

    return (
      <div className="w-full min-w-[200px] relative">
        {label && (
          <label className="block mb-2 text-sm font-bold text-white/80">
            {label}
          </label>
        )}
        <div className="relative w-full">
          <input
            ref={ref}
            className="peer relative z-10 border-2 border-white/10 h-13 w-full bg-[#161616] px-4 text-sm font-mono text-white outline-none drop-shadow-sm transition-all duration-200 ease-in-out focus:bg-[#0f0f0f] focus:border-[#c8ff00] placeholder:text-white/30 placeholder:font-normal"
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            {...props}
          />
          {isHovering && (
            <>
              <div
                className="absolute pointer-events-none top-0 left-0 right-0 h-[2px] z-20 overflow-hidden"
                style={{
                  background: `radial-gradient(30px circle at ${mousePosition.x}px 0px, #c8ff00 0%, transparent 70%)`,
                }}
              />
              <div
                className="absolute pointer-events-none bottom-0 left-0 right-0 h-[2px] z-20 overflow-hidden"
                style={{
                  background: `radial-gradient(30px circle at ${mousePosition.x}px 2px, #c8ff00 0%, transparent 70%)`,
                }}
              />
            </>
          )}
          {icon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 z-20 text-white/40">
              {icon}
            </div>
          )}
        </div>
      </div>
    )
  }
)

AppInput.displayName = "AppInput"

export { AppInput }
