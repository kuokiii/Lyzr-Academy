"use client"
import Link from "next/link"
import AllVideosGrid from "@/components/academy/all-videos-grid"
import { useState } from "react"

const PLAYLISTS = {
  PREREQUISITES: [
    "PLwalH6bk3wBHeJyk52LhOx-a__DcWIVV4",
    "PLwalH6bk3wBFT5lGwMZLRcz7uRtVMQQl7",
    "PLwalH6bk3wBHzXmAMTqYa784v_ius9yxx",
  ],
  FUNDAMENTALS: "PLwalH6bk3wBGYCHt8IKL_yECcE-tKCrkd",
  ADVANCED: "PLwalH6bk3wBEyIClyk3i2I29IQKyaQtHT",
  AGENT_ARCHITECT: "PLwalH6bk3wBHEMu83QH0RPitRxikAite6",
  USE_CASES: [
    "PLwalH6bk3wBHPkeKdi2QtbQeMvsYR4PCi",
    "PLwalH6bk3wBGDbMTjXfypKCj4DxV9nBDb",
    "PLwalH6bk3wBF0wjColKEr8-0wEHBGXQH5",
    "PLwalH6bk3wBFneCNT4UHc3OA_lgc86Od6",
  ],
}

export default function VideosPage() {
  const all = [
    ...PLAYLISTS.PREREQUISITES,
    PLAYLISTS.FUNDAMENTALS,
    PLAYLISTS.ADVANCED,
    PLAYLISTS.AGENT_ARCHITECT,
    ...PLAYLISTS.USE_CASES,
  ]

  // standalone extra video to include with the rest
  const extra = ["nSl_FcCfqjI"]
  const [q, setQ] = useState("")

  return (
    <main className="bg-black text-white min-h-screen">
      <div className="mx-auto max-w-[1280px] px-6 md:px-10 py-10 md:py-16 space-y-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">All videos</h1>
          </div>
          <div className="ml-0 md:ml-6 shrink-0">
            <Link href="/academy" className="text-sm opacity-80 hover:opacity-100">
              {"\u2190"} Back to Home
            </Link>
          </div>
        </div>

        <div className="flex justify-between items-center gap-4">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search videos..."
            className="w-full md:max-w-xl rounded-full bg-white/[0.08] border border-white/15 px-4 py-3 text-base outline-none focus:ring-2 focus:ring-white/30"
            aria-label="Search all videos"
          />
        </div>

        <AllVideosGrid playlistIds={all} extraVideoIds={extra} limit={1000} sectionTitle="All videos" searchQuery={q} />
      </div>
    </main>
  )
}
