"use client"

import type React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const linkBase =
  "block rounded-md px-3 py-2 text-sm md:text-base text-white/80 hover:text-white hover:bg-white/[0.06] transition-colors"
const sectionTitle = "px-3 mt-6 mb-2 text-xs tracking-widest text-white/40"

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const pathname = usePathname()
  const active = pathname === href
  return (
    <Link href={href} className={`${linkBase} ${active ? "bg-white/[0.08] text-white" : ""}`}>
      {children}
    </Link>
  )
}

export default function AcademySidebar() {
  return (
    <aside className="w-60 shrink-0 border-r border-white/10 p-4 md:p-6 sticky top-0 h-[100dvh] overflow-visible">
      {/* Brand logo added */}
      <div className="px-3 pb-4">
        <Link href="/academy" className="flex items-center gap-3">
          <img src="/images/lyzr-logo.png" alt="Lyzr logo" className="h-6 w-auto" />
          <span className="text-white text-lg font-semibold">Academy</span>
        </Link>
      </div>

      {/* Home should go to Academy home and appear above Search */}
      <NavLink href="/academy">Home</NavLink>
      <NavLink href="/academy/search">Search</NavLink>

      <div className={sectionTitle}>LEARN • COURSES</div>
      <NavLink href="/academy/courses">Courses</NavLink>
      {/* Corrected spelling */}
      <NavLink href="/academy/courses/prerequisites">Prerequisites</NavLink>
      <NavLink href="/academy/courses/fundamentals">Fundamentals</NavLink>
      <NavLink href="/academy/courses/advanced">Advanced</NavLink>
      <NavLink href="/academy/courses/agent-architect">Agent Architect</NavLink>

      <div className={sectionTitle}>LEARN • USE CASES</div>
      <NavLink href="/academy/use-cases/hr-agents">HR Agents</NavLink>
      {/* Rename label to plural 'Banking Agents' without changing the route */}
      <NavLink href="/academy/use-cases/banking-agent">Banking Agents</NavLink>
      <NavLink href="/academy/use-cases/business-workflows">Business workflows</NavLink>
      <NavLink href="/academy/use-cases/customer-service">Customer Service</NavLink>

      {/* New section below Use Cases */}
      <div className={sectionTitle}>ACADEMY</div>
      <a
        href="https://academy.lyzr.ai/join?invitation_token=02c4cf451fdbb2ec612d8453bbf34383f2f3c03b-3b395c21-126c-42e3-9bda-c6f6c6419bd7"
        target="_blank"
        rel="noopener noreferrer"
        className={linkBase}
      >
        Academy
      </a>

      <div className={sectionTitle}>VIDEOS</div>
      <NavLink href="/academy/videos">All videos</NavLink>

      <div className={sectionTitle}>HELP</div>
      <NavLink href="/academy/support">Support</NavLink>
    </aside>
  )
}
