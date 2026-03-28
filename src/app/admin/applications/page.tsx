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
  payment_instructions: string | null
  created_at: string
  deposit_amount: number | null
  balance_amount: number | null
  deposit_paid_at: string | null
  balance_paid_at: string | null
  work_started_at: string | null
  expected_delivery_at: string | null
  deliverable_url: string | null
  ai_report_url: string | null
  profiles: { full_name: string; email: string; country: string; company: string } | null
}

const SERVICE_LABELS: Record<string, string> = {
  research_academic: 'Research & Academic',
  digital_transformation: 'Digital Transformation',
  edtech: 'Ed-Tech',
  product_management: 'Product Management',
  writing: 'Writing',
  dissertation: 'Dissertation',
  ai_automation: 'AI Automation',
}

const STATUSES = [
  { value: 'pending',         label: 'Pending Review',   bg: '#fef3c7', color: '#92400e' },
  { value: 'in_review',       label: 'In Review',        bg: '#dbeafe', color: '#1e40af' },
  { value: 'accepted',        label: 'Awaiting Deposit', bg: '#fef9c3', color: '#854d0e' },
  { value: 'in_progress',     label: 'In Progress',      bg: '#d1fae5', color: '#065f46' },
  { value: 'pending_balance', label: 'Balance Due',      bg: '#ede9fe', color: '#5b21b6' },
  { value: 'completed',       label: 'Delivered',        bg: '#f0fdf4', color: '#166534' },
  { value: 'cancelled',       label: 'Cancelled',        bg: '#fee2e2', color: '#991b1b' },
]

function StatusBadge({ status }: { status: string }) {
  const s = STATUSES.find(x => x.value === status) || STATUSES[0]
  return <span style={{ background: s.bg, color: s.color, fontSize: '0.7rem', fontWeight: 700, padding: '3px 10px', borderRadius: '100px', whiteSpace: 'nowrap' }}>{s.label}</span>
}

function fmtDate(iso: string | null) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

function fmtAmount(n: number | null) {
  if (!n) return '—'
  return n.toLocaleString('en-GB')
}

async function uploadFile(file: File, projectId: string, fileType: string): Promise<string | null> {
  const fd = new FormData()
  fd.append('file', file)
  fd.append('projectId', projectId)
  fd.append('fileType', fileType)
  const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
  const data = await res.json()
  return data.path || null
}

export default function ApplicationsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Project | null>(null)
  const [updating, setUpdating] = useState(false)
  const [updateMsg, setUpdateMsg] = useState('')

  // Per-action form state
  const [adminNotes, setAdminNotes] = useState('')
  const [depositAmount, setDepositAmount] = useState('')
  const [balanceAmount, setBalanceAmount] = useState('')
  const [paymentInstructions, setPaymentInstructions] = useState('')
  const [paymentCurrency, setPaymentCurrency] = useState('NGN')
  const [deliverableFile, setDeliverableFile] = useState<File | null>(null)
  const [aiReportFile, setAiReportFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    fetch('/api/admin/projects')
      .then(r => r.json())
      .then(data => { setProjects(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  function openProject(p: Project) {
    setSelected(p)
    setAdminNotes(p.admin_notes || '')
    setDepositAmount(p.deposit_amount?.toString() || '')
    setBalanceAmount(p.balance_amount?.toString() || '')
    setPaymentInstructions(p.payment_instructions || '')
    setPaymentCurrency((p as unknown as { payment_currency?: string }).payment_currency || 'NGN')
    setDeliverableFile(null)
    setAiReportFile(null)
    setUpdateMsg('')
  }

  async function executeAction(newStatus: string) {
    if (!selected) return
    setUpdating(true); setUpdateMsg('')

    let delivPath: string | null = null
    let aiPath: string | null = null

    if (newStatus === 'pending_balance') {
      setUploading(true)
      if (deliverableFile) delivPath = await uploadFile(deliverableFile, selected.id, 'deliverable')
      if (aiReportFile) aiPath = await uploadFile(aiReportFile, selected.id, 'ai_report')
      setUploading(false)
    }

    const payload: Record<string, unknown> = {
      id: selected.id,
      status: newStatus,
      admin_notes: adminNotes || null,
    }
    if (newStatus === 'accepted') {
      payload.deposit_amount = parseFloat(depositAmount) || null
      payload.payment_instructions = paymentInstructions || null
      payload.payment_currency = paymentCurrency
    }
    if (newStatus === 'pending_balance') {
      payload.balance_amount = parseFloat(balanceAmount) || null
      payload.payment_instructions = paymentInstructions || null
      payload.payment_currency = paymentCurrency
      if (delivPath) payload.deliverable_url = delivPath
      if (aiPath) payload.ai_report_url = aiPath
    }

    const res = await fetch('/api/admin/projects', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const data = await res.json()
    if (data.success) {
      const updated = data.project
      setProjects(prev => prev.map(p => p.id === selected.id ? { ...p, ...updated } : p))
      setSelected(prev => prev ? { ...prev, ...updated } : null)
      setUpdateMsg('Done. Client notified by email.')
    } else {
      setUpdateMsg('Error: ' + (data.error || 'Unknown error'))
    }
    setUpdating(false)
  }

  const counts = STATUSES.reduce((acc, s) => ({ ...acc, [s.value]: projects.filter(p => p.status === s.value).length }), {} as Record<string, number>)
  const filtered = projects
    .filter(p => filter === 'all' || p.status === filter)
    .filter(p => !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.profiles?.full_name.toLowerCase().includes(search.toLowerCase()) || p.profiles?.email.toLowerCase().includes(search.toLowerCase()))

  const btnPrimary: React.CSSProperties = { padding: '0.65rem 1rem', background: '#1B4332', color: '#fff', border: 'none', borderRadius: 8, fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer', width: '100%' }
  const btnDanger: React.CSSProperties = { padding: '0.65rem 1rem', background: '#fff', color: '#dc2626', border: '1px solid #dc2626', borderRadius: 8, fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer', width: '100%' }
  const inputStyle: React.CSSProperties = { width: '100%', padding: '0.55rem 0.75rem', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: '0.875rem', outline: 'none', background: '#fff', boxSizing: 'border-box' }
  const label: React.CSSProperties = { fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#9ca3af', display: 'block', marginBottom: '0.35rem' }

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
        .panel { width: 520px; max-width: 96vw; background: #fff; height: 100%; overflow-y: auto; box-shadow: -8px 0 32px rgba(0,0,0,0.1); }
        .panel-head { padding: 1.5rem 1.75rem; border-bottom: 1px solid #f3f4f6; display: flex; align-items: flex-start; justify-content: space-between; position: sticky; top: 0; background: #fff; z-index: 1; }
        .panel-body { padding: 1.5rem 1.75rem; }
        .section { margin-bottom: 1.5rem; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.85rem; margin-bottom: 1.5rem; }
        .info-item p:first-child { font-size: 0.68rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.07em; color: #9ca3af; margin: 0 0 2px; }
        .info-item p:last-child { font-size: 0.82rem; color: #374151; margin: 0; }
        .workflow-divider { border: none; border-top: 2px dashed #e5e7eb; margin: 1.5rem 0; }
        .info-box { border-radius: 10px; padding: 14px 16px; margin-bottom: 1rem; }
        .msg-success { background: #f0fff4; border: 1px solid #9ae6b4; color: #276749; padding: 10px 14px; border-radius: 8px; font-size: 0.82rem; margin-top: 0.75rem; }
        .msg-error { background: #fff5f5; border: 1px solid #feb2b2; color: #c53030; padding: 10px 14px; border-radius: 8px; font-size: 0.82rem; margin-top: 0.75rem; }
        .file-input-wrap { border: 2px dashed #e5e7eb; border-radius: 8px; padding: 12px; text-align: center; cursor: pointer; transition: border-color 0.15s; }
        .file-input-wrap:hover { border-color: #1B4332; }
        .file-input-wrap input { display: none; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <div style={{ marginBottom: '1.75rem', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '1.5rem', fontWeight: 700, color: '#111827', margin: '0 0 0.25rem' }}>Applications</h1>
          <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0 }}>Review and manage all client service requests.</p>
        </div>
        <input type="text" placeholder="Search by title or client..." value={search} onChange={e => setSearch(e.target.value)}
          style={{ padding: '0.5rem 0.85rem', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: '0.82rem', background: '#fff', width: 240, outline: 'none' }} />
      </div>

      <div className="apps-filters">
        <button className={`filter-chip${filter === 'all' ? ' active' : ''}`} onClick={() => setFilter('all')}>All ({projects.length})</button>
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
              <th>Project</th><th>Client</th><th>Service</th><th>Urgency</th><th>Submitted</th><th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => (
              <tr key={p.id} onClick={() => openProject(p)}>
                <td><div style={{ fontWeight: 600, color: '#111827' }}>{p.title}</div></td>
                <td>
                  <div style={{ fontWeight: 600 }}>{p.profiles?.full_name || 'Unknown'}</div>
                  <div style={{ fontSize: '0.72rem', color: '#9ca3af' }}>{p.profiles?.email}</div>
                </td>
                <td><span style={{ fontSize: '0.72rem', background: 'rgba(27,67,50,0.08)', color: '#1B4332', padding: '2px 8px', borderRadius: '100px', fontWeight: 600 }}>{SERVICE_LABELS[p.service] || p.service}</span></td>
                <td style={{ textTransform: 'capitalize', color: p.urgency === 'urgent' ? '#dc2626' : '#374151' }}>{p.urgency}</td>
                <td style={{ color: '#6b7280' }}>{fmtDate(p.created_at)}</td>
                <td><StatusBadge status={p.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Detail + Workflow Panel */}
      {selected && (
        <div className="panel-overlay" onClick={e => e.target === e.currentTarget && setSelected(null)}>
          <div className="panel">
            {/* Header */}
            <div className="panel-head">
              <div>
                <div style={{ fontFamily: 'Georgia, serif', fontSize: '1.1rem', fontWeight: 700, color: '#111827', marginBottom: 6 }}>{selected.title}</div>
                <StatusBadge status={selected.status} />
              </div>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer', color: '#9ca3af', padding: 4 }}>✕</button>
            </div>

            <div className="panel-body">
              {/* Client info */}
              <div className="section">
                <div style={{ ...label, marginBottom: '0.5rem' }}>Client</div>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#111827' }}>{selected.profiles?.full_name || 'Unknown'}</div>
                <a href={`mailto:${selected.profiles?.email}`} style={{ fontSize: '0.82rem', color: '#1B4332' }}>{selected.profiles?.email}</a>
                {selected.profiles?.company && <div style={{ fontSize: '0.78rem', color: '#9ca3af' }}>{selected.profiles.company}</div>}
                {selected.profiles?.country && <div style={{ fontSize: '0.78rem', color: '#9ca3af' }}>{selected.profiles.country}</div>}
              </div>

              {/* Project details */}
              <div className="section">
                <div style={label}>Service</div>
                <div style={{ fontSize: '0.875rem', color: '#374151', marginBottom: '0.75rem' }}>{SERVICE_LABELS[selected.service] || selected.service}</div>
                <div style={label}>Description</div>
                <div style={{ fontSize: '0.875rem', color: '#374151', lineHeight: 1.7, whiteSpace: 'pre-wrap', marginBottom: '0.75rem' }}>{selected.description}</div>
              </div>

              <div className="info-grid">
                <div className="info-item"><p>Deadline</p><p>{fmtDate(selected.deadline)}</p></div>
                <div className="info-item"><p>Urgency</p><p style={{ textTransform: 'capitalize' }}>{selected.urgency}</p></div>
                <div className="info-item"><p>Budget Range</p><p>{selected.budget_range || 'Not specified'}</p></div>
                <div className="info-item"><p>Submitted</p><p>{fmtDate(selected.created_at)}</p></div>
              </div>

              <hr className="workflow-divider" />

              {/* ── WORKFLOW ACTIONS ── */}

              {/* PENDING */}
              {selected.status === 'pending' && (
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#111827', marginBottom: '1rem' }}>What would you like to do?</div>
                  <div style={{ marginBottom: '0.75rem' }}>
                    <style>{`.textarea-notes{width:100%;padding:.55rem .75rem;border:1px solid #e5e7eb;border-radius:8px;font-size:.875rem;outline:none;resize:vertical;min-height:60px;box-sizing:border-box}`}</style>
                    <div style={label}>Internal Notes (optional)</div>
                    <textarea className="textarea-notes" value={adminNotes} onChange={e => setAdminNotes(e.target.value)} placeholder="Notes for your team (not sent to client)" />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                    <button style={btnPrimary} disabled={updating} onClick={() => executeAction('in_review')}>Begin Review</button>
                    <button style={btnDanger} disabled={updating} onClick={() => executeAction('cancelled')}>Decline</button>
                  </div>
                  {updateMsg && <div className={updateMsg.startsWith('Error') ? 'msg-error' : 'msg-success'}>{updateMsg}</div>}
                </div>
              )}

              {/* IN REVIEW */}
              {selected.status === 'in_review' && (
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#111827', marginBottom: '1rem' }}>Accept or decline this application</div>

                  <div style={{ marginBottom: '0.85rem' }}>
                    <label style={label}>Currency</label>
                    <select style={inputStyle} value={paymentCurrency} onChange={e => setPaymentCurrency(e.target.value)}>
                      <option value="NGN">₦ NGN — Nigerian Naira</option>
                      <option value="GBP">£ GBP — British Pound</option>
                      <option value="EUR">€ EUR — Euro</option>
                      <option value="USD">$ USD — US Dollar</option>
                    </select>
                  </div>
                  <div style={{ marginBottom: '0.85rem' }}>
                    <label style={label}>Deposit Amount ({paymentCurrency})</label>
                    <input style={inputStyle} type="number" min="0" placeholder="e.g. 500" value={depositAmount} onChange={e => setDepositAmount(e.target.value)} />
                  </div>
                  <div style={{ marginBottom: '0.85rem' }}>
                    <label style={label}>Payment Instructions (sent to client)</label>
                    <textarea style={{ ...inputStyle, minHeight: 80, resize: 'vertical' } as React.CSSProperties} value={paymentInstructions} onChange={e => setPaymentInstructions(e.target.value)} placeholder="Bank name, account number, sort code, or payment link..." />
                  </div>
                  <div style={{ marginBottom: '0.85rem' }}>
                    <label style={label}>Internal Notes (optional)</label>
                    <textarea style={{ ...inputStyle, minHeight: 60, resize: 'vertical' } as React.CSSProperties} value={adminNotes} onChange={e => setAdminNotes(e.target.value)} placeholder="Notes for your team" />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                    <button style={btnPrimary} disabled={updating || !depositAmount} onClick={() => executeAction('accepted')}>
                      {updating ? 'Sending...' : 'Accept & Send Invoice'}
                    </button>
                    <button style={btnDanger} disabled={updating} onClick={() => executeAction('cancelled')}>Decline</button>
                  </div>
                  {updateMsg && <div className={updateMsg.startsWith('Error') ? 'msg-error' : 'msg-success'}>{updateMsg}</div>}
                </div>
              )}

              {/* ACCEPTED — awaiting deposit */}
              {selected.status === 'accepted' && (
                <div>
                  <div className="info-box" style={{ background: '#fef9c3', border: '1px solid #f6c90e' }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: '#854d0e', letterSpacing: '0.06em', marginBottom: 4 }}>Awaiting Deposit</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827' }}>{fmtAmount(selected.deposit_amount)}</div>
                    {selected.payment_instructions && (
                      <div style={{ fontSize: '0.78rem', color: '#6b7280', marginTop: 6, whiteSpace: 'pre-wrap' }}>{selected.payment_instructions}</div>
                    )}
                  </div>
                  <div style={{ marginBottom: '0.85rem' }}>
                    <label style={label}>Internal Notes (optional)</label>
                    <textarea style={{ ...inputStyle, minHeight: 60, resize: 'vertical' } as React.CSSProperties} value={adminNotes} onChange={e => setAdminNotes(e.target.value)} placeholder="Notes for your team" />
                  </div>
                  <button style={btnPrimary} disabled={updating} onClick={() => executeAction('in_progress')}>
                    {updating ? 'Updating...' : 'Mark Deposit Received → Start Work'}
                  </button>
                  {updateMsg && <div className={updateMsg.startsWith('Error') ? 'msg-error' : 'msg-success'}>{updateMsg}</div>}
                </div>
              )}

              {/* IN PROGRESS */}
              {selected.status === 'in_progress' && (
                <div>
                  <div className="info-box" style={{ background: '#d1fae5', border: '1px solid #6ee7b7' }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: '#065f46', letterSpacing: '0.06em', marginBottom: 4 }}>Work in Progress</div>
                    {selected.work_started_at && <div style={{ fontSize: '0.82rem', color: '#065f46' }}>Started: {fmtDate(selected.work_started_at)}</div>}
                    {selected.expected_delivery_at && <div style={{ fontSize: '0.82rem', color: '#065f46' }}>Expected delivery: {fmtDate(selected.expected_delivery_at)}</div>}
                  </div>

                  <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#111827', margin: '1rem 0 0.85rem' }}>Ready to deliver? Upload files & request balance.</div>

                  <div style={{ marginBottom: '0.85rem' }}>
                    <label style={label}>Currency</label>
                    <select style={inputStyle} value={paymentCurrency} onChange={e => setPaymentCurrency(e.target.value)}>
                      <option value="NGN">₦ NGN — Nigerian Naira</option>
                      <option value="GBP">£ GBP — British Pound</option>
                      <option value="EUR">€ EUR — Euro</option>
                      <option value="USD">$ USD — US Dollar</option>
                    </select>
                  </div>
                  <div style={{ marginBottom: '0.85rem' }}>
                    <label style={label}>Balance Amount ({paymentCurrency})</label>
                    <input style={inputStyle} type="number" min="0" placeholder="e.g. 300" value={balanceAmount} onChange={e => setBalanceAmount(e.target.value)} />
                  </div>
                  <div style={{ marginBottom: '0.85rem' }}>
                    <label style={label}>Payment Instructions (sent to client)</label>
                    <textarea style={{ ...inputStyle, minHeight: 80, resize: 'vertical' } as React.CSSProperties} value={paymentInstructions} onChange={e => setPaymentInstructions(e.target.value)} placeholder="Bank name, account number, sort code, or payment link..." />
                  </div>

                  <div style={{ marginBottom: '0.85rem' }}>
                    <label style={label}>Deliverable File</label>
                    <label className="file-input-wrap">
                      <input type="file" accept=".pdf,.doc,.docx,.zip" onChange={e => setDeliverableFile(e.target.files?.[0] || null)} />
                      <div style={{ fontSize: '0.82rem', color: '#6b7280' }}>{deliverableFile ? deliverableFile.name : 'Click to select file (PDF, Word, ZIP)'}</div>
                    </label>
                  </div>
                  <div style={{ marginBottom: '0.85rem' }}>
                    <label style={label}>AI / Similarity Report</label>
                    <label className="file-input-wrap">
                      <input type="file" accept=".pdf,.doc,.docx" onChange={e => setAiReportFile(e.target.files?.[0] || null)} />
                      <div style={{ fontSize: '0.82rem', color: '#6b7280' }}>{aiReportFile ? aiReportFile.name : 'Click to select file (PDF, Word)'}</div>
                    </label>
                  </div>

                  <div style={{ marginBottom: '0.85rem' }}>
                    <label style={label}>Internal Notes (optional)</label>
                    <textarea style={{ ...inputStyle, minHeight: 60, resize: 'vertical' } as React.CSSProperties} value={adminNotes} onChange={e => setAdminNotes(e.target.value)} placeholder="Notes for your team" />
                  </div>

                  <button style={btnPrimary} disabled={updating || uploading || !balanceAmount} onClick={() => executeAction('pending_balance')}>
                    {uploading ? 'Uploading files...' : updating ? 'Sending...' : 'Upload Files & Request Balance Payment'}
                  </button>
                  {updateMsg && <div className={updateMsg.startsWith('Error') ? 'msg-error' : 'msg-success'}>{updateMsg}</div>}
                </div>
              )}

              {/* PENDING BALANCE */}
              {selected.status === 'pending_balance' && (
                <div>
                  <div className="info-box" style={{ background: '#ede9fe', border: '1px solid #c4b5fd' }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: '#5b21b6', letterSpacing: '0.06em', marginBottom: 4 }}>Awaiting Balance Payment</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827' }}>{fmtAmount(selected.balance_amount)}</div>
                    {selected.payment_instructions && (
                      <div style={{ fontSize: '0.78rem', color: '#6b7280', marginTop: 6, whiteSpace: 'pre-wrap' }}>{selected.payment_instructions}</div>
                    )}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#6b7280', marginBottom: '0.85rem' }}>Work files are ready and will be delivered to the client automatically once you confirm payment.</div>
                  <div style={{ marginBottom: '0.85rem' }}>
                    <label style={label}>Internal Notes (optional)</label>
                    <textarea style={{ ...inputStyle, minHeight: 60, resize: 'vertical' } as React.CSSProperties} value={adminNotes} onChange={e => setAdminNotes(e.target.value)} placeholder="Notes for your team" />
                  </div>
                  <button style={btnPrimary} disabled={updating} onClick={() => executeAction('completed')}>
                    {updating ? 'Delivering...' : 'Mark Balance Received & Deliver Files'}
                  </button>
                  {updateMsg && <div className={updateMsg.startsWith('Error') ? 'msg-error' : 'msg-success'}>{updateMsg}</div>}
                </div>
              )}

              {/* COMPLETED */}
              {selected.status === 'completed' && (
                <div>
                  <div className="info-box" style={{ background: '#f0fdf4', border: '1px solid #86efac' }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: '#166534', letterSpacing: '0.06em', marginBottom: 4 }}>Project Delivered</div>
                    {selected.deposit_paid_at && <div style={{ fontSize: '0.82rem', color: '#374151' }}>Deposit received: {fmtDate(selected.deposit_paid_at)}</div>}
                    {selected.balance_paid_at && <div style={{ fontSize: '0.82rem', color: '#374151' }}>Balance received: {fmtDate(selected.balance_paid_at)}</div>}
                  </div>
                  {(selected.deliverable_url || selected.ai_report_url) && (
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {selected.deliverable_url && (
                        <a href={`/api/admin/download?path=${encodeURIComponent(selected.deliverable_url)}`} target="_blank" rel="noreferrer"
                          style={{ padding: '0.55rem 1rem', background: '#1B4332', color: '#fff', borderRadius: 8, fontSize: '0.78rem', fontWeight: 600, textDecoration: 'none' }}>
                          View Deliverable
                        </a>
                      )}
                      {selected.ai_report_url && (
                        <a href={`/api/admin/download?path=${encodeURIComponent(selected.ai_report_url)}`} target="_blank" rel="noreferrer"
                          style={{ padding: '0.55rem 1rem', background: '#374151', color: '#fff', borderRadius: 8, fontSize: '0.78rem', fontWeight: 600, textDecoration: 'none' }}>
                          View AI Report
                        </a>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* CANCELLED */}
              {selected.status === 'cancelled' && (
                <div className="info-box" style={{ background: '#fff5f5', border: '1px solid #feb2b2' }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: '#991b1b', letterSpacing: '0.06em', marginBottom: 4 }}>Application Declined</div>
                  {selected.admin_notes && <div style={{ fontSize: '0.82rem', color: '#374151', whiteSpace: 'pre-wrap' }}>{selected.admin_notes}</div>}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
