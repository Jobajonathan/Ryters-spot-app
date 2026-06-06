'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useScrollReveal, useCounterAnimation } from '@/hooks/useScrollReveal'

export default function AboutPage() {
  useScrollReveal()
  useCounterAnimation()
  const [content, setContent] = useState<Record<string, string>>({})

  useEffect(() => {
    fetch('/api/content').then(r => r.json()).then(setContent).catch(() => {})
  }, [])

  function c(key: string, fallback: string) { return content[key] || fallback }

  return (
    <>
      <style>{`
        .about-intro-grid { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-4xl); align-items: start; }
        .about-pillar-box { border-left: 1px solid var(--clr-border); padding-left: var(--space-2xl); display: flex; flex-direction: column; gap: var(--space-xl); }
        .about-pillar { position: relative; }
        .about-pillar-label {
          font-family: 'Playfair Display', Georgia, serif;
          font-style: italic;
          font-size: 0.7rem;
          font-weight: 400;
          color: var(--clr-text-subtle);
          text-transform: uppercase;
          letter-spacing: 0.14em;
          margin-bottom: 0.5rem;
          display: block;
        }
        .about-pillar h4 { font-size: 0.95rem; font-weight: 700; color: var(--clr-text); margin-bottom: 0.5rem; }
        .about-pillar p { font-size: 0.88rem; color: var(--clr-text-muted); line-height: 1.7; }
        .about-pillar + .about-pillar { padding-top: var(--space-xl); border-top: 1px solid var(--clr-border); margin-top: var(--space-xl); }

        .expertise-grid { display: grid; grid-template-columns: repeat(2,1fr); gap: var(--space-lg); max-width: 900px; margin: 0 auto; }
        .expertise-card {
          background: var(--clr-surface);
          border: 1px solid var(--clr-border);
          border-radius: var(--radius-lg);
          padding: var(--space-xl);
          position: relative;
        }
        .expertise-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: var(--clr-accent);
          border-radius: var(--radius-lg) var(--radius-lg) 0 0;
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.3s;
        }
        .expertise-card:hover::before { transform: scaleX(1); }
        .expertise-num {
          font-family: 'Playfair Display', Georgia, serif;
          font-style: italic;
          font-size: 1.6rem;
          color: var(--clr-accent);
          line-height: 1;
          margin-bottom: 0.75rem;
        }
        .expertise-card h4 { font-size: 0.95rem; font-weight: 700; margin-bottom: 6px; }
        .expertise-card p { font-size: 0.875rem; color: var(--clr-text-muted); line-height: 1.65; }

        .process-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: var(--space-xl); }
        .process-step { text-align: center; padding: var(--space-xl) var(--space-lg); }
        .process-num {
          width: 48px; height: 48px;
          border-radius: 50%;
          background: var(--clr-primary);
          color: #fff;
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 1.2rem;
          font-weight: 700;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto var(--space-lg);
        }
        .process-step:last-child .process-num { background: var(--clr-accent); }
        .process-step h4 { margin-bottom: 8px; font-size: 0.95rem; }
        .process-step p { font-size: 0.875rem; color: var(--clr-text-muted); line-height: 1.65; }

        @media (max-width: 900px) {
          .about-intro-grid { grid-template-columns: 1fr !important; }
          .expertise-grid { grid-template-columns: 1fr !important; }
          .process-grid { grid-template-columns: repeat(2,1fr) !important; }
        }
        @media (max-width: 500px) {
          .expertise-grid { grid-template-columns: 1fr !important; }
          .process-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <header className="page-hero editorial-hero">
        <div className="container">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span className="breadcrumb-sep">&#8250;</span>
            <span>About</span>
          </nav>
          <p className="eyebrow">About Us</p>
          <h1>{c('about_hero_heading', 'We Are Ryters Spot.')}</h1>
          <p>{c('about_hero_subtext', 'A specialist writing, research and advisory firm. Helping clients across Europe, North America and beyond communicate with authority and lead with confidence.')}</p>
        </div>
      </header>

      {/* Our Story */}
      <section className="section">
        <div className="container">
          <div className="about-intro-grid">
            <div className="reveal">
              <span className="section-label">Our Story</span>
              <h2 style={{ marginBottom: 'var(--space-lg)' }}>Built on a Simple Conviction</h2>
              <p style={{ marginBottom: 'var(--space-lg)' }}>{c('about_story_body', 'Ryters Spot was founded on a conviction that has never changed: exceptional writing is not a luxury. It is the single most powerful instrument for building authority, advancing ideas and driving results in any field.')}</p>
              <p style={{ marginBottom: 'var(--space-lg)' }}>Over the years, we have grown from a focused writing consultancy into a full-spectrum advisory firm, serving PhD candidates at leading universities in the UK and Canada, executives at Fortune 500 organisations, government agencies, global NGOs, and entrepreneurs building category-defining businesses.</p>
              <p style={{ marginBottom: 'var(--space-lg)' }}>What has never changed is our standard. Every project we take on receives the same rigour, the same depth of expertise and the same uncompromising commitment to quality that our clients have come to expect and depend on.</p>
              <p>We work quietly, we work precisely, and we deliver results that speak for themselves.</p>
            </div>

            <div className="reveal fade-up-delay-1">
              <div className="about-pillar-box">
                <div className="about-pillar">
                  <span className="about-pillar-label">Mission</span>
                  <p>{c('about_mission', 'To deliver writing, research and advisory services of the highest quality, enabling our clients to achieve their academic, professional and business objectives with clarity and confidence.')}</p>
                </div>
                <div className="about-pillar">
                  <span className="about-pillar-label">Vision</span>
                  <p>{c('about_vision', 'To be the most trusted specialist writing and advisory partner for ambitious individuals and organisations worldwide, recognised for excellence, discretion and transformative results.')}</p>
                </div>
                <div className="about-pillar">
                  <span className="about-pillar-label">Approach</span>
                  <p>{c('about_approach', 'We combine deep subject-matter expertise with genuinely personalised service. Every engagement is tailored to your specific context, objectives and audience. We do not apply templates. We apply thinking.')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="section section-alt">
        <div className="container">
          <div className="text-center" style={{ marginBottom: 'var(--space-2xl)' }}>
            <span className="section-label">Our Expertise</span>
            <h2 className="reveal">What We Do</h2>
            <p className="reveal" style={{ maxWidth: '58ch', marginInline: 'auto', marginTop: '0.75rem' }}>Four specialist service areas. One integrated team. A single point of accountability for every engagement.</p>
          </div>
          <div className="expertise-grid reveal">
            <div className="expertise-card">
              <div className="expertise-num">01.</div>
              <h4>Research and Academic Enquiry</h4>
              <p>Dissertation support, academic writing, data analysis and research advisory for scholars and institutions at every stage.</p>
            </div>
            <div className="expertise-card">
              <div className="expertise-num">02.</div>
              <h4>Digital Transformation and Automation</h4>
              <p>End-to-end transformation roadmaps, automation strategy and process modernisation for enterprises ready to scale.</p>
            </div>
            <div className="expertise-card">
              <div className="expertise-num">03.</div>
              <h4>Ed-Tech Services</h4>
              <p>LMS development, interactive content design and educational technology strategy for institutions and learners worldwide.</p>
            </div>
            <div className="expertise-card">
              <div className="expertise-num">04.</div>
              <h4>Product Management</h4>
              <p>Strategic product advisory, roadmap development and go-to-market support for teams building the next generation of products.</p>
            </div>
          </div>
          <div className="text-center" style={{ marginTop: 'var(--space-2xl)' }}>
            <Link href="/services" className="btn btn-outline">View All Services</Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="section">
        <div className="container">
          <div className="text-center" style={{ marginBottom: 'var(--space-2xl)' }}>
            <span className="section-label">Track Record</span>
            <h2 className="reveal">Numbers That Speak for Themselves</h2>
          </div>
          <div className="stats-grid">
            <div className="stat-item reveal">
              <span className="stat-num" data-count="500" data-suffix="+">0+</span>
              <span className="stat-label">Projects Delivered</span>
            </div>
            <div className="stat-item reveal fade-up-delay-1">
              <span className="stat-num" data-count="200" data-suffix="+">0+</span>
              <span className="stat-label">Clients Served Globally</span>
            </div>
            <div className="stat-item reveal fade-up-delay-2">
              <span className="stat-num" data-count="18" data-suffix="+">0+</span>
              <span className="stat-label">Countries Reached</span>
            </div>
            <div className="stat-item reveal fade-up-delay-3">
              <span className="stat-num" data-count="98" data-suffix="%">0%</span>
              <span className="stat-label">Client Satisfaction Rate</span>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section section-alt">
        <div className="container">
          <div className="text-center" style={{ marginBottom: 'var(--space-2xl)' }}>
            <span className="section-label">Why Ryters Spot</span>
            <h2 className="reveal">What Sets Us Apart</h2>
            <p className="reveal" style={{ maxWidth: '54ch', marginInline: 'auto', marginTop: '0.75rem' }}>We are not a content mill. We are not a freelancer marketplace. We are a specialist firm where every engagement is managed by an experienced professional who understands your field.</p>
          </div>
          <div className="values-grid">
            <div className="value-card reveal">
              <div className="value-content">
                <h4>Global Client Base</h4>
                <p>The majority of our clients are based in the UK, Canada, the United States and across Europe. We operate to international standards and understand international expectations.</p>
              </div>
            </div>
            <div className="value-card reveal fade-up-delay-1">
              <div className="value-content">
                <h4>Complete Confidentiality</h4>
                <p>Discretion is fundamental to how we operate. Every engagement is protected by strict confidentiality. We sign NDAs without hesitation and never disclose client relationships or project details.</p>
              </div>
            </div>
            <div className="value-card reveal fade-up-delay-2">
              <div className="value-content">
                <h4>Uncompromising Quality</h4>
                <p>We hold ourselves to a standard that makes revision requests rare. Every deliverable goes through rigorous internal review before it reaches you.</p>
              </div>
            </div>
            <div className="value-card reveal">
              <div className="value-content">
                <h4>Deep Specialisation</h4>
                <p>We do not attempt to be generalists. Our team is composed of specialists, each with extensive real-world expertise in their service area. You work with people who genuinely know the field.</p>
              </div>
            </div>
            <div className="value-card reveal fade-up-delay-1">
              <div className="value-content">
                <h4>Partnership Mindset</h4>
                <p>We do not simply execute briefs. We engage with your goals, challenge assumptions where needed and bring strategic thinking to every engagement, not just execution.</p>
              </div>
            </div>
            <div className="value-card reveal fade-up-delay-2">
              <div className="value-content">
                <h4>Reliable Delivery</h4>
                <p>We meet deadlines. We communicate proactively. When timelines shift, you hear from us first. Our clients stay because we are dependable, not just capable.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How We Work */}
      <section className="section">
        <div className="container">
          <div className="text-center" style={{ marginBottom: 'var(--space-2xl)' }}>
            <span className="section-label">Our Process</span>
            <h2 className="reveal">How Every Engagement Works</h2>
            <p className="reveal" style={{ maxWidth: '54ch', marginInline: 'auto', marginTop: '0.75rem' }}>A clear, structured process designed for clients who value professionalism, transparency and results.</p>
          </div>
          <div className="process-grid reveal">
            <div className="process-step">
              <div className="process-num">1</div>
              <h4>Discovery</h4>
              <p>We start with a thorough discovery call to understand your goals, context and what success looks like for you.</p>
            </div>
            <div className="process-step">
              <div className="process-num">2</div>
              <h4>Proposal</h4>
              <p>We deliver a tailored proposal with a clear scope, timeline, deliverables and investment. No vague estimates.</p>
            </div>
            <div className="process-step">
              <div className="process-num">3</div>
              <h4>Execution</h4>
              <p>Our specialists get to work. You receive progress updates at agreed milestones and have direct access to your project lead.</p>
            </div>
            <div className="process-step">
              <div className="process-num">4</div>
              <h4>Delivery</h4>
              <p>We deliver on time, to specification, with post-delivery support included. Most client relationships extend well beyond the first project.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-banner">
        <div className="container">
          <h2>Ready to Work with a Team That Gets It Right?</h2>
          <p>Tell us about your project. We will respond within one business day.</p>
          <div className="cta-banner-btns">
            <a href="https://wa.me/2347062057116" target="_blank" rel="noopener noreferrer" className="btn btn-accent btn-lg">Hire Us</a>
            <Link href="/contact" className="btn btn-white btn-lg">Talk to Us</Link>
          </div>
        </div>
      </section>
    </>
  )
}
