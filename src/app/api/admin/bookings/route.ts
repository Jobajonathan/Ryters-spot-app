import { NextResponse } from 'next/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { isAdminRole } from '@/lib/admin/roles'

const adminSupabase = createAdminClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const BOOKING_STATUSES = ['requested', 'confirmed', 'rescheduled', 'completed', 'cancelled']

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

async function canManageBookings(userId: string) {
  const { data } = await adminSupabase.from('profiles').select('role').eq('id', userId).single()
  return isAdminRole(data?.role) && ['superadmin', 'admin', 'support', 'operations'].includes(data.role)
}

function toText(value: unknown) {
  return typeof value === 'string' ? value.trim() : ''
}

async function notifyClient(clientId: string, title: string, message: string) {
  const payload = {
    user_id: clientId,
    type: 'booking',
    title,
    body: message,
    message,
    link: '/dashboard/bookings',
  }

  const { error } = await adminSupabase.from('notifications').insert(payload)
  if (error) {
    const { error: fallbackError } = await adminSupabase.from('notifications').insert({
      user_id: clientId,
      message,
      link: '/dashboard/bookings',
    })
    if (fallbackError) console.error('Booking notification insert failed:', fallbackError)
  }
}

export async function GET() {
  try {
    const user = await getUser()
    if (!user || !(await canManageBookings(user.id))) {
      return NextResponse.json({ error: 'Unauthorised' }, { status: 403 })
    }

    const { data, error } = await adminSupabase
      .from('bookings')
      .select('id, client_id, topic, meeting_type, preferred_date, preferred_time, timezone, notes, status, admin_notes, scheduled_date, scheduled_time, scheduled_timezone, meeting_url, location, reschedule_reason, created_at, updated_at, profiles:client_id (full_name, email, company, country)')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('GET /api/admin/bookings error:', error)
      return NextResponse.json({ error: 'Could not load bookings.' }, { status: 500 })
    }

    return NextResponse.json(data ?? [])
  } catch (err) {
    console.error('GET /api/admin/bookings unexpected error:', err)
    return NextResponse.json({ error: 'Could not load bookings.' }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const user = await getUser()
    if (!user || !(await canManageBookings(user.id))) {
      return NextResponse.json({ error: 'Unauthorised' }, { status: 403 })
    }

    const body = await request.json()
    const id = toText(body.id)
    const status = toText(body.status)
    const adminNotes = toText(body.admin_notes)
    const scheduledDate = toText(body.scheduled_date)
    const scheduledTime = toText(body.scheduled_time)
    const scheduledTimezone = toText(body.scheduled_timezone) || 'Africa/Lagos'
    const meetingUrl = toText(body.meeting_url)
    const location = toText(body.location)
    const rescheduleReason = toText(body.reschedule_reason)

    if (!id || !BOOKING_STATUSES.includes(status)) {
      return NextResponse.json({ error: 'Booking ID and valid status are required.' }, { status: 400 })
    }

    const { data: bookingBefore } = await adminSupabase
      .from('bookings')
      .select('client_id, topic, status')
      .eq('id', id)
      .single()

    const { data, error } = await adminSupabase
      .from('bookings')
      .update({
        status,
        admin_notes: adminNotes || null,
        scheduled_date: scheduledDate || null,
        scheduled_time: scheduledTime || null,
        scheduled_timezone: scheduledTimezone,
        meeting_url: meetingUrl || null,
        location: location || null,
        reschedule_reason: rescheduleReason || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select('id, client_id, topic, meeting_type, preferred_date, preferred_time, timezone, notes, status, admin_notes, scheduled_date, scheduled_time, scheduled_timezone, meeting_url, location, reschedule_reason, created_at, updated_at, profiles:client_id (full_name, email, company, country)')
      .single()

    if (error) {
      console.error('PATCH /api/admin/bookings error:', error)
      return NextResponse.json({ error: 'Could not update booking.' }, { status: 500 })
    }

    if (bookingBefore?.client_id && bookingBefore.status !== status) {
      await notifyClient(
        bookingBefore.client_id,
        'Booking updated',
        `Your booking "${bookingBefore.topic}" is now ${status.replace(/_/g, ' ')}.`
      )
    }

    return NextResponse.json(data)
  } catch (err) {
    console.error('PATCH /api/admin/bookings unexpected error:', err)
    return NextResponse.json({ error: 'Could not update booking.' }, { status: 500 })
  }
}
