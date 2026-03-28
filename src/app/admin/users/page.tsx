'use client'

import { useEffect, useState } from 'react'

type Client = {
  id: string
  full_name: string
  email: string
  company: string | null
  country: string | null
  role: string
  created_at: string
}

type AdminUser = {
  id: string
  full_name: string
  email: string
  role: 'admin' | 'superadmin'
  privileges: string[]
  suspended_at: string | null
  created_at: string
}

type AuditEntry = {
  id: string
  admin_name: string
  action: string
  target_name: string | null
  details: Record<string, unknown>
  created_at: string
}

const PRIVILEGES = ['Finance', 'Support', 'Operations']

const ACTION_LABELS: Record<string, { label: string; color: string }> = {
  invite_admin:       { label: 'Invited admin',       color: '#1B4332' },
  suspend_admin:      { label: 'Suspended admin',     color: '#dc2626' },
  reinstate_admin:    { label: 'Reinstated admin',    color: '#2563eb' },
  revoke_admin:       { label: 'Revoked admin access', color: '#92400e' },
  update_privileges:  { label: 'Updated privileges',  color: '#5b21b6' },
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

function fmtDateTime(iso: string) {
  return new Date(iso).toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function PrivilegeBadge({ p }: { p: string }) {
  const colors: Record<string, { bg: string; color: string }> = {
    Finance:    { bg: '#fef9c3', color: '#854d0e' },
    Support:    { bg: '#dbeafe', color: '#1e40af' },
    Operations: { bg: '#d1fae5', color: '#065f46' },
  }
  const c = colors[p] || { bg: '#f3f4f6', color: '#374151' }
  return <span style={{ background: c.bg, color: c.color, fontSize: '0.65rem', fontWeight: 700, padding: '2px 8px', borderRadius: '100px' }}>{p}</span>
}

export default function UsersPage() {
  const [tab, setTab] = useState<'clients' | 'admins' | 'audit'>('clients')
  const [clients, setClients] = useState<Client[]>([])
  const [admins, setAdmins] = useState<AdminUser[]>([])
  const [audit, setAudit] = useState<AuditEntry[]>([])
  const [clientsLoading, setClientsLoading] = useState(true)
  const [adminsLoading, setAdminsLoading] = useState(false)
  const [auditLoading, setAuditLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [isSuperAdmin, setIsSuperAdmin] = useState(false)

  // Invite form
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteName, setInviteName] = useState('')
  const [invitePrivileges, setInvitePrivileges] = useState<string[]>([])
  const [inviting, setInviting] = useState(false)
  const [inviteMsg, setInviteMsg] = useState('')
  const [inviteOk, setInviteOk] = useState(true)

  // Action state
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [actionMsg, setActionMsg] = useState('')
  const [actionOk, setActionOk] = useState(true)

  // Privilege edit modal
  const [editingPrivileges, setEditingPrivileges] = useState<AdminUser | null>(null)
  const [editPrivs, setEditPrivs] = useState<string[]>([])
  const [savingPrivs, setSavingPrivs] = useState(false)

  useEffect(() => {
    fetch('/api/admin/me').then(r => r.json()).then(d => setIsSuperAdmin(d.role === 'superadmin'))
    fetch('/api/admin/users/clients')
      .then(r => r.json())
      .then(data => { setClients(Array.isArray(data) ? data : []); setClientsLoading(false) })
      .catch(() => setClientsLoading(false))
  }, [])

  useEffect(() => {
    if (tab === 'admins' && admins.length === 0) {
      setAdminsLoading(true)
      fetch('/api/admin/users')
        .then(r => r.json())
        .then(data => { setAdmins(Array.isArray(data) ? data : []); setAdminsLoading(false) })
        .catch(() => setAdminsLoading(false))
    }
    if (tab === 'audit' && audit.length === 0) {
      setAuditLoading(true)
      fetch('/api/admin/audit')
        .then(r => r.json())
        .then(data => { setAudit(Array.isArray(data) ? data : []); setAuditLoading(false) })
        .catch(() => setAuditLoading(false))
    }
  }, [tab])

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault()
    setInviting(true); setInviteMsg('')
    const res = await fetch('/api/admin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: inviteEmail, full_name: inviteName, privileges: invitePrivileges }),
    })
    const data = await res.json()
    setInviteMsg(data.message || data.error); setInviteOk(!!data.success)
    if (data.success) {
      setInviteEmail(''); setInviteName(''); setInvitePrivileges([])
      // Refresh admins list
      fetch('/api/admin/users').then(r => r.json()).then(d => setAdmins(Array.isArray(d) ? d : []))
    }
    setInviting(false)
  }

  async function doAction(id: string, action: string, name: string) {
    const confirmMsg = action === 'revoke'
      ? `Remove admin access for ${name}? Their account and work history will be preserved.`
      : action === 'suspend'
        ? `Suspend ${name}? They will lose access until reinstated.`
        : `Reinstate ${name}?`
    if (!confirm(confirmMsg)) return
    setActionLoading(id); setActionMsg('')
    const res = await fetch('/api/admin/users', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, action }),
    })
    const data = await res.json()
    setActionOk(!!data.success)
    setActionMsg(data.message || data.error)
    if (data.success) {
      // Refresh admins
      fetch('/api/admin/users').then(r => r.json()).then(d => setAdmins(Array.isArray(d) ? d : []))
    }
    setActionLoading(null)
  }

  async function savePrivileges() {
    if (!editingPrivileges) return
    setSavingPrivs(true)
    const res = await fetch('/api/admin/users', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: editingPrivileges.id, action: 'update_privileges', privileges: editPrivs }),
    })
    const data = await res.json()
    if (data.success) {
      setAdmins(prev => prev.map(a => a.id === editingPrivileges.id ? { ...a, privileges: editPrivs } : a))
      setEditingPrivileges(null)
    }
    setSavingPrivs(false)
  }

  const filteredClients = clients.filter(c =>
    !search || c.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase()) ||
    c.company?.toLowerCase().includes(search.toLowerCase())
  )

  const inputStyle: React.CSSProperties = { padding: '0.6rem 0.75rem', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: '0.875rem', outline: 'none', background: '#fff' }

  return (
    <>
      <style>{`
        .users-tabs { display: flex; gap: 0; border-bottom: 2px solid #e5e7eb; margin-bottom: 2rem; }
        .users-tab { padding: 0.6rem 1.25rem; font-size: 0.875rem; font-weight: 600; cursor: pointer; background: none; border: none; border-bottom: 2px solid transparent; margin-bottom: -2px; color: #9ca3af; transition: all 0.15s; }
        .users-tab:hover { color: #374151; }
        .users-tab.active { color: #1B4332; border-bottom-color: #1B4332; }
        .users-table { width: 100%; border-collapse: collapse; background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; }
        .users-table th { background: #f9fafb; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.07em; color: #9ca3af; padding: 0.85rem 1rem; text-align: left; border-bottom: 1px solid #e5e7eb; }
        .users-table td { padding: 0.85rem 1rem; font-size: 0.82rem; border-bottom: 1px solid #f9fafb; vertical-align: middle; }
        .users-table tr:last-child td { border-bottom: none; }
        .invite-card { background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 1.5rem; margin-top: 1.5rem; }
        .priv-toggle { display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.35rem 0.75rem; border-radius: 100px; font-size: 0.78rem; font-weight: 600; cursor: pointer; border: 1.5px solid #e5e7eb; background: #fff; color: #6b7280; transition: all 0.15s; user-select: none; }
        .priv-toggle.on { border-color: #1B4332; background: #f0fdf4; color: #1B4332; }
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); z-index: 300; display: flex; align-items: center; justify-content: center; }
        .modal { background: #fff; border-radius: 14px; padding: 2rem; width: 360px; max-width: 95vw; box-shadow: 0 20px 60px rgba(0,0,0,0.15); }
        .action-btn { padding: 3px 10px; font-size: 0.72rem; font-weight: 700; border-radius: 6px; cursor: pointer; border: 1px solid; transition: opacity 0.15s; }
      `}</style>

      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '1.5rem', fontWeight: 700, color: '#111827', margin: '0 0 0.25rem' }}>Users & CRM</h1>
        <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0 }}>Manage clients and the admin team.</p>
      </div>

      {actionMsg && (
        <div style={{ padding: '10px 14px', borderRadius: 8, marginBottom: '1rem', background: actionOk ? '#f0fff4' : '#fff5f5', border: `1px solid ${actionOk ? '#9ae6b4' : '#feb2b2'}`, color: actionOk ? '#276749' : '#c53030', fontSize: '0.82rem' }}>
          {actionMsg}
        </div>
      )}

      <div className="users-tabs">
        <button className={`users-tab${tab === 'clients' ? ' active' : ''}`} onClick={() => setTab('clients')}>
          Clients ({clients.length})
        </button>
        {isSuperAdmin && (
          <>
            <button className={`users-tab${tab === 'admins' ? ' active' : ''}`} onClick={() => setTab('admins')}>
              Admin Team ({admins.length})
            </button>
            <button className={`users-tab${tab === 'audit' ? ' active' : ''}`} onClick={() => setTab('audit')}>
              Audit Log
            </button>
          </>
        )}
      </div>

      {/* CLIENTS TAB */}
      {tab === 'clients' && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>{clients.length} registered clients</div>
            <input type="text" placeholder="Search clients..." value={search} onChange={e => setSearch(e.target.value)}
              style={{ ...inputStyle, width: 220 }} />
          </div>
          {clientsLoading ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af' }}>Loading clients...</div>
          ) : (
            <table className="users-table">
              <thead>
                <tr><th>Name</th><th>Email</th><th>Company</th><th>Country</th><th>Joined</th></tr>
              </thead>
              <tbody>
                {filteredClients.length === 0 ? (
                  <tr><td colSpan={5} style={{ textAlign: 'center', color: '#9ca3af', padding: '2.5rem' }}>{search ? 'No matching clients.' : 'No clients yet.'}</td></tr>
                ) : filteredClients.map(c => (
                  <tr key={c.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <div style={{ width: 30, height: 30, borderRadius: '50%', background: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, color: '#6b7280', flexShrink: 0 }}>
                          {(c.full_name || c.email || '?').charAt(0).toUpperCase()}
                        </div>
                        <span style={{ fontWeight: 600 }}>{c.full_name || '—'}</span>
                      </div>
                    </td>
                    <td style={{ color: '#6b7280' }}>{c.email}</td>
                    <td style={{ color: '#6b7280' }}>{c.company || '—'}</td>
                    <td style={{ color: '#6b7280' }}>{c.country || '—'}</td>
                    <td style={{ color: '#9ca3af', fontSize: '0.75rem' }}>{fmtDate(c.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}

      {/* ADMINS TAB */}
      {tab === 'admins' && isSuperAdmin && (
        <>
          {adminsLoading ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af' }}>Loading team...</div>
          ) : (
            <table className="users-table">
              <thead>
                <tr><th>Name</th><th>Email</th><th>Role & Privileges</th><th>Status</th><th>Joined</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {admins.length === 0 ? (
                  <tr><td colSpan={6} style={{ textAlign: 'center', color: '#9ca3af', padding: '2.5rem' }}>No admin users.</td></tr>
                ) : admins.map(a => (
                  <tr key={a.id} style={{ opacity: a.suspended_at ? 0.6 : 1 }}>
                    <td style={{ fontWeight: 600 }}>{a.full_name || '—'}</td>
                    <td style={{ color: '#6b7280' }}>{a.email}</td>
                    <td>
                      <div style={{ marginBottom: 4 }}>
                        <span style={{ fontSize: '0.7rem', fontWeight: 700, padding: '2px 9px', borderRadius: '100px', background: a.role === 'superadmin' ? 'rgba(201,168,76,0.15)' : 'rgba(27,67,50,0.08)', color: a.role === 'superadmin' ? '#92400e' : '#1B4332' }}>
                          {a.role === 'superadmin' ? '★ Superadmin' : 'Admin'}
                        </span>
                      </div>
                      {a.role !== 'superadmin' && (
                        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                          {(a.privileges || []).length === 0
                            ? <span style={{ fontSize: '0.7rem', color: '#9ca3af' }}>No privileges set</span>
                            : (a.privileges || []).map(p => <PrivilegeBadge key={p} p={p} />)
                          }
                          <button onClick={() => { setEditingPrivileges(a); setEditPrivs(a.privileges || []) }}
                            style={{ fontSize: '0.65rem', color: '#1B4332', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', padding: 0 }}>
                            Edit
                          </button>
                        </div>
                      )}
                    </td>
                    <td>
                      {a.suspended_at
                        ? <span style={{ fontSize: '0.72rem', background: '#fee2e2', color: '#991b1b', padding: '2px 8px', borderRadius: '100px', fontWeight: 700 }}>Suspended</span>
                        : <span style={{ fontSize: '0.72rem', background: '#d1fae5', color: '#065f46', padding: '2px 8px', borderRadius: '100px', fontWeight: 700 }}>Active</span>
                      }
                    </td>
                    <td style={{ color: '#9ca3af', fontSize: '0.75rem' }}>{fmtDate(a.created_at)}</td>
                    <td>
                      {a.role !== 'superadmin' && (
                        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                          {a.suspended_at ? (
                            <button className="action-btn" disabled={actionLoading === a.id}
                              style={{ background: '#f0fdf4', color: '#166534', borderColor: '#86efac' }}
                              onClick={() => doAction(a.id, 'reinstate', a.full_name || a.email)}>
                              Reinstate
                            </button>
                          ) : (
                            <button className="action-btn" disabled={actionLoading === a.id}
                              style={{ background: '#fef9c3', color: '#854d0e', borderColor: '#f6c90e' }}
                              onClick={() => doAction(a.id, 'suspend', a.full_name || a.email)}>
                              Suspend
                            </button>
                          )}
                          <button className="action-btn" disabled={actionLoading === a.id}
                            style={{ background: '#fff5f5', color: '#991b1b', borderColor: '#fecaca' }}
                            onClick={() => doAction(a.id, 'revoke', a.full_name || a.email)}>
                            Revoke
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* Invite form */}
          <div className="invite-card">
            <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1rem', marginBottom: '0.25rem', marginTop: 0 }}>Invite Admin Team Member</h3>
            <p style={{ fontSize: '0.82rem', color: '#6b7280', marginBottom: '1.25rem' }}>They will receive an email to set their password and access the admin portal.</p>
            {inviteMsg && (
              <div style={{ padding: '10px 14px', borderRadius: 8, marginBottom: '1rem', background: inviteOk ? '#f0fff4' : '#fff5f5', border: `1px solid ${inviteOk ? '#9ae6b4' : '#feb2b2'}`, color: inviteOk ? '#276749' : '#c53030', fontSize: '0.82rem' }}>
                {inviteMsg}
              </div>
            )}
            <form onSubmit={handleInvite}>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.85rem' }}>
                <input type="text" placeholder="Full name" value={inviteName} onChange={e => setInviteName(e.target.value)}
                  style={{ ...inputStyle, flex: 1, minWidth: 150 }} />
                <input type="email" placeholder="Email address" value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} required
                  style={{ ...inputStyle, flex: 2, minWidth: 200 }} />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#374151', marginBottom: '0.5rem' }}>Privileges (select all that apply)</div>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {PRIVILEGES.map(p => (
                    <button key={p} type="button"
                      className={`priv-toggle${invitePrivileges.includes(p) ? ' on' : ''}`}
                      onClick={() => setInvitePrivileges(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p])}>
                      {invitePrivileges.includes(p) ? '✓ ' : ''}{p}
                    </button>
                  ))}
                </div>
              </div>
              <button type="submit" disabled={inviting}
                style={{ padding: '0.6rem 1.5rem', background: '#1B4332', color: '#fff', border: 'none', borderRadius: 8, fontSize: '0.875rem', fontWeight: 700, cursor: inviting ? 'not-allowed' : 'pointer', opacity: inviting ? 0.7 : 1 }}>
                {inviting ? 'Sending invite...' : 'Send Invite'}
              </button>
            </form>
          </div>
        </>
      )}

      {/* AUDIT LOG TAB */}
      {tab === 'audit' && isSuperAdmin && (
        <>
          {auditLoading ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af' }}>Loading audit log...</div>
          ) : audit.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb', color: '#9ca3af' }}>No audit entries yet.</div>
          ) : (
            <table className="users-table">
              <thead>
                <tr><th>When</th><th>Admin</th><th>Action</th><th>Target</th><th>Details</th></tr>
              </thead>
              <tbody>
                {audit.map(entry => {
                  const a = ACTION_LABELS[entry.action] || { label: entry.action, color: '#374151' }
                  return (
                    <tr key={entry.id}>
                      <td style={{ color: '#9ca3af', fontSize: '0.75rem', whiteSpace: 'nowrap' }}>{fmtDateTime(entry.created_at)}</td>
                      <td style={{ fontWeight: 600 }}>{entry.admin_name || '—'}</td>
                      <td>
                        <span style={{ fontSize: '0.72rem', fontWeight: 700, color: a.color, background: `${a.color}12`, padding: '2px 8px', borderRadius: '100px' }}>{a.label}</span>
                      </td>
                      <td style={{ color: '#374151' }}>{entry.target_name || '—'}</td>
                      <td style={{ color: '#6b7280', fontSize: '0.75rem' }}>
                        {entry.details && Object.keys(entry.details).length > 0
                          ? Object.entries(entry.details).map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`).join(' · ')
                          : '—'
                        }
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </>
      )}

      {/* Privilege edit modal */}
      {editingPrivileges && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setEditingPrivileges(null)}>
          <div className="modal">
            <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.1rem', margin: '0 0 0.25rem' }}>Edit Privileges</h3>
            <p style={{ fontSize: '0.82rem', color: '#6b7280', marginBottom: '1.25rem' }}>{editingPrivileges.full_name || editingPrivileges.email}</p>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
              {PRIVILEGES.map(p => (
                <button key={p} type="button"
                  className={`priv-toggle${editPrivs.includes(p) ? ' on' : ''}`}
                  onClick={() => setEditPrivs(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p])}>
                  {editPrivs.includes(p) ? '✓ ' : ''}{p}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={savePrivileges} disabled={savingPrivs}
                style={{ flex: 1, padding: '0.65rem', background: '#1B4332', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer' }}>
                {savingPrivs ? 'Saving...' : 'Save Privileges'}
              </button>
              <button onClick={() => setEditingPrivileges(null)}
                style={{ padding: '0.65rem 1rem', background: '#f9fafb', color: '#374151', border: '1px solid #e5e7eb', borderRadius: 8, fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer' }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
