'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface SocialAuthProps {
  mode: 'login' | 'signup'
}

export default function SocialAuth({ mode }: SocialAuthProps) {
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null)
  const [error, setError] = useState('')

  async function handleSocialAuth(provider: 'google' | 'github' | 'linkedin_oidc') {
    setError('')
    setLoadingProvider(provider)
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (error) setError(error.message)
    } catch {
      setError('Social sign-in failed. Please try again.')
    } finally {
      setLoadingProvider(null)
    }
  }

  const label = mode === 'signup' ? 'Sign up' : 'Continue'

  return (
    <div style={{ marginBottom: '1.5rem' }}>
      {error && (
        <div style={{
          background: '#fff5f5', border: '1px solid #feb2b2', color: '#c53030',
          padding: '0.6rem 0.9rem', borderRadius: 'var(--radius-md)',
          fontSize: '0.85rem', marginBottom: '0.75rem',
        }}>{error}</div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {/* Google */}
        <button
          type="button"
          onClick={() => handleSocialAuth('google')}
          disabled={loadingProvider !== null}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem',
            width: '100%', padding: '0.75rem 1rem',
            background: '#fff', border: '1px solid #dadce0', borderRadius: 'var(--radius-md)',
            fontSize: '0.9rem', fontWeight: 500, color: '#3c4043',
            cursor: loadingProvider ? 'not-allowed' : 'pointer',
            opacity: loadingProvider && loadingProvider !== 'google' ? 0.6 : 1,
            transition: 'box-shadow 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 1px 6px rgba(0,0,0,0.15)')}
          onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
        >
          {loadingProvider === 'google' ? (
            <span style={{ display: 'inline-block', animation: 'spin 0.8s linear infinite' }}>&#9696;</span>
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

        {/* GitHub */}
        <button
          type="button"
          onClick={() => handleSocialAuth('github')}
          disabled={loadingProvider !== null}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem',
            width: '100%', padding: '0.75rem 1rem',
            background: '#24292e', border: 'none', borderRadius: 'var(--radius-md)',
            fontSize: '0.9rem', fontWeight: 500, color: '#fff',
            cursor: loadingProvider ? 'not-allowed' : 'pointer',
            opacity: loadingProvider && loadingProvider !== 'github' ? 0.6 : 1,
            transition: 'opacity 0.2s',
          }}
        >
          {loadingProvider === 'github' ? (
            <span style={{ display: 'inline-block', animation: 'spin 0.8s linear infinite' }}>&#9696;</span>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff">
              <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
            </svg>
          )}
          {label} with GitHub
        </button>

        {/* LinkedIn */}
        <button
          type="button"
          onClick={() => handleSocialAuth('linkedin_oidc')}
          disabled={loadingProvider !== null}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem',
            width: '100%', padding: '0.75rem 1rem',
            background: '#0077B5', border: 'none', borderRadius: 'var(--radius-md)',
            fontSize: '0.9rem', fontWeight: 500, color: '#fff',
            cursor: loadingProvider ? 'not-allowed' : 'pointer',
            opacity: loadingProvider && loadingProvider !== 'linkedin_oidc' ? 0.6 : 1,
            transition: 'opacity 0.2s',
          }}
        >
          {loadingProvider === 'linkedin_oidc' ? (
            <span style={{ display: 'inline-block', animation: 'spin 0.8s linear infinite' }}>&#9696;</span>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
          )}
          {label} with LinkedIn
        </button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: '1.25rem 0' }}>
        <div style={{ flex: 1, height: '1px', background: 'var(--clr-border)' }} />
        <span style={{ fontSize: '0.8rem', color: 'var(--clr-text-muted)', whiteSpace: 'nowrap' }}>or continue with email</span>
        <div style={{ flex: 1, height: '1px', background: 'var(--clr-border)' }} />
      </div>
    </div>
  )
}
