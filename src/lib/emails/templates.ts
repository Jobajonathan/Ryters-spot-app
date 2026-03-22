const BRAND = {
  primary: '#1B4332',
  gold: '#C9A84C',
  bg: '#f8f7f4',
  text: '#1a1a1a',
  muted: '#6b7280',
}

function baseTemplate(content: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Ryters Spot</title>
</head>
<body style="margin:0;padding:0;background:${BRAND.bg};font-family:'Inter',Arial,sans-serif;color:${BRAND.text};">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND.bg};padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

        <!-- Header -->
        <tr>
          <td style="background:${BRAND.primary};padding:32px 40px;border-radius:12px 12px 0 0;text-align:center;">
            <span style="font-family:Georgia,serif;font-size:28px;font-weight:700;color:#fff;letter-spacing:-0.5px;">Ryters Spot</span>
            <div style="width:40px;height:2px;background:${BRAND.gold};margin:12px auto 0;border-radius:2px;"></div>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="background:#fff;padding:40px;border-radius:0 0 12px 12px;border:1px solid #e5e7eb;border-top:none;">
            ${content}

            <!-- Footer -->
            <div style="margin-top:40px;padding-top:24px;border-top:1px solid #e5e7eb;text-align:center;">
              <p style="margin:0;font-size:12px;color:${BRAND.muted};">
                Ryters Spot &mdash; Research, Digital Transformation, Ed-Tech &amp; Product Management<br/>
                <a href="https://ryters-spot.com" style="color:${BRAND.primary};text-decoration:none;">ryters-spot.com</a>
                &nbsp;&bull;&nbsp;
                <a href="mailto:hello@ryters-spot.com" style="color:${BRAND.primary};text-decoration:none;">hello@ryters-spot.com</a>
              </p>
              <p style="margin:8px 0 0;font-size:11px;color:#9ca3af;">
                You are receiving this email because you have an account with Ryters Spot.<br/>
                <a href="{{unsubscribe_url}}" style="color:#9ca3af;">Unsubscribe</a>
              </p>
            </div>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`
}

// ── Welcome / Verify Email ─────────────────────────────────────────
export function welcomeEmail(name: string, verifyUrl: string) {
  return baseTemplate(`
    <h1 style="font-family:Georgia,serif;font-size:24px;color:${BRAND.primary};margin:0 0 8px;">Welcome to Ryters Spot, ${name}!</h1>
    <p style="color:${BRAND.muted};font-size:14px;margin:0 0 24px;">Please verify your email address to activate your account.</p>

    <p style="font-size:15px;line-height:1.7;margin:0 0 24px;">
      You are one step away from accessing your client portal, where you can request services,
      track your projects and receive your deliverables securely.
    </p>

    <div style="text-align:center;margin:32px 0;">
      <a href="${verifyUrl}" style="display:inline-block;background:${BRAND.primary};color:#fff;font-weight:600;font-size:15px;padding:14px 32px;border-radius:8px;text-decoration:none;letter-spacing:0.2px;">
        Verify My Email Address
      </a>
    </div>

    <p style="font-size:13px;color:${BRAND.muted};margin:0;">
      This link expires in 24 hours. If you did not sign up for Ryters Spot, you can safely ignore this email.
    </p>
  `)
}

// ── Password Reset ─────────────────────────────────────────────────
export function passwordResetEmail(name: string, resetUrl: string) {
  return baseTemplate(`
    <h1 style="font-family:Georgia,serif;font-size:24px;color:${BRAND.primary};margin:0 0 8px;">Reset your password</h1>
    <p style="color:${BRAND.muted};font-size:14px;margin:0 0 24px;">Hi ${name}, we received a request to reset your password.</p>

    <p style="font-size:15px;line-height:1.7;margin:0 0 24px;">
      Click the button below to set a new password. This link is valid for 1 hour.
    </p>

    <div style="text-align:center;margin:32px 0;">
      <a href="${resetUrl}" style="display:inline-block;background:${BRAND.primary};color:#fff;font-weight:600;font-size:15px;padding:14px 32px;border-radius:8px;text-decoration:none;">
        Reset My Password
      </a>
    </div>

    <p style="font-size:13px;color:${BRAND.muted};margin:0;">
      If you did not request a password reset, please ignore this email. Your account remains secure.
    </p>
  `)
}

// ── Project Confirmed ──────────────────────────────────────────────
export function projectConfirmedEmail(name: string, projectTitle: string, service: string, deadline: string) {
  const serviceLabels: Record<string, string> = {
    research_academic: 'Research and Academic Enquiry',
    digital_transformation: 'Digital Transformation and Automation',
    edtech: 'Ed-Tech Services',
    product_management: 'Product Management',
  }

  return baseTemplate(`
    <h1 style="font-family:Georgia,serif;font-size:24px;color:${BRAND.primary};margin:0 0 8px;">Your project has been confirmed</h1>
    <p style="color:${BRAND.muted};font-size:14px;margin:0 0 24px;">Hi ${name}, great news &mdash; your project is now underway.</p>

    <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:20px 24px;margin:0 0 24px;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="font-size:13px;color:${BRAND.muted};padding-bottom:8px;">Project</td>
          <td style="font-size:14px;font-weight:600;color:${BRAND.text};text-align:right;padding-bottom:8px;">${projectTitle}</td>
        </tr>
        <tr>
          <td style="font-size:13px;color:${BRAND.muted};padding-bottom:8px;">Service</td>
          <td style="font-size:14px;color:${BRAND.text};text-align:right;padding-bottom:8px;">${serviceLabels[service] ?? service}</td>
        </tr>
        <tr>
          <td style="font-size:13px;color:${BRAND.muted};">Deadline</td>
          <td style="font-size:14px;color:${BRAND.text};text-align:right;">${deadline}</td>
        </tr>
      </table>
    </div>

    <p style="font-size:15px;line-height:1.7;margin:0 0 24px;">
      Our team will be in touch through your project dashboard. You can track progress,
      send messages and manage everything from one place.
    </p>

    <div style="text-align:center;margin:32px 0;">
      <a href="https://ryters-spot.com/dashboard/projects" style="display:inline-block;background:${BRAND.primary};color:#fff;font-weight:600;font-size:15px;padding:14px 32px;border-radius:8px;text-decoration:none;">
        View My Project
      </a>
    </div>
  `)
}

// ── Work Delivered ─────────────────────────────────────────────────
export function workDeliveredEmail(name: string, projectTitle: string) {
  return baseTemplate(`
    <h1 style="font-family:Georgia,serif;font-size:24px;color:${BRAND.primary};margin:0 0 8px;">Your work is ready</h1>
    <p style="color:${BRAND.muted};font-size:14px;margin:0 0 24px;">Hi ${name}, your deliverable for <strong>${projectTitle}</strong> has been uploaded.</p>

    <div style="background:${BRAND.primary};border-radius:10px;padding:24px;text-align:center;margin:0 0 28px;">
      <div style="font-size:40px;margin-bottom:8px;">&#128196;</div>
      <p style="color:#fff;font-size:16px;font-weight:600;margin:0;">${projectTitle}</p>
      <p style="color:rgba(255,255,255,0.7);font-size:13px;margin:6px 0 0;">Ready to download from your secure portal</p>
    </div>

    <p style="font-size:15px;line-height:1.7;margin:0 0 24px;">
      Log in to your dashboard to download your completed work. Your files are stored securely
      and are available whenever you need them.
    </p>

    <div style="text-align:center;margin:32px 0;">
      <a href="https://ryters-spot.com/dashboard/deliverables" style="display:inline-block;background:${BRAND.primary};color:#fff;font-weight:600;font-size:15px;padding:14px 32px;border-radius:8px;text-decoration:none;">
        Download My Work
      </a>
    </div>

    <p style="font-size:13px;color:${BRAND.muted};margin:0;">
      If you have any questions about your deliverable, reply to this email or message us through your project dashboard.
    </p>
  `)
}

// ── Invoice Ready ──────────────────────────────────────────────────
export function invoiceReadyEmail(name: string, projectTitle: string, amount: string, currency: string, dueDate: string, payUrl: string) {
  return baseTemplate(`
    <h1 style="font-family:Georgia,serif;font-size:24px;color:${BRAND.primary};margin:0 0 8px;">Invoice ready for payment</h1>
    <p style="color:${BRAND.muted};font-size:14px;margin:0 0 24px;">Hi ${name}, an invoice has been generated for your project.</p>

    <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:8px;padding:20px 24px;margin:0 0 24px;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="font-size:13px;color:${BRAND.muted};padding-bottom:8px;">Project</td>
          <td style="font-size:14px;font-weight:600;color:${BRAND.text};text-align:right;padding-bottom:8px;">${projectTitle}</td>
        </tr>
        <tr>
          <td style="font-size:13px;color:${BRAND.muted};padding-bottom:8px;">Amount</td>
          <td style="font-size:18px;font-weight:700;color:${BRAND.primary};text-align:right;padding-bottom:8px;">${currency} ${amount}</td>
        </tr>
        <tr>
          <td style="font-size:13px;color:${BRAND.muted};">Due Date</td>
          <td style="font-size:14px;color:${BRAND.text};text-align:right;">${dueDate}</td>
        </tr>
      </table>
    </div>

    <div style="text-align:center;margin:32px 0;">
      <a href="${payUrl}" style="display:inline-block;background:${BRAND.gold};color:#1a1a1a;font-weight:700;font-size:15px;padding:14px 32px;border-radius:8px;text-decoration:none;">
        Pay Invoice Now
      </a>
    </div>

    <p style="font-size:13px;color:${BRAND.muted};margin:0;">
      Payment is processed securely via Stripe. If you have questions about this invoice, please contact us at
      <a href="mailto:hello@ryters-spot.com" style="color:${BRAND.primary};">hello@ryters-spot.com</a>.
    </p>
  `)
}
