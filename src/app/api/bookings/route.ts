import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

type BookingPayload = {
  topic?: unknown
  meeting_type?: unknown
  preferred_date?: unknown
  preferred_time?: unknown
  timezone?: unknown
  notes?: unknown
}

function toText(value: unknown) {
  return typeof value === 'string' ? value.trim() : ''
}

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
    }

    const { data, error } = await supabase
      .from('bookings')
      .select('id, topic, meeting_type, preferred_date, preferred_time, timezone, notes, status, admin_notes, scheduled_date, scheduled_time, scheduled_timezone, meeting_url, location, reschedule_reason, created_at, updated_at')
      .eq('client_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('GET /api/bookings error:', error)
      return NextResponse.json({ error: 'Could not load bookings.' }, { status: 500 })
    }

    return NextResponse.json(data ?? [])
  } catch (err) {
    console.error('GET /api/bookings unexpected error:', err)
    return NextResponse.json({ error: 'Could not load bookings.' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
    }

    const body = await request.json() as BookingPayload
    const payload = {
      client_id: user.id,
      topic: toText(body.topic),
      meeting_type: toText(body.meeting_type) || 'discovery',
      preferred_date: toText(body.preferred_date),
      preferred_time: toText(body.preferred_time),
      timezone: toText(body.timezone) || 'Africa/Lagos',
      notes: toText(body.notes),
      status: 'requested',
    }

    if (!payload.topic || !payload.preferred_date || !payload.preferred_time) {
      return NextResponse.json({ error: 'Topic, date, and time are required.' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('bookings')
      .insert(payload)
      .select('id, topic, meeting_type, preferred_date, preferred_time, timezone, notes, status, admin_notes, scheduled_date, scheduled_time, scheduled_timezone, meeting_url, location, reschedule_reason, created_at, updated_at')
      .single()

    if (error) {
      console.error('POST /api/bookings error:', error)
      return NextResponse.json({ error: 'Could not request booking.' }, { status: 500 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (err) {
    console.error('POST /api/bookings unexpected error:', err)
    return NextResponse.json({ error: 'Could not request booking.' }, { status: 500 })
  }
}
