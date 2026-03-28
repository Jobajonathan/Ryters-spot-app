import { NextResponse } from 'next/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
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

async function getAdminProfile(userId: string) {
  const { data } = await adminSupabase.from('profiles').select('full_name, email, role').eq('id', userId).single()
  return data
}

async function logAudit(adminId: string, adminName: string, action: string, targetId?: string, targetName?: string, details?: object) {
  try {
    await adminSupabase.from('admin_audit_log').insert({
      admin_id: adminId,
      admin_name: adminName,
      action,
      target_id: targetId || null,
      target_name: targetName || null,
      details: details || {},
    })
  } catch (e) {
    console.error('Audit log error:', e)
  }
}

// GET — list all admin users (superadmin only)
export async function GET() {
  try {
    const user = await getUser()
    if (!user || !(await isSuperAdmin(user.id))) return NextResponse.json({ error: 'Unauthorised' }, { status: 403 })

    const { data, error } = await adminSupabase
      .from('profiles')
      .select('id, full_name, email, role, privileges, suspended_at, created_at')
      .in('role', ['admin', 'superadmin'])
      .order('created_at', { ascending: true })

    if (error) return NextResponse.json({ error: 'Could not load admin users.' }, { status: 500 })
    return NextResponse.json(data)
  } catch (err) {
    console.error('GET /api/admin/users unexpected error:', err)
    return NextResponse.json({ error: 'Could not load admin users.' }, { status: 500 })
  }
}

// POST — invite a new admin (superadmin only)
export async function POST(request: Request) {
  try {
    const user = await getUser()
    if (!user || !(await isSuperAdmin(user.id))) return NextResponse.json({ error: 'Unauthorised' }, { status: 403 })

    const { email, full_name, privileges = [] } = await request.json()
    if (!email) return NextResponse.json({ error: 'Email address is required.' }, { status: 400 })

    const adminProfile = await getAdminProfile(user.id)
    const privilegeList = (privileges as string[]).join(', ') || 'General'

    // Check if profile already exists
    const { data: existing } = await adminSupabase.from('profiles').select('id, role').eq('email', email).single()

    if (existing) {
      if (['admin', 'superadmin'].includes(existing.role)) {
        return NextResponse.json({ error: 'This user is already an admin.' }, { status: 400 })
      }
      // Promote existing client
      await adminSupabase.from('profiles').update({ role: 'admin', privileges }).eq('id', existing.id)
      await logAudit(user.id, adminProfile?.full_name || user.email || 'Unknown', 'invite_admin', existing.id, full_name || email, { email, privileges })
      return NextResponse.json({ success: true, message: `${email} has been promoted to admin.` })
    }

    // Send invite via Supabase
    const { data: invited, error: inviteError } = await adminSupabase.auth.admin.inviteUserByEmail(email, {
      data: { full_name: full_name || '' },
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?next=/admin/set-password`,
    })

    if (inviteError) return NextResponse.json({ error: 'Could not send invite: ' + inviteError.message }, { status: 500 })

    if (invited.user) {
      await adminSupabase.from('profiles').upsert({
        id: invited.user.id,
        email,
        full_name: full_name || '',
        role: 'admin',
        privileges,
      }, { onConflict: 'id' })
    }

    // Branded invite email (sent in addition to Supabase's default — override below)
    // We send our own branded email with role details
    await resend.emails.send({
      from: 'Ryters Spot <noreply@theryters.com>',
      to: email,
      subject: `You have been invited to join the Ryters Spot admin team`,
      html: `<!DOCTYPE html><html><head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#f8f7f4;font-family:Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f8f7f4;padding:40px 20px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
<tr><td style="background:#1B4332;padding:32px 40px;border-radius:12px 12px 0 0;text-align:center;">
<span style="font-family:Georgia,serif;font-size:28px;font-weight:700;color:#fff;">Ryters Spot</span>
<div style="width:40px;height:2px;background:#C9A84C;margin:12px auto 0;border-radius:2px;"></div>
</td></tr>
<tr><td style="background:#fff;padding:40px;border-radius:0 0 12px 12px;border:1px solid #e5e7eb;border-top:none;">
<h1 style="font-family:Georgia,serif;font-size:22px;color:#1B4332;margin:0 0 8px;">You have been invited!</h1>
<p style="color:#6b7280;font-size:14px;margin:0 0 24px;">Invited by: <strong>${adminProfile?.full_name || 'Ryters Spot Admin'}</strong></p>
<p style="font-size:15px;line-height:1.8;margin:0 0 20px;">Hi${full_name ? ' ' + full_name.split(' ')[0] : ''}, you have been invited to join the <strong>Ryters Spot admin portal</strong> as a team member.</p>
<div style="background:#f8f7f4;border-radius:10px;padding:20px;margin:20px 0;">
  <table style="width:100%;border-collapse:collapse;">
    <tr><td style="padding:6px 0;color:#6b7280;font-size:13px;width:120px;">Role</td><td style="font-size:14px;font-weight:600;color:#1B4332;">Admin</td></tr>
    <tr><td style="padding:6px 0;color:#6b7280;font-size:13px;">Privileges</td><td style="font-size:14px;font-weight:600;">${privilegeList}</td></tr>
    <tr><td style="padding:6px 0;color:#6b7280;font-size:13px;">Portal</td><td style="font-size:14px;"><a href="https://theryters.com/admin" style="color:#1B4332;">theryters.com/admin</a></td></tr>
  </table>
</div>
<p style="font-size:14px;color:#374151;margin:0 0 24px;">Click the button below to set your password and access the admin portal. This link expires in 24 hours.</p>
<div style="text-align:center;">
  <a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin/set-password" style="display:inline-block;background:#1B4332;color:#fff;font-weight:600;font-size:14px;padding:12px 28px;border-radius:8px;text-decoration:none;">Set My Password</a>
</div>
<p style="font-size:12px;color:#9ca3af;margin-top:20px;">If you were not expecting this invitation, you can safely ignore this email.</p>
<div style="margin-top:32px;padding-top:24px;border-top:1px solid #e5e7eb;text-align:center;">
<p style="margin:0;font-size:12px;color:#9ca3af;">Ryters Spot &mdash; <a href="https://theryters.com" style="color:#1B4332;">theryters.com</a></p>
</div>
</td></tr>
</table>
</td></tr>
</table>
</body></html>`,
    })

    await logAudit(user.id, adminProfile?.full_name || user.email || 'Unknown', 'invite_admin', invited.user?.id, full_name || email, { email, privileges })
    return NextResponse.json({ success: true, message: `Invite sent to ${email}. They will receive an email to set their password.` })
  } catch (err) {
    console.error('POST /api/admin/users unexpected error:', err)
    return NextResponse.json({ error: 'Could not invite admin user.' }, { status: 500 })
  }
}

// PATCH — suspend / reinstate / revoke / update privileges (superadmin only)
export async function PATCH(request: Request) {
  try {
    const user = await getUser()
    if (!user || !(await isSuperAdmin(user.id))) return NextResponse.json({ error: 'Unauthorised' }, { status: 403 })

    const { id, action, privileges } = await request.json()
    if (!id || !action) return NextResponse.json({ error: 'User ID and action are required.' }, { status: 400 })
    if (id === user.id) return NextResponse.json({ error: 'You cannot modify your own account.' }, { status: 400 })

    const adminProfile = await getAdminProfile(user.id)
    const { data: target } = await adminSupabase.from('profiles').select('full_name, email, role').eq('id', id).single()
    if (!target) return NextResponse.json({ error: 'User not found.' }, { status: 404 })

    if (action === 'suspend') {
      await adminSupabase.from('profiles').update({ suspended_at: new Date().toISOString(), suspended_by: user.id }).eq('id', id)
      // Ban in Supabase Auth (effectively disables login)
      await adminSupabase.auth.admin.updateUserById(id, { ban_duration: '876600h' })
      await logAudit(user.id, adminProfile?.full_name || user.email || 'Unknown', 'suspend_admin', id, target.full_name || target.email, {})
      return NextResponse.json({ success: true, message: `${target.full_name || target.email} has been suspended.` })
    }

    if (action === 'reinstate') {
      await adminSupabase.from('profiles').update({ suspended_at: null, suspended_by: null }).eq('id', id)
      await adminSupabase.auth.admin.updateUserById(id, { ban_duration: 'none' })
      await logAudit(user.id, adminProfile?.full_name || user.email || 'Unknown', 'reinstate_admin', id, target.full_name || target.email, {})
      return NextResponse.json({ success: true, message: `${target.full_name || target.email} has been reinstated.` })
    }

    if (action === 'revoke') {
      await adminSupabase.from('profiles').update({ role: 'client', privileges: [], suspended_at: null, suspended_by: null }).eq('id', id)
      await adminSupabase.auth.admin.updateUserById(id, { ban_duration: 'none' })
      await logAudit(user.id, adminProfile?.full_name || user.email || 'Unknown', 'revoke_admin', id, target.full_name || target.email, {})
      return NextResponse.json({ success: true, message: `Admin access removed for ${target.full_name || target.email}. Their account and history are preserved.` })
    }

    if (action === 'update_privileges') {
      if (!Array.isArray(privileges)) return NextResponse.json({ error: 'Privileges must be an array.' }, { status: 400 })
      await adminSupabase.from('profiles').update({ privileges }).eq('id', id)
      await logAudit(user.id, adminProfile?.full_name || user.email || 'Unknown', 'update_privileges', id, target.full_name || target.email, { privileges })
      return NextResponse.json({ success: true, message: 'Privileges updated.' })
    }

    return NextResponse.json({ error: 'Unknown action.' }, { status: 400 })
  } catch (err) {
    console.error('PATCH /api/admin/users unexpected error:', err)
    return NextResponse.json({ error: 'Could not update user.' }, { status: 500 })
  }
}
