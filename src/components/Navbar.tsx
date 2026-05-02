'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navLinks = [
  { href: '/services/ai-automation', label: 'AI Automation' },
  { href: '/services/edtech', label: 'EdTech' },
  { href: '/services/writing', label: 'Research & Writing' },
  { href: '/services/product-management', label: 'Product Mgmt' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => { setMenuOpen(false) }, [pathname])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(href + '/')
  }

  return (
    <>
      <style>{`
        .nav-root {
          position: sticky;
          top: 0;
          z-index: 1000;
          background: rgba(255,255,255,0.97);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--clr-border);
          transition: box-shadow 0.25s;
        }
        [data-theme="dark"] .nav-root {
          background: rgba(10,24,16,0.96);
          border-bottom-color: rgba(255,255,255,0.07);
        }
        .nav-root.scrolled { box-shadow: 0 2px 16px rgba(27,67,50,0.08); }
        .nav-inner {
          display: flex;
          align-items: center;
          height: 68px;
          gap: 0;
        }

        /* Logo */
        .nav-logo {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          text-decoration: none;
          flex-shrink: 0;
          margin-right: 2rem;
        }
        .nav-logo img { height: 38px; width: auto; }
        .nav-logo-text {
          font-family: var(--font-heading);
          font-size: 1.15rem;
          font-weight: 800;
          color: var(--clr-primary);
          letter-spacing: -0.02em;
        }

        /* Links */
        .nav-links {
          display: flex;
          align-items: center;
          gap: 0.1rem;
          flex: 1;
          list-style: none;
          margin: 0; padding: 0;
        }
        .nav-link {
          display: block;
          padding: 0.45rem 0.8rem;
          border-radius: 8px;
          font-family: var(--font-heading);
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--clr-text-muted);
          text-decoration: none;
          transition: all 0.18s;
          white-space: nowrap;
          letter-spacing: -0.01em;
        }
        .nav-link:hover { color: var(--clr-primary); background: rgba(27,67,50,0.06); }
        .nav-link.active {
          color: var(--clr-primary);
          background: rgba(27,67,50,0.08);
          font-weight: 600;
        }

        /* Actions */
        .nav-actions {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          flex-shrink: 0;
          margin-left: auto;
        }

        /* Mobile hamburger */
        .nav-hamburger {
          display: none;
          flex-direction: column;
          justify-content: center;
          gap: 5px;
          width: 40px;
          height: 40px;
          padding: 8px;
          background: transparent;
          border: 1.5px solid var(--clr-border);
          border-radius: 9px;
          cursor: pointer;
          transition: all 0.18s;
        }
        .nav-hamburger:hover { background: var(--clr-surface-2); border-color: var(--clr-primary-xlight); }
        .nav-hamburger span {
          display: block;
          height: 1.5px;
          background: var(--clr-text);
          border-radius: 2px;
          transition: all 0.2s;
        }
        .nav-hamburger.open span:nth-child(1) { transform: translateY(6.5px) rotate(45deg); }
        .nav-hamburger.open span:nth-child(2) { opacity: 0; transform: scaleX(0); }
        .nav-hamburger.open span:nth-child(3) { transform: translateY(-6.5px) rotate(-45deg); }

        /* Mobile drawer */
        @media (max-width: 1020px) {
          .nav-links {
            display: none;
            position: fixed;
            top: 68px; left: 0; right: 0; bottom: 0;
            background: var(--clr-primary);
            flex-direction: column;
            align-items: stretch;
            justify-content: flex-start;
            padding: 1.5rem;
            gap: 0.2rem;
            z-index: 999;
            overflow-y: auto;
          }
          .nav-links.open { display: flex; }
          .nav-links.open .nav-link {
            font-size: 1.1rem;
            font-weight: 600;
            color: rgba(255,255,255,0.8);
            padding: 0.85rem 1rem;
            border-radius: 10px;
            border-bottom: none;
          }
          .nav-links.open .nav-link:hover,
          .nav-links.open .nav-link.active {
            background: rgba(255,255,255,0.1);
            color: #fff;
          }
          .nav-hamburger { display: flex; }
          .nav-actions .nav-desktop { display: none; }

          /* Mobile drawer footer actions */
          .nav-mobile-actions {
            display: flex;
            flex-direction: column;
            gap: 0.6rem;
            margin-top: 1.5rem;
            padding-top: 1.5rem;
            border-top: 1px solid rgba(255,255,255,0.1);
          }
          .nav-mobile-actions .btn { justify-content: center; }
        }
        @media (min-width: 1021px) {
          .nav-mobile-actions { display: none; }
        }
      `}</style>

      <nav className={`nav-root${scrolled ? ' scrolled' : ''}`} role="navigation" aria-label="Main navigation">
        <div className="container">
          <div className="nav-inner">

            {/* Logo */}
            <Link className="nav-logo" href="/" aria-label="Ryters Spot home">
              <img
                src="/images/logo.png"
                alt="Ryters Spot"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
              />
              <span className="nav-logo-text">Ryters Spot</span>
            </Link>

            {/* Nav links */}
            <ul className={`nav-links${menuOpen ? ' open' : ''}`} id="main-nav" role="list">
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

              {/* Mobile-only drawer actions */}
              <li className="nav-mobile-actions">
                <Link href="/login" className="btn btn-lg" style={{ background: 'rgba(255,255,255,0.12)', color: '#fff', borderColor: 'rgba(255,255,255,0.2)' }} onClick={() => setMenuOpen(false)}>
                  Log In
                </Link>
                <Link href="/signup" className="btn btn-accent btn-lg" onClick={() => setMenuOpen(false)}>
                  Get Started →
                </Link>
              </li>
            </ul>

            {/* Desktop actions */}
            <div className="nav-actions">
              <Link href="/login" className="btn btn-ghost btn-sm nav-desktop" style={{ fontFamily: 'var(--font-heading)', fontWeight: 600 }}>
                Log In
              </Link>
              <Link href="/signup" className="btn btn-primary btn-sm nav-desktop" style={{ fontFamily: 'var(--font-heading)', fontWeight: 700 }}>
                Get Started
              </Link>
              <button
                className={`nav-hamburger${menuOpen ? ' open' : ''}`}
                aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={menuOpen}
                aria-controls="main-nav"
                onClick={() => setMenuOpen(m => !m)}
              >
                <span />
                <span />
                <span />
              </button>
            </div>

          </div>
        </div>
      </nav>
    </>
  )
}
