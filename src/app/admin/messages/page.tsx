'use client'

import { useState, useEffect, useRef } from 'react'

type Thread = {
  id: string
  title: string
  status: string
  service: string
  unread: number
  last_message: { body: string; created_at: string; is_admin: boolean } | null
  profiles: { full_name: string; email: string } | null
}

type Message = {
  id: string
  body: string
  is_admin: boolean
  created_at: string
  profiles: { full_name: string } | null
}

function fmtTime(iso: string) {
  const d = new Date(iso)
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  if (diff < 86400000) return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

const STATUS_LABELS: Record<string, string> = {
  in_review: 'Under Review', accepted: 'Accepted', in_progress: 'In Progress',
  pending_balance: 'Balance Due', completed: 'Completed',
}

export default function AdminMessagesPage() {
  const [threads, setThreads] = useState<Thread[]>([])
  const [selected, setSelected] = useState<string | null>(null)
  const [project, setProject] = useState<{ id: string; title: string; profiles?: { full_name: string; email: string } | null } | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [body, setBody] = useState('')
  const [sending, setSending] = useState(false)
  const [loading, setLoading] = useState(true)
  const [loadingMsgs, setLoadingMsgs] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => { loadThreads() }, [])

  function loadThreads() {
    fetch('/api/admin/messages')
      .then(r => r.json())
      .then(data => { setThreads(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => setLoading(false))
  }

  function openThread(id: string) {
    setSelected(id)
    setLoadingMsgs(true)
    fetchMessages(id)
    if (pollRef.current) clearInterval(pollRef.current)
    pollRef.current = setInterval(() => fetchMessages(id, true), 5000)
  }

  function fetchMessages(id: string, silent = false) {
    if (!silent) setLoadingMsgs(true)
    fetch(`/api/admin/messages?project_id=${id}`)
      .then(r => r.json())
      .then(data => {
        if (data.project) setProject(data.project)
        if (Array.isArray(data.messages)) setMessages(data.messages)
        setLoadingMsgs(false)
        setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)
        setThreads(prev => prev.map(t => t.id === id ? { ...t, unread: 0 } : t))
      })
      .catch(() => setLoadingMsgs(false))
  }

  useEffect(() => () => { if (pollRef.current) clearInterval(pollRef.current) }, [])
  useEffect(() => {
    if (messages.length > 0) setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)
  }, [messages])

  async function send() {
    if (!body.trim() || !selected || sending) return
    setSending(true)
    const text = body.trim()
    setBody('')
    const res = await fetch('/api/admin/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ project_id: selected, body: text }),
    })
    if (res.ok) { fetchMessages(selected, true); loadThreads() }
    setSending(false)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
  }

  const totalUnread = threads.reduce((s, t) => s + t.unread, 0)

  return (
    <>
      <style>{`
        .msg-wrap { display: flex; gap: 0; height: calc(100vh - 150px); min-height: 400px; background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; }
        .msg-threads { width: 300px; flex-shrink: 0; border-right: 1px solid #e5e7eb; display: flex; flex-direction: column; }
        .msg-threads-header { padding: 1rem 1.25rem; border-bottom: 1px solid #f3f4f6; display: flex; align-items: center; justify-content: space-between; }
        .msg-thread-item { padding: 0.85rem 1.25rem; cursor: pointer; border-bottom: 1px solid #f9fafb; transition: background 0.15s; }
        .msg-thread-item:hover { background: #f9fafb; }
        .msg-thread-item.active { background: #f0fdf4; border-right: 3px solid #1B4332; }
        .msg-unread { background: #ef4444; color: #fff; border-radius: 100px; font-size: 0.65rem; font-weight: 700; padding: 2px 6px; }
        .msg-chat { flex: 1; display: flex; flex-direction: column; min-width: 0; }
        .msg-chat-header { padding: 1rem 1.5rem; border-bottom: 1px solid #f3f4f6; }
        .msg-messages { flex: 1; overflow-y: auto; padding: 1.25rem 1.5rem; display: flex; flex-direction: column; gap: 0.75rem; }
        .msg-bubble { max-width: 70%; padding: 0.65rem 1rem; border-radius: 14px; font-size: 0.875rem; line-height: 1.55; word-break: break-word; }
        .msg-bubble.mine { background: #1B4332; color: #fff; border-radius: 14px 14px 4px 14px; align-self: flex-end; }
        .msg-bubble.theirs { background: #f3f4f6; color: #111827; border-radius: 14px 14px 14px 4px; align-self: flex-start; }
        .msg-meta { font-size: 0.68rem; color: #9ca3af; margin-top: 2px; }
        .msg-input-area { padding: 1rem 1.25rem; border-top: 1px solid #e5e7eb; display: flex; gap: 0.75rem; align-items: flex-end; }
        .msg-input-area textarea { flex: 1; padding: 0.65rem 0.9rem; border: 1px solid #e5e7eb; border-radius: 10px; font-size: 0.875rem; resize: none; outline: none; font-family: inherit; line-height: 1.5; max-height: 120px; }
        .msg-input-area textarea:focus { border-color: #1B4332; }
        .msg-send-btn { padding: 0.65rem 1.25rem; background: #1B4332; color: #fff; border: none; border-radius: 10px; font-size: 0.875rem; font-weight: 700; cursor: pointer; }
        .msg-send-btn:disabled { opacity: 0.5; cursor: default; }
      `}</style>

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '1.5rem', fontWeight: 700, color: '#111827', margin: '0 0 0.25rem' }}>
            Messages {totalUnread > 0 && <span style={{ fontSize: '0.9rem', background: '#ef4444', color: '#fff', borderRadius: '100px', padding: '2px 8px', verticalAlign: 'middle' }}>{totalUnread} unread</span>}
          </h1>
          <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0 }}>Communicate with clients on their projects.</p>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af' }}>Loading...</div>
      ) : (
        <div className="msg-wrap">
          {/* Thread list */}
          <div className="msg-threads">
            <div className="msg-threads-header">
              <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#111827' }}>Projects ({threads.length})</span>
            </div>
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {threads.length === 0 ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: '#9ca3af', fontSize: '0.82rem' }}>No active projects.</div>
              ) : threads.map(t => (
                <div key={t.id} className={`msg-thread-item${selected === t.id ? ' active' : ''}`} onClick={() => openThread(t.id)}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 4 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.82rem', color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>{t.title}</div>
                    {t.unread > 0 && <span className="msg-unread">{t.unread}</span>}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#6b7280', marginTop: 2 }}>{t.profiles?.full_name || '—'}</div>
                  <div style={{ fontSize: '0.68rem', color: '#1B4332', fontWeight: 600 }}>{STATUS_LABELS[t.status] || t.status}</div>
                  {t.last_message ? (
                    <div style={{ fontSize: '0.72rem', color: '#9ca3af', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {t.last_message.is_admin ? 'You: ' : 'Client: '}{t.last_message.body.slice(0, 40)}{t.last_message.body.length > 40 ? '...' : ''}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </div>

          {/* Chat pane */}
          <div className="msg-chat">
            {!selected ? (
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ fontSize: '2.5rem' }}>💬</div>
                <p style={{ fontSize: '0.875rem' }}>Select a project to view messages</p>
              </div>
            ) : (
              <>
                <div className="msg-chat-header">
                  {project && (
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#111827' }}>{project.title}</div>
                      <div style={{ fontSize: '0.72rem', color: '#9ca3af' }}>
                        Client: {(project.profiles as { full_name?: string; email?: string } | null)?.full_name || '—'}
                        {(project.profiles as { email?: string } | null)?.email && <> · {(project.profiles as { email?: string }).email}</>}
                      </div>
                    </div>
                  )}
                </div>
                <div className="msg-messages">
                  {loadingMsgs && messages.length === 0 ? (
                    <div style={{ textAlign: 'center', color: '#9ca3af', padding: '2rem' }}>Loading...</div>
                  ) : messages.length === 0 ? (
                    <div style={{ textAlign: 'center', color: '#9ca3af', padding: '2rem', fontSize: '0.875rem' }}>
                      No messages yet. Send the first message.
                    </div>
                  ) : messages.map(m => (
                    <div key={m.id} style={{ display: 'flex', flexDirection: 'column', alignItems: m.is_admin ? 'flex-end' : 'flex-start' }}>
                      <div className={`msg-bubble ${m.is_admin ? 'mine' : 'theirs'}`}>{m.body}</div>
                      <div className="msg-meta" style={{ textAlign: m.is_admin ? 'right' : 'left' }}>
                        {m.is_admin ? (m.profiles?.full_name || 'Admin') : 'Client'} · {fmtTime(m.created_at)}
                      </div>
                    </div>
                  ))}
                  <div ref={bottomRef} />
                </div>
                <div className="msg-input-area">
                  <textarea
                    rows={1}
                    value={body}
                    onChange={e => setBody(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Reply to client... (Enter to send)"
                    disabled={sending}
                  />
                  <button className="msg-send-btn" onClick={send} disabled={!body.trim() || sending}>
                    Send
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
