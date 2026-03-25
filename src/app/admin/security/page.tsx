'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function SecurityPage() {
  const [oldPw, setOldPw] = useState('')
  const [newPw, setNewPw] = useState('')
  const [confirmPw, setConfirmPw] = useState('')
  const [pwLoading, setPwLoading] = useState(false)
  const [pwMsg, setPwMsg] = useState('')
  const [pwOk, setPwOk] = useState(true)

  const strength = newPw.length === 0 ? 0 : newPw.length < 8 ? 1 : newPw.length < 12 ? 2 : /[A-Z]/.test(newPw) && /[0-9]/.test(newPw) ? 4 : 3
  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong']
  const strengthColor = ['', '#ef4444', '#f59e0b', '#3b82f6', '#22c55e']

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault()
    setPwMsg('')
    if (newPw !== confirmPw) { setPwMsg('New passwords do not match.'); setPwOk(false); return }
    if (newPw.length < 8) { setPwMsg('Password must be at least 8 characters.'); setPwOk(false); return }

    setPwLoading(true)
    const supabase = createClient()

    // Re-authenticate with old password first
    const { data: user } = await supabase.auth.getUser()
    if (!user.user) { setPwMsg('Session expired. Please sign in again.'); setPwOk(false); setPwLoading(false); return }

    const { error: signInError } = await supabase.auth.signInWithPassword({ email: user.user.email!, password: oldPw })
    if (signInError) { setPwMsg('Current password is incorrect.'); setPwOk(false); setPwLoading(false); return }

    const { error } = await supabase.auth.updateUser({ password: newPw })
    if (error) {
      setPwMsg(error.message); setPwOk(false)
    } else {
      setPwMsg('Password updated successfully.'); setPwOk(true)
      setOldPw(''); setNewPw(''); setConfirmPw('')
    }
    setPwLoading(false)
  }

  return (
    <>
      <style>{`
        .sec-card { background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; margin-bottom: 1.5rem; overflow: hidden; }
        .sec-card-header { padding: 1.25rem 1.5rem; border-bottom: 1px solid #f3f4f6; }
        .sec-card-title { font-size: 0.95rem; font-weight: 700; color: #111827; margin: 0 0 0.2rem; }
        .sec-card-sub { font-size: 0.8rem; color: #9ca3af; margin: 0; }
        .sec-card-body { padding: 1.5rem; max-width: 480px; }
        .sec-field { margin-bottom: 1rem; }
        .sec-field label { display: block; font-size: 0.75rem; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 0.35rem; }
        .sec-input { width: 100%; padding: 0.65rem 0.85rem; border: 1px solid #e5e7eb; border-radius: 8px; font-size: 0.875rem; outline: none; background: #fff; transition: border-color 0.15s; }
        .sec-input:focus { border-color: #1B4332; }
        .pw-strength-bar { height: 4px; border-radius: 100px; background: #f3f4f6; margin-top: 0.4rem; overflow: hidden; }
        .pw-strength-fill { height: 100%; border-radius: 100px; transition: width 0.3s, background 0.3s; }
      `}</style>

      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '1.5rem', fontWeight: 700, color: '#111827', margin: '0 0 0.25rem' }}>Security Settings</h1>
        <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0 }}>Manage your account credentials and security preferences.</p>
      </div>

      {/* Change Password */}
      <div className="sec-card">
        <div className="sec-card-header">
          <h2 className="sec-card-title">Change Password</h2>
          <p className="sec-card-sub">Use a strong password of at least 8 characters.</p>
        </div>
        <div className="sec-card-body">
          {pwMsg && (
            <div style={{ padding: '10px 14px', borderRadius: 8, marginBottom: '1rem', background: pwOk ? '#f0fff4' : '#fff5f5', border: `1px solid ${pwOk ? '#9ae6b4' : '#feb2b2'}`, color: pwOk ? '#276749' : '#c53030', fontSize: '0.82rem' }}>{pwMsg}</div>
          )}
          <form onSubmit={handlePasswordChange}>
            <div className="sec-field">
              <label>Current Password</label>
              <input className="sec-input" type="password" value={oldPw} onChange={e => setOldPw(e.target.value)} required autoComplete="current-password" placeholder="••••••••" />
            </div>
            <div className="sec-field">
              <label>New Password</label>
              <input className="sec-input" type="password" value={newPw} onChange={e => setNewPw(e.target.value)} required autoComplete="new-password" placeholder="••••••••" />
              {newPw && (
                <>
                  <div className="pw-strength-bar">
                    <div className="pw-strength-fill" style={{ width: `${strength * 25}%`, background: strengthColor[strength] }} />
                  </div>
                  <div style={{ fontSize: '0.72rem', color: strengthColor[strength], marginTop: 3 }}>{strengthLabel[strength]}</div>
                </>
              )}
            </div>
            <div className="sec-field">
              <label>Confirm New Password</label>
              <input className="sec-input" type="password" value={confirmPw} onChange={e => setConfirmPw(e.target.value)} required autoComplete="new-password" placeholder="••••••••" />
              {confirmPw && newPw !== confirmPw && <div style={{ fontSize: '0.72rem', color: '#ef4444', marginTop: 3 }}>Passwords do not match</div>}
              {confirmPw && newPw === confirmPw && <div style={{ fontSize: '0.72rem', color: '#22c55e', marginTop: 3 }}>Passwords match ✓</div>}
            </div>
            <button type="submit" disabled={pwLoading}
              style={{ padding: '0.65rem 1.5rem', background: '#1B4332', color: '#fff', border: 'none', borderRadius: 8, fontSize: '0.875rem', fontWeight: 700, cursor: pwLoading ? 'not-allowed' : 'pointer', opacity: pwLoading ? 0.7 : 1 }}>
              {pwLoading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>

      {/* Admin roles info */}
      <div className="sec-card">
        <div className="sec-card-header">
          <h2 className="sec-card-title">Role Permissions</h2>
          <p className="sec-card-sub">What each admin role can access.</p>
        </div>
        <div style={{ padding: '1.25rem 1.5rem', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
            <thead>
              <tr>
                {['Feature', 'Superadmin', 'Admin', 'Finance', 'Support', 'Content'].map(h => (
                  <th key={h} style={{ textAlign: h === 'Feature' ? 'left' : 'center', padding: '0.6rem 0.75rem', borderBottom: '1px solid #f3f4f6', fontSize: '0.72rem', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { feature: 'Dashboard & Analytics', sa: true, a: true, f: true, s: true, c: false },
                { feature: 'Applications',          sa: true, a: true, f: false, s: true, c: false },
                { feature: 'Clients & CRM',         sa: true, a: true, f: false, s: true, c: false },
                { feature: 'Payments',              sa: true, a: false, f: true, s: false, c: false },
                { feature: 'Services & Pricing',    sa: true, a: true, f: false, s: false, c: false },
                { feature: 'Blog Posts',            sa: true, a: true, f: false, s: false, c: true },
                { feature: 'Website Content',       sa: true, a: true, f: false, s: false, c: true },
                { feature: 'Admin Team',            sa: true, a: false, f: false, s: false, c: false },
                { feature: 'Security',              sa: true, a: true, f: true, s: true, c: true },
              ].map(row => (
                <tr key={row.feature}>
                  <td style={{ padding: '0.6rem 0.75rem', color: '#374151', fontWeight: 500 }}>{row.feature}</td>
                  {[row.sa, row.a, row.f, row.s, row.c].map((v, i) => (
                    <td key={i} style={{ textAlign: 'center', padding: '0.6rem 0.75rem' }}>
                      {v
                        ? <span style={{ color: '#22c55e', fontSize: '1rem' }}>✓</span>
                        : <span style={{ color: '#e5e7eb', fontSize: '1rem' }}>—</span>
                      }
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
