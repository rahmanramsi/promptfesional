import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-black">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
        <Link
          href="/"
          className="text-xl font-bold text-zinc-900 dark:text-zinc-50"
        >
          Promptfesional
        </Link>
      </div>
    </nav>
  );
}
