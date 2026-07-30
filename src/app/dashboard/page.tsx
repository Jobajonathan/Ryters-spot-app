'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { apiGet } from '@/lib/api/client'

type ProjectSummary = {
  id: string
  status: string
  title: string | null
  service: string | null
  created_at: string
  updated_at: string | null
}

type DashboardSummary = {
  profile: {
    firstName: string
    email: string
  }
  stats: {
    activeCount: number
    completedCount: number
    totalCount: number
    unreadMessages: number
    bookingCount: number
  }
  recentProjects: ProjectSummary[]
  nextBooking: {
    id: string
    topic: string
    meeting_type: string
    preferred_date: string
    preferred_time: string
    timezone: string
    status: string
  } | null
}

function statusLabel(status: string) {
  return status.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

export default function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    apiGet<DashboardSummary>('/api/dashboard/summary')
      .then(data => setSummary(data))
      .catch(err => setError(err instanceof Error ? err.message : 'Could not load dashboard.'))
      .finally(() => setLoading(false))
  }, [])

  const stats = summary?.stats
  const recentProjects = summary?.recentProjects ?? []

  return (
    <>
      <style>{`
        .dh-welcome {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 1rem;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
        }
        .dh-welcome h1 {
          font-size: clamp(1.55rem, 2vw, 2.2rem);
          font-weight: 800;
          letter-spacing: -0.02em;
          color: var(--clr-text);
          margin: 0 0 0.25rem;
        }
        .dh-welcome p { font-size: 0.95rem; color: var(--clr-text-subtle); margin: 0; }
        .dh-glass {
          background: rgba(255,255,255,0.72);
          border: 1px solid rgba(255,255,255,0.82);
          border-radius: 18px;
          box-shadow: 0 20px 55px rgba(18, 42, 29, 0.08);
          backdrop-filter: blur(24px) saturate(160%);
        }
        [data-theme="dark"] .dh-glass {
          background: rgba(20,28,24,0.72);
          border-color: rgba(255,255,255,0.1);
        }
        .dh-stats {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        .dh-stat { padding: 1.15rem; position: relative; overflow: hidden; }
        .dh-stat::before {
          content: '';
          position: absolute;
          inset: 0 0 auto;
          height: 3px;
          background: linear-gradient(90deg, var(--clr-primary), #C9A84C);
        }
        .dh-stat-label {
          display: block;
          font-size: 0.72rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--clr-text-subtle);
          margin-bottom: 0.65rem;
        }
        .dh-stat-value {
          display: block;
          font-family: var(--font-heading);
          font-size: 2rem;
          font-weight: 800;
          line-height: 1;
          color: var(--clr-text);
          margin-bottom: 0.35rem;
        }
        .dh-stat-sub { font-size: 0.8rem; color: var(--clr-text-subtle); }
        .dh-actions {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 0.85rem;
          margin-bottom: 1.5rem;
        }
        .dh-action {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          min-height: 72px;
          padding: 1rem;
          color: var(--clr-text);
          text-decoration: none;
          transition: transform 0.18s ease, box-shadow 0.18s ease;
        }
        .dh-action:hover { transform: translateY(-2px); box-shadow: 0 24px 60px rgba(18, 42, 29, 0.12); }
        .dh-action-mark {
          width: 38px;
          height: 38px;
          border-radius: 12px;
          display: grid;
          place-items: center;
          background: rgba(27,67,50,0.09);
          color: var(--clr-primary);
          font-family: var(--font-heading);
          font-weight: 800;
          flex: 0 0 auto;
        }
        .dh-section-title {
          font-family: var(--font-heading);
          font-size: 0.78rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--clr-text-subtle);
          margin: 0 0 0.8rem;
        }
        .dh-projects { overflow: hidden; margin-bottom: 1.5rem; }
        .dh-projects-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          padding: 1rem 1.15rem;
          border-bottom: 1px solid rgba(27,67,50,0.08);
        }
        .dh-projects-title {
          font-family: var(--font-heading);
          font-weight: 800;
          color: var(--clr-text);
        }
        .dh-project-row {
          display: grid;
          grid-template-columns: 40px minmax(0, 1fr) auto;
          align-items: center;
          gap: 0.9rem;
          padding: 1rem 1.15rem;
          color: var(--clr-text);
          text-decoration: none;
          border-bottom: 1px solid rgba(27,67,50,0.06);
        }
        .dh-project-row:last-child { border-bottom: 0; }
        .dh-project-row:hover { background: rgba(27,67,50,0.035); }
        .dh-project-mark {
          width: 40px;
          height: 40px;
          border-radius: 13px;
          display: grid;
          place-items: center;
          color: #fff;
          background: linear-gradient(135deg, var(--clr-primary), #52B788);
          font-weight: 800;
        }
        .dh-project-title {
          font-family: var(--font-heading);
          font-size: 0.92rem;
          font-weight: 700;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .dh-project-service { font-size: 0.78rem; color: var(--clr-text-subtle); margin-top: 0.12rem; }
        .dh-project-meta { display: flex; align-items: center; gap: 0.7rem; }
        .dh-project-date { color: var(--clr-text-subtle); font-size: 0.76rem; }
        .dh-empty {
          text-align: center;
          padding: 2.5rem 1.5rem;
          margin-bottom: 1.5rem;
        }
        .dh-empty h3 {
          font-family: var(--font-heading);
          font-size: 1.1rem;
          font-weight: 800;
          color: var(--clr-text);
          margin: 0 0 0.4rem;
        }
        .dh-empty p { color: var(--clr-text-subtle); max-width: 38ch; margin: 0 auto 1.25rem; }
        .dh-start-card {
          padding: 1.4rem;
          color: #fff;
          background:
            linear-gradient(135deg, rgba(27,67,50,0.96), rgba(45,106,79,0.94)),
            radial-gradient(circle at 85% 10%, rgba(201,168,76,0.22), transparent 30%);
          border-radius: 18px;
          box-shadow: 0 22px 60px rgba(13, 38, 27, 0.18);
        }
        .dh-start-title { font-family: var(--font-heading); font-size: 1.1rem; font-weight: 800; margin-bottom: 0.35rem; }
        .dh-start-sub { color: rgba(255,255,255,0.72); margin: 0 0 1rem; }
        .dh-start-steps { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.9rem; }
        .dh-start-step { padding: 0.95rem; border-radius: 14px; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.12); }
        .dh-start-num {
          width: 26px;
          height: 26px;
          border-radius: 999px;
          display: grid;
          place-items: center;
          background: rgba(201,168,76,0.22);
          color: #F3D881;
          font-weight: 800;
          margin-bottom: 0.65rem;
        }
        .dh-start-step-title { font-family: var(--font-heading); font-weight: 800; margin-bottom: 0.18rem; }
        .dh-start-step-desc { font-size: 0.8rem; color: rgba(255,255,255,0.68); line-height: 1.5; }
        @media (max-width: 900px) {
          .dh-stats { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .dh-actions, .dh-start-steps { grid-template-columns: 1fr; }
          .dh-project-row { grid-template-columns: 40px minmax(0, 1fr); }
          .dh-project-meta { grid-column: 2; justify-content: space-between; }
        }
      `}</style>

      {loading ? (
        <div className="dh-empty dh-glass">
          <h3>Loading dashboard</h3>
          <p>Preparing your project summary.</p>
        </div>
      ) : error || !summary || !stats ? (
        <div className="dh-empty dh-glass">
          <h3>Dashboard unavailable</h3>
          <p>{error || 'Please refresh the page to try again.'}</p>
        </div>
      ) : (
        <>
          <div className="dh-welcome">
            <div>
              <h1>Welcome back, {summary.profile.firstName}</h1>
              <p>Your project activity, messages, and next steps are gathered here.</p>
            </div>
            <Link href="/dashboard/request" className="btn btn-primary btn-sm" style={{ fontFamily: 'var(--font-heading)', fontWeight: 700 }}>
              New Request
            </Link>
          </div>

          <div className="dh-stats">
            <div className="dh-stat dh-glass">
              <span className="dh-stat-label">Active Projects</span>
              <span className="dh-stat-value">{stats.activeCount}</span>
              <span className="dh-stat-sub">In progress or review</span>
            </div>
            <div className="dh-stat dh-glass">
              <span className="dh-stat-label">Completed</span>
              <span className="dh-stat-value">{stats.completedCount}</span>
              <span className="dh-stat-sub">Delivered projects</span>
            </div>
            <div className="dh-stat dh-glass">
              <span className="dh-stat-label">Total Requests</span>
              <span className="dh-stat-value">{stats.totalCount}</span>
              <span className="dh-stat-sub">All time</span>
            </div>
            <div className="dh-stat dh-glass">
              <span className="dh-stat-label">Bookings</span>
              <span className="dh-stat-value">{stats.bookingCount}</span>
              <span className="dh-stat-sub">{summary.nextBooking ? 'Next session scheduled' : 'No sessions yet'}</span>
            </div>
          </div>

          <p className="dh-section-title">Quick Actions</p>
          <div className="dh-actions">
            <Link href="/dashboard/request" className="dh-action dh-glass">
              <span className="dh-action-mark">+</span>
              <span>Request a Service</span>
            </Link>
            <Link href="/dashboard/projects" className="dh-action dh-glass">
              <span className="dh-action-mark">P</span>
              <span>View Projects</span>
            </Link>
            <Link href="/dashboard/messages" className="dh-action dh-glass">
              <span className="dh-action-mark">M</span>
              <span>Messages{stats.unreadMessages > 0 ? ` (${stats.unreadMessages})` : ''}</span>
            </Link>
            <Link href="/dashboard/bookings" className="dh-action dh-glass">
              <span className="dh-action-mark">B</span>
              <span>{summary.nextBooking ? 'View Next Booking' : 'Book a Session'}</span>
            </Link>
          </div>

          {summary.nextBooking && (
            <>
              <p className="dh-section-title">Next Booking</p>
              <div className="dh-projects dh-glass">
                <Link href="/dashboard/bookings" className="dh-project-row">
                  <div className="dh-project-mark">B</div>
                  <div style={{ minWidth: 0 }}>
                    <div className="dh-project-title">{summary.nextBooking.topic}</div>
                    <div className="dh-project-service">
                      {new Date(`${summary.nextBooking.preferred_date}T00:00:00`).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })} · {summary.nextBooking.preferred_time} · {summary.nextBooking.timezone}
                    </div>
                  </div>
                  <div className="dh-project-meta">
                    <span className={`status-badge status-${summary.nextBooking.status}`}>{statusLabel(summary.nextBooking.status)}</span>
                  </div>
                </Link>
              </div>
            </>
          )}

          {recentProjects.length > 0 ? (
            <>
              <p className="dh-section-title">Recent Projects</p>
              <div className="dh-projects dh-glass">
                <div className="dh-projects-head">
                  <span className="dh-projects-title">Your Projects</span>
                  <Link href="/dashboard/projects" className="btn btn-ghost btn-sm" style={{ fontFamily: 'var(--font-heading)', fontWeight: 700 }}>
                    View All
                  </Link>
                </div>
                {recentProjects.map(project => (
                  <Link key={project.id} href="/dashboard/projects" className="dh-project-row">
                    <div className="dh-project-mark">P</div>
                    <div style={{ minWidth: 0 }}>
                      <div className="dh-project-title">{project.title || 'Untitled Project'}</div>
                      <div className="dh-project-service">{project.service || 'General'}</div>
                    </div>
                    <div className="dh-project-meta">
                      <span className={`status-badge status-${project.status}`}>{statusLabel(project.status)}</span>
                      <span className="dh-project-date">
                        {new Date(project.updated_at || project.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          ) : (
            <>
              <p className="dh-section-title">Get Started</p>
              <div className="dh-empty dh-glass">
                <h3>No projects yet</h3>
                <p>Submit your first service request and we will respond with a quote within 24 hours.</p>
                <Link href="/dashboard/request" className="btn btn-primary" style={{ fontFamily: 'var(--font-heading)', fontWeight: 700 }}>
                  Request a Service
                </Link>
              </div>
            </>
          )}

          <div className="dh-start-card">
            <div className="dh-start-title">How it works</div>
            <p className="dh-start-sub">Three steps from brief to delivery.</p>
            <div className="dh-start-steps">
              {[
                { n: '1', t: 'Submit a brief', d: 'Tell us the requirement, deadline, and business context.' },
                { n: '2', t: 'Get a custom quote', d: 'We respond with scope, timeline, and next decisions.' },
                { n: '3', t: 'Track and receive', d: 'Follow progress, chat with the team, and download deliverables.' },
              ].map(step => (
                <div key={step.n} className="dh-start-step">
                  <div className="dh-start-num">{step.n}</div>
                  <div className="dh-start-step-title">{step.t}</div>
                  <div className="dh-start-step-desc">{step.d}</div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  )
}
