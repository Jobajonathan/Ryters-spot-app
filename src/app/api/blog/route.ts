import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const slug = url.searchParams.get('slug')

    if (slug) {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*, profiles:author_id(full_name)')
        .eq('slug', slug)
        .eq('status', 'published')
        .single()
      if (error || !data) return NextResponse.json({ error: 'Post not found.' }, { status: 404 })
      return NextResponse.json({ ...data, author_name: data.profiles?.full_name })
    }

    const { data, error } = await supabase
      .from('blog_posts')
      .select('id, title, slug, excerpt, category, published_at, created_at, profiles:author_id(full_name)')
      .eq('status', 'published')
      .order('published_at', { ascending: false })

    if (error) return NextResponse.json([])
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return NextResponse.json(data?.map((p: any) => ({ ...p, author_name: p.profiles?.full_name })) || [])
  } catch {
    return NextResponse.json([])
  }
}
