import { NextResponse } from 'next/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const adminSupabase = createAdminClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)
const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    // Verify webhook signature
    const secretHash = process.env.FLW_WEBHOOK_HASH
    const signature = request.headers.get('verif-hash')
    if (!secretHash || signature !== secretHash) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    const body = await request.json()
    const { event, data } = body

    if (event !== 'charge.completed') {
      return NextResponse.json({ received: true })
    }

    const { id: flw_transaction_id, tx_ref, flw_ref, status, amount, currency } = data
    const meta = data.meta || {}

    if (status !== 'successful') {
      // Mark payment as failed
      await adminSupabase
        .from('payments')
        .update({ status: 'failed', flw_ref, flw_transaction_id: flw_transaction_id?.toString() })
        .eq('tx_ref', tx_ref)
      return NextResponse.json({ received: true })
    }

    // Verify transaction directly with Flutterwave
    const verifyRes = await fetch(`https://api.flutterwave.com/v3/transactions/${flw_transaction_id}/verify`, {
      headers: { Authorization: `Bearer ${process.env.FLW_SECRET_KEY}` },
    })
    const verifyData = await verifyRes.json()

    if (verifyData.data?.status !== 'successful') {
      return NextResponse.json({ received: true })
    }

    // Look up our payment record
    const { data: payment, error: paymentError } = await adminSupabase
      .from('payments')
      .select('*, projects(id, title, status, client_id, profiles(full_name, email))')
      .eq('tx_ref', tx_ref)
      .single()

    if (paymentError || !payment) {
      console.error('Webhook: payment record not found for tx_ref:', tx_ref)
      return NextResponse.json({ received: true })
    }

    if (payment.status === 'successful') {
      // Already processed
      return NextResponse.json({ received: true })
    }

    const paidAt = new Date().toISOString()
    const { payment_type } = payment
    const project = payment.projects as Record<string, unknown>
    const projectId = payment.project_id
    const clientName = (project?.profiles as Record<string, string>)?.full_name || 'Valued Client'
    const clientEmail = (project?.profiles as Record<string, string>)?.email || ''
    const projectTitle = payment.projects ? (project as { title: string }).title : 'Your project'

    // Update payment record
    await adminSupabase
      .from('payments')
      .update({
        status: 'successful',
        flw_ref,
        flw_transaction_id: flw_transaction_id?.toString(),
        paid_at: paidAt,
      })
      .eq('tx_ref', tx_ref)

    // Update project status
    if (payment_type === 'deposit') {
      await adminSupabase
        .from('projects')
        .update({ deposit_paid_at: paidAt, status: 'in_progress', work_started_at: paidAt })
        .eq('id', projectId)
        .eq('status', 'accepted')

      // Notify client
      if (clientEmail) {
        await resend.emails.send({
          from: 'Ryters Spot <noreply@theryters.com>',
          to: clientEmail,
          subject: `Deposit received — work has begun on ${projectTitle}`,
          html: `<!DOCTYPE html><html><body style="margin:0;padding:0;background:#f8f7f4;font-family:Arial,sans-serif;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8f7f4;padding:40px 20px;">
              <tr><td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
                  <tr><td style="background:#1B4332;padding:32px 40px;border-radius:12px 12px 0 0;text-align:center;">
                    <span style="font-family:Georgia,serif;font-size:28px;font-weight:700;color:#fff;">Ryters Spot</span>
                    <div style="width:40px;height:2px;background:#C9A84C;margin:12px auto 0;border-radius:2px;"></div>
                  </td></tr>
                  <tr><td style="background:#fff;padding:40px;border-radius:0 0 12px 12px;border:1px solid #e5e7eb;border-top:none;">
                    <h1 style="font-family:Georgia,serif;font-size:22px;color:#1B4332;margin:0 0 8px;">Deposit received — work has begun!</h1>
                    <p style="color:#6b7280;font-size:14px;margin:0 0 20px;">Project: <strong>${projectTitle}</strong></p>
                    <p style="font-size:15px;line-height:1.8;margin:0 0 20px;">Hi ${clientName}, your deposit payment of <strong>${currency} ${Number(amount).toLocaleString()}</strong> has been confirmed. Our team has started work on your project.</p>
                    <div style="background:#f0fdf4;border:1px solid #86efac;border-radius:10px;padding:16px 20px;margin-bottom:20px;">
                      <div style="font-size:12px;font-weight:700;text-transform:uppercase;color:#166534;letter-spacing:0.06em;margin-bottom:6px;">Payment Confirmed</div>
                      <div style="font-size:14px;color:#374151;">Reference: <strong>${flw_ref}</strong></div>
                      <div style="font-size:14px;color:#374151;">Amount: <strong>${currency} ${Number(amount).toLocaleString()}</strong></div>
                    </div>
                    <div style="text-align:center;">
                      <a href="https://theryters.com/dashboard/projects" style="display:inline-block;background:#1B4332;color:#fff;font-weight:600;font-size:14px;padding:12px 28px;border-radius:8px;text-decoration:none;">Track My Project</a>
                    </div>
                    <div style="margin-top:32px;padding-top:24px;border-top:1px solid #e5e7eb;text-align:center;">
                      <p style="margin:0;font-size:12px;color:#9ca3af;">Ryters Spot &mdash; <a href="https://theryters.com" style="color:#1B4332;">theryters.com</a></p>
                    </div>
                  </td></tr>
                </table>
              </td></tr>
            </table>
          </body></html>`,
        })
      }

      // Notify admin
      await resend.emails.send({
        from: 'Ryters Spot <noreply@theryters.com>',
        to: process.env.ADMIN_EMAIL || 'jonathan@theryters.com',
        subject: `Deposit received — ${projectTitle} (${currency} ${Number(amount).toLocaleString()})`,
        html: `<p>Deposit payment confirmed via Flutterwave.</p><p>Client: ${clientName}<br>Project: ${projectTitle}<br>Amount: ${currency} ${Number(amount).toLocaleString()}<br>FLW Ref: ${flw_ref}</p><p><a href="https://theryters.com/admin/applications">View in Admin</a></p>`,
      })
    }

    if (payment_type === 'balance') {
      await adminSupabase
        .from('projects')
        .update({ balance_paid_at: paidAt, status: 'completed' })
        .eq('id', projectId)
        .eq('status', 'pending_balance')

      // Notify client
      if (clientEmail) {
        await resend.emails.send({
          from: 'Ryters Spot <noreply@theryters.com>',
          to: clientEmail,
          subject: `Balance received — your files are ready! ${projectTitle}`,
          html: `<!DOCTYPE html><html><body style="margin:0;padding:0;background:#f8f7f4;font-family:Arial,sans-serif;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8f7f4;padding:40px 20px;">
              <tr><td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
                  <tr><td style="background:#1B4332;padding:32px 40px;border-radius:12px 12px 0 0;text-align:center;">
                    <span style="font-family:Georgia,serif;font-size:28px;font-weight:700;color:#fff;">Ryters Spot</span>
                    <div style="width:40px;height:2px;background:#C9A84C;margin:12px auto 0;border-radius:2px;"></div>
                  </td></tr>
                  <tr><td style="background:#fff;padding:40px;border-radius:0 0 12px 12px;border:1px solid #e5e7eb;border-top:none;">
                    <h1 style="font-family:Georgia,serif;font-size:22px;color:#1B4332;margin:0 0 8px;">Your files are ready!</h1>
                    <p style="color:#6b7280;font-size:14px;margin:0 0 20px;">Project: <strong>${projectTitle}</strong></p>
                    <p style="font-size:15px;line-height:1.8;margin:0 0 20px;">Hi ${clientName}, your balance payment of <strong>${currency} ${Number(amount).toLocaleString()}</strong> has been confirmed. Your deliverables are now available in your dashboard.</p>
                    <div style="background:#f0fdf4;border:1px solid #86efac;border-radius:10px;padding:16px 20px;margin-bottom:20px;">
                      <div style="font-size:12px;font-weight:700;text-transform:uppercase;color:#166534;letter-spacing:0.06em;margin-bottom:6px;">Project Complete</div>
                      <div style="font-size:14px;color:#374151;">Payment: <strong>${currency} ${Number(amount).toLocaleString()}</strong></div>
                      <div style="font-size:14px;color:#374151;">Reference: <strong>${flw_ref}</strong></div>
                    </div>
                    <div style="text-align:center;">
                      <a href="https://theryters.com/dashboard/projects" style="display:inline-block;background:#1B4332;color:#fff;font-weight:600;font-size:14px;padding:12px 28px;border-radius:8px;text-decoration:none;">Download My Files</a>
                    </div>
                    <div style="margin-top:32px;padding-top:24px;border-top:1px solid #e5e7eb;text-align:center;">
                      <p style="margin:0;font-size:12px;color:#9ca3af;">Ryters Spot &mdash; <a href="https://theryters.com" style="color:#1B4332;">theryters.com</a></p>
                    </div>
                  </td></tr>
                </table>
              </td></tr>
            </table>
          </body></html>`,
        })
      }

      // Notify admin
      await resend.emails.send({
        from: 'Ryters Spot <noreply@theryters.com>',
        to: process.env.ADMIN_EMAIL || 'jonathan@theryters.com',
        subject: `Balance received — ${projectTitle} delivered (${currency} ${Number(amount).toLocaleString()})`,
        html: `<p>Balance payment confirmed via Flutterwave. Files delivered to client.</p><p>Client: ${clientName}<br>Project: ${projectTitle}<br>Amount: ${currency} ${Number(amount).toLocaleString()}<br>FLW Ref: ${flw_ref}</p><p><a href="https://theryters.com/admin/payments">View Payments</a></p>`,
      })
    }

    return NextResponse.json({ received: true })
  } catch (err) {
    console.error('Flutterwave webhook error:', err)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}
