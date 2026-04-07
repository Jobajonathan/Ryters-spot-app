'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

type Stats = {
  totalProjects: number
  activeProjects: number
  pendingProjects: number
  completedProjects: number
  totalClients: number
  newClientsThisMonth: number
  projectsThisMonth: number
  projectsLastMonth: number
}

type RecentApp = {
  id: string
  title: string
  service: string
  status: string
  urgency: string
  created_at: string
  profiles: { full_name: string; email: string } | null
}

type StatusBreak = { status: string; count: number }

const SERVICE_LABELS: Record<string, string> = {
  research_academic: 'Research',
  digital_transformation: 'Digital',
  edtech: 'Ed-Tech',
  product_management: 'Product Mgmt',
}

const STATUS_COLORS: Record<string, { bg: string; color: string; label: string }> = {
  pending:     { bg: '#fef3c7', color: '#92400e', label: 'Pending' },
  in_review:   { bg: '#dbeafe', color: '#1e40af', label: 'In Review' },
  in_progress: { bg: '#d1fae5', color: '#065f46', label: 'In Progress' },
  completed:   { bg: '#f0fdf4', color: '#166534', label: 'Completed' },
  cancelled:   { bg: '#fee2e2', color: '#991b1b', label: 'Cancelled' },
}

function KpiCard({ label, value, sub, color, icon, href }: { label: string; value: number; sub?: string; color: string; icon: string; href?: string }) {
  const inner = (
    <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'flex-start', gap: '1rem', transition: 'box-shadow 0.15s, border-color 0.15s', cursor: href ? 'pointer' : 'default' }}
      onMouseEnter={e => { if (href) { (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 16px rgba(27,67,50,0.1)'; (e.currentTarget as HTMLDivElement).style.borderColor = '#1B4332' } }}
      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = 'none'; (e.currentTarget as HTMLDivElement).style.borderColor = '#e5e7eb' }}>
      <div style={{ width: 44, height: 44, borderRadius: 10, background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', flexShrink: 0 }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#111827', lineHeight: 1, fontFamily: 'Georgia, serif' }}>{value}</div>
        <div style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: 3 }}>{label}</div>
        {sub && <div style={{ fontSize: '0.72rem', color: color, marginTop: 4, fontWeight: 600 }}>{sub}</div>}
      </div>
    </div>
  )
  return href ? <Link href={href} style={{ textDecoration: 'none' }}>{inner}</Link> : inner
}

export default function AdminDashboard() {
  const router = useRouter()
  const [stats, setStats] = useState<Stats | null>(null)
  const [recent, setRecent] = useState<RecentApp[]>([])
  const [statusBreak, setStatusBreak] = useState<StatusBreak[]>([])
  const [loading, setLoading] = useState(true)
  const [popupDismissed, setPopupDismissed] = useState(false)

  useEffect(() => {
    fetch('/api/admin/analytics')
      .then(r => r.json())
      .then(data => {
        if (data.stats) setStats(data.stats)
        if (data.recentApplications) setRecent(data.recentApplications)
        if (data.statusBreakdown) setStatusBreak(data.statusBreakdown)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const trend = stats ? (
    stats.projectsLastMonth === 0
      ? null
      : Math.round(((stats.projectsThisMonth - stats.projectsLastMonth) / stats.projectsLastMonth) * 100)
  ) : null

  const maxCount = statusBreak.length ? Math.max(...statusBreak.map(s => s.count), 1) : 1

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem', color: '#9ca3af', flexDirection: 'column', gap: '0.75rem' }}>
      <div style={{ width: 28, height: 28, border: '3px solid #1B4332', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      Loading analytics...
    </div>
  )

  return (
    <>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .dash-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-bottom: 2rem; }
        .dash-grid-2 { display: grid; grid-template-columns: 1fr 340px; gap: 1.5rem; }
        .dash-card { background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; }
        .dash-card-header { padding: 1.25rem 1.5rem; border-bottom: 1px solid #f3f4f6; display: flex; justify-content: space-between; align-items: center; }
        .dash-card-title { font-size: 0.875rem; font-weight: 700; color: #111827; }
        .recent-table { width: 100%; border-collapse: collapse; }
        .recent-table th { font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.07em; color: #9ca3af; padding: 0.75rem 1.25rem; text-align: left; border-bottom: 1px solid #f3f4f6; }
        .recent-table td { padding: 0.85rem 1.25rem; font-size: 0.82rem; border-bottom: 1px solid #f9fafb; vertical-align: middle; }
        .recent-table tr:last-child td { border-bottom: none; }
        .recent-table tr:hover td { background: #f9fafb; }
        .status-bar { display: flex; align-items: center; gap: 0.75rem; padding: 0.6rem 1.25rem; }
        .status-bar-label { font-size: 0.78rem; color: #374151; width: 90px; flex-shrink: 0; }
        .status-bar-track { flex: 1; height: 8px; background: #f3f4f6; border-radius: 100px; overflow: hidden; }
        .status-bar-fill { height: 100%; border-radius: 100px; transition: width 0.5s ease; }
        .status-bar-count { font-size: 0.78rem; font-weight: 700; color: #374151; width: 24px; text-align: right; }
        @media (max-width: 900px) { .dash-grid { grid-template-columns: repeat(2, 1fr); } .dash-grid-2 { grid-template-columns: 1fr; } }
        @media (max-width: 500px) { .dash-grid { grid-template-columns: 1fr; } }
      `}</style>

      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '1.5rem', fontWeight: 700, color: '#111827', margin: 0, marginBottom: '0.25rem' }}>Dashboard</h1>
        <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0 }}>Welcome back. Here is what is happening today.</p>
      </div>

      {/* Pending applications popup banner */}
      {!popupDismissed && stats && stats.pendingProjects > 0 && (
        <div style={{ background: '#fef3c7', border: '1px solid #f59e0b', borderRadius: 10, padding: '1rem 1.25rem', marginBottom: '1.75rem', display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
          <div style={{ fontSize: '1.5rem', flexShrink: 0 }}>📋</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#92400e', marginBottom: '0.25rem' }}>
              {stats.pendingProjects} pending application{stats.pendingProjects > 1 ? 's' : ''} awaiting review
            </div>
            <div style={{ fontSize: '0.82rem', color: '#92400e', lineHeight: 1.6 }}>
              {recent.filter(r => r.status === 'pending' || r.status === 'in_review').slice(0, 3).map(r => (
                <div key={r.id} style={{ marginTop: 2 }}>
                  &bull; <strong>{r.title}</strong> — {r.profiles?.full_name || 'Unknown client'}
                </div>
              ))}
            </div>
            <Link href="/admin/applications" style={{ display: 'inline-block', marginTop: '0.6rem', fontSize: '0.82rem', fontWeight: 700, color: '#92400e', textDecoration: 'underline' }}>
              Review all applications →
            </Link>
          </div>
          <button onClick={() => setPopupDismissed(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#92400e', fontSize: '1.1rem', lineHeight: 1, padding: '0 0.25rem', flexShrink: 0 }} aria-label="Dismiss">✕</button>
        </div>
      )}

      {/* KPI row */}
      <div className="dash-grid">
        <KpiCard label="Total Clients" value={stats?.totalClients || 0} sub={`+${stats?.newClientsThisMonth || 0} this month`} color="#1B4332" icon="👥" href="/admin/users" />
        <KpiCard label="Total Projects" value={stats?.totalProjects || 0} sub={trend !== null ? `${trend >= 0 ? '+' : ''}${trend}% vs last month` : undefined} color="#C9A84C" icon="📋" href="/admin/applications" />
        <KpiCard label="Active Projects" value={stats?.activeProjects || 0} sub="In review + in progress" color="#2563eb" icon="⚡" href="/admin/applications" />
        <KpiCard label="Pending Review" value={stats?.pendingProjects || 0} sub={stats?.pendingProjects ? 'Needs attention' : 'All clear'} color={stats?.pendingProjects ? '#dc2626' : '#16a34a'} icon="⏳" href="/admin/applications" />
      </div>

      <div className="dash-grid-2">
        {/* Recent applications */}
        <div className="dash-card">
          <div className="dash-card-header">
            <span className="dash-card-title">Recent Applications</span>
            <Link href="/admin/applications" style={{ fontSize: '0.78rem', color: '#1B4332', fontWeight: 600, textDecoration: 'none' }}>View all →</Link>
          </div>
          {recent.length === 0 ? (
            <div style={{ padding: '2.5rem', textAlign: 'center', color: '#9ca3af', fontSize: '0.875rem' }}>No applications yet.</div>
          ) : (
            <table className="recent-table">
              <thead>
                <tr>
                  <th>Project</th>
                  <th>Client</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recent.map(app => {
                  const s = STATUS_COLORS[app.status] || STATUS_COLORS.pending
                  return (
                    <tr key={app.id} onClick={() => router.push('/admin/applications')} style={{ cursor: 'pointer' }}>
                      <td>
                        <div style={{ fontWeight: 600, color: '#111827' }}>{app.title}</div>
                        <div style={{ fontSize: '0.72rem', color: '#9ca3af' }}>{SERVICE_LABELS[app.service] || app.service}</div>
                      </td>
                      <td>
                        <div style={{ color: '#374151' }}>{app.profiles?.full_name || 'Unknown'}</div>
                        <div style={{ fontSize: '0.72rem', color: '#9ca3af' }}>{app.profiles?.email}</div>
                      </td>
                      <td>
                        <span style={{ background: s.bg, color: s.color, fontSize: '0.68rem', fontWeight: 700, padding: '2px 8px', borderRadius: '100px' }}>{s.label}</span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Status breakdown */}
        <div>
          <div className="dash-card" style={{ marginBottom: '1rem' }}>
            <div className="dash-card-header">
              <span className="dash-card-title">Projects by Status</span>
            </div>
            <div style={{ padding: '0.5rem 0' }}>
              {statusBreak.map(s => {
                const sc = STATUS_COLORS[s.status] || STATUS_COLORS.pending
                return (
                  <div className="status-bar" key={s.status}>
                    <span className="status-bar-label">{sc.label}</span>
                    <div className="status-bar-track">
                      <div className="status-bar-fill" style={{ width: `${(s.count / maxCount) * 100}%`, background: sc.color }} />
                    </div>
                    <span className="status-bar-count">{s.count}</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Quick actions */}
          <div className="dash-card">
            <div className="dash-card-header">
              <span className="dash-card-title">Quick Actions</span>
            </div>
            <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {[
                { label: 'Review pending applications', href: '/admin/applications', icon: '📋' },
                { label: 'Manage services & pricing', href: '/admin/services', icon: '🏷' },
                { label: 'Write a blog post', href: '/admin/blog', icon: '✍' },
                { label: 'View all clients', href: '/admin/users', icon: '👥' },
              ].map(a => (
                <Link key={a.href} href={a.href} style={{
                  display: 'flex', alignItems: 'center', gap: '0.6rem',
                  padding: '0.6rem 0.75rem', borderRadius: 8, textDecoration: 'none',
                  fontSize: '0.82rem', color: '#374151', fontWeight: 500,
                  background: '#f9fafb', border: '1px solid #f3f4f6', transition: 'all 0.15s',
                }}>
                  <span>{a.icon}</span>{a.label}
                  <span style={{ marginLeft: 'auto', color: '#9ca3af' }}>→</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
