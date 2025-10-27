import { LatestLessons } from "@/components/academy/latest-lessons"

const PLAYLISTS = {
  PREREQUISITES: [
    "PLwalH6bk3wBHeJyk52LhOx-a__DcWIVV4",
    "PLwalH6bk3wBFT5lGwMZLRcz7uRtVMQQl7",
    "PLwalH6bk3wBHzXmAMTqYa784v_ius9yxx",
  ],
  FUNDAMENTALS: "PLwalH6bk3wBGYCHt8IKL_yECcE-tKCrkd",
  ADVANCE: "PLwalH6bk3wBEyIClyk3i2I29IQKyaQtHT",
  AGENT_ARCHITECT: "PLwalH6bk3wBHEMu83QH0RPitRxikAite6",
  USE_CASES: [
    "PLwalH6bk3wBHPkeKdi2QtbQeMvsYR4PCi",
    "PLwalH6bk3wBGDbMTjXfypKCj4DxV9nBDb",
    "PLwalH6bk3wBF0wjColKEr8-0wEHBGXQH5",
    "PLwalH6bk3wBFneCNT4UHc3OA_lgc86Od6",
  ],
}

export default function AcademyHomePage() {
  const all = [
    ...PLAYLISTS.PREREQUISITES,
    PLAYLISTS.FUNDAMENTALS,
    PLAYLISTS.ADVANCE,
    PLAYLISTS.AGENT_ARCHITECT,
    ...PLAYLISTS.USE_CASES,
  ]

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="mx-auto max-w-[1100px] text-center pt-16 md:pt-24 pb-10">
        {/* Logo added */}
        <img src="/images/lyzr-logo.png" alt="Lyzr logo" className="mx-auto mb-6 h-10 w-auto" />
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-semibold tracking-tight text-balance animate-in fade-in slide-in-from-bottom-2">
          Building with Lyzr
        </h1>
        <div className="mt-6 flex justify-center">
          <div className="w-full max-w-xl">
            <input
              aria-label="Search lessons"
              placeholder="Search lessons..."
              className="w-full rounded-full bg-white/10 text-white/90 placeholder:text-white/60 px-5 py-3 outline-none focus:ring-2 focus:ring-white/20"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] px-6 md:px-10 pb-16">
        <LatestLessons playlistIds={all} limit={12} title="Latest lessons" allVideosHref="/academy/videos" colsMd={3} />
      </section>
    </main>
  )
}
