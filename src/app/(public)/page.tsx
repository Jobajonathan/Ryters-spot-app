'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useScrollReveal, useCounterAnimation } from '@/hooks/useScrollReveal'

const services = [
  {
    slug: 'ai-automation',
    icon: '⚡',
    badge: 'Enterprise & SMEs',
    badgeVariant: 'green',
    title: 'AI Automation',
    desc: 'Transform your operations with intelligent automation. From AI strategy to enterprise-scale workflow integration.',
    bullets: ['AI strategy and roadmapping', 'Workflow automation and integration', 'LLM deployment and enablement'],
  },
  {
    slug: 'edtech',
    icon: '🎓',
    badge: 'Institutions',
    badgeVariant: 'gold',
    title: 'EdTech Services',
    desc: 'Next-generation educational technology for institutions delivering learning at scale across digital platforms.',
    bullets: ['LMS design and deployment', 'Interactive content development', 'eLearning platform strategy'],
  },
  {
    slug: 'writing',
    icon: '📖',
    badge: 'Academic & Business',
    badgeVariant: 'green',
    title: 'Writing & Research',
    desc: 'Expert academic writing, research support and content strategy for scholars and organisations worldwide.',
    bullets: ['Dissertation and thesis support', 'Content strategy and creation', 'Data analysis and interpretation'],
  },
  {
    slug: 'product-management',
    icon: '🚀',
    badge: 'Product Teams',
    badgeVariant: 'gold',
    title: 'Product Management',
    desc: 'From ideation to delivery: building products and projects that generate measurable, lasting results.',
    bullets: ['Product strategy and roadmapping', 'Agile delivery and PMO', 'Go-to-market planning'],
  },
]

const processSteps = [
  { num: '01', title: 'Submit Your Brief', desc: 'Fill in our project form with your requirements, goals, and timeline.' },
  { num: '02', title: 'Get a Custom Quote', desc: 'Receive a tailored proposal within 24 hours. Transparent pricing, no surprises.' },
  { num: '03', title: 'We Get to Work', desc: 'Your dedicated consultant begins with regular progress updates throughout.' },
  { num: '04', title: 'Review & Approve', desc: 'Review deliverables, request revisions, and approve your final outcome.' },
]

const testimonials = [
  {
    initials: 'AO',
    name: 'Amara Okonkwo',
    role: 'PhD Candidate, University of Edinburgh',
    quote: 'Ryters Spot delivered my literature review ahead of schedule and to a standard my supervisor described as "publication-ready". Outstanding.',
  },
  {
    initials: 'CA',
    name: 'Chidi Adeyemi',
    role: 'CFO, FinTech Startup, Lagos',
    quote: 'Our annual report went from a rough draft to a polished investor-ready document in 5 days. The team understood our brand voice perfectly.',
  },
  {
    initials: 'SM',
    name: 'Sarah Mitchell',
    role: 'Marketing Director, London',
    quote: 'Since Ryters Spot overhauled our content strategy, our organic traffic has grown 40%. The ROI has been exceptional.',
  },
]

const audiences = [
  { emoji: '🎓', title: 'Students & Researchers', desc: 'Dissertations, theses, literature reviews, and academic papers.' },
  { emoji: '🏢', title: 'Businesses & Startups', desc: 'Reports, proposals, and strategic content that drives results.' },
  { emoji: '🏛️', title: 'Institutions & NGOs', desc: 'EdTech integration, grant writing, and policy documentation.' },
  { emoji: '🌍', title: 'Global Organisations', desc: 'Serving clients across Africa, UK, Europe, and North America.' },
]

export default function HomePage() {
  useScrollReveal()
  useCounterAnimation()
  const [activeWhy, setActiveWhy] = useState(0)
  const [content, setContent] = useState<Record<string, string>>({})

  useEffect(() => {
    fetch('/api/content').then(r => r.json()).then(setContent).catch(() => {})
  }, [])

  function c(key: string, fallback: string) { return content[key] || fallback }

  const stats = [
    { count: parseInt(c('stat1_count', '500')), suffix: c('stat1_suffix', '+'), label: c('stat1_label', 'Projects Delivered') },
    { count: parseInt(c('stat2_count', '200')), suffix: c('stat2_suffix', '+'), label: c('stat2_label', 'Clients Served') },
    { count: parseInt(c('stat3_count', '98')), suffix: c('stat3_suffix', '%'), label: c('stat3_label', 'Client Satisfaction') },
    { count: parseInt(c('stat4_count', '7')), suffix: c('stat4_suffix', '+'), label: c('stat4_label', 'Years of Excellence') },
  ]

  const whyItems = [
    { label: 'Expert Team', heading: 'Specialists Across Every Domain', text: 'Our consultants bring deep expertise across AI automation, EdTech, academic research and product management: the right knowledge for every challenge, without the overhead of multiple agencies.' },
    { label: 'Proven Results', heading: '500+ Projects Delivered', text: 'Over 500 projects delivered across the UK, Europe and North America. A consistent track record of measurable, strategic results that move organisations forward.' },
    { label: 'Global Reach', heading: 'Serving Clients Worldwide', text: 'From London to Lagos, Toronto to Dubai: our team works across time zones to deliver high-quality consultancy on your schedule, wherever you are.' },
    { label: 'One Partner', heading: 'Strategy Through to Delivery', text: 'From initial scoping through execution and beyond. No handoffs, no gaps. One integrated team accountable for the full outcome.' },
  ]

  return (
    <>
      <style>{`
        /* ── Hero ── */
        .hero-v2 {
          position: relative;
          overflow: hidden;
          padding: 6rem 0 7rem;
          background: #121410;
        }
        .hero-v2::before {
          content: '';
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse at 72% 18%, rgba(201,168,76,0.07) 0%, transparent 48%),
            radial-gradient(ellipse at 18% 85%, rgba(255,255,255,0.015) 0%, transparent 40%);
          pointer-events: none;
        }
        .hero-v2::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 140px;
          background: linear-gradient(to bottom, transparent, #f7f4ee);
          pointer-events: none;
        }
        .hero-v2-eyebrow-text {
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.38);
          margin-bottom: 1.25rem;
        }
        .hero-v2-grid {
          position: relative;
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 4rem;
          align-items: center;
        }
        .hero-v2-content {}
        .hero-v2-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(201,168,76,0.15);
          border: 1px solid rgba(201,168,76,0.3);
          color: #C9A84C;
          font-family: var(--font-heading);
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          padding: 0.35rem 0.9rem;
          border-radius: 100px;
          margin-bottom: 1.5rem;
        }
        .hero-v2-eyebrow-dot { width: 6px; height: 6px; background: #C9A84C; border-radius: 50%; }
        .hero-v2 h1 {
          color: #fff;
          font-size: clamp(2.4rem, 5vw, 3.8rem);
          font-weight: 800;
          line-height: 1.1;
          letter-spacing: -0.03em;
          margin-bottom: 1.5rem;
        }
        .hero-v2 h1 span { color: #C9A84C; }
        .hero-v2-sub {
          font-size: 1.1rem;
          color: rgba(255,255,255,0.75);
          line-height: 1.75;
          max-width: 50ch;
          margin-bottom: 2.5rem;
        }
        .hero-v2-ctas { display: flex; gap: 1rem; flex-wrap: wrap; margin-bottom: 3rem; }
        .hero-v2-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        .hero-v2-tag {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.15);
          color: rgba(255,255,255,0.8);
          font-size: 0.82rem;
          font-weight: 500;
          padding: 0.4rem 0.85rem;
          border-radius: 100px;
          text-decoration: none;
          transition: all 0.2s;
        }
        .hero-v2-tag:hover {
          background: rgba(255,255,255,0.14);
          border-color: rgba(255,255,255,0.3);
          color: #fff;
        }

        /* Hero right panel — pure typographic composition, no card */
        .hero-v2-visual { display: flex; flex-direction: column; justify-content: center; }
        .hero-cred-panel { padding: 0; }
        .hero-cred-gold-rule {
          width: 28px;
          height: 2px;
          background: var(--clr-accent);
          margin-bottom: 2.75rem;
        }
        .hero-cred-stats {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2.25rem 3rem;
          margin-bottom: 2.75rem;
        }
        .hero-cred-stat { display: flex; flex-direction: column; gap: 0.5rem; }
        .hero-cred-num {
          font-family: var(--font-heading);
          font-size: clamp(2.6rem, 4vw, 3.4rem);
          font-weight: 300;
          color: rgba(255,255,255,0.90);
          letter-spacing: -0.04em;
          line-height: 1;
        }
        .hero-cred-desc {
          font-size: 0.65rem;
          color: rgba(255,255,255,0.32);
          letter-spacing: 0.12em;
          text-transform: uppercase;
          font-weight: 600;
        }
        .hero-cred-rule {
          height: 1px;
          background: rgba(255,255,255,0.09);
          margin-bottom: 2.25rem;
        }
        .hero-cred-discipline {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 1.05rem;
          font-style: italic;
          color: rgba(255,255,255,0.52);
          padding: 0.8rem 0;
          border-top: 1px solid rgba(255,255,255,0.07);
          font-weight: 400;
          letter-spacing: 0.01em;
          transition: color 0.2s;
        }
        .hero-cred-discipline:first-of-type { border-top: none; padding-top: 0; }
        .hero-cred-footer {
          margin-top: 2rem;
          padding-top: 1.5rem;
          border-top: 1px solid rgba(255,255,255,0.07);
          font-size: 0.64rem;
          color: rgba(255,255,255,0.2);
          letter-spacing: 0.1em;
          text-transform: uppercase;
          font-weight: 500;
          line-height: 1.7;
        }

        @media (max-width: 900px) {
          .hero-v2 { padding: 4rem 0 3rem; }
          .hero-v2-grid { grid-template-columns: 1fr; gap: 2.5rem; }
          .hero-v2-visual { display: none; }
          .hero-v2 h1 { font-size: clamp(2.1rem, 7vw, 2.8rem); }
        }

        /* ── Trust bar ── */
        .trust-v2 {
          background: var(--clr-bg);
          border-bottom: 1px solid var(--clr-border);
          padding: 1.25rem 0;
        }
        .trust-v2-inner {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 2.5rem;
          flex-wrap: wrap;
        }
        .trust-v2-label {
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--clr-text-subtle);
          white-space: nowrap;
        }
        .trust-v2-logos {
          display: flex;
          gap: 2rem;
          flex-wrap: wrap;
          align-items: center;
        }
        .trust-v2-logo {
          font-family: var(--font-heading);
          font-size: 0.82rem;
          font-weight: 600;
          color: var(--clr-text-subtle);
          opacity: 0.55;
          white-space: nowrap;
          transition: opacity 0.2s;
        }
        .trust-v2-logo:hover { opacity: 0.85; }
        .trust-v2-sep { width: 1px; height: 20px; background: var(--clr-border); }

        /* ── Services v2 ── */
        .services-v2-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.25rem;
        }
        @media (max-width: 680px) { .services-v2-grid { grid-template-columns: 1fr; } }

        .service-v2-card {
          background: var(--clr-surface);
          border: 1.5px solid var(--clr-border);
          border-radius: 20px;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          transition: all 0.22s;
          position: relative;
          overflow: hidden;
        }
        .service-v2-card::after {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          background: linear-gradient(90deg, var(--clr-primary), var(--clr-primary-light));
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.25s;
        }
        .service-v2-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 32px rgba(27,67,50,0.1);
          border-color: rgba(27,67,50,0.25);
        }
        .service-v2-card:hover::after { transform: scaleX(1); }

        .service-v2-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 0.75rem;
        }
        .service-v2-icon {
          width: 48px; height: 48px;
          background: linear-gradient(135deg, var(--clr-primary) 0%, var(--clr-primary-light) 100%);
          border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          font-size: 1.3rem;
          flex-shrink: 0;
        }
        .service-v2-badge {
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          padding: 0.25rem 0.65rem;
          border-radius: 100px;
          white-space: nowrap;
        }
        .sv2-badge-green { background: rgba(27,67,50,0.08); color: var(--clr-primary); }
        .sv2-badge-gold  { background: rgba(201,168,76,0.12); color: #8a6a1a; }
        [data-theme="dark"] .sv2-badge-green { color: var(--clr-primary-xlight); }
        [data-theme="dark"] .sv2-badge-gold  { color: #C9A84C; }

        .service-v2-title {
          font-family: var(--font-heading);
          font-size: 1.15rem;
          font-weight: 700;
          color: var(--clr-text);
          letter-spacing: -0.01em;
        }
        .service-v2-desc {
          font-size: 0.875rem;
          color: var(--clr-text-muted);
          line-height: 1.7;
        }
        .service-v2-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--clr-primary-light);
          text-decoration: none;
          margin-top: auto;
          transition: gap 0.2s;
        }
        .service-v2-link:hover { gap: 10px; }

        /* ── Why tabs v2 ── */
        .why-grid-v2 { display: grid; grid-template-columns: 240px 1fr; gap: 2rem; align-items: start; }
        @media (max-width: 800px) { .why-grid-v2 { grid-template-columns: 1fr; } }
        .why-tabs-v2 { display: flex; flex-direction: column; gap: 0.35rem; }
        @media (max-width: 800px) { .why-tabs-v2 { flex-direction: row; flex-wrap: wrap; } }
        .why-tab-v2 {
          text-align: left;
          padding: 0.75rem 1rem;
          background: transparent;
          border: 1.5px solid var(--clr-border);
          border-radius: 10px;
          cursor: pointer;
          font-family: var(--font-heading);
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--clr-text-muted);
          transition: all 0.2s;
          font-family: inherit;
        }
        .why-tab-v2:hover { border-color: var(--clr-primary-xlight); color: var(--clr-text); background: var(--clr-surface-2); }
        .why-tab-v2.active { background: var(--clr-primary); color: #fff; border-color: var(--clr-primary); }
        @media (max-width: 800px) { .why-tab-v2 { flex: 1; min-width: 100px; text-align: center; font-size: 0.82rem; padding: 0.55rem 0.75rem; } }
        .why-panel-v2 {
          background: var(--clr-surface);
          border: 1.5px solid var(--clr-border);
          border-radius: 20px;
          padding: 2.5rem;
        }
        .why-panel-v2 h3 {
          font-size: 1.4rem;
          font-weight: 700;
          color: var(--clr-text);
          margin-bottom: 1rem;
          letter-spacing: -0.01em;
        }
        .why-panel-v2 p { font-size: 0.975rem; line-height: 1.8; }
      `}</style>

      {/* ── HERO ── */}
      <section className="hero-v2" aria-label="Hero">
        <div className="container">
          <div className="hero-v2-grid">

            {/* Left: copy */}
            <div className="hero-v2-content fade-up">
              <p className="hero-v2-eyebrow-text">Writing, Research &amp; Advisory</p>
              <h1>
                The <span>research partner</span><br />you can trust.
              </h1>
              <p className="hero-v2-sub">
                Ryters Spot provides specialist writing, research, AI automation, EdTech and product management consultancy to professionals and organisations across the UK, Europe, North America and Africa.
              </p>
              <div className="hero-v2-ctas">
                <Link href="/get-started" className="btn btn-accent btn-lg">{c('hero_cta1_text', 'Start Your Project')}</Link>
                <Link href="/contact" className="btn btn-lg" style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.85)', borderColor: 'rgba(255,255,255,0.18)', fontWeight: 500 }}>{c('hero_cta2_text', 'Book a Consultation')}</Link>
              </div>
              <div className="hero-v2-tags">
                <Link href="/services/ai-automation" className="hero-v2-tag">AI Automation</Link>
                <Link href="/services/edtech" className="hero-v2-tag">EdTech</Link>
                <Link href="/services/writing" className="hero-v2-tag">Writing & Research</Link>
                <Link href="/services/product-management" className="hero-v2-tag">Product Management</Link>
              </div>
            </div>

            {/* Right: typographic credentials — no card, just type */}
            <div className="hero-v2-visual fade-up fade-up-delay-1">
              <div className="hero-cred-panel">
                <div className="hero-cred-gold-rule" />
                <div className="hero-cred-stats">
                  {stats.map(s => (
                    <div key={s.label} className="hero-cred-stat">
                      <span className="hero-cred-num" data-count={s.count} data-suffix={s.suffix}>{s.count}{s.suffix}</span>
                      <span className="hero-cred-desc">{s.label}</span>
                    </div>
                  ))}
                </div>
                <div className="hero-cred-rule" />
                {services.map(s => (
                  <div key={s.slug} className="hero-cred-discipline">{s.title}</div>
                ))}
                <p className="hero-cred-footer">
                  Serving clients across the UK,<br />Canada, Europe and Africa
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── TRUST BAR ── */}
      <div className="trust-v2">
        <div className="container">
          <div className="trust-v2-inner">
            <span className="trust-v2-label">Trusted by</span>
            <div className="trust-v2-sep" />
            <div className="trust-v2-logos">
              {['Enterprise Partners', 'Academic Institutions', 'Government Agencies', 'SMEs & Startups', 'NGOs', 'Research Bodies'].map((t, i) => (
                <span key={t} className="trust-v2-logo">{t}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── SERVICES ── */}
      <section className="section" aria-labelledby="services-heading">
        <div className="container">
          <div className="section-header reveal">
            <div className="pill-label">What We Do</div>
            <h2 id="services-heading">Specialist Consultancy Across Four Disciplines</h2>
            <p>One integrated team. Deep expertise across every area your organisation needs.</p>
          </div>
          <div className="services-v2-grid">
            {services.map((s, i) => (
              <article key={s.slug} className={`service-v2-card reveal${i > 0 ? ` fade-up-delay-${Math.min(i, 3)}` : ''}`}>
                <div className="service-v2-top">
                  <div className="service-v2-icon">{s.icon}</div>
                  <span className={`service-v2-badge ${s.badgeVariant === 'gold' ? 'sv2-badge-gold' : 'sv2-badge-green'}`}>{s.badge}</span>
                </div>
                <h3 className="service-v2-title">{s.title}</h3>
                <p className="service-v2-desc">{s.desc}</p>
                <ul className="check-list">
                  {s.bullets.map(b => <li key={b}>{b}</li>)}
                </ul>
                <Link href={`/services/${s.slug}`} className="service-v2-link">
                  Learn More <span>→</span>
                </Link>
              </article>
            ))}
          </div>
          <div className="text-center" style={{ marginTop: '2rem' }}>
            <Link href="/services" className="btn btn-outline">View All Services →</Link>
          </div>
        </div>
      </section>

      {/* ── STATS STRIP ── */}
      <section className="section section-alt" aria-label="Statistics">
        <div className="container">
          <div className="stat-strip reveal">
            {stats.map(s => (
              <div key={s.label} className="stat-strip-item">
                <span className="stat-strip-num" data-count={s.count} data-suffix={s.suffix}>
                  {s.count}{s.suffix}
                </span>
                <span className="stat-strip-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="section" aria-labelledby="process-heading">
        <div className="container">
          <div className="section-header reveal">
            <div className="pill-label">The Process</div>
            <h2 id="process-heading">Simple. Transparent. Fast.</h2>
            <p>From brief to delivery. Here is how we work with every client.</p>
          </div>
          <div className="process-row reveal">
            {processSteps.map(step => (
              <div key={step.num} className="process-step">
                <div className="process-step-icon">{step.num}</div>
                <div className="process-step-title">{step.title}</div>
                <p className="process-step-desc">{step.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center" style={{ marginTop: '2.5rem' }}>
            <Link href="/get-started" className="btn btn-primary btn-lg">Get Started Today →</Link>
          </div>
        </div>
      </section>

      {/* ── WHO WE SERVE ── */}
      <section className="section section-alt" aria-labelledby="audiences-heading">
        <div className="container">
          <div className="section-header reveal">
            <div className="pill-label">Who We Serve</div>
            <h2 id="audiences-heading">Built for Your Organisation</h2>
            <p>Whether you are a student, business or institution, we have a service that fits.</p>
          </div>
          <div className="audience-v2 reveal">
            {audiences.map(a => (
              <div key={a.title} className="audience-v2-card">
                <div className="audience-v2-emoji">{a.emoji}</div>
                <div className="audience-v2-title">{a.title}</div>
                <p className="audience-v2-desc">{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY RYTERS SPOT ── */}
      <section className="section" aria-labelledby="why-heading">
        <div className="container">
          <div style={{ marginBottom: '2.5rem' }}>
            <div className="pill-label reveal">Why Choose Us</div>
            <h2 className="reveal" id="why-heading" style={{ maxWidth: '540px' }}>
              Built for Organisations That Demand Excellence
            </h2>
          </div>
          <div className="why-grid-v2">
            <div className="why-tabs-v2">
              {whyItems.map((item, i) => (
                <button key={i} className={`why-tab-v2${activeWhy === i ? ' active' : ''}`} onClick={() => setActiveWhy(i)}>
                  {item.label}
                </button>
              ))}
            </div>
            <div className="why-panel-v2">
              <h3>{whyItems[activeWhy].heading}</h3>
              <p>{whyItems[activeWhy].text}</p>
              <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--clr-border)' }}>
                <Link href="/about" className="btn btn-primary btn-sm">About Ryters Spot →</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="section section-alt" aria-labelledby="testimonials-heading">
        <div className="container">
          <div className="section-header reveal">
            <div className="pill-label">Testimonials</div>
            <h2 id="testimonials-heading">Trusted by Clients Worldwide</h2>
            <p>Here is what our clients say about working with us.</p>
          </div>
          <div className="testi-grid">
            {testimonials.map((t, i) => (
              <div key={t.name} className={`testi-card reveal${i > 0 ? ` fade-up-delay-${i}` : ''}`}>
                <div className="testi-stars">★★★★★</div>
                <p className="testi-quote">"{t.quote}"</p>
                <div className="testi-author">
                  <div className="testi-avatar">{t.initials}</div>
                  <div>
                    <div className="testi-name">{t.name}</div>
                    <div className="testi-role">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BAND ── */}
      <section className="cta-band" aria-label="Call to action">
        <div className="container">
          <div className="cta-band-inner reveal">
            <div className="cta-band-text">
              <h2>{c('cta_banner_heading', 'Ready to Transform Your Organisation?')}</h2>
              <p>{c('cta_banner_subtext', 'Whether you need AI automation, EdTech solutions, expert writing and research, or product management: Ryters Spot is your strategic partner from brief to delivery.')}</p>
            </div>
            <div className="cta-band-actions">
              <Link href="/get-started" className="btn btn-accent btn-lg">{c('cta_banner_cta1_text', 'Get Started Free')}</Link>
              <Link href="/services" className="btn btn-lg btn-white">Browse Services</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
