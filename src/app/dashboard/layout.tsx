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
  { label: 'Overview',         icon: '◈',  href: '/dashboard' },
  { label: 'Request a Service', icon: '+',  href: '/dashboard/request' },
  { label: 'My Projects',      icon: '▤',  href: '/dashboard/projects' },
  { label: 'Deliverables',     icon: '↓',  href: '/dashboard/deliverables' },
  { label: 'Payments',         icon: '◎',  href: '/dashboard/payments' },
  { label: 'Messages',         icon: '◻',  href: '/dashboard/messages' },
  { label: 'Settings',         icon: '⚙',  href: '/dashboard/settings' },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [userName, setUserName] = useState('Client')
  const [userInitial, setUserInitial] = useState('C')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [notifOpen, setNotifOpen] = useState(false)
  const notifRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function loadUser() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const fullName = user.user_metadata?.full_name as string | undefined
        const name = fullName ? fullName.split(' ')[0] : user.email?.split('@')[0] || 'Client'
        setUserName(name)
        setUserInitial(name.charAt(0).toUpperCase())
      }
    }
    loadUser()
  }, [])

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
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false)
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

  const unreadCount = notifications.filter(n => !n.read).length

  const pageTitle = navItems.find(n => (n.href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(n.href)))?.label || 'Dashboard'

  return (
    <>
      <style>{`
        /* ── Layout shell ── */
        .ds-shell { display: flex; min-height: 100vh; background: #F4F6F8; }
        [data-theme="dark"] .ds-shell { background: var(--clr-bg); }

        /* ── Sidebar ── */
        .ds-sidebar {
          width: 248px;
          background: var(--clr-primary);
          display: flex;
          flex-direction: column;
          flex-shrink: 0;
          position: sticky;
          top: 0;
          height: 100vh;
          overflow-y: auto;
          scrollbar-width: none;
        }
        .ds-sidebar::-webkit-scrollbar { display: none; }

        /* Logo area */
        .ds-logo {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          padding: 1.375rem 1.25rem 1.25rem;
          border-bottom: 1px solid rgba(255,255,255,0.07);
          text-decoration: none;
          flex-shrink: 0;
        }
        .ds-logo-text {
          font-family: var(--font-heading);
          font-size: 1.05rem;
          font-weight: 800;
          color: #fff;
          letter-spacing: -0.02em;
        }
        .ds-logo-badge {
          font-size: 0.62rem;
          font-weight: 700;
          background: rgba(201,168,76,0.25);
          color: #C9A84C;
          padding: 0.15rem 0.4rem;
          border-radius: 4px;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        /* Navigation */
        .ds-nav { flex: 1; padding: 0.75rem 0.75rem; display: flex; flex-direction: column; gap: 0.15rem; }
        .ds-nav-section {
          font-size: 0.63rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.3);
          padding: 0.75rem 0.5rem 0.4rem;
        }
        .ds-nav-item {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          padding: 0.65rem 0.85rem;
          border-radius: 10px;
          font-family: var(--font-heading);
          font-size: 0.875rem;
          font-weight: 500;
          color: rgba(255,255,255,0.65);
          text-decoration: none;
          transition: all 0.16s;
          position: relative;
        }
        .ds-nav-item:hover {
          background: rgba(255,255,255,0.07);
          color: rgba(255,255,255,0.9);
        }
        .ds-nav-item.active {
          background: rgba(201,168,76,0.14);
          color: #C9A84C;
          font-weight: 600;
        }
        .ds-nav-icon {
          width: 18px;
          text-align: center;
          font-size: 0.95rem;
          flex-shrink: 0;
          opacity: 0.8;
        }
        .ds-nav-item.active .ds-nav-icon { opacity: 1; }

        /* User + sign-out */
        .ds-sidebar-foot {
          padding: 0.75rem;
          border-top: 1px solid rgba(255,255,255,0.07);
          flex-shrink: 0;
        }
        .ds-user-row {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          padding: 0.6rem 0.5rem;
          margin-bottom: 0.5rem;
        }
        .ds-avatar-sm {
          width: 32px; height: 32px;
          border-radius: 50%;
          background: linear-gradient(135deg, #C9A84C, #E8C97A);
          display: flex; align-items: center; justify-content: center;
          font-family: var(--font-heading);
          font-size: 0.8rem;
          font-weight: 700;
          color: #0f1923;
          flex-shrink: 0;
        }
        .ds-user-name {
          font-family: var(--font-heading);
          font-size: 0.875rem;
          font-weight: 600;
          color: rgba(255,255,255,0.85);
          flex: 1;
          min-width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .ds-signout-btn {
          width: 100%;
          padding: 0.55rem 0.85rem;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 9px;
          color: rgba(255,255,255,0.55);
          font-family: var(--font-heading);
          font-size: 0.82rem;
          font-weight: 600;
          cursor: pointer;
          text-align: center;
          transition: all 0.18s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }
        .ds-signout-btn:hover {
          background: rgba(255,255,255,0.09);
          color: rgba(255,255,255,0.8);
          border-color: rgba(255,255,255,0.18);
        }

        /* ── Main area ── */
        .ds-main { flex: 1; display: flex; flex-direction: column; min-width: 0; }

        /* Topbar */
        .ds-topbar {
          background: #fff;
          border-bottom: 1px solid #E8EAED;
          padding: 0 1.75rem;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          position: sticky;
          top: 0;
          z-index: 50;
          flex-shrink: 0;
        }
        [data-theme="dark"] .ds-topbar { background: var(--clr-surface); border-bottom-color: var(--clr-border); }
        .ds-topbar-left { display: flex; align-items: center; gap: 0.75rem; }
        .ds-topbar-title {
          font-family: var(--font-heading);
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--clr-text);
          letter-spacing: -0.01em;
        }
        .ds-topbar-right { display: flex; align-items: center; gap: 0.75rem; }

        /* Mobile toggle */
        .ds-mob-toggle {
          display: none;
          align-items: center;
          justify-content: center;
          width: 36px; height: 36px;
          background: transparent;
          border: 1.5px solid var(--clr-border);
          border-radius: 8px;
          cursor: pointer;
          font-size: 1rem;
          color: var(--clr-text-muted);
          transition: all 0.18s;
        }
        .ds-mob-toggle:hover { background: var(--clr-surface-2); }

        /* Notif button */
        .ds-notif-btn {
          position: relative;
          width: 36px; height: 36px;
          background: transparent;
          border: 1.5px solid var(--clr-border);
          border-radius: 9px;
          display: flex; align-items: center; justify-content: center;
          font-size: 0.95rem;
          color: var(--clr-text-muted);
          cursor: pointer;
          transition: all 0.18s;
        }
        .ds-notif-btn:hover { background: var(--clr-surface-2); color: var(--clr-text); }
        .ds-notif-dot {
          position: absolute;
          top: 6px; right: 6px;
          width: 8px; height: 8px;
          background: #ef4444;
          border-radius: 50%;
          border: 1.5px solid #fff;
        }
        .ds-notif-count {
          position: absolute;
          top: -4px; right: -4px;
          min-width: 18px; height: 18px;
          background: #ef4444;
          border-radius: 9px;
          font-size: 0.62rem;
          font-weight: 700;
          color: #fff;
          display: flex; align-items: center; justify-content: center;
          padding: 0 3px;
          border: 2px solid #fff;
        }

        /* Notification panel */
        .ds-notif-panel {
          position: absolute;
          top: calc(100% + 10px);
          right: 0;
          width: 360px;
          max-width: calc(100vw - 2rem);
          background: #fff;
          border: 1px solid #E8EAED;
          border-radius: 16px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.1), 0 2px 8px rgba(0,0,0,0.06);
          z-index: 400;
          overflow: hidden;
        }
        [data-theme="dark"] .ds-notif-panel { background: var(--clr-surface); border-color: var(--clr-border); }
        .ds-notif-hd {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 1.25rem 0.75rem;
          border-bottom: 1px solid #f3f4f6;
        }
        .ds-notif-hd-title { font-family: var(--font-heading); font-weight: 700; font-size: 0.9rem; color: #111827; }
        .ds-notif-mark { font-size: 0.75rem; color: var(--clr-primary); font-weight: 600; background: none; border: none; cursor: pointer; }
        .ds-notif-item {
          display: block;
          padding: 0.85rem 1.25rem;
          border-bottom: 1px solid #f9fafb;
          cursor: pointer;
          transition: background 0.14s;
          text-decoration: none;
          color: inherit;
        }
        .ds-notif-item:hover { background: #f9fafb; }
        .ds-notif-item.unread { background: #f0fdf4; }
        .ds-notif-item:last-child { border-bottom: none; }
        .ds-notif-title { font-weight: 700; font-size: 0.875rem; color: #111827; margin-bottom: 0.15rem; font-family: var(--font-heading); }
        .ds-notif-body  { font-size: 0.78rem; color: #6b7280; line-height: 1.5; }
        .ds-notif-time  { font-size: 0.68rem; color: #9ca3af; margin-top: 0.3rem; }
        .ds-notif-empty { padding: 2.5rem; text-align: center; color: #9ca3af; font-size: 0.875rem; }

        /* User chip */
        .ds-user-chip {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.3rem 0.7rem 0.3rem 0.35rem;
          background: var(--clr-surface-2);
          border: 1.5px solid var(--clr-border);
          border-radius: 100px;
          font-family: var(--font-heading);
          font-size: 0.82rem;
          font-weight: 600;
          color: var(--clr-text);
        }
        .ds-chip-avatar {
          width: 26px; height: 26px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--clr-primary), var(--clr-primary-light));
          display: flex; align-items: center; justify-content: center;
          font-size: 0.7rem;
          font-weight: 700;
          color: #fff;
          flex-shrink: 0;
        }

        /* Content area */
        .ds-content { flex: 1; padding: 2rem 1.75rem; }

        /* Overlay */
        .ds-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.45); z-index: 199; display: none; }
        .ds-overlay.show { display: block; }

        /* Mobile sidebar */
        @media (max-width: 900px) {
          .ds-sidebar { position: fixed; left: -248px; z-index: 200; transition: left 0.28s cubic-bezier(0.4,0,0.2,1); box-shadow: none; }
          .ds-sidebar.open { left: 0; box-shadow: 4px 0 24px rgba(0,0,0,0.15); }
          .ds-mob-toggle { display: flex; }
          .ds-content { padding: 1.5rem 1rem; }
          .ds-topbar { padding: 0 1rem; }
        }
      `}</style>

      <div className="ds-shell">

        {/* ── Sidebar ── */}
        <aside className={`ds-sidebar${sidebarOpen ? ' open' : ''}`}>
          <Link href="/" className="ds-logo" onClick={() => setSidebarOpen(false)}>
            <span className="ds-logo-text">Ryters Spot</span>
            <span className="ds-logo-badge">Client</span>
          </Link>

          <nav className="ds-nav" aria-label="Dashboard navigation">
            <span className="ds-nav-section">Navigation</span>
            {navItems.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className={`ds-nav-item${isActive(item.href) ? ' active' : ''}`}
                onClick={() => setSidebarOpen(false)}
              >
                <span className="ds-nav-icon">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          <div className="ds-sidebar-foot">
            <div className="ds-user-row">
              <div className="ds-avatar-sm">{userInitial}</div>
              <span className="ds-user-name">{userName}</span>
            </div>
            <button className="ds-signout-btn" onClick={signOut}>
              <span>↩</span> Sign Out
            </button>
          </div>
        </aside>

        <div className={`ds-overlay${sidebarOpen ? ' show' : ''}`} onClick={() => setSidebarOpen(false)} />

        {/* ── Main ── */}
        <div className="ds-main">

          {/* Topbar */}
          <header className="ds-topbar">
            <div className="ds-topbar-left">
              <button className="ds-mob-toggle" onClick={() => setSidebarOpen(true)} aria-label="Open sidebar">
                ☰
              </button>
              <span className="ds-topbar-title">{pageTitle}</span>
            </div>

            <div className="ds-topbar-right">
              {/* Notifications */}
              <div ref={notifRef} style={{ position: 'relative' }}>
                <button className="ds-notif-btn" onClick={() => setNotifOpen(o => !o)} aria-label="Notifications">
                  🔔
                  {unreadCount > 0 && (
                    <span className="ds-notif-count">{unreadCount > 9 ? '9+' : unreadCount}</span>
                  )}
                </button>
                {notifOpen && (
                  <div className="ds-notif-panel">
                    <div className="ds-notif-hd">
                      <span className="ds-notif-hd-title">Notifications</span>
                      {notifications.some(n => !n.read) && (
                        <button className="ds-notif-mark" onClick={markAllRead}>Mark all read</button>
                      )}
                    </div>
                    {notifications.length === 0 ? (
                      <div className="ds-notif-empty">No notifications yet.</div>
                    ) : (
                      <div style={{ maxHeight: 380, overflowY: 'auto' }}>
                        {notifications.slice(0, 20).map(n => (
                          <div
                            key={n.id}
                            className={`ds-notif-item${n.read ? '' : ' unread'}`}
                            onClick={() => markRead(n.id, n.link)}
                          >
                            <div className="ds-notif-title">{n.title}</div>
                            {n.body && <div className="ds-notif-body">{n.body}</div>}
                            <div className="ds-notif-time">
                              {new Date(n.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* User chip */}
              <div className="ds-user-chip">
                <div className="ds-chip-avatar">{userInitial}</div>
                <span>{userName}</span>
              </div>
            </div>
          </header>

          {/* Page content */}
          <main className="ds-content">
            {children}
          </main>
        </div>

      </div>
    </>
  )
}
