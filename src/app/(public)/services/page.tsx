'use client'

import Link from 'next/link'
import { useScrollReveal } from '@/hooks/useScrollReveal'

const services = [
  {
    id: 'writing',
    kicker: 'Capability 01',
    title: 'Writing and research advisory',
    text: 'For clients who need serious ideas translated into persuasive, well-structured work. We support academic, professional, executive and organisational writing with research discipline and editorial judgment.',
    included: [
      'Research design, synthesis and advisory',
      'Academic writing, editing and dissertation support',
      'Executive thought leadership and strategic documents',
      'Reports, proposals, articles and long-form content',
      'Confidential editorial support for high-stakes work',
    ],
    bestFor: ['Professionals', 'Postgraduates', 'Founders', 'Executives'],
  },
  {
    id: 'product-management',
    kicker: 'Capability 02',
    title: 'Product and project management',
    text: 'For teams that need clarity, momentum and disciplined delivery. We help shape products, organise projects, align stakeholders and turn ambition into usable outcomes.',
    included: [
      'Product discovery and opportunity framing',
      'Roadmaps, requirements and delivery planning',
      'Project coordination, PMO support and reporting',
      'Go-to-market planning and launch readiness',
      'Documentation for stakeholders, teams and users',
    ],
    bestFor: ['Startups', 'Product teams', 'SMEs', 'Institutions'],
  },
  {
    id: 'digital-systems',
    kicker: 'Capability 03',
    title: 'Digital systems and automation',
    text: 'For organisations modernising how work gets done. We design practical transformation roadmaps, automation opportunities and learning technology systems that improve operations.',
    included: [
      'AI automation strategy and workflow redesign',
      'Digital transformation roadmap development',
      'EdTech strategy, LMS setup and content systems',
      'Technology selection and implementation support',
      'Process documentation and change enablement',
    ],
    bestFor: ['Organisations', 'Schools', 'NGOs', 'Operators'],
  },
]

export default function ServicesPage() {
  useScrollReveal()

  return (
    <>
      <header className="page-hero editorial-hero">
        <div className="container">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span className="breadcrumb-sep">/</span>
            <span>Services</span>
          </nav>
          <p className="eyebrow">Services</p>
          <h1>Hire us for the work that needs judgment.</h1>
          <p>We have reduced the offer to three clear capabilities: writing authority, product delivery and digital systems.</p>
        </div>
      </header>

      <nav className="service-anchor-bar" aria-label="Service sections">
        <div className="container">
          {services.map((service) => <a key={service.id} href={`#${service.id}`}>{service.title}</a>)}
        </div>
      </nav>

      <section className="section">
        <div className="container service-stack">
          {services.map((service, index) => (
            <article className="service-suite reveal" id={service.id} key={service.id}>
              <div>
                <p className="eyebrow">{service.kicker}</p>
                <h2>{service.title}</h2>
                <p>{service.text}</p>
                <div className="service-tags">
                  {service.bestFor.map((tag) => <span key={tag}>{tag}</span>)}
                </div>
              </div>
              <div className="deliverable-card">
                <h3>Typical deliverables</h3>
                <ul className="service-detail-list">
                  {service.included.map((item) => <li key={item}>{item}</li>)}
                </ul>
                <Link href="/contact" className={`btn ${index === 0 ? 'btn-accent' : 'btn-primary'}`}>Discuss this work</Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section section-ink">
        <div className="container cta-panel cta-panel-dark">
          <p className="eyebrow">Need more than one capability?</p>
          <h2>Most client work crosses categories. That is where we are strongest.</h2>
          <p>Bring the full context. We will shape the right scope and recommend a focused engagement.</p>
          <Link href="/contact" className="btn btn-accent btn-lg">Start a confidential enquiry</Link>
        </div>
      </section>
    </>
  )
}
