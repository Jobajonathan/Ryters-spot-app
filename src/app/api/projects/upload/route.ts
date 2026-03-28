import { NextResponse } from 'next/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

const adminSupabase = createAdminClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
  try {
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
    if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

    const formData = await request.formData()
    const file = formData.get('file') as File | null
    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

    const maxSize = 20 * 1024 * 1024 // 20 MB
    if (file.size > maxSize) return NextResponse.json({ error: 'File too large. Maximum 20 MB.' }, { status: 400 })

    const ext = file.name.split('.').pop()?.toLowerCase() || 'bin'
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 100)
    const path = `${user.id}/${Date.now()}_${safeName}`

    const arrayBuffer = await file.arrayBuffer()
    const { error: uploadError } = await adminSupabase.storage
      .from('project-briefs')
      .upload(path, Buffer.from(arrayBuffer), {
        contentType: file.type || 'application/octet-stream',
        upsert: false,
      })

    if (uploadError) {
      console.error('Brief upload error:', uploadError.message)
      return NextResponse.json({ error: 'File upload failed. Please try again.' }, { status: 500 })
    }

    return NextResponse.json({ path, name: file.name, ext })
  } catch (err) {
    console.error('POST /api/projects/upload error:', err)
    return NextResponse.json({ error: 'File upload failed.' }, { status: 500 })
  }
}
