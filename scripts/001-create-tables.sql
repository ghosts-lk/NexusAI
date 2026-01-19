-- NexusAI Database Schema
-- AI-Powered Productivity Workspace

-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro', 'enterprise')),
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  ai_credits_used INTEGER DEFAULT 0,
  ai_credits_limit INTEGER DEFAULT 50,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Workspaces table
CREATE TABLE IF NOT EXISTS workspaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT DEFAULT 'folder',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on workspaces
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;

-- RLS Policies for workspaces
CREATE POLICY "Users can view their own workspaces" ON workspaces FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own workspaces" ON workspaces FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own workspaces" ON workspaces FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own workspaces" ON workspaces FOR DELETE USING (auth.uid() = user_id);

-- Documents table (AI-powered notes)
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  workspace_id UUID REFERENCES workspaces(id) ON DELETE SET NULL,
  title TEXT NOT NULL DEFAULT 'Untitled',
  content TEXT DEFAULT '',
  ai_summary TEXT,
  is_favorite BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on documents
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- RLS Policies for documents
CREATE POLICY "Users can view their own documents" ON documents FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own documents" ON documents FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own documents" ON documents FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own documents" ON documents FOR DELETE USING (auth.uid() = user_id);

-- AI Chat History table
CREATE TABLE IF NOT EXISTS ai_chats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
  messages JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on ai_chats
ALTER TABLE ai_chats ENABLE ROW LEVEL SECURITY;

-- RLS Policies for ai_chats
CREATE POLICY "Users can view their own chats" ON ai_chats FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own chats" ON ai_chats FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own chats" ON ai_chats FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own chats" ON ai_chats FOR DELETE USING (auth.uid() = user_id);

-- Tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  workspace_id UUID REFERENCES workspaces(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'done')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  due_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on tasks
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- RLS Policies for tasks
CREATE POLICY "Users can view their own tasks" ON tasks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own tasks" ON tasks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own tasks" ON tasks FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own tasks" ON tasks FOR DELETE USING (auth.uid() = user_id);

-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
