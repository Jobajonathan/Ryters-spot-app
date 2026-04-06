import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import {
  welcomeEmail,
  passwordResetEmail,
  projectConfirmedEmail,
  workDeliveredEmail,
  invoiceReadyEmail,
} from '@/lib/emails/templates'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM = 'Ryters Spot <noreply@theryters.com>'

async function getSessionUser() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: (c) => c.forEach(({ name, value, options }) => cookieStore.set(name, value, options)) } }
  )
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser()
    if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

    const body = await req.json()
    const { type, to, name } = body

    let html = ''
    let subject = ''

    switch (type) {
      case 'welcome':
        subject = 'Verify your Ryters Spot account'
        html = welcomeEmail(name, body.verifyUrl)
        break

      case 'password_reset':
        subject = 'Reset your Ryters Spot password'
        html = passwordResetEmail(name, body.resetUrl)
        break

      case 'project_confirmed':
        subject = `Your project has been confirmed: ${body.projectTitle}`
        html = projectConfirmedEmail(name, body.projectTitle, body.service, body.deadline)
        break

      case 'work_delivered':
        subject = `Your work is ready: ${body.projectTitle}`
        html = workDeliveredEmail(name, body.projectTitle)
        break

      case 'invoice_ready':
        subject = `Invoice ready: ${body.currency} ${body.amount} due ${body.dueDate}`
        html = invoiceReadyEmail(name, body.projectTitle, body.amount, body.currency, body.dueDate, body.payUrl)
        break

      default:
        return NextResponse.json({ error: 'Unknown email type' }, { status: 400 })
    }

    const { data, error } = await resend.emails.send({ from: FROM, to, subject, html })

    if (error) {
      console.error('Resend error:', error)
      return NextResponse.json({ error }, { status: 500 })
    }

    return NextResponse.json({ success: true, id: data?.id })
  } catch (err) {
    console.error('Send email error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
