import { type NextRequest, NextResponse } from "next/server"
import { XMLParser } from "fast-xml-parser"
import { fetchVideoDetails } from "@/lib/youtube"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const lists = searchParams.getAll("list") // allow multiple list params
  const limit = Number(searchParams.get("limit") || "9")

  if (!lists.length) {
    return NextResponse.json({ items: [] })
  }

  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "",
  })

  const fetchOne = async (playlistId: string) => {
    const rssUrl = `https://www.youtube.com/feeds/videos.xml?playlist_id=${encodeURIComponent(playlistId)}`
    const res = await fetch(rssUrl, { headers: { "user-agent": "Mozilla/5.0" } })
    if (!res.ok) throw new Error(`Failed to fetch playlist ${playlistId}`)
    const xml = await res.text()
    const json = parser.parse(xml)
    const entries = Array.isArray(json?.feed?.entry) ? json.feed.entry : json?.feed?.entry ? [json.feed.entry] : []
    return entries.map((e: any) => {
      const videoId =
        e?.["yt:videoId"] ||
        e?.["yt:videoid"] || // fallback
        e?.id?.split(":")?.pop()
      const title = e?.title || ""
      const published = e?.published || e?.updated || new Date().toISOString()
      const link =
        (Array.isArray(e?.link) ? e.link.find((l: any) => l?.href)?.href : e?.link?.href) ||
        (videoId ? `https://www.youtube.com/watch?v=${videoId}` : "")
      const thumbFromMedia = e?.["media:group"]?.["media:thumbnail"]?.url || e?.["media:thumbnail"]?.url
      const thumbnail = thumbFromMedia || (videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : "")
      return {
        id: videoId || title,
        title,
        url: link,
        thumbnail,
        published,
        playlistId,
      }
    })
  }

  try {
    const batches = await Promise.allSettled(lists.map(fetchOne))
    let items = batches
      .flatMap((r) => (r.status === "fulfilled" ? r.value : []))
      .sort((a: any, b: any) => new Date(b.published).getTime() - new Date(a.published).getTime())
      .slice(0, limit)

    // Fetch full details for all items (chapters, duration, stats, etc.)
    const details = await fetchVideoDetails(items.map((i: any) => i.id))
    items = items.map((i: any) => {
      const d = details[i.id]
      return {
        ...i,
        durationSeconds: d?.durationSeconds,
        channelTitle: d?.channelTitle,
        publishedAt: d?.publishedAt || i.published,
        viewCount: d?.viewCount,
        description: d?.description,
        chapters: d?.chapters || [],
        thumbnails: d?.thumbnails || [],
      }
    })

    return NextResponse.json(
      { items },
      { headers: { "cache-control": "public, s-maxage=600, stale-while-revalidate=86400" } },
    )
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Unknown error" }, { status: 500 })
  }
}
