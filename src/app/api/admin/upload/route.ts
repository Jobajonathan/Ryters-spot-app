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

export async function POST(request: Request) {
  try {
    const user = await getUser()
    if (!user || !(await isAdmin(user.id))) {
      return NextResponse.json({ error: 'Unauthorised' }, { status: 403 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const projectId = formData.get('projectId') as string | null
    const fileType = formData.get('fileType') as string | null // 'deliverable' or 'ai_report'

    if (!file || !projectId || !fileType) {
      return NextResponse.json({ error: 'File, projectId and fileType are required.' }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const ext = file.name.split('.').pop() || 'bin'
    const path = `${projectId}/${fileType}.${ext}`

    const { error: uploadError } = await adminSupabase.storage
      .from('deliverables')
      .upload(path, buffer, { contentType: file.type, upsert: true })

    if (uploadError) {
      console.error('Storage upload error:', uploadError.message)
      return NextResponse.json({ error: 'Upload failed: ' + uploadError.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, path })
  } catch (err) {
    console.error('Upload API error:', err)
    return NextResponse.json({ error: 'Upload failed.' }, { status: 500 })
  }
}
