import LoadingSkeleton from "@/components/LoadingSkeleton"

export default function Loading() {
  return (
    <div className="flex flex-col flex-1">
      <section className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="h-8 w-48 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
          <div className="h-4 w-64 bg-zinc-100 dark:bg-zinc-800 rounded mt-2 animate-pulse" />
        </div>
      </section>
      <div className="flex-1 max-w-7xl mx-auto px-4 py-6 w-full">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
          <div className="h-10 w-full max-w-md bg-zinc-100 dark:bg-zinc-800 rounded-lg animate-pulse" />
        </div>
        <LoadingSkeleton />
      </div>
    </div>
  )
}
