"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useCallback } from "react"

export default function SortSelect() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const activeSort = searchParams.get("sort") ?? "newest"

  const handleSortChange = useCallback(
    (sort: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (sort && sort !== "newest") {
        params.set("sort", sort)
      } else {
        params.delete("sort")
      }
      params.delete("page")
      router.push(`/?${params.toString()}`)
    },
    [router, searchParams]
  )

  return (
    <select
      value={activeSort}
      onChange={(e) => handleSortChange(e.target.value)}
      className="px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs font-medium text-zinc-700 dark:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 cursor-pointer"
    >
      <option value="newest">Terbaru</option>
      <option value="popular" disabled>
        Terpopuler (soon)
      </option>
    </select>
  )
}
