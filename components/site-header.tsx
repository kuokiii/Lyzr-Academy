"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export default function SiteHeader() {
  const pathname = usePathname()
  const inAcademy = pathname.startsWith("/academy")

  return (
    <header className={`border-b ${inAcademy ? "bg-black text-white border-white/10" : "bg-background"}`}>
      <nav className="mx-auto flex h-12 max-w-7xl items-center gap-4 px-4">
        <Link href="/" aria-label="Lyzr home" className="flex items-center gap-2">
          <img src="/images/lyzr-logo.png" alt="Lyzr" className="h-5 w-auto" />
          <span className={`text-sm font-medium ${inAcademy ? "text-white" : ""}`}>Home</span>
        </Link>
        <div className={`h-6 w-px ${inAcademy ? "bg-white/15" : "bg-border"}`} aria-hidden />
        <Link
          href="/academy"
          className={`text-sm ${inAcademy ? "text-white/80 hover:text-white" : "text-foreground/80 hover:text-foreground"}`}
        >
          {"Resources \u2192 Academy"}
        </Link>
      </nav>
    </header>
  )
}
