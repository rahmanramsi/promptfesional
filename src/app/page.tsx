import { Suspense } from "react";
import { fetchPrompts, fetchCategories } from "@/lib/supabase/queries";
import SearchBar from "@/components/SearchBar";
import CategoryFilter from "@/components/CategoryFilter";
import SortSelect from "@/components/SortSelect";
import PromptGrid from "@/components/PromptGrid";
import Pagination from "@/components/Pagination";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import EmptyState from "@/components/EmptyState";

interface HomeProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const search = typeof params.q === "string" ? params.q : "";
  const category = typeof params.category === "string" ? params.category : "";
  const sort = typeof params.sort === "string" ? params.sort : "newest";

  const promptsData = await fetchPrompts({ page, search, category, sort });

  const { prompts, totalPages, currentPage } = promptsData;
  const hasSearch = !!(search || category);

  return (
    <div className="flex flex-col flex-1">
      <section className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            Promptfesional
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Discover and share AI image prompts
          </p>
        </div>
      </section>

      <div className="flex-1 max-w-7xl mx-auto px-4 py-6 w-full">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
          <SearchBar />
          <div className="flex items-center gap-3 ml-auto">
            <SortSelect />
          </div>
        </div>

        <Suspense fallback={<div />}>
          <CategoriesSection />
        </Suspense>

        <div className="mt-6">
          <Suspense fallback={<LoadingSkeleton />}>
            {prompts.length > 0 ? (
              <>
                <PromptGrid prompts={prompts} />
                <Pagination currentPage={currentPage} totalPages={totalPages} />
              </>
            ) : (
              <EmptyState hasSearch={hasSearch} />
            )}
          </Suspense>
        </div>
      </div>
    </div>
  );
}

async function CategoriesSection() {
  const categories = await fetchCategories();
  if (categories.length === 0) return null;
  return (
    <div className="overflow-x-auto pb-2">
      <CategoryFilter categories={categories} />
    </div>
  );
}
