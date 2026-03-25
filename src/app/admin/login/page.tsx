'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const supabase = createClient()

      const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password })

      if (signInError) {
        if (signInError.message.toLowerCase().includes('invalid') ||
            signInError.message.toLowerCase().includes('credentials')) {
          setError('Invalid email or password.')
        } else if (signInError.message.toLowerCase().includes('not confirmed')) {
          setError('Please verify your email address before logging in.')
        } else {
          setError(signInError.message)
        }
        setLoading(false)
        return
      }

      // Verify the user has admin or superadmin role
      const { data: profile } = await supabase
        .from('profiles')
        .select('role, full_name')
        .eq('id', data.user.id)
        .single()

      if (!profile || !['admin', 'superadmin'].includes(profile.role)) {
        await supabase.auth.signOut()
        setError('This account does not have admin access. Please use the client portal to sign in.')
        setLoading(false)
        return
      }

      router.push('/admin')
      router.refresh()
    } catch {
      setError('An unexpected error occurred. Please try again.')
      setLoading(false)
    }
  }

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0f1a14; }
        .admin-login-wrap {
          min-height: 100vh;
          background: #0f1a14;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem 1.25rem;
          font-family: Arial, sans-serif;
        }
        .admin-login-card {
          width: 100%;
          max-width: 420px;
          background: #1a2e22;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px;
          padding: 2.5rem;
          box-shadow: 0 24px 64px rgba(0,0,0,0.5);
        }
        .admin-login-logo {
          font-family: Georgia, serif;
          font-size: 1.5rem;
          font-weight: 700;
          color: #fff;
          margin-bottom: 0.35rem;
        }
        .admin-login-badge {
          display: inline-block;
          font-size: 0.65rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          background: rgba(201,168,76,0.2);
          color: #C9A84C;
          border: 1px solid rgba(201,168,76,0.35);
          padding: 2px 10px;
          border-radius: 100px;
          margin-bottom: 2rem;
        }
        .admin-login-heading {
          font-family: Georgia, serif;
          font-size: 1.5rem;
          color: #fff;
          margin-bottom: 0.4rem;
        }
        .admin-login-sub {
          font-size: 0.875rem;
          color: rgba(255,255,255,0.45);
          margin-bottom: 1.75rem;
        }
        .admin-form-group { margin-bottom: 1.1rem; }
        .admin-form-label {
          display: block;
          font-size: 0.78rem;
          font-weight: 600;
          color: rgba(255,255,255,0.55);
          margin-bottom: 0.4rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .admin-form-input {
          width: 100%;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 8px;
          padding: 0.75rem 1rem;
          font-size: 0.9rem;
          color: #fff;
          outline: none;
          transition: border-color 0.2s;
        }
        .admin-form-input:focus { border-color: rgba(201,168,76,0.6); }
        .admin-form-input::placeholder { color: rgba(255,255,255,0.25); }
        .pw-wrap { position: relative; }
        .pw-toggle {
          position: absolute;
          right: 0.85rem;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: rgba(255,255,255,0.35);
          font-size: 0.78rem;
          padding: 0;
          font-family: Arial, sans-serif;
        }
        .pw-toggle:hover { color: rgba(255,255,255,0.7); }
        .admin-error {
          background: rgba(197,48,48,0.15);
          border: 1px solid rgba(197,48,48,0.35);
          color: #fc8181;
          padding: 0.75rem 1rem;
          border-radius: 8px;
          font-size: 0.85rem;
          margin-bottom: 1.25rem;
          line-height: 1.5;
        }
        .admin-btn {
          width: 100%;
          background: #1B4332;
          color: #fff;
          font-weight: 700;
          font-size: 0.95rem;
          padding: 0.85rem;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: background 0.2s, opacity 0.2s;
          margin-top: 0.5rem;
          letter-spacing: 0.02em;
        }
        .admin-btn:hover:not(:disabled) { background: #2d6a4f; }
        .admin-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .admin-login-footer {
          margin-top: 2rem;
          padding-top: 1.5rem;
          border-top: 1px solid rgba(255,255,255,0.07);
          text-align: center;
          font-size: 0.8rem;
          color: rgba(255,255,255,0.3);
        }
        .admin-login-footer a { color: rgba(255,255,255,0.45); text-decoration: none; }
        .admin-login-footer a:hover { color: rgba(255,255,255,0.7); }
        .spin { display: inline-block; animation: spin 0.8s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <div className="admin-login-wrap">
        <div className="admin-login-card">
          <div className="admin-login-logo">Ryters Spot</div>
          <div className="admin-login-badge">Admin Portal</div>

          <h1 className="admin-login-heading">Sign in</h1>
          <p className="admin-login-sub">Admin and team access only.</p>

          {error && <div className="admin-error">{error}</div>}

          <form onSubmit={handleLogin} noValidate>
            <div className="admin-form-group">
              <label className="admin-form-label" htmlFor="email">Email Address</label>
              <input
                className="admin-form-input"
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@theryters.com"
                required
                autoComplete="email"
                autoFocus
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label" htmlFor="password">Password</label>
              <div className="pw-wrap">
                <input
                  className="admin-form-input"
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••"
                  required
                  autoComplete="current-password"
                  style={{ paddingRight: '3.5rem' }}
                />
                <button
                  type="button"
                  className="pw-toggle"
                  onClick={() => setShowPassword(p => !p)}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <button type="submit" className="admin-btn" disabled={loading}>
              {loading ? <><span className="spin">✳</span>&nbsp; Signing in...</> : 'Sign In to Admin'}
            </button>
          </form>

          <div className="admin-login-footer">
            <p>Not an admin? <Link href="/login">Go to client portal →</Link></p>
            <p style={{ marginTop: '0.5rem' }}>
              <Link href="/forgot-password">Forgot your password?</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
