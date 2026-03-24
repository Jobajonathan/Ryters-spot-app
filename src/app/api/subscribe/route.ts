import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
  try {
    const { email, source = 'footer' } = await request.json()

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Please provide a valid email address.' }, { status: 400 })
    }

    // Check if already subscribed
    const { data: existing } = await supabase
      .from('subscribers')
      .select('id')
      .eq('email', email)
      .single()

    if (existing) {
      return NextResponse.json({ error: 'This email is already subscribed. Thank you!' }, { status: 409 })
    }

    // Save to database
    const { error: dbError } = await supabase
      .from('subscribers')
      .insert([{ email, source }])

    if (dbError) throw dbError

    // Send welcome email to subscriber
    await resend.emails.send({
      from: 'Ryters Spot <noreply@theryters.com>',
      to: email,
      subject: 'Welcome to Ryters Spot Insights',
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head><meta charset="UTF-8"/></head>
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
                    <h1 style="font-family:Georgia,serif;font-size:24px;color:#1B4332;margin:0 0 8px;">You are in!</h1>
                    <p style="color:#6b7280;font-size:14px;margin:0 0 24px;">Welcome to the Ryters Spot community.</p>
                    <p style="font-size:15px;line-height:1.8;margin:0 0 24px;">
                      Thank you for subscribing to our fortnightly insights. You will receive carefully curated
                      content on research, digital transformation, Ed-Tech and product management — written by
                      practitioners, not generalists.
                    </p>
                    <div style="background:#f8f7f4;border-left:3px solid #C9A84C;padding:16px 20px;border-radius:0 8px 8px 0;margin-bottom:28px;">
                      <p style="margin:0;font-size:14px;color:#374151;font-style:italic;">
                        "Where Words Meet Impact and Authority"
                      </p>
                    </div>
                    <p style="font-size:14px;color:#6b7280;margin:0 0 24px;">
                      While you wait for your first edition, explore our services or get in touch if you have a project in mind.
                    </p>
                    <div style="text-align:center;margin:24px 0;">
                      <a href="https://theryters.com/services" style="display:inline-block;background:#1B4332;color:#fff;font-weight:600;font-size:14px;padding:12px 28px;border-radius:8px;text-decoration:none;margin-right:8px;">
                        Explore Services
                      </a>
                      <a href="https://theryters.com/contact" style="display:inline-block;background:#C9A84C;color:#fff;font-weight:600;font-size:14px;padding:12px 28px;border-radius:8px;text-decoration:none;">
                        Get in Touch
                      </a>
                    </div>
                    <div style="margin-top:32px;padding-top:24px;border-top:1px solid #e5e7eb;text-align:center;">
                      <p style="margin:0;font-size:12px;color:#9ca3af;">
                        You are receiving this because you subscribed at theryters.com.<br/>
                        <a href="https://theryters.com" style="color:#1B4332;">theryters.com</a>
                        &nbsp;&bull;&nbsp;
                        <a href="mailto:hello@theryters.com" style="color:#1B4332;">hello@theryters.com</a>
                      </p>
                    </div>
                  </td>
                </tr>
              </table>
            </td></tr>
          </table>
        </body>
        </html>
      `,
    })

    // Notify admin
    await resend.emails.send({
      from: 'Ryters Spot <noreply@theryters.com>',
      to: 'hello@theryters.com',
      subject: `New Newsletter Subscriber: ${email}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:500px;margin:0 auto;padding:24px;">
          <h2 style="color:#1B4332;font-family:Georgia,serif;">New Subscriber</h2>
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:8px 0;color:#6b7280;font-size:14px;width:120px;">Email</td><td style="padding:8px 0;font-size:14px;font-weight:600;">${email}</td></tr>
            <tr><td style="padding:8px 0;color:#6b7280;font-size:14px;">Source</td><td style="padding:8px 0;font-size:14px;">${source}</td></tr>
            <tr><td style="padding:8px 0;color:#6b7280;font-size:14px;">Date</td><td style="padding:8px 0;font-size:14px;">${new Date().toLocaleString('en-GB', { timeZone: 'Africa/Lagos' })} WAT</td></tr>
          </table>
          <p style="font-size:13px;color:#9ca3af;margin-top:16px;">View all subscribers in your <a href="https://supabase.com" style="color:#1B4332;">Supabase dashboard</a>.</p>
        </div>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Subscribe error:', error)
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}
