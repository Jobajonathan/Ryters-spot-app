'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface SocialAuthProps {
  mode: 'login' | 'signup'
  onToggleEmail?: () => void
  emailOpen?: boolean
}

export default function SocialAuth({ mode, onToggleEmail, emailOpen }: SocialAuthProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleGoogle() {
    setError('')
    setLoading(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}/auth/callback` },
      })
      if (error) setError(error.message)
    } catch {
      setError('Google sign-in failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const label = mode === 'signup' ? 'Sign up' : 'Continue'

  return (
    <div style={{ marginBottom: '1.25rem' }}>
      {error && (
        <div style={{ background: '#fff5f5', border: '1px solid #feb2b2', color: '#c53030', padding: '0.6rem 0.9rem', borderRadius: '10px', fontSize: '0.85rem', marginBottom: '0.75rem' }}>
          {error}
        </div>
      )}

      {/* Google */}
      <button
        type="button"
        onClick={handleGoogle}
        disabled={loading}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem',
          width: '100%', padding: '0.8rem 1rem',
          background: '#fff', border: '1px solid #dadce0', borderRadius: '10px',
          fontSize: '0.9rem', fontWeight: 500, color: '#3c4043',
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.7 : 1,
          transition: 'box-shadow 0.2s',
        }}
        onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 1px 6px rgba(0,0,0,0.15)')}
        onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
      >
        {loading ? (
          <span style={{ display: 'inline-block', animation: 'spin 0.8s linear infinite' }}>⟳</span>
        ) : (
          <svg width="18" height="18" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
          </svg>
        )}
        {label} with Google
      </button>

      {/* "or continue with email" toggle */}
      {onToggleEmail ? (
        <button
          type="button"
          onClick={onToggleEmail}
          style={{
            width: '100%', marginTop: '0.85rem',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
            background: 'none', border: '1px solid var(--clr-border)',
            borderRadius: '10px', padding: '0.7rem 1rem',
            fontSize: '0.85rem', color: 'var(--clr-text-muted)',
            cursor: 'pointer', fontFamily: 'inherit',
            transition: 'border-color 0.2s, color 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#40916C'; e.currentTarget.style.color = 'var(--clr-text)' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--clr-border)'; e.currentTarget.style.color = 'var(--clr-text-muted)' }}
        >
          <span>✉ Continue with email</span>
          <span style={{ transition: 'transform 0.2s', transform: emailOpen ? 'rotate(180deg)' : 'rotate(0deg)', display: 'inline-block', fontSize: '0.7rem' }}>▼</span>
        </button>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: '1.1rem 0 0' }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--clr-border)' }} />
          <span style={{ fontSize: '0.8rem', color: 'var(--clr-text-muted)', whiteSpace: 'nowrap' }}>or continue with email</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--clr-border)' }} />
        </div>
      )}
    </div>
  )
}
