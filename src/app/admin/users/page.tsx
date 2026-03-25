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
  created_at: string
}

export default function UsersPage() {
  const [tab, setTab] = useState<'clients' | 'admins'>('clients')
  const [clients, setClients] = useState<Client[]>([])
  const [admins, setAdmins] = useState<AdminUser[]>([])
  const [clientsLoading, setClientsLoading] = useState(true)
  const [adminsLoading, setAdminsLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteName, setInviteName] = useState('')
  const [inviting, setInviting] = useState(false)
  const [inviteMsg, setInviteMsg] = useState('')
  const [inviteOk, setInviteOk] = useState(true)
  const [revoking, setRevoking] = useState<string | null>(null)
  const [isSuperAdmin, setIsSuperAdmin] = useState(false)

  useEffect(() => {
    // Check role
    fetch('/api/admin/me').then(r => r.json()).then(d => setIsSuperAdmin(d.role === 'superadmin'))
    // Load clients
    fetch('/api/admin/users/clients')
      .then(r => r.json())
      .then(data => { setClients(Array.isArray(data) ? data : []); setClientsLoading(false) })
      .catch(() => setClientsLoading(false))
  }, [])

  useEffect(() => {
    if (tab !== 'admins') return
    setAdminsLoading(true)
    fetch('/api/admin/users')
      .then(r => r.json())
      .then(data => { setAdmins(Array.isArray(data) ? data : []); setAdminsLoading(false) })
      .catch(() => setAdminsLoading(false))
  }, [tab])

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault()
    setInviting(true); setInviteMsg('')
    const res = await fetch('/api/admin/users', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: inviteEmail, full_name: inviteName }) })
    const data = await res.json()
    setInviteMsg(data.message || data.error); setInviteOk(!!data.success)
    if (data.success) { setInviteEmail(''); setInviteName('') }
    setInviting(false)
  }

  async function revokeAdmin(id: string, name: string) {
    if (!confirm(`Remove admin access for ${name}?`)) return
    setRevoking(id)
    const res = await fetch('/api/admin/users', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, role: 'client' }) })
    const data = await res.json()
    if (data.success) setAdmins(prev => prev.filter(a => a.id !== id))
    setRevoking(null)
  }

  const filteredClients = clients.filter(c =>
    !search || c.full_name?.toLowerCase().includes(search.toLowerCase()) || c.email?.toLowerCase().includes(search.toLowerCase()) || c.company?.toLowerCase().includes(search.toLowerCase())
  )

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
      `}</style>

      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '1.5rem', fontWeight: 700, color: '#111827', margin: '0 0 0.25rem' }}>Users & CRM</h1>
        <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0 }}>Manage clients and the admin team.</p>
      </div>

      <div className="users-tabs">
        <button className={`users-tab${tab === 'clients' ? ' active' : ''}`} onClick={() => setTab('clients')}>
          Clients ({clients.length})
        </button>
        {isSuperAdmin && (
          <button className={`users-tab${tab === 'admins' ? ' active' : ''}`} onClick={() => setTab('admins')}>
            Admin Team ({admins.length})
          </button>
        )}
      </div>

      {tab === 'clients' && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>{clients.length} registered clients</div>
            <input
              type="text" placeholder="Search clients..." value={search} onChange={e => setSearch(e.target.value)}
              style={{ padding: '0.45rem 0.85rem', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: '0.82rem', width: 220, outline: 'none' }}
            />
          </div>
          {clientsLoading ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af' }}>Loading clients...</div>
          ) : (
            <table className="users-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Company</th>
                  <th>Country</th>
                  <th>Joined</th>
                </tr>
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
                    <td style={{ color: '#9ca3af', fontSize: '0.75rem' }}>{new Date(c.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}

      {tab === 'admins' && isSuperAdmin && (
        <>
          {adminsLoading ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af' }}>Loading team...</div>
          ) : (
            <table className="users-table">
              <thead>
                <tr><th>Name</th><th>Email</th><th>Role</th><th>Joined</th><th></th></tr>
              </thead>
              <tbody>
                {admins.length === 0 ? (
                  <tr><td colSpan={5} style={{ textAlign: 'center', color: '#9ca3af', padding: '2.5rem' }}>No admin users.</td></tr>
                ) : admins.map(a => (
                  <tr key={a.id}>
                    <td style={{ fontWeight: 600 }}>{a.full_name || '—'}</td>
                    <td style={{ color: '#6b7280' }}>{a.email}</td>
                    <td>
                      <span style={{ fontSize: '0.7rem', fontWeight: 700, padding: '2px 9px', borderRadius: '100px', background: a.role === 'superadmin' ? 'rgba(201,168,76,0.15)' : 'rgba(27,67,50,0.08)', color: a.role === 'superadmin' ? '#92400e' : '#1B4332' }}>
                        {a.role === 'superadmin' ? '★ Superadmin' : 'Admin'}
                      </span>
                    </td>
                    <td style={{ color: '#9ca3af', fontSize: '0.75rem' }}>{new Date(a.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                    <td>
                      {a.role !== 'superadmin' && (
                        <button onClick={() => revokeAdmin(a.id, a.full_name || a.email)} disabled={revoking === a.id}
                          style={{ padding: '3px 10px', fontSize: '0.72rem', fontWeight: 600, background: '#fff5f5', color: '#991b1b', border: '1px solid #fecaca', borderRadius: 6, cursor: 'pointer' }}>
                          {revoking === a.id ? 'Removing...' : 'Revoke'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <div className="invite-card">
            <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1rem', marginBottom: '0.25rem', marginTop: 0 }}>Invite Admin User</h3>
            <p style={{ fontSize: '0.82rem', color: '#6b7280', marginBottom: '1.25rem' }}>They will receive an email to set their password and access the admin portal.</p>
            {inviteMsg && <div style={{ padding: '10px 14px', borderRadius: 8, marginBottom: '1rem', background: inviteOk ? '#f0fff4' : '#fff5f5', border: `1px solid ${inviteOk ? '#9ae6b4' : '#feb2b2'}`, color: inviteOk ? '#276749' : '#c53030', fontSize: '0.82rem' }}>{inviteMsg}</div>}
            <form onSubmit={handleInvite} style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <input type="text" placeholder="Full name" value={inviteName} onChange={e => setInviteName(e.target.value)}
                style={{ flex: 1, minWidth: 150, padding: '0.6rem 0.75rem', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: '0.875rem', outline: 'none' }} />
              <input type="email" placeholder="Email address" value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} required
                style={{ flex: 2, minWidth: 200, padding: '0.6rem 0.75rem', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: '0.875rem', outline: 'none' }} />
              <button type="submit" disabled={inviting}
                style={{ padding: '0.6rem 1.25rem', background: '#1B4332', color: '#fff', border: 'none', borderRadius: 8, fontSize: '0.875rem', fontWeight: 700, cursor: inviting ? 'not-allowed' : 'pointer', opacity: inviting ? 0.7 : 1, whiteSpace: 'nowrap' }}>
                {inviting ? 'Sending...' : 'Send Invite'}
              </button>
            </form>
          </div>
        </>
      )}
    </>
  )
}
