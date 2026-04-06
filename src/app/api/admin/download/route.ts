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

async function getUserRole(userId: string) {
  const { data } = await adminSupabase.from('profiles').select('role').eq('id', userId).single()
  return data?.role as string | null
}

export async function GET(request: Request) {
  const user = await getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const path = searchParams.get('path')
  if (!path) return NextResponse.json({ error: 'No path provided.' }, { status: 400 })

  const role = await getUserRole(user.id)
  const isAdmin = role && ['admin', 'superadmin', 'finance', 'support', 'operations'].includes(role)

  if (isAdmin) {
    // Admins: verify path exists in projects table to prevent path guessing
    const { data: project } = await adminSupabase
      .from('projects')
      .select('id')
      .or(`deliverable_path.eq.${path},ai_report_path.eq.${path}`)
      .maybeSingle()

    if (!project) {
      return NextResponse.json({ error: 'File not found.' }, { status: 404 })
    }
  } else {
    // Clients: verify path belongs to one of their own projects
    const { data: project } = await adminSupabase
      .from('projects')
      .select('id')
      .eq('client_id', user.id)
      .or(`deliverable_path.eq.${path},ai_report_path.eq.${path}`)
      .maybeSingle()

    if (!project) {
      return NextResponse.json({ error: 'File not found.' }, { status: 404 })
    }
  }

  const { data, error } = await adminSupabase.storage.from('deliverables').createSignedUrl(path, 3600)
  if (error || !data?.signedUrl) {
    return NextResponse.json({ error: 'Could not generate download link.' }, { status: 500 })
  }

  return NextResponse.redirect(data.signedUrl)
}
