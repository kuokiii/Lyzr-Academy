import { LatestLessons } from "@/components/academy/latest-lessons"

export default function FundamentalsPage() {
  return (
    <main className="bg-black text-white min-h-screen">
      <div className="mx-auto max-w-[1280px] px-6 md:px-10 py-10 md:py-16">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-6">Fundamentals</h1>
        <LatestLessons
          title="All videos"
          playlistIds={["PLwalH6bk3wBGYCHt8IKL_yECcE-tKCrkd"]}
          limit={30}
          priorityTitles={["Summarize anything instantly", "Lyzr Studio Dashboard Walkthrough"]}
        />
      </div>
    </main>
  )
}
