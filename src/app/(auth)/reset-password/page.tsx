'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [sessionReady, setSessionReady] = useState(false)

  useEffect(() => {
    // Verify a session exists (set by /auth/callback after code exchange)
    const supabase = createClient()
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setSessionReady(true)
      } else {
        // No session — link may have expired
        setError('This password reset link has expired or already been used. Please request a new one.')
      }
    })
  }, [])

  function getStrength(pw: string) {
    let score = 0
    if (pw.length >= 8) score++
    if (/[A-Z]/.test(pw)) score++
    if (/[0-9]/.test(pw)) score++
    if (/[^A-Za-z0-9]/.test(pw)) score++
    return score
  }

  const strength = getStrength(password)
  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'][strength]
  const strengthColor = ['', '#e53e3e', '#dd6b20', '#d69e2e', '#38a169'][strength]

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match. Please check and try again.')
      return
    }
    if (strength < 2) {
      setError('Please choose a stronger password. Mix uppercase, numbers and symbols.')
      return
    }

    setLoading(true)
    try {
      const supabase = createClient()
      const { error: updateError } = await supabase.auth.updateUser({ password })
      if (updateError) {
        setError(updateError.message)
      } else {
        setSuccess(true)
        setTimeout(() => router.push('/dashboard'), 3000)
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
        .reset-wrap {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--clr-bg);
          padding: 2rem 1.25rem;
        }
        .reset-card {
          width: 100%;
          max-width: 440px;
          background: var(--clr-surface);
          border: 1px solid var(--clr-border);
          border-radius: var(--radius-xl);
          padding: 2.5rem;
          box-shadow: var(--shadow-lg);
        }
        .reset-logo {
          font-family: var(--font-serif);
          font-size: 1.4rem;
          font-weight: 700;
          color: var(--clr-primary);
          margin-bottom: 1.5rem;
          display: block;
          text-decoration: none;
        }
        .reset-heading { font-family: var(--font-serif); font-size: 1.6rem; color: var(--clr-text); margin: 0 0 0.4rem; }
        .reset-sub { font-size: 0.9rem; color: var(--clr-text-muted); margin: 0 0 2rem; line-height: 1.6; }
        .reset-error { background: #fff5f5; border: 1px solid #feb2b2; color: #c53030; padding: 0.85rem 1rem; border-radius: var(--radius-md); font-size: 0.875rem; margin-bottom: 1.25rem; }
        .reset-success { background: #f0fff4; border: 1px solid #9ae6b4; color: #276749; padding: 1.25rem; border-radius: var(--radius-md); text-align: center; }
        [data-theme="dark"] .reset-error { background: rgba(197,48,48,0.15); border-color: rgba(197,48,48,0.4); color: #fc8181; }
        [data-theme="dark"] .reset-success { background: rgba(39,103,73,0.2); border-color: rgba(39,103,73,0.5); color: #9ae6b4; }
        .pw-wrap { position: relative; }
        .pw-toggle { position: absolute; right: 0.75rem; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; color: var(--clr-text-muted); font-size: 0.8rem; padding: 0; }
        .strength-bar { height: 4px; background: var(--clr-border); border-radius: 4px; margin-top: 0.5rem; overflow: hidden; }
        .strength-fill { height: 100%; border-radius: 4px; transition: width 0.3s, background 0.3s; }
        .strength-label { font-size: 0.78rem; margin-top: 0.35rem; }
        .requirements { font-size: 0.8rem; color: var(--clr-text-muted); margin-top: 0.5rem; line-height: 1.6; }
        .spin { display: inline-block; animation: spin 0.8s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .expired-box { text-align: center; padding: 1rem 0; }
        .expired-icon { font-size: 3rem; margin-bottom: 1rem; }
      `}</style>

      <div className="reset-wrap">
        <div className="reset-card">
          <Link href="/" className="reset-logo">Ryters Spot</Link>

          {success ? (
            <div className="reset-success">
              <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>&#10003;</div>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', margin: '0 0 0.5rem', color: '#276749' }}>Password updated!</h2>
              <p style={{ margin: '0 0 0.5rem', fontSize: '0.9rem' }}>Your password has been changed successfully.</p>
              <p style={{ margin: 0, fontSize: '0.82rem', opacity: 0.8 }}>Redirecting you to your dashboard...</p>
            </div>
          ) : !sessionReady && error ? (
            <div className="expired-box">
              <div className="expired-icon">&#128274;</div>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', color: 'var(--clr-text)', marginBottom: '0.75rem' }}>Link expired</h2>
              <div className="reset-error" style={{ textAlign: 'left' }}>{error}</div>
              <Link href="/forgot-password" className="btn btn-primary" style={{ display: 'inline-flex', justifyContent: 'center', padding: '0.85rem 1.5rem', marginTop: '0.5rem' }}>
                Request New Reset Link
              </Link>
            </div>
          ) : (
            <>
              <h1 className="reset-heading">Set a new password</h1>
              <p className="reset-sub">Choose a strong password to secure your account.</p>

              {error && <div className="reset-error">{error}</div>}

              <form onSubmit={handleSubmit} noValidate>
                <div className="form-group">
                  <label className="form-label" htmlFor="password">New Password</label>
                  <div className="pw-wrap">
                    <input
                      className="form-control"
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="At least 8 characters"
                      required
                      autoComplete="new-password"
                      style={{ paddingRight: '3.5rem' }}
                    />
                    <button type="button" className="pw-toggle" onClick={() => setShowPassword(p => !p)}>
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                  {password && (
                    <>
                      <div className="strength-bar">
                        <div className="strength-fill" style={{ width: `${(strength / 4) * 100}%`, background: strengthColor }} />
                      </div>
                      <div className="strength-label" style={{ color: strengthColor }}>
                        {strengthLabel}
                      </div>
                    </>
                  )}
                  <p className="requirements">Use 8+ characters with uppercase, numbers and symbols for a strong password.</p>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="confirmPassword">Confirm New Password</label>
                  <div className="pw-wrap">
                    <input
                      className="form-control"
                      type={showConfirm ? 'text' : 'password'}
                      id="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat your new password"
                      required
                      autoComplete="new-password"
                      style={{
                        paddingRight: '3.5rem',
                        borderColor: confirmPassword && confirmPassword !== password ? '#feb2b2' : confirmPassword && confirmPassword === password ? '#9ae6b4' : undefined
                      }}
                    />
                    <button type="button" className="pw-toggle" onClick={() => setShowConfirm(p => !p)}>
                      {showConfirm ? 'Hide' : 'Show'}
                    </button>
                  </div>
                  {confirmPassword && confirmPassword === password && (
                    <p style={{ fontSize: '0.8rem', color: '#38a169', marginTop: '0.35rem' }}>&#10003; Passwords match</p>
                  )}
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ width: '100%', justifyContent: 'center', padding: '0.9rem', marginTop: '0.25rem' }}
                  disabled={loading || !sessionReady}
                >
                  {loading ? <><span className="spin">&#9696;</span>&nbsp; Updating password...</> : 'Update Password'}
                </button>
              </form>
            </>
          )}

          <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <Link href="/login" style={{ fontSize: '0.875rem', color: 'var(--clr-primary-light)' }}>&#8592; Back to Login</Link>
          </div>
        </div>
      </div>
    </>
  )
}
