'use client'

import { useState, useEffect } from 'react'

type ContentRow = {
  id: string
  key: string
  value: string | null
  label: string | null
  section: string | null
}

const SECTIONS: Record<string, string> = {
  hero: 'Homepage Hero',
  about: 'About Section',
  contact: 'Contact Details',
  social: 'Social Media Links',
  seo: 'SEO Settings',
}

export default function ContentPage() {
  const [rows, setRows] = useState<ContentRow[]>([])
  const [edits, setEdits] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')
  const [msgOk, setMsgOk] = useState(true)
  const [activeSection, setActiveSection] = useState('hero')

  useEffect(() => {
    fetch('/api/admin/content')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) {
          setRows(data)
          const init: Record<string, string> = {}
          data.forEach((r: ContentRow) => { init[r.key] = r.value || '' })
          setEdits(init)
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  async function save() {
    setSaving(true); setMsg('')
    const updates = Object.entries(edits).map(([key, value]) => ({ key, value }))
    const res = await fetch('/api/admin/content', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    })
    const data = await res.json()
    if (data.success) { setMsg('Changes saved!'); setMsgOk(true) }
    else { setMsg(data.error || 'Could not save changes.'); setMsgOk(false) }
    setSaving(false)
    setTimeout(() => setMsg(''), 3000)
  }

  const sectionRows = rows.filter(r => r.section === activeSection)

  return (
    <>
      <style>{`
        .cms-layout { display: grid; grid-template-columns: 220px 1fr; gap: 1.5rem; }
        .cms-nav { background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; height: fit-content; }
        .cms-nav-item { display: block; padding: 0.75rem 1.25rem; font-size: 0.875rem; cursor: pointer; color: #374151; border-bottom: 1px solid #f3f4f6; transition: background 0.15s; }
        .cms-nav-item:hover { background: #f9fafb; }
        .cms-nav-item.active { background: #f0fdf4; color: #1B4332; font-weight: 700; border-left: 3px solid #1B4332; padding-left: calc(1.25rem - 3px); }
        .cms-nav-item:last-child { border-bottom: none; }
        .cms-panel { background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 1.75rem; }
        .cms-field { margin-bottom: 1.5rem; }
        .cms-field label { display: block; font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: #6b7280; margin-bottom: 0.5rem; }
        .cms-field input, .cms-field textarea { width: 100%; padding: 0.65rem 0.85rem; border: 1px solid #e5e7eb; border-radius: 8px; font-size: 0.875rem; outline: none; font-family: inherit; box-sizing: border-box; }
        .cms-field input:focus, .cms-field textarea:focus { border-color: #1B4332; }
        .cms-field textarea { resize: vertical; line-height: 1.6; }
        .cms-field .cms-hint { font-size: 0.72rem; color: #9ca3af; margin-top: 0.3rem; }
        @media (max-width: 700px) { .cms-layout { grid-template-columns: 1fr; } }
      `}</style>

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '1.5rem', fontWeight: 700, color: '#111827', margin: '0 0 0.25rem' }}>Website Content</h1>
          <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0 }}>Edit homepage text, contact details, social links, and SEO settings.</p>
        </div>
        <button
          onClick={save}
          disabled={saving}
          style={{ padding: '0.6rem 1.5rem', background: '#1B4332', color: '#fff', border: 'none', borderRadius: 8, fontSize: '0.875rem', fontWeight: 700, cursor: 'pointer', opacity: saving ? 0.7 : 1 }}
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {msg && (
        <div style={{ padding: '10px 14px', borderRadius: 8, marginBottom: '1.25rem', background: msgOk ? '#f0fff4' : '#fff5f5', border: `1px solid ${msgOk ? '#9ae6b4' : '#feb2b2'}`, color: msgOk ? '#276749' : '#c53030', fontSize: '0.82rem' }}>
          {msg}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af' }}>Loading content...</div>
      ) : rows.length === 0 ? (
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: '3rem', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>🗄️</div>
          <p style={{ fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>No content rows found</p>
          <p style={{ color: '#9ca3af', fontSize: '0.875rem', maxWidth: 440, margin: '0 auto 1.5rem' }}>
            Run the SQL migration below to seed the initial content rows, then come back to edit them.
          </p>
          <div style={{ background: '#1a1a2e', color: '#a8ff78', padding: '1.25rem', borderRadius: 10, textAlign: 'left', fontSize: '0.78rem', fontFamily: 'monospace', maxWidth: 680, margin: '0 auto', overflowX: 'auto' }}>
            <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{`-- Run in Supabase SQL editor
INSERT INTO site_content (key, label, section, value) VALUES
  ('hero_headline','Hero Headline','hero','Professional Writing & Research Consulting'),
  ('hero_subheadline','Hero Sub-headline','hero','From academic research to corporate content strategies — delivered with precision and expertise.'),
  ('hero_cta','Hero CTA Text','hero','Get Started Today'),
  ('about_headline','About Headline','about','Experts in writing, research, and digital strategy'),
  ('about_body','About Body Text','about','Ryters Spot is a boutique consultancy specialising in professional writing, academic research, and digital transformation strategy.'),
  ('contact_email','Contact Email','contact','hello@theryters.com'),
  ('contact_phone','Contact Phone','contact','+234 706 205 7116'),
  ('contact_address','Office Address','contact','Lagos, Nigeria'),
  ('social_twitter','Twitter / X URL','social',''),
  ('social_linkedin','LinkedIn URL','social',''),
  ('social_instagram','Instagram URL','social',''),
  ('seo_title','Site Title','seo','Ryters Spot — Professional Writing & Research Consulting'),
  ('seo_description','Meta Description','seo','Ryters Spot provides professional writing, academic research, and digital strategy services.')
ON CONFLICT (key) DO NOTHING;`}</pre>
          </div>
        </div>
      ) : (
        <div className="cms-layout">
          <nav className="cms-nav">
            {Object.entries(SECTIONS).map(([key, label]) => (
              <div key={key} className={`cms-nav-item${activeSection === key ? ' active' : ''}`} onClick={() => setActiveSection(key)}>
                {label}
              </div>
            ))}
          </nav>

          <div className="cms-panel">
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.1rem', color: '#111827', margin: '0 0 1.5rem' }}>{SECTIONS[activeSection]}</h2>
            {sectionRows.length === 0 ? (
              <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>No fields in this section yet. Run the SQL migration to populate them.</p>
            ) : (
              sectionRows.map(row => {
                const isLong = row.key.includes('body') || row.key.includes('subheadline') || row.key.includes('description') || row.key.includes('address')
                return (
                  <div key={row.key} className="cms-field">
                    <label>{row.label || row.key}</label>
                    {isLong ? (
                      <textarea
                        rows={3}
                        value={edits[row.key] ?? ''}
                        onChange={e => setEdits(prev => ({ ...prev, [row.key]: e.target.value }))}
                        placeholder={`Enter ${row.label || row.key}...`}
                      />
                    ) : (
                      <input
                        type="text"
                        value={edits[row.key] ?? ''}
                        onChange={e => setEdits(prev => ({ ...prev, [row.key]: e.target.value }))}
                        placeholder={`Enter ${row.label || row.key}...`}
                      />
                    )}
                    <div className="cms-hint">Key: <code>{row.key}</code></div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      )}
    </>
  )
}
