import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
    }

    const [{ data: projects }, { data: bookings }, { data: payments }] = await Promise.all([
      supabase
        .from('projects')
        .select('id, title, service, status, created_at, updated_at, expected_delivery_at')
        .eq('client_id', user.id)
        .order('updated_at', { ascending: false })
        .limit(8),
      supabase
        .from('bookings')
        .select('id, topic, status, preferred_date, preferred_time, timezone, scheduled_date, scheduled_time, scheduled_timezone, meeting_url, location')
        .eq('client_id', user.id)
        .order('preferred_date', { ascending: true })
        .limit(8),
      supabase
        .from('payments')
        .select('id, amount, currency, status, payment_type, created_at, projects:title')
        .eq('client_id', user.id)
        .order('created_at', { ascending: false })
        .limit(8),
    ])

    const projectIds = (projects ?? []).map(project => project.id)
    let unreadMessages = 0
    if (projectIds.length > 0) {
      const { count } = await supabase
        .from('messages')
        .select('id', { count: 'exact', head: true })
        .in('project_id', projectIds)
        .eq('is_admin', true)
        .eq('read_by_client', false)
      unreadMessages = count ?? 0
    }

    return NextResponse.json({
      projects: projects ?? [],
      bookings: bookings ?? [],
      payments: payments ?? [],
      stats: {
        activeProjects: (projects ?? []).filter(project => !['completed', 'cancelled'].includes(project.status)).length,
        openBookings: (bookings ?? []).filter(booking => !['completed', 'cancelled'].includes(booking.status)).length,
        unreadMessages,
      },
    })
  } catch (err) {
    console.error('GET /api/workspace error:', err)
    return NextResponse.json({ error: 'Could not load workspace.' }, { status: 500 })
  }
}

