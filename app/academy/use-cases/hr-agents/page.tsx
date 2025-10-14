import { LatestLessons } from "@/components/academy/latest-lessons"

export default function HRAgentsPage() {
  return (
    <main className="bg-black text-white min-h-screen">
      <div className="mx-auto max-w-[1280px] px-6 md:px-10 py-10 md:py-16">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-6">HR Agents</h1>
        <LatestLessons
          title="All videos"
          playlistIds={["PLwalH6bk3wBHPkeKdi2QtbQeMvsYR4PCi"]}
          limit={30}
          priorityTitles={["Masterclass on AI agents"]}
        />
      </div>
    </main>
  )
}
