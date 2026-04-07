import { NextResponse } from 'next/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

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
  return data?.role && ['admin', 'superadmin', 'support', 'operations'].includes(data.role)
}

// GET — all project threads or messages for a specific project
export async function GET(request: Request) {
  try {
    const user = await getUser()
    if (!user || !(await isAdmin(user.id))) return NextResponse.json({ error: 'Unauthorised' }, { status: 403 })

    const url = new URL(request.url)
    const projectId = url.searchParams.get('project_id')

    if (projectId) {
      const { data: project } = await adminSupabase
        .from('projects')
        .select('id, title, client_id, status, service, profiles:client_id(full_name, email)')
        .eq('id', projectId)
        .single()
      if (!project) return NextResponse.json({ error: 'Not found.' }, { status: 404 })

      const { data: msgs } = await adminSupabase
        .from('messages')
        .select('*, profiles:sender_id(full_name)')
        .eq('project_id', projectId)
        .order('created_at', { ascending: true })

      // Mark client messages as read by admin
      await adminSupabase
        .from('messages')
        .update({ read_by_admin: true })
        .eq('project_id', projectId)
        .eq('is_admin', false)
        .eq('read_by_admin', false)

      return NextResponse.json({ project, messages: msgs || [] })
    }

    // List all projects that have messages, or active projects
    const { data: projects } = await adminSupabase
      .from('projects')
      .select('id, title, status, service, created_at, profiles:client_id(full_name, email)')
      .in('status', ['in_review', 'accepted', 'in_progress', 'pending_balance', 'completed'])
      .order('updated_at', { ascending: false })

    if (!projects || projects.length === 0) return NextResponse.json([])

    const projectIds = projects.map(p => p.id)

    // Unread counts (client messages unread by admin)
    const { data: unreadData } = await adminSupabase
      .from('messages')
      .select('project_id')
      .in('project_id', projectIds)
      .eq('is_admin', false)
      .eq('read_by_admin', false)

    const unreadCounts: Record<string, number> = {}
    unreadData?.forEach(m => {
      unreadCounts[m.project_id] = (unreadCounts[m.project_id] || 0) + 1
    })

    const { data: lastMsgs } = await adminSupabase
      .from('messages')
      .select('project_id, body, created_at, is_admin')
      .in('project_id', projectIds)
      .order('created_at', { ascending: false })

    const lastMessage: Record<string, { body: string; created_at: string; is_admin: boolean }> = {}
    lastMsgs?.forEach(m => {
      if (!lastMessage[m.project_id]) lastMessage[m.project_id] = m
    })

    return NextResponse.json(projects.map(p => ({
      ...p,
      unread: unreadCounts[p.id] || 0,
      last_message: lastMessage[p.id] || null,
    })))
  } catch (err) {
    console.error('GET /api/admin/messages error:', err)
    return NextResponse.json([])
  }
}

// POST — admin sends a message to a project thread
export async function POST(request: Request) {
  try {
    const user = await getUser()
    if (!user || !(await isAdmin(user.id))) return NextResponse.json({ error: 'Unauthorised' }, { status: 403 })

    const { project_id, body } = await request.json()
    if (!project_id || !body?.trim()) {
      return NextResponse.json({ error: 'project_id and body required.' }, { status: 400 })
    }

    // Get client_id from project to send notification
    const { data: project } = await adminSupabase
      .from('projects')
      .select('id, title, client_id')
      .eq('id', project_id)
      .single()
    if (!project) return NextResponse.json({ error: 'Project not found.' }, { status: 404 })

    const { data, error } = await adminSupabase
      .from('messages')
      .insert({
        project_id,
        sender_id: user.id,
        body: body.trim(),
        is_admin: true,
        read_by_admin: true,
        read_by_client: false,
      })
      .select()
      .single()

    if (error) return NextResponse.json({ error: 'Could not send message.' }, { status: 500 })

    // Send in-app notification to client
    await adminSupabase.from('notifications').insert({
      user_id: project.client_id,
      title: 'New message from Ryters Spot',
      message: `Re: ${project.title} — ${body.trim().slice(0, 80)}${body.trim().length > 80 ? '...' : ''}`,
      link: '/dashboard/messages',
    }).catch(() => {})

    // Email the client
    const { data: clientProfile } = await adminSupabase.from('profiles').select('email, full_name').eq('id', project.client_id).single()
    if (clientProfile?.email) {
      await resend.emails.send({
        from: 'Ryters Spot <noreply@theryters.com>',
        to: clientProfile.email,
        subject: `New message on your project — ${project.title}`,
        html: `<p>Hi ${clientProfile.full_name || 'there'},</p><p>The Ryters Spot team sent you a message on your project: <strong>${project.title}</strong></p><blockquote style="border-left:3px solid #1B4332;padding-left:12px;margin:12px 0;color:#374151;">${body.trim()}</blockquote><p><a href="https://theryters.com/dashboard/messages" style="display:inline-block;background:#1B4332;color:#fff;padding:10px 20px;border-radius:8px;text-decoration:none;font-weight:600;">View & Reply →</a></p><p style="font-size:12px;color:#9ca3af;">Ryters Spot — theryters.com</p>`,
      }).catch(() => {})
    }

    return NextResponse.json({ success: true, message: data })
  } catch {
    return NextResponse.json({ error: 'Could not send message.' }, { status: 500 })
  }
}
