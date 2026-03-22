'use client'

import { useState } from 'react'

const services = [
  { icon: '&#128302;', title: 'Research and Academic Enquiry', desc: 'Dissertation support, literature reviews, data analysis and academic advisory for scholars and institutions worldwide.', badge: 'Academic' },
  { icon: '&#128640;', title: 'Digital Transformation and Automation', desc: 'End-to-end digital transformation roadmaps, process automation and modernisation for enterprises ready to scale.', badge: 'Enterprise' },
  { icon: '&#129489;&#8205;&#128187;', title: 'Ed-Tech Services', desc: 'LMS deployment, interactive content design and educational technology strategy for institutions and learners.', badge: 'Education' },
  { icon: '&#128230;', title: 'Product Management', desc: 'Product strategy, roadmap development and go-to-market support for teams building the next generation of products.', badge: 'Product' },
]

export default function RequestPage() {
  const [selected, setSelected] = useState<string | null>(null)
  const [showMsg, setShowMsg] = useState(false)

  function handleSelect(title: string) {
    setSelected(title)
    setShowMsg(true)
    setTimeout(() => setShowMsg(false), 4000)
  }

  return (
    <>
      <style>{`
        .request-heading { margin-bottom: 2rem; }
        .request-heading h2 { font-family: var(--font-serif); font-size: 1.5rem; color: var(--clr-text); margin-bottom: 0.35rem; }
        .request-heading p { color: var(--clr-text-muted); }
        .service-request-grid { display: grid; grid-template-columns: repeat(2,1fr); gap: 1.25rem; }
        .service-request-card {
          background: var(--clr-surface);
          border: 2px solid var(--clr-border);
          border-radius: var(--radius-lg);
          padding: 1.5rem;
          cursor: pointer;
          transition: all 0.2s;
        }
        .service-request-card:hover { border-color: var(--clr-primary-light); transform: translateY(-2px); box-shadow: var(--shadow-md); }
        .service-request-card.selected { border-color: var(--clr-primary); }
        .svc-req-icon { font-size: 2rem; margin-bottom: 0.75rem; }
        .svc-req-badge { display: inline-block; font-size: 0.68rem; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; padding: 2px 8px; border-radius: 100px; background: var(--clr-surface-2); color: var(--clr-primary-light); margin-bottom: 0.6rem; }
        .svc-req-title { font-family: var(--font-serif); font-size: 1.1rem; margin-bottom: 0.5rem; color: var(--clr-text); }
        .svc-req-desc { font-size: 0.85rem; color: var(--clr-text-muted); line-height: 1.6; }
        .phase2-banner { background: linear-gradient(135deg, var(--clr-surface-2), var(--clr-bg)); border: 1px solid var(--clr-border); border-radius: var(--radius-lg); padding: 1.5rem; text-align: center; margin-top: 1.5rem; }
        .phase2-banner h4 { font-family: var(--font-serif); font-size: 1.1rem; margin-bottom: 0.5rem; color: var(--clr-text); }
        .phase2-banner p { font-size: 0.875rem; color: var(--clr-text-muted); }
        @media (max-width: 600px) { .service-request-grid { grid-template-columns: 1fr; } }
      `}</style>

      <div className="request-heading">
        <h2>Request a Service</h2>
        <p>Select a service area below to begin your project request.</p>
      </div>

      {showMsg && selected && (
        <div style={{ background: 'rgba(27,67,50,0.08)', border: '1px solid var(--clr-primary-light)', borderRadius: 'var(--radius-md)', padding: '0.75rem 1rem', marginBottom: '1.25rem', fontSize: '0.9rem', color: 'var(--clr-primary)' }}>
          <strong>{selected}</strong> selected. Full service request form is coming in Phase 2.
        </div>
      )}

      <div className="service-request-grid">
        {services.map((s) => (
          <div
            key={s.title}
            className={`service-request-card${selected === s.title ? ' selected' : ''}`}
            onClick={() => handleSelect(s.title)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleSelect(s.title)}
          >
            <div className="svc-req-icon" dangerouslySetInnerHTML={{ __html: s.icon }} />
            <div className="svc-req-badge">{s.badge}</div>
            <div className="svc-req-title">{s.title}</div>
            <div className="svc-req-desc">{s.desc}</div>
          </div>
        ))}
      </div>

      <div className="phase2-banner">
        <h4>Full Service Request Forms Coming Soon</h4>
        <p>In Phase 2, you will be able to fill out a detailed brief, upload files and receive a quote directly through the portal. In the meantime, please <a href="/contact" style={{ color: 'var(--clr-primary-light)' }}>contact us</a> to get started.</p>
      </div>
    </>
  )
}
