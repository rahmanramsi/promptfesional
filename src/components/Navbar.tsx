import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import NavbarActions from "./NavbarActions";

export default async function Navbar() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <nav className="border-b border-zinc-200 dark:border-zinc-800 px-6 py-3">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link
          href="/"
          className="text-lg font-bold text-black dark:text-zinc-50 no-underline"
        >
          Promptfesional
        </Link>
        <NavbarActions user={user} />
      </div>
    </nav>
  );
}
