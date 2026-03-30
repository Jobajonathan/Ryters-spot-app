'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function Footer() {
  const [email, setEmail] = useState('')
  const [subStatus, setSubStatus] = useState<'idle' | 'loading' | 'success' | 'error' | 'exists'>('idle')
  const [subMsg, setSubMsg] = useState('')
  const [content, setContent] = useState<Record<string, string>>({})

  useEffect(() => {
    fetch('/api/content')
      .then(r => r.json())
      .then(data => setContent(data))
      .catch(() => {})
  }, [])

  function c(key: string, fallback: string) { return content[key] || fallback }

  async function handleSubscribe(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setSubStatus('loading')
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'footer' }),
      })
      const data = await res.json()
      if (res.status === 409) {
        setSubStatus('exists')
        setSubMsg('You are already subscribed!')
      } else if (!res.ok) {
        setSubStatus('error')
        setSubMsg(data.error || 'Something went wrong.')
      } else {
        setSubStatus('success')
        setEmail('')
      }
    } catch {
      setSubStatus('error')
      setSubMsg('Could not subscribe. Please try again.')
    }
  }

  const linkedinUrl = c('social_linkedin', '')
  const twitterUrl = c('social_twitter', '')
  const facebookUrl = c('social_facebook', '')
  const instagramUrl = c('social_instagram', '')

  return (
    <footer className="footer" role="contentinfo">
      <div className="container">
        <div className="footer-grid footer-grid--compact">

          <div className="footer-brand">
            <div className="footer-logo">
              <img src="/images/logo.png" alt="Ryters Spot" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
              <span className="footer-logo-text">Ryters Spot</span>
            </div>
            <p className="footer-tagline">{c('footer_tagline', 'Specialist research, technology and advisory services for organisations and scholars worldwide.')}</p>
            <div className="footer-social">
              <a className="footer-social-link" href={linkedinUrl || '#'} aria-label="LinkedIn" target={linkedinUrl ? '_blank' : undefined} rel={linkedinUrl ? 'noopener noreferrer' : undefined}>in</a>
              <a className="footer-social-link" href={twitterUrl || '#'} aria-label="Twitter/X" target={twitterUrl ? '_blank' : undefined} rel={twitterUrl ? 'noopener noreferrer' : undefined}>&#120143;</a>
              <a className="footer-social-link" href={facebookUrl || '#'} aria-label="Facebook" target={facebookUrl ? '_blank' : undefined} rel={facebookUrl ? 'noopener noreferrer' : undefined}>f</a>
              <a className="footer-social-link" href={instagramUrl || '#'} aria-label="Instagram" target={instagramUrl ? '_blank' : undefined} rel={instagramUrl ? 'noopener noreferrer' : undefined}>ig</a>
            </div>
            <div className="footer-newsletter">
              <p className="footer-newsletter-label">Get fortnightly insights, free</p>
              {subStatus === 'success' ? (
                <div style={{ background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.4)', borderRadius: '8px', padding: '10px 14px', fontSize: '0.85rem', color: '#C9A84C' }}>
                  &#10003; You are subscribed! Check your inbox for a welcome email.
                </div>
              ) : (
                <>
                  <form className="footer-newsletter-form" aria-label="Newsletter signup" noValidate onSubmit={handleSubscribe}>
                    <input
                      type="email"
                      className="footer-newsletter-input"
                      placeholder="Your email address"
                      required
                      aria-label="Email address"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      disabled={subStatus === 'loading'}
                    />
                    <button type="submit" className="btn btn-accent btn-sm" disabled={subStatus === 'loading'}>
                      {subStatus === 'loading' ? '...' : 'Subscribe'}
                    </button>
                  </form>
                  {(subStatus === 'error' || subStatus === 'exists') && (
                    <p style={{ fontSize: '0.78rem', color: subStatus === 'exists' ? '#C9A84C' : '#fc8181', marginTop: '6px' }}>{subMsg}</p>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="footer-col">
            <h5>Services</h5>
            <ul className="footer-links" role="list">
              <li><Link className="footer-link" href="/services#academic">Research and Academic Enquiry</Link></li>
              <li><Link className="footer-link" href="/services#digital-transformation">Digital Transformation</Link></li>
              <li><Link className="footer-link" href="/services#edtech">Ed-Tech Services</Link></li>
              <li><Link className="footer-link" href="/services#product-management">Product Management</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h5>Company</h5>
            <ul className="footer-links" role="list">
              <li><Link className="footer-link" href="/about">About Us</Link></li>
              <li><Link className="footer-link" href="/blog">Blog &amp; Insights</Link></li>
              <li><Link className="footer-link" href="/contact">Contact Us</Link></li>
              <li><Link className="footer-link" href="/login">Client Portal</Link></li>
              <li><Link className="footer-link" href="/privacy">Privacy Policy</Link></li>
              <li><Link className="footer-link" href="/terms">Terms of Service</Link></li>
            </ul>
            <div style={{ marginTop: '1.25rem', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1.25rem' }}>
              <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.45)', marginBottom: '0.4rem' }}>{c('contact_address', 'Abuja, Nigeria')}</p>
              <p style={{ fontSize: '0.78rem', marginBottom: '0.4rem' }}>
                <a href={`mailto:${c('contact_email', 'hello@theryters.com')}`} style={{ color: 'rgba(255,255,255,0.55)' }}>{c('contact_email', 'hello@theryters.com')}</a>
              </p>
              <p style={{ fontSize: '0.78rem' }}>
                <a href={`tel:${c('contact_phone', '+234 706 205 7116').replace(/\s/g, '')}`} style={{ color: 'rgba(255,255,255,0.55)' }}>{c('contact_phone', '+234 706 205 7116')}</a>
              </p>
            </div>
          </div>

        </div>

        <div className="footer-bottom">
          <p>&copy; 2026 Ryters Spot Limited. All rights reserved.</p>
          <div className="footer-bottom-links">
            <Link className="footer-bottom-link" href="/privacy">Privacy</Link>
            <Link className="footer-bottom-link" href="/terms">Terms</Link>
            <Link className="footer-bottom-link" href="/privacy#cookies">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
