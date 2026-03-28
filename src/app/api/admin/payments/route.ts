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
  return data?.role && ['admin', 'superadmin', 'finance', 'support', 'operations'].includes(data.role)
}

export async function GET() {
  try {
    const user = await getUser()
    if (!user || !(await isAdmin(user.id))) {
      return NextResponse.json({ error: 'Unauthorised' }, { status: 403 })
    }

    const { data, error } = await adminSupabase
      .from('payments')
      .select(`
        *,
        projects ( title, service ),
        profiles ( full_name, email )
      `)
      .order('created_at', { ascending: false })
      .limit(500)

    if (error) {
      console.error('GET /api/admin/payments error:', error.message)
      return NextResponse.json({ error: 'Could not load payments.' }, { status: 500 })
    }

    return NextResponse.json(data || [])
  } catch (err) {
    console.error('GET /api/admin/payments unexpected error:', err)
    return NextResponse.json({ error: 'Could not load payments.' }, { status: 500 })
  }
}
