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

// GET — return all site content rows
export async function GET() {
  try {
    const user = await getUser()
    if (!user || !(await isAdmin(user.id))) return NextResponse.json({ error: 'Unauthorised' }, { status: 403 })

    const { data, error } = await adminSupabase
      .from('site_content')
      .select('*')
      .order('section')

    if (error) return NextResponse.json({ error: 'Could not load content.' }, { status: 500 })
    return NextResponse.json(data || [])
  } catch {
    return NextResponse.json({ error: 'Could not load content.' }, { status: 500 })
  }
}

// PUT — upsert content values (array of { key, value })
export async function PUT(request: Request) {
  try {
    const user = await getUser()
    if (!user || !(await isAdmin(user.id))) return NextResponse.json({ error: 'Unauthorised' }, { status: 403 })

    const updates: { key: string; value: string }[] = await request.json()
    if (!Array.isArray(updates)) return NextResponse.json({ error: 'Expected array.' }, { status: 400 })

    for (const { key, value } of updates) {
      await adminSupabase
        .from('site_content')
        .update({ value, updated_at: new Date().toISOString(), updated_by: user.id })
        .eq('key', key)
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Could not save content.' }, { status: 500 })
  }
}
