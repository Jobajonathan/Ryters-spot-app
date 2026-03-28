'use client'

import { useState } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

const serviceData: Record<string, {
  icon: string
  title: string
  tagline: string
  description: string
  features: { title: string; desc: string }[]
  offerings: { name: string; desc: string }[]
  personas: string[]
  ctaLabel: string
  relatedSlugs: string[]
}> = {
  'ai-automation': {
    icon: '🤖',
    title: 'AI Automation',
    tagline: 'Intelligent automation for the modern enterprise.',
    description: 'We help organisations harness the power of artificial intelligence to automate workflows, reduce operational costs and build sustainable competitive advantage at scale.',
    features: [
      { title: 'AI Strategy & Roadmapping', desc: 'We assess your current operations and design a practical AI adoption roadmap that aligns with your business goals — no hype, just actionable strategy.' },
      { title: 'Workflow Automation', desc: 'Identify and automate repetitive, high-volume processes across your organisation. From document processing to customer communications and internal approvals.' },
      { title: 'LLM Integration & Deployment', desc: 'Integrate large language models (GPT-4, Claude, Gemini) into your products, internal tools and workflows — securely and responsibly.' },
      { title: 'AI Training & Enablement', desc: 'Upskill your team to understand, work with and govern AI systems confidently. Bespoke training programmes for technical and non-technical staff.' },
    ],
    offerings: [
      { name: 'AI Readiness Assessment', desc: 'A structured audit of your processes, data and infrastructure to identify the highest-value AI opportunities.' },
      { name: 'Automation POC & Pilot', desc: 'Build and validate a proof of concept before committing to full-scale deployment.' },
      { name: 'Full AI Implementation', desc: 'End-to-end delivery from scoping through deployment, testing and handover.' },
      { name: 'Ongoing AI Advisory', desc: 'Retained advisory support as your AI capability matures and scales.' },
    ],
    personas: ['Enterprise Businesses', 'SMEs & Startups', 'Government Agencies', 'Financial Services'],
    ctaLabel: 'Start Your AI Journey',
    relatedSlugs: ['product-management', 'edtech'],
  },

  'edtech': {
    icon: '🎓',
    title: 'EdTech Services',
    tagline: 'Transforming how organisations teach, learn and develop.',
    description: 'We design and deploy educational technology solutions that help institutions and organisations deliver learning at scale — engaging, accessible and measurable.',
    features: [
      { title: 'LMS Design & Deployment', desc: 'Full learning management system strategy, configuration, content migration and rollout. Moodle, Canvas, TalentLMS, custom platforms and more.' },
      { title: 'Interactive Content Development', desc: 'SCORM-compliant eLearning modules, video-based learning, assessments and gamified content built to your curriculum and brand.' },
      { title: 'eLearning Platform Strategy', desc: 'We help you define the right technology stack, vendor selection, and digital learning architecture for your institution.' },
      { title: 'Digital Assessment Design', desc: 'Secure, scalable online assessment systems — from formative quizzes to high-stakes examinations.' },
    ],
    offerings: [
      { name: 'EdTech Audit & Strategy', desc: 'Review your current learning technology landscape and build a prioritised transformation plan.' },
      { name: 'LMS Implementation', desc: 'End-to-end LMS setup, configuration, and training for administrators and learners.' },
      { name: 'Content Development', desc: 'Bespoke eLearning content created by instructional designers and subject matter experts.' },
      { name: 'EdTech Training', desc: 'Upskill educators and trainers to use digital tools effectively and confidently.' },
    ],
    personas: ['Universities & Colleges', 'Corporate L&D Teams', 'Government Training Bodies', 'EdTech Startups'],
    ctaLabel: 'Transform Your Learning Environment',
    relatedSlugs: ['ai-automation', 'writing'],
  },

  'writing': {
    icon: '📖',
    title: 'Writing & Research',
    tagline: 'Expert writing and research for academics, businesses and institutions.',
    description: 'From doctoral dissertations to corporate content strategy, our team of specialist writers, researchers and analysts delivers work of the highest standard — on time, every time.',
    features: [
      { title: 'Academic Writing Support', desc: 'Specialist support for postgraduate students, PhD candidates and researchers. Dissertation writing, editing, proofreading and advisory.' },
      { title: 'Content Strategy & Creation', desc: 'Research-backed content that builds authority, drives traffic and converts readers into clients. Blogs, whitepapers, case studies and reports.' },
      { title: 'Data Analysis & Interpretation', desc: 'Quantitative and qualitative data analysis using SPSS, R, NVivo and Python. Clear interpretation and presentation of complex findings.' },
      { title: 'Research & Literature Review', desc: 'Comprehensive systematic reviews, annotated bibliographies and research synthesis for academic and commercial purposes.' },
    ],
    offerings: [
      { name: 'Dissertation & Thesis Support', desc: 'Structured support from proposal through submission — writing, editing, methodology and viva preparation.' },
      { name: 'Journal Article Preparation', desc: 'Transform your research into publication-ready manuscripts for peer-reviewed journals.' },
      { name: 'Corporate Content Packages', desc: 'Monthly content creation and strategy retainers for businesses looking to build thought leadership.' },
      { name: 'Turnitin & Plagiarism Review', desc: 'Pre-submission integrity checks and editing to ensure your work is original and compliant.' },
    ],
    personas: ['PhD & Postgraduate Students', 'Academic Researchers', 'Businesses & Brands', 'Publishers & NGOs'],
    ctaLabel: 'Get Writing & Research Support',
    relatedSlugs: ['edtech', 'product-management'],
  },

  'product-management': {
    icon: '🚀',
    title: 'Product & Project Management',
    tagline: 'From strategy to launch — delivering products and projects that matter.',
    description: 'We partner with product teams, executives and founders to define, build and ship products and projects that delight users and deliver real business outcomes.',
    features: [
      { title: 'Product Strategy & Roadmapping', desc: 'Define your product vision, set objectives, prioritise features and build a clear roadmap that aligns stakeholders and guides your team.' },
      { title: 'Agile Delivery & PMO', desc: 'Experienced scrum masters, agile coaches and project managers embedded in your team or working as an external PMO function.' },
      { title: 'User Research & Validation', desc: 'Qualitative and quantitative research to validate assumptions, understand user needs and inform product decisions with confidence.' },
      { title: 'Go-to-Market Planning', desc: 'Launch strategy, positioning, pricing and messaging that gives your product the best chance of market success.' },
    ],
    offerings: [
      { name: 'Product Discovery Sprint', desc: 'A structured 2–4 week engagement to clarify your product opportunity and define the MVP scope.' },
      { name: 'Agile Delivery Partner', desc: 'Embedded project management and agile facilitation for your delivery team.' },
      { name: 'Product Leadership Advisory', desc: 'Fractional CPO or Head of Product support for growing organisations.' },
      { name: 'Post-Launch Optimisation', desc: 'Analytics, user feedback loops and iteration planning after your product goes live.' },
    ],
    personas: ['Founders & Startups', 'Enterprise Product Teams', 'Technology Companies', 'Government Digital Teams'],
    ctaLabel: 'Start Your Product Journey',
    relatedSlugs: ['ai-automation', 'writing'],
  },
}

const slugTitles: Record<string, string> = {
  'ai-automation': 'AI Automation',
  'edtech': 'EdTech Services',
  'writing': 'Writing & Research',
  'product-management': 'Product & Project Management',
}

export default function ServicePage({ params }: { params: { slug: string } }) {
  const service = serviceData[params.slug]
  if (!service) notFound()

  const [activeFeature, setActiveFeature] = useState(0)

  return (
    <>
      <style>{`
        .svc-hero {
          background: linear-gradient(135deg, var(--clr-primary) 0%, var(--clr-primary-mid, #1B4332) 60%, var(--clr-primary-light, #2D6A4F) 100%);
          padding: 5rem 0 4rem; color: #fff;
        }
        .svc-hero-inner { max-width: 720px; }
        .svc-hero-badge {
          display: inline-flex; align-items: center; gap: 0.5rem;
          background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.2);
          padding: 0.4rem 1rem; border-radius: 100px;
          font-size: 0.82rem; font-weight: 600; color: rgba(255,255,255,0.9);
          margin-bottom: 1.5rem; letter-spacing: 0.04em;
        }
        .svc-hero h1 { font-family: var(--font-serif); font-size: clamp(2rem, 4vw, 3rem); font-weight: 700; color: #fff; margin-bottom: 1rem; line-height: 1.2; }
        .svc-hero-tagline { font-size: 1.15rem; color: rgba(255,255,255,0.75); margin-bottom: 1.25rem; line-height: 1.7; }
        .svc-hero-desc { font-size: 1rem; color: rgba(255,255,255,0.6); line-height: 1.8; margin-bottom: 2rem; }
        .svc-hero-btns { display: flex; gap: 1rem; flex-wrap: wrap; }
        .svc-persona-bar { background: rgba(255,255,255,0.06); border-top: 1px solid rgba(255,255,255,0.1); padding: 1rem 0; margin-top: 2.5rem; }
        .svc-persona-bar-inner { display: flex; align-items: center; gap: 1.25rem; flex-wrap: wrap; }
        .svc-persona-label { font-size: 0.78rem; color: rgba(255,255,255,0.5); text-transform: uppercase; letter-spacing: 0.08em; font-weight: 600; white-space: nowrap; }
        .svc-persona-tag { background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.15); padding: 0.35rem 0.9rem; border-radius: 100px; font-size: 0.82rem; color: rgba(255,255,255,0.8); }

        .feat-section { padding: 5rem 0; }
        .feat-grid { display: grid; grid-template-columns: 280px 1fr; gap: 3rem; align-items: start; margin-top: 3rem; }
        .feat-tab-list { display: flex; flex-direction: column; gap: 0.4rem; }
        .feat-tab-btn {
          text-align: left; padding: 0.9rem 1.25rem;
          background: transparent; border: 1px solid var(--clr-border);
          border-radius: var(--radius-md); cursor: pointer; font-size: 0.9rem;
          font-weight: 500; color: var(--clr-text-muted);
          transition: all 0.2s; font-family: inherit; line-height: 1.4;
        }
        .feat-tab-btn:hover { border-color: var(--clr-primary-light); color: var(--clr-text); }
        .feat-tab-btn.active { background: var(--clr-primary); color: #fff; border-color: var(--clr-primary); font-weight: 600; }
        .feat-content { background: var(--clr-bg-alt); border-radius: var(--radius-lg); padding: 2.5rem; }
        .feat-content h3 { font-family: var(--font-serif); font-size: 1.4rem; color: var(--clr-text); margin-bottom: 1rem; }
        .feat-content p { color: var(--clr-text-muted); line-height: 1.8; font-size: 1rem; }

        .offerings-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1.5rem; margin-top: 2.5rem; }
        .offering-card { background: var(--clr-bg); border: 1px solid var(--clr-border); border-radius: var(--radius-lg); padding: 1.75rem; }
        .offering-num { font-size: 0.75rem; font-weight: 700; color: var(--clr-primary-light); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 0.75rem; }
        .offering-name { font-family: var(--font-serif); font-size: 1.05rem; font-weight: 700; color: var(--clr-text); margin-bottom: 0.6rem; }
        .offering-desc { font-size: 0.88rem; color: var(--clr-text-muted); line-height: 1.7; }

        .related-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-top: 2rem; }
        .related-card { display: flex; align-items: center; gap: 0.75rem; padding: 1rem 1.25rem; background: var(--clr-bg-alt); border: 1px solid var(--clr-border); border-radius: var(--radius-md); text-decoration: none; color: var(--clr-text); font-weight: 500; font-size: 0.9rem; transition: border-color 0.2s; }
        .related-card:hover { border-color: var(--clr-primary-light); }

        @media (max-width: 768px) {
          .feat-grid { grid-template-columns: 1fr; gap: 1.5rem; }
          .feat-tab-list { flex-direction: row; flex-wrap: wrap; }
          .feat-tab-btn { flex: 1; min-width: 140px; text-align: center; font-size: 0.82rem; }
        }
      `}</style>

      {/* ── HERO ── */}
      <section className="svc-hero">
        <div className="container">
          <div className="svc-hero-inner">
            <div className="svc-hero-badge">
              <span>{service.icon}</span>
              <span>Ryters Spot · {service.title}</span>
            </div>
            <h1>{service.title}</h1>
            <p className="svc-hero-tagline">{service.tagline}</p>
            <p className="svc-hero-desc">{service.description}</p>
            <div className="svc-hero-btns">
              <Link href="/contact" className="btn btn-accent btn-lg">{service.ctaLabel}</Link>
              <Link href="/services" className="btn btn-lg" style={{ background: 'rgba(255,255,255,0.12)', color: '#fff', borderColor: 'rgba(255,255,255,0.3)' }}>All Services</Link>
            </div>
          </div>

          <div className="svc-persona-bar">
            <div className="svc-persona-bar-inner">
              <span className="svc-persona-label">Who this is for:</span>
              {service.personas.map(p => (
                <span key={p} className="svc-persona-tag">{p}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES (tabbed) ── */}
      <section className="feat-section section-alt" aria-labelledby="feat-heading">
        <div className="container">
          <span className="section-label">What We Deliver</span>
          <h2 className="section-heading" id="feat-heading">Our {service.title} Capabilities</h2>

          <div className="feat-grid">
            <div className="feat-tab-list">
              {service.features.map((f, i) => (
                <button
                  key={i}
                  className={`feat-tab-btn${activeFeature === i ? ' active' : ''}`}
                  onClick={() => setActiveFeature(i)}
                >
                  {f.title}
                </button>
              ))}
            </div>
            <div className="feat-content">
              <h3>{service.features[activeFeature].title}</h3>
              <p>{service.features[activeFeature].desc}</p>
              <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--clr-border)' }}>
                <Link href="/contact" className="btn btn-primary btn-sm">Enquire About This →</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── OFFERINGS ── */}
      <section className="section" aria-labelledby="offerings-heading">
        <div className="container">
          <div className="text-center">
            <span className="section-label">How We Engage</span>
            <h2 className="section-heading" id="offerings-heading">Service Packages</h2>
            <p className="section-sub" style={{ marginInline: 'auto' }}>We offer flexible engagement models to suit your organisation's needs, timeline and budget.</p>
          </div>
          <div className="offerings-grid">
            {service.offerings.map((o, i) => (
              <div key={i} className="offering-card">
                <div className="offering-num">Option {String(i + 1).padStart(2, '0')}</div>
                <div className="offering-name">{o.name}</div>
                <div className="offering-desc">{o.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cta-banner" aria-label="Get started">
        <div className="container">
          <h2>{service.ctaLabel}</h2>
          <p>Talk to one of our specialists today. We will assess your needs and recommend the right approach for your organisation.</p>
          <div className="cta-banner-btns">
            <Link href="/contact" className="btn btn-accent btn-lg">Book a Free Consultation</Link>
            <Link href="/dashboard/request" className="btn btn-white btn-lg">Submit a Request</Link>
          </div>
        </div>
      </section>

      {/* ── RELATED SERVICES ── */}
      <section className="section section-alt" aria-labelledby="related-heading">
        <div className="container">
          <h2 className="section-heading" id="related-heading" style={{ marginBottom: '0.5rem' }}>Explore Related Services</h2>
          <p style={{ color: 'var(--clr-text-muted)', marginBottom: '0' }}>Many of our clients combine services for greater impact.</p>
          <div className="related-grid">
            {service.relatedSlugs.map(slug => (
              <Link key={slug} href={`/services/${slug}`} className="related-card">
                <span style={{ fontSize: '1.25rem' }}>{serviceData[slug]?.icon}</span>
                <span>{slugTitles[slug]}</span>
                <span style={{ marginLeft: 'auto', color: 'var(--clr-primary-light)' }}>→</span>
              </Link>
            ))}
            <Link href="/services" className="related-card">
              <span style={{ fontSize: '1.25rem' }}>🗂️</span>
              <span>All Services</span>
              <span style={{ marginLeft: 'auto', color: 'var(--clr-primary-light)' }}>→</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
