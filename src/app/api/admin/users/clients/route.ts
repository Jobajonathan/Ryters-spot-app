import { NextResponse } from 'next/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { isAdminRole } from '@/lib/admin/roles'

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
  return isAdminRole(data?.role) && ['superadmin', 'admin', 'support', 'operations'].includes(data.role)
}

function increment(map: Record<string, number>, key: string | null | undefined, amount = 1) {
  if (!key) return
  map[key] = (map[key] ?? 0) + amount
}

// GET — list all client users
export async function GET() {
  try {
    const user = await getUser()
    if (!user || !(await isAdmin(user.id))) return NextResponse.json({ error: 'Unauthorised' }, { status: 403 })

    const { data, error } = await adminSupabase
      .from('profiles')
      .select('id, full_name, email, company, country, role, created_at')
      .eq('role', 'client')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('GET /api/admin/users/clients error:', error.message)
      return NextResponse.json({ error: 'Could not load clients.' }, { status: 500 })
    }
    const clients = data || []
    const ids = clients.map(client => client.id)

    if (ids.length === 0) return NextResponse.json([])

    const [{ data: projects }, { data: bookings }, { data: payments }] = await Promise.all([
      adminSupabase.from('projects').select('client_id, status, updated_at').in('client_id', ids),
      adminSupabase.from('bookings').select('client_id, status, updated_at, created_at').in('client_id', ids),
      adminSupabase.from('payments').select('client_id, amount, status, created_at').in('client_id', ids),
    ])

    const projectCounts: Record<string, number> = {}
    const activeProjectCounts: Record<string, number> = {}
    const bookingCounts: Record<string, number> = {}
    const paymentTotals: Record<string, number> = {}
    const lastActivity: Record<string, string> = {}

    ;(projects ?? []).forEach(project => {
      increment(projectCounts, project.client_id)
      if (!['completed', 'cancelled'].includes(project.status)) increment(activeProjectCounts, project.client_id)
      if (project.updated_at && (!lastActivity[project.client_id] || project.updated_at > lastActivity[project.client_id])) lastActivity[project.client_id] = project.updated_at
    })
    ;(bookings ?? []).forEach(booking => {
      increment(bookingCounts, booking.client_id)
      const activity = booking.updated_at || booking.created_at
      if (activity && (!lastActivity[booking.client_id] || activity > lastActivity[booking.client_id])) lastActivity[booking.client_id] = activity
    })
    ;(payments ?? []).forEach(payment => {
      if (payment.status === 'paid' || payment.status === 'successful') increment(paymentTotals, payment.client_id, Number(payment.amount) || 0)
      if (payment.created_at && (!lastActivity[payment.client_id] || payment.created_at > lastActivity[payment.client_id])) lastActivity[payment.client_id] = payment.created_at
    })

    return NextResponse.json(clients.map(client => ({
      ...client,
      project_count: projectCounts[client.id] ?? 0,
      active_project_count: activeProjectCounts[client.id] ?? 0,
      booking_count: bookingCounts[client.id] ?? 0,
      paid_total: paymentTotals[client.id] ?? 0,
      last_activity_at: lastActivity[client.id] ?? client.created_at,
    })))
  } catch (err) {
    console.error('GET /api/admin/users/clients unexpected error:', err)
    return NextResponse.json({ error: 'Could not load clients.' }, { status: 500 })
  }
}
