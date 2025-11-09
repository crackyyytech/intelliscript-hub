/*
  # Add Advanced Features Tables

  1. New Tables
    - `git_commits`: Track code version history
    - `git_branches`: Manage project branches
    - `collaborative_sessions`: Track editing sessions
    - `user_cursors`: Real-time cursor positions
    - `comments`: Code comments and discussions
    - `dependencies`: Package management
    - `deployments`: Deployment history
    - `execution_logs`: Code execution logs
    - `terminal_history`: Terminal commands
    - `project_exports`: Exported archives

  2. Security
    - Enable RLS on all tables
    - Add policies for secure access
*/

CREATE TABLE IF NOT EXISTS public.git_commits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  branch TEXT DEFAULT 'main',
  message TEXT NOT NULL,
  file_changes JSONB DEFAULT '[]',
  commit_hash TEXT UNIQUE,
  parent_hash TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.git_commits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view commits in their projects"
  ON public.git_commits FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = git_commits.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create commits in their projects"
  ON public.git_commits FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = git_commits.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE TABLE IF NOT EXISTS public.git_branches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  head_commit_hash TEXT,
  is_main BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(project_id, name)
);

ALTER TABLE public.git_branches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view branches in their projects"
  ON public.git_branches FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = git_branches.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage branches in their projects"
  ON public.git_branches FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = git_branches.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE TABLE IF NOT EXISTS public.collaborative_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_key TEXT UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + INTERVAL '24 hours')
);

ALTER TABLE public.collaborative_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view collaborative sessions for their projects"
  ON public.collaborative_sessions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = collaborative_sessions.project_id
      AND projects.user_id = auth.uid()
    )
    OR auth.uid() = owner_id
  );

CREATE POLICY "Users can create sessions for their projects"
  ON public.collaborative_sessions FOR INSERT
  WITH CHECK (
    auth.uid() = owner_id
    AND EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = collaborative_sessions.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE TABLE IF NOT EXISTS public.user_cursors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.collaborative_sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  file_id UUID REFERENCES public.files(id) ON DELETE CASCADE,
  line_number INTEGER,
  column_number INTEGER,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.user_cursors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view cursors in their sessions"
  ON public.user_cursors FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.collaborative_sessions
      WHERE collaborative_sessions.id = user_cursors.session_id
      AND (collaborative_sessions.owner_id = auth.uid()
           OR EXISTS (
             SELECT 1 FROM public.projects
             WHERE projects.id = collaborative_sessions.project_id
             AND projects.user_id = auth.uid()
           ))
    )
  );

CREATE TABLE IF NOT EXISTS public.comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  file_id UUID NOT NULL REFERENCES public.files(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  line_number INTEGER NOT NULL,
  content TEXT NOT NULL,
  resolved BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view comments in their projects"
  ON public.comments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.files
      JOIN public.projects ON files.project_id = projects.id
      WHERE files.id = comments.file_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create comments in their projects"
  ON public.comments FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM public.files
      JOIN public.projects ON files.project_id = projects.id
      WHERE files.id = comments.file_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE TABLE IF NOT EXISTS public.dependencies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  package_name TEXT NOT NULL,
  version TEXT NOT NULL,
  package_type TEXT DEFAULT 'runtime',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(project_id, package_name)
);

ALTER TABLE public.dependencies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view dependencies in their projects"
  ON public.dependencies FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = dependencies.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage dependencies in their projects"
  ON public.dependencies FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = dependencies.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE TABLE IF NOT EXISTS public.deployments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending',
  platform TEXT NOT NULL,
  url TEXT,
  environment JSONB DEFAULT '{}',
  config JSONB DEFAULT '{}',
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);

ALTER TABLE public.deployments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view deployments for their projects"
  ON public.deployments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = deployments.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create deployments for their projects"
  ON public.deployments FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = deployments.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE TABLE IF NOT EXISTS public.execution_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'success',
  output TEXT,
  error_output TEXT,
  execution_time_ms INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.execution_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view execution logs for their projects"
  ON public.execution_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = execution_logs.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create execution logs for their projects"
  ON public.execution_logs FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = execution_logs.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE TABLE IF NOT EXISTS public.terminal_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  command TEXT NOT NULL,
  output TEXT,
  exit_code INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.terminal_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view terminal history for their projects"
  ON public.terminal_history FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = terminal_history.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can add to terminal history"
  ON public.terminal_history FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = terminal_history.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE TABLE IF NOT EXISTS public.project_exports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  export_type TEXT NOT NULL,
  export_data BYTEA,
  download_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + INTERVAL '7 days')
);

ALTER TABLE public.project_exports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their project exports"
  ON public.project_exports FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create exports for their projects"
  ON public.project_exports FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = project_exports.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE INDEX idx_git_commits_project_id ON public.git_commits(project_id);
CREATE INDEX idx_git_commits_branch ON public.git_commits(project_id, branch);
CREATE INDEX idx_git_branches_project_id ON public.git_branches(project_id);
CREATE INDEX idx_collaborative_sessions_project_id ON public.collaborative_sessions(project_id);
CREATE INDEX idx_user_cursors_session_id ON public.user_cursors(session_id);
CREATE INDEX idx_comments_file_id ON public.comments(file_id);
CREATE INDEX idx_dependencies_project_id ON public.dependencies(project_id);
CREATE INDEX idx_deployments_project_id ON public.deployments(project_id);
CREATE INDEX idx_deployments_status ON public.deployments(status);
CREATE INDEX idx_execution_logs_project_id ON public.execution_logs(project_id);
CREATE INDEX idx_terminal_history_project_id ON public.terminal_history(project_id);
CREATE INDEX idx_project_exports_project_id ON public.project_exports(project_id);
