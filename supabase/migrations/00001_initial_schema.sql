-- Migration: Initial schema for Promptfesional
-- Creates tables for prompts, categories, prompt_categories junction, and profiles

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- Categories table
-- ============================================================
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- Prompts table
-- ============================================================
CREATE TABLE IF NOT EXISTS public.prompts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  prompt_text TEXT NOT NULL,
  image_url TEXT,
  model TEXT,
  parameters JSONB DEFAULT '{}'::jsonb,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- Prompt-Categories junction table
-- ============================================================
CREATE TABLE IF NOT EXISTS public.prompt_categories (
  prompt_id UUID NOT NULL REFERENCES public.prompts(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  PRIMARY KEY (prompt_id, category_id)
);

-- ============================================================
-- Profiles table (extends auth.users)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- Indexes
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_prompts_user_id ON public.prompts(user_id);
CREATE INDEX IF NOT EXISTS idx_prompts_created_at ON public.prompts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_prompt_categories_prompt_id ON public.prompt_categories(prompt_id);
CREATE INDEX IF NOT EXISTS idx_prompt_categories_category_id ON public.prompt_categories(category_id);

-- ============================================================
-- updated_at trigger for prompts
-- ============================================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.prompts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- Row Level Security (RLS)
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE public.prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prompt_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- ----------
-- Prompts RLS
-- ----------

-- Anyone can read prompts
CREATE POLICY "Prompts are viewable by everyone"
  ON public.prompts
  FOR SELECT
  USING (true);

-- Authenticated users can create their own prompts
CREATE POLICY "Users can create their own prompts"
  ON public.prompts
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own prompts
CREATE POLICY "Users can update their own prompts"
  ON public.prompts
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own prompts
CREATE POLICY "Users can delete their own prompts"
  ON public.prompts
  FOR DELETE
  USING (auth.uid() = user_id);

-- ----------
-- Categories RLS
-- ----------

-- Anyone can read categories
CREATE POLICY "Categories are viewable by everyone"
  ON public.categories
  FOR SELECT
  USING (true);

-- Only authenticated users can create categories
CREATE POLICY "Authenticated users can create categories"
  ON public.categories
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Only authenticated users can update categories
CREATE POLICY "Authenticated users can update categories"
  ON public.categories
  FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Only authenticated users can delete categories
CREATE POLICY "Authenticated users can delete categories"
  ON public.categories
  FOR DELETE
  USING (auth.role() = 'authenticated');

-- ----------
-- Prompt-Categories RLS
-- ----------

-- Anyone can read prompt-category associations
CREATE POLICY "Prompt-categories are viewable by everyone"
  ON public.prompt_categories
  FOR SELECT
  USING (true);

-- Users can link their own prompts to categories
CREATE POLICY "Users can link their own prompts to categories"
  ON public.prompt_categories
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.prompts
      WHERE prompts.id = prompt_categories.prompt_id
      AND prompts.user_id = auth.uid()
    )
  );

-- Users can unlink their own prompts from categories
CREATE POLICY "Users can unlink their own prompts from categories"
  ON public.prompt_categories
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.prompts
      WHERE prompts.id = prompt_categories.prompt_id
      AND prompts.user_id = auth.uid()
    )
  );

-- ----------
-- Profiles RLS
-- ----------

-- Anyone can read profiles
CREATE POLICY "Profiles are viewable by everyone"
  ON public.profiles
  FOR SELECT
  USING (true);

-- Users can create their own profile
CREATE POLICY "Users can create their own profile"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update their own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ============================================================
-- Auto-create profile on user signup
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
