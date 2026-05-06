import { PromptWithAuthor } from "@/types/database";
import { getSupabaseClient } from "@/lib/supabase/client";

const mockPrompts: PromptWithAuthor[] = [
  {
    id: "1",
    title: "Cyberpunk City at Night",
    prompt_text:
      "A futuristic cyberpunk city at night with neon signs, flying cars, and rain-soaked streets. Ultra detailed, octane render, 8k resolution.",
    image_url:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80",
    model: "Stable Diffusion XL",
    parameters: {
      steps: 50,
      cfg_scale: 7.5,
      seed: 12345,
      width: 1024,
      height: 1024,
      sampler: "DPM++ 2M Karras",
    },
    user_id: "user-1",
    created_at: "2026-04-15T10:30:00Z",
    updated_at: "2026-04-15T10:30:00Z",
    author: {
      username: "neonartist",
      avatar_url: null,
    },
    categories: [
      { id: "cat-1", name: "Cyberpunk", slug: "cyberpunk" },
      { id: "cat-2", name: "Landscape", slug: "landscape" },
    ],
  },
  {
    id: "2",
    title: "Mystical Forest Elf",
    prompt_text:
      "A beautiful elf in a mystical forest, surrounded by glowing mushrooms and magical particles. Fantasy art, digital painting, intricate details.",
    image_url:
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&q=80",
    model: "Midjourney v6",
    parameters: {
      steps: 40,
      cfg_scale: 8.0,
      seed: 67890,
      width: 1024,
      height: 1024,
      sampler: "Euler A",
    },
    user_id: "user-2",
    created_at: "2026-04-20T14:00:00Z",
    updated_at: "2026-04-20T14:00:00Z",
    author: {
      username: "fantasycreator",
      avatar_url: null,
    },
    categories: [
      { id: "cat-3", name: "Fantasy", slug: "fantasy" },
      { id: "cat-4", name: "Characters", slug: "characters" },
    ],
  },
  {
    id: "3",
    title: "Minimalist Interior Design",
    prompt_text:
      "Minimalist modern interior design with natural light, wooden floors, and indoor plants. Photorealistic architectural rendering, 4k.",
    image_url:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80",
    model: "DALL-E 3",
    parameters: {
      steps: 30,
      cfg_scale: 7.0,
      seed: 24680,
      width: 1024,
      height: 1024,
      sampler: "DDIM",
    },
    user_id: "user-3",
    created_at: "2026-05-01T08:00:00Z",
    updated_at: "2026-05-01T08:00:00Z",
    author: {
      username: "designstudio",
      avatar_url: null,
    },
    categories: [
      { id: "cat-5", name: "Interior", slug: "interior" },
      { id: "cat-6", name: "Architecture", slug: "architecture" },
    ],
  },
];

export async function getPromptById(
  id: string
): Promise<PromptWithAuthor | null> {
  const supabase = getSupabaseClient();

  if (supabase) {
    const { data, error } = await supabase
      .from("prompts")
      .select(
        `
        *,
        author:profiles(username, avatar_url),
        categories:prompt_categories(category:categories(id, name, slug))
      `
      )
      .eq("id", id)
      .single();

    if (error || !data) return null;

    return {
      ...data,
      author: data.author,
      categories: data.categories?.map(
        (pc: { category: { id: string; name: string; slug: string } }) =>
          pc.category
      ),
    } as PromptWithAuthor;
  }

  return mockPrompts.find((p) => p.id === id) ?? null;
}

export async function getRelatedPrompts(
  currentId: string,
  limit = 4
): Promise<PromptWithAuthor[]> {
  const supabase = getSupabaseClient();

  if (supabase) {
    const { data } = await supabase
      .from("prompts")
      .select(
        `
        *,
        author:profiles(username, avatar_url),
        categories:prompt_categories(category:categories(id, name, slug))
      `
      )
      .neq("id", currentId)
      .limit(limit);

    if (!data) return [];

    return data.map((item: Record<string, unknown>) => ({
      ...item,
      author: item.author,
      categories: (item.categories as Array<{ category: { id: string; name: string; slug: string } }>)?.map(
        (pc) => pc.category
      ),
    })) as PromptWithAuthor[];
  }

  return mockPrompts.filter((p) => p.id !== currentId).slice(0, limit);
}

export async function getAllPrompts(): Promise<PromptWithAuthor[]> {
  const supabase = getSupabaseClient();

  if (supabase) {
    const { data } = await supabase.from("prompts").select(`
        *,
        author:profiles(username, avatar_url),
        categories:prompt_categories(category:categories(id, name, slug))
      `);

    if (!data) return mockPrompts;

    return data.map((item: Record<string, unknown>) => ({
      ...item,
      author: item.author,
      categories: (item.categories as Array<{ category: { id: string; name: string; slug: string } }>)?.map(
        (pc) => pc.category
      ),
    })) as PromptWithAuthor[];
  }

  return mockPrompts;
}
