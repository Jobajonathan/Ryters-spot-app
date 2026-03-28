'use client'

import { useState, useEffect, ReactNode } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

type Role = 'superadmin' | 'admin' | 'finance' | 'support' | 'content'

interface NavItem { label: string; href: string; exact?: boolean; roles: string | string[] }
interface NavSection { title: string | null; items: NavItem[] }

const NAV: NavSection[] = [
  {
    title: null,
    items: [
      { label: 'Dashboard', href: '/admin', exact: true, roles: '*' },
    ]
  },
  {
    title: 'Operations',
    items: [
      { label: 'Applications', href: '/admin/applications', roles: ['superadmin','admin','support'] },
      { label: 'Clients & CRM', href: '/admin/users', roles: ['superadmin','admin','support'] },
      { label: 'Payments', href: '/admin/payments', roles: ['superadmin','finance'] },
    ]
  },
  {
    title: 'Catalogue',
    items: [
      { label: 'Services & Pricing', href: '/admin/services', roles: ['superadmin','admin'] },
    ]
  },
  {
    title: 'Content',
    items: [
      { label: 'Blog Posts', href: '/admin/blog', roles: ['superadmin','admin','content'] },
      { label: 'Website Content', href: '/admin/content', roles: ['superadmin','admin','content'] },
    ]
  },
  {
    title: 'System',
    items: [
      { label: 'Admin Team', href: '/admin/team', roles: ['superadmin'] },
      { label: 'Security', href: '/admin/security', roles: '*' },
    ]
  },
]

const ICONS: Record<string, string> = {
  '/admin': `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>`,
  '/admin/applications': `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>`,
  '/admin/users': `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>`,
  '/admin/payments': `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>`,
  '/admin/services': `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>`,
  '/admin/blog': `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`,
  '/admin/content': `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>`,
  '/admin/team': `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 10-16 0"/></svg>`,
  '/admin/security': `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
}

function hasAccess(roles: string | string[], role: Role): boolean {
  if (roles === '*') return true
  if (role === 'superadmin') return true
  return Array.isArray(roles) ? roles.includes(role) : roles === role
}

// Main layout — skips sidebar on login page
export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  if (pathname === '/admin/login' || pathname === '/admin/set-password') return <>{children}</>
  return <AdminShell>{children}</AdminShell>
}

// Shell renders after auth check
function AdminShell({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [role, setRole] = useState<Role | null>(null)
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    fetch('/api/admin/me')
      .then(r => r.json())
      .then(data => {
        if (data.role && ['admin','superadmin','finance','support','content'].includes(data.role)) {
          setRole(data.role as Role)
          setName(data.full_name || data.email || 'Admin')
        } else {
          router.replace('/admin/login')
        }
        setLoading(false)
      })
      .catch(() => { router.replace('/admin/login'); setLoading(false) })
  }, [router])

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh', background:'#f4f6f8', fontFamily:'Arial,sans-serif', color:'#666' }}>
      <div>
        <div style={{ width:32, height:32, border:'3px solid #1B4332', borderTopColor:'transparent', borderRadius:'50%', animation:'spin 0.8s linear infinite', margin:'0 auto 1rem' }}/>
        Loading admin portal...
      </div>
    </div>
  )

  if (!role) return null

  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

  function isActive(item: NavItem) {
    if (item.exact) return pathname === item.href
    return pathname.startsWith(item.href)
  }

  return (
    <>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        * { box-sizing: border-box; }
        body { margin: 0; }
        .admin-shell { display: flex; min-height: 100vh; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }

        /* Sidebar */
        .admin-sidebar {
          width: 240px; min-height: 100vh; background: #0f1a14;
          display: flex; flex-direction: column;
          position: fixed; left: 0; top: 0; bottom: 0; z-index: 50;
          transition: transform 0.25s ease;
        }
        .admin-sidebar-logo {
          padding: 1.5rem 1.25rem 1rem;
          border-bottom: 1px solid rgba(255,255,255,0.07);
        }
        .admin-sidebar-logo-mark {
          display: flex; align-items: center; gap: 0.6rem; text-decoration: none;
        }
        .admin-sidebar-logo-badge {
          width: 32px; height: 32px; background: #1B4332;
          border-radius: 8px; display: flex; align-items: center; justify-content: center;
          font-family: Georgia, serif; font-size: 0.9rem; font-weight: 700; color: #C9A84C;
        }
        .admin-sidebar-logo-text { line-height: 1.2; }
        .admin-sidebar-logo-name { font-family: Georgia, serif; font-size: 0.95rem; font-weight: 700; color: #fff; }
        .admin-sidebar-logo-sub { font-size: 0.65rem; color: rgba(255,255,255,0.4); text-transform: uppercase; letter-spacing: 0.08em; }

        /* Nav */
        .admin-sidebar-nav { flex: 1; overflow-y: auto; padding: 0.75rem 0; }
        .admin-nav-section { padding: 0 0.75rem; margin-bottom: 0.25rem; }
        .admin-nav-section-title {
          font-size: 0.65rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em;
          color: rgba(255,255,255,0.3); padding: 0.75rem 0.5rem 0.35rem;
        }
        .admin-nav-item {
          display: flex; align-items: center; gap: 0.6rem;
          padding: 0.55rem 0.75rem; border-radius: 7px; margin-bottom: 2px;
          text-decoration: none; font-size: 0.875rem; font-weight: 500;
          color: rgba(255,255,255,0.6); cursor: pointer;
          transition: all 0.15s; border-left: 3px solid transparent;
        }
        .admin-nav-item:hover { background: rgba(255,255,255,0.06); color: rgba(255,255,255,0.9); }
        .admin-nav-item.active {
          background: rgba(201,168,76,0.12); color: #C9A84C;
          border-left-color: #C9A84C; font-weight: 600;
        }
        .admin-nav-item svg { flex-shrink: 0; opacity: 0.7; }
        .admin-nav-item.active svg { opacity: 1; }

        /* User area */
        .admin-sidebar-user {
          padding: 1rem 1.25rem;
          border-top: 1px solid rgba(255,255,255,0.07);
        }
        .admin-user-row { display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.75rem; }
        .admin-user-avatar {
          width: 32px; height: 32px; background: #1B4332;
          border-radius: 50%; display: flex; align-items: center; justify-content: center;
          font-size: 0.75rem; font-weight: 700; color: #C9A84C; flex-shrink: 0;
        }
        .admin-user-name { font-size: 0.82rem; font-weight: 600; color: #fff; line-height: 1.2; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 140px; }
        .admin-user-role {
          font-size: 0.6rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.07em;
          color: #C9A84C; background: rgba(201,168,76,0.15); padding: 1px 7px; border-radius: 100px;
        }
        .admin-logout-btn {
          width: 100%; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.55); font-size: 0.78rem; font-weight: 600;
          padding: 0.45rem; border-radius: 7px; cursor: pointer;
          transition: all 0.15s; display: flex; align-items: center; justify-content: center; gap: 0.4rem;
        }
        .admin-logout-btn:hover { background: rgba(239,68,68,0.12); border-color: rgba(239,68,68,0.3); color: #f87171; }

        /* Main content */
        .admin-main { margin-left: 240px; flex: 1; background: #f4f6f8; min-height: 100vh; display: flex; flex-direction: column; }
        .admin-topbar {
          height: 56px; background: #fff; border-bottom: 1px solid #e5e7eb;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 2rem; flex-shrink: 0; position: sticky; top: 0; z-index: 40;
        }
        .admin-topbar-title { font-size: 0.875rem; font-weight: 600; color: #374151; }
        .admin-topbar-breadcrumb { font-size: 0.78rem; color: #9ca3af; }
        .admin-content { flex: 1; padding: 2rem; max-width: 1200px; width: 100%; }

        /* Mobile hamburger */
        .admin-hamburger {
          display: none; background: none; border: none; cursor: pointer;
          padding: 0.4rem; color: #374151;
        }
        .admin-overlay {
          display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 40;
        }

        @media (max-width: 768px) {
          .admin-sidebar { transform: translateX(-100%); }
          .admin-sidebar.open { transform: translateX(0); }
          .admin-main { margin-left: 0; }
          .admin-hamburger { display: flex; }
          .admin-overlay.show { display: block; }
        }
      `}</style>

      <div className="admin-shell">
        {/* Overlay for mobile */}
        <div className={`admin-overlay${sidebarOpen ? ' show' : ''}`} onClick={() => setSidebarOpen(false)} />

        {/* Sidebar */}
        <aside className={`admin-sidebar${sidebarOpen ? ' open' : ''}`}>
          <div className="admin-sidebar-logo">
            <Link href="/admin" className="admin-sidebar-logo-mark">
              <div className="admin-sidebar-logo-badge">RS</div>
              <div className="admin-sidebar-logo-text">
                <div className="admin-sidebar-logo-name">Ryters Spot</div>
                <div className="admin-sidebar-logo-sub">Admin Portal</div>
              </div>
            </Link>
          </div>

          <nav className="admin-sidebar-nav">
            {NAV.map((section, si) => (
              <div className="admin-nav-section" key={si}>
                {section.title && <div className="admin-nav-section-title">{section.title}</div>}
                {section.items
                  .filter(item => hasAccess(item.roles, role))
                  .map(item => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`admin-nav-item${isActive(item) ? ' active' : ''}`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      {ICONS[item.href] && (
                        <span dangerouslySetInnerHTML={{ __html: ICONS[item.href] }} style={{ display:'flex', alignItems:'center' }} />
                      )}
                      {item.label}
                    </Link>
                  ))
                }
              </div>
            ))}
          </nav>

          <div className="admin-sidebar-user">
            <div className="admin-user-row">
              <div className="admin-user-avatar">{initials}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="admin-user-name">{name}</div>
                <span className="admin-user-role">{role === 'superadmin' ? '★ Superadmin' : role}</span>
              </div>
            </div>
            <button className="admin-logout-btn" onClick={handleLogout}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              Sign Out
            </button>
          </div>
        </aside>

        {/* Main area */}
        <div className="admin-main">
          <header className="admin-topbar">
            <button className="admin-hamburger" onClick={() => setSidebarOpen(true)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            </button>
            <div>
              <Link href="/" target="_blank" style={{ fontSize:'0.78rem', color:'#9ca3af', textDecoration:'none', display:'flex', alignItems:'center', gap:'0.3rem' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                View site
              </Link>
            </div>
          </header>
          <div className="admin-content">
            {children}
          </div>
        </div>
      </div>
    </>
  )
}
