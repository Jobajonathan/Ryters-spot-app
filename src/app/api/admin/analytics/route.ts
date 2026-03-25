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
  return data?.role && ['admin', 'superadmin', 'finance', 'support'].includes(data.role)
}

export async function GET() {
  try {
    const user = await getUser()
    if (!user || !(await isAdmin(user.id))) return NextResponse.json({ error: 'Unauthorised' }, { status: 403 })

    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString()

    const [
      { count: totalProjects },
      { count: activeProjects },
      { count: pendingProjects },
      { count: completedProjects },
      { count: totalClients },
      { count: newClientsThisMonth },
      { data: recentApplications },
      { data: statusBreakdown },
    ] = await Promise.all([
      adminSupabase.from('projects').select('*', { count: 'exact', head: true }),
      adminSupabase.from('projects').select('*', { count: 'exact', head: true }).in('status', ['in_review', 'in_progress']),
      adminSupabase.from('projects').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
      adminSupabase.from('projects').select('*', { count: 'exact', head: true }).eq('status', 'completed'),
      adminSupabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'client'),
      adminSupabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'client').gte('created_at', startOfMonth),
      adminSupabase.from('projects')
        .select('id, title, service, status, urgency, created_at, profiles(full_name, email)')
        .order('created_at', { ascending: false })
        .limit(5),
      adminSupabase.from('projects')
        .select('status')
        .then(({ data }) => ({
          data: data ? ['pending', 'in_review', 'in_progress', 'completed', 'cancelled'].map(s => ({
            status: s,
            count: data.filter(p => p.status === s).length
          })) : []
        })),
    ])

    // Month-over-month project change
    const { count: projectsLastMonth } = await adminSupabase
      .from('projects')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', startOfLastMonth)
      .lt('created_at', startOfMonth)

    const { count: projectsThisMonth } = await adminSupabase
      .from('projects')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', startOfMonth)

    return NextResponse.json({
      stats: {
        totalProjects: totalProjects || 0,
        activeProjects: activeProjects || 0,
        pendingProjects: pendingProjects || 0,
        completedProjects: completedProjects || 0,
        totalClients: totalClients || 0,
        newClientsThisMonth: newClientsThisMonth || 0,
        projectsThisMonth: projectsThisMonth || 0,
        projectsLastMonth: projectsLastMonth || 0,
      },
      recentApplications: recentApplications || [],
      statusBreakdown: statusBreakdown || [],
    })
  } catch (err) {
    console.error('GET /api/admin/analytics error:', err)
    return NextResponse.json({ error: 'Could not load analytics.' }, { status: 500 })
  }
}
