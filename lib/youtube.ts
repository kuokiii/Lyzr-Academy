export type LessonItem = {
  id: string
  title: string
  url: string
  thumbnail: string | null
  publishedAt: string
  durationSeconds?: number
}

export function getPlaylistIdFromUrl(url: string): string | null {
  try {
    const u = new URL(url)
    const list = u.searchParams.get("list")
    return list
  } catch {
    return null
  }
}

export async function fetchPlaylistItems(playlistId: string): Promise<LessonItem[]> {
  const feedUrl = `https://www.youtube.com/feeds/videos.xml?playlist_id=${playlistId}`
  const res = await fetch(feedUrl, { next: { revalidate: 300 } })
  if (!res.ok) return []
  const xml = await res.text()

  const entries: LessonItem[] = []
  const entryRegex = /<entry>([\s\S]*?)<\/entry>/g
  let match: RegExpExecArray | null
  while ((match = entryRegex.exec(xml))) {
    const entry = match[1]

    const id = matchText(entry, /<yt:videoId>([^<]+)<\/yt:videoId>/) || ""
    const title = decodeHtml(matchText(entry, /<title>([\s\S]*?)<\/title>/) || "Untitled")
    const link =
      matchText(entry, /<link rel="alternate" href="([^"]+)"/) || (id ? `https://www.youtube.com/watch?v=${id}` : "#")
    const publishedAt = matchText(entry, /<published>([^<]+)<\/published>/) || new Date().toISOString()
    const thumb = matchText(entry, /<media:thumbnail url="([^"]+)"/) || null
    const durationAttr = matchText(entry, /<yt:duration seconds="(\d+)"/)
    const durationSeconds = durationAttr ? Number.parseInt(durationAttr, 10) : undefined

    entries.push({
      id,
      title,
      url: link,
      thumbnail: thumb,
      publishedAt,
      durationSeconds,
    })
  }
  return entries
}

export function formatDuration(seconds?: number): string | null {
  if (!seconds && seconds !== 0) return null
  const h = Math.floor(seconds! / 3600)
  const m = Math.floor((seconds! % 3600) / 60)
  const s = seconds! % 60
  return h > 0
    ? `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
    : `${m}:${String(s).padStart(2, "0")}`
}

function matchText(src: string, re: RegExp): string | null {
  const m = re.exec(src)
  return m ? m[1] : null
}

function decodeHtml(str: string) {
  return str
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
}

export type VideoChapter = { title: string; startSeconds: number }

export type VideoDetail = {
  id: string
  title: string
  description?: string
  channelTitle?: string
  publishedAt?: string
  durationSeconds?: number
  viewCount?: number
  chapters?: VideoChapter[]
  thumbnails?: { url: string; width?: number; height?: number }[]
}

export function iso8601ToSeconds(iso?: string | null): number | undefined {
  if (!iso) return undefined
  const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
  if (!m) return undefined
  const h = Number(m[1] || 0)
  const min = Number(m[2] || 0)
  const s = Number(m[3] || 0)
  return h * 3600 + min * 60 + s
}

export function parseChaptersFromDescription(desc?: string | null): VideoChapter[] {
  if (!desc) return []
  const lines = desc.split(/\r?\n/).slice(0, 200)
  const chapters: VideoChapter[] = []
  for (const line of lines) {
    // Matches 0:00, 10:05, 1:02:33 etc
    const m = line.match(/(?<!\d)(\d{1,2}:)?\d{1,2}:\d{2}(?!\d)/)
    if (m) {
      const ts = m[0]
      const parts = ts.split(":").map((n) => Number(n))
      let seconds = 0
      if (parts.length === 3) seconds = parts[0] * 3600 + parts[1] * 60 + parts[2]
      else seconds = parts[0] * 60 + parts[1]
      const title =
        line
          .replace(ts, "")
          .replace(/^[\s\-–—:]+/, "")
          .trim() || "Chapter"
      chapters.push({ title, startSeconds: seconds })
    }
  }
  // Deduplicate by start
  const seen = new Set<number>()
  return chapters.filter((c) => (seen.has(c.startSeconds) ? false : (seen.add(c.startSeconds), true)))
}

export async function fetchVideoDetails(ids: string[]): Promise<Record<string, VideoDetail>> {
  const key = process.env.YOUTUBE_API_KEY
  const result: Record<string, VideoDetail> = {}
  if (!key || !ids.length) return result

  const chunks: string[][] = []
  for (let i = 0; i < ids.length; i += 50) chunks.push(ids.slice(i, i + 50))

  for (const chunk of chunks) {
    const url =
      `https://www.googleapis.com/youtube/v3/videos?` +
      `part=snippet,contentDetails,statistics&id=${encodeURIComponent(chunk.join(","))}&key=${key}`
    const res = await fetch(url, { next: { revalidate: 300 } })
    if (!res.ok) continue
    const json = await res.json()
    for (const it of json.items || []) {
      const id = it.id as string
      const durationSeconds = iso8601ToSeconds(it?.contentDetails?.duration)
      const description = it?.snippet?.description as string | undefined
      result[id] = {
        id,
        title: it?.snippet?.title,
        description,
        channelTitle: it?.snippet?.channelTitle,
        publishedAt: it?.snippet?.publishedAt,
        durationSeconds,
        viewCount: it?.statistics?.viewCount ? Number(it.statistics.viewCount) : undefined,
        thumbnails: Object.values(it?.snippet?.thumbnails || {}),
        chapters: parseChaptersFromDescription(description),
      }
    }
  }
  return result
}
