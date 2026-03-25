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
  research_academic: 'Research & Academic',
  digital_transformation: 'Digital Transformation',
  edtech: 'Ed-Tech',
  product_management: 'Product Management',
}

const STATUSES = [
  { value: 'pending',     label: 'Pending Review', bg: '#fef3c7', color: '#92400e' },
  { value: 'in_review',   label: 'In Review',      bg: '#dbeafe', color: '#1e40af' },
  { value: 'in_progress', label: 'In Progress',    bg: '#d1fae5', color: '#065f46' },
  { value: 'completed',   label: 'Completed',      bg: '#f0fdf4', color: '#166534' },
  { value: 'cancelled',   label: 'Cancelled',      bg: '#fee2e2', color: '#991b1b' },
]

function StatusBadge({ status }: { status: string }) {
  const s = STATUSES.find(x => x.value === status) || STATUSES[0]
  return <span style={{ background: s.bg, color: s.color, fontSize: '0.7rem', fontWeight: 700, padding: '3px 10px', borderRadius: '100px', whiteSpace: 'nowrap' }}>{s.label}</span>
}

export default function ApplicationsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Project | null>(null)
  const [newStatus, setNewStatus] = useState('')
  const [adminNotes, setAdminNotes] = useState('')
  const [updating, setUpdating] = useState(false)
  const [updateMsg, setUpdateMsg] = useState('')

  useEffect(() => {
    fetch('/api/admin/projects')
      .then(r => r.json())
      .then(data => { setProjects(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  function openProject(p: Project) {
    setSelected(p); setNewStatus(p.status)
    setAdminNotes(p.admin_notes || ''); setUpdateMsg('')
  }

  async function updateStatus() {
    if (!selected) return
    setUpdating(true); setUpdateMsg('')
    const res = await fetch('/api/admin/projects', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: selected.id, status: newStatus, admin_notes: adminNotes }),
    })
    const data = await res.json()
    if (data.success) {
      setProjects(prev => prev.map(p => p.id === selected.id ? { ...p, status: newStatus, admin_notes: adminNotes } : p))
      setSelected(prev => prev ? { ...prev, status: newStatus, admin_notes: adminNotes } : null)
      setUpdateMsg('Updated. Client notified by email.')
    } else {
      setUpdateMsg('Error: ' + data.error)
    }
    setUpdating(false)
  }

  const counts = STATUSES.reduce((acc, s) => ({ ...acc, [s.value]: projects.filter(p => p.status === s.value).length }), {} as Record<string, number>)
  const filtered = projects
    .filter(p => filter === 'all' || p.status === filter)
    .filter(p => !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.profiles?.full_name.toLowerCase().includes(search.toLowerCase()) || p.profiles?.email.toLowerCase().includes(search.toLowerCase()))

  return (
    <>
      <style>{`
        .apps-filters { display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1.5rem; }
        .filter-chip { padding: 0.35rem 0.85rem; border-radius: 100px; font-size: 0.78rem; font-weight: 600; cursor: pointer; border: 1px solid #e5e7eb; background: #fff; color: #6b7280; transition: all 0.15s; }
        .filter-chip:hover { border-color: #1B4332; color: #1B4332; }
        .filter-chip.active { background: #1B4332; color: #fff; border-color: #1B4332; }
        .apps-table { width: 100%; border-collapse: collapse; background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; }
        .apps-table th { background: #f9fafb; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.07em; color: #9ca3af; padding: 0.85rem 1rem; text-align: left; border-bottom: 1px solid #e5e7eb; }
        .apps-table td { padding: 0.9rem 1rem; font-size: 0.82rem; border-bottom: 1px solid #f9fafb; vertical-align: middle; }
        .apps-table tr:last-child td { border-bottom: none; }
        .apps-table tr:hover td { background: #f9fafb; cursor: pointer; }
        .panel-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.35); z-index: 200; display: flex; justify-content: flex-end; }
        .panel { width: 500px; max-width: 95vw; background: #fff; height: 100%; overflow-y: auto; padding: 2rem; box-shadow: -8px 0 32px rgba(0,0,0,0.1); }
        .panel-label { font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.07em; color: #9ca3af; margin-bottom: 0.3rem; }
        .panel-value { font-size: 0.875rem; color: #374151; line-height: 1.6; }
      `}</style>

      <div style={{ marginBottom: '1.75rem', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '1.5rem', fontWeight: 700, color: '#111827', margin: '0 0 0.25rem' }}>Applications</h1>
          <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0 }}>Review and manage all client service requests.</p>
        </div>
        <input
          type="text"
          placeholder="Search by title or client..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ padding: '0.5rem 0.85rem', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: '0.82rem', background: '#fff', width: 240, outline: 'none' }}
        />
      </div>

      {/* Status filters */}
      <div className="apps-filters">
        <button className={`filter-chip${filter === 'all' ? ' active' : ''}`} onClick={() => setFilter('all')}>
          All ({projects.length})
        </button>
        {STATUSES.map(s => (
          <button key={s.value} className={`filter-chip${filter === s.value ? ' active' : ''}`} onClick={() => setFilter(s.value)}>
            {s.label} ({counts[s.value] || 0})
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af' }}>Loading applications...</div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb', color: '#9ca3af' }}>
          {search ? `No results for "${search}"` : 'No applications in this category.'}
        </div>
      ) : (
        <table className="apps-table">
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
                  <div style={{ fontWeight: 600, color: '#111827' }}>{p.title}</div>
                  <div style={{ fontSize: '0.72rem', color: '#9ca3af' }}>{new Date(p.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                </td>
                <td>
                  <div style={{ fontWeight: 600 }}>{p.profiles?.full_name || 'Unknown'}</div>
                  <div style={{ fontSize: '0.72rem', color: '#9ca3af' }}>{p.profiles?.email}</div>
                </td>
                <td>
                  <span style={{ fontSize: '0.72rem', background: 'rgba(27,67,50,0.08)', color: '#1B4332', padding: '2px 8px', borderRadius: '100px', fontWeight: 600 }}>
                    {SERVICE_LABELS[p.service] || p.service}
                  </span>
                </td>
                <td style={{ textTransform: 'capitalize', color: p.urgency === 'urgent' ? '#dc2626' : '#374151' }}>{p.urgency}</td>
                <td style={{ color: '#6b7280' }}>{p.deadline ? new Date(p.deadline).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Flexible'}</td>
                <td><StatusBadge status={p.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Detail panel */}
      {selected && (
        <div className="panel-overlay" onClick={e => e.target === e.currentTarget && setSelected(null)}>
          <div className="panel">
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <div>
                <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.15rem', margin: '0 0 6px' }}>{selected.title}</h3>
                <StatusBadge status={selected.status} />
              </div>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer', color: '#9ca3af', padding: 4 }}>✕</button>
            </div>

            {[
              { label: 'Client', value: <><strong>{selected.profiles?.full_name}</strong><br /><a href={`mailto:${selected.profiles?.email}`} style={{ color: '#1B4332' }}>{selected.profiles?.email}</a>{selected.profiles?.company && <><br /><span style={{ fontSize: '0.82rem', color: '#9ca3af' }}>{selected.profiles.company}</span></>}</> },
              { label: 'Service', value: SERVICE_LABELS[selected.service] || selected.service },
              { label: 'Description', value: selected.description },
            ].map(item => (
              <div key={item.label} style={{ marginBottom: '1.25rem' }}>
                <div className="panel-label">{item.label}</div>
                <div className="panel-value" style={{ whiteSpace: 'pre-wrap' }}>{item.value}</div>
              </div>
            ))}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <div><div className="panel-label">Deadline</div><div className="panel-value">{selected.deadline ? new Date(selected.deadline).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Flexible'}</div></div>
              <div><div className="panel-label">Urgency</div><div className="panel-value" style={{ textTransform: 'capitalize' }}>{selected.urgency}</div></div>
              <div><div className="panel-label">Budget</div><div className="panel-value">{selected.budget_range || 'Not specified'}</div></div>
              <div><div className="panel-label">Submitted</div><div className="panel-value">{new Date(selected.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</div></div>
            </div>

            <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: '1.5rem' }}>
              <div className="panel-label" style={{ marginBottom: '0.6rem' }}>Update Status</div>
              <select value={newStatus} onChange={e => setNewStatus(e.target.value)}
                style={{ width: '100%', padding: '0.6rem 0.75rem', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: '0.875rem', marginBottom: '0.75rem', outline: 'none', background: '#fff' }}>
                {STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
              <div className="panel-label" style={{ marginBottom: '0.4rem' }}>Note to client</div>
              <textarea value={adminNotes} onChange={e => setAdminNotes(e.target.value)}
                placeholder="Optional message included in client's notification email..."
                style={{ width: '100%', padding: '0.6rem 0.75rem', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: '0.875rem', minHeight: 80, resize: 'vertical', marginBottom: '0.75rem', outline: 'none' }} />
              {updateMsg && (
                <div style={{ fontSize: '0.82rem', padding: '8px 12px', borderRadius: 8, marginBottom: '0.75rem', background: updateMsg.startsWith('Error') ? '#fff5f5' : '#f0fff4', color: updateMsg.startsWith('Error') ? '#c53030' : '#276749', border: `1px solid ${updateMsg.startsWith('Error') ? '#feb2b2' : '#9ae6b4'}` }}>
                  {updateMsg}
                </div>
              )}
              <button onClick={updateStatus} disabled={updating}
                style={{ width: '100%', padding: '0.75rem', background: '#1B4332', color: '#fff', border: 'none', borderRadius: 8, fontSize: '0.875rem', fontWeight: 700, cursor: updating ? 'not-allowed' : 'pointer', opacity: updating ? 0.7 : 1 }}>
                {updating ? 'Updating...' : 'Update Status & Notify Client'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
