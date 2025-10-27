import Link from "next/link"
import { formatDuration, type LessonItem } from "@/lib/youtube"

export function LessonCard({ item }: { item: LessonItem }) {
  return (
    <Link
      href={`/academy/videos/${item.id}`}
      className="group block rounded-xl overflow-hidden ring-1 ring-white/15 hover:ring-white/30 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
    >
      <div className="relative aspect-video bg-white/5">
        {item.thumbnail ? (
          // Using plain <img> to avoid Next Image config; crossOrigin not required for static thumbnails
          <img
            src={item.thumbnail || "/placeholder.svg"}
            alt={item.title}
            className="absolute inset-0 h-full w-full object-cover"
            crossOrigin="anonymous"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center text-white/60">No thumbnail</div>
        )}
        <span className="absolute bottom-2 right-2 rounded-md bg-black/70 px-2 py-0.5 text-xs font-medium text-white">
          {formatDuration(item.durationSeconds) ?? ""}
        </span>
      </div>
      <div className="px-1.5 pt-3 pb-2">
        <h3 className="text-white text-base font-semibold leading-tight">{item.title}</h3>
      </div>
    </Link>
  )
}
