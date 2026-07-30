'use client'

import { useEffect, useMemo, useState } from 'react'
import { apiGet, apiSend } from '@/lib/api/client'

type Booking = {
  id: string
  client_id: string
  topic: string
  meeting_type: string
  preferred_date: string
  preferred_time: string
  timezone: string
  notes: string | null
  status: string
  admin_notes: string | null
  scheduled_date: string | null
  scheduled_time: string | null
  scheduled_timezone: string | null
  meeting_url: string | null
  location: string | null
  reschedule_reason: string | null
  created_at: string
  updated_at: string | null
  profiles: { full_name: string | null; email: string | null; company: string | null; country: string | null } | null
}

const STATUS_OPTIONS = ['requested', 'confirmed', 'rescheduled', 'completed', 'cancelled']
const STATUS_LABELS: Record<string, string> = {
  requested: 'Requested',
  confirmed: 'Confirmed',
  rescheduled: 'Rescheduled',
  completed: 'Completed',
  cancelled: 'Cancelled',
}

const MEETING_LABELS: Record<string, string> = {
  discovery: 'Discovery call',
  product: 'Product development',
  research: 'Research planning',
  growth: 'Growth and scaling',
}

function fmtDate(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
}

function emptyEdits(bookings: Booking[]) {
  return Object.fromEntries(bookings.map(booking => [booking.id, {
    status: booking.status,
    admin_notes: booking.admin_notes ?? '',
    scheduled_date: booking.scheduled_date ?? '',
    scheduled_time: booking.scheduled_time ?? '',
    scheduled_timezone: booking.scheduled_timezone ?? booking.timezone ?? 'Africa/Lagos',
    meeting_url: booking.meeting_url ?? '',
    location: booking.location ?? '',
    reschedule_reason: booking.reschedule_reason ?? '',
  }]))
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [edits, setEdits] = useState<Record<string, {
    status: string
    admin_notes: string
    scheduled_date: string
    scheduled_time: string
    scheduled_timezone: string
    meeting_url: string
    location: string
    reschedule_reason: string
  }>>({})
  const [statusFilter, setStatusFilter] = useState('all')
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [savingId, setSavingId] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    apiGet<Booking[]>('/api/admin/bookings')
      .then(data => {
        setBookings(data)
        setEdits(emptyEdits(data))
      })
      .catch(err => setError(err instanceof Error ? err.message : 'Could not load bookings.'))
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return bookings.filter(booking => {
      const matchesStatus = statusFilter === 'all' || booking.status === statusFilter
      const haystack = [
        booking.topic,
        booking.meeting_type,
        booking.profiles?.full_name,
        booking.profiles?.email,
        booking.profiles?.company,
      ].filter(Boolean).join(' ').toLowerCase()
      return matchesStatus && (!q || haystack.includes(q))
    })
  }, [bookings, query, statusFilter])

  const counts = useMemo(() => {
    return STATUS_OPTIONS.reduce<Record<string, number>>((acc, status) => {
      acc[status] = bookings.filter(booking => booking.status === status).length
      return acc
    }, {})
  }, [bookings])

  function updateEdit(id: string, field: keyof (typeof edits)[string], value: string) {
    setEdits(prev => ({ ...prev, [id]: { ...prev[id], [field]: value } }))
  }

  async function saveBooking(id: string) {
    const edit = edits[id]
    if (!edit || savingId) return
    setSavingId(id)
    setError('')

    try {
      const updated = await apiSend<Booking>('/api/admin/bookings', 'PATCH', {
        id,
        status: edit.status,
        admin_notes: edit.admin_notes,
        scheduled_date: edit.scheduled_date,
        scheduled_time: edit.scheduled_time,
        scheduled_timezone: edit.scheduled_timezone,
        meeting_url: edit.meeting_url,
        location: edit.location,
        reschedule_reason: edit.reschedule_reason,
      })
      setBookings(prev => prev.map(booking => booking.id === id ? updated : booking))
      setEdits(prev => ({ ...prev, [id]: {
        status: updated.status,
        admin_notes: updated.admin_notes ?? '',
        scheduled_date: updated.scheduled_date ?? '',
        scheduled_time: updated.scheduled_time ?? '',
        scheduled_timezone: updated.scheduled_timezone ?? updated.timezone ?? 'Africa/Lagos',
        meeting_url: updated.meeting_url ?? '',
        location: updated.location ?? '',
        reschedule_reason: updated.reschedule_reason ?? '',
      } }))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not update booking.')
    } finally {
      setSavingId('')
    }
  }

  return (
    <>
      <style>{`
        .ab-head { display: flex; justify-content: space-between; gap: 1rem; align-items: flex-end; margin-bottom: 1.3rem; flex-wrap: wrap; }
        .ab-head h1 { font-family: var(--font-heading, DM Sans, sans-serif); font-size: 1.55rem; color: #111827; margin: 0 0 0.25rem; }
        .ab-head p { color: #6b7280; margin: 0; font-size: 0.9rem; }
        .ab-glass { background: rgba(255,255,255,0.76); border: 1px solid rgba(255,255,255,0.82); border-radius: 18px; box-shadow: 0 20px 55px rgba(18,42,29,0.08); backdrop-filter: blur(24px) saturate(160%); }
        .ab-stats { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 0.8rem; margin-bottom: 1rem; }
        .ab-stat { padding: 0.9rem 1rem; }
        .ab-stat span { display: block; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.08em; color: #6b7280; font-weight: 800; margin-bottom: 0.45rem; }
        .ab-stat strong { font-family: var(--font-heading, DM Sans, sans-serif); font-size: 1.4rem; color: #111827; }
        .ab-toolbar { display: flex; gap: 0.75rem; align-items: center; justify-content: space-between; padding: 1rem; margin-bottom: 1rem; flex-wrap: wrap; }
        .ab-search { min-width: min(100%, 320px); flex: 1; }
        .ab-filter { display: flex; gap: 0.45rem; flex-wrap: wrap; }
        .ab-chip { border: 1px solid rgba(27,67,50,0.12); background: rgba(27,67,50,0.04); color: #1B4332; border-radius: 999px; padding: 0.45rem 0.8rem; font-weight: 800; font-size: 0.75rem; cursor: pointer; }
        .ab-chip.active { background: #1B4332; color: #fff; }
        .ab-list { display: grid; gap: 0.9rem; }
        .ab-card { padding: 1rem; display: grid; grid-template-columns: minmax(0, 1fr) 320px; gap: 1rem; align-items: start; }
        .ab-topic { font-family: var(--font-heading, DM Sans, sans-serif); font-size: 1rem; font-weight: 800; color: #111827; margin-bottom: 0.25rem; }
        .ab-meta { color: #6b7280; font-size: 0.82rem; line-height: 1.6; }
        .ab-client { margin-top: 0.9rem; padding: 0.85rem; border-radius: 14px; background: rgba(27,67,50,0.05); border: 1px solid rgba(27,67,50,0.08); }
        .ab-client strong { display: block; color: #111827; font-size: 0.88rem; margin-bottom: 0.15rem; }
        .ab-notes { margin-top: 0.9rem; color: #374151; font-size: 0.86rem; line-height: 1.65; white-space: pre-wrap; }
        .ab-controls { display: grid; gap: 0.75rem; }
        .ab-status { display: inline-flex; width: fit-content; padding: 0.33rem 0.65rem; border-radius: 999px; background: rgba(201,168,76,0.14); color: #854d0e; font-size: 0.72rem; font-weight: 900; text-transform: uppercase; letter-spacing: 0.06em; }
        .ab-error { color: #991b1b; background: #fee2e2; border: 1px solid #fecaca; padding: 0.8rem 1rem; border-radius: 12px; margin-bottom: 1rem; }
        .ab-empty { padding: 3rem 1.25rem; text-align: center; color: #6b7280; }
        .ab-empty strong { display: block; color: #111827; font-family: var(--font-heading, DM Sans, sans-serif); margin-bottom: 0.35rem; }
        @media (max-width: 980px) { .ab-card { grid-template-columns: 1fr; } .ab-stats { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
      `}</style>

      <div className="ab-head">
        <div>
          <h1>Bookings</h1>
          <p>Manage client session requests, confirmations, reschedules, and internal notes.</p>
        </div>
      </div>

      <div className="ab-stats">
        {STATUS_OPTIONS.map(status => (
          <div key={status} className="ab-stat ab-glass">
            <span>{STATUS_LABELS[status]}</span>
            <strong>{counts[status] ?? 0}</strong>
          </div>
        ))}
      </div>

      <div className="ab-toolbar ab-glass">
        <input className="form-control ab-search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Search client, topic, company..." />
        <div className="ab-filter">
          <button className={`ab-chip${statusFilter === 'all' ? ' active' : ''}`} onClick={() => setStatusFilter('all')}>All</button>
          {STATUS_OPTIONS.map(status => (
            <button key={status} className={`ab-chip${statusFilter === status ? ' active' : ''}`} onClick={() => setStatusFilter(status)}>
              {STATUS_LABELS[status]}
            </button>
          ))}
        </div>
      </div>

      {error && <div className="ab-error">{error}</div>}

      {loading ? (
        <div className="ab-empty ab-glass"><strong>Loading bookings</strong>Preparing the queue.</div>
      ) : filtered.length === 0 ? (
        <div className="ab-empty ab-glass"><strong>No matching bookings</strong>Try changing the search or status filter.</div>
      ) : (
        <div className="ab-list">
          {filtered.map(booking => {
            const edit = edits[booking.id] ?? {
              status: booking.status,
              admin_notes: booking.admin_notes ?? '',
              scheduled_date: booking.scheduled_date ?? '',
              scheduled_time: booking.scheduled_time ?? '',
              scheduled_timezone: booking.scheduled_timezone ?? booking.timezone ?? 'Africa/Lagos',
              meeting_url: booking.meeting_url ?? '',
              location: booking.location ?? '',
              reschedule_reason: booking.reschedule_reason ?? '',
            }
            const dirty =
              edit.status !== booking.status ||
              edit.admin_notes !== (booking.admin_notes ?? '') ||
              edit.scheduled_date !== (booking.scheduled_date ?? '') ||
              edit.scheduled_time !== (booking.scheduled_time ?? '') ||
              edit.scheduled_timezone !== (booking.scheduled_timezone ?? booking.timezone ?? 'Africa/Lagos') ||
              edit.meeting_url !== (booking.meeting_url ?? '') ||
              edit.location !== (booking.location ?? '') ||
              edit.reschedule_reason !== (booking.reschedule_reason ?? '')

            return (
              <article key={booking.id} className="ab-card ab-glass">
                <div>
                  <span className="ab-status">{STATUS_LABELS[booking.status] || booking.status}</span>
                  <div className="ab-topic">{booking.topic}</div>
                  <div className="ab-meta">
                    {MEETING_LABELS[booking.meeting_type] || booking.meeting_type} · {fmtDate(booking.preferred_date)} · {booking.preferred_time} · {booking.timezone}
                  </div>
                  <div className="ab-client">
                    <strong>{booking.profiles?.full_name || 'Unnamed client'}</strong>
                    <div className="ab-meta">
                      {booking.profiles?.email || 'No email'}{booking.profiles?.company ? ` · ${booking.profiles.company}` : ''}{booking.profiles?.country ? ` · ${booking.profiles.country}` : ''}
                    </div>
                  </div>
                  {booking.notes && <div className="ab-notes">{booking.notes}</div>}
                  {(booking.scheduled_date || booking.meeting_url || booking.location) && (
                    <div className="ab-client">
                      <strong>Confirmed details</strong>
                      <div className="ab-meta">
                        {booking.scheduled_date ? `${fmtDate(booking.scheduled_date)} · ${booking.scheduled_time || 'Time TBC'} · ${booking.scheduled_timezone || booking.timezone}` : 'Schedule pending'}
                      </div>
                      {booking.meeting_url && <div className="ab-meta">{booking.meeting_url}</div>}
                      {booking.location && <div className="ab-meta">{booking.location}</div>}
                    </div>
                  )}
                </div>

                <div className="ab-controls">
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" htmlFor={`status-${booking.id}`}>Status</label>
                    <select id={`status-${booking.id}`} className="form-control" value={edit.status} onChange={event => updateEdit(booking.id, 'status', event.target.value)}>
                      {STATUS_OPTIONS.map(status => <option key={status} value={status}>{STATUS_LABELS[status]}</option>)}
                    </select>
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" htmlFor={`notes-${booking.id}`}>Admin note</label>
                    <textarea id={`notes-${booking.id}`} className="form-control" rows={4} value={edit.admin_notes} onChange={event => updateEdit(booking.id, 'admin_notes', event.target.value)} placeholder="Internal note or client-facing context for confirmation..." />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label" htmlFor={`scheduled-date-${booking.id}`}>Final date</label>
                      <input id={`scheduled-date-${booking.id}`} className="form-control" type="date" value={edit.scheduled_date} onChange={event => updateEdit(booking.id, 'scheduled_date', event.target.value)} />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label" htmlFor={`scheduled-time-${booking.id}`}>Final time</label>
                      <input id={`scheduled-time-${booking.id}`} className="form-control" type="time" value={edit.scheduled_time} onChange={event => updateEdit(booking.id, 'scheduled_time', event.target.value)} />
                    </div>
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" htmlFor={`scheduled-zone-${booking.id}`}>Timezone</label>
                    <input id={`scheduled-zone-${booking.id}`} className="form-control" value={edit.scheduled_timezone} onChange={event => updateEdit(booking.id, 'scheduled_timezone', event.target.value)} />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" htmlFor={`meeting-url-${booking.id}`}>Meeting link</label>
                    <input id={`meeting-url-${booking.id}`} className="form-control" value={edit.meeting_url} onChange={event => updateEdit(booking.id, 'meeting_url', event.target.value)} placeholder="https://meet.google.com/..." />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" htmlFor={`location-${booking.id}`}>Location</label>
                    <input id={`location-${booking.id}`} className="form-control" value={edit.location} onChange={event => updateEdit(booking.id, 'location', event.target.value)} placeholder="Google Meet, Zoom, office, WhatsApp..." />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" htmlFor={`reschedule-${booking.id}`}>Reschedule reason</label>
                    <textarea id={`reschedule-${booking.id}`} className="form-control" rows={2} value={edit.reschedule_reason} onChange={event => updateEdit(booking.id, 'reschedule_reason', event.target.value)} placeholder="Only needed when rescheduling." />
                  </div>
                  <button className="btn btn-primary" disabled={!dirty || savingId === booking.id} onClick={() => saveBooking(booking.id)}>
                    {savingId === booking.id ? 'Saving...' : dirty ? 'Save Update' : 'Saved'}
                  </button>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </>
  )
}
