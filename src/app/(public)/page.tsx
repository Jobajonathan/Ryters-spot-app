'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useScrollReveal, useCounterAnimation } from '@/hooks/useScrollReveal'

const services = [
  { slug: 'ai-automation', icon: '🤖', badge: 'Enterprise & SMEs', title: 'AI Automation', desc: 'Transform your operations with intelligent automation — from AI strategy to enterprise-scale workflow integration.', bullets: ['AI strategy and roadmapping', 'Workflow automation and integration', 'LLM deployment and enablement'] },
  { slug: 'edtech', icon: '🎓', badge: 'Institutions', title: 'EdTech Services', desc: 'Next-generation educational technology for institutions delivering learning at scale.', bullets: ['LMS design and deployment', 'Interactive content development', 'eLearning platform strategy'] },
  { slug: 'writing', icon: '📖', badge: 'Academic & Business', title: 'Writing & Research', desc: 'Expert academic writing, research support and content strategy for scholars and organisations worldwide.', bullets: ['Dissertation and thesis support', 'Content strategy and creation', 'Data analysis and interpretation'] },
  { slug: 'product-management', icon: '🚀', badge: 'Product & Project Teams', title: 'Product & Project Management', desc: 'From ideation to delivery — building products and projects that generate measurable results.', bullets: ['Product strategy and roadmapping', 'Agile delivery and PMO', 'Go-to-market planning'] },
]

const whyItems = [
  { label: 'Expert Team', heading: 'Specialists Across Every Domain', text: 'Our consultants bring deep expertise across AI automation, EdTech, academic research and product management — the right knowledge for every challenge, without the overhead of multiple agencies.' },
  { label: 'Proven Results', heading: '500+ Projects Delivered', text: 'Over 500 projects delivered across the UK, Europe and North America. A consistent track record of measurable, strategic results that move organisations forward.' },
  { label: 'Global Reach', heading: 'Serving Clients Worldwide', text: 'From London to Lagos, Toronto to Dubai — our team works across time zones to deliver high-quality consultancy on your schedule, wherever you are.' },
  { label: 'One Partner', heading: 'Strategy Through to Delivery', text: 'From initial scoping through execution and beyond. No handoffs, no gaps — one integrated team accountable for the full outcome.' },
]

export default function HomePage() {
  useScrollReveal()
  useCounterAnimation()
  const [activeWhy, setActiveWhy] = useState(0)

  return (
    <>
      <style>{`
        /* ── Hero: compact, viewport-height, centred ── */
        .hero-centred { padding: 2.5rem 0 3.5rem; text-align: center; }
        .hero-centred .hero-content { max-width: 680px; margin: 0 auto; }
        .hero-centred h1 { margin-bottom: 1.25rem; }
        .hero-centred .hero-sub { max-width: 540px; margin: 0 auto 2.25rem; font-size: 1.05rem; }
        .hero-centred .hero-ctas { justify-content: center; margin-bottom: 2rem; }
        .hero-personas-row { display: flex; flex-wrap: wrap; gap: 0.6rem; justify-content: center; align-items: center; margin-top: 0.5rem; }
        .hero-find-lbl { font-size: 0.75rem; color: rgba(255,255,255,0.45); text-transform: uppercase; letter-spacing: 0.08em; font-weight: 600; width: 100%; }

        /* ── Why tabs ── */
        .why-grid { display: grid; grid-template-columns: 1fr 1.4fr; gap: 3rem; align-items: center; }
        .why-tab-list { display: flex; flex-direction: column; gap: 0.4rem; }
        .why-btn { text-align: left; padding: 0.85rem 1.1rem; background: transparent; border: 1px solid var(--clr-border); border-radius: 10px; cursor: pointer; font-size: 0.9rem; font-weight: 500; color: var(--clr-text-muted); transition: all 0.2s; font-family: inherit; }
        .why-btn:hover { border-color: var(--clr-primary-light); color: var(--clr-text); }
        .why-btn.active { background: var(--clr-primary); color: #fff; border-color: var(--clr-primary); font-weight: 600; }
        .why-panel { background: var(--clr-surface); border: 1px solid var(--clr-border); border-radius: 16px; padding: 2.5rem; }
        .why-panel h3 { font-family: var(--font-serif); font-size: 1.35rem; color: var(--clr-text); margin-bottom: 1rem; }
        .why-panel p { color: var(--clr-text-muted); line-height: 1.8; }

        @media (max-width: 900px) {
          .hero-centred { padding: 3rem 0 2.5rem; }
          .why-grid { grid-template-columns: 1fr; gap: 1.5rem; }
          .why-tab-list { flex-direction: row; flex-wrap: wrap; }
          .why-btn { flex: 1; min-width: 110px; text-align: center; font-size: 0.82rem; padding: 0.6rem 0.75rem; }
        }
      `}</style>

      {/* ── HERO: short, centered, fits in viewport ── */}
      <section className="hero" aria-label="Welcome to Ryters Spot">
        <div className="container hero-centred">
          <div className="hero-content fade-up">
            <h1 style={{ marginBottom: '1.25rem' }}>Your <span>Strategic</span><br />Consultancy Partner</h1>

            <p className="hero-sub">
              Ryters Spot delivers AI automation, EdTech, writing &amp; research, and product management consultancy to organisations across the UK, Europe, North America and Africa.
            </p>

            <div className="hero-ctas">
              <Link href="/get-started" className="btn btn-accent btn-lg">Get Started</Link>
              <Link href="/contact" className="btn btn-lg" style={{ background: 'rgba(255,255,255,0.12)', color: '#fff', borderColor: 'rgba(255,255,255,0.3)' }}>Book a Consultation</Link>
            </div>

            <div className="hero-personas-row">
              <span className="hero-find-lbl">Find your solution:</span>
              <Link href="/services/ai-automation" className="hero-persona-btn">🤖 AI Automation</Link>
              <Link href="/services/edtech" className="hero-persona-btn">🎓 EdTech</Link>
              <Link href="/services/writing" className="hero-persona-btn">📖 Writing &amp; Research</Link>
              <Link href="/services/product-management" className="hero-persona-btn">🚀 Product Management</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUST BAR ── */}
      <div className="trust-bar">
        <div className="container">
          <p className="trust-bar-label">Trusted by organisations &amp; institutions across the UK, Europe, North America and Africa</p>
          <div className="trust-logos">
            {['Enterprise Partners', 'Academic Institutions', 'Government Agencies', 'SMEs & Startups', 'NGOs', 'Research Bodies'].map(t => (
              <span key={t} className="trust-logo">{t}</span>
            ))}
          </div>
        </div>
      </div>

      {/* ── SERVICES ── */}
      <section className="section" aria-labelledby="services-heading">
        <div className="container">
          <div className="text-center">
            <span className="section-label">What We Do</span>
            <h2 className="section-heading reveal" id="services-heading">Specialist Consultancy Across Four Disciplines</h2>
            <p className="section-sub reveal" style={{ marginInline: 'auto' }}>One integrated team. Deep expertise across every area.</p>
          </div>
          <div className="services-grid services-grid--featured">
            {services.map((s, i) => (
              <article key={s.slug} className={`service-card service-card--featured reveal${i > 0 ? ` fade-up-delay-${i}` : ''}`}>
                <div className="service-card-top">
                  <div className="service-icon">{s.icon}</div>
                  <span className="service-badge">{s.badge}</span>
                </div>
                <h3 className="service-title">{s.title}</h3>
                <p className="service-desc">{s.desc}</p>
                <ul className="service-checklist">
                  {s.bullets.map(b => <li key={b}>{b}</li>)}
                </ul>
                <Link href={`/services/${s.slug}`} className="btn btn-primary btn-sm" style={{ marginTop: 'auto' }}>Learn More →</Link>
              </article>
            ))}
          </div>
          <div className="text-center" style={{ marginTop: '2.5rem' }}>
            <Link href="/services" className="btn btn-outline">View All Services</Link>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="section section-alt" aria-labelledby="stats-heading">
        <div className="container">
          <div className="stats-grid">
            {[
              { count: 500, suffix: '+', label: 'Projects Delivered' },
              { count: 200, suffix: '+', label: 'Clients Served' },
              { count: 98, suffix: '%', label: 'Client Satisfaction' },
              { count: 7, suffix: '+', label: 'Years of Excellence' },
            ].map((s, i) => (
              <div key={s.label} className={`stat-item reveal${i > 0 ? ` fade-up-delay-${i}` : ''}`}>
                <span className="stat-num" data-count={s.count} data-suffix={s.suffix}>0{s.suffix}</span>
                <span className="stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY RYTERS SPOT (tabbed) ── */}
      <section className="section" aria-labelledby="why-heading">
        <div className="container">
          <div style={{ marginBottom: '2.5rem' }}>
            <span className="section-label">Why Choose Us</span>
            <h2 className="section-heading reveal" id="why-heading">Built for Organisations That Demand Excellence</h2>
          </div>
          <div className="why-grid">
            <div className="why-tab-list">
              {whyItems.map((item, i) => (
                <button key={i} className={`why-btn${activeWhy === i ? ' active' : ''}`} onClick={() => setActiveWhy(i)}>
                  {item.label}
                </button>
              ))}
            </div>
            <div className="why-panel">
              <h3>{whyItems[activeWhy].heading}</h3>
              <p>{whyItems[activeWhy].text}</p>
              <div style={{ marginTop: '1.75rem', paddingTop: '1.5rem', borderTop: '1px solid var(--clr-border)' }}>
                <Link href="/about" className="btn btn-primary btn-sm">About Ryters Spot →</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="cta-banner" aria-label="Call to action">
        <div className="container">
          <h2 className="reveal">Ready to Transform Your Organisation?</h2>
          <p className="reveal">Whether you need AI automation, EdTech solutions, writing &amp; research support, or expert product management — Ryters Spot is your strategic partner.</p>
          <div className="cta-banner-btns reveal">
            <Link href="/get-started" className="btn btn-accent btn-lg">Get Started Free</Link>
            <Link href="/services" className="btn btn-white btn-lg">Browse Services</Link>
          </div>
        </div>
      </section>
    </>
  )
}
