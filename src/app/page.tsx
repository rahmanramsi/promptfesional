import Image from "next/image";
import Link from "next/link";
import { getAllPrompts } from "@/data/prompts";

export default async function Home() {
  const prompts = await getAllPrompts();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
          Promptfesional
        </h1>
        <p className="mt-3 text-lg text-zinc-500 dark:text-zinc-400">
          Kumpulan prompt image berkualitas untuk inspirasi kreatifmu.
        </p>
      </div>

      {prompts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-lg text-zinc-500 dark:text-zinc-400">
            Belum ada prompt.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {prompts.map((prompt) => (
            <Link
              key={prompt.id}
              href={`/prompt/${prompt.id}`}
              className="group overflow-hidden rounded-xl border border-zinc-200 bg-white transition-shadow hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="relative aspect-square overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                <Image
                  src={prompt.image_url}
                  alt={prompt.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-zinc-900 dark:text-white">
                  {prompt.title}
                </h3>
                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                  {prompt.model}
                </p>
                <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">
                  oleh {prompt.author.username}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
