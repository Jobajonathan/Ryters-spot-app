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
  return data?.role && ['admin', 'superadmin', 'content'].includes(data.role)
}

export async function POST(request: Request) {
  try {
    const user = await getUser()
    if (!user || !(await isAdmin(user.id))) return NextResponse.json({ error: 'Unauthorised' }, { status: 403 })

    const formData = await request.formData()
    const file = formData.get('file') as File | null
    if (!file) return NextResponse.json({ error: 'No file provided.' }, { status: 400 })

    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) return NextResponse.json({ error: 'File too large. Maximum 5MB.' }, { status: 400 })

    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']
    if (!allowed.includes(file.type)) return NextResponse.json({ error: 'Only JPEG, PNG, WebP and GIF images are allowed.' }, { status: 400 })

    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const fileName = `blog-${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

    const buffer = await file.arrayBuffer()
    const { error: uploadError } = await adminSupabase.storage
      .from('blog-images')
      .upload(fileName, buffer, { contentType: file.type, upsert: false })

    if (uploadError) {
      console.error('Blog image upload error:', uploadError)
      return NextResponse.json({ error: 'Upload failed. Make sure the blog-images storage bucket exists in Supabase.' }, { status: 500 })
    }

    const { data: { publicUrl } } = adminSupabase.storage.from('blog-images').getPublicUrl(fileName)
    return NextResponse.json({ success: true, url: publicUrl })
  } catch (err) {
    console.error('Blog upload unexpected error:', err)
    return NextResponse.json({ error: 'Upload failed.' }, { status: 500 })
  }
}
