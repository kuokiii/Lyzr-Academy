export default function SupportPage() {
  return (
    <div className="px-6 md:px-10 lg:px-16 py-10 space-y-4">
      <h2 className="text-white text-2xl md:text-3xl font-semibold">Support</h2>
      <p className="text-white/70">Need help? Reach out and we&apos;ll get back to you shortly.</p>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <a
          href="https://academy.lyzr.ai/join?invitation_token=02c4cf451fdbb2ec612d8453bbf34383f2f3c03b-3b395c21-126c-42e3-9bda-c6f6c6419bd7"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center rounded-md bg-white/10 px-4 py-2 text-white hover:bg-white/15 transition"
        >
          Join Academy Circle
        </a>
        <a
          href="mailto:support@lyzr.ai"
          className="inline-flex items-center rounded-md border border-white/15 px-4 py-2 text-white/90 hover:text-white hover:border-white/25 transition"
        >
          Email Support
        </a>
      </div>
    </div>
  )
}
