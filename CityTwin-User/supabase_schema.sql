-- =========================================================================
-- CityTwin Supabase Schema Migration: User Data Table & Integrations
-- =========================================================================
-- Run this script in the Supabase SQL Editor (Dashboard -> SQL Editor -> New Query)
-- It creates the public.users table, configures RLS, and sets up automatic sync
-- with Supabase Auth (auth.users).
-- =========================================================================

-- 1. Create public.users table linked to auth.users(id)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  phone TEXT,
  avatar TEXT DEFAULT 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  role TEXT DEFAULT 'citizen',
  location JSONB DEFAULT '{"city": "Thane", "area": "Majiwada"}'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies
-- Allow anyone authenticated or public to read user public profiles
DROP POLICY IF EXISTS "Users profile read policy" ON public.users;
CREATE POLICY "Users profile read policy"
  ON public.users FOR SELECT
  USING (true);

-- Allow users to insert their own profile
DROP POLICY IF EXISTS "Users insert policy" ON public.users;
CREATE POLICY "Users insert policy"
  ON public.users FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Allow users to update their own profile
DROP POLICY IF EXISTS "Users update policy" ON public.users;
CREATE POLICY "Users update policy"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

-- Service role bypasses RLS automatically

-- 4. Automatic sync Trigger function from auth.users -> public.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name, avatar, role, location)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'avatar', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'),
    COALESCE(NEW.raw_user_meta_data->>'role', 'citizen'),
    COALESCE(NEW.raw_user_meta_data->'location', '{"city": "Thane", "area": "Majiwada"}'::jsonb)
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    name = EXCLUDED.name,
    avatar = EXCLUDED.avatar,
    updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger whenever a user signs up via Supabase Auth
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 5. Backfill existing auth users into public.users
INSERT INTO public.users (id, email, name, avatar, role, location)
SELECT 
  id, 
  email, 
  COALESCE(raw_user_meta_data->>'name', split_part(email, '@', 1)),
  COALESCE(raw_user_meta_data->>'avatar', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'),
  COALESCE(raw_user_meta_data->>'role', 'citizen'),
  COALESCE(raw_user_meta_data->'location', '{"city": "Thane", "area": "Majiwada"}'::jsonb)
FROM auth.users
ON CONFLICT (id) DO NOTHING;

-- Verification query
SELECT id, email, name, role, created_at FROM public.users LIMIT 10;
