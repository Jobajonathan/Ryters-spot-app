import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const fullName = user?.user_metadata?.full_name as string | undefined
  const firstName = fullName ? fullName.split(' ')[0] : (user?.email?.split('@')[0] ?? 'there')

  const { data: projects } = await supabase
    .from('projects')
    .select('id, status, title, service, created_at, updated_at')
    .eq('client_id', user?.id ?? '')
    .order('updated_at', { ascending: false })

  const activeCount    = projects?.filter(p => ['pending','in_review','accepted','in_progress'].includes(p.status)).length ?? 0
  const completedCount = projects?.filter(p => p.status === 'completed').length ?? 0
  const totalCount     = projects?.length ?? 0

  const projectIds = projects?.map(p => p.id) ?? []
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

  const recentProjects = projects?.slice(0, 3) ?? []

  function statusLabel(s: string) {
    return s.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
  }

  return (
    <>
      <style>{`
        /* Welcome */
        .dh-welcome {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 1rem;
          margin-bottom: 2rem;
          flex-wrap: wrap;
        }
        .dh-welcome-text h1 {
          font-size: 1.65rem;
          font-weight: 800;
          letter-spacing: -0.025em;
          color: var(--clr-text);
          margin-bottom: 0.25rem;
        }
        .dh-welcome-text p { font-size: 0.9rem; color: var(--clr-text-subtle); margin: 0; }

        /* Stat cards */
        .dh-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
          margin-bottom: 2rem;
        }
        .dh-stat {
          background: #fff;
          border: 1.5px solid #E8EAED;
          border-radius: 14px;
          padding: 1.25rem 1.5rem;
          position: relative;
          overflow: hidden;
          transition: box-shadow 0.18s;
        }
        [data-theme="dark"] .dh-stat { background: var(--clr-surface); border-color: var(--clr-border); }
        .dh-stat:hover { box-shadow: 0 4px 16px rgba(27,67,50,0.08); }
        .dh-stat-accent {
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          background: linear-gradient(90deg, var(--clr-primary), var(--clr-primary-light));
          border-radius: 14px 14px 0 0;
        }
        .dh-stat-accent--gold { background: linear-gradient(90deg, #C9A84C, #E8C97A); }
        .dh-stat-label {
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.09em;
          text-transform: uppercase;
          color: var(--clr-text-subtle);
          margin-bottom: 0.6rem;
          display: block;
        }
        .dh-stat-value {
          font-family: var(--font-heading);
          font-size: 2.2rem;
          font-weight: 800;
          color: var(--clr-text);
          letter-spacing: -0.04em;
          line-height: 1;
          margin-bottom: 0.25rem;
          display: block;
        }
        .dh-stat-sub { font-size: 0.78rem; color: var(--clr-text-subtle); }
        .dh-stat-badge {
          display: inline-block;
          background: #fef3c7;
          color: #92400e;
          font-size: 0.65rem;
          font-weight: 700;
          padding: 0.2rem 0.5rem;
          border-radius: 100px;
          letter-spacing: 0.04em;
        }

        /* Quick actions */
        .dh-section-title {
          font-family: var(--font-heading);
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 0.09em;
          text-transform: uppercase;
          color: var(--clr-text-subtle);
          margin-bottom: 0.85rem;
        }
        .dh-quick {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.75rem;
          margin-bottom: 2rem;
        }
        .dh-quick-btn {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          padding: 1rem 1.25rem;
          background: #fff;
          border: 1.5px solid #E8EAED;
          border-radius: 14px;
          text-decoration: none;
          color: var(--clr-text);
          font-family: var(--font-heading);
          font-weight: 600;
          font-size: 0.9rem;
          transition: all 0.18s;
        }
        [data-theme="dark"] .dh-quick-btn { background: var(--clr-surface); border-color: var(--clr-border); }
        .dh-quick-btn:hover {
          border-color: var(--clr-primary);
          background: rgba(27,67,50,0.03);
          transform: translateY(-2px);
          box-shadow: 0 4px 14px rgba(27,67,50,0.08);
        }
        .dh-quick-icon {
          width: 40px; height: 40px;
          border-radius: 10px;
          background: rgba(27,67,50,0.07);
          display: flex; align-items: center; justify-content: center;
          font-size: 1.1rem;
          flex-shrink: 0;
          transition: background 0.18s;
        }
        .dh-quick-btn:hover .dh-quick-icon { background: rgba(27,67,50,0.12); }
        .dh-quick-icon--gold { background: rgba(201,168,76,0.12); }
        .dh-quick-btn:hover .dh-quick-icon--gold { background: rgba(201,168,76,0.2); }

        /* Recent projects */
        .dh-projects-card {
          background: #fff;
          border: 1.5px solid #E8EAED;
          border-radius: 16px;
          overflow: hidden;
          margin-bottom: 2rem;
        }
        [data-theme="dark"] .dh-projects-card { background: var(--clr-surface); border-color: var(--clr-border); }
        .dh-projects-hd {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid #F3F4F6;
        }
        [data-theme="dark"] .dh-projects-hd { border-bottom-color: var(--clr-border); }
        .dh-projects-hd-title {
          font-family: var(--font-heading);
          font-size: 1rem;
          font-weight: 700;
          color: var(--clr-text);
          letter-spacing: -0.01em;
        }
        .dh-project-row {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem 1.5rem;
          border-bottom: 1px solid #F9FAFB;
          text-decoration: none;
          transition: background 0.14s;
        }
        [data-theme="dark"] .dh-project-row { border-bottom-color: var(--clr-border); }
        .dh-project-row:last-child { border-bottom: none; }
        .dh-project-row:hover { background: #F9FAFB; }
        [data-theme="dark"] .dh-project-row:hover { background: var(--clr-surface-2); }
        .dh-project-icon {
          width: 38px; height: 38px;
          border-radius: 10px;
          background: linear-gradient(135deg, var(--clr-primary), var(--clr-primary-light));
          display: flex; align-items: center; justify-content: center;
          font-size: 1rem;
          color: #fff;
          flex-shrink: 0;
        }
        .dh-project-title {
          font-family: var(--font-heading);
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--clr-text);
          margin-bottom: 0.15rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .dh-project-service { font-size: 0.75rem; color: var(--clr-text-subtle); }
        .dh-project-meta { margin-left: auto; display: flex; align-items: center; gap: 0.75rem; flex-shrink: 0; }
        .dh-project-date { font-size: 0.72rem; color: var(--clr-text-subtle); }

        /* Getting started card */
        .dh-start-card {
          background: linear-gradient(135deg, var(--clr-primary) 0%, #2D6A4F 100%);
          border-radius: 16px;
          padding: 2rem;
          color: #fff;
          margin-bottom: 2rem;
          position: relative;
          overflow: hidden;
        }
        .dh-start-card::before {
          content: '';
          position: absolute;
          top: -40px; right: -40px;
          width: 200px; height: 200px;
          border-radius: 50%;
          background: rgba(201,168,76,0.1);
        }
        .dh-start-card::after {
          content: '';
          position: absolute;
          bottom: -60px; right: 60px;
          width: 150px; height: 150px;
          border-radius: 50%;
          background: rgba(255,255,255,0.04);
        }
        .dh-start-title {
          font-family: var(--font-heading);
          font-size: 1.25rem;
          font-weight: 800;
          color: #fff;
          margin-bottom: 0.5rem;
          position: relative;
        }
        .dh-start-sub { font-size: 0.9rem; color: rgba(255,255,255,0.72); margin-bottom: 1.5rem; position: relative; }
        .dh-start-steps { display: flex; flex-direction: column; gap: 0.85rem; position: relative; }
        .dh-start-step { display: flex; align-items: flex-start; gap: 0.85rem; }
        .dh-start-num {
          width: 28px; height: 28px;
          border-radius: 50%;
          background: rgba(201,168,76,0.25);
          border: 1.5px solid rgba(201,168,76,0.5);
          display: flex; align-items: center; justify-content: center;
          font-family: var(--font-heading);
          font-size: 0.78rem;
          font-weight: 700;
          color: #C9A84C;
          flex-shrink: 0;
          margin-top: 1px;
        }
        .dh-start-step-title { font-family: var(--font-heading); font-size: 0.9rem; font-weight: 600; color: #fff; margin-bottom: 0.1rem; }
        .dh-start-step-desc { font-size: 0.8rem; color: rgba(255,255,255,0.65); }

        /* Empty state */
        .dh-empty {
          text-align: center;
          padding: 3rem 2rem;
          background: #fff;
          border: 1.5px dashed #E8EAED;
          border-radius: 16px;
          margin-bottom: 2rem;
        }
        [data-theme="dark"] .dh-empty { background: var(--clr-surface); border-color: var(--clr-border); }
        .dh-empty-icon { font-size: 2.5rem; margin-bottom: 1rem; opacity: 0.4; }
        .dh-empty h3 { font-family: var(--font-heading); font-size: 1.1rem; font-weight: 700; color: var(--clr-text); margin-bottom: 0.4rem; }
        .dh-empty p { font-size: 0.875rem; color: var(--clr-text-subtle); max-width: 36ch; margin: 0 auto 1.5rem; }

        @media (max-width: 900px) {
          .dh-stats { grid-template-columns: repeat(2, 1fr); }
          .dh-quick { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 500px) {
          .dh-stats { grid-template-columns: 1fr 1fr; }
          .dh-quick { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* Welcome */}
      <div className="dh-welcome">
        <div className="dh-welcome-text">
          <h1>Welcome back, {firstName} 👋</h1>
          <p>Here&rsquo;s what&rsquo;s happening with your account today.</p>
        </div>
        <Link href="/dashboard/request" className="btn btn-primary btn-sm" style={{ fontFamily: 'var(--font-heading)', fontWeight: 700 }}>
          + New Request
        </Link>
      </div>

      {/* Stat cards */}
      <div className="dh-stats">
        <div className="dh-stat">
          <span className="dh-stat-accent" />
          <span className="dh-stat-label">Active Projects</span>
          <span className="dh-stat-value">{activeCount}</span>
          <span className="dh-stat-sub">In progress or review</span>
        </div>
        <div className="dh-stat">
          <span className="dh-stat-accent" />
          <span className="dh-stat-label">Completed</span>
          <span className="dh-stat-value">{completedCount}</span>
          <span className="dh-stat-sub">Delivered projects</span>
        </div>
        <div className="dh-stat">
          <span className="dh-stat-accent" />
          <span className="dh-stat-label">Total Requests</span>
          <span className="dh-stat-value">{totalCount}</span>
          <span className="dh-stat-sub">All time</span>
        </div>
        <div className="dh-stat">
          <span className={`dh-stat-accent${unreadMessages > 0 ? ' dh-stat-accent--gold' : ''}`} />
          <span className="dh-stat-label">Messages</span>
          <span className="dh-stat-value">{unreadMessages}</span>
          <span className="dh-stat-sub">
            {unreadMessages > 0
              ? <span className="dh-stat-badge">Unread</span>
              : 'All caught up'}
          </span>
        </div>
      </div>

      {/* Quick actions */}
      <p className="dh-section-title">Quick Actions</p>
      <div className="dh-quick">
        <Link href="/dashboard/request" className="dh-quick-btn">
          <span className="dh-quick-icon">✦</span>
          <span>Request a Service</span>
        </Link>
        <Link href="/dashboard/projects" className="dh-quick-btn">
          <span className="dh-quick-icon">▤</span>
          <span>View Projects</span>
        </Link>
        <Link href="/dashboard/messages" className="dh-quick-btn">
          <span className="dh-quick-icon dh-quick-icon--gold">◻</span>
          <span>Messages{unreadMessages > 0 ? ` (${unreadMessages})` : ''}</span>
        </Link>
      </div>

      {/* Recent projects */}
      {recentProjects.length > 0 ? (
        <>
          <p className="dh-section-title">Recent Projects</p>
          <div className="dh-projects-card">
            <div className="dh-projects-hd">
              <span className="dh-projects-hd-title">Your Projects</span>
              <Link href="/dashboard/projects" className="btn btn-ghost btn-sm" style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '0.8rem' }}>
                View All →
              </Link>
            </div>
            {recentProjects.map(p => (
              <Link key={p.id} href="/dashboard/projects" className="dh-project-row">
                <div className="dh-project-icon">📁</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="dh-project-title">{p.title || 'Untitled Project'}</div>
                  <div className="dh-project-service">{p.service || 'General'}</div>
                </div>
                <div className="dh-project-meta">
                  <span className={`status-badge status-${p.status}`}>{statusLabel(p.status)}</span>
                  <span className="dh-project-date">
                    {new Date(p.updated_at || p.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </>
      ) : (
        <>
          <p className="dh-section-title">Get Started</p>
          <div className="dh-empty">
            <div className="dh-empty-icon">📋</div>
            <h3>No projects yet</h3>
            <p>Submit your first service request and we&rsquo;ll respond with a quote within 24 hours.</p>
            <Link href="/dashboard/request" className="btn btn-primary" style={{ fontFamily: 'var(--font-heading)', fontWeight: 700 }}>
              Request a Service →
            </Link>
          </div>
        </>
      )}

      {/* Getting started guide */}
      <div className="dh-start-card">
        <div className="dh-start-title">How it works</div>
        <p className="dh-start-sub">Three simple steps from brief to delivery.</p>
        <div className="dh-start-steps">
          {[
            { n: '1', t: 'Submit a brief', d: 'Tell us your requirements, deadline and budget via the request form.' },
            { n: '2', t: 'Get a custom quote', d: 'We respond within 24 hours with a tailored proposal and timeline.' },
            { n: '3', t: 'Track & receive', d: 'Follow progress, chat with your consultant, and download deliverables here.' },
          ].map(s => (
            <div key={s.n} className="dh-start-step">
              <div className="dh-start-num">{s.n}</div>
              <div>
                <div className="dh-start-step-title">{s.t}</div>
                <div className="dh-start-step-desc">{s.d}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
