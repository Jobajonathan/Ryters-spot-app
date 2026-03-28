import { NextResponse } from 'next/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

const adminSupabase = createAdminClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function getUser() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: (c) => c.forEach(({ name, value, options }) => cookieStore.set(name, value, options)) } }
  )
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

async function isAdmin(userId: string) {
  const { data } = await adminSupabase.from('profiles').select('role').eq('id', userId).single()
  return data?.role && ['admin', 'superadmin', 'finance', 'support', 'operations'].includes(data.role)
}

export async function GET(request: Request) {
  const user = await getUser()
  if (!user || !(await isAdmin(user.id))) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 403 })
  }

  const { searchParams } = new URL(request.url)
  const path = searchParams.get('path')
  if (!path) return NextResponse.json({ error: 'No path provided.' }, { status: 400 })

  const { data, error } = await adminSupabase.storage.from('deliverables').createSignedUrl(path, 3600)
  if (error || !data?.signedUrl) {
    return NextResponse.json({ error: 'Could not generate download link.' }, { status: 500 })
  }

  return NextResponse.redirect(data.signedUrl)
}
