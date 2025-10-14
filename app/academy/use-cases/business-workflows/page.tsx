import { LatestLessons } from "@/components/academy/latest-lessons"

export default function BusinessWorkflowsPage() {
  return (
    <main className="bg-black text-white min-h-screen">
      <div className="mx-auto max-w-[1280px] px-6 md:px-10 py-10 md:py-16">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-6">Business workflows</h1>
        <LatestLessons title="All videos" playlistIds={["PLwalH6bk3wBF0wjColKEr8-0wEHBGXQH5"]} limit={30} />
      </div>
    </main>
  )
}
