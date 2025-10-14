"use client"

import { useState } from "react"
import { LatestLessons } from "@/components/academy/latest-lessons"

export default function SearchPage() {
  const [query, setQuery] = useState("")
  const all = [
    "PLwalH6bk3wBHeJyk52LhOx-a__DcWIVV4",
    "PLwalH6bk3wBFT5lGwMZLRcz7uRtVMQQl7",
    "PLwalH6bk3wBHzXmAMTqYa784v_ius9yxx",
    "PLwalH6bk3wBGYCHt8IKL_yECcE-tKCrkd",
    "PLwalH6bk3wBEyIClyk3i2I29IQKyaQtHT",
    "PLwalH6bk3wBHEMu83QH0RPitRxikAite6",
    "PLwalH6bk3wBHPkeKdi2QtbQeMvsYR4PCi",
    "PLwalH6bk3wBGDbMTjXfypKCj4DxV9nBDb",
    "PLwalH6bk3wBF0wjColKEr8-0wEHBGXQH5",
    "PLwalH6bk3wBFneCNT4UHc3OA_lgc86Od6",
  ]

  return (
    <main className="bg-black text-white min-h-screen">
      <div className="mx-auto max-w-[1280px] px-6 md:px-10 py-10 md:py-16 space-y-8">
        <section className="text-center">
          <div className="mt-0 flex justify-center">
            <div className="w-full max-w-xl">
              <input
                aria-label="Search lessons"
                placeholder="Search lessons..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full rounded-full bg-white/10 text-white/90 placeholder:text-white/60 px-5 py-3 outline-none focus:ring-2 focus:ring-white/20"
              />
            </div>
          </div>
        </section>
        <LatestLessons title="All lessons" playlistIds={all} limit={60} searchQuery={query} colsMd={3} />
      </div>
    </main>
  )
}
