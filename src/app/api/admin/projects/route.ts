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

async function isAdmin(userId: string) {
  const { data } = await adminSupabase.from('profiles').select('role').eq('id', userId).single()
  return data?.role === 'admin'
}

// GET all projects with client info
export async function GET() {
  const user = await getUser()
  if (!user || !(await isAdmin(user.id))) return NextResponse.json({ error: 'Unauthorised' }, { status: 403 })

  const { data, error } = await adminSupabase
    .from('projects')
    .select(`*, profiles:client_id (full_name, email, country, company)`)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// PATCH update project status
export async function PATCH(request: Request) {
  const user = await getUser()
  if (!user || !(await isAdmin(user.id))) return NextResponse.json({ error: 'Unauthorised' }, { status: 403 })

  const { id, status, admin_notes } = await request.json()
  if (!id || !status) return NextResponse.json({ error: 'Project ID and status required.' }, { status: 400 })

  const { data: project, error } = await adminSupabase
    .from('projects')
    .update({ status, admin_notes, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select(`*, profiles:client_id (full_name, email)`)
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const STATUS_MESSAGES: Record<string, { subject: string; headline: string; body: string; color: string }> = {
    in_review:   { subject: 'Your project is under review', headline: 'We are reviewing your project', body: 'Our team is carefully reviewing your request. We will be in touch shortly with more details.', color: '#1e40af' },
    in_progress: { subject: 'Your project has started!', headline: 'Work has begun on your project', body: 'Great news! Your project is now in progress. Our team is actively working on your request. You will receive updates as we make progress.', color: '#065f46' },
    completed:   { subject: 'Your project is complete!', headline: 'Your project has been delivered', body: 'Your project has been completed and your deliverables are ready in your dashboard. Please log in to download your work.', color: '#166534' },
    cancelled:   { subject: 'Project update from Ryters Spot', headline: 'Project status update', body: 'We wanted to let you know about a status change on your project. Please log in to your dashboard or contact us for more information.', color: '#991b1b' },
  }

  const msg = STATUS_MESSAGES[status]
  if (msg && project.profiles?.email) {
    await resend.emails.send({
      from: 'Ryters Spot <noreply@theryters.com>',
      to: project.profiles.email,
      subject: `${msg.subject} — ${project.title}`,
      html: `
        <!DOCTYPE html><html><head><meta charset="UTF-8"/></head>
        <body style="margin:0;padding:0;background:#f8f7f4;font-family:Arial,sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8f7f4;padding:40px 20px;">
            <tr><td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
                <tr><td style="background:#1B4332;padding:32px 40px;border-radius:12px 12px 0 0;text-align:center;">
                  <span style="font-family:Georgia,serif;font-size:28px;font-weight:700;color:#fff;">Ryters Spot</span>
                  <div style="width:40px;height:2px;background:#C9A84C;margin:12px auto 0;"></div>
                </td></tr>
                <tr><td style="background:#fff;padding:40px;border-radius:0 0 12px 12px;border:1px solid #e5e7eb;border-top:none;">
                  <h1 style="font-family:Georgia,serif;font-size:22px;color:#1B4332;margin:0 0 8px;">${msg.headline}</h1>
                  <p style="color:#6b7280;font-size:14px;margin:0 0 20px;">Project: <strong>${project.title}</strong></p>
                  <p style="font-size:15px;line-height:1.8;margin:0 0 24px;">${msg.body}</p>
                  ${admin_notes ? `<div style="background:#f8f7f4;border-left:3px solid #C9A84C;padding:16px;border-radius:0 8px 8px 0;margin-bottom:24px;"><p style="margin:0 0 6px;font-size:12px;font-weight:700;text-transform:uppercase;color:#6b7280;">Note from our team</p><p style="margin:0;font-size:14px;color:#374151;">${admin_notes}</p></div>` : ''}
                  <div style="text-align:center;"><a href="https://theryters.com/dashboard/projects" style="display:inline-block;background:#1B4332;color:#fff;font-weight:600;font-size:14px;padding:12px 28px;border-radius:8px;text-decoration:none;">View My Dashboard</a></div>
                  <div style="margin-top:32px;padding-top:24px;border-top:1px solid #e5e7eb;text-align:center;"><p style="margin:0;font-size:12px;color:#9ca3af;">Ryters Spot &mdash; <a href="https://theryters.com" style="color:#1B4332;">theryters.com</a></p></div>
                </td></tr>
              </table>
            </td></tr>
          </table>
        </body></html>
      `,
    })
  }

  return NextResponse.json({ success: true, project })
}
