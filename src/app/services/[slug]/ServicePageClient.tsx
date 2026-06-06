'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { ServiceData } from './page'

const slugTitles: Record<string, string> = {
  'ai-automation': 'AI Automation',
  'edtech': 'EdTech Services',
  'writing': 'Writing & Research',
  'product-management': 'Product & Project Management',
}

const slugIcons: Record<string, string> = {
  'ai-automation': '🤖',
  'edtech': '🎓',
  'writing': '📖',
  'product-management': '🚀',
}

export default function ServicePageClient({ slug, service }: { slug: string; service: ServiceData }) {
  const [activeFeature, setActiveFeature] = useState(0)

  return (
    <>
      <style>{`
        .svc-hero {
          background: var(--clr-bg);
          border-bottom: 1px solid var(--clr-border);
          padding: var(--space-3xl) 0 var(--space-2xl);
        }
        .svc-hero-inner { max-width: 760px; }
        .svc-badge {
          display: inline-flex; align-items: center;
          background: rgba(201,168,76,0.1); border: 1px solid rgba(201,168,76,0.25);
          padding: 0.35rem 1rem; border-radius: 100px;
          font-size: 0.72rem; font-weight: 700; letter-spacing: 0.07em; text-transform: uppercase;
          color: var(--clr-text-subtle);
          margin-bottom: 1.25rem;
        }
        .svc-hero h1 {
          font-size: clamp(2rem, 5vw, 3.4rem);
          font-weight: 800;
          letter-spacing: -0.03em;
          color: var(--clr-text);
          margin-bottom: 0.75rem;
          line-height: 1.1;
        }
        .svc-tagline { font-size: 1.1rem; color: var(--clr-text-muted); margin-bottom: 0.75rem; line-height: 1.7; }
        .svc-desc { font-size: 0.95rem; color: var(--clr-text-subtle); line-height: 1.8; margin-bottom: 2rem; max-width: 58ch; }
        .svc-btns { display: flex; gap: 1rem; flex-wrap: wrap; }
        .svc-personas { border-top: 1px solid var(--clr-border); padding: 1.25rem 0; margin-top: 2.5rem; display: flex; align-items: center; gap: 1rem; flex-wrap: wrap; }
        .svc-persona-lbl { font-size: 0.72rem; color: var(--clr-text-subtle); text-transform: uppercase; letter-spacing: 0.08em; font-weight: 600; }
        .svc-persona-tag { background: var(--clr-surface-2); border: 1px solid var(--clr-border); padding: 0.3rem 0.85rem; border-radius: 100px; font-size: 0.8rem; color: var(--clr-text-muted); }

        .feat-section { padding: 5rem 0; background: var(--clr-bg); }
        .feat-label { font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: var(--clr-text-subtle); margin-bottom: 0.5rem; display: block; }
        .feat-heading { font-size: clamp(1.6rem, 3vw, 2.2rem); font-weight: 800; letter-spacing: -0.02em; color: var(--clr-text); margin-bottom: 2.5rem; }
        .feat-grid { display: grid; grid-template-columns: 260px 1fr; gap: 2.5rem; align-items: start; }
        .feat-tab-list { display: flex; flex-direction: column; gap: 0.4rem; }
        .feat-btn { text-align: left; padding: 0.85rem 1.1rem; background: transparent; border: 1px solid var(--clr-border); border-radius: 10px; cursor: pointer; font-size: 0.88rem; font-weight: 500; color: var(--clr-text-muted); transition: all 0.2s; font-family: inherit; line-height: 1.4; }
        .feat-btn:hover { border-color: var(--clr-primary-light); color: var(--clr-text); }
        .feat-btn.active { background: var(--clr-primary); color: #fff; border-color: var(--clr-primary); font-weight: 600; }
        .feat-panel { background: var(--clr-surface); border: 1px solid var(--clr-border); border-radius: 16px; padding: 2.5rem; }
        .feat-panel h3 { font-size: 1.25rem; font-weight: 700; color: var(--clr-text); margin-bottom: 1rem; }
        .feat-panel p { color: var(--clr-text-muted); line-height: 1.8; }
        .feat-divider { margin-top: 1.75rem; padding-top: 1.5rem; border-top: 1px solid var(--clr-border); }

        .offerings-section { padding: 5rem 0; background: var(--clr-surface); }
        .offerings-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(230px, 1fr)); gap: 1.25rem; margin-top: 2.5rem; }
        .offering-card { background: var(--clr-bg); border: 1px solid var(--clr-border); border-radius: 14px; padding: 1.75rem; }
        .offering-num {
          font-family: 'Playfair Display', Georgia, serif;
          font-style: italic;
          font-size: 1.2rem;
          color: var(--clr-accent);
          margin-bottom: 0.75rem;
          line-height: 1;
        }
        .offering-name { font-size: 1rem; font-weight: 700; color: var(--clr-text); margin-bottom: 0.5rem; }
        .offering-desc { font-size: 0.85rem; color: var(--clr-text-muted); line-height: 1.7; }

        .svc-cta { background: var(--clr-primary); padding: 5rem 0; text-align: center; }
        .svc-cta h2 { font-size: clamp(1.8rem, 3.5vw, 2.5rem); font-weight: 800; letter-spacing: -0.03em; color: #fff; margin-bottom: 1rem; }
        .svc-cta p { color: rgba(255,255,255,0.7); max-width: 560px; margin: 0 auto 2rem; line-height: 1.7; }
        .svc-cta-btns { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }
        .btn-ghost-white { background: rgba(255,255,255,0.12); color: #fff; border: 1px solid rgba(255,255,255,0.3); border-radius: 8px; padding: 0.75rem 1.5rem; font-weight: 600; cursor: pointer; font-size: 0.95rem; text-decoration: none; display: inline-flex; align-items: center; transition: background 0.2s; }
        .btn-ghost-white:hover { background: rgba(255,255,255,0.22); }

        .related-section { padding: 4rem 0; background: var(--clr-bg); }
        .related-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-top: 1.75rem; }
        .related-card { display: flex; align-items: center; justify-content: space-between; padding: 1rem 1.25rem; background: var(--clr-surface); border: 1px solid var(--clr-border); border-radius: 10px; text-decoration: none; color: var(--clr-text); font-weight: 500; font-size: 0.9rem; transition: border-color 0.2s; }
        .related-card:hover { border-color: var(--clr-primary-light); }

        @media (max-width: 768px) {
          .feat-grid { grid-template-columns: 1fr; }
          .feat-tab-list { flex-direction: row; flex-wrap: wrap; }
          .feat-btn { flex: 1; min-width: 130px; text-align: center; }
          .svc-hero { padding: var(--space-2xl) 0; }
        }
      `}</style>

      {/* HERO */}
      <section className="svc-hero">
        <div className="container">
          <div className="svc-hero-inner">
            <p className="eyebrow">Our Services</p>
            <div className="svc-badge">Ryters Spot · {service.title}</div>
            <h1>{service.title}</h1>
            <p className="svc-tagline">{service.tagline}</p>
            <p className="svc-desc">{service.description}</p>
            <div className="svc-btns">
              <a href="https://wa.me/2347062057116" target="_blank" rel="noopener noreferrer" className="btn btn-accent btn-lg">Hire Us</a>
              <Link href="/services" className="btn btn-outline">All Services</Link>
            </div>
          </div>
          <div className="svc-personas">
            <span className="svc-persona-lbl">Who this is for:</span>
            {service.personas.map(p => <span key={p} className="svc-persona-tag">{p}</span>)}
          </div>
        </div>
      </section>

      {/* FEATURES (tabbed) */}
      <section className="feat-section">
        <div className="container">
          <span className="feat-label">What We Deliver</span>
          <h2 className="feat-heading">Our {service.title} Capabilities</h2>
          <div className="feat-grid">
            <div className="feat-tab-list">
              {service.features.map((f, i) => (
                <button key={i} className={`feat-btn${activeFeature === i ? ' active' : ''}`} onClick={() => setActiveFeature(i)}>
                  {f.title}
                </button>
              ))}
            </div>
            <div className="feat-panel">
              <h3>{service.features[activeFeature].title}</h3>
              <p>{service.features[activeFeature].desc}</p>
              <div className="feat-divider">
                <Link href="/contact" className="btn btn-primary btn-sm">Enquire About This →</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* OFFERINGS */}
      <section className="offerings-section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
            <span className="feat-label">How We Engage</span>
            <h2 className="feat-heading" style={{ margin: '0 auto' }}>Service Packages</h2>
            <p style={{ color: 'var(--clr-text-muted)', maxWidth: '520px', margin: '0.75rem auto 0' }}>
              Flexible engagement models to suit your organisation&apos;s needs, timeline and budget.
            </p>
          </div>
          <div className="offerings-grid">
            {service.offerings.map((o, i) => (
              <div key={i} className="offering-card">
                <div className="offering-num">0{i + 1}.</div>
                <div className="offering-name">{o.name}</div>
                <div className="offering-desc">{o.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="svc-cta">
        <div className="container">
          <h2>{service.ctaLabel}</h2>
          <p>Talk to one of our specialists. We will assess your needs and recommend the right approach for your organisation — no obligation.</p>
          <div className="svc-cta-btns">
            <a href="https://wa.me/2347062057116" target="_blank" rel="noopener noreferrer" className="btn btn-accent btn-lg">Hire Us</a>
            <Link href="/contact" className="btn-ghost-white">Talk to Us</Link>
          </div>
        </div>
      </section>

      {/* RELATED */}
      <section className="related-section">
        <div className="container">
          <h3 style={{ fontFamily: 'var(--font-heading, DM Sans, sans-serif)', color: 'var(--clr-text)', marginBottom: '0.25rem' }}>Explore Related Services</h3>
          <p style={{ color: 'var(--clr-text-muted)', fontSize: '0.9rem' }}>Many clients combine services for greater impact.</p>
          <div className="related-grid">
            {service.relatedSlugs.map(s => (
              <Link key={s} href={`/services/${s}`} className="related-card">
                <span>{slugTitles[s]}</span>
                <span style={{ color: 'var(--clr-primary)' }}>→</span>
              </Link>
            ))}
            <Link href="/services" className="related-card">
              <span>All Services</span>
              <span style={{ color: 'var(--clr-primary)' }}>→</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
