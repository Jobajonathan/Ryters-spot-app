'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const supabase = createClient()
      const { error: authError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000') + '/reset-password',
      })
      if (authError) {
        setError(authError.message)
      } else {
        setSent(true)
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
        .forgot-wrap {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--clr-bg);
          padding: 2rem 1.25rem;
        }
        .forgot-card {
          width: 100%;
          max-width: 420px;
          background: var(--clr-surface);
          border: 1px solid var(--clr-border);
          border-radius: var(--radius-xl);
          padding: 2.5rem;
          box-shadow: var(--shadow-lg);
        }
        .forgot-logo {
          font-family: var(--font-serif);
          font-size: 1.4rem;
          font-weight: 700;
          color: var(--clr-primary);
          margin-bottom: 1.5rem;
          display: block;
          text-decoration: none;
        }
        .forgot-heading { font-family: var(--font-serif); font-size: 1.5rem; color: var(--clr-text); margin-bottom: 0.5rem; }
        .forgot-sub { font-size: 0.9rem; color: var(--clr-text-muted); margin-bottom: 2rem; line-height: 1.6; }
        .forgot-success { background: #f0fff4; border: 1px solid #9ae6b4; color: #276749; padding: 1rem 1.25rem; border-radius: var(--radius-md); font-size: 0.9rem; margin-bottom: 1.5rem; }
        .forgot-error { background: #fff5f5; border: 1px solid #feb2b2; color: #c53030; padding: 0.75rem 1rem; border-radius: var(--radius-md); font-size: 0.875rem; margin-bottom: 1.25rem; }
        [data-theme="dark"] .forgot-success { background: rgba(39,103,73,0.2); border-color: rgba(39,103,73,0.5); color: #9ae6b4; }
        [data-theme="dark"] .forgot-error { background: rgba(197,48,48,0.15); border-color: rgba(197,48,48,0.4); color: #fc8181; }
        .spin { display: inline-block; animation: spin 0.8s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <div className="forgot-wrap">
        <div className="forgot-card">
          <Link href="/" className="forgot-logo">Ryters Spot</Link>

          <h1 className="forgot-heading">Reset your password</h1>
          <p className="forgot-sub">Enter your account email and we will send you a reset link.</p>

          {error && <div className="forgot-error">{error}</div>}

          {sent ? (
            <div className="forgot-success">
              If that email is registered, you will receive a password reset link shortly. Please check your inbox and spam folder.
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              <div className="form-group">
                <label className="form-label" htmlFor="email">Email Address</label>
                <input
                  className="form-control"
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '0.9rem' }} disabled={loading}>
                {loading ? <span className="spin">&#9696;</span> : 'Send Reset Link'}
              </button>
            </form>
          )}

          <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <Link href="/login" style={{ fontSize: '0.875rem', color: 'var(--clr-primary-light)' }}>&#8592; Back to Login</Link>
          </div>
        </div>
      </div>
    </>
  )
}
