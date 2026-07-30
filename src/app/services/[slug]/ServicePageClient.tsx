'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { ServiceData } from './page'

const slugTitles: Record<string, string> = {
  'ai-automation': 'Research Automation',
  edtech: 'Learning Product Development',
  writing: 'Research and Knowledge Products',
  'product-management': 'Product Development',
}

export default function ServicePageClient({ service }: { slug: string; service: ServiceData }) {
  const [activeFeature, setActiveFeature] = useState(0)

  return (
    <>
      <header className="page-hero liquid-page-hero">
        <div className="container">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span className="breadcrumb-sep">/</span>
            <Link href="/services">Capabilities</Link>
            <span className="breadcrumb-sep">/</span>
            <span>{service.title}</span>
          </nav>
          <p className="rpd-kicker">{service.label}</p>
          <h1>{service.title}</h1>
          <p>{service.tagline}</p>
          <p>{service.description}</p>
          <div className="liquid-actions">
            <Link href="/contact" className="btn btn-accent btn-lg">{service.ctaLabel}</Link>
            <Link href="/services" className="btn btn-liquid btn-lg">All capabilities</Link>
          </div>
        </div>
      </header>

      <section className="section">
        <div className="container split-section">
          <div>
            <p className="rpd-kicker">What We Develop</p>
            <h2>Capability areas inside this service.</h2>
            <div className="service-tags">
              {service.personas.map((persona) => <span key={persona}>{persona}</span>)}
            </div>
          </div>
          <div className="liquid-glass feature-panel">
            <div className="feature-tabs">
              {service.features.map((feature, index) => (
                <button key={feature.title} className={activeFeature === index ? 'active' : ''} onClick={() => setActiveFeature(index)}>
                  {feature.title}
                </button>
              ))}
            </div>
            <div className="feature-copy">
              <h3>{service.features[activeFeature].title}</h3>
              <p>{service.features[activeFeature].desc}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <div className="section-intro">
            <p className="rpd-kicker">Engagement Formats</p>
            <h2>Ways to work with us.</h2>
          </div>
          <div className="pillar-grid">
            {service.offerings.map((offering, index) => (
              <article className="liquid-glass pillar-card" key={offering.name}>
                <span>0{index + 1}</span>
                <h3>{offering.name}</h3>
                <p>{offering.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-deep">
        <div className="container liquid-cta liquid-cta-dark">
          <p className="rpd-kicker">Related R&amp;PD Capabilities</p>
          <h2>Combine capabilities when the work needs it.</h2>
          <div className="related-links">
            {service.relatedSlugs.map((slug) => <Link key={slug} href={`/services/${slug}`}>{slugTitles[slug]}</Link>)}
            <Link href="/contact">Start a project</Link>
          </div>
        </div>
      </section>
    </>
  )
}
