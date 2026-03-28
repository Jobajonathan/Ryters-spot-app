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

    // Fetch client profile
    const { data: profile } = await adminSupabase
      .from('profiles')
      .select('full_name, email, phone')
      .eq('id', user.id)
      .single()

    const tx_ref = `rs-${project_id.slice(0, 8)}-${payment_type[0]}-${Date.now()}`

    // Save pending payment record
    await adminSupabase.from('payments').insert({
      project_id,
      client_id: user.id,
      payment_type,
      amount,
      currency,
      tx_ref,
      status: 'pending',
    })

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://theryters.com'

    // Create Flutterwave payment
    const flwRes = await fetch('https://api.flutterwave.com/v3/payments', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tx_ref,
        amount,
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
        meta: {
          project_id,
          payment_type,
        },
      }),
    })

    const flwData = await flwRes.json()

    if (flwData.status !== 'success' || !flwData.data?.link) {
      console.error('Flutterwave error:', flwData)
      return NextResponse.json({ error: 'Could not create payment. Please try again.' }, { status: 500 })
    }

    return NextResponse.json({ redirect_url: flwData.data.link })
  } catch (err) {
    console.error('POST /api/payments/initiate error:', err)
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}
