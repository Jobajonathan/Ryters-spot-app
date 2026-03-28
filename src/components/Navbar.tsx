'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navLinks = [
  { href: '/services/ai-automation', label: 'Automation' },
  { href: '/services/edtech', label: 'EdTech' },
  { href: '/services/writing', label: 'Research' },
  { href: '/services/product-management', label: 'Product Management' },
  { href: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('rs-theme') as 'light' | 'dark' | null
    const preferred = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    const t = saved || preferred
    setTheme(t)
    document.documentElement.setAttribute('data-theme', t)
  }, [])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close menu on route change
  useEffect(() => { setMenuOpen(false) }, [pathname])

  // Prevent body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  function toggleTheme() {
    const next = theme === 'light' ? 'dark' : 'light'
    setTheme(next)
    localStorage.setItem('rs-theme', next)
    document.documentElement.setAttribute('data-theme', next)
  }

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(href + '/')
  }

  return (
    <>
      <style>{`
        /* ── Mobile menu overlay ── */
        @media (max-width: 1024px) {
          .navbar-nav {
            display: none;
            position: fixed;
            top: 0; left: 0;
            width: 100%; height: 100vh;
            background: var(--clr-primary);
            flex-direction: column;
            align-items: flex-start;
            justify-content: center;
            padding: 2rem;
            gap: 0;
            z-index: 998;
            overflow-y: auto;
          }
          .navbar-nav.open { display: flex; }
          .navbar-nav.open .nav-link {
            font-size: 1.5rem;
            font-weight: 600;
            color: rgba(255,255,255,0.85);
            padding: 0.9rem 0;
            border-bottom: 1px solid rgba(255,255,255,0.08);
            width: 100%;
          }
          .navbar-nav.open .nav-link:hover,
          .navbar-nav.open .nav-link.active { color: #fff; }
          .mobile-toggle { display: flex !important; z-index: 999; position: relative; }
          .mobile-menu-actions {
            display: flex;
            gap: 0.75rem;
            margin-top: 2rem;
            padding-top: 1.5rem;
            border-top: 1px solid rgba(255,255,255,0.12);
            width: 100%;
          }
          .mobile-menu-actions .btn { flex: 1; justify-content: center; }
        }
        @media (min-width: 1025px) {
          .mobile-toggle { display: none !important; }
          .mobile-menu-actions { display: none; }
        }
        /* ── Navbar link sizing — compact on all desktop sizes ── */
        @media (min-width: 1025px) {
          .nav-link { font-size: 0.85rem !important; padding: 0.4rem 0.7rem !important; letter-spacing: 0 !important; }
          .navbar-logo-text { font-size: 1rem !important; }
          .navbar-inner { gap: 0.5rem !important; }
        }
      `}</style>

      <nav className={`navbar${scrolled ? ' scrolled' : ''}`} role="navigation" aria-label="Main navigation">
        <div className="container">
          <div className="navbar-inner">

            {/* Logo */}
            <Link className="navbar-logo" href="/" aria-label="Ryters Spot home">
              <img src="/images/logo.png" alt="Ryters Spot logo" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
              <span className="navbar-logo-text">Ryters Spot</span>
            </Link>

            {/* Nav links */}
            <ul className={`navbar-nav${menuOpen ? ' open' : ''}`} id="main-nav" role="list">
              {navLinks.map(link => (
                <li key={link.href}>
                  <Link
                    className={`nav-link${isActive(link.href) ? ' active' : ''}`}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}

              {/* Mobile-only: auth buttons inside the overlay */}
              <li className="mobile-menu-actions">
                <Link href="/login" className="btn btn-ghost btn-sm" onClick={() => setMenuOpen(false)}>Log In</Link>
                <Link href="/get-started" className="btn btn-accent btn-sm" onClick={() => setMenuOpen(false)}>Get Started</Link>
              </li>
            </ul>

            {/* Right-side actions */}
            <div className="navbar-actions">
              <button className="theme-toggle" aria-label="Toggle dark mode" title="Toggle dark/light mode" onClick={toggleTheme}>
                <span className="theme-icon">{theme === 'dark' ? '☀️' : '🌙'}</span>
              </button>
              <Link href="/login" className="btn btn-ghost btn-sm" style={{ display: 'var(--desktop-only, flex)' }}>Log In</Link>
              <Link href="/get-started" className="btn btn-primary btn-sm" style={{ display: 'var(--desktop-only, flex)' }}>Get Started</Link>
              <button
                className="mobile-toggle"
                aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={menuOpen}
                aria-controls="main-nav"
                onClick={() => setMenuOpen(m => !m)}
                style={{
                  background: menuOpen ? 'rgba(255,255,255,0.15)' : 'transparent',
                  border: 'none',
                  width: '40px', height: '40px',
                  borderRadius: '8px',
                  fontSize: '1.1rem',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: menuOpen ? '#fff' : 'var(--clr-text)',
                  position: 'relative', zIndex: 999,
                }}
              >
                {menuOpen ? '✕' : '☰'}
              </button>
            </div>

          </div>
        </div>
      </nav>
    </>
  )
}
