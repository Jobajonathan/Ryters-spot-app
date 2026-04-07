import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
}

export async function updateSession(request: NextRequest) {
  const { pathname } = request.nextUrl

  const supabaseResponse = NextResponse.next({ request })

  // If Supabase is not configured, guard dashboard/admin routes
  if (!isValidUrl(SUPABASE_URL) || !SUPABASE_ANON_KEY) {
    if (pathname.startsWith('/dashboard')) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }
    if (pathname.startsWith('/admin') && !['/admin/login', '/admin/set-password'].includes(pathname)) {
      const url = request.nextUrl.clone()
      url.pathname = '/admin/login'
      return NextResponse.redirect(url)
    }
    return supabaseResponse
  }

  let response = supabaseResponse

  const supabase = createServerClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // ── Unauthenticated guards ──────────────────────────────────────────────
  // Dashboard requires client login
  if (!user && pathname.startsWith('/dashboard')) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // Admin area (except /admin/login itself) requires admin login
  const adminPublicPaths = ['/admin/login', '/admin/set-password']
  if (!user && pathname.startsWith('/admin') && !adminPublicPaths.includes(pathname)) {
    const url = request.nextUrl.clone()
    url.pathname = '/admin/login'
    return NextResponse.redirect(url)
  }

  // ── Authenticated redirects ─────────────────────────────────────────────
  if (user) {
    // Fetch role once for routing decisions
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    const role = profile?.role ?? 'client'
    const isAdmin = ['admin', 'superadmin'].includes(role)

    // Logged-in users hitting /login or /signup → send to the right place
    if (pathname === '/login' || pathname === '/signup') {
      const url = request.nextUrl.clone()
      url.pathname = isAdmin ? '/admin' : '/dashboard'
      return NextResponse.redirect(url)
    }

    // Logged-in admin hitting /admin/login → skip, go to admin dashboard
    if (isAdmin && pathname === '/admin/login') {
      const url = request.nextUrl.clone()
      url.pathname = '/admin'
      return NextResponse.redirect(url)
    }

    // Non-admin hitting /admin/* → send to client portal
    if (!isAdmin && pathname.startsWith('/admin') && !adminPublicPaths.includes(pathname)) {
      const url = request.nextUrl.clone()
      url.pathname = '/dashboard'
      return NextResponse.redirect(url)
    }

    // Admin hitting /dashboard/* → send to admin portal
    if (isAdmin && pathname.startsWith('/dashboard')) {
      const url = request.nextUrl.clone()
      url.pathname = '/admin'
      return NextResponse.redirect(url)
    }
  }

  return response
}
