'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', project: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
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
          service: form.project,
          message: form.message,
          inquiry_type: 'rpd_project',
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
    <section className="section contact-liquid-page">
      <div className="container contact-liquid-grid">
        <div>
          <p className="rpd-kicker">Start a Project</p>
          <h1>Tell us what you want to research, build or develop.</h1>
          <p>Send a short brief. We will review the context and respond with the clearest next step within one business day.</p>
          <div className="contact-liquid-details liquid-glass">
            <p><strong>Email</strong><a href="mailto:hello@theryters.com">hello@theryters.com</a></p>
            <p><strong>WhatsApp</strong><a href="https://wa.me/2347062057116" target="_blank" rel="noopener noreferrer">+234 706 205 7116</a></p>
            <p><strong>Mode</strong><span>Remote-first. Confidential by default.</span></p>
          </div>
        </div>

        <div className="liquid-glass contact-form-card">
          {status === 'success' ? (
            <div className="empty-state">
              <h2>Message received.</h2>
              <p>Thank you. We will be in touch shortly.</p>
              <button className="btn btn-liquid" onClick={() => { setStatus('idle'); setForm({ name: '', email: '', project: '', message: '' }) }}>Send another</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              {status === 'error' && <div className="form-error">{errorMsg}</div>}
              <label htmlFor="name">Name</label>
              <input id="name" name="name" value={form.name} onChange={handleChange} required autoComplete="name" placeholder="Your name" />

              <label htmlFor="email">Email</label>
              <input id="email" name="email" type="email" value={form.email} onChange={handleChange} required autoComplete="email" placeholder="you@company.com" />

              <label htmlFor="project">Project type</label>
              <select id="project" name="project" value={form.project} onChange={handleChange}>
                <option value="">Select one</option>
                <option>Research Intelligence</option>
                <option>Product Development</option>
                <option>Knowledge Product or System</option>
                <option>Not sure yet</option>
              </select>

              <label htmlFor="message">Brief</label>
              <textarea id="message" name="message" value={form.message} onChange={handleChange} required placeholder="What is the outcome, timeline and current state of the work?" />

              <button type="submit" className="btn btn-accent btn-lg" disabled={status === 'loading'}>{status === 'loading' ? 'Sending...' : 'Send project enquiry'}</button>
              <p className="liquid-form-note">By submitting, you agree to our <Link href="/privacy">Privacy Policy</Link>.</p>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
