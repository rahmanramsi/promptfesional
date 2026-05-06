export interface Prompt {
  id: string;
  title: string;
  prompt_text: string;
  image_url: string;
  model: string;
  parameters: PromptParameters;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface PromptParameters {
  steps: number;
  cfg_scale: number;
  seed: number;
  width: number;
  height: number;
  sampler: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

export interface Profile {
  id: string;
  username: string;
  avatar_url: string | null;
  bio: string | null;
  created_at: string;
}

export interface PromptWithAuthor extends Prompt {
  author: Pick<Profile, "username" | "avatar_url">;
  categories: Pick<Category, "id" | "name" | "slug">[];
}
