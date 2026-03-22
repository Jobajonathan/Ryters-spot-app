'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const navItems = [
  { label: 'Overview', icon: '&#9732;', href: '/dashboard' },
  { label: 'Request a Service', icon: '&#43;', href: '/dashboard/request' },
  { label: 'My Projects', icon: '&#128193;', href: '/dashboard/projects' },
  { label: 'Deliverables', icon: '&#8681;', href: '/dashboard/deliverables' },
  { label: 'Payments', icon: '&#128179;', href: '/dashboard/payments' },
  { label: 'Messages', icon: '&#128172;', href: '/dashboard/messages' },
  { label: 'Settings', icon: '&#9881;', href: '/dashboard/settings' },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [userName, setUserName] = useState('Client')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [pageTitle, setPageTitle] = useState('Dashboard')

  useEffect(() => {
    async function loadUser() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const fullName = user.user_metadata?.full_name as string | undefined
        if (fullName) setUserName(fullName.split(' ')[0])
        else if (user.email) setUserName(user.email.split('@')[0])
      }
    }
    loadUser()
  }, [])

  useEffect(() => {
    const item = navItems.find(n => n.href === pathname)
    if (item) setPageTitle(item.label)
  }, [pathname])

  async function signOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  function isActive(href: string) {
    if (href === '/dashboard') return pathname === '/dashboard'
    return pathname.startsWith(href)
  }

  return (
    <>
      <style>{`
        .dash-wrap { display: flex; min-height: 100vh; background: var(--clr-bg); }
        .dash-sidebar {
          width: 260px;
          background: var(--clr-primary);
          color: #fff;
          display: flex;
          flex-direction: column;
          flex-shrink: 0;
          position: sticky;
          top: 0;
          height: 100vh;
          overflow-y: auto;
        }
        .dash-sidebar-logo {
          padding: 1.5rem;
          border-bottom: 1px solid rgba(255,255,255,0.08);
          font-family: var(--font-serif);
          font-size: 1.2rem;
          font-weight: 700;
          color: #fff;
          text-decoration: none;
          display: block;
        }
        .dash-nav { flex: 1; padding: 1rem 0; }
        .dash-nav-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1.5rem;
          font-size: 0.9rem;
          color: rgba(255,255,255,0.7);
          text-decoration: none;
          transition: all 0.2s;
          position: relative;
        }
        .dash-nav-item:hover { background: rgba(255,255,255,0.07); color: #fff; }
        .dash-nav-item.active { background: rgba(201,168,76,0.15); color: #C9A84C; font-weight: 600; }
        .dash-nav-item.active::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 3px; background: #C9A84C; border-radius: 0 2px 2px 0; }
        .dash-nav-icon { width: 20px; text-align: center; flex-shrink: 0; }
        .dash-sidebar-footer { padding: 1rem 1.5rem; border-top: 1px solid rgba(255,255,255,0.08); }
        .dash-main { flex: 1; display: flex; flex-direction: column; min-width: 0; }
        .dash-topbar {
          background: var(--clr-surface);
          border-bottom: 1px solid var(--clr-border);
          padding: 0 1.5rem;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          position: sticky;
          top: 0;
          z-index: 50;
        }
        .dash-topbar-title { font-family: var(--font-serif); font-size: 1.15rem; font-weight: 700; color: var(--clr-text); }
        .dash-topbar-right { display: flex; align-items: center; gap: 1rem; }
        .dash-user-chip {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.35rem 0.75rem;
          background: var(--clr-surface-2);
          border-radius: 100px;
          font-size: 0.85rem;
          font-weight: 500;
          color: var(--clr-text);
        }
        .dash-avatar {
          width: 28px; height: 28px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--clr-primary), var(--clr-primary-light));
          display: flex; align-items: center; justify-content: center;
          font-size: 0.75rem;
          font-weight: 700;
          color: #fff;
          flex-shrink: 0;
        }
        .dash-content { flex: 1; padding: 2rem; }
        .dash-mobile-toggle {
          display: none;
          background: transparent;
          border: 1px solid var(--clr-border);
          border-radius: var(--radius-sm);
          padding: 0.4rem 0.6rem;
          cursor: pointer;
          font-size: 1.1rem;
          color: var(--clr-text);
        }
        @media (max-width: 900px) {
          .dash-sidebar { position: fixed; left: -260px; z-index: 200; transition: left 0.3s; }
          .dash-sidebar.open { left: 0; }
          .dash-mobile-toggle { display: flex; }
          .dash-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); z-index: 199; display: none; }
          .dash-overlay.show { display: block; }
        }
      `}</style>

      <div className="dash-wrap">
        <div className={`dash-sidebar${sidebarOpen ? ' open' : ''}`}>
          <Link href="/" className="dash-sidebar-logo">Ryters Spot</Link>
          <nav className="dash-nav">
            {navItems.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className={`dash-nav-item${isActive(item.href) ? ' active' : ''}`}
                onClick={() => setSidebarOpen(false)}
              >
                <span className="dash-nav-icon" dangerouslySetInnerHTML={{ __html: item.icon }} />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
          <div className="dash-sidebar-footer">
            <button
              onClick={signOut}
              style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 'var(--radius-md)', padding: '0.5rem 1rem', color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', cursor: 'pointer', width: '100%', textAlign: 'center' }}
            >
              Sign Out
            </button>
          </div>
        </div>

        <div className={`dash-overlay${sidebarOpen ? ' show' : ''}`} onClick={() => setSidebarOpen(false)} />

        <div className="dash-main">
          <div className="dash-topbar">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <button className="dash-mobile-toggle" onClick={() => setSidebarOpen(true)}>&#9776;</button>
              <span className="dash-topbar-title">{pageTitle}</span>
            </div>
            <div className="dash-topbar-right">
              <span style={{ fontSize: '1.2rem', cursor: 'pointer' }} title="Notifications">&#128276;</span>
              <div className="dash-user-chip">
                <div className="dash-avatar">{userName.charAt(0).toUpperCase()}</div>
                <span>{userName}</span>
              </div>
            </div>
          </div>

          <div className="dash-content">
            {children}
          </div>
        </div>
      </div>
    </>
  )
}
