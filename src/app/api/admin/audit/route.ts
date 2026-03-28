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

async function isSuperAdmin(userId: string) {
  const { data } = await adminSupabase.from('profiles').select('role').eq('id', userId).single()
  return data?.role === 'superadmin'
}

export async function GET() {
  try {
    const user = await getUser()
    if (!user || !(await isSuperAdmin(user.id))) return NextResponse.json({ error: 'Unauthorised' }, { status: 403 })

    const { data, error } = await adminSupabase
      .from('admin_audit_log')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(200)

    if (error) return NextResponse.json({ error: 'Could not load audit log.' }, { status: 500 })
    return NextResponse.json(data || [])
  } catch (err) {
    console.error('GET /api/admin/audit error:', err)
    return NextResponse.json({ error: 'Could not load audit log.' }, { status: 500 })
  }
}
