'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navLinks = [
  { href: '/services', label: 'Capabilities' },
  { href: '/about', label: 'Company' },
  { href: '/blog', label: 'Insights' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const savedTheme = window.localStorage.getItem('ryters-theme')
    const preferredTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    const nextTheme = savedTheme === 'dark' || savedTheme === 'light' ? savedTheme : preferredTheme
    window.requestAnimationFrame(() => setTheme(nextTheme))
  }, [])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(href + '/')
  }

  function toggleTheme() {
    const nextTheme = theme === 'dark' ? 'light' : 'dark'
    document.documentElement.dataset.theme = nextTheme
    window.localStorage.setItem('ryters-theme', nextTheme)
    setTheme(nextTheme)
  }

  return (
    <nav className={`liquid-nav${scrolled ? ' scrolled' : ''}`} role="navigation" aria-label="Main navigation">
      <div className="container liquid-nav-inner">
        <Link className="liquid-logo" href="/" aria-label="Ryters Spot home">
          <img src="/images/logo.png" alt="Ryters Spot" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
          <span>Ryters Spot</span>
        </Link>

        <ul className={`liquid-nav-links${menuOpen ? ' open' : ''}`} id="main-nav" role="list">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link className={isActive(link.href) ? 'active' : ''} href={link.href} onClick={() => setMenuOpen(false)}>
                {link.label}
              </Link>
            </li>
          ))}
          <li className="liquid-mobile-actions">
            <Link href="/login" className="btn btn-liquid">Client Portal</Link>
            <Link href="/contact" className="btn btn-accent">Start a Project</Link>
          </li>
        </ul>

        <div className="liquid-nav-actions">
          <Link href="/login" className="btn btn-liquid btn-sm nav-desktop">Portal</Link>
          <button
            className="theme-toggle liquid-theme-toggle"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            onClick={toggleTheme}
            type="button"
          >
            <span aria-hidden="true">{theme === 'dark' ? '☀' : '☾'}</span>
          </button>
          <Link href="/contact" className="btn btn-primary btn-sm nav-desktop">Start a Project</Link>
          <button
            className={`liquid-menu${menuOpen ? ' open' : ''}`}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="main-nav"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span />
            <span />
          </button>
        </div>
      </div>
    </nav>
  )
}
