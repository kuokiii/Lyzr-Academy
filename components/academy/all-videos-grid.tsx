"use client"

import useSWR from "swr"

type PlaylistItem = {
  id: string
  title: string
  url?: string
  thumbnail: string
  published?: string
  publishedAt?: string
  durationSeconds?: number
}

type EnrichedVideo = {
  id: string
  title?: string
  thumbnails?: { url: string }[]
  publishedAt?: string
  duration?: string
  viewCount?: number
}

const fetcher = (url: string) => fetch(url).then((r) => r.json())

function isoDurationToSeconds(iso?: string) {
  if (!iso) return undefined
  // PT1H2M3S | PT13M47S | PT45S
  const m = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/.exec(iso)
  if (!m) return undefined
  const h = m[1] ? Number.parseInt(m[1], 10) : 0
  const mm = m[2] ? Number.parseInt(m[2], 10) : 0
  const s = m[3] ? Number.parseInt(m[3], 10) : 0
  return h * 3600 + mm * 60 + s
}

function clockToSeconds(label?: string) {
  // 1:03:05 or 13:47
  if (!label) return undefined
  const parts = label.split(":").map((n) => Number.parseInt(n, 10))
  if (parts.some(Number.isNaN)) return undefined
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2]
  if (parts.length === 2) return parts[0] * 60 + parts[1]
  return undefined
}

function anyDurationToSeconds(v?: string) {
  return isoDurationToSeconds(v) ?? clockToSeconds(v) ?? durationToSeconds(v)
}

function durationToSeconds(label?: string) {
  if (!label) return undefined
  // handles "1h 03m 05s", "11m 03s", "6m"
  const h = /(\d+)h/.exec(label)?.[1]
  const m = /(\d+)m/.exec(label)?.[1]
  const s = /(\d+)s/.exec(label)?.[1]
  const hh = h ? Number.parseInt(h, 10) : 0
  const mm = m ? Number.parseInt(m, 10) : 0
  const ss = s ? Number.parseInt(s, 10) : 0
  return hh * 3600 + mm * 60 + ss
}

export default function AllVideosGrid({
  playlistIds,
  extraVideoIds = [],
  limit = 1000,
  sectionTitle = "All videos",
  searchQuery = "", //
}: {
  playlistIds: string[]
  extraVideoIds?: string[]
  limit?: number
  sectionTitle?: string
  searchQuery?: string //
}) {
  const qs = playlistIds.map((p) => `list=${encodeURIComponent(p)}`).join("&")
  const {
    data: playlistData,
    error: playlistError,
    isLoading,
  } = useSWR<{ items: PlaylistItem[] }>(`/api/youtube/playlist?${qs}&limit=${limit}`, fetcher)

  // Fetch extra single videos in parallel and merge
  const { data: extras } = useSWR<EnrichedVideo[]>(
    extraVideoIds.length ? ["ENRICHED_LIST", extraVideoIds] : null,
    async ([_, ids]) => {
      const results = await Promise.all(
        ids.map((id: string) => fetch(`/api/youtube/enriched?videoId=${id}`).then((r) => r.json())),
      )
      return results
    },
  )

  const playlistItems: PlaylistItem[] = (playlistData?.items ?? []).map((i) => ({
    ...i,
    publishedAt: (i as any).publishedAt || i.published,
  }))

  const extraItems: PlaylistItem[] =
    extras?.map((e) => ({
      id: e.id,
      title: e.title || "Video",
      thumbnail: e.thumbnails?.[0]?.url || `https://img.youtube.com/vi/${e.id}/maxresdefault.jpg`,
      publishedAt: e.publishedAt,
      durationSeconds: anyDurationToSeconds(e?.duration),
    })) ?? []

  const mergedUnique = Array.from(new Map([...playlistItems, ...extraItems].map((v) => [v.id, v])).values())
    .filter((v) => v.title?.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      const aShort = (a.durationSeconds ?? 9999) < 90 ? 1 : 0
      const bShort = (b.durationSeconds ?? 9999) < 90 ? 1 : 0
      if (aShort !== bShort) return aShort - bShort
      const ap = a.publishedAt ? new Date(a.publishedAt).getTime() : 0
      const bp = b.publishedAt ? new Date(b.publishedAt).getTime() : 0
      return bp - ap
    })

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-white">{sectionTitle}</h2>
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="aspect-video rounded-2xl bg-white/5 ring-1 ring-white/10 animate-pulse" />
          ))}
        </div>
      )}

      {playlistError && <p className="text-sm text-red-400">Failed to load videos. Please try again.</p>}

      {!!mergedUnique?.length && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mergedUnique.map((v) => (
            <a
              key={v.id}
              href={`/academy/videos/${v.id}`}
              className="group block rounded-2xl overflow-hidden ring-1 ring-white/15 hover:ring-white/30 transition"
            >
              <div className="relative aspect-video bg-white/5">
                <img
                  src={v.thumbnail || "/placeholder.svg?height=380&width=540&query=course%20thumbnail"}
                  alt={v.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                  crossOrigin="anonymous"
                />
              </div>
              <div className="px-3 pb-3 mt-3">
                <h3 className="text-sm/6 md:text-base/7 font-medium text-white line-clamp-2">{v.title}</h3>
                {v.publishedAt ? (
                  <p className="text-white/50 text-xs mt-2">{new Date(v.publishedAt).toLocaleDateString()}</p>
                ) : null}
              </div>
            </a>
          ))}
        </div>
      )}
    </section>
  )
}
