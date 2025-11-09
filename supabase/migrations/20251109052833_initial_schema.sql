/*
  # Initial Database Schema

  1. New Tables
    - `profiles`: User profile data
    - `projects`: User code projects
    - `files`: Project files

  2. Security
    - Enable RLS on all tables
    - Add policies for user-owned data access
*/

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  template TEXT DEFAULT 'blank',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own projects"
  ON public.projects FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create projects"
  ON public.projects FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own projects"
  ON public.projects FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own projects"
  ON public.projects FOR DELETE
  USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  path TEXT NOT NULL,
  content TEXT NOT NULL DEFAULT '',
  language TEXT DEFAULT 'typescript',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(project_id, path)
);

ALTER TABLE public.files ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view files in their projects"
  ON public.files FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = files.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create files in their projects"
  ON public.files FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = files.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update files in their projects"
  ON public.files FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = files.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete files in their projects"
  ON public.files FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = files.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_files_updated_at
  BEFORE UPDATE ON public.files
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_projects_user_id ON public.projects(user_id);
CREATE INDEX idx_files_project_id ON public.files(project_id);
CREATE INDEX idx_files_path ON public.files(project_id, path);
