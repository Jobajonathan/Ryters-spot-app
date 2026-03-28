'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useScrollReveal, useCounterAnimation } from '@/hooks/useScrollReveal'

const services = [
  {
    slug: 'ai-automation',
    icon: '🤖',
    badge: 'Enterprise & SMEs',
    title: 'AI Automation',
    desc: 'Transform your operations with intelligent automation. From AI strategy to enterprise-scale workflow integration and deployment.',
    bullets: ['AI strategy and roadmapping', 'Workflow automation and integration', 'LLM deployment and enablement'],
  },
  {
    slug: 'edtech',
    icon: '🎓',
    badge: 'Institutions',
    title: 'EdTech Services',
    desc: 'Next-generation educational technology for institutions and organisations delivering learning at scale globally.',
    bullets: ['LMS design and deployment', 'Interactive content development', 'eLearning platform strategy'],
  },
  {
    slug: 'writing',
    icon: '📖',
    badge: 'Academic & Business',
    title: 'Writing & Research',
    desc: 'Expert academic writing, research support and content strategy for scholars, researchers and organisations worldwide.',
    bullets: ['Dissertation and thesis support', 'Content strategy and creation', 'Data analysis and interpretation'],
  },
  {
    slug: 'product-management',
    icon: '🚀',
    badge: 'Product & Project Teams',
    title: 'Product & Project Management',
    desc: 'From ideation to delivery — we help you build, position and ship products and projects that generate measurable results.',
    bullets: ['Product strategy and roadmapping', 'Agile delivery and PMO', 'Go-to-market planning'],
  },
]

const whyItems = [
  {
    label: 'Expert Team',
    heading: 'Specialists Across Every Domain',
    text: 'Our consultants bring deep expertise across AI automation, EdTech, academic research and product management — giving you the right expertise for every challenge without the overhead of multiple agencies.',
  },
  {
    label: 'Proven Results',
    heading: '500+ Projects Delivered',
    text: 'Over 500 projects delivered across the UK, Europe and North America. We have a consistent track record of producing measurable, strategic results that move organisations forward.',
  },
  {
    label: 'Global Reach',
    heading: 'Serving Clients Worldwide',
    text: 'From London to Lagos, Toronto to Dubai — our distributed team works across time zones to deliver high-quality consultancy on your schedule, wherever you are in the world.',
  },
  {
    label: 'One Partner',
    heading: 'Strategy Through to Delivery',
    text: 'We work with you from initial scoping through execution and beyond. No handoffs, no gaps — one integrated team accountable for the full outcome.',
  },
]

export default function HomePage() {
  useScrollReveal()
  useCounterAnimation()
  const [activeWhy, setActiveWhy] = useState(0)

  return (
    <>
      <style>{`
        .why-tabs { display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; align-items: center; margin-top: 1rem; }
        .why-tab-buttons { display: flex; flex-direction: column; gap: 0.5rem; }
        .why-tab-btn {
          text-align: left; padding: 0.9rem 1.25rem;
          background: transparent; border: 1px solid var(--clr-border);
          border-radius: var(--radius-md); cursor: pointer; font-size: 0.95rem;
          font-weight: 500; color: var(--clr-text-muted);
          transition: all 0.2s; font-family: inherit;
        }
        .why-tab-btn:hover { border-color: var(--clr-primary-light); color: var(--clr-text); }
        .why-tab-btn.active {
          background: var(--clr-primary); color: #fff;
          border-color: var(--clr-primary); font-weight: 600;
        }
        .why-tab-content { padding: 2rem; background: var(--clr-bg-alt); border-radius: var(--radius-lg); }
        .why-tab-content h3 { font-family: var(--font-serif); font-size: 1.5rem; color: var(--clr-text); margin-bottom: 1rem; }
        .why-tab-content p { color: var(--clr-text-muted); line-height: 1.8; font-size: 1rem; }
        @media (max-width: 768px) {
          .why-tabs { grid-template-columns: 1fr; gap: 1.5rem; }
          .why-tab-buttons { flex-direction: row; flex-wrap: wrap; }
          .why-tab-btn { flex: 1; min-width: 120px; text-align: center; font-size: 0.85rem; padding: 0.65rem 0.85rem; }
        }
      `}</style>

      {/* ── HERO ── */}
      <section className="hero" aria-label="Welcome to Ryters Spot">
        <div className="container">
          <div className="hero-inner">

            <div className="hero-content fade-up">
              <div className="hero-label">
                <span className="hero-label-dot"></span>
                Consultancy · AI Automation · EdTech · Writing · Product Management
              </div>

              <h1>Your <span>Strategic</span> Partner<br />for What Comes Next</h1>

              <p className="hero-sub">
                Ryters Spot is a specialist consultancy delivering AI automation, EdTech, writing &amp; research, and product management services to organisations and institutions across the UK, Europe, North America and Africa.
              </p>

              <div className="hero-ctas">
                <Link href="/services" className="btn btn-accent btn-lg">Explore Our Services</Link>
                <Link href="/contact" className="btn btn-lg" style={{ background: 'rgba(255,255,255,0.12)', color: '#fff', borderColor: 'rgba(255,255,255,0.3)' }}>Book a Consultation</Link>
              </div>

              <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.6)', marginBottom: '0.75rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>I am looking for:</p>
              <div className="hero-personas">
                <Link href="/services/ai-automation" className="hero-persona-btn">🤖 AI Automation</Link>
                <Link href="/services/edtech" className="hero-persona-btn">🎓 EdTech Solutions</Link>
                <Link href="/services/writing" className="hero-persona-btn">📖 Writing &amp; Research</Link>
                <Link href="/services/product-management" className="hero-persona-btn">🚀 Product Management</Link>
              </div>
            </div>

            <div className="hero-visual fade-up fade-up-delay-2">
              <div className="hero-card">
                <div className="hero-card-header">
                  <div className="hero-card-icon">🤖</div>
                  <div>
                    <p className="hero-card-title">AI Automation Consultancy</p>
                    <p className="hero-card-sub">Strategy · Integration · Deployment</p>
                  </div>
                </div>
                <div className="hero-stat-row">
                  <div className="hero-stat">
                    <div className="hero-stat-num">500+</div>
                    <div className="hero-stat-lbl">Projects Delivered</div>
                  </div>
                  <div className="hero-stat">
                    <div className="hero-stat-num">98%</div>
                    <div className="hero-stat-lbl">Client Satisfaction</div>
                  </div>
                  <div className="hero-stat">
                    <div className="hero-stat-num">7+</div>
                    <div className="hero-stat-lbl">Years of Excellence</div>
                  </div>
                </div>
              </div>

              <div className="hero-card">
                <div className="hero-card-header">
                  <div className="hero-card-icon">🌍</div>
                  <div>
                    <p className="hero-card-title">Global Consultancy Reach</p>
                    <p className="hero-card-sub">UK · Europe · North America · Africa</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '4px' }}>
                  {['AI Automation', 'EdTech', 'Writing & Research', 'Product Management'].map(tag => (
                    <span key={tag} style={{ background: 'rgba(255,255,255,0.12)', padding: '4px 10px', borderRadius: '100px', fontSize: '0.75rem', color: 'rgba(255,255,255,0.8)' }}>{tag}</span>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── TRUST BAR ── */}
      <div className="trust-bar">
        <div className="container">
          <p className="trust-bar-label">Trusted by organisations &amp; institutions across the UK, Europe, North America and Africa</p>
          <div className="trust-logos">
            <span className="trust-logo">Enterprise Partners</span>
            <span className="trust-logo">Academic Institutions</span>
            <span className="trust-logo">Government Agencies</span>
            <span className="trust-logo">SMEs &amp; Startups</span>
            <span className="trust-logo">NGOs</span>
            <span className="trust-logo">Research Bodies</span>
          </div>
        </div>
      </div>

      {/* ── SERVICES ── */}
      <section className="section section-alt" aria-labelledby="services-heading">
        <div className="container">
          <div className="text-center">
            <span className="section-label">What We Do</span>
            <h2 className="section-heading reveal" id="services-heading">Specialist Consultancy Across Four Disciplines</h2>
            <p className="section-sub reveal" style={{ marginInline: 'auto' }}>One integrated team. Deep expertise across every area. A single point of accountability for your organisation.</p>
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
      <section className="section" aria-labelledby="stats-heading">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item reveal">
              <span className="stat-num" data-count="500" data-suffix="+">0+</span>
              <span className="stat-label">Projects Delivered</span>
            </div>
            <div className="stat-item reveal fade-up-delay-1">
              <span className="stat-num" data-count="200" data-suffix="+">0+</span>
              <span className="stat-label">Clients Served</span>
            </div>
            <div className="stat-item reveal fade-up-delay-2">
              <span className="stat-num" data-count="98" data-suffix="%">0%</span>
              <span className="stat-label">Client Satisfaction</span>
            </div>
            <div className="stat-item reveal fade-up-delay-3">
              <span className="stat-num" data-count="7" data-suffix="+">0+</span>
              <span className="stat-label">Years of Excellence</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHY RYTERS SPOT (tabbed like moneta.ng) ── */}
      <section className="section section-alt" aria-labelledby="why-heading">
        <div className="container">
          <div className="text-center" style={{ marginBottom: '2.5rem' }}>
            <span className="section-label">Why Choose Us</span>
            <h2 className="section-heading reveal" id="why-heading">Built for Organisations That Demand Excellence</h2>
          </div>

          <div className="why-tabs">
            <div className="why-tab-buttons">
              {whyItems.map((item, i) => (
                <button
                  key={i}
                  className={`why-tab-btn${activeWhy === i ? ' active' : ''}`}
                  onClick={() => setActiveWhy(i)}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <div className="why-tab-content">
              <h3>{whyItems[activeWhy].heading}</h3>
              <p>{whyItems[activeWhy].text}</p>
              <Link href="/about" className="btn btn-primary btn-sm" style={{ marginTop: '1.5rem', display: 'inline-flex' }}>
                About Ryters Spot →
              </Link>
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
            <Link href="/contact" className="btn btn-accent btn-lg">Book a Free Consultation</Link>
            <Link href="/services" className="btn btn-white btn-lg">Browse Services</Link>
          </div>
        </div>
      </section>
    </>
  )
}
