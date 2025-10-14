"use client"

import { useMemo, useState } from "react"

type Chapter = { title: string; startSeconds: number }
type NextItem = { id: string; title: string; thumbnail?: string | null; publishedAt?: string | null }

export function VideoDetailClient({
  videoId,
  title,
  channelTitle,
  publishedAt,
  durationLabel,
  viewCount,
  description,
  detailsThumbnail,
  chapters = [],
  nextInCategory = [],
}: {
  videoId: string
  title: string
  channelTitle?: string
  publishedAt?: string
  durationLabel?: string | null
  viewCount?: number
  description?: string
  detailsThumbnail?: string | null
  chapters?: Chapter[]
  nextInCategory?: NextItem[]
}) {
  const baseEmbed = useMemo(() => `https://www.youtube.com/embed/${videoId}`, [videoId])
  const [playerUrl, setPlayerUrl] = useState(baseEmbed)

  const onSeek = (sec: number) => {
    // autoplay and seek to timestamp directly in the iframe
    const url = `${baseEmbed}?autoplay=1&start=${Math.max(0, Math.floor(sec))}&rel=0`
    setPlayerUrl(url)
  }

  return (
    <div className="grid gap-8 md:grid-cols-[2fr_1fr]">
      {/* Left: Player + Title + Description + Next in category */}
      <section>
        <div className="aspect-video w-full rounded-xl overflow-hidden ring-1 ring-white/10 bg-white/5">
          <iframe
            key={playerUrl}
            src={playerUrl}
            title={title}
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>

        <div className="mt-6">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">{title}</h1>
          <p className="mt-2 text-white/70">
            {channelTitle ? `by ${channelTitle}` : ""}{" "}
            {publishedAt ? ` • ${new Date(publishedAt).toLocaleDateString()}` : ""}{" "}
            {durationLabel ? ` • ${durationLabel}` : ""}{" "}
            {typeof viewCount === "number" ? ` • ${viewCount.toLocaleString()} views` : ""}
          </p>
        </div>

        {description && (
          <details className="mt-6 rounded-lg bg-white/[0.04] ring-1 ring-white/10">
            <summary className="cursor-pointer select-none px-4 py-3 text-white/80 hover:text-white">
              Description
            </summary>
            <div className="px-4 pb-4 text-sm leading-6 text-white/80 whitespace-pre-wrap">{description}</div>
          </details>
        )}

        {!!nextInCategory?.length && (
          <div className="mt-8">
            <h2 className="text-lg font-medium text-white mb-3">Next in this category</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {nextInCategory.slice(0, 6).map((n) => (
                <a
                  key={n.id}
                  href={`/academy/videos/${n.id}`}
                  className="group block rounded-2xl overflow-hidden ring-1 ring-white/10 hover:ring-white/20 transition"
                >
                  <div className="relative aspect-video bg-white/5">
                    <img
                      src={
                        n.thumbnail ||
                        "/placeholder.svg?height=380&width=540&query=next%20video%20thumbnail" ||
                        "/placeholder.svg"
                      }
                      alt={n.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                      crossOrigin="anonymous"
                    />
                  </div>
                  <div className="mt-3">
                    <h3 className="text-sm/6 md:text-base/7 font-medium text-white line-clamp-2">{n.title}</h3>
                    {n.publishedAt ? (
                      <p className="text-white/50 text-xs mt-1">{new Date(n.publishedAt).toLocaleDateString()}</p>
                    ) : null}
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6">
          <a href="/academy/videos" className="text-white/70 hover:text-white">
            ← Back to all videos
          </a>
        </div>
      </section>

      {/* Right: Details + Chapters */}
      <aside className="hidden md:block md:sticky md:top-6 h-fit self-start">
        <div className="rounded-xl ring-1 ring-white/10 bg-white/5 overflow-hidden">
          {detailsThumbnail ? (
            <img
              src={detailsThumbnail || "/placeholder.svg"}
              alt={title || "Thumbnail"}
              className="w-full aspect-video object-cover"
              crossOrigin="anonymous"
            />
          ) : (
            <div className="w-full aspect-video bg-white/5" />
          )}
          <div className="p-4">
            <h3 className="text-white/90 font-medium">Video details</h3>
            {durationLabel && <p className="text-sm text-white/70 mt-1">Duration: {durationLabel}</p>}
            {typeof viewCount === "number" && (
              <p className="text-sm text-white/70">Views: {viewCount.toLocaleString()}</p>
            )}
            {channelTitle && <p className="text-sm text-white/60">Channel: {channelTitle}</p>}
            <a
              href={`https://www.youtube.com/watch?v=${videoId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block rounded-md bg-white/10 hover:bg-white/20 px-3 py-2 text-sm"
            >
              Open on YouTube →
            </a>
          </div>
        </div>

        {!!chapters?.length && (
          <div className="mt-6 rounded-xl ring-1 ring-white/10 bg-white/5 p-4">
            <h4 className="text-white/90 font-medium mb-2">Chapters</h4>
            <ol className="space-y-2">
              {chapters.map((c, i) => (
                <li key={i} className="flex items-center gap-3 text-sm">
                  <button
                    type="button"
                    onClick={() => onSeek(c.startSeconds)}
                    className="rounded bg-white/10 px-2 py-1 text-white/90 hover:bg-white/20"
                  >
                    {(() => {
                      const s = c.startSeconds
                      const h = Math.floor(s / 3600)
                      const m = Math.floor((s % 3600) / 60)
                      const sec = s % 60
                      return h > 0
                        ? `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`
                        : `${m}:${String(sec).padStart(2, "0")}`
                    })()}
                  </button>
                  <button
                    type="button"
                    onClick={() => onSeek(c.startSeconds)}
                    className="text-left text-white/80 hover:text-white"
                  >
                    {c.title}
                  </button>
                </li>
              ))}
            </ol>
          </div>
        )}
      </aside>
    </div>
  )
}
