'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function SetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return }
    if (password !== confirm) { setError('Passwords do not match.'); return }
    setLoading(true)
    try {
      const supabase = createClient()
      const { error: updateError } = await supabase.auth.updateUser({ password })
      if (updateError) { setError(updateError.message); setLoading(false); return }
      setDone(true)
      setTimeout(() => router.push('/admin'), 2000)
    } catch {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <>
      <style>{`
        .sp-wrap { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #0A1810; padding: 2rem; }
        .sp-card { background: #fff; border-radius: 16px; padding: 2.5rem; width: 100%; max-width: 400px; }
        .sp-logo { font-family: Georgia, serif; font-size: 1.5rem; font-weight: 700; color: #1B4332; margin-bottom: 1.5rem; text-align: center; }
        .sp-heading { font-family: Georgia, serif; font-size: 1.4rem; color: #111827; margin: 0 0 0.35rem; }
        .sp-sub { font-size: 0.875rem; color: #6b7280; margin: 0 0 1.5rem; }
        .sp-input { width: 100%; padding: 0.75rem; border: 1px solid #e5e7eb; border-radius: 8px; font-size: 0.9rem; outline: none; box-sizing: border-box; }
        .sp-label { font-size: 0.78rem; font-weight: 700; color: #374151; display: block; margin-bottom: 0.35rem; }
        .pw-wrap { position: relative; }
        .pw-toggle { position: absolute; right: 0.75rem; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; color: #9ca3af; font-size: 0.8rem; padding: 0; }
        .sp-error { background: #fff5f5; border: 1px solid #feb2b2; color: #c53030; padding: 0.65rem 0.9rem; border-radius: 8px; font-size: 0.82rem; margin-bottom: 1rem; }
        .sp-success { background: #f0fff4; border: 1px solid #9ae6b4; color: #276749; padding: 1.25rem; border-radius: 10px; text-align: center; font-size: 0.9rem; }
        .sp-btn { width: 100%; padding: 0.85rem; background: #1B4332; color: #fff; border: none; border-radius: 8px; font-size: 0.9rem; font-weight: 700; cursor: pointer; margin-top: 0.5rem; }
        .sp-btn:disabled { opacity: 0.6; cursor: not-allowed; }
      `}</style>

      <div className="sp-wrap">
        <div className="sp-card">
          <div className="sp-logo">Ryters Spot</div>

          {done ? (
            <div className="sp-success">
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>✓</div>
              <strong>Password set successfully!</strong><br />
              Redirecting you to the admin portal...
            </div>
          ) : (
            <>
              <h1 className="sp-heading">Set your password</h1>
              <p className="sp-sub">Welcome to the Ryters Spot admin team. Create a secure password to access the portal.</p>

              {error && <div className="sp-error">{error}</div>}

              <form onSubmit={handleSubmit} noValidate>
                <div style={{ marginBottom: '1rem' }}>
                  <label className="sp-label">New Password</label>
                  <div className="pw-wrap">
                    <input className="sp-input" type={showPw ? 'text' : 'password'}
                      value={password} onChange={e => setPassword(e.target.value)}
                      placeholder="Min. 8 characters" required autoComplete="new-password"
                      style={{ paddingRight: '3.5rem' }} />
                    <button type="button" className="pw-toggle" onClick={() => setShowPw(p => !p)}>
                      {showPw ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </div>
                <div style={{ marginBottom: '1.25rem' }}>
                  <label className="sp-label">Confirm Password</label>
                  <input className="sp-input" type={showPw ? 'text' : 'password'}
                    value={confirm} onChange={e => setConfirm(e.target.value)}
                    placeholder="Repeat password" required autoComplete="new-password" />
                </div>
                <button type="submit" className="sp-btn" disabled={loading}>
                  {loading ? 'Setting password...' : 'Set Password & Enter Portal'}
                </button>
              </form>

              <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                <Link href="/admin/login" style={{ fontSize: '0.82rem', color: '#9ca3af' }}>Back to admin login</Link>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}
