import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

type ProjectSummary = {
  id: string
  status: string
  title: string | null
  service: string | null
  created_at: string
  updated_at: string | null
}

type BookingSummary = {
  id: string
  topic: string
  meeting_type: string
  preferred_date: string
  preferred_time: string
  timezone: string
  status: string
}

const ACTIVE_STATUSES = ['pending', 'in_review', 'accepted', 'in_progress']

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
    }

    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select('id, status, title, service, created_at, updated_at')
      .eq('client_id', user.id)
      .order('updated_at', { ascending: false })
      .returns<ProjectSummary[]>()

    if (projectsError) {
      console.error('GET /api/dashboard/summary projects error:', projectsError)
      return NextResponse.json({ error: 'Could not load dashboard summary.' }, { status: 500 })
    }

    const projectRows = projects ?? []
    const projectIds = projectRows.map(project => project.id)
    let unreadMessages = 0

    if (projectIds.length > 0) {
      const { count, error: messagesError } = await supabase
        .from('messages')
        .select('id', { count: 'exact', head: true })
        .in('project_id', projectIds)
        .eq('is_admin', true)
        .eq('read_by_client', false)

      if (messagesError) {
        console.error('GET /api/dashboard/summary messages error:', messagesError)
      } else {
        unreadMessages = count ?? 0
      }
    }

    const fullName = user.user_metadata?.full_name as string | undefined
    const fallbackName = user.email?.split('@')[0] ?? 'there'
    const { data: bookings, error: bookingsError } = await supabase
      .from('bookings')
      .select('id, topic, meeting_type, preferred_date, preferred_time, timezone, status')
      .eq('client_id', user.id)
      .order('preferred_date', { ascending: true })
      .returns<BookingSummary[]>()

    if (bookingsError) {
      console.error('GET /api/dashboard/summary bookings error:', bookingsError)
    }

    const bookingRows = bookings ?? []
    const today = new Date().toISOString().slice(0, 10)
    const nextBooking = bookingRows.find(booking => booking.preferred_date >= today && !['completed', 'cancelled'].includes(booking.status)) ?? null

    return NextResponse.json({
      profile: {
        firstName: fullName ? fullName.split(' ')[0] : fallbackName,
        email: user.email ?? '',
      },
      stats: {
        activeCount: projectRows.filter(project => ACTIVE_STATUSES.includes(project.status)).length,
        completedCount: projectRows.filter(project => project.status === 'completed').length,
        totalCount: projectRows.length,
        unreadMessages,
        bookingCount: bookingRows.length,
      },
      recentProjects: projectRows.slice(0, 3),
      nextBooking,
    })
  } catch (err) {
    console.error('GET /api/dashboard/summary error:', err)
    return NextResponse.json({ error: 'Could not load dashboard summary.' }, { status: 500 })
  }
}
