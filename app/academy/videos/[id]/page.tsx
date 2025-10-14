import { fetchVideoDetails, formatDuration, fetchPlaylistItems, type LessonItem } from "@/lib/youtube"
import { VideoDetailClient } from "@/components/academy/video-detail-client"

type PageProps = { params: { id: string } }

async function fetchOEmbed(id: string) {
  const url = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${encodeURIComponent(id)}&format=json`
  const res = await fetch(url, { next: { revalidate: 600 } })
  if (!res.ok) return null
  return (await res.json()) as {
    title: string
    author_name?: string
    thumbnail_url?: string
    provider_name?: string
  }
}

const PLAYLISTS = {
  PREREQUISITES: [
    "PLwalH6bk3wBHeJyk52LhOx-a__DcWIVV4",
    "PLwalH6bk3wBFT5lGwMZLRcz7uRtVMQQl7",
    "PLwalH6bk3wBHzXmAMTqYa784v_ius9yxx",
  ],
  FUNDAMENTALS: ["PLwalH6bk3wBGYCHt8IKL_yECcE-tKCrkd"],
  ADVANCED: ["PLwalH6bk3wBEyIClyk3i2I29IQKyaQtHT"],
  AGENT_ARCHITECT: ["PLwalH6bk3wBHEMu83QH0RPitRxikAite6"],
} as const

async function findCategoryNextItems(currentId: string): Promise<LessonItem[]> {
  // fetch items for each category and find the first that contains the current video
  const allCategoryPlaylists = Object.values(PLAYLISTS)
  for (const group of allCategoryPlaylists) {
    // group can have 1+ playlists; merge them
    const results = await Promise.all(group.map((pid) => fetchPlaylistItems(pid)))
    const merged = results.flat()
    const contains = merged.some((i) => i.id === currentId)
    if (contains) {
      // sort newest first and remove current
      return merged
        .slice()
        .sort((a, b) => {
          const ap = a.publishedAt ? new Date(a.publishedAt).getTime() : 0
          const bp = b.publishedAt ? new Date(b.publishedAt).getTime() : 0
          return bp - ap
        })
        .filter((i) => i.id !== currentId)
    }
  }
  return []
}

export default async function VideoDetailPage({ params }: PageProps) {
  const { id } = params
  const meta = await fetchOEmbed(id)
  const detailsMap = await fetchVideoDetails([id])
  const v = detailsMap[id]
  const title = v?.title || meta?.title || "Video"
  const durationLabel = formatDuration(v?.durationSeconds) || null

  const nextItemsRaw = await findCategoryNextItems(id)
  const nextInCategory = nextItemsRaw.map((n) => ({
    id: n.id,
    title: n.title,
    thumbnail: n.thumbnail,
    publishedAt: n.publishedAt,
  }))

  return (
    <main className="bg-black text-white min-h-screen">
      <div className="mx-auto max-w-[1280px] px-6 md:px-10 py-8 md:py-12">
        <VideoDetailClient
          videoId={id}
          title={title}
          channelTitle={v?.channelTitle || meta?.author_name}
          publishedAt={v?.publishedAt}
          durationLabel={durationLabel}
          viewCount={v?.viewCount}
          description={v?.description}
          detailsThumbnail={meta?.thumbnail_url}
          chapters={v?.chapters || []}
          nextInCategory={nextInCategory}
        />
      </div>
    </main>
  )
}
