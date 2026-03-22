'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import SocialAuth from '@/components/SocialAuth'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const supabase = createClient()
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password })
      if (authError) {
        setError(authError.message)
      } else {
        router.push('/dashboard')
        router.refresh()
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
          flex: 1; display: flex; align-items: center; justify-content: center;
          padding: 3rem 2rem; background: var(--clr-bg);
        }
        .auth-form-box { width: 100%; max-width: 420px; }
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
        [data-theme="dark"] .auth-error { background: rgba(197,48,48,0.15); border-color: rgba(197,48,48,0.4); color: #fc8181; }
        .auth-link-row { text-align: center; font-size: 0.875rem; color: var(--clr-text-muted); margin-top: 1rem; }
        .auth-link-row a { color: var(--clr-primary-light); font-weight: 600; }
        .pw-wrap { position: relative; }
        .pw-toggle { position: absolute; right: 0.75rem; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; color: var(--clr-text-muted); font-size: 0.8rem; padding: 0; }
        .spin { display: inline-block; animation: spin 0.8s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 768px) { .auth-panel-left { display: none; } .auth-panel-right { padding: 2rem 1.25rem; } }
      `}</style>

      <div className="auth-split">
        <div className="auth-panel-left">
          <Link href="/" style={{ textDecoration: 'none' }}>
            <div className="auth-brand-logo">Ryters Spot</div>
          </Link>
          <p className="auth-brand-tagline">Your specialist partner for research, digital transformation, Ed-Tech and product management.</p>
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
            <h1 className="auth-heading">Welcome back</h1>
            <p className="auth-subheading">Sign in to your Ryters Spot client portal.</p>

            <SocialAuth mode="login" />

            {error && <div className="auth-error">{error}</div>}

            <form onSubmit={handleSubmit} noValidate>
              <div className="form-group">
                <label className="form-label" htmlFor="email">Email Address</label>
                <input className="form-control" type="email" id="email"
                  value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com" required autoComplete="email" />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="password" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Password</span>
                  <Link href="/forgot-password" style={{ fontSize: '0.82rem', color: 'var(--clr-primary-light)', fontWeight: 500 }}>Forgot password?</Link>
                </label>
                <div className="pw-wrap">
                  <input className="form-control" type={showPassword ? 'text' : 'password'} id="password"
                    value={password} onChange={(e) => setPassword(e.target.value)}
                    placeholder="Your password" required autoComplete="current-password"
                    style={{ paddingRight: '3.5rem' }} />
                  <button type="button" className="pw-toggle" onClick={() => setShowPassword(p => !p)}>
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              <button type="submit" className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center', padding: '0.9rem', marginTop: '0.5rem' }}
                disabled={loading}>
                {loading ? <><span className="spin">&#9696;</span>&nbsp; Signing in...</> : 'Sign In'}
              </button>
            </form>

            <p className="auth-link-row" style={{ marginTop: '1.25rem' }}>
              Do not have an account? <Link href="/signup">Create one free</Link>
            </p>

            <div style={{ marginTop: '2rem', paddingTop: '1.25rem', borderTop: '1px solid var(--clr-border)', textAlign: 'center' }}>
              <Link href="/" style={{ fontSize: '0.85rem', color: 'var(--clr-text-muted)' }}>&#8592; Back to Ryters Spot</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
