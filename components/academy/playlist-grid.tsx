type VideoItem = {
  id: string
  title: string
  thumbnail: string
  publishedAt: string
}

async function fetchPlaylistRSS(playlistId: string): Promise<VideoItem[]> {
  const res = await fetch(`https://www.youtube.com/feeds/videos.xml?playlist_id=${playlistId}`, {
    // ensure fresh content in preview, but still cached by the browser
    cache: "no-store",
  })
  const xml = await res.text()

  const entries = Array.from(xml.matchAll(/<entry>[\s\S]*?<\/entry>/g))
  const items: VideoItem[] = entries.map((m) => {
    const block = m[0]
    const id = (block.match(/<yt:videoId>([^<]+)<\/yt:videoId>/)?.[1] ?? "").trim()
    const title = (block.match(/<title>([^<]+)<\/title>/)?.[1] ?? "").trim()
    const publishedAt = (block.match(/<published>([^<]+)<\/published>/)?.[1] ?? "").trim()
    const thumb = block.match(/<media:thumbnail[^>]*url="([^"]+)"/)?.[1] ?? ""
    return { id, title, thumbnail: thumb, publishedAt }
  })
  return items
}

function combineAndSort(lists: VideoItem[][], limit?: number) {
  const combined = lists.flat().sort((a, b) => {
    return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  })
  return typeof limit === "number" ? combined.slice(0, limit) : combined
}

export async function PlaylistGrid({
  title,
  playlistIds,
  limit,
  showAllLink,
  allLinkHref,
}: {
  title: string
  playlistIds: string[]
  limit?: number
  showAllLink?: boolean
  allLinkHref?: string
}) {
  const lists = await Promise.all(playlistIds.map((id) => fetchPlaylistRSS(id)))
  const items = combineAndSort(lists, limit)

  return (
    <section className="px-6 md:px-10 lg:px-16">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-white text-2xl md:text-3xl font-semibold tracking-tight">{title}</h2>
        {showAllLink && allLinkHref ? (
          <a
            href={allLinkHref}
            className="text-white/80 hover:text-white text-sm md:text-base underline underline-offset-4"
          >
            All videos →
          </a>
        ) : null}
      </div>

      <div className="grid gap-6 md:gap-8 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        {items.map((v) => (
          <a
            key={v.id}
            href={`/academy/videos/${v.id}`}
            className="group rounded-xl border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/[0.08] transition-colors overflow-hidden"
          >
            {/* Thumbnail */}
            <div className="relative aspect-[16/9] bg-black">
              {/* using next/image for quality; fallback to plain img if domain blocks */}
              <img
                src={v.thumbnail || "/placeholder.svg"}
                alt={v.title}
                className="h-full w-full object-cover"
                crossOrigin="anonymous"
              />
            </div>
            {/* Meta */}
            <div className="p-4">
              <h3 className="text-white text-base md:text-lg font-medium line-clamp-2 group-hover:text-white">
                {v.title}
              </h3>
              <p className="text-white/50 text-xs mt-2">{new Date(v.publishedAt).toLocaleDateString()}</p>
            </div>
          </a>
        ))}
      </div>
    </section>
  )
}

export default PlaylistGrid
