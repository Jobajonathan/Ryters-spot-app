import { NextResponse } from 'next/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

const adminSupabase = createAdminClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function getUser() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: (c) => c.forEach(({ name, value, options }) => cookieStore.set(name, value, options)) } }
  )
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

async function isAdmin(userId: string) {
  const { data } = await adminSupabase.from('profiles').select('role').eq('id', userId).single()
  return data?.role && ['admin', 'superadmin', 'content'].includes(data.role)
}

function makeSlug(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now().toString(36)
}

// GET — list all posts (or single post by id)
export async function GET(request: Request) {
  try {
    const user = await getUser()
    if (!user || !(await isAdmin(user.id))) return NextResponse.json({ error: 'Unauthorised' }, { status: 403 })

    const url = new URL(request.url)
    const id = url.searchParams.get('id')

    if (id) {
      const { data, error } = await adminSupabase.from('blog_posts').select('*, profiles(full_name)').eq('id', id).single()
      if (error) return NextResponse.json({ error: 'Post not found.' }, { status: 404 })
      return NextResponse.json({ ...data, author_name: data.profiles?.full_name })
    }

    const { data, error } = await adminSupabase
      .from('blog_posts')
      .select('id, title, excerpt, category, status, published_at, created_at, profiles(full_name)')
      .order('created_at', { ascending: false })

    if (error) return NextResponse.json({ error: 'Could not load posts.' }, { status: 500 })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return NextResponse.json(data?.map((p: any) => ({ ...p, author_name: p.profiles?.full_name })) || [])
  } catch (err) {
    console.error('GET /api/admin/blog error:', err)
    return NextResponse.json({ error: 'Could not load posts.' }, { status: 500 })
  }
}

// POST — create post
export async function POST(request: Request) {
  try {
    const user = await getUser()
    if (!user || !(await isAdmin(user.id))) return NextResponse.json({ error: 'Unauthorised' }, { status: 403 })

    const body = await request.json()
    const { title, excerpt, content, category, status } = body
    if (!title) return NextResponse.json({ error: 'Title is required.' }, { status: 400 })

    const slug = makeSlug(title)
    const published_at = status === 'published' ? new Date().toISOString() : null

    const { data, error } = await adminSupabase
      .from('blog_posts')
      .insert({ title, slug, excerpt, content, category, status: status || 'draft', published_at, author_id: user.id })
      .select()
      .single()

    if (error) {
      console.error('POST /api/admin/blog error:', error.message)
      return NextResponse.json({ error: 'Could not create post.' }, { status: 500 })
    }
    return NextResponse.json({ success: true, data })
  } catch (err) {
    console.error('POST /api/admin/blog unexpected error:', err)
    return NextResponse.json({ error: 'Could not create post.' }, { status: 500 })
  }
}

// PATCH — update post
export async function PATCH(request: Request) {
  try {
    const user = await getUser()
    if (!user || !(await isAdmin(user.id))) return NextResponse.json({ error: 'Unauthorised' }, { status: 403 })

    const body = await request.json()
    const { id, ...updates } = body
    if (!id) return NextResponse.json({ error: 'Post ID required.' }, { status: 400 })

    if (updates.status === 'published') {
      // Only set published_at if switching to published for the first time
      const { data: existing } = await adminSupabase.from('blog_posts').select('published_at').eq('id', id).single()
      if (!existing?.published_at) updates.published_at = new Date().toISOString()
    }

    updates.updated_at = new Date().toISOString()

    const { data, error } = await adminSupabase.from('blog_posts').update(updates).eq('id', id).select().single()
    if (error) {
      console.error('PATCH /api/admin/blog error:', error.message)
      return NextResponse.json({ error: 'Could not update post.' }, { status: 500 })
    }
    return NextResponse.json({ success: true, data })
  } catch (err) {
    console.error('PATCH /api/admin/blog unexpected error:', err)
    return NextResponse.json({ error: 'Could not update post.' }, { status: 500 })
  }
}

// DELETE — delete post
export async function DELETE(request: Request) {
  try {
    const user = await getUser()
    if (!user || !(await isAdmin(user.id))) return NextResponse.json({ error: 'Unauthorised' }, { status: 403 })

    const { id } = await request.json()
    if (!id) return NextResponse.json({ error: 'Post ID required.' }, { status: 400 })

    const { error } = await adminSupabase.from('blog_posts').delete().eq('id', id)
    if (error) return NextResponse.json({ error: 'Could not delete post.' }, { status: 500 })
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('DELETE /api/admin/blog unexpected error:', err)
    return NextResponse.json({ error: 'Could not delete post.' }, { status: 500 })
  }
}
