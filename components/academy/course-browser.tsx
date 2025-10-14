"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

type VideoItem = {
  id: string
  title: string
  thumbnail?: string
  thumbnails?: { url: string; width?: number; height?: number }[]
  durationSeconds?: number
  channelTitle?: string
  publishedAt?: string
  viewCount?: number
}

type CourseGroup = { label: string; playlistIds: string[] }

// From your spec
const GROUPS: CourseGroup[] = [
  {
    label: "Prerequisites",
    playlistIds: [
      "PLwalH6bk3wBHeJyk52LhOx-a__DcWIVV4",
      "PLwalH6bk3wBFT5lGwMZLRcz7uRtVMQQl7",
      "PLwalH6bk3wBHzXmAMTqYa784v_ius9yxx",
    ],
  },
  { label: "Fundamentals", playlistIds: ["PLwalH6bk3wBGYCHt8IKL_yECcE-tKCrkd"] },
  { label: "Advanced", playlistIds: ["PLwalH6bk3wBEyIClyk3i2I29IQKyaQtHT"] },
  { label: "Agent Architect", playlistIds: ["PLwalH6bk3wBHEMu83QH0RPitRxikAite6"] },
]

const fetcher = (url: string) => fetch(url).then((r) => r.json())

const CATEGORIES = [
  {
    label: "Prerequisites",
    href: "/academy/courses/prerequisites",
    img: "/images/courses/prerequisite-cover.png",
    alt: "Lyzr Prerequisites cover with key icon",
  },
  {
    label: "Fundamentals",
    href: "/academy/courses/fundamentals",
    img: "/images/courses/fundamentals-cover.png",
    alt: "Lyzr Fundamentals cover with steps icon",
  },
  {
    label: "Advanced Topics",
    href: "/academy/courses/advanced",
    img: "/images/courses/advanced-cover.png",
    alt: "Lyzr Advanced Topics cover with rocket icon",
  },
  {
    label: "Agent Architect",
    href: "/academy/courses/agent-architect",
    img: "/images/courses/agent-architect-cover.jpg",
    alt: "Agent Architect course cover",
  },
]

export default function CourseBrowser() {
  return (
    <section className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        {CATEGORIES.map((c) => (
          <div key={c.label} className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.03]">
            <Link href={c.href} className="relative block aspect-video group" aria-label={`Open ${c.label}`}>
              <Image
                src={c.img || "/placeholder.svg"}
                alt={c.alt}
                fill
                sizes="(min-width: 768px) 100vw, 100vw"
                className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                priority
              />
            </Link>
            <div className="p-5 flex items-center justify-between">
              <h3 className="text-2xl font-semibold text-pretty">{c.label}</h3>
              <Button
                asChild
                size="sm"
                className="bg-white text-black hover:bg-white/90"
                aria-label={`Go to ${c.label}`}
              >
                <Link href={c.href}>Open</Link>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
