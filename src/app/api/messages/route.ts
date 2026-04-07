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

// GET — messages for a project (client must own it), or list of threads
export async function GET(request: Request) {
  try {
    const user = await getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

    const url = new URL(request.url)
    const projectId = url.searchParams.get('project_id')

    if (projectId) {
      // Verify the client owns this project
      const { data: project } = await adminSupabase
        .from('projects')
        .select('id, title, client_id')
        .eq('id', projectId)
        .eq('client_id', user.id)
        .single()
      if (!project) return NextResponse.json({ error: 'Not found.' }, { status: 404 })

      // Fetch messages
      const { data: msgs } = await adminSupabase
        .from('messages')
        .select('*, profiles:sender_id(full_name)')
        .eq('project_id', projectId)
        .order('created_at', { ascending: true })

      // Mark all admin messages as read by client
      await adminSupabase
        .from('messages')
        .update({ read_by_client: true })
        .eq('project_id', projectId)
        .eq('is_admin', true)
        .eq('read_by_client', false)

      return NextResponse.json({ project, messages: msgs || [] })
    }

    // Return list of projects with their unread message counts
    const { data: projects } = await adminSupabase
      .from('projects')
      .select('id, title, status, service')
      .eq('client_id', user.id)
      .in('status', ['in_review', 'accepted', 'in_progress', 'pending_balance', 'completed'])
      .order('updated_at', { ascending: false })

    if (!projects || projects.length === 0) return NextResponse.json([])

    const projectIds = projects.map(p => p.id)

    // Get unread counts per project (admin messages unread by client)
    const { data: unreadData } = await adminSupabase
      .from('messages')
      .select('project_id')
      .in('project_id', projectIds)
      .eq('is_admin', true)
      .eq('read_by_client', false)

    const unreadCounts: Record<string, number> = {}
    unreadData?.forEach(m => {
      unreadCounts[m.project_id] = (unreadCounts[m.project_id] || 0) + 1
    })

    // Get last message per project
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
    console.error('GET /api/messages error:', err)
    return NextResponse.json([])
  }
}

// POST — send a message (client → admin)
export async function POST(request: Request) {
  try {
    const user = await getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

    const { project_id, body } = await request.json()
    if (!project_id || !body?.trim()) {
      return NextResponse.json({ error: 'project_id and body required.' }, { status: 400 })
    }

    // Verify client owns this project
    const { data: project } = await adminSupabase
      .from('projects')
      .select('id, title, client_id')
      .eq('id', project_id)
      .eq('client_id', user.id)
      .single()
    if (!project) return NextResponse.json({ error: 'Project not found.' }, { status: 404 })

    const { data, error } = await adminSupabase
      .from('messages')
      .insert({
        project_id,
        sender_id: user.id,
        body: body.trim(),
        is_admin: false,
        read_by_admin: false,
        read_by_client: true,
      })
      .select()
      .single()

    if (error) return NextResponse.json({ error: 'Could not send message.' }, { status: 500 })

    // Get client name for the email
    const { data: profile } = await adminSupabase.from('profiles').select('full_name, email').eq('id', user.id).single()
    const clientName = profile?.full_name || profile?.email || 'A client'

    // Notify admin by email
    await resend.emails.send({
      from: 'Ryters Spot <noreply@theryters.com>',
      to: process.env.ADMIN_EMAIL || 'jonathan@theryters.com',
      subject: `New message from ${clientName} — ${project.title || project.id}`,
      html: `<p><strong>${clientName}</strong> sent a message on project: <strong>${project.title || project.id}</strong></p><blockquote style="border-left:3px solid #1B4332;padding-left:12px;margin:12px 0;color:#374151;">${body.trim()}</blockquote><p><a href="https://theryters.com/admin/messages">Reply in Admin Dashboard →</a></p>`,
    }).catch(() => {}) // don't fail the request if email fails

    return NextResponse.json({ success: true, message: data })
  } catch {
    return NextResponse.json({ error: 'Could not send message.' }, { status: 500 })
  }
}
