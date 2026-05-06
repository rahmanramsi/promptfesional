import { createClient } from "./server"
import type { PromptWithDetails, Category } from "@/types/database"

const PAGE_SIZE = 12

interface FetchPromptsParams {
  page?: number
  search?: string
  category?: string
  sort?: string
}

interface FetchPromptsResult {
  prompts: PromptWithDetails[]
  totalCount: number
  totalPages: number
  currentPage: number
}

export async function fetchPrompts(
  params: FetchPromptsParams
): Promise<FetchPromptsResult> {
  const supabase = await createClient()
  const page = params.page ?? 1
  const search = params.search ?? ""
  const category = params.category ?? ""
  const sort = params.sort ?? "newest"
  const from = (page - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  let query = supabase
    .from("prompts")
    .select(
      `*, profiles(username, avatar_url), prompt_categories(categories(id, name, slug))`,
      { count: "exact" }
    )

  if (search) {
    query = query.or(
      `title.ilike.%${search}%,prompt_text.ilike.%${search}%`
    )
  }

  if (category) {
    query = query.filter(
      "prompt_categories.categories.slug",
      "eq",
      category
    )
  }

  if (sort === "newest") {
    query = query.order("created_at", { ascending: false })
  }

  query = query.range(from, to)

  const { data, error, count } = await query

  if (error) {
    console.error("Error fetching prompts:", error)
    return { prompts: [], totalCount: 0, totalPages: 0, currentPage: page }
  }

  const totalCount = count ?? 0
  const totalPages = Math.ceil(totalCount / PAGE_SIZE)

  return {
    prompts: (data as PromptWithDetails[]) ?? [],
    totalCount,
    totalPages,
    currentPage: page,
  }
}

export async function fetchCategories(): Promise<Category[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("name")

  if (error) {
    console.error("Error fetching categories:", error)
    return []
  }

  return data ?? []
}
