import CourseBrowser from "@/components/academy/course-browser"

export default function CoursesPage() {
  return (
    <main className="bg-black text-white min-h-screen">
      <div className="mx-auto max-w-[1280px] px-6 md:px-10 py-10 md:py-16">
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-8">Courses</h1>
        <CourseBrowser />
      </div>
    </main>
  )
}
