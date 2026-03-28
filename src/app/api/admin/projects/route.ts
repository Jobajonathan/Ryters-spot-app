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
  return data?.role && ['admin', 'superadmin', 'finance', 'support', 'operations'].includes(data.role)
}

function addWorkingDays(date: Date, days: number): Date {
  const result = new Date(date)
  let added = 0
  while (added < days) {
    result.setDate(result.getDate() + 1)
    const day = result.getDay()
    if (day !== 0 && day !== 6) added++
  }
  return result
}

function fmt(amount: number) {
  return amount.toLocaleString('en-GB', { minimumFractionDigits: 0 })
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}

function emailShell(body: string) {
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#f8f7f4;font-family:Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f8f7f4;padding:40px 20px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
<tr><td style="background:#1B4332;padding:32px 40px;border-radius:12px 12px 0 0;text-align:center;">
<span style="font-family:Georgia,serif;font-size:28px;font-weight:700;color:#fff;">Ryters Spot</span>
<div style="width:40px;height:2px;background:#C9A84C;margin:12px auto 0;border-radius:2px;"></div>
</td></tr>
<tr><td style="background:#fff;padding:40px;border-radius:0 0 12px 12px;border:1px solid #e5e7eb;border-top:none;">
${body}
<div style="margin-top:32px;padding-top:24px;border-top:1px solid #e5e7eb;text-align:center;">
<p style="margin:0;font-size:12px;color:#9ca3af;">Ryters Spot &mdash; <a href="https://theryters.com" style="color:#1B4332;">theryters.com</a></p>
</div>
</td></tr>
</table>
</td></tr>
</table>
</body></html>`
}

function dashBtn(label: string, href: string) {
  return `<div style="text-align:center;margin-top:24px;"><a href="${href}" style="display:inline-block;background:#1B4332;color:#fff;font-weight:600;font-size:14px;padding:12px 28px;border-radius:8px;text-decoration:none;">${label}</a></div>`
}

function paymentBox(amount: number, instructions: string) {
  return `<div style="background:#fef9c3;border:1px solid #f6c90e;border-radius:10px;padding:20px;margin:20px 0;">
<p style="margin:0 0 6px;font-size:12px;font-weight:700;text-transform:uppercase;color:#854d0e;letter-spacing:0.06em;">Payment Required</p>
<p style="margin:0 0 12px;font-size:24px;font-weight:700;color:#111827;">${fmt(amount)}</p>
${instructions ? `<p style="margin:0;font-size:13px;color:#374151;line-height:1.7;white-space:pre-wrap;">${instructions}</p>` : ''}
</div>`
}

// GET all projects with client info
export async function GET() {
  try {
    const user = await getUser()
    if (!user || !(await isAdmin(user.id))) return NextResponse.json({ error: 'Unauthorised' }, { status: 403 })

    const { data, error } = await adminSupabase
      .from('projects')
      .select(`*, profiles:client_id (full_name, email, country, company)`)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('GET /api/admin/projects error:', error.message)
      return NextResponse.json({ error: 'Could not load projects. Please try again.' }, { status: 500 })
    }
    return NextResponse.json(data)
  } catch (err) {
    console.error('GET /api/admin/projects unexpected error:', err)
    return NextResponse.json({ error: 'Could not load projects. Please try again.' }, { status: 500 })
  }
}

// PATCH — workflow status transitions
export async function PATCH(request: Request) {
  try {
    const user = await getUser()
    if (!user || !(await isAdmin(user.id))) return NextResponse.json({ error: 'Unauthorised' }, { status: 403 })

    const body = await request.json()
    const {
      id, status, admin_notes,
      deposit_amount, balance_amount, payment_instructions, payment_currency,
      deliverable_url, ai_report_url,
    } = body

    if (!id || !status) return NextResponse.json({ error: 'Project ID and status required.' }, { status: 400 })

    const now = new Date()
    const updatePayload: Record<string, unknown> = {
      status,
      admin_notes: admin_notes || null,
      updated_at: now.toISOString(),
    }

    if (status === 'accepted') {
      updatePayload.deposit_amount = deposit_amount ?? null
      updatePayload.payment_instructions = payment_instructions ?? null
      updatePayload.payment_currency = payment_currency || 'NGN'
    }

    if (status === 'in_progress') {
      const deliveryDate = addWorkingDays(now, 7)
      updatePayload.deposit_paid_at = now.toISOString()
      updatePayload.work_started_at = now.toISOString()
      updatePayload.expected_delivery_at = deliveryDate.toISOString()
    }

    if (status === 'pending_balance') {
      updatePayload.balance_amount = balance_amount ?? null
      updatePayload.payment_instructions = payment_instructions ?? null
      updatePayload.payment_currency = payment_currency || 'NGN'
      if (deliverable_url) updatePayload.deliverable_url = deliverable_url
      if (ai_report_url) updatePayload.ai_report_url = ai_report_url
    }

    if (status === 'completed') {
      updatePayload.balance_paid_at = now.toISOString()
    }

    const { data: project, error } = await adminSupabase
      .from('projects')
      .update(updatePayload)
      .eq('id', id)
      .select(`*, profiles:client_id (full_name, email)`)
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    const clientEmail = project.profiles?.email
    const clientName = (project.profiles?.full_name || 'there').split(' ')[0]

    // Send email per status
    if (clientEmail) {
      try {
        const emails: Record<string, { subject: string; html: string }> = {
          in_review: {
            subject: `We're reviewing your application — ${project.title}`,
            html: emailShell(`
              <h1 style="font-family:Georgia,serif;font-size:22px;color:#1B4332;margin:0 0 8px;">Application under review</h1>
              <p style="color:#6b7280;font-size:14px;margin:0 0 20px;">Project: <strong>${project.title}</strong></p>
              <p style="font-size:15px;line-height:1.8;margin:0 0 16px;">Hi ${clientName}, our team is currently reviewing your application. We will be in touch shortly with our decision.</p>
              ${admin_notes ? `<div style="background:#f8f7f4;border-left:3px solid #C9A84C;padding:16px;border-radius:0 8px 8px 0;margin-bottom:16px;"><p style="margin:0;font-size:14px;color:#374151;">${admin_notes}</p></div>` : ''}
              ${dashBtn('View My Dashboard', 'https://theryters.com/dashboard/projects')}
            `),
          },
          accepted: {
            subject: `Your application has been accepted — ${project.title}`,
            html: emailShell(`
              <h1 style="font-family:Georgia,serif;font-size:22px;color:#1B4332;margin:0 0 8px;">Application accepted!</h1>
              <p style="color:#6b7280;font-size:14px;margin:0 0 20px;">Project: <strong>${project.title}</strong></p>
              <p style="font-size:15px;line-height:1.8;margin:0 0 4px;">Hi ${clientName}, great news — we have reviewed and accepted your project request.</p>
              <p style="font-size:15px;line-height:1.8;margin:0 0 20px;">To begin work, a deposit payment is required:</p>
              ${paymentBox(deposit_amount || 0, payment_instructions || '')}
              <p style="font-size:13px;color:#6b7280;margin:0;">Once your payment is confirmed, work will begin within 1 business day. Log in to your dashboard to track progress.</p>
              ${dashBtn('Go to My Dashboard', 'https://theryters.com/dashboard/projects')}
            `),
          },
          in_progress: {
            subject: `Work has started on your project — ${project.title}`,
            html: emailShell(`
              <h1 style="font-family:Georgia,serif;font-size:22px;color:#1B4332;margin:0 0 8px;">Work has begun!</h1>
              <p style="color:#6b7280;font-size:14px;margin:0 0 20px;">Project: <strong>${project.title}</strong></p>
              <p style="font-size:15px;line-height:1.8;margin:0 0 16px;">Hi ${clientName}, we have received your deposit and work on your project has officially started.</p>
              <div style="background:#d1fae5;border-radius:10px;padding:20px;margin:20px 0;">
                <p style="margin:0 0 6px;font-size:12px;font-weight:700;text-transform:uppercase;color:#065f46;letter-spacing:0.06em;">Expected Delivery</p>
                <p style="margin:0;font-size:18px;font-weight:700;color:#111827;">${fmtDate(addWorkingDays(now, 7).toISOString())}</p>
                <p style="margin:6px 0 0;font-size:13px;color:#065f46;">7 working days from today</p>
              </div>
              ${admin_notes ? `<div style="background:#f8f7f4;border-left:3px solid #C9A84C;padding:16px;border-radius:0 8px 8px 0;margin-bottom:16px;"><p style="margin:0;font-size:14px;color:#374151;">${admin_notes}</p></div>` : ''}
              ${dashBtn('Track My Project', 'https://theryters.com/dashboard/projects')}
            `),
          },
          pending_balance: {
            subject: `Your work is ready — balance payment required for ${project.title}`,
            html: emailShell(`
              <h1 style="font-family:Georgia,serif;font-size:22px;color:#1B4332;margin:0 0 8px;">Work complete — balance due</h1>
              <p style="color:#6b7280;font-size:14px;margin:0 0 20px;">Project: <strong>${project.title}</strong></p>
              <p style="font-size:15px;line-height:1.8;margin:0 0 4px;">Hi ${clientName}, your work on <strong>${project.title}</strong> is complete!</p>
              <p style="font-size:15px;line-height:1.8;margin:0 0 20px;">To receive your files, please pay the remaining balance:</p>
              ${paymentBox(balance_amount || 0, payment_instructions || '')}
              <p style="font-size:13px;color:#6b7280;margin:0;">Once your payment is confirmed, your files will be delivered to your dashboard immediately and emailed to you.</p>
              ${dashBtn('Go to My Dashboard', 'https://theryters.com/dashboard/projects')}
            `),
          },
          completed: {
            subject: `Your files have been delivered — ${project.title}`,
            html: emailShell(`
              <h1 style="font-family:Georgia,serif;font-size:22px;color:#1B4332;margin:0 0 8px;">Your files are ready!</h1>
              <p style="color:#6b7280;font-size:14px;margin:0 0 20px;">Project: <strong>${project.title}</strong></p>
              <p style="font-size:15px;line-height:1.8;margin:0 0 16px;">Hi ${clientName}, your project is complete and your files are now available in your dashboard. Log in to download your deliverables.</p>
              ${admin_notes ? `<div style="background:#f8f7f4;border-left:3px solid #C9A84C;padding:16px;border-radius:0 8px 8px 0;margin-bottom:16px;"><p style="margin:0;font-size:14px;color:#374151;">${admin_notes}</p></div>` : ''}
              ${dashBtn('Download My Files', 'https://theryters.com/dashboard/projects')}
            `),
          },
          cancelled: {
            subject: `Update on your application — ${project.title}`,
            html: emailShell(`
              <h1 style="font-family:Georgia,serif;font-size:22px;color:#1B4332;margin:0 0 8px;">Application update</h1>
              <p style="color:#6b7280;font-size:14px;margin:0 0 20px;">Project: <strong>${project.title}</strong></p>
              <p style="font-size:15px;line-height:1.8;margin:0 0 16px;">Hi ${clientName}, thank you for submitting your project request. After careful review, we are unfortunately unable to proceed with this application at this time.</p>
              ${admin_notes ? `<div style="background:#f8f7f4;border-left:3px solid #C9A84C;padding:16px;border-radius:0 8px 8px 0;margin-bottom:16px;"><p style="margin:0;font-size:14px;color:#374151;">${admin_notes}</p></div>` : ''}
              <p style="font-size:14px;color:#6b7280;margin:0;">If you have any questions, please reach out to us at <a href="mailto:hello@theryters.com" style="color:#1B4332;">hello@theryters.com</a>.</p>
            `),
          },
        }

        const email = emails[status]
        if (email) {
          await resend.emails.send({
            from: 'Ryters Spot <noreply@theryters.com>',
            to: clientEmail,
            subject: email.subject,
            html: email.html,
          })
        }
      } catch (emailErr) {
        console.error('Email send error:', emailErr)
        // Don't fail the request if email fails
      }
    }

    return NextResponse.json({ success: true, project })
  } catch (err) {
    console.error('PATCH /api/admin/projects unexpected error:', err)
    return NextResponse.json({ error: 'Could not update project. Please try again.' }, { status: 500 })
  }
}
