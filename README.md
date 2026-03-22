# Ryters Spot App

Phase 1 conversion from static HTML to Next.js 14 + Supabase.

## Prerequisites

- Node.js 18+
- A Supabase account (free tier works)

## Setup Steps

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy `.env.example` to `.env.local` and fill in your Supabase credentials:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3. Set up Supabase (3 steps)

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **Settings > API** and copy your Project URL and anon key into `.env.local`
3. Go to **SQL Editor**, paste the contents of `supabase/schema.sql` and click **Run**

### 4. Start the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## What Works Without Supabase Keys

All public pages work without Supabase configured:
- Home, About, Services, Blog, Contact, Privacy, Terms
- Auth forms render correctly

Dashboard requires valid Supabase credentials and a logged-in session.

## Deployment

Deploy to Vercel: import from GitHub and add environment variables in the Vercel dashboard. Set `NEXT_PUBLIC_SITE_URL` to your production domain.
