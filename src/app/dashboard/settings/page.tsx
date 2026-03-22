'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

const COUNTRIES = [
  'United Kingdom', 'United States', 'Canada', 'Australia', 'Nigeria',
  'Ghana', 'South Africa', 'Kenya', 'Germany', 'France', 'Netherlands',
  'Ireland', 'Sweden', 'Norway', 'Denmark', 'Singapore', 'India',
  'New Zealand', 'UAE', 'Other',
]

export default function SettingsPage() {
  const [formData, setFormData] = useState({ full_name: '', country: '', company: '' })
  const [email, setEmail] = useState('')
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function loadUser() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setEmail(user.email || '')
        setFormData({
          full_name: (user.user_metadata?.full_name as string) || '',
          country: (user.user_metadata?.country as string) || '',
          company: (user.user_metadata?.company as string) || '',
        })
      }
    }
    loadUser()
  }, [])

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSaved(false)
    setLoading(true)
    try {
      const supabase = createClient()
      const { error: updateError } = await supabase.auth.updateUser({ data: formData })
      if (updateError) setError(updateError.message)
      else setSaved(true)
    } catch {
      setError('An unexpected error occurred.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <style>{`
        .settings-wrap { max-width: 560px; }
        .settings-heading { margin-bottom: 1.5rem; }
        .settings-heading h2 { font-family: var(--font-serif); font-size: 1.4rem; color: var(--clr-text); margin-bottom: 0.35rem; }
        .settings-heading p { color: var(--clr-text-muted); font-size: 0.9rem; }
        .settings-card { background: var(--clr-surface); border: 1px solid var(--clr-border); border-radius: var(--radius-lg); padding: 1.75rem; }
        .settings-success { background: #f0fff4; border: 1px solid #9ae6b4; color: #276749; padding: 0.75rem 1rem; border-radius: var(--radius-md); font-size: 0.875rem; margin-bottom: 1.25rem; }
        .settings-error { background: #fff5f5; border: 1px solid #feb2b2; color: #c53030; padding: 0.75rem 1rem; border-radius: var(--radius-md); font-size: 0.875rem; margin-bottom: 1.25rem; }
        [data-theme="dark"] .settings-success { background: rgba(39,103,73,0.2); border-color: rgba(39,103,73,0.5); color: #9ae6b4; }
        [data-theme="dark"] .settings-error { background: rgba(197,48,48,0.15); border-color: rgba(197,48,48,0.4); color: #fc8181; }
        .spin { display: inline-block; animation: spin 0.8s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <div className="settings-wrap">
        <div className="settings-heading">
          <h2>Account Settings</h2>
          <p>Update your profile information below.</p>
        </div>

        <div className="settings-card">
          {saved && <div className="settings-success">Profile updated successfully.</div>}
          {error && <div className="settings-error">{error}</div>}

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input className="form-control" type="email" value={email} disabled style={{ opacity: 0.6, cursor: 'not-allowed' }} />
            <p style={{ fontSize: '0.78rem', color: 'var(--clr-text-subtle)', marginTop: '4px', marginBottom: 0 }}>Email cannot be changed here. Contact support if needed.</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="full_name">Full Name</label>
              <input className="form-control" type="text" id="full_name" name="full_name" value={formData.full_name} onChange={handleChange} placeholder="Your full name" autoComplete="name" />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="company">Company / Institution</label>
              <input className="form-control" type="text" id="company" name="company" value={formData.company} onChange={handleChange} placeholder="Your company or institution" autoComplete="organization" />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="country">Country</label>
              <select className="form-control" id="country" name="country" value={formData.country} onChange={handleChange}>
                <option value="">Select your country</option>
                {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading} style={{ marginTop: '0.5rem' }}>
              {loading ? <span className="spin">&#9696;</span> : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>
    </>
  )
}
