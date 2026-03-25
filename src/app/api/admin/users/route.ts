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

async function isSuperAdmin(userId: string) {
  const { data } = await adminSupabase.from('profiles').select('role').eq('id', userId).single()
  return data?.role === 'superadmin'
}

// GET — list all admin and superadmin users (superadmin only)
export async function GET() {
  try {
    const user = await getUser()
    if (!user || !(await isSuperAdmin(user.id))) return NextResponse.json({ error: 'Unauthorised' }, { status: 403 })

    const { data, error } = await adminSupabase
      .from('profiles')
      .select('id, full_name, email, role, created_at')
      .in('role', ['admin', 'superadmin'])
      .order('created_at', { ascending: true })

    if (error) {
      console.error('GET /api/admin/users error:', error.message)
      return NextResponse.json({ error: 'Could not load admin users.' }, { status: 500 })
    }
    return NextResponse.json(data)
  } catch (err) {
    console.error('GET /api/admin/users unexpected error:', err)
    return NextResponse.json({ error: 'Could not load admin users.' }, { status: 500 })
  }
}

// POST — invite a new admin user (superadmin only)
export async function POST(request: Request) {
  try {
    const user = await getUser()
    if (!user || !(await isSuperAdmin(user.id))) return NextResponse.json({ error: 'Unauthorised' }, { status: 403 })

    const { email, full_name } = await request.json()
    if (!email) return NextResponse.json({ error: 'Email address is required.' }, { status: 400 })

    // Check if a profile already exists with this email
    const { data: existing } = await adminSupabase
      .from('profiles')
      .select('id, role')
      .eq('email', email)
      .single()

    if (existing) {
      if (existing.role === 'superadmin') {
        return NextResponse.json({ error: 'This user is already a superadmin.' }, { status: 400 })
      }
      if (existing.role === 'admin') {
        return NextResponse.json({ error: 'This user is already an admin.' }, { status: 400 })
      }
      // Promote existing client to admin
      const { error } = await adminSupabase
        .from('profiles')
        .update({ role: 'admin' })
        .eq('id', existing.id)
      if (error) {
        console.error('Promote user error:', error.message)
        return NextResponse.json({ error: 'Could not update user role.' }, { status: 500 })
      }
      return NextResponse.json({ success: true, message: `${email} has been promoted to admin.` })
    }

    // No existing user — send an invite
    const { data: invited, error: inviteError } = await adminSupabase.auth.admin.inviteUserByEmail(email, {
      data: { full_name: full_name || '' },
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?next=/admin`,
    })

    if (inviteError) {
      console.error('Invite error:', inviteError.message)
      return NextResponse.json({ error: 'Could not send invite: ' + inviteError.message }, { status: 500 })
    }

    // Upsert profile with admin role (trigger may create it as 'client' first)
    if (invited.user) {
      await adminSupabase
        .from('profiles')
        .upsert({ id: invited.user.id, email, full_name: full_name || '', role: 'admin' }, { onConflict: 'id' })
    }

    return NextResponse.json({ success: true, message: `Invite sent to ${email}. They will receive an email to set their password.` })
  } catch (err) {
    console.error('POST /api/admin/users unexpected error:', err)
    return NextResponse.json({ error: 'Could not invite admin user.' }, { status: 500 })
  }
}

// PATCH — update an admin user's role (superadmin only)
export async function PATCH(request: Request) {
  try {
    const user = await getUser()
    if (!user || !(await isSuperAdmin(user.id))) return NextResponse.json({ error: 'Unauthorised' }, { status: 403 })

    const { id, role } = await request.json()
    if (!id || !role) return NextResponse.json({ error: 'User ID and role are required.' }, { status: 400 })
    if (!['admin', 'client'].includes(role)) return NextResponse.json({ error: 'Invalid role.' }, { status: 400 })
    if (id === user.id) return NextResponse.json({ error: 'You cannot change your own role.' }, { status: 400 })

    const { error } = await adminSupabase
      .from('profiles')
      .update({ role })
      .eq('id', id)

    if (error) {
      console.error('PATCH /api/admin/users error:', error.message)
      return NextResponse.json({ error: 'Could not update user role.' }, { status: 500 })
    }
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('PATCH /api/admin/users unexpected error:', err)
    return NextResponse.json({ error: 'Could not update user role.' }, { status: 500 })
  }
}
