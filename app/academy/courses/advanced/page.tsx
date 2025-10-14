import { LatestLessons } from "@/components/academy/latest-lessons"

export default function AdvancedPage() {
  return (
    <main className="bg-black text-white min-h-screen">
      <div className="mx-auto max-w-[1280px] px-6 md:px-10 py-10 md:py-16">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-6">Advanced</h1>
        <LatestLessons
          title="All videos"
          playlistIds={["PLwalH6bk3wBEyIClyk3i2I29IQKyaQtHT"]}
          limit={30}
          priorityTitles={[
            "introducing lyzr’s dag orchestrator",
            "introducing lyzr's dag orchestrator",
            "build a no code chat agent with lyzr",
          ]}
          colsMd={2}
        />
      </div>
    </main>
  )
}
