'use client'

import { useEffect, useState } from 'react'

type Service = {
  id: string
  name: string
  category: string
  description: string | null
  price_gbp: number | null
  price_usd: number | null
  price_eur: number | null
  price_ngn: number | null
  is_active: boolean
  display_order: number
}

const CATEGORIES = [
  'Academic Writing',
  'Research Services',
  'Digital Transformation',
  'Ed-Tech',
  'Product Management',
  'AI Automation',
  'Turnitin & Plagiarism',
  'Other',
]

const CURRENCY_CONFIG = [
  { key: 'price_gbp', label: 'GBP (£)', symbol: '£' },
  { key: 'price_usd', label: 'USD ($)', symbol: '$' },
  { key: 'price_eur', label: 'EUR (€)', symbol: '€' },
  { key: 'price_ngn', label: 'NGN (₦)', symbol: '₦' },
]

const EMPTY: Partial<Service> = { name: '', category: CATEGORIES[0], description: '', price_gbp: null, price_usd: null, price_eur: null, price_ngn: null, is_active: true, display_order: 0 }

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [editing, setEditing] = useState<Partial<Service> | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')
  const [msgType, setMsgType] = useState<'ok' | 'err'>('ok')

  useEffect(() => { loadServices() }, [])

  function loadServices() {
    fetch('/api/admin/services')
      .then(r => r.json())
      .then(data => { setServices(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => setLoading(false))
  }

  function openNew() { setEditing({ ...EMPTY }); setIsNew(true); setMsg('') }
  function openEdit(s: Service) { setEditing({ ...s }); setIsNew(false); setMsg('') }

  async function save() {
    if (!editing?.name || !editing?.category) { setMsg('Name and category are required.'); setMsgType('err'); return }
    setSaving(true); setMsg('')
    const method = isNew ? 'POST' : 'PATCH'
    const res = await fetch('/api/admin/services', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(editing) })
    const data = await res.json()
    if (data.success) {
      setMsg(isNew ? 'Service created.' : 'Service updated.'); setMsgType('ok')
      loadServices()
      setTimeout(() => setEditing(null), 800)
    } else {
      setMsg(data.error || 'Something went wrong.'); setMsgType('err')
    }
    setSaving(false)
  }

  async function toggleActive(s: Service) {
    await fetch('/api/admin/services', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: s.id, is_active: !s.is_active }) })
    setServices(prev => prev.map(x => x.id === s.id ? { ...x, is_active: !x.is_active } : x))
  }

  async function deleteService(s: Service) {
    if (!confirm(`Delete "${s.name}"? This cannot be undone.`)) return
    await fetch('/api/admin/services', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: s.id }) })
    setServices(prev => prev.filter(x => x.id !== s.id))
  }

  const cats = ['all', ...CATEGORIES.filter(c => services.some(s => s.category === c))]
  const filtered = filter === 'all' ? services : services.filter(s => s.category === filter)

  function fmt(val: number | null, symbol: string) {
    if (val === null || val === undefined) return '—'
    return `${symbol}${Number(val).toLocaleString()}`
  }

  return (
    <>
      <style>{`
        .sv-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 1rem; }
        .sv-card { background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 1.25rem; }
        .sv-card-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 0.75rem; }
        .sv-card-name { font-weight: 700; font-size: 0.95rem; color: #111827; line-height: 1.3; margin-bottom: 0.2rem; }
        .sv-card-cat { font-size: 0.7rem; font-weight: 600; background: rgba(27,67,50,0.08); color: #1B4332; padding: 2px 8px; border-radius: 100px; }
        .sv-prices { display: grid; grid-template-columns: 1fr 1fr; gap: 0.4rem; margin: 0.75rem 0; }
        .sv-price-item { background: #f9fafb; border-radius: 7px; padding: 0.4rem 0.6rem; }
        .sv-price-currency { font-size: 0.65rem; color: #9ca3af; font-weight: 600; }
        .sv-price-value { font-size: 0.875rem; font-weight: 700; color: #111827; }
        .sv-actions { display: flex; gap: 0.5rem; flex-wrap: wrap; }
        .sv-btn { padding: 0.35rem 0.75rem; border-radius: 7px; font-size: 0.75rem; font-weight: 600; cursor: pointer; border: 1px solid transparent; transition: all 0.15s; }
        .sv-btn-edit { background: #f0fdf4; color: #166534; border-color: #bbf7d0; }
        .sv-btn-edit:hover { background: #dcfce7; }
        .sv-btn-del { background: #fff5f5; color: #991b1b; border-color: #fecaca; }
        .sv-btn-del:hover { background: #fee2e2; }
        .sv-toggle { position: relative; width: 36px; height: 20px; }
        .sv-toggle input { opacity: 0; width: 0; height: 0; }
        .sv-toggle-track { position: absolute; inset: 0; background: #e5e7eb; border-radius: 100px; cursor: pointer; transition: background 0.2s; }
        .sv-toggle input:checked + .sv-toggle-track { background: #1B4332; }
        .sv-toggle-thumb { position: absolute; height: 14px; width: 14px; left: 3px; bottom: 3px; background: #fff; border-radius: 50%; transition: transform 0.2s; }
        .sv-toggle input:checked ~ .sv-toggle-thumb { transform: translateX(16px); }
        /* Form overlay */
        .form-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); z-index: 200; display: flex; align-items: center; justify-content: center; padding: 1rem; }
        .form-modal { background: #fff; border-radius: 16px; width: 100%; max-width: 560px; max-height: 90vh; overflow-y: auto; }
        .form-modal-header { padding: 1.5rem 2rem 1rem; border-bottom: 1px solid #f3f4f6; display: flex; justify-content: space-between; align-items: center; }
        .form-modal-body { padding: 1.5rem 2rem; }
        .form-modal-footer { padding: 1rem 2rem 1.5rem; display: flex; gap: 0.75rem; justify-content: flex-end; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }
        .form-field { margin-bottom: 1rem; }
        .form-field label { display: block; font-size: 0.75rem; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 0.35rem; }
        .form-field input, .form-field select, .form-field textarea { width: 100%; padding: 0.6rem 0.75rem; border: 1px solid #e5e7eb; border-radius: 8px; font-size: 0.875rem; outline: none; background: #fff; transition: border-color 0.15s; }
        .form-field input:focus, .form-field select:focus, .form-field textarea:focus { border-color: #1B4332; }
        .price-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }
      `}</style>

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '1.5rem', fontWeight: 700, color: '#111827', margin: '0 0 0.25rem' }}>Services & Pricing</h1>
          <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0 }}>Manage your service catalogue with multi-currency pricing.</p>
        </div>
        <button onClick={openNew} style={{ padding: '0.6rem 1.25rem', background: '#1B4332', color: '#fff', border: 'none', borderRadius: 8, fontSize: '0.875rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          + Add Service
        </button>
      </div>

      {/* Category filters */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        {cats.map(c => (
          <button key={c} onClick={() => setFilter(c)}
            style={{ padding: '0.3rem 0.75rem', borderRadius: '100px', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', border: `1px solid ${filter === c ? '#1B4332' : '#e5e7eb'}`, background: filter === c ? '#1B4332' : '#fff', color: filter === c ? '#fff' : '#6b7280', transition: 'all 0.15s' }}>
            {c === 'all' ? `All (${services.length})` : c}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af' }}>Loading services...</div>
      ) : (
        <div className="sv-grid">
          {filtered.map(s => (
            <div key={s.id} className="sv-card" style={{ opacity: s.is_active ? 1 : 0.65 }}>
              <div className="sv-card-header">
                <div style={{ flex: 1 }}>
                  <div className="sv-card-name">{s.name}</div>
                  <span className="sv-card-cat">{s.category}</span>
                </div>
                {/* Toggle */}
                <label className="sv-toggle" title={s.is_active ? 'Active — click to deactivate' : 'Inactive — click to activate'}>
                  <input type="checkbox" checked={s.is_active} onChange={() => toggleActive(s)} />
                  <div className="sv-toggle-track" />
                  <div className="sv-toggle-thumb" style={{ transform: s.is_active ? 'translateX(16px)' : 'none' }} />
                </label>
              </div>

              {s.description && <p style={{ fontSize: '0.78rem', color: '#6b7280', margin: '0 0 0.75rem', lineHeight: 1.5 }}>{s.description}</p>}

              <div className="sv-prices">
                {CURRENCY_CONFIG.map(c => (
                  <div key={c.key} className="sv-price-item">
                    <div className="sv-price-currency">{c.label}</div>
                    <div className="sv-price-value">{fmt(s[c.key as keyof Service] as number | null, c.symbol)}</div>
                  </div>
                ))}
              </div>

              <div className="sv-actions">
                <button className="sv-btn sv-btn-edit" onClick={() => openEdit(s)}>Edit</button>
                <button className="sv-btn sv-btn-del" onClick={() => deleteService(s)}>Delete</button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && !loading && (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '3rem', background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb', color: '#9ca3af' }}>
              No services yet. Click &quot;Add Service&quot; to create your first one.
            </div>
          )}
        </div>
      )}

      {/* Edit / Create modal */}
      {editing && (
        <div className="form-overlay" onClick={e => e.target === e.currentTarget && setEditing(null)}>
          <div className="form-modal">
            <div className="form-modal-header">
              <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.1rem', margin: 0 }}>{isNew ? 'Add New Service' : 'Edit Service'}</h2>
              <button onClick={() => setEditing(null)} style={{ background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer', color: '#9ca3af' }}>✕</button>
            </div>
            <div className="form-modal-body">
              {msg && <div style={{ padding: '10px 14px', borderRadius: 8, marginBottom: '1rem', background: msgType === 'ok' ? '#f0fff4' : '#fff5f5', border: `1px solid ${msgType === 'ok' ? '#9ae6b4' : '#feb2b2'}`, color: msgType === 'ok' ? '#276749' : '#c53030', fontSize: '0.82rem' }}>{msg}</div>}

              <div className="form-row">
                <div className="form-field" style={{ gridColumn: '1/-1' }}>
                  <label>Service Name *</label>
                  <input type="text" value={editing.name || ''} onChange={e => setEditing(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Undergraduate Project Writing" />
                </div>
                <div className="form-field">
                  <label>Category *</label>
                  <select value={editing.category || ''} onChange={e => setEditing(p => ({ ...p, category: e.target.value }))}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-field">
                  <label>Display Order</label>
                  <input type="number" value={editing.display_order ?? 0} onChange={e => setEditing(p => ({ ...p, display_order: parseInt(e.target.value) || 0 }))} min="0" />
                </div>
                <div className="form-field" style={{ gridColumn: '1/-1' }}>
                  <label>Description</label>
                  <textarea rows={2} value={editing.description || ''} onChange={e => setEditing(p => ({ ...p, description: e.target.value }))} placeholder="Brief description of what is included..." style={{ resize: 'vertical' }} />
                </div>
              </div>

              <div style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid #f3f4f6' }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.75rem' }}>Pricing (leave blank for &quot;Contact us&quot;)</div>
                <div className="price-grid">
                  {CURRENCY_CONFIG.map(c => (
                    <div className="form-field" key={c.key} style={{ marginBottom: 0 }}>
                      <label>{c.label}</label>
                      <input type="number" min="0" step="0.01"
                        value={editing[c.key as keyof Service] === null || editing[c.key as keyof Service] === undefined ? '' : String(editing[c.key as keyof Service])}
                        onChange={e => setEditing(p => ({ ...p, [c.key]: e.target.value === '' ? null : parseFloat(e.target.value) }))}
                        placeholder="0.00" />
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <label className="sv-toggle">
                  <input type="checkbox" checked={editing.is_active ?? true} onChange={e => setEditing(p => ({ ...p, is_active: e.target.checked }))} />
                  <div className="sv-toggle-track" />
                  <div className="sv-toggle-thumb" style={{ transform: (editing.is_active ?? true) ? 'translateX(16px)' : 'none' }} />
                </label>
                <span style={{ fontSize: '0.875rem', color: '#374151' }}>{editing.is_active ? 'Active (visible to clients)' : 'Inactive (hidden)'}</span>
              </div>
            </div>
            <div className="form-modal-footer">
              <button onClick={() => setEditing(null)} style={{ padding: '0.6rem 1.25rem', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: '0.875rem', cursor: 'pointer', color: '#374151', fontWeight: 600 }}>Cancel</button>
              <button onClick={save} disabled={saving} style={{ padding: '0.6rem 1.5rem', background: '#1B4332', color: '#fff', border: 'none', borderRadius: 8, fontSize: '0.875rem', fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1 }}>
                {saving ? 'Saving...' : isNew ? 'Create Service' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
