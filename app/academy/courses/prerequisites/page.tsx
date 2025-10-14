"use client"

import { LatestLessons } from "@/components/academy/latest-lessons"

const PRE_LISTS = [
  { id: "PLwalH6bk3wBHeJyk52LhOx-a__DcWIVV4", label: "Prerequisite 1" },
  { id: "PLwalH6bk3wBFT5lGwMZLRcz7uRtVMQQl7", label: "Prerequisite 2" },
  { id: "PLwalH6bk3wBHzXmAMTqYa784v_ius9yxx", label: "Prerequisite 3" },
]

export default function PrerequisitesPage() {
  const allIds = PRE_LISTS.map((p) => p.id)

  return (
    <main className="bg-black text-white min-h-screen">
      <div className="mx-auto max-w-[1280px] px-6 md:px-10 py-10 md:py-16">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-6">Prerequisites</h1>
        <LatestLessons title="All videos" playlistIds={allIds} limit={30} allVideosHref="/academy/videos" />
      </div>
    </main>
  )
}
