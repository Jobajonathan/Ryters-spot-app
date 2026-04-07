import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { createClient as createAdminClient } from '@supabase/supabase-js'
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
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (c) => c.forEach(({ name, value, options }) => cookieStore.set(name, value, options)),
      },
    }
  )
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function POST(request: Request) {
  try {
    const user = await getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

    const { project_id, payment_type } = await request.json()
    if (!project_id || !payment_type) {
      return NextResponse.json({ error: 'project_id and payment_type are required' }, { status: 400 })
    }
    if (!['deposit', 'balance'].includes(payment_type)) {
      return NextResponse.json({ error: 'Invalid payment_type' }, { status: 400 })
    }

    // Fetch project — must belong to this client
    const { data: project, error: projError } = await adminSupabase
      .from('projects')
      .select('id, title, status, deposit_amount, balance_amount, payment_currency, client_id')
      .eq('id', project_id)
      .eq('client_id', user.id)
      .single()

    if (projError || !project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // Validate state
    if (payment_type === 'deposit' && project.status !== 'accepted') {
      return NextResponse.json({ error: 'Project is not awaiting a deposit' }, { status: 400 })
    }
    if (payment_type === 'balance' && project.status !== 'pending_balance') {
      return NextResponse.json({ error: 'Project is not awaiting a balance payment' }, { status: 400 })
    }

    const amount = payment_type === 'deposit' ? project.deposit_amount : project.balance_amount
    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Payment amount not set by admin yet' }, { status: 400 })
    }

    const currency = project.payment_currency || 'NGN'

    // Calculate gross amount so customer bears the Flutterwave transaction fee
    // NGN: 1.4% capped at ₦2,000. International: 3.8%
    let fee = 0
    if (currency === 'NGN') {
      fee = Math.min(amount * 0.014, 2000)
    } else {
      fee = amount * 0.038
    }
    fee = Math.round(fee * 100) / 100
    const grossAmount = Math.round((amount + fee) * 100) / 100

    // Fetch client profile
    const { data: profile } = await adminSupabase
      .from('profiles')
      .select('full_name, email, phone')
      .eq('id', user.id)
      .single()

    const seg = (n: number) => Array.from({ length: n }, () => 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'[Math.floor(Math.random() * 36)]).join('')
    const tx_ref = `RYT-${seg(3)}-${seg(3)}-${seg(3)}`
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://theryters.com'

    // Create Flutterwave payment first (before saving to DB to avoid orphaned records)
    const flwController = new AbortController()
    const flwTimeout = setTimeout(() => flwController.abort(), 10000)

    let flwData: Record<string, unknown>
    try {
      const flwRes = await fetch('https://api.flutterwave.com/v3/payments', {
        method: 'POST',
        signal: flwController.signal,
        headers: {
          Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tx_ref,
          amount: grossAmount,
          currency,
          redirect_url: `${siteUrl}/dashboard/projects?flw_status=success&tx_ref=${encodeURIComponent(tx_ref)}`,
          customer: {
            email: profile?.email || user.email,
            name: profile?.full_name || 'Valued Client',
            phonenumber: profile?.phone || undefined,
          },
          customizations: {
            title: 'Ryters Spot',
            description: `${payment_type === 'deposit' ? 'Deposit' : 'Balance'} payment — ${project.title}`,
            logo: `${siteUrl}/favicon.ico`,
          },
          meta: { project_id, payment_type },
        }),
      })
      flwData = await flwRes.json()
    } finally {
      clearTimeout(flwTimeout)
    }

    if (flwData.status !== 'success' || !(flwData.data as Record<string, unknown>)?.link) {
      console.error('Flutterwave error:', JSON.stringify(flwData))
      const keyPreview = process.env.FLW_SECRET_KEY ? `${process.env.FLW_SECRET_KEY.slice(0, 12)}...` : 'NOT SET'
      const flwMessage = (flwData.message as string) || JSON.stringify(flwData)
      return NextResponse.json({ error: `Payment gateway error: ${flwMessage} [key: ${keyPreview}]` }, { status: 500 })
    }

    // Save payment record only after Flutterwave confirms
    await adminSupabase.from('payments').insert({
      project_id,
      client_id: user.id,
      payment_type,
      amount,
      currency,
      tx_ref,
      status: 'pending',
    })

    return NextResponse.json({ redirect_url: (flwData.data as Record<string, unknown>).link, fee, grossAmount })
  } catch (err) {
    console.error('POST /api/payments/initiate error:', err)
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}
