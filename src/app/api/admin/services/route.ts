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
  return data?.role && ['admin', 'superadmin'].includes(data.role)
}

// GET — list all services
export async function GET() {
  try {
    const user = await getUser()
    if (!user || !(await isAdmin(user.id))) return NextResponse.json({ error: 'Unauthorised' }, { status: 403 })

    const { data, error } = await adminSupabase
      .from('services')
      .select('*')
      .order('display_order', { ascending: true })

    if (error) return NextResponse.json({ error: 'Could not load services.' }, { status: 500 })
    return NextResponse.json(data || [])
  } catch (err) {
    console.error('GET /api/admin/services error:', err)
    return NextResponse.json({ error: 'Could not load services.' }, { status: 500 })
  }
}

// POST — create a service
export async function POST(request: Request) {
  try {
    const user = await getUser()
    if (!user || !(await isAdmin(user.id))) return NextResponse.json({ error: 'Unauthorised' }, { status: 403 })

    const body = await request.json()
    const { name, category, description, price_gbp, price_usd, price_eur, price_ngn, is_active, display_order } = body

    if (!name || !category) return NextResponse.json({ error: 'Name and category are required.' }, { status: 400 })

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

    const { data, error } = await adminSupabase
      .from('services')
      .insert({ name, slug, category, description, price_gbp, price_usd, price_eur, price_ngn, is_active: is_active ?? true, display_order: display_order ?? 0 })
      .select()
      .single()

    if (error) {
      console.error('POST /api/admin/services error:', error.message)
      return NextResponse.json({ error: 'Could not create service.' }, { status: 500 })
    }
    return NextResponse.json({ success: true, data })
  } catch (err) {
    console.error('POST /api/admin/services unexpected error:', err)
    return NextResponse.json({ error: 'Could not create service.' }, { status: 500 })
  }
}

// PATCH — update a service
export async function PATCH(request: Request) {
  try {
    const user = await getUser()
    if (!user || !(await isAdmin(user.id))) return NextResponse.json({ error: 'Unauthorised' }, { status: 403 })

    const body = await request.json()
    const { id, ...updates } = body
    if (!id) return NextResponse.json({ error: 'Service ID required.' }, { status: 400 })

    const { data, error } = await adminSupabase
      .from('services')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('PATCH /api/admin/services error:', error.message)
      return NextResponse.json({ error: 'Could not update service.' }, { status: 500 })
    }
    return NextResponse.json({ success: true, data })
  } catch (err) {
    console.error('PATCH /api/admin/services unexpected error:', err)
    return NextResponse.json({ error: 'Could not update service.' }, { status: 500 })
  }
}

// DELETE — delete a service
export async function DELETE(request: Request) {
  try {
    const user = await getUser()
    if (!user || !(await isAdmin(user.id))) return NextResponse.json({ error: 'Unauthorised' }, { status: 403 })

    const { id } = await request.json()
    if (!id) return NextResponse.json({ error: 'Service ID required.' }, { status: 400 })

    const { error } = await adminSupabase.from('services').delete().eq('id', id)
    if (error) return NextResponse.json({ error: 'Could not delete service.' }, { status: 500 })
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('DELETE /api/admin/services unexpected error:', err)
    return NextResponse.json({ error: 'Could not delete service.' }, { status: 500 })
  }
}
