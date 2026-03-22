'use client'

import Link from 'next/link'
import { useScrollReveal } from '@/hooks/useScrollReveal'

export default function ServicesPage() {
  useScrollReveal()

  return (
    <>
      <header className="page-hero">
        <div className="container">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span className="breadcrumb-sep">&#8250;</span>
            <span>Services</span>
          </nav>
          <h1>Our Services</h1>
          <p>Four specialist service areas. One trusted partner. Discover how Ryters Spot can help you write better, think strategically and achieve more.</p>
        </div>
      </header>

      {/* Service Nav Pills */}
      <div style={{ background: 'var(--clr-surface)', borderBottom: '1px solid var(--clr-border)', position: 'sticky', top: '72px', zIndex: 90, overflowX: 'auto' }}>
        <div className="container">
          <div style={{ display: 'flex', gap: '4px', padding: '0.75rem 0', whiteSpace: 'nowrap' }}>
            <a href="#academic" style={{ padding: '0.4rem 0.9rem', borderRadius: '100px', fontSize: '0.82rem', fontWeight: 500, color: 'var(--clr-text-muted)', transition: 'all 0.2s', textDecoration: 'none', border: '1px solid var(--clr-border)' }}>Research &amp; Academic</a>
            <a href="#digital-transformation" style={{ padding: '0.4rem 0.9rem', borderRadius: '100px', fontSize: '0.82rem', fontWeight: 500, color: 'var(--clr-text-muted)', transition: 'all 0.2s', textDecoration: 'none', border: '1px solid var(--clr-border)' }}>Digital Transformation</a>
            <a href="#edtech" style={{ padding: '0.4rem 0.9rem', borderRadius: '100px', fontSize: '0.82rem', fontWeight: 500, color: 'var(--clr-text-muted)', transition: 'all 0.2s', textDecoration: 'none', border: '1px solid var(--clr-border)' }}>Ed-Tech</a>
            <a href="#product-management" style={{ padding: '0.4rem 0.9rem', borderRadius: '100px', fontSize: '0.82rem', fontWeight: 500, color: 'var(--clr-text-muted)', transition: 'all 0.2s', textDecoration: 'none', border: '1px solid var(--clr-border)' }}>Product Management</a>
          </div>
        </div>
      </div>

      {/* 1. Research and Academic Enquiry */}
      <section className="section section-alt" id="academic" aria-labelledby="acad-heading">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4xl)', alignItems: 'center' }} className="svc-grid svc-grid-reverse">
            <div className="reveal fade-up-delay-1" style={{ order: 2 }}>
              <span className="section-label">Service 01</span>
              <h2 id="acad-heading" style={{ marginBottom: 'var(--space-md)' }}>Research and Academic Enquiry</h2>
              <p style={{ marginBottom: 'var(--space-lg)' }}>We support postgraduate students, researchers and institutions across the UK, Canada, the US and beyond with rigorous, high-quality academic writing and research advisory. Our team brings deep subject-matter expertise across the social sciences, management, STEM and humanities.</p>
              <div style={{ display: 'flex', gap: 'var(--space-md)', flexWrap: 'wrap', marginTop: 'var(--space-xl)' }}>
                <Link href="/contact" className="btn btn-primary">Request This Service</Link>
                <Link href="/contact" className="btn btn-ghost">Book a Consultation</Link>
              </div>
            </div>
            <div className="reveal" style={{ order: 1 }}>
              <div style={{ background: 'var(--clr-surface)', border: '1px solid var(--clr-border)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-2xl)' }}>
                <h4 style={{ marginBottom: 'var(--space-lg)', fontSize: '1rem', color: 'var(--clr-text-muted)', fontFamily: 'var(--font-sans)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>What is Included</h4>
                <ul className="service-detail-list">
                  <li>Research proposal development and refinement</li>
                  <li>Literature review writing and synthesis</li>
                  <li>Research methodology design and justification</li>
                  <li>Quantitative and qualitative data analysis</li>
                  <li>Academic ghostwriting and editing</li>
                  <li>Dissertation and thesis advisory</li>
                  <li>Journal article preparation and submission support</li>
                  <li>APA, Harvard, MLA and Chicago citations</li>
                </ul>
                <div style={{ marginTop: 'var(--space-lg)', paddingTop: 'var(--space-lg)', borderTop: '1px solid var(--clr-border)' }}>
                  <p style={{ fontSize: '0.8rem', color: 'var(--clr-text-subtle)', marginBottom: '6px', fontWeight: 600 }}>BEST FOR</p>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{ background: 'var(--clr-surface-2)', padding: '4px 10px', borderRadius: '100px', fontSize: '0.75rem', color: 'var(--clr-primary-light)', fontWeight: 600 }}>Postgraduates</span>
                    <span style={{ background: 'var(--clr-surface-2)', padding: '4px 10px', borderRadius: '100px', fontSize: '0.75rem', color: 'var(--clr-primary-light)', fontWeight: 600 }}>Researchers</span>
                    <span style={{ background: 'var(--clr-surface-2)', padding: '4px 10px', borderRadius: '100px', fontSize: '0.75rem', color: 'var(--clr-primary-light)', fontWeight: 600 }}>Institutions</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Digital Transformation */}
      <section className="section" id="digital-transformation" aria-labelledby="dt-heading">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4xl)', alignItems: 'center' }} className="svc-grid">
            <div className="reveal">
              <span className="section-label">Service 02</span>
              <h2 id="dt-heading" style={{ marginBottom: 'var(--space-md)' }}>Digital Transformation and Automation</h2>
              <p style={{ marginBottom: 'var(--space-lg)' }}>We help organisations develop and execute transformation roadmaps that modernise operations, embed automation and build the digital capabilities needed to compete in a fast-moving environment. We have guided organisations across banking, healthcare, education and manufacturing through complex transformation programmes.</p>
              <div style={{ display: 'flex', gap: 'var(--space-md)', flexWrap: 'wrap', marginTop: 'var(--space-xl)' }}>
                <Link href="/contact" className="btn btn-primary">Request This Service</Link>
                <Link href="/contact" className="btn btn-ghost">Book a Consultation</Link>
              </div>
            </div>
            <div className="reveal fade-up-delay-1">
              <div style={{ background: 'var(--clr-surface)', border: '1px solid var(--clr-border)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-2xl)' }}>
                <h4 style={{ marginBottom: 'var(--space-lg)', fontSize: '1rem', color: 'var(--clr-text-muted)', fontFamily: 'var(--font-sans)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>What is Included</h4>
                <ul className="service-detail-list">
                  <li>Digital maturity assessment and benchmarking</li>
                  <li>Transformation strategy and roadmap design</li>
                  <li>Technology selection and vendor advisory</li>
                  <li>Process automation and workflow redesign</li>
                  <li>Change management and culture transformation</li>
                  <li>Data strategy and analytics capability building</li>
                  <li>Digital governance and security frameworks</li>
                  <li>Post-transformation monitoring and optimisation</li>
                </ul>
                <div style={{ marginTop: 'var(--space-lg)', paddingTop: 'var(--space-lg)', borderTop: '1px solid var(--clr-border)' }}>
                  <p style={{ fontSize: '0.8rem', color: 'var(--clr-text-subtle)', marginBottom: '6px', fontWeight: 600 }}>BEST FOR</p>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{ background: 'var(--clr-surface-2)', padding: '4px 10px', borderRadius: '100px', fontSize: '0.75rem', color: 'var(--clr-primary-light)', fontWeight: 600 }}>Enterprises</span>
                    <span style={{ background: 'var(--clr-surface-2)', padding: '4px 10px', borderRadius: '100px', fontSize: '0.75rem', color: 'var(--clr-primary-light)', fontWeight: 600 }}>Governments</span>
                    <span style={{ background: 'var(--clr-surface-2)', padding: '4px 10px', borderRadius: '100px', fontSize: '0.75rem', color: 'var(--clr-primary-light)', fontWeight: 600 }}>Institutions</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Ed-Tech Services */}
      <section className="section section-alt" id="edtech" aria-labelledby="edtech-heading">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4xl)', alignItems: 'center' }} className="svc-grid svc-grid-reverse">
            <div className="reveal fade-up-delay-1" style={{ order: 2 }}>
              <span className="section-label">Service 03</span>
              <h2 id="edtech-heading" style={{ marginBottom: 'var(--space-md)' }}>Ed-Tech Services</h2>
              <p style={{ marginBottom: 'var(--space-lg)' }}>We help educational institutions and organisations leverage technology to transform how they teach, assess and deliver learning. Our Ed-Tech services bridge pedagogy and technology, making innovation practical, scalable and impactful for institutions worldwide.</p>
              <div style={{ display: 'flex', gap: 'var(--space-md)', flexWrap: 'wrap', marginTop: 'var(--space-xl)' }}>
                <Link href="/contact" className="btn btn-primary">Request This Service</Link>
                <Link href="/contact" className="btn btn-ghost">Book a Consultation</Link>
              </div>
            </div>
            <div className="reveal" style={{ order: 1 }}>
              <div style={{ background: 'var(--clr-surface)', border: '1px solid var(--clr-border)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-2xl)' }}>
                <h4 style={{ marginBottom: 'var(--space-lg)', fontSize: '1rem', color: 'var(--clr-text-muted)', fontFamily: 'var(--font-sans)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>What is Included</h4>
                <ul className="service-detail-list">
                  <li>Ed-Tech strategy and needs assessment</li>
                  <li>Digital classroom setup and facilitation tools</li>
                  <li>Virtual and hybrid learning design</li>
                  <li>LMS selection setup and customisation</li>
                  <li>Teacher and faculty digital upskilling</li>
                  <li>Student information system integration</li>
                  <li>Gamification and adaptive learning solutions</li>
                  <li>Institutional digital transformation advisory</li>
                </ul>
                <div style={{ marginTop: 'var(--space-lg)', paddingTop: 'var(--space-lg)', borderTop: '1px solid var(--clr-border)' }}>
                  <p style={{ fontSize: '0.8rem', color: 'var(--clr-text-subtle)', marginBottom: '6px', fontWeight: 600 }}>BEST FOR</p>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{ background: 'var(--clr-surface-2)', padding: '4px 10px', borderRadius: '100px', fontSize: '0.75rem', color: 'var(--clr-primary-light)', fontWeight: 600 }}>Universities</span>
                    <span style={{ background: 'var(--clr-surface-2)', padding: '4px 10px', borderRadius: '100px', fontSize: '0.75rem', color: 'var(--clr-primary-light)', fontWeight: 600 }}>Schools</span>
                    <span style={{ background: 'var(--clr-surface-2)', padding: '4px 10px', borderRadius: '100px', fontSize: '0.75rem', color: 'var(--clr-primary-light)', fontWeight: 600 }}>Training Organisations</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Product Management */}
      <section className="section" id="product-management" aria-labelledby="pm-heading">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4xl)', alignItems: 'center' }} className="svc-grid">
            <div className="reveal">
              <span className="section-label">Service 04</span>
              <h2 id="pm-heading" style={{ marginBottom: 'var(--space-md)' }}>Product Management</h2>
              <p style={{ marginBottom: 'var(--space-lg)' }}>Building great products requires more than good ideas. It demands sharp strategy, user empathy and disciplined execution. We help founders, product leaders and enterprises define, develop and deliver products that win in the market.</p>
              <div style={{ display: 'flex', gap: 'var(--space-md)', flexWrap: 'wrap', marginTop: 'var(--space-xl)' }}>
                <Link href="/contact" className="btn btn-primary">Request This Service</Link>
                <Link href="/contact" className="btn btn-ghost">Book a Consultation</Link>
              </div>
            </div>
            <div className="reveal fade-up-delay-1">
              <div style={{ background: 'var(--clr-surface)', border: '1px solid var(--clr-border)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-2xl)' }}>
                <h4 style={{ marginBottom: 'var(--space-lg)', fontSize: '1rem', color: 'var(--clr-text-muted)', fontFamily: 'var(--font-sans)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>What is Included</h4>
                <ul className="service-detail-list">
                  <li>Product discovery and opportunity validation</li>
                  <li>User research and persona development</li>
                  <li>Product roadmap development</li>
                  <li>Feature prioritisation and backlog management</li>
                  <li>Go-to-market strategy and launch planning</li>
                  <li>Product-market fit analysis</li>
                  <li>OKR and KPI frameworks for product teams</li>
                  <li>Product documentation and writing</li>
                </ul>
                <div style={{ marginTop: 'var(--space-lg)', paddingTop: 'var(--space-lg)', borderTop: '1px solid var(--clr-border)' }}>
                  <p style={{ fontSize: '0.8rem', color: 'var(--clr-text-subtle)', marginBottom: '6px', fontWeight: 600 }}>BEST FOR</p>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{ background: 'var(--clr-surface-2)', padding: '4px 10px', borderRadius: '100px', fontSize: '0.75rem', color: 'var(--clr-primary-light)', fontWeight: 600 }}>Startups</span>
                    <span style={{ background: 'var(--clr-surface-2)', padding: '4px 10px', borderRadius: '100px', fontSize: '0.75rem', color: 'var(--clr-primary-light)', fontWeight: 600 }}>Product Teams</span>
                    <span style={{ background: 'var(--clr-surface-2)', padding: '4px 10px', borderRadius: '100px', fontSize: '0.75rem', color: 'var(--clr-primary-light)', fontWeight: 600 }}>Enterprises</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style>{`@media(max-width:800px){.svc-grid{grid-template-columns:1fr!important}.svc-grid-reverse>*{order:unset!important}}`}</style>

      {/* CTA */}
      <section className="cta-banner">
        <div className="container">
          <h2>Not Sure Which Service You Need?</h2>
          <p>Tell us about your challenge and we will recommend the right solution, with no obligation.</p>
          <div className="cta-banner-btns">
            <Link href="/contact" className="btn btn-accent btn-lg">Get a Free Consultation</Link>
            <Link href="/about" className="btn btn-white btn-lg">About Our Team</Link>
          </div>
        </div>
      </section>
    </>
  )
}
