"use client"

import useSWR from "swr"
import Link from "next/link"

type VideoItem = {
  id: string
  title: string
  url: string
  thumbnail: string
  published: string
  playlistId: string
  durationSeconds?: number // new
}

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function LatestLessons({
  playlistIds,
  limit = 9,
  title = "Latest lessons",
  allVideosHref = "/academy/videos",
  searchQuery,
  priorityTitles = [], // new prop to prioritize some videos
  colsMd = 2, // new prop to allow pages to choose md column count (default 2)
}: {
  playlistIds: string[]
  limit?: number
  title?: string
  allVideosHref?: string
  searchQuery?: string
  priorityTitles?: string[] //
  colsMd?: 2 | 3
}) {
  const qs = playlistIds.map((p) => `list=${encodeURIComponent(p)}`).join("&")
  const { data, error, isLoading } = useSWR<{ items: VideoItem[] }>(
    `/api/youtube/playlist?${qs}&limit=${limit}`,
    fetcher,
  )

  const itemsRaw = (data?.items ?? []).filter((v) => {
    if (!searchQuery) return true
    const q = searchQuery.trim().toLowerCase()
    return v.title.toLowerCase().includes(q)
  })

  const itemsDedup = Array.from(new Map(itemsRaw.map((v) => [v.id, v])).values())

  const priorityLower = priorityTitles.map((t) => t.toLowerCase())
  const isShort = (v: VideoItem) => (typeof v.durationSeconds === "number" ? v.durationSeconds < 90 : false)
  const priorityIndex = (v: VideoItem) => {
    const idx = priorityLower.findIndex((t) => v.title.toLowerCase().includes(t))
    return idx === -1 ? Number.POSITIVE_INFINITY : idx
  }
  const items = itemsDedup.slice().sort((a, b) => {
    const pa = priorityIndex(a)
    const pb = priorityIndex(b)
    if (pa !== pb) return pa - pb
    const sa = isShort(a) ? 1 : 0
    const sb = isShort(b) ? 1 : 0
    if (sa !== sb) return sa - sb // shorts last
    // fallback: keep original (feed) order
    return 0
  })

  return (
    <section aria-labelledby="latest-lessons" className="space-y-6">
      <div className="flex items-center justify-between">
        {title && title.toLowerCase() !== "all videos" ? (
          <h2 id="latest-lessons" className="text-2xl md:text-3xl font-semibold tracking-tight text-white">
            {title}
          </h2>
        ) : (
          <span />
        )}
        <Link href={allVideosHref} className="text-sm font-medium text-white/80 hover:text-white transition">
          All videos →
        </Link>
      </div>

      {isLoading && (
        <div className={`grid grid-cols-1 ${colsMd === 3 ? "md:grid-cols-3" : "md:grid-cols-2"} gap-6`}>
          {Array.from({ length: colsMd === 3 ? 6 : 4 }).map((_, i) => (
            <div key={i} className="aspect-video rounded-2xl bg-white/5 ring-1 ring-white/10 animate-pulse" />
          ))}
        </div>
      )}

      {error && <p className="text-sm text-red-400">Failed to load videos. Please try again.</p>}

      {!!items?.length && (
        <div className={`grid grid-cols-1 ${colsMd === 3 ? "md:grid-cols-3" : "md:grid-cols-2"} gap-6`}>
          {items.map((v) => (
            <Link key={v.id} href={`/academy/videos/${v.id}`} className="group block">
              <div className="relative aspect-video overflow-hidden rounded-2xl ring-1 ring-white/15 hover:ring-white/30 bg-black">
                <img
                  src={v.thumbnail || "/placeholder.svg?height=380&width=540&query=course%20thumbnail"}
                  alt={v.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                  crossOrigin="anonymous"
                />
                {typeof v.durationSeconds === "number" && (
                  <div className="absolute bottom-2 right-2 rounded-md bg-black/70 text-white text-xs px-2 py-1">
                    {(() => {
                      const s = v.durationSeconds!
                      const h = Math.floor(s / 3600)
                      const m = Math.floor((s % 3600) / 60)
                      const sec = s % 60
                      return h > 0
                        ? `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`
                        : `${m}:${String(sec).padStart(2, "0")}`
                    })()}
                  </div>
                )}
              </div>
              <div className="mt-3 flex items-center justify-between gap-2">
                <h3 className="text-sm/6 md:text-base/7 font-medium text-white line-clamp-2">{v.title}</h3>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  )
}
