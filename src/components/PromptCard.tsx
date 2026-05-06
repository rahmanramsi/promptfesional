import Image from "next/image"
import Link from "next/link"
import type { PromptWithDetails } from "@/types/database"

interface PromptCardProps {
  prompt: PromptWithDetails
}

export default function PromptCard({ prompt }: PromptCardProps) {
  const username = prompt.profiles?.username ?? "anonymous"
  const categoryNames = prompt.prompt_categories
    ?.map((pc) => pc.categories?.name)
    .filter(Boolean) ?? []

  return (
    <Link
      href={`/prompt/${prompt.id}`}
      className="group block rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden transition-shadow hover:shadow-lg"
    >
      <div className="relative aspect-square overflow-hidden bg-zinc-100 dark:bg-zinc-800">
        <Image
          src={prompt.image_url}
          alt={prompt.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 truncate">
          {prompt.title}
        </h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
          {prompt.model}
        </p>
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-zinc-400 dark:text-zinc-500">
            {username}
          </span>
          {categoryNames.length > 0 && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
              {categoryNames[0]}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
