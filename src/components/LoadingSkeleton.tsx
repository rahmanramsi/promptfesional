export default function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 9 }).map((_, i) => (
        <div
          key={i}
          className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden animate-pulse"
        >
          <div className="aspect-square bg-zinc-200 dark:bg-zinc-800" />
          <div className="p-4 space-y-3">
            <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-3/4" />
            <div className="h-3 bg-zinc-100 dark:bg-zinc-800 rounded w-1/2" />
            <div className="flex justify-between">
              <div className="h-3 bg-zinc-100 dark:bg-zinc-800 rounded w-1/4" />
              <div className="h-3 bg-zinc-100 dark:bg-zinc-800 rounded w-1/5" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
