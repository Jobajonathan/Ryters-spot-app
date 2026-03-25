'use client'

export default function ContentPage() {
  return (
    <>
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '1.5rem', fontWeight: 700, color: '#111827', margin: '0 0 0.25rem' }}>Website Content</h1>
        <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0 }}>Edit homepage text, testimonials, social links, and site settings.</p>
      </div>
      <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: '4rem 2rem', textAlign: 'center' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🖋️</div>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.25rem', color: '#111827', margin: '0 0 0.5rem' }}>Content Management — Coming Soon</h2>
        <p style={{ color: '#6b7280', fontSize: '0.875rem', maxWidth: 440, margin: '0 auto 1.5rem' }}>
          Edit hero text, testimonials, about section, social media links, and other website copy — all without touching the code.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          {['Homepage Hero', 'Testimonials', 'About Section', 'Social Media Links', 'Contact Details', 'SEO Settings'].map(f => (
            <span key={f} style={{ padding: '0.4rem 0.85rem', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '100px', fontSize: '0.78rem', color: '#6b7280', fontWeight: 500 }}>{f}</span>
          ))}
        </div>
      </div>
    </>
  )
}
