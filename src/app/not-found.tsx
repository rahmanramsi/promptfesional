import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 - Halaman Tidak Ditemukan",
};

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-24 text-center">
      <h1 className="text-6xl font-bold text-zinc-900 dark:text-white">
        404
      </h1>
      <p className="mt-4 text-lg text-zinc-500 dark:text-zinc-400">
        Halaman tidak ditemukan.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
      >
        &larr; Kembali ke Gallery
      </Link>
    </div>
  );
}
