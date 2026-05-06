import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPromptById, getRelatedPrompts } from "@/data/prompts";
import PromptDetail from "./PromptDetail";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const prompt = await getPromptById(id);

  if (!prompt) {
    return { title: "Prompt Tidak Ditemukan" };
  }

  return {
    title: prompt.title,
    description: prompt.prompt_text.slice(0, 160),
    openGraph: {
      title: prompt.title,
      description: prompt.prompt_text.slice(0, 160),
      images: [prompt.image_url],
      type: "article",
    },
  };
}

export default async function PromptDetailPage({ params }: Props) {
  const { id } = await params;
  const prompt = await getPromptById(id);

  if (!prompt) {
    notFound();
  }

  const relatedPrompts = await getRelatedPrompts(id);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <nav className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
          Kembali ke Gallery
        </Link>
      </nav>

      <div className="grid gap-8 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <div className="relative overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800">
            <Image
              src={prompt.image_url}
              alt={prompt.title}
              width={prompt.parameters.width}
              height={prompt.parameters.height}
              className="h-auto w-full object-contain"
              priority
            />
          </div>
        </div>

        <div className="lg:col-span-2">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
            {prompt.title}
          </h1>

          <div className="mt-2 flex items-center gap-3 text-sm text-zinc-500 dark:text-zinc-400">
            <span>
              oleh{" "}
              <span className="font-medium text-zinc-700 dark:text-zinc-300">
                {prompt.author.username}
              </span>
            </span>
            <span>&middot;</span>
            <time dateTime={prompt.created_at}>
              {new Date(prompt.created_at).toLocaleDateString("id-ID", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
          </div>

          {prompt.categories.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {prompt.categories.map((cat) => (
                <span
                  key={cat.id}
                  className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                >
                  {cat.name}
                </span>
              ))}
            </div>
          )}

          <div className="mt-6">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              Prompt
            </h2>
            <div className="mt-2 rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800/50">
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-800 dark:text-zinc-200">
                {prompt.prompt_text}
              </p>
            </div>
          </div>

          <PromptDetail promptText={prompt.prompt_text} promptId={prompt.id} />

          <div className="mt-6">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              Model
            </h2>
            <p className="mt-1 text-sm text-zinc-900 dark:text-white">
              {prompt.model}
            </p>
          </div>

          <div className="mt-6">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              Parameters
            </h2>
            <dl className="mt-2 grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-zinc-200 p-3 dark:border-zinc-700">
                <dt className="text-xs text-zinc-500 dark:text-zinc-400">
                  Steps
                </dt>
                <dd className="mt-0.5 text-sm font-medium text-zinc-900 dark:text-white">
                  {prompt.parameters.steps}
                </dd>
              </div>
              <div className="rounded-lg border border-zinc-200 p-3 dark:border-zinc-700">
                <dt className="text-xs text-zinc-500 dark:text-zinc-400">
                  CFG Scale
                </dt>
                <dd className="mt-0.5 text-sm font-medium text-zinc-900 dark:text-white">
                  {prompt.parameters.cfg_scale}
                </dd>
              </div>
              <div className="rounded-lg border border-zinc-200 p-3 dark:border-zinc-700">
                <dt className="text-xs text-zinc-500 dark:text-zinc-400">
                  Seed
                </dt>
                <dd className="mt-0.5 text-sm font-medium text-zinc-900 dark:text-white">
                  {prompt.parameters.seed}
                </dd>
              </div>
              <div className="rounded-lg border border-zinc-200 p-3 dark:border-zinc-700">
                <dt className="text-xs text-zinc-500 dark:text-zinc-400">
                  Size
                </dt>
                <dd className="mt-0.5 text-sm font-medium text-zinc-900 dark:text-white">
                  {prompt.parameters.width} x {prompt.parameters.height}
                </dd>
              </div>
              <div className="rounded-lg border border-zinc-200 p-3 dark:border-zinc-700">
                <dt className="text-xs text-zinc-500 dark:text-zinc-400">
                  Sampler
                </dt>
                <dd className="mt-0.5 text-sm font-medium text-zinc-900 dark:text-white">
                  {prompt.parameters.sampler}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {relatedPrompts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
            Related Prompts
          </h2>
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {relatedPrompts.map((rp) => (
              <Link
                key={rp.id}
                href={`/prompt/${rp.id}`}
                className="group overflow-hidden rounded-lg border border-zinc-200 bg-white transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="relative aspect-square overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                  <Image
                    src={rp.image_url}
                    alt={rp.title}
                    fill
                    sizes="(max-width: 640px) 50vw, 25vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-3">
                  <p className="text-sm font-medium text-zinc-900 dark:text-white">
                    {rp.title}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
