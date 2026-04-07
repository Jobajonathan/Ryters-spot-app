-- ============================================================
-- Fix: Missing columns on projects + messages + payments table
-- Run this in Supabase → SQL Editor
-- ============================================================

-- 1. Fix projects table: expand status check + add missing columns
ALTER TABLE public.projects DROP CONSTRAINT IF EXISTS projects_status_check;
ALTER TABLE public.projects
  ADD CONSTRAINT projects_status_check
  CHECK (status IN ('pending','in_review','accepted','in_progress','pending_balance','completed','cancelled'));

ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS service_subtype TEXT,
  ADD COLUMN IF NOT EXISTS brief_type TEXT DEFAULT 'text',
  ADD COLUMN IF NOT EXISTS word_count INTEGER,
  ADD COLUMN IF NOT EXISTS brief_file_path TEXT,
  ADD COLUMN IF NOT EXISTS dissertation_type TEXT DEFAULT 'own_topic',
  ADD COLUMN IF NOT EXISTS dissertation_field TEXT,
  ADD COLUMN IF NOT EXISTS dissertation_specialisation TEXT,
  ADD COLUMN IF NOT EXISTS urgency TEXT DEFAULT 'standard',
  ADD COLUMN IF NOT EXISTS budget_range TEXT,
  ADD COLUMN IF NOT EXISTS admin_notes TEXT,
  ADD COLUMN IF NOT EXISTS payment_instructions TEXT,
  ADD COLUMN IF NOT EXISTS deposit_amount NUMERIC(12,2),
  ADD COLUMN IF NOT EXISTS balance_amount NUMERIC(12,2),
  ADD COLUMN IF NOT EXISTS payment_currency TEXT DEFAULT 'NGN',
  ADD COLUMN IF NOT EXISTS work_started_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS expected_delivery_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS deliverable_path TEXT,
  ADD COLUMN IF NOT EXISTS ai_report_path TEXT,
  ADD COLUMN IF NOT EXISTS deposit_paid_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS balance_paid_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- 2. Fix messages table: add missing columns for admin/client tracking
ALTER TABLE public.messages
  ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS read_by_client BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS read_by_admin BOOLEAN DEFAULT false;

-- 3. Create payments table (new)
CREATE TABLE IF NOT EXISTS public.payments (
  id                  UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id          UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  client_id           UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  payment_type        TEXT NOT NULL CHECK (payment_type IN ('deposit', 'balance')),
  amount              NUMERIC(12,2) NOT NULL,
  currency            TEXT NOT NULL DEFAULT 'NGN',
  tx_ref              TEXT UNIQUE NOT NULL,
  flw_ref             TEXT,
  flw_transaction_id  TEXT,
  status              TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'successful', 'failed')),
  paid_at             TIMESTAMPTZ,
  created_at          TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Clients can see their own payments
DROP POLICY IF EXISTS "Clients can view own payments" ON public.payments;
CREATE POLICY "Clients can view own payments" ON public.payments
  FOR SELECT USING (auth.uid() = client_id);

-- Admins can view all payments
DROP POLICY IF EXISTS "Admins can view all payments" ON public.payments;
CREATE POLICY "Admins can view all payments" ON public.payments
  FOR SELECT USING (public.is_admin());

-- Admins can update payments (webhook updates via service role, this covers admin dashboard)
DROP POLICY IF EXISTS "Admins can update payments" ON public.payments;
CREATE POLICY "Admins can update payments" ON public.payments
  FOR UPDATE USING (public.is_admin());

-- 4. Fix messages RLS: admins need to read/write all project messages
DROP POLICY IF EXISTS "Admins can view all messages" ON public.messages;
CREATE POLICY "Admins can view all messages" ON public.messages
  FOR SELECT USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can send messages" ON public.messages;
CREATE POLICY "Admins can send messages" ON public.messages
  FOR INSERT WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can update messages" ON public.messages;
CREATE POLICY "Admins can update messages" ON public.messages
  FOR UPDATE USING (public.is_admin());

-- 5. Fix projects RLS: allow inserts by authenticated clients
DROP POLICY IF EXISTS "Clients can insert own projects" ON public.projects;
CREATE POLICY "Clients can insert own projects" ON public.projects
  FOR INSERT WITH CHECK (auth.uid() = client_id);

-- 6. Fix site_content table (used by CMS – may already exist from earlier migration)
CREATE TABLE IF NOT EXISTS public.site_content (
  key        TEXT PRIMARY KEY,
  label      TEXT,
  section    TEXT NOT NULL DEFAULT 'general',
  value      TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "site_content_public_read" ON public.site_content;
CREATE POLICY "site_content_public_read" ON public.site_content
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "site_content_admin_write" ON public.site_content;
CREATE POLICY "site_content_admin_write" ON public.site_content
  FOR ALL USING (public.is_admin());

-- Confirm
SELECT 'projects columns' AS check, COUNT(*) FROM information_schema.columns WHERE table_name = 'projects' AND table_schema = 'public';
SELECT 'messages columns' AS check, COUNT(*) FROM information_schema.columns WHERE table_name = 'messages' AND table_schema = 'public';
SELECT 'payments table' AS check, COUNT(*) FROM information_schema.tables WHERE table_name = 'payments' AND table_schema = 'public';
