// New API route that returns enriched playlist items or a single video with timestamps
import { NextResponse } from "next/server"

const YT_BASE = "https://www.googleapis.com/youtube/v3"

function formatISODur(iso: string | undefined) {
  if (!iso) return undefined
  // Convert e.g. PT4H6M5S => "4h 6m" or "11m 03s"
  const m = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/.exec(iso)
  if (!m) return undefined
  const h = m[1] ? `${m[1]}h ` : ""
  const min = m[2] ? `${m[2]}m` : h ? "0m" : ""
  const s = m[3] ? ` ${String(m[3]).padStart(2, "0")}s` : ""
  return `${h}${min}${s}`.trim()
}

function toSeconds(stamp: string) {
  const parts = stamp.split(":").map((n) => Number.parseInt(n, 10))
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2]
  if (parts.length === 2) return parts[0] * 60 + parts[1]
  return Number.isFinite(Number(stamp)) ? Number(stamp) : 0
}

function parseChapters(description?: string) {
  if (!description) return []
  const lines = description.split("\n")
  const re = /^\s*((?:\d{1,2}:)?\d{1,2}:\d{2})\s+[-–—]?\s*(.*)\s*$/
  const chapters = []
  for (const line of lines) {
    const m = re.exec(line)
    if (m) {
      const stamp = m[1]
      const label = m[2] || ""
      chapters.push({ stamp, label, seconds: toSeconds(stamp) })
    }
  }
  return chapters
}

async function fetchAllPlaylistItems(playlistId: string, key: string) {
  let pageToken: string | undefined = undefined
  const items: any[] = []
  do {
    const url = new URL(`${YT_BASE}/playlistItems`)
    url.searchParams.set("part", "contentDetails,snippet")
    url.searchParams.set("maxResults", "50")
    url.searchParams.set("playlistId", playlistId)
    url.searchParams.set("key", key)
    if (pageToken) url.searchParams.set("pageToken", pageToken)
    const res = await fetch(url, { cache: "no-store" })
    const json = await res.json()
    items.push(...(json.items || []))
    pageToken = json.nextPageToken
  } while (pageToken)
  return items
}

async function fetchVideoMap(videoIds: string[], key: string) {
  const map = new Map<string, any>()
  for (let i = 0; i < videoIds.length; i += 50) {
    const batch = videoIds.slice(i, i + 50)
    const url = new URL(`${YT_BASE}/videos`)
    url.searchParams.set("part", "snippet,contentDetails,statistics")
    url.searchParams.set("id", batch.join(","))
    url.searchParams.set("key", key)
    const res = await fetch(url, { cache: "no-store" })
    const json = await res.json()
    for (const v of json.items || []) map.set(v.id, v)
  }
  return map
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const key = process.env.YOUTUBE_API_KEY
  if (!key) {
    return NextResponse.json({ error: "Missing YOUTUBE_API_KEY" }, { status: 500 })
  }

  const videoId = searchParams.get("videoId")
  const playlistId = searchParams.get("playlistId")

  // Single video enrichment
  if (videoId) {
    const url = new URL(`${YT_BASE}/videos`)
    url.searchParams.set("part", "snippet,contentDetails,statistics")
    url.searchParams.set("id", videoId)
    url.searchParams.set("key", key)
    const res = await fetch(url, { cache: "no-store" })
    const json = await res.json()
    const v = json.items?.[0]
    if (!v) return NextResponse.json({ error: "Not found" }, { status: 404 })
    const sn = v.snippet
    const cd = v.contentDetails
    const st = v.statistics
    const item = {
      id: v.id,
      title: sn?.title,
      description: sn?.description,
      thumbnails: sn?.thumbnails,
      channelTitle: sn?.channelTitle,
      publishedAt: sn?.publishedAt,
      duration: formatISODur(cd?.duration),
      viewCount: st?.viewCount ? Number(st.viewCount) : undefined,
      chapters: parseChapters(sn?.description),
    }
    return NextResponse.json(item, { status: 200 })
  }

  // Playlist enrichment
  if (playlistId) {
    const playlistItems = await fetchAllPlaylistItems(playlistId, key)
    const ids = playlistItems.map((i: any) => i.contentDetails?.videoId).filter(Boolean) as string[]
    const vmap = await fetchVideoMap(ids, key)

    const items = playlistItems.map((i: any) => {
      const id = i.contentDetails?.videoId
      const v = id ? vmap.get(id) : undefined
      const sn = v?.snippet
      const cd = v?.contentDetails
      const st = v?.statistics
      return {
        id,
        title: sn?.title || i.snippet?.title,
        description: sn?.description,
        thumbnails: sn?.thumbnails || i.snippet?.thumbnails,
        channelTitle: sn?.channelTitle || i.snippet?.channelTitle,
        publishedAt: sn?.publishedAt || i.snippet?.publishedAt,
        duration: formatISODur(cd?.duration),
        viewCount: st?.viewCount ? Number(st.viewCount) : undefined,
        chapters: parseChapters(sn?.description),
      }
    })

    return NextResponse.json({ items }, { status: 200 })
  }

  return NextResponse.json({ error: "Missing playlistId or videoId" }, { status: 400 })
}
