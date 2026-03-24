'use client'

import { useEffect, useState } from 'react'

type Project = {
  id: string
  title: string
  service: string
  status: string
  urgency: string
  deadline: string | null
  budget_range: string | null
  description: string
  admin_notes: string | null
  created_at: string
  profiles: { full_name: string; email: string; country: string; company: string } | null
}

const SERVICE_LABELS: Record<string, string> = {
  research_academic: 'Research',
  digital_transformation: 'Digital',
  edtech: 'Ed-Tech',
  product_management: 'Product Mgmt',
}

const STATUSES = [
  { value: 'pending', label: 'Pending Review', bg: '#fef3c7', color: '#92400e' },
  { value: 'in_review', label: 'In Review', bg: '#dbeafe', color: '#1e40af' },
  { value: 'in_progress', label: 'In Progress', bg: '#d1fae5', color: '#065f46' },
  { value: 'completed', label: 'Completed', bg: '#f0fdf4', color: '#166534' },
  { value: 'cancelled', label: 'Cancelled', bg: '#fee2e2', color: '#991b1b' },
]

function StatusBadge({ status }: { status: string }) {
  const s = STATUSES.find(x => x.value === status) || STATUSES[0]
  return <span style={{ background: s.bg, color: s.color, fontSize: '0.72rem', fontWeight: 700, padding: '3px 10px', borderRadius: '100px', whiteSpace: 'nowrap' }}>{s.label}</span>
}

export default function AdminPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('all')
  const [selected, setSelected] = useState<Project | null>(null)
  const [newStatus, setNewStatus] = useState('')
  const [adminNotes, setAdminNotes] = useState('')
  const [updating, setUpdating] = useState(false)
  const [updateMsg, setUpdateMsg] = useState('')

  useEffect(() => {
    fetch('/api/admin/projects')
      .then(r => r.json())
      .then(data => {
        if (data.error) { setError(data.error); return }
        setProjects(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(() => { setError('Failed to load projects.'); setLoading(false) })
  }, [])

  function openProject(p: Project) {
    setSelected(p)
    setNewStatus(p.status)
    setAdminNotes(p.admin_notes || '')
    setUpdateMsg('')
  }

  async function updateStatus() {
    if (!selected) return
    setUpdating(true)
    setUpdateMsg('')
    const res = await fetch('/api/admin/projects', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: selected.id, status: newStatus, admin_notes: adminNotes }),
    })
    const data = await res.json()
    if (data.success) {
      setProjects(prev => prev.map(p => p.id === selected.id ? { ...p, status: newStatus, admin_notes: adminNotes } : p))
      setSelected(prev => prev ? { ...prev, status: newStatus, admin_notes: adminNotes } : null)
      setUpdateMsg('Updated and client notified by email.')
    } else {
      setUpdateMsg('Error: ' + data.error)
    }
    setUpdating(false)
  }

  const filtered = filter === 'all' ? projects : projects.filter(p => p.status === filter)
  const counts = STATUSES.reduce((acc, s) => ({ ...acc, [s.value]: projects.filter(p => p.status === s.value).length }), {} as Record<string, number>)

  if (error === 'Unauthorised') return (
    <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔒</div>
      <h2 style={{ fontFamily: 'var(--font-serif)' }}>Admin Access Only</h2>
      <p style={{ color: 'var(--clr-text-muted)' }}>You do not have permission to view this page.</p>
    </div>
  )

  return (
    <>
      <style>{`
        .admin-page { max-width: 1100px; }
        .admin-header { margin-bottom: 2rem; }
        .admin-header h1 { font-family: var(--font-serif); font-size: 1.75rem; margin-bottom: 0.25rem; }
        .admin-header p { color: var(--clr-text-muted); font-size: 0.9rem; }
        .stat-row { display: grid; grid-template-columns: repeat(5,1fr); gap: 1rem; margin-bottom: 2rem; }
        .stat-box { background: var(--clr-surface); border: 1px solid var(--clr-border); border-radius: var(--radius-lg); padding: 1.25rem; text-align: center; cursor: pointer; transition: all 0.2s; }
        .stat-box:hover { border-color: var(--clr-primary-light); }
        .stat-box.active { border-color: var(--clr-primary); background: rgba(27,67,50,0.04); }
        .stat-num { font-family: var(--font-serif); font-size: 2rem; font-weight: 700; color: var(--clr-primary); line-height: 1; }
        .stat-lbl { font-size: 0.75rem; color: var(--clr-text-muted); margin-top: 4px; font-weight: 600; }
        .proj-table { width: 100%; border-collapse: collapse; background: var(--clr-surface); border: 1px solid var(--clr-border); border-radius: var(--radius-lg); overflow: hidden; }
        .proj-table th { background: var(--clr-surface-2); font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: var(--clr-text-muted); padding: 0.85rem 1rem; text-align: left; border-bottom: 1px solid var(--clr-border); }
        .proj-table td { padding: 1rem; font-size: 0.875rem; border-bottom: 1px solid var(--clr-border); vertical-align: middle; }
        .proj-table tr:last-child td { border-bottom: none; }
        .proj-table tr:hover td { background: var(--clr-surface-2); cursor: pointer; }
        .proj-title-cell { font-weight: 600; color: var(--clr-text); max-width: 200px; }
        .proj-title-cell small { font-weight: 400; color: var(--clr-text-muted); display: block; font-size: 0.78rem; }
        .panel-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); z-index: 100; display: flex; justify-content: flex-end; }
        .panel { width: 480px; max-width: 95vw; background: var(--clr-bg); height: 100%; overflow-y: auto; padding: 2rem; box-shadow: -4px 0 24px rgba(0,0,0,0.15); }
        .panel-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 1.5rem; }
        .panel-close { background: none; border: none; font-size: 1.25rem; cursor: pointer; color: var(--clr-text-muted); padding: 4px; }
        .panel-section { margin-bottom: 1.5rem; }
        .panel-label { font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: var(--clr-text-muted); margin-bottom: 0.4rem; }
        .panel-value { font-size: 0.9rem; color: var(--clr-text); line-height: 1.6; }
        @media (max-width: 900px) { .stat-row { grid-template-columns: repeat(3,1fr); } }
        @media (max-width: 600px) { .stat-row { grid-template-columns: repeat(2,1fr); } }
      `}</style>

      <div className="admin-page">
        <div className="admin-header">
          <h1>Admin Dashboard</h1>
          <p>Manage all client projects, update statuses and notify clients automatically.</p>
        </div>

        {/* Stats */}
        <div className="stat-row">
          <div className={`stat-box${filter === 'all' ? ' active' : ''}`} onClick={() => setFilter('all')}>
            <div className="stat-num">{projects.length}</div>
            <div className="stat-lbl">All Projects</div>
          </div>
          {STATUSES.map(s => (
            <div key={s.value} className={`stat-box${filter === s.value ? ' active' : ''}`} onClick={() => setFilter(s.value)}>
              <div className="stat-num" style={{ color: s.color }}>{counts[s.value] || 0}</div>
              <div className="stat-lbl">{s.label}</div>
            </div>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--clr-text-muted)' }}>Loading projects...</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', background: 'var(--clr-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--clr-border)', color: 'var(--clr-text-muted)' }}>No projects in this category.</div>
        ) : (
          <table className="proj-table">
            <thead>
              <tr>
                <th>Project</th>
                <th>Client</th>
                <th>Service</th>
                <th>Urgency</th>
                <th>Deadline</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id} onClick={() => openProject(p)}>
                  <td>
                    <div className="proj-title-cell">
                      {p.title}
                      <small>{new Date(p.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</small>
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{p.profiles?.full_name || 'Unknown'}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--clr-text-muted)' }}>{p.profiles?.email}</div>
                  </td>
                  <td><span style={{ fontSize: '0.78rem', background: 'rgba(27,67,50,0.08)', color: 'var(--clr-primary)', padding: '2px 8px', borderRadius: '100px', fontWeight: 600 }}>{SERVICE_LABELS[p.service] || p.service}</span></td>
                  <td style={{ textTransform: 'capitalize', fontSize: '0.82rem' }}>{p.urgency}</td>
                  <td style={{ fontSize: '0.82rem', color: 'var(--clr-text-muted)' }}>{p.deadline ? new Date(p.deadline).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Flexible'}</td>
                  <td><StatusBadge status={p.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Slide-over panel */}
      {selected && (
        <div className="panel-overlay" onClick={e => e.target === e.currentTarget && setSelected(null)}>
          <div className="panel">
            <div className="panel-header">
              <div>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', margin: '0 0 4px' }}>{selected.title}</h3>
                <StatusBadge status={selected.status} />
              </div>
              <button className="panel-close" onClick={() => setSelected(null)}>✕</button>
            </div>

            <div className="panel-section">
              <div className="panel-label">Client</div>
              <div className="panel-value">
                <strong>{selected.profiles?.full_name || 'Unknown'}</strong><br />
                <a href={`mailto:${selected.profiles?.email}`} style={{ color: 'var(--clr-primary-light)', fontSize: '0.875rem' }}>{selected.profiles?.email}</a>
                {selected.profiles?.company && <><br /><span style={{ fontSize: '0.82rem', color: 'var(--clr-text-muted)' }}>{selected.profiles.company}</span></>}
                {selected.profiles?.country && <><br /><span style={{ fontSize: '0.82rem', color: 'var(--clr-text-muted)' }}>{selected.profiles.country}</span></>}
              </div>
            </div>

            <div className="panel-section">
              <div className="panel-label">Service</div>
              <div className="panel-value">{SERVICE_LABELS[selected.service] || selected.service}</div>
            </div>

            <div className="panel-section">
              <div className="panel-label">Project Description</div>
              <div className="panel-value" style={{ whiteSpace: 'pre-wrap' }}>{selected.description}</div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <div><div className="panel-label">Deadline</div><div className="panel-value">{selected.deadline ? new Date(selected.deadline).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Flexible'}</div></div>
              <div><div className="panel-label">Urgency</div><div className="panel-value" style={{ textTransform: 'capitalize' }}>{selected.urgency}</div></div>
              <div><div className="panel-label">Budget</div><div className="panel-value">{selected.budget_range || 'Not specified'}</div></div>
              <div><div className="panel-label">Submitted</div><div className="panel-value">{new Date(selected.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</div></div>
            </div>

            <div style={{ borderTop: '1px solid var(--clr-border)', paddingTop: '1.5rem' }}>
              <div className="panel-label" style={{ marginBottom: '0.75rem' }}>Update Status</div>
              <select className="form-control" value={newStatus} onChange={e => setNewStatus(e.target.value)} style={{ marginBottom: '0.75rem' }}>
                {STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>

              <div className="panel-label" style={{ marginBottom: '0.4rem' }}>Note to client (optional)</div>
              <textarea
                className="form-control"
                placeholder="Add a note that will appear in the client's email notification..."
                value={adminNotes}
                onChange={e => setAdminNotes(e.target.value)}
                style={{ minHeight: '90px', marginBottom: '0.75rem' }}
              />

              {updateMsg && (
                <div style={{ fontSize: '0.82rem', color: updateMsg.startsWith('Error') ? '#c53030' : '#276749', marginBottom: '0.75rem', background: updateMsg.startsWith('Error') ? '#fff5f5' : '#f0fff4', padding: '8px 12px', borderRadius: '6px', border: `1px solid ${updateMsg.startsWith('Error') ? '#feb2b2' : '#9ae6b4'}` }}>
                  {updateMsg}
                </div>
              )}

              <button className="btn btn-primary" onClick={updateStatus} disabled={updating} style={{ width: '100%', justifyContent: 'center' }}>
                {updating ? 'Updating...' : 'Update Status and Notify Client'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
