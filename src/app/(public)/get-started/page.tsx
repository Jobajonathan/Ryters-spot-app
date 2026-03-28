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
        .gs-hero { background: linear-gradient(135deg, #1B4332 0%, #2D6A4F 100%); padding: 4rem 0; text-align: center; color: #fff; }
        .gs-hero h1 { font-family: 'Playfair Display', Georgia, serif; font-size: clamp(1.8rem, 4vw, 2.8rem); color: #fff; margin-bottom: 0.75rem; }
        .gs-hero p { color: rgba(255,255,255,0.7); font-size: 1.05rem; max-width: 520px; margin: 0 auto; line-height: 1.7; }

        .gs-section { padding: 4rem 0; }
        .gs-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1.25rem; margin-top: 2.5rem; }
        .gs-card { border: 1px solid var(--clr-border); border-radius: 16px; padding: 2rem; background: var(--clr-surface); transition: border-color 0.2s, box-shadow 0.2s; text-decoration: none; display: block; }
        .gs-card:hover { border-color: #40916C; box-shadow: 0 4px 24px rgba(27,67,50,0.1); }
        .gs-icon { font-size: 2rem; margin-bottom: 1rem; }
        .gs-title { font-family: 'Playfair Display', Georgia, serif; font-size: 1.1rem; font-weight: 700; color: var(--clr-text); margin-bottom: 0.5rem; }
        .gs-desc { font-size: 0.88rem; color: var(--clr-text-muted); line-height: 1.7; margin-bottom: 1rem; }
        .gs-tags { display: flex; flex-wrap: wrap; gap: 0.4rem; }
        .gs-tag { font-size: 0.72rem; padding: 2px 8px; background: #EFF5F1; color: #1B4332; border-radius: 100px; font-weight: 500; }
        [data-theme="dark"] .gs-tag { background: rgba(64,145,108,0.15); color: #74C69D; }
        .gs-learn { font-size: 0.82rem; color: #40916C; font-weight: 600; margin-top: 1.25rem; display: block; }

        .gs-cta-box { background: var(--clr-surface); border: 1px solid var(--clr-border); border-radius: 20px; padding: 3rem; text-align: center; max-width: 560px; margin: 3rem auto 0; }
        .gs-cta-box h2 { font-family: 'Playfair Display', Georgia, serif; font-size: 1.6rem; color: var(--clr-text); margin-bottom: 0.75rem; }
        .gs-cta-box p { color: var(--clr-text-muted); line-height: 1.7; margin-bottom: 2rem; font-size: 0.95rem; }
        .gs-cta-btns { display: flex; flex-direction: column; gap: 0.75rem; align-items: center; }
        .gs-cta-btns .btn { width: 100%; max-width: 320px; justify-content: center; }
        .gs-signin { margin-top: 1.25rem; font-size: 0.875rem; color: var(--clr-text-muted); }
        .gs-signin a { color: #40916C; font-weight: 600; }

        .gs-promise { display: flex; flex-wrap: wrap; gap: 1.5rem; justify-content: center; margin-top: 3rem; }
        .gs-promise-item { display: flex; align-items: center; gap: 0.5rem; font-size: 0.875rem; color: var(--clr-text-muted); }
        .gs-promise-check { width: 20px; height: 20px; background: #EFF5F1; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.7rem; color: #1B4332; flex-shrink: 0; }
        [data-theme="dark"] .gs-promise-check { background: rgba(64,145,108,0.2); color: #74C69D; }
      `}</style>

      {/* Hero */}
      <section className="gs-hero">
        <div className="container">
          <h1>How Can We Help You?</h1>
          <p>Ryters Spot is a specialist consultancy available around the clock, across every time zone. Choose your area of interest below to get started.</p>
        </div>
      </section>

      {/* Service cards */}
      <section className="gs-section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#40916C' }}>Our Services</span>
            <h2 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: 'clamp(1.5rem, 3vw, 2rem)', color: 'var(--clr-text)', marginTop: '0.5rem' }}>What Would You Like Help With?</h2>
          </div>

          <div className="gs-grid">
            {services.map(s => (
              <Link key={s.slug} href={`/services/${s.slug}`} className="gs-card">
                <div className="gs-icon">{s.icon}</div>
                <div className="gs-title">{s.title}</div>
                <div className="gs-desc">{s.desc}</div>
                <div className="gs-tags">
                  {s.tags.map(t => <span key={t} className="gs-tag">{t}</span>)}
                </div>
                <span className="gs-learn">Learn more →</span>
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
