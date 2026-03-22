'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { COUNTRIES } from '@/lib/countries'
import SocialAuth from '@/components/SocialAuth'

export default function SignupPage() {
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', password: '',
    confirmPassword: '', country: '', agreed: false,
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [detectingLocation, setDetectingLocation] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  // Auto-detect country from IP on mount
  useEffect(() => {
    async function detectCountry() {
      try {
        const res = await fetch('https://ipapi.co/json/')
        const data = await res.json()
        if (data.country_name) {
          const match = COUNTRIES.find(c =>
            c.toLowerCase() === data.country_name.toLowerCase()
          )
          if (match) {
            setFormData(prev => ({ ...prev, country: match }))
          }
        }
      } catch {
        // silently fail — user can select manually
      } finally {
        setDetectingLocation(false)
      }
    }
    detectCountry()
  }, [])

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const target = e.target as HTMLInputElement
    setFormData(prev => ({
      ...prev,
      [target.name]: target.type === 'checkbox' ? target.checked : target.value,
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setError('Please enter your full name.')
      return
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    if (!formData.country) {
      setError('Please select your country.')
      return
    }
    if (!formData.agreed) {
      setError('Please agree to the Terms of Service and Privacy Policy.')
      return
    }

    setLoading(true)
    try {
      const supabase = createClient()
      const { error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: `${formData.firstName} ${formData.lastName}`.trim(),
            country: formData.country,
          },
        },
      })
      if (authError) {
        setError(authError.message)
      } else {
        setSuccess(true)
      }
    } catch {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <style>{`
        .auth-split { display: flex; min-height: 100vh; }
        .auth-panel-left {
          flex: 1; background: linear-gradient(135deg, var(--clr-primary) 0%, var(--clr-primary-mid) 60%, var(--clr-primary-light) 100%);
          padding: 3rem; display: flex; flex-direction: column; justify-content: center; color: #fff;
        }
        .auth-panel-right {
          flex: 1; display: flex; align-items: flex-start; justify-content: center;
          padding: 3rem 2rem; background: var(--clr-bg); overflow-y: auto;
        }
        .auth-form-box { width: 100%; max-width: 440px; padding: 1rem 0; }
        .auth-brand-logo { font-family: var(--font-serif); font-size: 2rem; font-weight: 700; color: #fff; margin-bottom: 0.75rem; }
        .auth-brand-tagline { font-size: 1.05rem; color: rgba(255,255,255,0.75); margin-bottom: 2.5rem; line-height: 1.6; }
        .auth-benefit-list { list-style: none; display: flex; flex-direction: column; gap: 1rem; }
        .auth-benefit-list li { display: flex; align-items: center; gap: 0.75rem; font-size: 0.95rem; color: rgba(255,255,255,0.85); }
        .auth-benefit-check {
          width: 24px; height: 24px; background: rgba(201,168,76,0.25); border: 1px solid rgba(201,168,76,0.5);
          border-radius: 50%; display: flex; align-items: center; justify-content: center;
          font-size: 0.75rem; color: #C9A84C; flex-shrink: 0;
        }
        .auth-heading { font-family: var(--font-serif); font-size: 1.75rem; color: var(--clr-text); margin-bottom: 0.5rem; }
        .auth-subheading { font-size: 0.9rem; color: var(--clr-text-muted); margin-bottom: 1.5rem; }
        .auth-error { background: #fff5f5; border: 1px solid #feb2b2; color: #c53030; padding: 0.75rem 1rem; border-radius: var(--radius-md); font-size: 0.875rem; margin-bottom: 1.25rem; }
        .auth-success { background: #f0fff4; border: 1px solid #9ae6b4; color: #276749; padding: 1.25rem; border-radius: var(--radius-md); font-size: 0.9rem; text-align: center; }
        [data-theme="dark"] .auth-error { background: rgba(197,48,48,0.15); border-color: rgba(197,48,48,0.4); color: #fc8181; }
        [data-theme="dark"] .auth-success { background: rgba(39,103,73,0.2); border-color: rgba(39,103,73,0.5); color: #9ae6b4; }
        [data-theme="dark"] .google-btn { background: #2d2d2d !important; border-color: #555 !important; color: #e8eaed !important; }
        .auth-link-row { text-align: center; font-size: 0.875rem; color: var(--clr-text-muted); margin-top: 1rem; }
        .auth-link-row a { color: var(--clr-primary-light); font-weight: 600; }
        .pw-wrap { position: relative; }
        .pw-toggle { position: absolute; right: 0.75rem; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; color: var(--clr-text-muted); font-size: 0.8rem; padding: 0; }
        .country-hint { display: flex; align-items: center; gap: 0.4rem; font-size: 0.78rem; color: var(--clr-text-muted); margin-top: 0.3rem; }
        .spin { display: inline-block; animation: spin 0.8s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 768px) { .auth-panel-left { display: none; } .auth-panel-right { padding: 2rem 1.25rem; align-items: flex-start; } }
      `}</style>

      <div className="auth-split">
        <div className="auth-panel-left">
          <Link href="/" style={{ textDecoration: 'none' }}>
            <div className="auth-brand-logo">Ryters Spot</div>
          </Link>
          <p className="auth-brand-tagline">Join clients across the UK, North America and Europe who trust Ryters Spot for world-class research, strategy and digital expertise.</p>
          <ul className="auth-benefit-list">
            <li><span className="auth-benefit-check">&#10003;</span> Request services instantly from your dashboard</li>
            <li><span className="auth-benefit-check">&#10003;</span> Track project progress in real time</li>
            <li><span className="auth-benefit-check">&#10003;</span> Download your deliverables securely</li>
            <li><span className="auth-benefit-check">&#10003;</span> Manage payments and invoices in one place</li>
            <li><span className="auth-benefit-check">&#10003;</span> Message your project team directly</li>
          </ul>
        </div>

        <div className="auth-panel-right">
          <div className="auth-form-box">
            <h1 className="auth-heading">Create your account</h1>
            <p className="auth-subheading">Join the Ryters Spot client portal — free to sign up.</p>

            {success ? (
              <div className="auth-success">
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>&#128235;</div>
                <strong>Check your email!</strong><br />
                We sent a verification link to <strong>{formData.email}</strong>.<br />
                Click the link to activate your account, then sign in.
                <div style={{ marginTop: '1.25rem' }}>
                  <Link href="/login" className="btn btn-primary" style={{ display: 'inline-flex' }}>Go to Login</Link>
                </div>
              </div>
            ) : (
              <>
                <SocialAuth mode="signup" />

                <form onSubmit={handleSubmit} noValidate>
                  {error && <div className="auth-error">{error}</div>}

                  <div className="form-grid-2">
                    <div className="form-group">
                      <label className="form-label" htmlFor="firstName">First Name <span style={{ color: '#e53e3e' }}>*</span></label>
                      <input className="form-control" type="text" id="firstName" name="firstName"
                        value={formData.firstName} onChange={handleChange}
                        placeholder="First name" required autoComplete="given-name" />
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="lastName">Last Name <span style={{ color: '#e53e3e' }}>*</span></label>
                      <input className="form-control" type="text" id="lastName" name="lastName"
                        value={formData.lastName} onChange={handleChange}
                        placeholder="Last name" required autoComplete="family-name" />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="email">Email Address <span style={{ color: '#e53e3e' }}>*</span></label>
                    <input className="form-control" type="email" id="email" name="email"
                      value={formData.email} onChange={handleChange}
                      placeholder="you@example.com" required autoComplete="email" />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="password">Password <span style={{ color: '#e53e3e' }}>*</span></label>
                    <div className="pw-wrap">
                      <input className="form-control" type={showPassword ? 'text' : 'password'} id="password" name="password"
                        value={formData.password} onChange={handleChange}
                        placeholder="Min. 8 characters" required autoComplete="new-password"
                        style={{ paddingRight: '3.5rem' }} />
                      <button type="button" className="pw-toggle" onClick={() => setShowPassword(p => !p)}>
                        {showPassword ? 'Hide' : 'Show'}
                      </button>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="confirmPassword">Confirm Password <span style={{ color: '#e53e3e' }}>*</span></label>
                    <div className="pw-wrap">
                      <input className="form-control" type={showConfirm ? 'text' : 'password'} id="confirmPassword" name="confirmPassword"
                        value={formData.confirmPassword} onChange={handleChange}
                        placeholder="Repeat password" required autoComplete="new-password"
                        style={{ paddingRight: '3.5rem' }} />
                      <button type="button" className="pw-toggle" onClick={() => setShowConfirm(p => !p)}>
                        {showConfirm ? 'Hide' : 'Show'}
                      </button>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="country">Country <span style={{ color: '#e53e3e' }}>*</span></label>
                    <select className="form-control" id="country" name="country"
                      value={formData.country} onChange={handleChange} required>
                      <option value="" disabled>
                        {detectingLocation ? 'Detecting your location...' : 'Select your country'}
                      </option>
                      {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    {formData.country && !detectingLocation && (
                      <p className="country-hint">
                        <span>&#127758;</span> Auto-detected as <strong>{formData.country}</strong> — change if needed
                      </p>
                    )}
                  </div>

                  <div className="form-group" style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                    <input type="checkbox" id="agreed" name="agreed"
                      checked={formData.agreed} onChange={handleChange}
                      style={{ marginTop: '3px', width: '16px', height: '16px', accentColor: 'var(--clr-primary)', flexShrink: 0 }} />
                    <label htmlFor="agreed" style={{ fontSize: '0.83rem', color: 'var(--clr-text-muted)', cursor: 'pointer' }}>
                      I agree to the <Link href="/terms" style={{ color: 'var(--clr-primary-light)' }}>Terms of Service</Link> and <Link href="/privacy" style={{ color: 'var(--clr-primary-light)' }}>Privacy Policy</Link>
                    </label>
                  </div>

                  <button type="submit" className="btn btn-primary"
                    style={{ width: '100%', justifyContent: 'center', padding: '0.9rem', marginTop: '0.5rem' }}
                    disabled={loading}>
                    {loading ? <><span className="spin">&#9696;</span>&nbsp; Creating account...</> : 'Create Account'}
                  </button>

                  <p className="auth-link-row" style={{ marginTop: '1.25rem' }}>
                    Already have an account? <Link href="/login">Sign in</Link>
                  </p>
                </form>
              </>
            )}

            <div style={{ marginTop: '2rem', paddingTop: '1.25rem', borderTop: '1px solid var(--clr-border)', textAlign: 'center' }}>
              <Link href="/" style={{ fontSize: '0.85rem', color: 'var(--clr-text-muted)' }}>&#8592; Back to Ryters Spot</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
