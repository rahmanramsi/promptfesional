export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      prompts: {
        Row: {
          id: string
          title: string
          prompt_text: string
          image_url: string
          model: string
          parameters: Json | null
          user_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          prompt_text: string
          image_url: string
          model: string
          parameters?: Json | null
          user_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          prompt_text?: string
          image_url?: string
          model?: string
          parameters?: Json | null
          user_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          created_at?: string
        }
      }
      prompt_categories: {
        Row: {
          prompt_id: string
          category_id: string
        }
        Insert: {
          prompt_id: string
          category_id: string
        }
        Update: {
          prompt_id?: string
          category_id?: string
        }
      }
      profiles: {
        Row: {
          id: string
          username: string
          avatar_url: string | null
          bio: string | null
          created_at: string
        }
        Insert: {
          id: string
          username: string
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          username?: string
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
        }
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}

export type Prompt = Database["public"]["Tables"]["prompts"]["Row"]
export type Category = Database["public"]["Tables"]["categories"]["Row"]
export type Profile = Database["public"]["Tables"]["profiles"]["Row"]

export type PromptWithDetails = Prompt & {
  profiles: Pick<Profile, "username" | "avatar_url"> | null
  prompt_categories: Array<{
    categories: Pick<Category, "id" | "name" | "slug"> | null
  }>
}
