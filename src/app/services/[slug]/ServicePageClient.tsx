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
          background: linear-gradient(135deg, #1B4332 0%, #2D6A4F 60%, #40916C 100%);
          padding: 5rem 0 0; color: #fff;
        }
        .svc-hero-inner { max-width: 760px; }
        .svc-badge {
          display: inline-flex; align-items: center; gap: 0.5rem;
          background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.2);
          padding: 0.4rem 1rem; border-radius: 100px;
          font-size: 0.82rem; font-weight: 600; color: rgba(255,255,255,0.9);
          margin-bottom: 1.5rem;
        }
        .svc-hero h1 { font-family: 'Playfair Display', Georgia, serif; font-size: clamp(2rem, 4vw, 3rem); font-weight: 700; color: #fff; margin-bottom: 0.75rem; line-height: 1.2; }
        .svc-tagline { font-size: 1.15rem; color: rgba(255,255,255,0.75); margin-bottom: 1rem; line-height: 1.6; }
        .svc-desc { font-size: 1rem; color: rgba(255,255,255,0.6); line-height: 1.8; margin-bottom: 2rem; }
        .svc-btns { display: flex; gap: 1rem; flex-wrap: wrap; }
        .btn-ghost-white { background: rgba(255,255,255,0.12); color: #fff; border: 1px solid rgba(255,255,255,0.3); border-radius: 8px; padding: 0.75rem 1.5rem; font-weight: 600; cursor: pointer; font-size: 0.95rem; text-decoration: none; display: inline-flex; align-items: center; transition: background 0.2s; }
        .btn-ghost-white:hover { background: rgba(255,255,255,0.22); }
        .svc-personas { border-top: 1px solid rgba(255,255,255,0.1); padding: 1.25rem 0; margin-top: 2.5rem; display: flex; align-items: center; gap: 1rem; flex-wrap: wrap; }
        .svc-persona-lbl { font-size: 0.75rem; color: rgba(255,255,255,0.45); text-transform: uppercase; letter-spacing: 0.08em; font-weight: 600; }
        .svc-persona-tag { background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.15); padding: 0.3rem 0.85rem; border-radius: 100px; font-size: 0.82rem; color: rgba(255,255,255,0.8); }

        .feat-section { padding: 5rem 0; background: var(--clr-bg); }
        .feat-label { font-size: 0.78rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: var(--clr-primary-light, #40916C); margin-bottom: 0.5rem; display: block; }
        .feat-heading { font-family: 'Playfair Display', Georgia, serif; font-size: clamp(1.6rem, 3vw, 2.2rem); color: var(--clr-text); margin-bottom: 2.5rem; }
        .feat-grid { display: grid; grid-template-columns: 260px 1fr; gap: 2.5rem; align-items: start; }
        .feat-tab-list { display: flex; flex-direction: column; gap: 0.4rem; }
        .feat-btn { text-align: left; padding: 0.85rem 1.1rem; background: transparent; border: 1px solid var(--clr-border, #E8EAED); border-radius: 10px; cursor: pointer; font-size: 0.88rem; font-weight: 500; color: var(--clr-text-muted); transition: all 0.2s; font-family: inherit; line-height: 1.4; }
        .feat-btn:hover { border-color: #40916C; color: var(--clr-text); }
        .feat-btn.active { background: #1B4332; color: #fff; border-color: #1B4332; font-weight: 600; }
        .feat-panel { background: var(--clr-surface, #fff); border: 1px solid var(--clr-border, #E8EAED); border-radius: 16px; padding: 2.5rem; }
        .feat-panel h3 { font-family: 'Playfair Display', Georgia, serif; font-size: 1.35rem; color: var(--clr-text); margin-bottom: 1rem; }
        .feat-panel p { color: var(--clr-text-muted); line-height: 1.8; }
        .feat-divider { margin-top: 1.75rem; padding-top: 1.5rem; border-top: 1px solid var(--clr-border, #E8EAED); }

        .offerings-section { padding: 5rem 0; background: var(--clr-surface, #fff); }
        .offerings-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(230px, 1fr)); gap: 1.25rem; margin-top: 2.5rem; }
        .offering-card { background: var(--clr-bg, #FAFAFA); border: 1px solid var(--clr-border, #E8EAED); border-radius: 14px; padding: 1.75rem; }
        .offering-num { font-size: 0.7rem; font-weight: 700; color: #40916C; text-transform: uppercase; letter-spacing: 0.12em; margin-bottom: 0.75rem; }
        .offering-name { font-family: 'Playfair Display', Georgia, serif; font-size: 1rem; font-weight: 700; color: var(--clr-text); margin-bottom: 0.5rem; }
        .offering-desc { font-size: 0.85rem; color: var(--clr-text-muted); line-height: 1.7; }

        .svc-cta { background: linear-gradient(135deg, #1B4332 0%, #2D6A4F 100%); padding: 5rem 0; text-align: center; color: #fff; }
        .svc-cta h2 { font-family: 'Playfair Display', Georgia, serif; font-size: clamp(1.8rem, 3.5vw, 2.5rem); color: #fff; margin-bottom: 1rem; }
        .svc-cta p { color: rgba(255,255,255,0.7); max-width: 560px; margin: 0 auto 2rem; line-height: 1.7; }
        .svc-cta-btns { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }

        .related-section { padding: 4rem 0; background: var(--clr-bg); }
        .related-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-top: 1.75rem; }
        .related-card { display: flex; align-items: center; gap: 0.75rem; padding: 1rem 1.25rem; background: var(--clr-surface, #fff); border: 1px solid var(--clr-border, #E8EAED); border-radius: 10px; text-decoration: none; color: var(--clr-text); font-weight: 500; font-size: 0.9rem; transition: border-color 0.2s; }
        .related-card:hover { border-color: #40916C; }

        @media (max-width: 768px) {
          .feat-grid { grid-template-columns: 1fr; }
          .feat-tab-list { flex-direction: row; flex-wrap: wrap; }
          .feat-btn { flex: 1; min-width: 130px; text-align: center; }
          .svc-hero { padding: 3rem 0 0; }
        }
      `}</style>

      {/* HERO */}
      <section className="svc-hero">
        <div className="container">
          <div className="svc-hero-inner">
            <div className="svc-badge">
              <span>{service.icon}</span>
              <span>Ryters Spot · {service.title}</span>
            </div>
            <h1>{service.title}</h1>
            <p className="svc-tagline">{service.tagline}</p>
            <p className="svc-desc">{service.description}</p>
            <div className="svc-btns">
              <Link href="/signup" className="btn btn-accent btn-lg">{service.ctaLabel}</Link>
              <Link href="/services" className="btn-ghost-white">All Services</Link>
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
                <Link href="/signup" className="btn btn-primary btn-sm">Enquire About This →</Link>
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
                <div className="offering-num">Option {String(i + 1).padStart(2, '0')}</div>
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
            <Link href="/signup" className="btn btn-accent btn-lg">Create a Free Account</Link>
            <Link href="/contact" className="btn-ghost-white">Talk to an Expert</Link>
          </div>
        </div>
      </section>

      {/* RELATED */}
      <section className="related-section">
        <div className="container">
          <h3 style={{ fontFamily: 'Playfair Display, Georgia, serif', color: 'var(--clr-text)', marginBottom: '0.25rem' }}>Explore Related Services</h3>
          <p style={{ color: 'var(--clr-text-muted)', fontSize: '0.9rem' }}>Many clients combine services for greater impact.</p>
          <div className="related-grid">
            {service.relatedSlugs.map(s => (
              <Link key={s} href={`/services/${s}`} className="related-card">
                <span style={{ fontSize: '1.2rem' }}>{slugIcons[s]}</span>
                <span>{slugTitles[s]}</span>
                <span style={{ marginLeft: 'auto', color: '#40916C' }}>→</span>
              </Link>
            ))}
            <Link href="/services" className="related-card">
              <span style={{ fontSize: '1.2rem' }}>🗂️</span>
              <span>All Services</span>
              <span style={{ marginLeft: 'auto', color: '#40916C' }}>→</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
