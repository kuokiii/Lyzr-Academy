"use client"

import type React from "react"
import Link from "next/link"
import { useState } from "react"
import { usePathname } from "next/navigation"

export default function AcademyLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const linkCls = (href: string) =>
    `block rounded-md px-3 py-2 hover:bg-white/10 ${pathname === href ? "bg-white/[0.08] text-white" : "text-white"}`

  return (
    <div className="min-h-screen w-full bg-black text-white">
      <div className="mx-auto max-w-[1600px] px-6 md:px-10 lg:px-12 py-6">
        <div className="flex items-center justify-between mb-4">
          <div className="md:hidden">
            <button
              type="button"
              onClick={() => setSidebarOpen((v) => !v)}
              className="rounded-md border border-white/15 bg-white/[0.06] px-3 py-2 text-sm"
              aria-expanded={sidebarOpen}
              aria-controls="academy-mobile-sidebar"
            >
              {sidebarOpen ? "Close sidebar" : "Open sidebar"}
            </button>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <a
              href="https://studio.lyzr.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md border border-white/20 bg-white/[0.06] px-3 py-2 text-sm hover:bg-white/10"
            >
              Try Studio
            </a>
            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLSdaqb-XmRbxHDVvuayC2WtHPHVzl41-pE_MakCDHaNHDdEAIg/viewform?usp=header"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md border border-white/20 bg-white/[0.06] px-3 py-2 text-sm hover:bg-white/10"
            >
              Agent Architect Future Session Form
            </a>
          </div>
        </div>

        {sidebarOpen && (
          <>
            <div className="fixed inset-0 bg-black/60 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
            <aside
              id="academy-mobile-sidebar"
              className="fixed inset-y-0 left-0 z-50 w-72 bg-black border-r border-white/10 p-4 md:hidden"
            >
              <nav className="space-y-6">
                <div className="mb-2 flex items-center gap-3">
                  <img src="/images/lyzr-logo.png" alt="Lyzr" className="h-7 w-auto" />
                </div>
                <ul className="space-y-2">
                  <li>
                    <Link href="/academy" className={linkCls("/academy")}>
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link href="/academy/search" className={linkCls("/academy/search")}>
                      Search
                    </Link>
                  </li>
                </ul>

                <div>
                  <div className="text-sm text-white/60 uppercase tracking-wide mb-2">Learn</div>
                  <ul className="space-y-2">
                    <li>
                      <Link href="/academy/courses" className={linkCls("/academy/courses")}>
                        Courses
                      </Link>
                    </li>
                    <li>
                      <Link href="/academy/courses/prerequisites" className={linkCls("/academy/courses/prerequisites")}>
                        Prerequisites
                      </Link>
                    </li>
                    <li>
                      <Link href="/academy/courses/fundamentals" className={linkCls("/academy/courses/fundamentals")}>
                        Fundamentals
                      </Link>
                    </li>
                    <li>
                      <Link href="/academy/courses/advanced" className={linkCls("/academy/courses/advanced")}>
                        Advanced
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/academy/courses/agent-architect"
                        className={linkCls("/academy/courses/agent-architect")}
                      >
                        Agent Architect
                      </Link>
                    </li>
                    <li>
                      <Link href="/academy/videos" className={linkCls("/academy/videos")}>
                        All Videos
                      </Link>
                    </li>
                  </ul>
                </div>

                <div>
                  <div className="text-sm text-white/60 uppercase tracking-wide mb-2">Use Cases</div>
                  <ul className="space-y-2">
                    <li>
                      <Link href="/academy/use-cases/hr-agents" className={linkCls("/academy/use-cases/hr-agents")}>
                        HR Agents
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/academy/use-cases/banking-agent"
                        className={linkCls("/academy/use-cases/banking-agent")}
                      >
                        Banking Agents
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/academy/use-cases/business-workflows"
                        className={linkCls("/academy/use-cases/business-workflows")}
                      >
                        Business workflows
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/academy/use-cases/customer-service"
                        className={linkCls("/academy/use-cases/customer-service")}
                      >
                        Customer Service
                      </Link>
                    </li>
                  </ul>
                </div>

                <div>
                  <div className="text-sm text-white/60 uppercase tracking-wide mb-2">Academy</div>
                  <ul className="space-y-2">
                    <li>
                      <a
                        href="https://academy.lyzr.ai/join?invitation_token=02c4cf451fdbb2ec612d8453bbf34383f2f3c03b-3b395c21-126c-42e3-9bda-c6f6c6419bd7"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block rounded-md px-3 py-2 hover:bg-white/10 text-white"
                      >
                        Academy
                      </a>
                    </li>
                  </ul>
                </div>

                <div>
                  <div className="text-sm text-white/60 uppercase tracking-wide mb-2">Help</div>
                  <ul className="space-y-2">
                    <li>
                      <Link href="/academy/support" className={linkCls("/academy/support")}>
                        Support
                      </Link>
                    </li>
                  </ul>
                </div>
              </nav>
            </aside>
          </>
        )}

        <div className="flex gap-8">
          <aside className="w-64 shrink-0 hidden md:block">
            <nav className="sticky top-6 pr-1">
              <div className="mb-6 flex items-center gap-3">
                <img src="/images/lyzr-logo.png" alt="Lyzr" className="h-7 w-auto" />
              </div>

              <div className="mb-6">
                <ul className="space-y-2">
                  <li>
                    <Link href="/academy" className={linkCls("/academy")}>
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link href="/academy/search" className={linkCls("/academy/search")}>
                      Search
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="mb-6">
                <div className="text-sm text-white/60 uppercase tracking-wide mb-2">Learn</div>
                <ul className="space-y-2">
                  <li>
                    <Link href="/academy/courses" className={linkCls("/academy/courses")}>
                      Courses
                    </Link>
                  </li>
                  <li>
                    <Link href="/academy/courses/prerequisites" className={linkCls("/academy/courses/prerequisites")}>
                      Prerequisites
                    </Link>
                  </li>
                  <li>
                    <Link href="/academy/courses/fundamentals" className={linkCls("/academy/courses/fundamentals")}>
                      Fundamentals
                    </Link>
                  </li>
                  <li>
                    <Link href="/academy/courses/advanced" className={linkCls("/academy/courses/advanced")}>
                      Advanced
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/academy/courses/agent-architect"
                      className={linkCls("/academy/courses/agent-architect")}
                    >
                      Agent Architect
                    </Link>
                  </li>
                  <li>
                    <Link href="/academy/videos" className={linkCls("/academy/videos")}>
                      All Videos
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="mb-6">
                <div className="text-sm text-white/60 uppercase tracking-wide mb-2">Use Cases</div>
                <ul className="space-y-2">
                  <li>
                    <Link href="/academy/use-cases/hr-agents" className={linkCls("/academy/use-cases/hr-agents")}>
                      HR Agents
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/academy/use-cases/banking-agent"
                      className={linkCls("/academy/use-cases/banking-agent")}
                    >
                      Banking Agents
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/academy/use-cases/business-workflows"
                      className={linkCls("/academy/use-cases/business-workflows")}
                    >
                      Business workflows
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/academy/use-cases/customer-service"
                      className={linkCls("/academy/use-cases/customer-service")}
                    >
                      Customer Service
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="mb-6">
                <div className="text-sm text-white/60 uppercase tracking-wide mb-2">Academy</div>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="https://academy.lyzr.ai/join?invitation_token=02c4cf451fdbb2ec612d8453bbf34383f2f3c03b-3b395c21-126c-42e3-9bda-c6f6c6419bd7"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block rounded-md px-3 py-2 hover:bg-white/10 text-white"
                    >
                      Academy
                    </a>
                  </li>
                </ul>
              </div>

              <div className="mb-6">
                <div className="text-sm text-white/60 uppercase tracking-wide mb-2">Help</div>
                <ul className="space-y-2">
                  <li>
                    <Link href="/academy/support" className={linkCls("/academy/support")}>
                      Support
                    </Link>
                  </li>
                </ul>
              </div>
            </nav>
          </aside>

          <main className="flex-1">{children}</main>
        </div>
      </div>
    </div>
  )
}
