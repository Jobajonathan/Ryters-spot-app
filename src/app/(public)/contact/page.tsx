'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: form.name,
          email: form.email,
          message: form.message,
          inquiry_type: 'general',
        }),
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
      <style>{`
        .contact-simple {
          min-height: 80vh;
          display: flex;
          align-items: center;
          padding: 5rem 0;
        }
        .contact-simple-inner {
          max-width: 560px;
          margin: 0 auto;
          width: 100%;
        }
        .contact-simple-inner .eyebrow {
          margin-bottom: 1rem;
        }
        .contact-simple-inner h1 {
          font-size: clamp(2rem, 5vw, 2.8rem);
          font-weight: 800;
          line-height: 1.1;
          letter-spacing: -0.03em;
          margin-bottom: 0.75rem;
        }
        .contact-simple-inner .sub {
          color: var(--clr-text-muted);
          font-size: 1rem;
          line-height: 1.7;
          margin-bottom: 2.5rem;
        }
        .simple-form { display: flex; flex-direction: column; gap: 1.25rem; }
        .simple-form label {
          display: block;
          font-size: 0.8rem;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--clr-text-subtle);
          margin-bottom: 0.4rem;
        }
        .simple-form input,
        .simple-form textarea {
          width: 100%;
          background: var(--clr-surface);
          border: 1.5px solid var(--clr-border);
          border-radius: 10px;
          padding: 0.85rem 1rem;
          font-size: 0.95rem;
          color: var(--clr-text);
          outline: none;
          transition: border-color 0.2s;
          font-family: inherit;
        }
        .simple-form input:focus,
        .simple-form textarea:focus {
          border-color: var(--clr-primary);
        }
        .simple-form textarea { min-height: 130px; resize: vertical; }
        .simple-form .send-btn {
          width: 100%;
          justify-content: center;
          padding: 0.9rem;
          margin-top: 0.5rem;
        }
        .simple-form .privacy-note {
          text-align: center;
          font-size: 0.72rem;
          color: var(--clr-text-subtle);
          margin-top: 0.5rem;
        }
        .simple-form .privacy-note a { color: var(--clr-primary-light); }
        .success-box {
          text-align: center;
          padding: 3rem 1rem;
        }
        .success-box .check {
          font-size: 2.5rem;
          color: var(--clr-primary);
          margin-bottom: 1rem;
        }
        .success-box h3 { margin-bottom: 0.5rem; }
        .success-box p { color: var(--clr-text-muted); font-size: 0.95rem; margin-bottom: 1.5rem; }
        .wa-alt {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          justify-content: center;
          margin-top: 2rem;
          font-size: 0.85rem;
          color: var(--clr-text-muted);
        }
        .wa-alt a {
          color: #25D366;
          font-weight: 600;
          text-decoration: none;
        }
        .wa-alt a:hover { text-decoration: underline; }
        @media (max-width: 600px) {
          .contact-simple { padding: 3rem 0; }
        }
      `}</style>

      <section className="contact-simple">
        <div className="container">
          <div className="contact-simple-inner">
            <p className="eyebrow">Get in touch</p>
            <h1>Talk to Us</h1>
            <p className="sub">Leave us a message and we will get back to you within one business day.</p>

            {status === 'success' ? (
              <div className="success-box">
                <div className="check">&#10003;</div>
                <h3>Message received.</h3>
                <p>Thank you for reaching out. We will be in touch shortly.</p>
                <button className="btn btn-outline btn-sm" onClick={() => { setStatus('idle'); setForm({ name: '', email: '', message: '' }) }}>
                  Send another message
                </button>
              </div>
            ) : (
              <form className="simple-form" onSubmit={handleSubmit} noValidate>
                {status === 'error' && (
                  <div style={{ background: '#fff5f5', border: '1px solid #feb2b2', color: '#c53030', padding: '0.85rem 1rem', borderRadius: '8px', fontSize: '0.875rem' }}>
                    {errorMsg}
                  </div>
                )}

                <div>
                  <label htmlFor="name">Your Name</label>
                  <input id="name" name="name" type="text" placeholder="e.g. Amara Okonkwo" required value={form.name} onChange={handleChange} autoComplete="name" />
                </div>

                <div>
                  <label htmlFor="email">Email Address</label>
                  <input id="email" name="email" type="email" placeholder="you@email.com" required value={form.email} onChange={handleChange} autoComplete="email" />
                </div>

                <div>
                  <label htmlFor="message">Message</label>
                  <textarea id="message" name="message" placeholder="Tell us what you need help with..." required value={form.message} onChange={handleChange} />
                </div>

                <button type="submit" className="btn btn-accent send-btn" disabled={status === 'loading'}>
                  {status === 'loading' ? 'Sending...' : 'Send Message'}
                </button>

                <p className="privacy-note">
                  We will never share your data. <Link href="/privacy">Privacy Policy</Link>
                </p>
              </form>
            )}

            <p className="wa-alt">
              Prefer to chat? <a href="https://wa.me/2347062057116" target="_blank" rel="noopener noreferrer">Message us on WhatsApp</a>
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
