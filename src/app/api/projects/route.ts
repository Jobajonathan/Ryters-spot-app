import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const adminSupabase = createAdminClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function getSupabase() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options)),
      },
    }
  )
}

// GET — list current user's projects
export async function GET() {
  try {
    const supabase = await getSupabase()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('client_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('GET /api/projects error:', error.message)
      return NextResponse.json({ error: 'Could not load your projects. Please try again.' }, { status: 500 })
    }
    return NextResponse.json(data)
  } catch (err) {
    console.error('GET /api/projects unexpected error:', err)
    return NextResponse.json({ error: 'Could not load your projects. Please try again.' }, { status: 500 })
  }
}

// POST — create new project
export async function POST(request: Request) {
  try {
  const supabase = await getSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const body = await request.json()
  const { service, title, description, deadline, urgency, budget_range } = body

  if (!service || !title || !description) {
    return NextResponse.json({ error: 'Service, title and description are required.' }, { status: 400 })
  }

  // Get client profile
  const { data: profile } = await adminSupabase
    .from('profiles')
    .select('full_name, email')
    .eq('id', user.id)
    .single()

  // Insert project
  const { data: project, error } = await supabase
    .from('projects')
    .insert([{ client_id: user.id, service, title, description, deadline, urgency, budget_range, status: 'pending' }])
    .select()
    .single()

  if (error) {
    console.error('POST /api/projects DB error:', error.message)
    return NextResponse.json({ error: 'Could not save your request. Please try again or contact us at hello@theryters.com.' }, { status: 500 })
  }

  const serviceLabels: Record<string, string> = {
    research_academic: 'Research and Academic Enquiry',
    digital_transformation: 'Digital Transformation and Automation',
    edtech: 'Ed-Tech Services',
    product_management: 'Product Management',
  }
  const serviceLabel = serviceLabels[service] || service

  // Notify admin
  await resend.emails.send({
    from: 'Ryters Spot <noreply@theryters.com>',
    to: 'hello@theryters.com',
    subject: `New Project Request: ${title}`,
    html: `
      <!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/></head>
      <body style="margin:0;padding:0;background:#f8f7f4;font-family:Arial,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8f7f4;padding:32px 20px;">
          <tr><td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
              <tr>
                <td style="background:#1B4332;padding:24px 32px;border-radius:12px 12px 0 0;">
                  <span style="font-family:Georgia,serif;font-size:22px;font-weight:700;color:#fff;">Ryters Spot</span>
                  <span style="margin-left:12px;background:#C9A84C;color:#fff;font-size:11px;font-weight:700;padding:3px 10px;border-radius:100px;">NEW PROJECT</span>
                </td>
              </tr>
              <tr>
                <td style="background:#fff;padding:32px;border-radius:0 0 12px 12px;border:1px solid #e5e7eb;border-top:none;">
                  <h2 style="font-family:Georgia,serif;font-size:20px;color:#1B4332;margin:0 0 20px;">New Service Request</h2>
                  <table style="width:100%;border-collapse:collapse;">
                    <tr style="border-bottom:1px solid #f3f4f6;"><td style="padding:10px 0;color:#6b7280;font-size:13px;width:140px;">Client</td><td style="padding:10px 0;font-size:14px;font-weight:600;">${profile?.full_name || 'Unknown'}</td></tr>
                    <tr style="border-bottom:1px solid #f3f4f6;"><td style="padding:10px 0;color:#6b7280;font-size:13px;">Email</td><td style="padding:10px 0;font-size:14px;"><a href="mailto:${profile?.email}" style="color:#1B4332;">${profile?.email}</a></td></tr>
                    <tr style="border-bottom:1px solid #f3f4f6;"><td style="padding:10px 0;color:#6b7280;font-size:13px;">Service</td><td style="padding:10px 0;font-size:14px;">${serviceLabel}</td></tr>
                    <tr style="border-bottom:1px solid #f3f4f6;"><td style="padding:10px 0;color:#6b7280;font-size:13px;">Project Title</td><td style="padding:10px 0;font-size:14px;font-weight:600;">${title}</td></tr>
                    <tr style="border-bottom:1px solid #f3f4f6;"><td style="padding:10px 0;color:#6b7280;font-size:13px;">Urgency</td><td style="padding:10px 0;font-size:14px;">${urgency || 'Standard'}</td></tr>
                    <tr style="border-bottom:1px solid #f3f4f6;"><td style="padding:10px 0;color:#6b7280;font-size:13px;">Deadline</td><td style="padding:10px 0;font-size:14px;">${deadline || 'Not specified'}</td></tr>
                    <tr style="border-bottom:1px solid #f3f4f6;"><td style="padding:10px 0;color:#6b7280;font-size:13px;">Budget Range</td><td style="padding:10px 0;font-size:14px;">${budget_range || 'Not specified'}</td></tr>
                    <tr style="border-bottom:1px solid #f3f4f6;"><td style="padding:10px 0;color:#6b7280;font-size:13px;">Submitted</td><td style="padding:10px 0;font-size:14px;">${new Date().toLocaleString('en-GB', { timeZone: 'Africa/Lagos' })} WAT</td></tr>
                  </table>
                  <div style="background:#f8f7f4;border-radius:8px;padding:20px;margin:20px 0;">
                    <p style="margin:0 0 8px;font-size:13px;font-weight:600;color:#374151;text-transform:uppercase;letter-spacing:0.05em;">Project Description</p>
                    <p style="margin:0;font-size:14px;color:#374151;line-height:1.7;white-space:pre-wrap;">${description}</p>
                  </div>
                  <div style="text-align:center;">
                    <a href="https://theryters.com/admin" style="display:inline-block;background:#1B4332;color:#fff;font-weight:600;font-size:14px;padding:12px 28px;border-radius:8px;text-decoration:none;">
                      Review in Admin Dashboard
                    </a>
                  </div>
                </td>
              </tr>
            </table>
          </td></tr>
        </table>
      </body></html>
    `,
  })

  // Confirm to client
  await resend.emails.send({
    from: 'Ryters Spot <noreply@theryters.com>',
    to: user.email!,
    subject: `Project Request Received — ${title}`,
    html: `
      <!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/></head>
      <body style="margin:0;padding:0;background:#f8f7f4;font-family:Arial,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8f7f4;padding:40px 20px;">
          <tr><td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
              <tr>
                <td style="background:#1B4332;padding:32px 40px;border-radius:12px 12px 0 0;text-align:center;">
                  <span style="font-family:Georgia,serif;font-size:28px;font-weight:700;color:#fff;">Ryters Spot</span>
                  <div style="width:40px;height:2px;background:#C9A84C;margin:12px auto 0;border-radius:2px;"></div>
                </td>
              </tr>
              <tr>
                <td style="background:#fff;padding:40px;border-radius:0 0 12px 12px;border:1px solid #e5e7eb;border-top:none;">
                  <h1 style="font-family:Georgia,serif;font-size:24px;color:#1B4332;margin:0 0 8px;">Project request received!</h1>
                  <p style="color:#6b7280;font-size:14px;margin:0 0 24px;">We are reviewing your request and will respond within one business day.</p>
                  <div style="background:#f8f7f4;border-radius:8px;padding:20px;margin-bottom:24px;">
                    <table style="width:100%;border-collapse:collapse;">
                      <tr><td style="padding:6px 0;color:#6b7280;font-size:13px;width:120px;">Service</td><td style="font-size:14px;font-weight:600;">${serviceLabel}</td></tr>
                      <tr><td style="padding:6px 0;color:#6b7280;font-size:13px;">Project</td><td style="font-size:14px;font-weight:600;">${title}</td></tr>
                      <tr><td style="padding:6px 0;color:#6b7280;font-size:13px;">Deadline</td><td style="font-size:14px;">${deadline || 'Flexible'}</td></tr>
                      <tr><td style="padding:6px 0;color:#6b7280;font-size:13px;">Status</td><td style="font-size:14px;"><span style="background:#fef3c7;color:#92400e;padding:2px 10px;border-radius:100px;font-size:12px;font-weight:600;">Pending Review</span></td></tr>
                    </table>
                  </div>
                  <p style="font-size:14px;color:#374151;margin:0 0 24px;">You can track your project status in your dashboard at any time.</p>
                  <div style="text-align:center;">
                    <a href="https://theryters.com/dashboard/projects" style="display:inline-block;background:#1B4332;color:#fff;font-weight:600;font-size:14px;padding:12px 28px;border-radius:8px;text-decoration:none;">
                      View My Projects
                    </a>
                  </div>
                  <div style="margin-top:32px;padding-top:24px;border-top:1px solid #e5e7eb;text-align:center;">
                    <p style="margin:0;font-size:12px;color:#9ca3af;">Ryters Spot &mdash; <a href="https://theryters.com" style="color:#1B4332;">theryters.com</a></p>
                  </div>
                </td>
              </tr>
            </table>
          </td></tr>
        </table>
      </body></html>
    `,
  })

  return NextResponse.json({ success: true, project })
  } catch (err) {
    console.error('POST /api/projects unexpected error:', err)
    return NextResponse.json({ error: 'Something went wrong. Please try again or contact us at hello@theryters.com.' }, { status: 500 })
  }
}
