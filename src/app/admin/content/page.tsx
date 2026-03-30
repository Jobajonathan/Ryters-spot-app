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
  stats: 'Homepage Stats',
  trust_bar: 'Trust Bar',
  cta_banner: 'CTA Banner',
  footer: 'Footer',
  contact: 'Contact Details',
  social: 'Social Media Links',
  seo: 'SEO & Analytics',
}

const HINTS: Record<string, string> = {
  hero_headline: 'Main heading shown in the homepage hero section',
  hero_subheadline: 'Paragraph text below the main heading',
  hero_cta1_text: 'Primary green button text in the hero',
  hero_cta2_text: 'Secondary button text in the hero',
  trust_bar_label: 'Text above the trust logos bar',
  stat1_count: 'Number shown in stat 1 (e.g. 500)',
  stat1_suffix: 'Symbol after the number (e.g. +)',
  stat1_label: 'Label below the number (e.g. Projects Delivered)',
  stat2_count: 'Number shown in stat 2',
  stat2_suffix: 'Symbol after stat 2 number',
  stat2_label: 'Label for stat 2',
  stat3_count: 'Number shown in stat 3',
  stat3_suffix: 'Symbol after stat 3 number',
  stat3_label: 'Label for stat 3',
  stat4_count: 'Number shown in stat 4',
  stat4_suffix: 'Symbol after stat 4 number',
  stat4_label: 'Label for stat 4',
  cta_banner_heading: 'Big heading in the green call-to-action banner',
  cta_banner_subtext: 'Paragraph text under the CTA banner heading',
  cta_banner_cta1_text: 'Primary button text in the CTA banner',
  footer_tagline: 'Tagline shown below "Ryters Spot" in the footer',
  contact_email: 'Primary contact email address',
  contact_phone: 'Primary phone/WhatsApp number',
  contact_address: 'Office location shown on contact page and footer',
  contact_whatsapp: 'WhatsApp number with country code (no + or spaces)',
  social_linkedin: 'Full LinkedIn profile URL (https://linkedin.com/company/...)',
  social_twitter: 'Full Twitter/X URL (https://x.com/...)',
  social_facebook: 'Full Facebook page URL',
  social_instagram: 'Full Instagram URL',
  social_youtube: 'Full YouTube channel URL',
  seo_title: 'Page title shown in Google search results (50-60 characters)',
  seo_description: 'Description shown in Google search results (150-160 characters)',
  seo_keywords: 'Comma-separated keywords for search engines',
  seo_og_image: 'Full URL of image shown when the site is shared on social media (1200x630px recommended)',
  ga4_measurement_id: 'Google Analytics 4 ID starting with G- (e.g. G-ABC12345XY). Get this from analytics.google.com',
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
          <div style={{ background: '#1a1a2e', color: '#a8ff78', padding: '1.25rem', borderRadius: 10, textAlign: 'left', fontSize: '0.78rem', fontFamily: 'monospace', maxWidth: 780, margin: '0 auto', overflowX: 'auto' }}>
            <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{`-- Run in Supabase SQL editor
INSERT INTO site_content (key, label, section, value) VALUES
  -- Hero
  ('hero_headline','Hero Headline','hero','Your Strategic Consultancy Partner'),
  ('hero_subheadline','Hero Sub-headline','hero','Ryters Spot delivers AI automation, EdTech, writing & research, and product management consultancy to organisations across the UK, Europe, North America and Africa.'),
  ('hero_cta1_text','Hero CTA 1 Text','hero','Get Started'),
  ('hero_cta2_text','Hero CTA 2 Text','hero','Book a Consultation'),
  -- Stats
  ('stat1_count','Stat 1 Count','stats','500'),
  ('stat1_suffix','Stat 1 Suffix','stats','+'),
  ('stat1_label','Stat 1 Label','stats','Projects Delivered'),
  ('stat2_count','Stat 2 Count','stats','200'),
  ('stat2_suffix','Stat 2 Suffix','stats','+'),
  ('stat2_label','Stat 2 Label','stats','Clients Served'),
  ('stat3_count','Stat 3 Count','stats','98'),
  ('stat3_suffix','Stat 3 Suffix','stats','%'),
  ('stat3_label','Stat 3 Label','stats','Client Satisfaction'),
  ('stat4_count','Stat 4 Count','stats','7'),
  ('stat4_suffix','Stat 4 Suffix','stats','+'),
  ('stat4_label','Stat 4 Label','stats','Years of Excellence'),
  -- Trust Bar
  ('trust_bar_label','Trust Bar Label','trust_bar','Trusted by organisations & institutions across the UK, Europe, North America and Africa'),
  -- CTA Banner
  ('cta_banner_heading','CTA Banner Heading','cta_banner','Ready to Transform Your Organisation?'),
  ('cta_banner_subtext','CTA Banner Subtext','cta_banner','Whether you need AI automation, EdTech solutions, writing & research support, or expert product management — Ryters Spot is your strategic partner.'),
  ('cta_banner_cta1_text','CTA Banner Button Text','cta_banner','Get Started Free'),
  -- Footer
  ('footer_tagline','Footer Tagline','footer','Specialist research, technology and advisory services for organisations and scholars worldwide.'),
  -- Contact
  ('contact_email','Contact Email','contact','hello@theryters.com'),
  ('contact_phone','Contact Phone','contact','+234 706 205 7116'),
  ('contact_address','Office Address','contact','Abuja, Nigeria'),
  ('contact_whatsapp','WhatsApp Number','contact','2347062057116'),
  -- Social
  ('social_linkedin','LinkedIn URL','social',''),
  ('social_twitter','Twitter / X URL','social',''),
  ('social_facebook','Facebook URL','social',''),
  ('social_instagram','Instagram URL','social',''),
  ('social_youtube','YouTube URL','social',''),
  -- SEO
  ('seo_title','Site Title','seo','Ryters Spot — Research, Writing & Digital Consultancy'),
  ('seo_description','Meta Description','seo','Ryters Spot delivers specialist writing, research, digital transformation and EdTech consultancy to organisations across Africa, the UK, Europe and North America.'),
  ('seo_keywords','Meta Keywords','seo','academic writing, dissertation help, digital transformation, edtech, Nigeria, UK, Africa'),
  ('seo_og_image','OG Image URL','seo',''),
  ('ga4_measurement_id','GA4 Measurement ID','seo','')
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
                const isLong = ['body', 'subheadline', 'description', 'address', 'subtext', 'keywords', 'tagline', 'sub', 'label', 'text'].some(k => row.key.includes(k))
                const hint = HINTS[row.key]
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
                    {hint && <div className="cms-hint">{hint}</div>}
                    <div className="cms-hint" style={{ marginTop: hint ? '0.1rem' : '0.3rem' }}>Key: <code>{row.key}</code></div>
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
