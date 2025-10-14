"use client"

import type React from "react"

interface LanyardProps {
  className?: string
  children?: React.ReactNode
}

/**
 * CSS-only decorative wrapper that replaces the 3D lanyard.
 * Accepts children and className so existing usage on videos/use-cases pages continues to work.
 */
export default function Lanyard({ className = "", children }: LanyardProps) {
  return (
    <div
      className={`relative rounded-2xl ring-1 ring-white/10 bg-white/5 overflow-hidden ${className}`}
      aria-hidden={false}
    >
      {/* subtle top highlight */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-24 h-48 opacity-20"
        style={{
          background: "radial-gradient(120px 40px at 50% 100%, rgba(255,255,255,0.35), rgba(255,255,255,0))",
        }}
      />
      {/* content */}
      {children}
    </div>
  )
}
