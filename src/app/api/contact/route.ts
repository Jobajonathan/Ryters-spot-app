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
    const body = await request.json()
    const {
      first_name, last_name, email, phone,
      organization, inquiry_type, service,
      message, newsletter_opt
    } = body

    // Validate required fields
    if (!first_name || !last_name || !email || !message) {
      return NextResponse.json({ error: 'Please fill in all required fields.' }, { status: 400 })
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Please provide a valid email address.' }, { status: 400 })
    }

    // Save to database
    const { error: dbError } = await supabase
      .from('enquiries')
      .insert([{
        first_name, last_name, email, phone,
        organization, inquiry_type, service,
        message, newsletter_opt: newsletter_opt || false
      }])

    if (dbError) throw dbError

    // If they opted into newsletter, add them as subscriber too
    if (newsletter_opt) {
      await supabase
        .from('subscribers')
        .upsert([{ email, source: 'contact-form' }], { onConflict: 'email', ignoreDuplicates: true })
    }

    // Notify admin — full details
    await resend.emails.send({
      from: 'Ryters Spot <noreply@theryters.com>',
      to: 'hello@theryters.com',
      subject: `New Enquiry from ${first_name} ${last_name} — ${inquiry_type || 'General'}`,
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head><meta charset="UTF-8"/></head>
        <body style="margin:0;padding:0;background:#f8f7f4;font-family:Arial,sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8f7f4;padding:32px 20px;">
            <tr><td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
                <tr>
                  <td style="background:#1B4332;padding:24px 32px;border-radius:12px 12px 0 0;">
                    <span style="font-family:Georgia,serif;font-size:22px;font-weight:700;color:#fff;">Ryters Spot</span>
                    <span style="margin-left:12px;background:#C9A84C;color:#fff;font-size:11px;font-weight:700;padding:3px 10px;border-radius:100px;vertical-align:middle;">NEW ENQUIRY</span>
                  </td>
                </tr>
                <tr>
                  <td style="background:#fff;padding:32px;border-radius:0 0 12px 12px;border:1px solid #e5e7eb;border-top:none;">
                    <h2 style="font-family:Georgia,serif;font-size:20px;color:#1B4332;margin:0 0 20px;">Contact Form Submission</h2>
                    <table style="width:100%;border-collapse:collapse;">
                      <tr style="border-bottom:1px solid #f3f4f6;">
                        <td style="padding:10px 0;color:#6b7280;font-size:13px;width:140px;">Full Name</td>
                        <td style="padding:10px 0;font-size:14px;font-weight:600;color:#111;">${first_name} ${last_name}</td>
                      </tr>
                      <tr style="border-bottom:1px solid #f3f4f6;">
                        <td style="padding:10px 0;color:#6b7280;font-size:13px;">Email</td>
                        <td style="padding:10px 0;font-size:14px;"><a href="mailto:${email}" style="color:#1B4332;">${email}</a></td>
                      </tr>
                      ${phone ? `<tr style="border-bottom:1px solid #f3f4f6;"><td style="padding:10px 0;color:#6b7280;font-size:13px;">Phone</td><td style="padding:10px 0;font-size:14px;">${phone}</td></tr>` : ''}
                      ${organization ? `<tr style="border-bottom:1px solid #f3f4f6;"><td style="padding:10px 0;color:#6b7280;font-size:13px;">Organisation</td><td style="padding:10px 0;font-size:14px;">${organization}</td></tr>` : ''}
                      <tr style="border-bottom:1px solid #f3f4f6;">
                        <td style="padding:10px 0;color:#6b7280;font-size:13px;">Inquiry Type</td>
                        <td style="padding:10px 0;font-size:14px;">${inquiry_type || 'Not specified'}</td>
                      </tr>
                      <tr style="border-bottom:1px solid #f3f4f6;">
                        <td style="padding:10px 0;color:#6b7280;font-size:13px;">Service</td>
                        <td style="padding:10px 0;font-size:14px;">${service || 'Not specified'}</td>
                      </tr>
                      <tr style="border-bottom:1px solid #f3f4f6;">
                        <td style="padding:10px 0;color:#6b7280;font-size:13px;">Newsletter</td>
                        <td style="padding:10px 0;font-size:14px;">${newsletter_opt ? '✅ Opted in' : 'No'}</td>
                      </tr>
                      <tr style="border-bottom:1px solid #f3f4f6;">
                        <td style="padding:10px 0;color:#6b7280;font-size:13px;">Date</td>
                        <td style="padding:10px 0;font-size:14px;">${new Date().toLocaleString('en-GB', { timeZone: 'Africa/Lagos' })} WAT</td>
                      </tr>
                    </table>
                    <div style="background:#f8f7f4;border-radius:8px;padding:20px;margin:20px 0;">
                      <p style="margin:0 0 8px;font-size:13px;font-weight:600;color:#374151;text-transform:uppercase;letter-spacing:0.05em;">Message</p>
                      <p style="margin:0;font-size:14px;color:#374151;line-height:1.7;white-space:pre-wrap;">${message}</p>
                    </div>
                    <div style="text-align:center;">
                      <a href="mailto:${email}?subject=Re: Your enquiry to Ryters Spot" style="display:inline-block;background:#1B4332;color:#fff;font-weight:600;font-size:14px;padding:12px 28px;border-radius:8px;text-decoration:none;">
                        Reply to ${first_name}
                      </a>
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

    // Auto-reply to client
    await resend.emails.send({
      from: 'Ryters Spot <noreply@theryters.com>',
      to: email,
      subject: `We have received your message, ${first_name}`,
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
                    <h1 style="font-family:Georgia,serif;font-size:24px;color:#1B4332;margin:0 0 8px;">Message received, ${first_name}</h1>
                    <p style="color:#6b7280;font-size:14px;margin:0 0 24px;">Thank you for reaching out to Ryters Spot.</p>
                    <p style="font-size:15px;line-height:1.8;margin:0 0 20px;">
                      We have received your enquiry and a member of our team will respond within <strong>one business day</strong>.
                      If your matter is urgent, please reply to this email and let us know.
                    </p>
                    <div style="background:#f8f7f4;border-radius:8px;padding:20px;margin:20px 0;border-left:3px solid #C9A84C;">
                      <p style="margin:0 0 8px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;color:#6b7280;">Your Message</p>
                      <p style="margin:0;font-size:14px;color:#374151;line-height:1.7;white-space:pre-wrap;">${message}</p>
                    </div>
                    <p style="font-size:14px;color:#6b7280;margin:20px 0 0;">
                      In the meantime, feel free to explore our services or connect with us on LinkedIn.
                    </p>
                    <div style="text-align:center;margin:28px 0;">
                      <a href="https://theryters.com/services" style="display:inline-block;background:#1B4332;color:#fff;font-weight:600;font-size:14px;padding:12px 28px;border-radius:8px;text-decoration:none;">
                        Explore Our Services
                      </a>
                    </div>
                    <div style="margin-top:32px;padding-top:24px;border-top:1px solid #e5e7eb;text-align:center;">
                      <p style="margin:0;font-size:12px;color:#9ca3af;">
                        Ryters Spot &mdash; Research, Digital Transformation, Ed-Tech &amp; Product Management<br/>
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

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}
