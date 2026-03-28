'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

type Notification = {
  id: string
  type: string
  title: string
  body: string | null
  link: string | null
  read: boolean
  created_at: string
}

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
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [notifOpen, setNotifOpen] = useState(false)
  const notifRef = useRef<HTMLDivElement>(null)

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

  useEffect(() => {
    function loadNotifications() {
      fetch('/api/notifications')
        .then(r => r.json())
        .then(data => setNotifications(Array.isArray(data) ? data : []))
        .catch(() => {})
    }
    loadNotifications()
    const interval = setInterval(loadNotifications, 30000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  async function markAllRead() {
    await fetch('/api/notifications', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ markAllRead: true }) })
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  async function markRead(id: string, link: string | null) {
    await fetch('/api/notifications', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
    setNotifOpen(false)
    if (link) router.push(link)
  }

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
        .notif-btn { position: relative; background: none; border: none; cursor: pointer; padding: 4px; font-size: 1.2rem; color: var(--clr-text-muted); line-height: 1; }
        .notif-badge { position: absolute; top: 0; right: 0; width: 16px; height: 16px; background: #ef4444; border-radius: 50%; font-size: 0.6rem; font-weight: 700; color: #fff; display: flex; align-items: center; justify-content: center; }
        .notif-panel { position: absolute; top: calc(100% + 8px); right: 0; width: 340px; background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; box-shadow: 0 8px 24px rgba(0,0,0,0.12); z-index: 300; overflow: hidden; }
        .notif-header { display: flex; justify-content: space-between; align-items: center; padding: 1rem 1.25rem 0.75rem; border-bottom: 1px solid #f3f4f6; }
        .notif-item { display: block; padding: 0.85rem 1.25rem; border-bottom: 1px solid #f9fafb; cursor: pointer; transition: background 0.15s; text-decoration: none; color: inherit; }
        .notif-item:hover { background: #f9fafb; }
        .notif-item.unread { background: #f0fdf4; }
        .notif-item:last-child { border-bottom: none; }
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
              <div ref={notifRef} style={{ position: 'relative' }}>
                <button className="notif-btn" onClick={() => setNotifOpen(o => !o)} title="Notifications">
                  &#128276;
                  {notifications.filter(n => !n.read).length > 0 && (
                    <span className="notif-badge">{notifications.filter(n => !n.read).length > 9 ? '9+' : notifications.filter(n => !n.read).length}</span>
                  )}
                </button>
                {notifOpen && (
                  <div className="notif-panel">
                    <div className="notif-header">
                      <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#111827' }}>Notifications</span>
                      {notifications.some(n => !n.read) && (
                        <button onClick={markAllRead} style={{ fontSize: '0.75rem', color: '#1B4332', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}>
                          Mark all read
                        </button>
                      )}
                    </div>
                    {notifications.length === 0 ? (
                      <div style={{ padding: '2rem', textAlign: 'center', color: '#9ca3af', fontSize: '0.875rem' }}>
                        No notifications yet.
                      </div>
                    ) : (
                      <div style={{ maxHeight: 380, overflowY: 'auto' }}>
                        {notifications.slice(0, 20).map(n => (
                          <div key={n.id} className={`notif-item${n.read ? '' : ' unread'}`} onClick={() => markRead(n.id, n.link)}>
                            <div style={{ fontWeight: n.read ? 500 : 700, fontSize: '0.875rem', color: '#111827', marginBottom: '0.2rem' }}>{n.title}</div>
                            {n.body && <div style={{ fontSize: '0.78rem', color: '#6b7280', lineHeight: 1.5 }}>{n.body}</div>}
                            <div style={{ fontSize: '0.68rem', color: '#9ca3af', marginTop: '0.3rem' }}>
                              {new Date(n.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="dash-user-chip">
                <div className="dash-avatar">{userName.charAt(0).toUpperCase()}</div>
                <span>{userName}</span>
              </div>
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
