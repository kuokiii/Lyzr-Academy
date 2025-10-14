import { fetchPlaylistItems, getPlaylistIdFromUrl, type LessonItem } from "@/lib/youtube"
import { LessonCard } from "@/components/academy/lesson-card"

const PRE_URLS = [
  "https://www.youtube.com/watch?v=PSvQL-81fjc&list=PLwalH6bk3wBHeJyk52LhOx-a__DcWIVV4",
  "https://www.youtube.com/watch?v=PSvQL-81fjc&list=PLwalH6bk3wBFT5lGwMZLRcz7uRtVMQQl7",
  "https://www.youtube.com/watch?v=KQM1rIsZ9Co&list=PLwalH6bk3wBHzXmAMTqYa784v_ius9yxx",
]

async function getPrerequisites(): Promise<LessonItem[]> {
  const ids = PRE_URLS.map(getPlaylistIdFromUrl).filter(Boolean) as string[]
  const all = await Promise.all(ids.map((id) => fetchPlaylistItems(id)))
  const merged = all.flat()
  merged.sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt))
  return merged
}

export default async function PrerequisitesPage() {
  const items = await getPrerequisites()
  return (
    <div className="pt-8">
      <h1 className="text-3xl md:text-4xl font-semibold mb-6">Prerequisites</h1>
      <div className="grid gap-6 md:gap-8 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <LessonCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  )
}
