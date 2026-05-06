import { createClient } from "@/lib/supabase/client";
import type { PromptWithAuthor, PromptParameters } from "@/types/database";

const defaultParams: PromptParameters = {
  steps: 50,
  cfg_scale: 7.5,
  seed: 12345,
  width: 1024,
  height: 1024,
  sampler: "DPM++ 2M Karras",
};

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

function parseParams(params: unknown): PromptParameters {
  if (typeof params === "object" && params !== null) {
    const p = params as Record<string, unknown>;
    return {
      steps: typeof p.steps === "number" ? p.steps : defaultParams.steps,
      cfg_scale: typeof p.cfg_scale === "number" ? p.cfg_scale : defaultParams.cfg_scale,
      seed: typeof p.seed === "number" ? p.seed : defaultParams.seed,
      width: typeof p.width === "number" ? p.width : defaultParams.width,
      height: typeof p.height === "number" ? p.height : defaultParams.height,
      sampler: typeof p.sampler === "string" ? p.sampler : defaultParams.sampler,
    };
  }
  return defaultParams;
}

function mapPrompt(item: Record<string, unknown>): PromptWithAuthor {
  const profiles = (item.profiles as Record<string, unknown> | null) ?? {};
  const promptCategories = (item.prompt_categories as Array<{
    categories: { id: string; name: string; slug: string } | null;
  }> | null) ?? [];

  return {
    id: item.id as string,
    title: item.title as string,
    prompt_text: item.prompt_text as string,
    image_url: (item.image_url as string) ?? "",
    model: (item.model as string) ?? "Unknown",
    parameters: parseParams(item.parameters),
    user_id: item.user_id as string,
    created_at: item.created_at as string,
    updated_at: item.updated_at as string,
    author: {
      username: (profiles.username as string) ?? "unknown",
      avatar_url: (profiles.avatar_url as string | null) ?? null,
    },
    categories: promptCategories
      .filter((pc) => pc.categories !== null)
      .map((pc) => pc.categories!),
  };
}

export async function getPromptById(
  id: string
): Promise<PromptWithAuthor | null> {
  const supabase = createClient();

  if (supabase) {
    const { data, error } = await supabase
      .from("prompts")
      .select(
        `
        *,
        profiles(username, avatar_url),
        prompt_categories(categories(id, name, slug))
      `
      )
      .eq("id", id)
      .single();

    if (error || !data) return null;

    return mapPrompt(data as Record<string, unknown>);
  }

  return mockPrompts.find((p) => p.id === id) ?? null;
}

export async function getRelatedPrompts(
  currentId: string,
  limit = 4
): Promise<PromptWithAuthor[]> {
  const supabase = createClient();

  if (supabase) {
    const { data } = await supabase
      .from("prompts")
      .select(
        `
        *,
        profiles(username, avatar_url),
        prompt_categories(categories(id, name, slug))
      `
      )
      .neq("id", currentId)
      .limit(limit);

    if (!data) return [];

    return data.map((item) => mapPrompt(item as Record<string, unknown>));
  }

  return mockPrompts.filter((p) => p.id !== currentId).slice(0, limit);
}

export async function getAllPrompts(): Promise<PromptWithAuthor[]> {
  const supabase = createClient();

  if (supabase) {
    const { data } = await supabase
      .from("prompts")
      .select(
        `
        *,
        profiles(username, avatar_url),
        prompt_categories(categories(id, name, slug))
      `
      );

    if (!data) return mockPrompts;

    return data.map((item) => mapPrompt(item as Record<string, unknown>));
  }

  return mockPrompts;
}
