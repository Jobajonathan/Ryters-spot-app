'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

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

type AdminUser = {
  id: string
  full_name: string
  email: string
  role: 'admin' | 'superadmin'
  created_at: string
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
  return (
    <span style={{ background: s.bg, color: s.color, fontSize: '0.72rem', fontWeight: 700, padding: '3px 10px', borderRadius: '100px', whiteSpace: 'nowrap' }}>
      {s.label}
    </span>
  )
}

export default function AdminPage() {
  const router = useRouter()

  // Auth & role
  const [myRole, setMyRole] = useState<'admin' | 'superadmin' | null>(null)
  const [myName, setMyName] = useState('')
  const [authChecked, setAuthChecked] = useState(false)

  // Tab
  const [tab, setTab] = useState<'projects' | 'team'>('projects')

  // Projects state
  const [projects, setProjects] = useState<Project[]>([])
  const [projLoading, setProjLoading] = useState(true)
  const [projError, setProjError] = useState('')
  const [filter, setFilter] = useState('all')
  const [selected, setSelected] = useState<Project | null>(null)
  const [newStatus, setNewStatus] = useState('')
  const [adminNotes, setAdminNotes] = useState('')
  const [updating, setUpdating] = useState(false)
  const [updateMsg, setUpdateMsg] = useState('')

  // Team state
  const [admins, setAdmins] = useState<AdminUser[]>([])
  const [teamLoading, setTeamLoading] = useState(false)
  const [teamError, setTeamError] = useState('')
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteName, setInviteName] = useState('')
  const [inviting, setInviting] = useState(false)
  const [inviteMsg, setInviteMsg] = useState('')
  const [inviteMsgType, setInviteMsgType] = useState<'success' | 'error'>('success')
  const [revokingId, setRevokingId] = useState<string | null>(null)

  // 1. Check current admin's role
  useEffect(() => {
    fetch('/api/admin/me')
      .then(r => r.json())
      .then(data => {
        if (data.role && ['admin', 'superadmin'].includes(data.role)) {
          setMyRole(data.role)
          setMyName(data.full_name || data.email)
        }
        setAuthChecked(true)
      })
      .catch(() => setAuthChecked(true))
  }, [])

  // 2. Load projects once authenticated
  useEffect(() => {
    if (!myRole) return
    fetch('/api/admin/projects')
      .then(r => r.json())
      .then(data => {
        if (data.error) { setProjError(data.error); setProjLoading(false); return }
        setProjects(Array.isArray(data) ? data : [])
        setProjLoading(false)
      })
      .catch(() => { setProjError('Failed to load projects.'); setProjLoading(false) })
  }, [myRole])

  // 3. Load team when superadmin opens Team tab
  useEffect(() => {
    if (tab !== 'team' || myRole !== 'superadmin') return
    loadTeam()
  }, [tab, myRole])

  function loadTeam() {
    setTeamLoading(true)
    setTeamError('')
    fetch('/api/admin/users')
      .then(r => r.json())
      .then(data => {
        if (data.error) { setTeamError(data.error); setTeamLoading(false); return }
        setAdmins(Array.isArray(data) ? data : [])
        setTeamLoading(false)
      })
      .catch(() => { setTeamError('Failed to load team.'); setTeamLoading(false) })
  }

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault()
    setInviting(true)
    setInviteMsg('')
    const res = await fetch('/api/admin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: inviteEmail, full_name: inviteName }),
    })
    const data = await res.json()
    if (data.success) {
      setInviteMsg(data.message)
      setInviteMsgType('success')
      setInviteEmail('')
      setInviteName('')
      loadTeam()
    } else {
      setInviteMsg(data.error)
      setInviteMsgType('error')
    }
    setInviting(false)
  }

  async function revokeAdmin(id: string, name: string) {
    if (!confirm(`Remove admin access for ${name}? They will become a regular client.`)) return
    setRevokingId(id)
    const res = await fetch('/api/admin/users', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, role: 'client' }),
    })
    const data = await res.json()
    if (data.success) {
      setAdmins(prev => prev.filter(a => a.id !== id))
    } else {
      alert(data.error)
    }
    setRevokingId(null)
  }

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

  // Loading state
  if (!authChecked) {
    return <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--clr-text-muted)' }}>Checking access...</div>
  }

  // Not admin — redirect to admin login
  if (!myRole) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔒</div>
        <h2 style={{ fontFamily: 'var(--font-serif)', marginBottom: '0.5rem' }}>Admin Access Only</h2>
        <p style={{ color: 'var(--clr-text-muted)', marginBottom: '1.5rem' }}>You do not have permission to view this page.</p>
        <button className="btn btn-primary" onClick={() => router.push('/admin/login')}>Sign in as Admin</button>
      </div>
    )
  }

  return (
    <>
      <style>{`
        .admin-page { max-width: 1100px; }
        .admin-top { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem; }
        .admin-top h1 { font-family: var(--font-serif); font-size: 1.75rem; margin-bottom: 0.2rem; }
        .admin-top p { color: var(--clr-text-muted); font-size: 0.875rem; }
        .admin-role-badge {
          display: inline-flex; align-items: center; gap: 6px;
          font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em;
          background: rgba(27,67,50,0.08); color: var(--clr-primary);
          border: 1px solid rgba(27,67,50,0.2); padding: 4px 12px; border-radius: 100px;
        }
        .admin-role-badge.superadmin { background: rgba(201,168,76,0.12); color: #92400e; border-color: rgba(201,168,76,0.35); }
        .admin-tabs { display: flex; gap: 0; border-bottom: 2px solid var(--clr-border); margin-bottom: 2rem; }
        .admin-tab {
          padding: 0.6rem 1.5rem; font-size: 0.875rem; font-weight: 600; cursor: pointer;
          background: none; border: none; border-bottom: 2px solid transparent; margin-bottom: -2px;
          color: var(--clr-text-muted); transition: all 0.15s;
        }
        .admin-tab:hover { color: var(--clr-text); }
        .admin-tab.active { color: var(--clr-primary); border-bottom-color: var(--clr-primary); }
        .stat-row { display: grid; grid-template-columns: repeat(6,1fr); gap: 0.75rem; margin-bottom: 2rem; }
        .stat-box { background: var(--clr-surface); border: 1px solid var(--clr-border); border-radius: var(--radius-lg); padding: 1rem; text-align: center; cursor: pointer; transition: all 0.2s; }
        .stat-box:hover { border-color: var(--clr-primary-light); }
        .stat-box.active { border-color: var(--clr-primary); background: rgba(27,67,50,0.04); }
        .stat-num { font-family: var(--font-serif); font-size: 1.75rem; font-weight: 700; color: var(--clr-primary); line-height: 1; }
        .stat-lbl { font-size: 0.7rem; color: var(--clr-text-muted); margin-top: 4px; font-weight: 600; }
        .proj-table { width: 100%; border-collapse: collapse; background: var(--clr-surface); border: 1px solid var(--clr-border); border-radius: var(--radius-lg); overflow: hidden; }
        .proj-table th { background: var(--clr-surface-2); font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: var(--clr-text-muted); padding: 0.85rem 1rem; text-align: left; border-bottom: 1px solid var(--clr-border); }
        .proj-table td { padding: 0.9rem 1rem; font-size: 0.875rem; border-bottom: 1px solid var(--clr-border); vertical-align: middle; }
        .proj-table tr:last-child td { border-bottom: none; }
        .proj-table tr:hover td { background: var(--clr-surface-2); cursor: pointer; }
        .proj-title-cell { font-weight: 600; color: var(--clr-text); max-width: 200px; }
        .proj-title-cell small { font-weight: 400; color: var(--clr-text-muted); display: block; font-size: 0.75rem; }
        .panel-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); z-index: 100; display: flex; justify-content: flex-end; }
        .panel { width: 480px; max-width: 95vw; background: var(--clr-bg); height: 100%; overflow-y: auto; padding: 2rem; box-shadow: -4px 0 24px rgba(0,0,0,0.15); }
        .panel-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 1.5rem; }
        .panel-close { background: none; border: none; font-size: 1.25rem; cursor: pointer; color: var(--clr-text-muted); padding: 4px; }
        .panel-section { margin-bottom: 1.5rem; }
        .panel-label { font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: var(--clr-text-muted); margin-bottom: 0.4rem; }
        .panel-value { font-size: 0.9rem; color: var(--clr-text); line-height: 1.6; }
        /* Team tab */
        .team-layout { display: grid; grid-template-columns: 1fr 380px; gap: 2rem; align-items: start; }
        .team-table { width: 100%; border-collapse: collapse; background: var(--clr-surface); border: 1px solid var(--clr-border); border-radius: var(--radius-lg); overflow: hidden; }
        .team-table th { background: var(--clr-surface-2); font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: var(--clr-text-muted); padding: 0.75rem 1rem; text-align: left; border-bottom: 1px solid var(--clr-border); }
        .team-table td { padding: 0.9rem 1rem; font-size: 0.875rem; border-bottom: 1px solid var(--clr-border); vertical-align: middle; }
        .team-table tr:last-child td { border-bottom: none; }
        .invite-card { background: var(--clr-surface); border: 1px solid var(--clr-border); border-radius: var(--radius-lg); padding: 1.5rem; }
        .invite-card h3 { font-family: var(--font-serif); font-size: 1.1rem; margin-bottom: 0.35rem; }
        .invite-card p { font-size: 0.82rem; color: var(--clr-text-muted); margin-bottom: 1.25rem; }
        .revoke-btn { background: none; border: 1px solid #fee2e2; color: #991b1b; font-size: 0.75rem; font-weight: 600; padding: 3px 10px; border-radius: 6px; cursor: pointer; transition: all 0.15s; }
        .revoke-btn:hover { background: #fee2e2; }
        .revoke-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        @media (max-width: 900px) { .stat-row { grid-template-columns: repeat(3,1fr); } .team-layout { grid-template-columns: 1fr; } }
        @media (max-width: 600px) { .stat-row { grid-template-columns: repeat(2,1fr); } }
      `}</style>

      <div className="admin-page">
        {/* Header */}
        <div className="admin-top">
          <div>
            <h1>Admin Dashboard</h1>
            <p>Welcome back, {myName}.</p>
          </div>
          <span className={`admin-role-badge${myRole === 'superadmin' ? ' superadmin' : ''}`}>
            {myRole === 'superadmin' ? '★ Superadmin' : 'Admin'}
          </span>
        </div>

        {/* Tabs */}
        <div className="admin-tabs">
          <button className={`admin-tab${tab === 'projects' ? ' active' : ''}`} onClick={() => setTab('projects')}>
            Projects
          </button>
          {myRole === 'superadmin' && (
            <button className={`admin-tab${tab === 'team' ? ' active' : ''}`} onClick={() => setTab('team')}>
              Team
            </button>
          )}
        </div>

        {/* ── PROJECTS TAB ── */}
        {tab === 'projects' && (
          <>
            {/* Stats row */}
            <div className="stat-row">
              <div className={`stat-box${filter === 'all' ? ' active' : ''}`} onClick={() => setFilter('all')}>
                <div className="stat-num">{projects.length}</div>
                <div className="stat-lbl">All</div>
              </div>
              {STATUSES.map(s => (
                <div key={s.value} className={`stat-box${filter === s.value ? ' active' : ''}`} onClick={() => setFilter(s.value)}>
                  <div className="stat-num" style={{ color: s.color }}>{counts[s.value] || 0}</div>
                  <div className="stat-lbl">{s.label}</div>
                </div>
              ))}
            </div>

            {projLoading ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--clr-text-muted)' }}>Loading projects...</div>
            ) : projError ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: '#c53030' }}>{projError}</div>
            ) : filtered.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', background: 'var(--clr-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--clr-border)', color: 'var(--clr-text-muted)' }}>
                No projects in this category.
              </div>
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
                        <div style={{ fontSize: '0.75rem', color: 'var(--clr-text-muted)' }}>{p.profiles?.email}</div>
                      </td>
                      <td><span style={{ fontSize: '0.75rem', background: 'rgba(27,67,50,0.08)', color: 'var(--clr-primary)', padding: '2px 8px', borderRadius: '100px', fontWeight: 600 }}>{SERVICE_LABELS[p.service] || p.service}</span></td>
                      <td style={{ textTransform: 'capitalize', fontSize: '0.82rem' }}>{p.urgency}</td>
                      <td style={{ fontSize: '0.82rem', color: 'var(--clr-text-muted)' }}>{p.deadline ? new Date(p.deadline).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Flexible'}</td>
                      <td><StatusBadge status={p.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </>
        )}

        {/* ── TEAM TAB (superadmin only) ── */}
        {tab === 'team' && myRole === 'superadmin' && (
          <div className="team-layout">
            {/* Admins table */}
            <div>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', marginBottom: '1rem' }}>Admin Team</h2>
              {teamLoading ? (
                <div style={{ color: 'var(--clr-text-muted)', padding: '2rem 0' }}>Loading team...</div>
              ) : teamError ? (
                <div style={{ color: '#c53030' }}>{teamError}</div>
              ) : admins.length === 0 ? (
                <div style={{ color: 'var(--clr-text-muted)', padding: '2rem', background: 'var(--clr-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--clr-border)', textAlign: 'center' }}>No admin users yet.</div>
              ) : (
                <table className="team-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Joined</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {admins.map(a => (
                      <tr key={a.id}>
                        <td style={{ fontWeight: 600 }}>{a.full_name || '—'}</td>
                        <td style={{ fontSize: '0.82rem', color: 'var(--clr-text-muted)' }}>{a.email}</td>
                        <td>
                          <span style={{
                            fontSize: '0.7rem', fontWeight: 700, padding: '2px 9px', borderRadius: '100px',
                            background: a.role === 'superadmin' ? 'rgba(201,168,76,0.15)' : 'rgba(27,67,50,0.08)',
                            color: a.role === 'superadmin' ? '#92400e' : 'var(--clr-primary)',
                          }}>
                            {a.role === 'superadmin' ? '★ Superadmin' : 'Admin'}
                          </span>
                        </td>
                        <td style={{ fontSize: '0.78rem', color: 'var(--clr-text-muted)' }}>
                          {new Date(a.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </td>
                        <td>
                          {a.role !== 'superadmin' && (
                            <button
                              className="revoke-btn"
                              onClick={() => revokeAdmin(a.id, a.full_name || a.email)}
                              disabled={revokingId === a.id}
                            >
                              {revokingId === a.id ? 'Removing...' : 'Revoke'}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Invite form */}
            <div className="invite-card">
              <h3>Add Admin User</h3>
              <p>Invite a team member to the admin dashboard. They will receive an email to set their password.</p>

              {inviteMsg && (
                <div style={{
                  fontSize: '0.82rem',
                  padding: '10px 14px', borderRadius: '8px', marginBottom: '1rem',
                  background: inviteMsgType === 'success' ? '#f0fff4' : '#fff5f5',
                  border: `1px solid ${inviteMsgType === 'success' ? '#9ae6b4' : '#feb2b2'}`,
                  color: inviteMsgType === 'success' ? '#276749' : '#c53030',
                }}>
                  {inviteMsg}
                </div>
              )}

              <form onSubmit={handleInvite}>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    className="form-control"
                    type="text"
                    placeholder="e.g. Sarah Okafor"
                    value={inviteName}
                    onChange={e => setInviteName(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    className="form-control"
                    type="email"
                    placeholder="e.g. sarah@theryters.com"
                    value={inviteEmail}
                    onChange={e => setInviteEmail(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={inviting}>
                  {inviting ? 'Sending invite...' : 'Send Admin Invite'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Slide-over project panel */}
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
                <div style={{
                  fontSize: '0.82rem',
                  color: updateMsg.startsWith('Error') ? '#c53030' : '#276749',
                  marginBottom: '0.75rem',
                  background: updateMsg.startsWith('Error') ? '#fff5f5' : '#f0fff4',
                  padding: '8px 12px', borderRadius: '6px',
                  border: `1px solid ${updateMsg.startsWith('Error') ? '#feb2b2' : '#9ae6b4'}`,
                }}>
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
