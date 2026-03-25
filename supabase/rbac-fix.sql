-- ============================================================
-- RBAC Fix: Superadmin role + RLS infinite recursion fix
-- Run this in Supabase → SQL Editor
-- ============================================================

-- 1. Add 'superadmin' to the role constraint
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_role_check
  CHECK (role IN ('client', 'admin', 'superadmin'));

-- 2. Set jonathan@theryters.com as superadmin
UPDATE public.profiles
  SET role = 'superadmin'
  WHERE email = 'jonathan@theryters.com';

-- Confirm the update worked (should return 1 row with role = superadmin)
SELECT id, email, role FROM public.profiles WHERE email = 'jonathan@theryters.com';

-- 3. Fix the infinite recursion: create SECURITY DEFINER functions
--    These bypass RLS so policies don't loop on themselves

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT COALESCE(
    (SELECT role IN ('admin', 'superadmin')
     FROM public.profiles
     WHERE id = auth.uid()),
    false
  );
$$;

CREATE OR REPLACE FUNCTION public.is_superadmin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT COALESCE(
    (SELECT role = 'superadmin'
     FROM public.profiles
     WHERE id = auth.uid()),
    false
  );
$$;

-- 4. Fix RLS policies on profiles (drop recursive ones, recreate safely)
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (public.is_admin());

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can update any profile" ON public.profiles
  FOR UPDATE USING (public.is_admin());

-- 5. Fix RLS policies on projects table
DROP POLICY IF EXISTS "Admins can view all projects" ON public.projects;
DROP POLICY IF EXISTS "Admins can update all projects" ON public.projects;

CREATE POLICY "Admins can view all projects" ON public.projects
  FOR SELECT USING (public.is_admin());

CREATE POLICY "Admins can update all projects" ON public.projects
  FOR UPDATE USING (public.is_admin());

-- 6. Fix RLS policies on project_files if exists
DROP POLICY IF EXISTS "Admins can view all project files" ON public.project_files;

CREATE POLICY "Admins can view all project files" ON public.project_files
  FOR SELECT USING (public.is_admin());

-- Done! Verify:
SELECT email, role FROM public.profiles WHERE role IN ('admin', 'superadmin');
