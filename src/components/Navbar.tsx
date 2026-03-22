'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

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

  function toggleTheme() {
    const next = theme === 'light' ? 'dark' : 'light'
    setTheme(next)
    localStorage.setItem('rs-theme', next)
    document.documentElement.setAttribute('data-theme', next)
  }

  function toggleMenu() {
    setMenuOpen(!menuOpen)
  }

  function closeMenu() {
    setMenuOpen(false)
  }

  function isActive(href: string) {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <nav className={`navbar${scrolled ? ' scrolled' : ''}`} role="navigation" aria-label="Main navigation">
      <div className="container">
        <div className="navbar-inner">

          <Link className="navbar-logo" href="/" aria-label="Ryters Spot home">
            <img src="/images/logo.png" alt="Ryters Spot logo" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
            <span className="navbar-logo-text">Ryters Spot</span>
          </Link>

          <ul className={`navbar-nav${menuOpen ? ' open' : ''}`} id="main-nav" role="list">
            <li>
              <Link className={`nav-link${isActive('/') ? ' active' : ''}`} href="/" onClick={closeMenu}>Home</Link>
            </li>
            <li className="nav-dropdown">
              <Link className={`nav-link nav-dropdown-toggle${isActive('/services') ? ' active' : ''}`} href="/services" aria-haspopup="true">Services</Link>
              <div className="nav-dropdown-menu">
                <Link className="nav-dropdown-item" href="/services#academic" onClick={closeMenu}>Research and Academic Enquiry</Link>
                <Link className="nav-dropdown-item" href="/services#digital-transformation" onClick={closeMenu}>Digital Transformation and Automation</Link>
                <Link className="nav-dropdown-item" href="/services#edtech" onClick={closeMenu}>Ed-Tech Services</Link>
                <Link className="nav-dropdown-item" href="/services#product-management" onClick={closeMenu}>Product Management</Link>
              </div>
            </li>
            <li>
              <Link className={`nav-link${isActive('/about') ? ' active' : ''}`} href="/about" onClick={closeMenu}>About</Link>
            </li>
            <li>
              <Link className={`nav-link${isActive('/blog') ? ' active' : ''}`} href="/blog" onClick={closeMenu}>Blog</Link>
            </li>
            <li>
              <Link className={`nav-link${isActive('/contact') ? ' active' : ''}`} href="/contact" onClick={closeMenu}>Contact</Link>
            </li>
          </ul>

          <div className="navbar-actions">
            <button className="theme-toggle" aria-label="Toggle dark mode" title="Toggle dark/light mode" onClick={toggleTheme}>
              <span className="theme-icon">{theme === 'dark' ? '☀️' : '🌙'}</span>
            </button>
            <Link href="/login" className="btn btn-ghost btn-sm">Log In</Link>
            <Link href="/signup" className="btn btn-primary btn-sm">Get Started</Link>
            <button
              className="mobile-toggle"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              aria-controls="main-nav"
              onClick={toggleMenu}
            >
              {menuOpen ? '✕' : '☰'}
            </button>
          </div>

        </div>
      </div>
    </nav>
  )
}
