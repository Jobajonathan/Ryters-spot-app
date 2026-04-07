import { NextResponse } from 'next/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { createServerClient } from '@supabase/ssr'
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
    { cookies: { getAll: () => cookieStore.getAll(), setAll: (c) => c.forEach(({ name, value, options }) => cookieStore.set(name, value, options)) } }
  )
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

async function isAdmin(userId: string) {
  const { data } = await adminSupabase.from('profiles').select('role').eq('id', userId).single()
  return data?.role && ['admin', 'superadmin', 'finance', 'support', 'operations'].includes(data.role)
}

export async function GET() {
  try {
    const user = await getUser()
    if (!user || !(await isAdmin(user.id))) {
      return NextResponse.json({ error: 'Unauthorised' }, { status: 403 })
    }

    const { data, error } = await adminSupabase
      .from('payments')
      .select(`
        *,
        projects ( title, service ),
        profiles ( full_name, email )
      `)
      .order('created_at', { ascending: false })
      .limit(500)

    if (error) {
      console.error('GET /api/admin/payments error:', error.message)
      return NextResponse.json({ error: 'Could not load payments.' }, { status: 500 })
    }

    return NextResponse.json(data || [])
  } catch (err) {
    console.error('GET /api/admin/payments unexpected error:', err)
    return NextResponse.json({ error: 'Could not load payments.' }, { status: 500 })
  }
}

// POST — admin manually confirms a bank transfer payment
export async function POST(request: Request) {
  try {
    const user = await getUser()
    if (!user || !(await isAdmin(user.id))) {
      return NextResponse.json({ error: 'Unauthorised' }, { status: 403 })
    }

    const { project_id, payment_type, amount, currency, note } = await request.json()
    if (!project_id || !payment_type || !amount) {
      return NextResponse.json({ error: 'project_id, payment_type, and amount are required' }, { status: 400 })
    }

    const { data: project } = await adminSupabase
      .from('projects')
      .select('id, title, client_id, status')
      .eq('id', project_id)
      .single()
    if (!project) return NextResponse.json({ error: 'Project not found' }, { status: 404 })

    const seg = (n: number) => Array.from({ length: n }, () => 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'[Math.floor(Math.random() * 36)]).join('')
    const tx_ref = `RYT-${seg(3)}-${seg(3)}-${seg(3)}`
    const paidAt = new Date().toISOString()

    // Create payment record as successful
    await adminSupabase.from('payments').insert({
      project_id,
      client_id: project.client_id,
      payment_type,
      amount,
      currency: currency || 'NGN',
      tx_ref,
      flw_ref: note ? `MANUAL: ${note}` : 'MANUAL-TRANSFER',
      status: 'successful',
      paid_at: paidAt,
    })

    // Update project status
    if (payment_type === 'deposit') {
      await adminSupabase.from('projects').update({ status: 'in_progress', deposit_paid_at: paidAt, work_started_at: paidAt }).eq('id', project_id)
    } else if (payment_type === 'balance') {
      await adminSupabase.from('projects').update({ status: 'completed', balance_paid_at: paidAt }).eq('id', project_id)
    }

    // Notify client in-app (fire and forget)
    void adminSupabase.from('notifications').insert({
      user_id: project.client_id,
      title: 'Payment confirmed',
      message: `Your ${payment_type} payment of ${currency || 'NGN'} ${Number(amount).toLocaleString()} for "${project.title}" has been confirmed.`,
      link: '/dashboard/payments',
    })

    return NextResponse.json({ success: true, tx_ref })
  } catch (err) {
    console.error('POST /api/admin/payments error:', err)
    return NextResponse.json({ error: 'Could not confirm payment.' }, { status: 500 })
  }
}
