import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Promptfesional",
};

export default function Home() {
  return (
    <main className="flex flex-1 items-center justify-center">
      <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50">
        Promptfesional
      </h1>
    </main>
  );
}
