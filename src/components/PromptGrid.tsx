import PromptCard from "./PromptCard"
import type { PromptWithDetails } from "@/types/database"

interface PromptGridProps {
  prompts: PromptWithDetails[]
}

export default function PromptGrid({ prompts }: PromptGridProps) {
  if (prompts.length === 0) {
    return null
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {prompts.map((prompt) => (
        <PromptCard key={prompt.id} prompt={prompt} />
      ))}
    </div>
  )
}
