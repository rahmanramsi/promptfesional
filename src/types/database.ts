export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      prompts: {
        Row: {
          id: string;
          title: string;
          prompt_text: string;
          image_url: string | null;
          model: string | null;
          parameters: Json | null;
          user_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          prompt_text: string;
          image_url?: string | null;
          model?: string | null;
          parameters?: Json | null;
          user_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          prompt_text?: string;
          image_url?: string | null;
          model?: string | null;
          parameters?: Json | null;
          user_id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "prompts_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      prompt_categories: {
        Row: {
          prompt_id: string;
          category_id: string;
        };
        Insert: {
          prompt_id: string;
          category_id: string;
        };
        Update: {
          prompt_id?: string;
          category_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "prompt_categories_prompt_id_fkey";
            columns: ["prompt_id"];
            referencedRelation: "prompts";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "prompt_categories_category_id_fkey";
            columns: ["category_id"];
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: {
          id: string;
          username: string | null;
          avatar_url: string | null;
          bio: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          username?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          username?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey";
            columns: ["id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

export type Prompt = Database["public"]["Tables"]["prompts"]["Row"];
export type Category = Database["public"]["Tables"]["categories"]["Row"];
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export type PromptWithDetails = Prompt & {
  profiles: Pick<Profile, "username" | "avatar_url"> | null;
  prompt_categories: Array<{
    categories: Pick<Category, "id" | "name" | "slug"> | null;
  }>;
};
