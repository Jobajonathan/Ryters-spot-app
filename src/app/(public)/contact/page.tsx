'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useScrollReveal } from '@/hooks/useScrollReveal'

export default function ContactPage() {
  useScrollReveal()

  const [form, setForm] = useState({
    first_name: '', last_name: '', email: '', phone: '',
    organization: '', inquiry_type: '', service: '', message: '', newsletter_opt: false
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const target = e.target as HTMLInputElement
    setForm(prev => ({
      ...prev,
      [target.name]: target.type === 'checkbox' ? target.checked : target.value
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) {
        setStatus('error')
        setErrorMsg(data.error || 'Something went wrong. Please try again.')
      } else {
        setStatus('success')
      }
    } catch {
      setStatus('error')
      setErrorMsg('Could not send your message. Please try again.')
    }
  }

  return (
    <>
      <header className="page-hero">
        <div className="container">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span className="breadcrumb-sep">&#8250;</span>
            <span>Contact</span>
          </nav>
          <h1>Let us Start a Conversation</h1>
          <p>Whether you have a project in mind, a question about our services or want to explore a partnership, we would love to hear from you.</p>
        </div>
      </header>

      <section className="section">
        <div className="container">
          <div className="contact-grid">

            <div>
              <span className="section-label">Get In Touch</span>
              <h2 style={{ marginBottom: 'var(--space-lg)' }}>We are Here to Help</h2>
              <p style={{ marginBottom: 'var(--space-2xl)' }}>We are a global platform — available across all time zones. Our team responds to every enquiry within 24 hours. For urgent matters, please indicate this in your message.</p>

              <div className="contact-info-item reveal">
                <div className="contact-info-icon">&#128205;</div>
                <div>
                  <p className="contact-info-label">Our Office</p>
                  <p className="contact-info-val">Abuja, Nigeria<br /><span style={{ fontSize: '0.85rem', color: 'var(--clr-text-muted)' }}>Serving clients in the UK, Canada, USA and Europe</span></p>
                </div>
              </div>

              <div className="contact-info-item reveal">
                <div className="contact-info-icon">&#128231;</div>
                <div>
                  <p className="contact-info-label">Email</p>
                  <p className="contact-info-val"><a href="mailto:hello@theryters.com" style={{ color: 'var(--clr-primary-light)' }}>hello@theryters.com</a></p>
                </div>
              </div>

              <div className="contact-info-item reveal">
                <div className="contact-info-icon">&#128222;</div>
                <div>
                  <p className="contact-info-label">Phone / WhatsApp</p>
                  <p className="contact-info-val"><a href="tel:+2347062057116" style={{ color: 'var(--clr-primary-light)' }}>+234 706 205 7116</a></p>
                </div>
              </div>

              <div className="contact-info-item reveal">
                <div className="contact-info-icon">🌍</div>
                <div>
                  <p className="contact-info-label">Availability</p>
                  <p className="contact-info-val">Available globally, across all time zones<br /><span style={{ fontSize: '0.85rem', color: 'var(--clr-text-muted)' }}>We respond to every enquiry within 24 hours</span></p>
                </div>
              </div>

              <div style={{ marginTop: 'var(--space-2xl)' }}>
                <p style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--clr-text-subtle)', marginBottom: 'var(--space-md)' }}>Follow Us</p>
                <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
                  <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '0.5rem 1rem', border: '1px solid var(--clr-border)', borderRadius: 'var(--radius-md)', fontSize: '0.82rem', color: 'var(--clr-text-muted)', transition: 'all 0.2s', textDecoration: 'none' }} aria-label="LinkedIn">in LinkedIn</a>
                  <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '0.5rem 1rem', border: '1px solid var(--clr-border)', borderRadius: 'var(--radius-md)', fontSize: '0.82rem', color: 'var(--clr-text-muted)', transition: 'all 0.2s', textDecoration: 'none' }} aria-label="Twitter">&#120143; Twitter</a>
                </div>
              </div>
            </div>

            <div className="reveal fade-up-delay-1">
              <div className="form-card">
                <h3 style={{ marginBottom: 'var(--space-sm)' }}>Send Us a Message</h3>
                <p style={{ fontSize: '0.875rem', marginBottom: 'var(--space-xl)' }}>Fill in the form below and we will get back to you promptly.</p>

                {status === 'success' ? (
                  <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>&#10003;</div>
                    <h4 style={{ fontFamily: 'var(--font-serif)', color: 'var(--clr-primary)', marginBottom: '0.75rem' }}>Message sent successfully!</h4>
                    <p style={{ fontSize: '0.95rem', color: 'var(--clr-text-muted)', marginBottom: '1.5rem' }}>
                      Thank you for reaching out. We have sent a confirmation to your email and will respond within one business day.
                    </p>
                    <button className="btn btn-outline btn-sm" onClick={() => setStatus('idle')}>Send Another Message</button>
                  </div>
                ) : (
                  <form id="contact-form" noValidate aria-label="Contact form" onSubmit={handleSubmit}>

                    {status === 'error' && (
                      <div style={{ background: '#fff5f5', border: '1px solid #feb2b2', color: '#c53030', padding: '0.85rem 1rem', borderRadius: '8px', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
                        {errorMsg}
                      </div>
                    )}

                    <div className="form-grid-2">
                      <div className="form-group">
                        <label className="form-label" htmlFor="first-name">First Name <span style={{ color: '#e53e3e' }}>*</span></label>
                        <input className="form-control" type="text" id="first-name" name="first_name" placeholder="e.g. Adaeze" required autoComplete="given-name" value={form.first_name} onChange={handleChange} />
                      </div>
                      <div className="form-group">
                        <label className="form-label" htmlFor="last-name">Last Name <span style={{ color: '#e53e3e' }}>*</span></label>
                        <input className="form-control" type="text" id="last-name" name="last_name" placeholder="e.g. Okonkwo" required autoComplete="family-name" value={form.last_name} onChange={handleChange} />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="email">Email Address <span style={{ color: '#e53e3e' }}>*</span></label>
                      <input className="form-control" type="email" id="email" name="email" placeholder="you@yourcompany.com" required autoComplete="email" value={form.email} onChange={handleChange} />
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="phone">Phone / WhatsApp</label>
                      <input className="form-control" type="tel" id="phone" name="phone" placeholder="+44 XXX XXX XXXX" autoComplete="tel" value={form.phone} onChange={handleChange} />
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="organization">Organisation / Institution</label>
                      <input className="form-control" type="text" id="organization" name="organization" placeholder="Company or institution name" autoComplete="organization" value={form.organization} onChange={handleChange} />
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="inquiry-type">Type of Inquiry <span style={{ color: '#e53e3e' }}>*</span></label>
                      <select className="form-control" id="inquiry-type" name="inquiry_type" required value={form.inquiry_type} onChange={handleChange}>
                        <option value="" disabled>Select an inquiry type</option>
                        <option value="project">Project Inquiry</option>
                        <option value="consultation">Free Consultation</option>
                        <option value="partnership">Partnership Proposal</option>
                        <option value="academic">Research and Academic Enquiry</option>
                        <option value="digital-transformation">Digital Transformation and Automation</option>
                        <option value="edtech">Ed-Tech Services</option>
                        <option value="product-management">Product Management</option>
                        <option value="general">General Question</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="service">Service of Interest</label>
                      <select className="form-control" id="service" name="service" value={form.service} onChange={handleChange}>
                        <option value="">Select a service</option>
                        <option>Research and Academic Enquiry</option>
                        <option>Digital Transformation and Automation</option>
                        <option>Ed-Tech Services</option>
                        <option>Product Management</option>
                        <option>Multiple Services</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="message">Tell Us More <span style={{ color: '#e53e3e' }}>*</span></label>
                      <textarea className="form-control" id="message" name="message" placeholder="Please describe your project, challenge, or question in as much detail as you like..." required style={{ minHeight: '140px' }} value={form.message} onChange={handleChange}></textarea>
                    </div>

                    <div className="form-group" style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-sm)' }}>
                      <input type="checkbox" id="newsletter-opt" name="newsletter_opt" checked={form.newsletter_opt} onChange={handleChange} style={{ marginTop: '3px', width: '16px', height: '16px', accentColor: 'var(--clr-primary)', flexShrink: 0 }} />
                      <label htmlFor="newsletter-opt" style={{ fontSize: '0.83rem', color: 'var(--clr-text-muted)', cursor: 'pointer' }}>I would like to receive Ryters Spot insights on research, digital transformation and Ed-Tech.</label>
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '0.9rem' }} disabled={status === 'loading'}>
                      {status === 'loading' ? 'Sending...' : 'Send Message'}
                    </button>

                    <p style={{ fontSize: '0.75rem', color: 'var(--clr-text-subtle)', textAlign: 'center', marginTop: 'var(--space-md)' }}>
                      By submitting this form, you agree to our <Link href="/privacy" style={{ color: 'var(--clr-primary-light)', textDecoration: 'underline' }}>Privacy Policy</Link>. We will never share your data.
                    </p>
                  </form>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section section-alt">
        <div className="container">
          <div className="text-center" style={{ marginBottom: 'var(--space-2xl)' }}>
            <span className="section-label">Common Questions</span>
            <h2 className="reveal">Frequently Asked Questions</h2>
          </div>
          <div style={{ maxWidth: '720px', marginInline: 'auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>

            <details style={{ background: 'var(--clr-surface)', border: '1px solid var(--clr-border)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-lg)', cursor: 'pointer' }} className="reveal">
              <summary style={{ fontWeight: 600, color: 'var(--clr-text)', listStyle: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                I am based in the UK, Canada or the US. Can you still work with me?
                <span style={{ color: 'var(--clr-primary-light)', fontSize: '1.2rem' }}>+</span>
              </summary>
              <p style={{ marginTop: 'var(--space-md)', fontSize: '0.9rem' }}>Absolutely. The majority of our clients are located in the UK, Canada, the United States and across Europe. All our services are delivered entirely remotely. We are comfortable working across time zones and adapt our communication to suit your schedule.</p>
            </details>

            <details style={{ background: 'var(--clr-surface)', border: '1px solid var(--clr-border)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-lg)', cursor: 'pointer' }} className="reveal">
              <summary style={{ fontWeight: 600, color: 'var(--clr-text)', listStyle: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                How do you handle confidentiality and NDAs?
                <span style={{ color: 'var(--clr-primary-light)', fontSize: '1.2rem' }}>+</span>
              </summary>
              <p style={{ marginTop: 'var(--space-md)', fontSize: '0.9rem' }}>Confidentiality is not optional for us, it is foundational. We sign NDAs on every engagement where clients require it, and our internal protocols ensure that no project details, client identities or deliverables are ever disclosed.</p>
            </details>

            <details style={{ background: 'var(--clr-surface)', border: '1px solid var(--clr-border)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-lg)', cursor: 'pointer' }} className="reveal">
              <summary style={{ fontWeight: 600, color: 'var(--clr-text)', listStyle: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                What academic support do you provide for students in the UK and Canada?
                <span style={{ color: 'var(--clr-primary-light)', fontSize: '1.2rem' }}>+</span>
              </summary>
              <p style={{ marginTop: 'var(--space-md)', fontSize: '0.9rem' }}>We provide dissertation and thesis support, research design advisory, data analysis, literature reviews, academic writing coaching and full academic ghostwriting. Our specialists are familiar with the standards expected at universities in the UK, Canada, the US and Australia.</p>
            </details>

            <details style={{ background: 'var(--clr-surface)', border: '1px solid var(--clr-border)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-lg)', cursor: 'pointer' }} className="reveal">
              <summary style={{ fontWeight: 600, color: 'var(--clr-text)', listStyle: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                How quickly can you start and what are your turnaround times?
                <span style={{ color: 'var(--clr-primary-light)', fontSize: '1.2rem' }}>+</span>
              </summary>
              <p style={{ marginTop: 'var(--space-md)', fontSize: '0.9rem' }}>Most projects begin within 2 to 3 business days following our initial consultation and signed agreement. Turnaround times vary by project scope, but we are transparent about timelines from the outset.</p>
            </details>

            <details style={{ background: 'var(--clr-surface)', border: '1px solid var(--clr-border)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-lg)', cursor: 'pointer' }} className="reveal">
              <summary style={{ fontWeight: 600, color: 'var(--clr-text)', listStyle: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                How are projects priced and what payment methods do you accept?
                <span style={{ color: 'var(--clr-primary-light)', fontSize: '1.2rem' }}>+</span>
              </summary>
              <p style={{ marginTop: 'var(--space-md)', fontSize: '0.9rem' }}>We price on a project basis, providing a detailed proposal after the discovery call. International payments are accepted via bank transfer, PayPal and other methods convenient for clients in Europe and North America.</p>
            </details>

            <details style={{ background: 'var(--clr-surface)', border: '1px solid var(--clr-border)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-lg)', cursor: 'pointer' }} className="reveal">
              <summary style={{ fontWeight: 600, color: 'var(--clr-text)', listStyle: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                What makes Ryters Spot different from a freelancer or content agency?
                <span style={{ color: 'var(--clr-primary-light)', fontSize: '1.2rem' }}>+</span>
              </summary>
              <p style={{ marginTop: 'var(--space-md)', fontSize: '0.9rem' }}>We are neither a marketplace nor a generalist agency. We are a specialist firm where every engagement is led by an experienced professional with genuine subject-matter expertise. You get consistent quality, direct accountability and a team that invests in understanding your context.</p>
            </details>

          </div>
        </div>
      </section>
    </>
  )
}
