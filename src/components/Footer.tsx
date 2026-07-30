'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function Footer() {
  const [email, setEmail] = useState('')
  const [subStatus, setSubStatus] = useState<'idle' | 'loading' | 'success' | 'error' | 'exists'>('idle')
  const [subMsg, setSubMsg] = useState('')

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
        setSubMsg('You are already subscribed.')
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

  return (
    <footer className="liquid-footer" role="contentinfo">
      <div className="container liquid-footer-grid">
        <div>
          <Link className="liquid-footer-logo" href="/">
            <img src="/images/logo.png" alt="Ryters Spot" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
            <span>Ryters Spot</span>
          </Link>
          <p className="liquid-footer-copy">Research and Product Development for organisations turning ideas into useful assets, systems and products.</p>
          <form className="liquid-newsletter" aria-label="Newsletter signup" noValidate onSubmit={handleSubscribe}>
            {subStatus === 'success' ? (
              <p>Subscribed. Check your inbox.</p>
            ) : (
              <>
                <input value={email} onChange={(e) => setEmail(e.target.value)} disabled={subStatus === 'loading'} type="email" placeholder="Email address" aria-label="Email address" required />
                <button className="btn btn-accent btn-sm" disabled={subStatus === 'loading'}>{subStatus === 'loading' ? '...' : 'Subscribe'}</button>
              </>
            )}
          </form>
          {(subStatus === 'error' || subStatus === 'exists') && <p className="liquid-form-note">{subMsg}</p>}
        </div>

        <div>
          <h5>Capabilities</h5>
          <Link href="/services#research-intelligence">Research Intelligence</Link>
          <Link href="/services#product-development">Product Development</Link>
          <Link href="/services#knowledge-systems">Knowledge Systems</Link>
          <Link href="/contact">Start a Project</Link>
        </div>

        <div>
          <h5>Company</h5>
          <Link href="/about">About</Link>
          <Link href="/blog">Insights</Link>
          <Link href="/login">Client Portal</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
        </div>

        <div>
          <h5>Contact</h5>
          <a href="mailto:hello@theryters.com">hello@theryters.com</a>
          <a href="tel:+2347062057116">+234 706 205 7116</a>
          <span>Abuja, Nigeria</span>
        </div>
      </div>
      <div className="container liquid-footer-bottom">
        <p>&copy; 2026 Ryters Spot Limited. All rights reserved.</p>
        <p>R&amp;PD company serving Africa, Europe and North America.</p>
      </div>
    </footer>
  )
}
