'use client'

import { useEffect, useState } from 'react'
import { apiGet, apiSend } from '@/lib/api/client'

type Booking = {
  id: string
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
}

const MEETING_TYPES = [
  { value: 'discovery', label: 'Discovery call' },
  { value: 'product', label: 'Product development' },
  { value: 'research', label: 'Research planning' },
  { value: 'growth', label: 'Growth and scaling' },
]

function statusLabel(status: string) {
  return status.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

function formatDate(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState('')
  const [form, setForm] = useState({
    topic: '',
    meeting_type: 'discovery',
    preferred_date: '',
    preferred_time: '',
    timezone: 'Africa/Lagos',
    notes: '',
  })

  useEffect(() => {
    apiGet<Booking[]>('/api/bookings')
      .then(data => setBookings(data))
      .catch(err => setError(err instanceof Error ? err.message : 'Could not load bookings.'))
      .finally(() => setLoading(false))
  }, [])

  function update(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setError('')
    setSaved('')
    setSaving(true)

    try {
      const booking = await apiSend<Booking>('/api/bookings', 'POST', form)
      setBookings(prev => [booking, ...prev])
      setSaved('Booking request sent. The team will confirm the final time.')
      setForm({
        topic: '',
        meeting_type: 'discovery',
        preferred_date: '',
        preferred_time: '',
        timezone: 'Africa/Lagos',
        notes: '',
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not request booking.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <style>{`
        .bk-wrap { display: grid; grid-template-columns: minmax(0, 0.92fr) minmax(360px, 0.58fr); gap: 1.25rem; align-items: start; }
        .bk-hero { margin-bottom: 1.4rem; }
        .bk-hero h2 { font-family: var(--font-heading); font-size: clamp(1.55rem, 2vw, 2.1rem); color: var(--clr-text); margin: 0 0 0.35rem; letter-spacing: -0.02em; }
        .bk-hero p { color: var(--clr-text-subtle); margin: 0; max-width: 62ch; line-height: 1.65; }
        .bk-glass {
          background: rgba(255,255,255,0.72);
          border: 1px solid rgba(255,255,255,0.82);
          border-radius: 18px;
          box-shadow: 0 20px 55px rgba(18,42,29,0.08);
          backdrop-filter: blur(24px) saturate(160%);
        }
        [data-theme="dark"] .bk-glass { background: rgba(20,28,24,0.72); border-color: rgba(255,255,255,0.1); }
        .bk-list { overflow: hidden; }
        .bk-list-head { padding: 1rem 1.15rem; border-bottom: 1px solid rgba(27,67,50,0.08); display: flex; justify-content: space-between; gap: 1rem; align-items: center; }
        .bk-list-head strong { font-family: var(--font-heading); color: var(--clr-text); }
        .bk-item { padding: 1rem 1.15rem; border-bottom: 1px solid rgba(27,67,50,0.06); display: grid; grid-template-columns: 48px minmax(0, 1fr) auto; gap: 0.9rem; align-items: center; }
        .bk-item:last-child { border-bottom: 0; }
        .bk-date { width: 48px; height: 48px; border-radius: 14px; display: grid; place-items: center; text-align: center; background: linear-gradient(135deg, var(--clr-primary), #52B788); color: #fff; font-size: 0.72rem; font-weight: 800; line-height: 1.1; }
        .bk-title { font-family: var(--font-heading); font-weight: 800; color: var(--clr-text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .bk-meta { color: var(--clr-text-subtle); font-size: 0.8rem; margin-top: 0.18rem; }
        .bk-status { font-size: 0.72rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.06em; color: var(--clr-primary); background: rgba(27,67,50,0.08); padding: 0.35rem 0.7rem; border-radius: 999px; white-space: nowrap; }
        .bk-form { padding: 1.15rem; position: sticky; top: 82px; }
        .bk-form h3 { font-family: var(--font-heading); font-size: 1.05rem; color: var(--clr-text); margin: 0 0 0.8rem; }
        .bk-row { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }
        .bk-alert { padding: 0.75rem 0.9rem; border-radius: 12px; font-size: 0.85rem; margin-bottom: 1rem; }
        .bk-alert.error { color: #991b1b; background: #fee2e2; border: 1px solid #fecaca; }
        .bk-alert.saved { color: #14532d; background: #dcfce7; border: 1px solid #bbf7d0; }
        .bk-empty { padding: 2.25rem 1.25rem; text-align: center; color: var(--clr-text-subtle); }
        .bk-empty strong { display: block; color: var(--clr-text); font-family: var(--font-heading); font-size: 1rem; margin-bottom: 0.35rem; }
        @media (max-width: 960px) {
          .bk-wrap { grid-template-columns: 1fr; }
          .bk-form { position: static; }
        }
        @media (max-width: 560px) {
          .bk-row { grid-template-columns: 1fr; }
          .bk-item { grid-template-columns: 48px minmax(0, 1fr); }
          .bk-status { grid-column: 2; justify-self: start; }
        }
      `}</style>

      <div className="bk-hero">
        <h2>Bookings</h2>
        <p>Request focused conversations for product decisions, research planning, implementation support, or growth work. The team will review and confirm the final time.</p>
      </div>

      <div className="bk-wrap">
        <section className="bk-glass bk-list">
          <div className="bk-list-head">
            <strong>Upcoming and requested sessions</strong>
            <span className="bk-status">{bookings.length} total</span>
          </div>

          {loading ? (
            <div className="bk-empty"><strong>Loading bookings</strong>Preparing your schedule.</div>
          ) : bookings.length === 0 ? (
            <div className="bk-empty"><strong>No bookings yet</strong>Use the request form to start a conversation with the team.</div>
          ) : (
            bookings.map(booking => (
              <article key={booking.id} className="bk-item">
                <div className="bk-date">{formatDate(booking.preferred_date)}</div>
                <div style={{ minWidth: 0 }}>
                  <div className="bk-title">{booking.topic}</div>
                  <div className="bk-meta">
                    {booking.preferred_time} · {booking.timezone} · {MEETING_TYPES.find(type => type.value === booking.meeting_type)?.label || booking.meeting_type}
                  </div>
                  {booking.scheduled_date && (
                    <div className="bk-meta">
                      Confirmed: {formatDate(booking.scheduled_date)} · {booking.scheduled_time || 'Time TBC'} · {booking.scheduled_timezone || booking.timezone}
                    </div>
                  )}
                  {booking.meeting_url && (
                    <a className="bk-meta" href={booking.meeting_url} target="_blank" rel="noreferrer" style={{ display: 'inline-block', color: 'var(--clr-primary)', fontWeight: 800 }}>
                      Join meeting
                    </a>
                  )}
                  {booking.location && <div className="bk-meta">Location: {booking.location}</div>}
                  {booking.reschedule_reason && <div className="bk-meta">Reschedule note: {booking.reschedule_reason}</div>}
                  {booking.admin_notes && <div className="bk-meta">Team note: {booking.admin_notes}</div>}
                </div>
                <span className="bk-status">{statusLabel(booking.status)}</span>
              </article>
            ))
          )}
        </section>

        <form className="bk-glass bk-form" onSubmit={handleSubmit}>
          <h3>Request a session</h3>
          {error && <div className="bk-alert error">{error}</div>}
          {saved && <div className="bk-alert saved">{saved}</div>}

          <div className="form-group">
            <label className="form-label" htmlFor="topic">Conversation topic</label>
            <input id="topic" className="form-control" value={form.topic} onChange={event => update('topic', event.target.value)} placeholder="Product launch, research brief, growth plan..." required />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="meeting_type">Session type</label>
            <select id="meeting_type" className="form-control" value={form.meeting_type} onChange={event => update('meeting_type', event.target.value)}>
              {MEETING_TYPES.map(type => <option key={type.value} value={type.value}>{type.label}</option>)}
            </select>
          </div>

          <div className="bk-row">
            <div className="form-group">
              <label className="form-label" htmlFor="preferred_date">Preferred date</label>
              <input id="preferred_date" className="form-control" type="date" value={form.preferred_date} onChange={event => update('preferred_date', event.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="preferred_time">Preferred time</label>
              <input id="preferred_time" className="form-control" type="time" value={form.preferred_time} onChange={event => update('preferred_time', event.target.value)} required />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="timezone">Timezone</label>
            <input id="timezone" className="form-control" value={form.timezone} onChange={event => update('timezone', event.target.value)} placeholder="Africa/Lagos" />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="notes">Context</label>
            <textarea id="notes" className="form-control" rows={5} value={form.notes} onChange={event => update('notes', event.target.value)} placeholder="Share what you want the session to help decide or unblock." />
          </div>

          <button className="btn btn-primary" disabled={saving} type="submit">
            {saving ? 'Sending...' : 'Request Booking'}
          </button>
        </form>
      </div>
    </>
  )
}
