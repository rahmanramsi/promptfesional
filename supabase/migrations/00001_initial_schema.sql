-- profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles are viewable by everyone" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- categories table
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Categories are viewable by everyone" ON public.categories
  FOR SELECT USING (true);

-- prompts table
CREATE TABLE public.prompts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  prompt_text TEXT NOT NULL,
  image_url TEXT NOT NULL,
  model TEXT NOT NULL,
  parameters JSONB,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.prompts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Prompts are viewable by everyone" ON public.prompts
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert prompts" ON public.prompts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own prompts" ON public.prompts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own prompts" ON public.prompts
  FOR DELETE USING (auth.uid() = user_id);

-- prompt_categories junction table
CREATE TABLE public.prompt_categories (
  prompt_id UUID NOT NULL REFERENCES public.prompts(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  PRIMARY KEY (prompt_id, category_id)
);

ALTER TABLE public.prompt_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Prompt categories are viewable by everyone" ON public.prompt_categories
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert prompt categories" ON public.prompt_categories
  FOR INSERT WITH CHECK (
    auth.uid() = (SELECT user_id FROM public.prompts WHERE id = prompt_id)
  );

CREATE POLICY "Users can delete own prompt categories" ON public.prompt_categories
  FOR DELETE USING (
    auth.uid() = (SELECT user_id FROM public.prompts WHERE id = prompt_id)
  );

-- indexes
CREATE INDEX idx_prompts_created_at ON public.prompts (created_at DESC);
CREATE INDEX idx_prompts_user_id ON public.prompts (user_id);
CREATE INDEX idx_prompts_title ON public.prompts (title);
CREATE INDEX idx_prompt_categories_category_id ON public.prompt_categories (category_id);
CREATE INDEX idx_categories_slug ON public.categories (slug);

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_prompts_updated_at
  BEFORE UPDATE ON public.prompts
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();
