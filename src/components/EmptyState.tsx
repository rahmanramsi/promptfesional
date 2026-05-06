interface EmptyStateProps {
  hasSearch: boolean
}

export default function EmptyState({ hasSearch }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="text-6xl mb-4">🖼️</div>
      {hasSearch ? (
        <>
          <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200">
            No prompts found
          </h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1 max-w-sm">
            Try adjusting your search or filter to find what you&apos;re looking
            for.
          </p>
        </>
      ) : (
        <>
          <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200">
            Belum ada prompt
          </h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1 max-w-sm">
            Be the first to share your AI-generated image prompts with the
            community.
          </p>
          <a
            href="/submit"
            className="mt-4 inline-flex items-center px-4 py-2 rounded-lg bg-zinc-900 text-white text-sm font-medium hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 transition-colors"
          >
            Submit Prompt
          </a>
        </>
      )}
    </div>
  )
}
