'use client'

import Link from 'next/link'
import { useScrollReveal, useCounterAnimation } from '@/hooks/useScrollReveal'

export default function AboutPage() {
  useScrollReveal()
  useCounterAnimation()

  return (
    <>
      <header className="page-hero">
        <div className="container">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span className="breadcrumb-sep">&#8250;</span>
            <span>About</span>
          </nav>
          <h1>We Are Ryters Spot</h1>
          <p>A specialist writing, research and advisory firm. We have been helping clients across Europe, North America and beyond communicate with authority, execute with precision and lead with confidence.</p>
        </div>
      </header>

      {/* Our Story */}
      <section className="section">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4xl)', alignItems: 'start' }} className="about-intro-grid">

            <div className="reveal">
              <span className="section-label">Our Story</span>
              <h2 style={{ marginBottom: 'var(--space-lg)' }}>Built on a Simple Conviction</h2>
              <p style={{ marginBottom: 'var(--space-lg)' }}>Ryters Spot was founded on a conviction that has never changed: exceptional writing is not a luxury. It is the single most powerful instrument for building authority, advancing ideas and driving results in any field.</p>
              <p style={{ marginBottom: 'var(--space-lg)' }}>Over the years, we have grown from a focused writing consultancy into a full-spectrum advisory firm, serving PhD candidates at leading universities in the UK and Canada, executives at Fortune 500 organisations, government agencies, global NGOs, and entrepreneurs building category-defining businesses.</p>
              <p style={{ marginBottom: 'var(--space-lg)' }}>What has never changed is our standard. Every project we take on receives the same rigour, the same depth of expertise and the same uncompromising commitment to quality that our clients have come to expect and depend on.</p>
              <p>We work quietly, we work precisely, and we deliver results that speak for themselves.</p>
            </div>

            <div className="reveal fade-up-delay-1">
              <div style={{ background: 'var(--clr-surface-2)', border: '1px solid var(--clr-border)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-2xl)', display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)' }}>
                <div>
                  <div style={{ fontSize: '1.5rem', marginBottom: 'var(--space-sm)' }}>&#127919;</div>
                  <h4 style={{ marginBottom: '6px', color: 'var(--clr-primary)' }}>Our Mission</h4>
                  <p style={{ fontSize: '0.9rem' }}>To deliver writing, research and advisory services of the highest quality, enabling our clients to achieve their academic, professional and business objectives with clarity and confidence.</p>
                </div>
                <div>
                  <div style={{ fontSize: '1.5rem', marginBottom: 'var(--space-sm)' }}>&#128301;</div>
                  <h4 style={{ marginBottom: '6px', color: 'var(--clr-primary)' }}>Our Vision</h4>
                  <p style={{ fontSize: '0.9rem' }}>To be the most trusted specialist writing and advisory partner for ambitious individuals and organisations worldwide, recognised for excellence, discretion and transformative results.</p>
                </div>
                <div>
                  <div style={{ fontSize: '1.5rem', marginBottom: 'var(--space-sm)' }}>&#128161;</div>
                  <h4 style={{ marginBottom: '6px', color: 'var(--clr-primary)' }}>Our Approach</h4>
                  <p style={{ fontSize: '0.9rem' }}>We combine deep subject-matter expertise with genuinely personalised service. Every engagement is tailored to your specific context, objectives and audience. We do not apply templates. We apply thinking.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <style>{`@media(max-width:800px){.about-intro-grid{grid-template-columns:1fr!important}}`}</style>

      {/* What We Do */}
      <section className="section section-alt">
        <div className="container">
          <div className="text-center" style={{ marginBottom: 'var(--space-2xl)' }}>
            <span className="section-label">Our Expertise</span>
            <h2 className="reveal">What We Do</h2>
            <p className="reveal" style={{ maxWidth: '58ch', marginInline: 'auto', marginTop: '0.75rem' }}>Four specialist service areas. One integrated team. A single point of accountability for every engagement.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 'var(--space-lg)', maxWidth: '900px', marginInline: 'auto' }} className="expertise-grid reveal">

            <div style={{ background: 'var(--clr-surface)', border: '1px solid var(--clr-border)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-xl)' }}>
              <div style={{ fontSize: '1.6rem', marginBottom: 'var(--space-sm)' }}>&#128302;</div>
              <h4 style={{ marginBottom: '8px' }}>Research and Academic Enquiry</h4>
              <p style={{ fontSize: '0.875rem', color: 'var(--clr-text-muted)' }}>Dissertation support, academic writing, data analysis and research advisory for scholars and institutions at every stage.</p>
            </div>

            <div style={{ background: 'var(--clr-surface)', border: '1px solid var(--clr-border)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-xl)' }}>
              <div style={{ fontSize: '1.6rem', marginBottom: 'var(--space-sm)' }}>&#128640;</div>
              <h4 style={{ marginBottom: '8px' }}>Digital Transformation and Automation</h4>
              <p style={{ fontSize: '0.875rem', color: 'var(--clr-text-muted)' }}>End-to-end transformation roadmaps, automation strategy and process modernisation for enterprises ready to scale.</p>
            </div>

            <div style={{ background: 'var(--clr-surface)', border: '1px solid var(--clr-border)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-xl)' }}>
              <div style={{ fontSize: '1.6rem', marginBottom: 'var(--space-sm)' }}>&#129489;&#8205;&#128187;</div>
              <h4 style={{ marginBottom: '8px' }}>Ed-Tech Services</h4>
              <p style={{ fontSize: '0.875rem', color: 'var(--clr-text-muted)' }}>LMS development, interactive content design and educational technology strategy for institutions and learners worldwide.</p>
            </div>

            <div style={{ background: 'var(--clr-surface)', border: '1px solid var(--clr-border)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-xl)' }}>
              <div style={{ fontSize: '1.6rem', marginBottom: 'var(--space-sm)' }}>&#128202;</div>
              <h4 style={{ marginBottom: '8px' }}>Product Management</h4>
              <p style={{ fontSize: '0.875rem', color: 'var(--clr-text-muted)' }}>Strategic product advisory, roadmap development and go-to-market support for teams building the next generation of products.</p>
            </div>

          </div>
          <div className="text-center" style={{ marginTop: 'var(--space-2xl)' }}>
            <Link href="/services" className="btn btn-outline">View All Services</Link>
          </div>
        </div>
      </section>

      <style>{`@media(max-width:500px){.expertise-grid{grid-template-columns:1fr!important}}`}</style>

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
              <div className="value-icon">&#127757;</div>
              <div className="value-content">
                <h4>Global Client Base</h4>
                <p>The majority of our clients are based in the UK, Canada, the United States and across Europe. We operate to international standards and understand international expectations.</p>
              </div>
            </div>
            <div className="value-card reveal fade-up-delay-1">
              <div className="value-icon">&#128274;</div>
              <div className="value-content">
                <h4>Complete Confidentiality</h4>
                <p>Discretion is fundamental to how we operate. Every engagement is protected by strict confidentiality. We sign NDAs without hesitation and never disclose client relationships or project details.</p>
              </div>
            </div>
            <div className="value-card reveal fade-up-delay-2">
              <div className="value-icon">&#11088;</div>
              <div className="value-content">
                <h4>Uncompromising Quality</h4>
                <p>We hold ourselves to a standard that makes revision requests rare. Every deliverable goes through rigorous internal review before it reaches you.</p>
              </div>
            </div>
            <div className="value-card reveal">
              <div className="value-icon">&#127919;</div>
              <div className="value-content">
                <h4>Deep Specialisation</h4>
                <p>We do not attempt to be generalists. Our team is composed of specialists, each with extensive real-world expertise in their service area. You work with people who genuinely know the field.</p>
              </div>
            </div>
            <div className="value-card reveal fade-up-delay-1">
              <div className="value-icon">&#129309;</div>
              <div className="value-content">
                <h4>Partnership Mindset</h4>
                <p>We do not simply execute briefs. We engage with your goals, challenge assumptions where needed and bring strategic thinking to every engagement, not just execution.</p>
              </div>
            </div>
            <div className="value-card reveal fade-up-delay-2">
              <div className="value-icon">&#9200;&#65039;</div>
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 'var(--space-xl)', counterReset: 'steps' }} className="process-grid reveal">

            <div style={{ textAlign: 'center', padding: 'var(--space-xl) var(--space-lg)' }}>
              <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'var(--clr-primary)', color: '#fff', fontFamily: 'var(--font-serif)', fontSize: '1.3rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--space-lg)' }}>1</div>
              <h4 style={{ marginBottom: '8px' }}>Discovery</h4>
              <p style={{ fontSize: '0.875rem', color: 'var(--clr-text-muted)' }}>We start with a thorough discovery call to understand your goals, context and what success looks like for you.</p>
            </div>

            <div style={{ textAlign: 'center', padding: 'var(--space-xl) var(--space-lg)' }}>
              <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'var(--clr-primary)', color: '#fff', fontFamily: 'var(--font-serif)', fontSize: '1.3rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--space-lg)' }}>2</div>
              <h4 style={{ marginBottom: '8px' }}>Proposal</h4>
              <p style={{ fontSize: '0.875rem', color: 'var(--clr-text-muted)' }}>We deliver a tailored proposal with a clear scope, timeline, deliverables and investment. No vague estimates.</p>
            </div>

            <div style={{ textAlign: 'center', padding: 'var(--space-xl) var(--space-lg)' }}>
              <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'var(--clr-primary)', color: '#fff', fontFamily: 'var(--font-serif)', fontSize: '1.3rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--space-lg)' }}>3</div>
              <h4 style={{ marginBottom: '8px' }}>Execution</h4>
              <p style={{ fontSize: '0.875rem', color: 'var(--clr-text-muted)' }}>Our specialists get to work. You receive progress updates at agreed milestones and have direct access to your project lead.</p>
            </div>

            <div style={{ textAlign: 'center', padding: 'var(--space-xl) var(--space-lg)' }}>
              <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'var(--clr-accent)', color: '#fff', fontFamily: 'var(--font-serif)', fontSize: '1.3rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--space-lg)' }}>4</div>
              <h4 style={{ marginBottom: '8px' }}>Delivery</h4>
              <p style={{ fontSize: '0.875rem', color: 'var(--clr-text-muted)' }}>We deliver on time, to specification, with post-delivery support included. Most client relationships extend well beyond the first project.</p>
            </div>

          </div>
        </div>
      </section>

      <style>{`@media(max-width:800px){.process-grid{grid-template-columns:repeat(2,1fr)!important}}@media(max-width:500px){.process-grid{grid-template-columns:1fr!important}}`}</style>

      {/* CTA */}
      <section className="cta-banner">
        <div className="container">
          <h2>Ready to Work with a Team That Gets It Right?</h2>
          <p>Tell us about your project. We will respond within one business day.</p>
          <div className="cta-banner-btns">
            <Link href="/contact" className="btn btn-accent btn-lg">Start a Conversation</Link>
            <Link href="/services" className="btn btn-white btn-lg">Our Services</Link>
          </div>
        </div>
      </section>
    </>
  )
}
