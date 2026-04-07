import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const fullName = user?.user_metadata?.full_name as string | undefined
  const firstName = fullName ? fullName.split(' ')[0] : (user?.email?.split('@')[0] ?? 'there')

  // Fetch real project stats
  const { data: projects } = await supabase.from('projects').select('id, status').eq('client_id', user?.id ?? '')
  const activeCount = projects?.filter(p => ['pending','in_review','in_progress'].includes(p.status)).length ?? 0
  const completedCount = projects?.filter(p => p.status === 'completed').length ?? 0
  const totalCount = projects?.length ?? 0

  // Fetch unread message count (admin messages not yet read by client)
  const projectIds = projects?.map(p => p.id) ?? []
  let unreadMessages = 0
  if (projectIds.length > 0) {
    const { count } = await supabase.from('messages')
      .select('id', { count: 'exact', head: true })
      .in('project_id', projectIds)
      .eq('is_admin', true)
      .eq('read_by_client', false)
    unreadMessages = count ?? 0
  }

  const stats = [
    { label: 'Active Projects', value: activeCount, icon: '&#128193;', note: null },
    { label: 'Completed Projects', value: completedCount, icon: '&#9989;', note: null },
    { label: 'Total Requests', value: totalCount, icon: '&#128203;', note: null },
    { label: 'Unread Messages', value: unreadMessages, icon: '&#128172;', note: unreadMessages > 0 ? 'New' : null },
  ]

  return (
    <>
      <style>{`
        .dash-welcome { margin-bottom: 2rem; }
        .dash-welcome h2 { font-family: var(--font-serif); font-size: 1.75rem; color: var(--clr-text); margin-bottom: 0.35rem; }
        .dash-welcome p { color: var(--clr-text-muted); font-size: 0.95rem; }
        .stat-cards { display: grid; grid-template-columns: repeat(4,1fr); gap: 1rem; margin-bottom: 2rem; }
        .stat-card { background: var(--clr-surface); border: 1px solid var(--clr-border); border-radius: var(--radius-lg); padding: 1.25rem 1.5rem; }
        .stat-card-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem; }
        .stat-card-icon { font-size: 1.5rem; }
        .stat-card-badge { font-size: 0.65rem; background: var(--clr-surface-2); color: var(--clr-text-subtle); padding: 2px 6px; border-radius: 100px; font-weight: 600; }
        .stat-card-value { font-family: var(--font-serif); font-size: 2.2rem; font-weight: 700; color: var(--clr-primary); line-height: 1; margin-bottom: 0.35rem; }
        .stat-card-label { font-size: 0.82rem; color: var(--clr-text-muted); font-weight: 500; }
        .quick-actions { margin-bottom: 2rem; }
        .quick-actions h3 { font-family: var(--font-serif); font-size: 1.2rem; margin-bottom: 1rem; color: var(--clr-text); }
        .quick-btns { display: flex; gap: 1rem; flex-wrap: wrap; }
        .quick-btn { display: flex; align-items: center; gap: 0.75rem; padding: 1rem 1.5rem; background: var(--clr-surface); border: 1px solid var(--clr-border); border-radius: var(--radius-lg); text-decoration: none; color: var(--clr-text); font-weight: 600; font-size: 0.95rem; transition: all 0.2s; }
        .quick-btn:hover { border-color: var(--clr-primary-light); background: var(--clr-surface-2); transform: translateY(-2px); box-shadow: var(--shadow-md); }
        .quick-btn-icon { font-size: 1.5rem; }
        .getting-started { background: var(--clr-surface); border: 1px solid var(--clr-border); border-radius: var(--radius-lg); padding: 1.5rem; margin-bottom: 2rem; }
        .getting-started h3 { font-family: var(--font-serif); font-size: 1.2rem; margin-bottom: 1.25rem; color: var(--clr-text); }
        .steps-list { display: flex; flex-direction: column; gap: 1rem; }
        .step-item { display: flex; align-items: flex-start; gap: 1rem; }
        .step-num { width: 32px; height: 32px; border-radius: 50%; background: var(--clr-primary); color: #fff; font-family: var(--font-serif); font-weight: 700; display: flex; align-items: center; justify-content: center; font-size: 0.9rem; flex-shrink: 0; }
        .step-text h4 { font-size: 0.95rem; margin-bottom: 2px; color: var(--clr-text); }
        .step-text p { font-size: 0.82rem; color: var(--clr-text-muted); margin: 0; }
        .empty-state { background: var(--clr-surface); border: 1px solid var(--clr-border); border-radius: var(--radius-lg); padding: 3rem 2rem; text-align: center; }
        .empty-state-icon { font-size: 3rem; margin-bottom: 1rem; }
        .empty-state h3 { font-family: var(--font-serif); font-size: 1.25rem; margin-bottom: 0.5rem; color: var(--clr-text); }
        .empty-state p { color: var(--clr-text-muted); font-size: 0.9rem; margin-bottom: 1.5rem; }
        @media (max-width: 900px) { .stat-cards { grid-template-columns: repeat(2,1fr); } }
        @media (max-width: 500px) { .stat-cards { grid-template-columns: 1fr; } }
      `}</style>

      <div className="dash-welcome">
        <h2>Welcome back, {firstName}!</h2>
        <p>Here is what is happening with your account today.</p>
      </div>

      <div className="stat-cards">
        {stats.map((s, i) => (
          <div key={i} className="stat-card">
            <div className="stat-card-top">
              <span className="stat-card-icon" dangerouslySetInnerHTML={{ __html: s.icon }} />
              {s.note && <span className="stat-card-badge">{s.note}</span>}
            </div>
            <div className="stat-card-value">{s.value}</div>
            <div className="stat-card-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="quick-btns">
          <Link href="/dashboard/request" className="quick-btn">
            <span className="quick-btn-icon">&#43;</span>
            <span>Request a Service</span>
          </Link>
          <Link href="/dashboard/projects" className="quick-btn">
            <span className="quick-btn-icon">&#128193;</span>
            <span>View My Projects</span>
          </Link>
          <Link href="/dashboard/messages" className="quick-btn">
            <span className="quick-btn-icon">&#128172;</span>
            <span>Messages</span>
          </Link>
        </div>
      </div>

      <div className="getting-started">
        <h3>Getting Started</h3>
        <div className="steps-list">
          <div className="step-item">
            <div className="step-num">1</div>
            <div className="step-text">
              <h4>Complete your profile</h4>
              <p>Add your company details and preferences so we can serve you better.</p>
            </div>
          </div>
          <div className="step-item">
            <div className="step-num">2</div>
            <div className="step-text">
              <h4>Request your first service</h4>
              <p>Browse our four service areas and submit your first project request.</p>
            </div>
          </div>
          <div className="step-item">
            <div className="step-num" style={{ background: 'var(--clr-accent)' }}>3</div>
            <div className="step-text">
              <h4>Track your project</h4>
              <p>Follow progress in real time, download deliverables and communicate with your team.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="empty-state">
        <div className="empty-state-icon">&#128218;</div>
        <h3>No active projects yet</h3>
        <p>Click &lsquo;Request a Service&rsquo; to get started with your first Ryters Spot project.</p>
        <Link href="/dashboard/request" className="btn btn-primary">Request a Service</Link>
      </div>
    </>
  )
}
