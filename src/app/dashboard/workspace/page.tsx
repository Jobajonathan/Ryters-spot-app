'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { apiGet } from '@/lib/api/client'

type Workspace = {
  projects: Array<{ id: string; title: string; service: string; status: string; updated_at: string | null; expected_delivery_at: string | null }>
  bookings: Array<{ id: string; topic: string; status: string; preferred_date: string; preferred_time: string; timezone: string; scheduled_date: string | null; scheduled_time: string | null; scheduled_timezone: string | null; meeting_url: string | null; location: string | null }>
  payments: Array<{ id: string; amount: number; currency: string; status: string; payment_type: string; created_at: string; projects: { title: string } | null }>
  stats: { activeProjects: number; openBookings: number; unreadMessages: number }
}

function label(value: string) {
  return value.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

function date(value: string | null) {
  if (!value) return 'TBC'
  return new Date(value).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

export default function WorkspacePage() {
  const [workspace, setWorkspace] = useState<Workspace | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    apiGet<Workspace>('/api/workspace')
      .then(setWorkspace)
      .catch(err => setError(err instanceof Error ? err.message : 'Could not load workspace.'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <>
      <style>{`
        .ws-head { margin-bottom: 1.35rem; display: flex; align-items: flex-end; justify-content: space-between; gap: 1rem; flex-wrap: wrap; }
        .ws-head h2 { font-family: var(--font-heading); color: var(--clr-text); font-size: clamp(1.55rem,2vw,2.1rem); margin: 0 0 0.25rem; letter-spacing: -0.02em; }
        .ws-head p { color: var(--clr-text-subtle); margin: 0; max-width: 64ch; line-height: 1.65; }
        .ws-glass { background: rgba(255,255,255,0.72); border: 1px solid rgba(255,255,255,0.82); border-radius: 18px; box-shadow: 0 20px 55px rgba(18,42,29,0.08); backdrop-filter: blur(24px) saturate(160%); }
        .ws-stats { display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: 0.9rem; margin-bottom: 1rem; }
        .ws-stat { padding: 1rem; }
        .ws-stat span { display: block; font-size: 0.72rem; color: var(--clr-text-subtle); text-transform: uppercase; letter-spacing: 0.08em; font-weight: 900; margin-bottom: 0.5rem; }
        .ws-stat strong { font-family: var(--font-heading); color: var(--clr-text); font-size: 1.7rem; }
        .ws-grid { display: grid; grid-template-columns: 1.15fr 0.85fr; gap: 1rem; }
        .ws-panel { overflow: hidden; }
        .ws-panel-head { padding: 1rem 1.15rem; border-bottom: 1px solid rgba(27,67,50,0.08); display: flex; justify-content: space-between; align-items: center; gap: 1rem; }
        .ws-panel-head strong { font-family: var(--font-heading); color: var(--clr-text); }
        .ws-row { display: grid; grid-template-columns: minmax(0,1fr) auto; gap: 0.85rem; padding: 1rem 1.15rem; border-bottom: 1px solid rgba(27,67,50,0.06); text-decoration: none; color: var(--clr-text); }
        .ws-row:last-child { border-bottom: 0; }
        .ws-row:hover { background: rgba(27,67,50,0.035); }
        .ws-title { font-family: var(--font-heading); font-weight: 800; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .ws-meta { color: var(--clr-text-subtle); font-size: 0.8rem; margin-top: 0.15rem; }
        .ws-pill { color: var(--clr-primary); background: rgba(27,67,50,0.08); border-radius: 999px; padding: 0.35rem 0.65rem; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.06em; font-weight: 900; white-space: nowrap; height: fit-content; }
        .ws-empty { padding: 2rem 1.15rem; color: var(--clr-text-subtle); text-align: center; }
        @media (max-width: 920px) { .ws-grid, .ws-stats { grid-template-columns: 1fr; } }
      `}</style>

      <div className="ws-head">
        <div>
          <h2>Workspace</h2>
          <p>One place for active projects, sessions, payments, and conversations around the work Ryters Spot is doing with you.</p>
        </div>
        <Link href="/dashboard/bookings" className="btn btn-primary btn-sm">Book a Session</Link>
      </div>

      {loading ? (
        <div className="ws-empty ws-glass">Loading workspace...</div>
      ) : error || !workspace ? (
        <div className="ws-empty ws-glass">{error || 'Workspace unavailable.'}</div>
      ) : (
        <>
          <div className="ws-stats">
            <div className="ws-stat ws-glass"><span>Active projects</span><strong>{workspace.stats.activeProjects}</strong></div>
            <div className="ws-stat ws-glass"><span>Open bookings</span><strong>{workspace.stats.openBookings}</strong></div>
            <div className="ws-stat ws-glass"><span>Unread messages</span><strong>{workspace.stats.unreadMessages}</strong></div>
          </div>

          <div className="ws-grid">
            <section className="ws-panel ws-glass">
              <div className="ws-panel-head"><strong>Projects</strong><Link href="/dashboard/projects" className="btn btn-ghost btn-sm">View all</Link></div>
              {workspace.projects.length === 0 ? <div className="ws-empty">No projects yet.</div> : workspace.projects.map(project => (
                <Link key={project.id} href="/dashboard/projects" className="ws-row">
                  <div><div className="ws-title">{project.title}</div><div className="ws-meta">{project.service} · Updated {date(project.updated_at)}</div></div>
                  <span className="ws-pill">{label(project.status)}</span>
                </Link>
              ))}
            </section>

            <section className="ws-panel ws-glass">
              <div className="ws-panel-head"><strong>Bookings</strong><Link href="/dashboard/bookings" className="btn btn-ghost btn-sm">Manage</Link></div>
              {workspace.bookings.length === 0 ? <div className="ws-empty">No bookings yet.</div> : workspace.bookings.map(booking => (
                <Link key={booking.id} href="/dashboard/bookings" className="ws-row">
                  <div><div className="ws-title">{booking.topic}</div><div className="ws-meta">{date(booking.scheduled_date || booking.preferred_date)} · {booking.scheduled_time || booking.preferred_time}</div></div>
                  <span className="ws-pill">{label(booking.status)}</span>
                </Link>
              ))}
            </section>
          </div>
        </>
      )}
    </>
  )
}

