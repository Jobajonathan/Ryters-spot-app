import { createServerClient } from '@supabase/ssr'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const ADMIN_ROLES = ['admin', 'superadmin', 'support', 'operations', 'finance', 'content']

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') ?? ''
  const type = requestUrl.searchParams.get('type')

  if (code) {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll() },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          },
        },
      }
    )
    const { data: sessionData, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // Password recovery — always send to reset-password page
      if (type === 'recovery') {
        return NextResponse.redirect(new URL('/reset-password', requestUrl.origin))
      }

      // If a specific `next` param was passed, respect it
      if (next) {
        return NextResponse.redirect(new URL(next, requestUrl.origin))
      }

      // Role-aware default redirect
      if (sessionData?.user) {
        try {
          const adminSupabase = createAdminClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
          )
          const { data: profile } = await adminSupabase
            .from('profiles')
            .select('role')
            .eq('id', sessionData.user.id)
            .single()

          if (profile?.role && ADMIN_ROLES.includes(profile.role)) {
            return NextResponse.redirect(new URL('/admin', requestUrl.origin))
          }
        } catch {
          // Fall through to default
        }
      }

      return NextResponse.redirect(new URL('/dashboard', requestUrl.origin))
    }
  }

  return NextResponse.redirect(new URL('/login?error=auth_callback_failed', requestUrl.origin))
}
