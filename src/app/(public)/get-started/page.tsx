'use client'

import Link from 'next/link'

const services = [
  {
    slug: 'ai-automation', icon: '🤖', title: 'AI Automation',
    desc: 'Strategy, workflow automation and LLM integration for enterprises and SMEs.',
    tags: ['Enterprise', 'SMEs', 'Government'],
  },
  {
    slug: 'edtech', icon: '🎓', title: 'EdTech Services',
    desc: 'LMS design, eLearning content and digital learning strategy for institutions.',
    tags: ['Universities', 'Corporate L&D', 'Training Bodies'],
  },
  {
    slug: 'writing', icon: '📖', title: 'Writing & Research',
    desc: 'Academic writing support, content strategy and data analysis for scholars and businesses.',
    tags: ['PhD Students', 'Researchers', 'Businesses'],
  },
  {
    slug: 'product-management', icon: '🚀', title: 'Product & Project Management',
    desc: 'Product strategy, agile delivery and go-to-market planning from ideation to launch.',
    tags: ['Founders', 'Product Teams', 'Tech Companies'],
  },
]

export default function GetStartedPage() {
  return (
    <>
      <style>{`
        .gs-hero {
          background: var(--clr-bg);
          border-bottom: 1px solid var(--clr-border);
          padding: var(--space-3xl) 0 var(--space-2xl);
        }
        .gs-hero h1 {
          font-size: clamp(2rem, 5vw, 3.2rem);
          font-weight: 800;
          letter-spacing: -0.03em;
          color: var(--clr-text);
          margin-bottom: 0.75rem;
        }
        .gs-hero p { color: var(--clr-text-muted); font-size: 1.05rem; max-width: 520px; line-height: 1.75; }

        .gs-section { padding: 4rem 0; }
        .gs-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1.25rem; margin-top: 2.5rem; }
        .gs-card {
          border: 1px solid var(--clr-border);
          border-radius: 16px;
          padding: 2rem;
          background: var(--clr-surface);
          transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;
          text-decoration: none;
          display: block;
          position: relative;
          overflow: hidden;
        }
        .gs-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: var(--clr-accent); transform: scaleX(0); transform-origin: left; transition: transform 0.25s; }
        .gs-card:hover { border-color: var(--clr-primary-light); box-shadow: 0 4px 24px rgba(27,67,50,0.08); transform: translateY(-2px); }
        .gs-card:hover::before { transform: scaleX(1); }
        .gs-icon { display: none; }
        .gs-num { font-family: 'Playfair Display', Georgia, serif; font-style: italic; font-size: 1.4rem; color: var(--clr-accent); margin-bottom: 0.75rem; line-height: 1; }
        .gs-title { font-size: 1.05rem; font-weight: 700; color: var(--clr-text); margin-bottom: 0.5rem; }
        .gs-desc { font-size: 0.875rem; color: var(--clr-text-muted); line-height: 1.7; margin-bottom: 1rem; }
        .gs-tags { display: flex; flex-wrap: wrap; gap: 0.4rem; }
        .gs-tag { font-size: 0.72rem; padding: 3px 10px; background: var(--clr-surface-2); color: var(--clr-text-muted); border-radius: 100px; font-weight: 500; border: 1px solid var(--clr-border); }
        .gs-learn { font-size: 0.82rem; color: var(--clr-primary); font-weight: 600; margin-top: 1.25rem; display: block; }

        .gs-cta-box { background: var(--clr-surface); border: 1px solid var(--clr-border); border-radius: 20px; padding: 3rem; text-align: center; max-width: 560px; margin: 3rem auto 0; }
        .gs-cta-box h2 { font-size: 1.6rem; font-weight: 800; letter-spacing: -0.02em; color: var(--clr-text); margin-bottom: 0.75rem; }
        .gs-cta-box p { color: var(--clr-text-muted); line-height: 1.7; margin-bottom: 2rem; font-size: 0.95rem; }
        .gs-cta-btns { display: flex; flex-direction: column; gap: 0.75rem; align-items: center; }
        .gs-cta-btns .btn { width: 100%; max-width: 320px; justify-content: center; }
        .gs-signin { margin-top: 1.25rem; font-size: 0.875rem; color: var(--clr-text-muted); }
        .gs-signin a { color: var(--clr-primary); font-weight: 600; }

        .gs-promise { display: flex; flex-wrap: wrap; gap: 1.5rem; justify-content: center; margin-top: 3rem; }
        .gs-promise-item { display: flex; align-items: center; gap: 0.5rem; font-size: 0.875rem; color: var(--clr-text-muted); }
        .gs-promise-check { width: 20px; height: 20px; background: var(--clr-surface-2); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.7rem; color: var(--clr-primary); flex-shrink: 0; border: 1px solid var(--clr-border); }
      `}</style>

      {/* Hero */}
      <header className="gs-hero">
        <div className="container">
          <p className="eyebrow">Get Started</p>
          <h1>How Can We Help You?</h1>
          <p>A specialist consultancy available around the clock, across every time zone. Choose your area of interest below.</p>
        </div>
      </header>

      {/* Service cards */}
      <section className="gs-section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
            <span className="section-label">Our Services</span>
            <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', color: 'var(--clr-text)', marginTop: '0.5rem' }}>What Would You Like Help With?</h2>
          </div>

          <div className="gs-grid">
            {services.map((s, i) => (
              <Link key={s.slug} href="/signup" className="gs-card">
                <div className="gs-num">0{i + 1}.</div>
                <div className="gs-title">{s.title}</div>
                <div className="gs-desc">{s.desc}</div>
                <div className="gs-tags">
                  {s.tags.map(t => <span key={t} className="gs-tag">{t}</span>)}
                </div>
                <span className="gs-learn">Create a free account →</span>
              </Link>
            ))}
          </div>

          {/* CTA box */}
          <div className="gs-cta-box">
            <h2>Ready to Request a Service?</h2>
            <p>Create a free account to submit a service request, track your project progress, and communicate directly with your dedicated consultant.</p>
            <div className="gs-cta-btns">
              <Link href="/signup" className="btn btn-primary btn-lg">Create a Free Account</Link>
              <Link href="/contact" className="btn btn-outline btn-lg">Talk to an Expert First</Link>
            </div>
            <p className="gs-signin">Already have an account? <Link href="/login">Sign in →</Link></p>
          </div>

          {/* Promise row */}
          <div className="gs-promise">
            {['Available 24/7 across all time zones', 'No obligation, free consultation', 'Secure client portal', 'Dedicated consultant assigned'].map(p => (
              <div key={p} className="gs-promise-item">
                <div className="gs-promise-check">✓</div>
                <span>{p}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
