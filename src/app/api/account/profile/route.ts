import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

type ProfilePayload = {
  full_name?: unknown
  country?: unknown
  company?: unknown
  phone?: unknown
}

function toText(value: unknown) {
  return typeof value === 'string' ? value.trim() : ''
}

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
    }

    return NextResponse.json({
      email: user.email ?? '',
      full_name: toText(user.user_metadata?.full_name),
      country: toText(user.user_metadata?.country),
      company: toText(user.user_metadata?.company),
      phone: toText(user.user_metadata?.phone),
    })
  } catch (err) {
    console.error('GET /api/account/profile error:', err)
    return NextResponse.json({ error: 'Could not load profile.' }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
    }

    const body = await request.json() as ProfilePayload
    const profile = {
      full_name: toText(body.full_name),
      country: toText(body.country),
      company: toText(body.company),
      phone: toText(body.phone),
    }

    const { data, error } = await supabase.auth.updateUser({ data: profile })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({
      email: data.user?.email ?? user.email ?? '',
      ...profile,
    })
  } catch (err) {
    console.error('PATCH /api/account/profile error:', err)
    return NextResponse.json({ error: 'Could not update profile.' }, { status: 500 })
  }
}

