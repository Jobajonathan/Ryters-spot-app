-- ============================================================
-- Admin Phase 2: Services, Blog, and Site Settings tables
-- Run in Supabase → SQL Editor
-- ============================================================

-- 1. Services catalogue with multi-currency pricing
CREATE TABLE IF NOT EXISTS public.services (
  id           UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name         TEXT NOT NULL,
  slug         TEXT UNIQUE,
  category     TEXT NOT NULL,
  description  TEXT,
  price_gbp    DECIMAL(12,2),
  price_usd    DECIMAL(12,2),
  price_eur    DECIMAL(12,2),
  price_ngn    DECIMAL(12,2),
  is_active    BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at   TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at   TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Blog posts
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id           UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title        TEXT NOT NULL,
  slug         TEXT UNIQUE NOT NULL,
  excerpt      TEXT,
  content      TEXT,
  cover_image  TEXT,
  author_id    UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  category     TEXT,
  tags         TEXT[],
  status       TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  published_at TIMESTAMP WITH TIME ZONE,
  created_at   TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at   TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Site settings (key-value store for CMS)
CREATE TABLE IF NOT EXISTS public.site_settings (
  key         TEXT PRIMARY KEY,
  value       TEXT,
  updated_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ── RLS ────────────────────────────────────────────────────

-- Services: public read, admin write
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Services are publicly readable" ON public.services FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage services" ON public.services FOR ALL USING (public.is_admin());

-- Blog posts: published posts are public, admins manage all
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published posts are public" ON public.blog_posts FOR SELECT USING (status = 'published');
CREATE POLICY "Admins can manage all posts" ON public.blog_posts FOR ALL USING (public.is_admin());

-- Site settings: public read, admin write
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Settings are public" ON public.site_settings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins can manage settings" ON public.site_settings FOR ALL USING (public.is_admin());

-- ── Seed: Initial services ──────────────────────────────────

INSERT INTO public.services (name, slug, category, description, price_gbp, price_usd, price_eur, price_ngn, display_order)
VALUES
  ('Undergraduate Project Writing',
   'undergraduate-project-writing',
   'Academic Writing',
   'Full project writing support for undergraduate dissertations and final year projects. Includes topic selection, research, writing, and formatting.',
   350, 450, 420, 700000, 1),

  ('Postgraduate Dissertation Writing',
   'postgraduate-dissertation-writing',
   'Academic Writing',
   'Comprehensive writing support for Masters and PhD dissertations. Research design, literature review, data analysis, and write-up.',
   650, 820, 760, 1300000, 2),

  ('Turnitin Plagiarism Check',
   'turnitin-check',
   'Turnitin & Plagiarism',
   'Full Turnitin similarity report with detailed analysis. Includes one round of revision recommendations.',
   25, 32, 29, 50000, 3),

  ('Postgraduate Writing + Turnitin Bundle',
   'postgraduate-bundle',
   'Academic Writing',
   'Complete postgraduate dissertation writing service bundled with Turnitin check and plagiarism report.',
   670, 840, 780, 1340000, 4),

  ('Research & Academic Writing',
   'research-academic',
   'Research Services',
   'Expert research support including literature reviews, data collection, analysis, and academic paper writing across all disciplines.',
   280, 360, 330, 560000, 5),

  ('Digital Transformation Consulting',
   'digital-transformation',
   'Digital Transformation',
   'Strategic advisory for organisations adopting digital tools, automation, and technology-first operating models.',
   1200, 1500, 1400, 2400000, 6),

  ('Product & Project Management Services',
   'product-project-management',
   'Product Management',
   'End-to-end product and project management including roadmapping, stakeholder alignment, Agile delivery, and reporting.',
   950, 1200, 1100, 1900000, 7),

  ('AI Automation & Implementation',
   'ai-automation',
   'AI & Automation',
   'Custom AI workflow automation, prompt engineering, LLM integration, and AI strategy for businesses and institutions.',
   1500, 1900, 1750, 3000000, 8),

  ('Ed-Tech Curriculum Design',
   'edtech-curriculum',
   'Ed-Tech',
   'Design and development of digital learning programmes, e-learning modules, and technology-enhanced curriculum frameworks.',
   800, 1000, 950, 1600000, 9)

ON CONFLICT (slug) DO NOTHING;

-- Confirm
SELECT name, category, price_gbp, price_usd, price_ngn FROM public.services ORDER BY display_order;
