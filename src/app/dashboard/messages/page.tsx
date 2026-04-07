'use client'

import { useState, useEffect, useRef } from 'react'

type Thread = {
  id: string
  title: string
  status: string
  service: string
  unread: number
  last_message: { body: string; created_at: string; is_admin: boolean } | null
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

export default function MessagesPage() {
  const [threads, setThreads] = useState<Thread[]>([])
  const [selected, setSelected] = useState<string | null>(null)
  const [project, setProject] = useState<{ id: string; title: string } | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [body, setBody] = useState('')
  const [sending, setSending] = useState(false)
  const [loading, setLoading] = useState(true)
  const [loadingMsgs, setLoadingMsgs] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  function loadThreads() {
    fetch('/api/messages')
      .then(r => r.json())
      .then(data => { setThreads(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => setLoading(false))
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { loadThreads() }, [])

  function openThread(id: string) {
    setSelected(id)
    setLoadingMsgs(true)
    fetchMessages(id)
    if (pollRef.current) clearInterval(pollRef.current)
    pollRef.current = setInterval(() => fetchMessages(id, true), 5000)
  }

  function fetchMessages(id: string, silent = false) {
    if (!silent) setLoadingMsgs(true)
    fetch(`/api/messages?project_id=${id}`)
      .then(r => r.json())
      .then(data => {
        if (data.project) setProject(data.project)
        if (Array.isArray(data.messages)) setMessages(data.messages)
        setLoadingMsgs(false)
        setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)
        // Update unread in threads list
        setThreads(prev => prev.map(t => t.id === id ? { ...t, unread: 0 } : t))
      })
      .catch(() => setLoadingMsgs(false))
  }

  useEffect(() => {
    return () => { if (pollRef.current) clearInterval(pollRef.current) }
  }, [])

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)
    }
  }, [messages])

  async function send() {
    if (!body.trim() || !selected || sending) return
    setSending(true)
    const text = body.trim()
    setBody('')
    const res = await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ project_id: selected, body: text }),
    })
    if (res.ok) {
      fetchMessages(selected, true)
      loadThreads()
    }
    setSending(false)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
  }

  return (
    <>
      <style>{`
        .msg-wrap { display: flex; gap: 0; height: calc(100vh - 130px); min-height: 400px; background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; }
        .msg-threads { width: 280px; flex-shrink: 0; border-right: 1px solid #e5e7eb; display: flex; flex-direction: column; }
        .msg-threads-header { padding: 1rem 1.25rem; border-bottom: 1px solid #f3f4f6; font-weight: 700; font-size: 0.9rem; color: #111827; }
        .msg-thread-item { padding: 0.85rem 1.25rem; cursor: pointer; border-bottom: 1px solid #f9fafb; transition: background 0.15s; }
        .msg-thread-item:hover { background: #f9fafb; }
        .msg-thread-item.active { background: #f0fdf4; border-right: 3px solid #1B4332; }
        .msg-thread-title { font-weight: 600; font-size: 0.85rem; color: #111827; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: flex; justify-content: space-between; align-items: center; }
        .msg-thread-last { font-size: 0.75rem; color: #9ca3af; margin-top: 0.2rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .msg-unread { background: #1B4332; color: #fff; border-radius: 100px; font-size: 0.65rem; font-weight: 700; padding: 2px 6px; flex-shrink: 0; }
        .msg-chat { flex: 1; display: flex; flex-direction: column; min-width: 0; }
        .msg-chat-header { padding: 1rem 1.5rem; border-bottom: 1px solid #f3f4f6; display: flex; align-items: center; gap: 0.75rem; }
        .msg-messages { flex: 1; overflow-y: auto; padding: 1.25rem 1.5rem; display: flex; flex-direction: column; gap: 0.75rem; }
        .msg-bubble { max-width: 70%; padding: 0.65rem 1rem; border-radius: 14px; font-size: 0.875rem; line-height: 1.55; word-break: break-word; }
        .msg-bubble.mine { background: #1B4332; color: #fff; border-radius: 14px 14px 4px 14px; align-self: flex-end; }
        .msg-bubble.theirs { background: #f3f4f6; color: #111827; border-radius: 14px 14px 14px 4px; align-self: flex-start; }
        .msg-meta { font-size: 0.68rem; color: #9ca3af; margin-top: 2px; }
        .msg-input-area { padding: 1rem 1.25rem; border-top: 1px solid #e5e7eb; display: flex; gap: 0.75rem; align-items: flex-end; }
        .msg-input-area textarea { flex: 1; padding: 0.65rem 0.9rem; border: 1px solid #e5e7eb; border-radius: 10px; font-size: 0.875rem; resize: none; outline: none; font-family: inherit; line-height: 1.5; max-height: 120px; }
        .msg-input-area textarea:focus { border-color: #1B4332; }
        .msg-send-btn { padding: 0.65rem 1.25rem; background: #1B4332; color: #fff; border: none; border-radius: 10px; font-size: 0.875rem; font-weight: 700; cursor: pointer; flex-shrink: 0; }
        .msg-send-btn:disabled { opacity: 0.5; cursor: default; }
        @media (max-width: 700px) {
          .msg-threads { width: 100%; display: ${selected ? 'none' : 'flex'}; }
          .msg-chat { display: ${selected ? 'flex' : 'none'}; }
          .msg-wrap { height: auto; min-height: 70vh; }
        }
      `}</style>

      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '1.5rem', fontWeight: 700, color: '#111827', margin: '0 0 0.25rem' }}>Messages</h1>
        <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0 }}>Send and receive messages about your projects.</p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af' }}>Loading...</div>
      ) : threads.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 2rem', background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>💬</div>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.25rem', color: '#111827', margin: '0 0 0.5rem' }}>No active projects</h2>
          <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>Messages are tied to your projects. Submit a request to get started.</p>
        </div>
      ) : (
        <div className="msg-wrap">
          {/* Thread list */}
          <div className="msg-threads">
            <div className="msg-threads-header">Your Projects</div>
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {threads.map(t => (
                <div key={t.id} className={`msg-thread-item${selected === t.id ? ' active' : ''}`} onClick={() => openThread(t.id)}>
                  <div className="msg-thread-title">
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.title}</span>
                    {t.unread > 0 && <span className="msg-unread">{t.unread}</span>}
                  </div>
                  <div style={{ fontSize: '0.68rem', color: '#1B4332', fontWeight: 600, marginTop: 2 }}>{STATUS_LABELS[t.status] || t.status}</div>
                  {t.last_message ? (
                    <div className="msg-thread-last">
                      {t.last_message.is_admin ? 'Team: ' : 'You: '}{t.last_message.body.slice(0, 45)}{t.last_message.body.length > 45 ? '...' : ''}
                    </div>
                  ) : (
                    <div className="msg-thread-last" style={{ fontStyle: 'italic' }}>No messages yet</div>
                  )}
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
                  {project && <>
                    <button onClick={() => { setSelected(null); if (pollRef.current) clearInterval(pollRef.current) }}
                      style={{ background: 'none', border: '1px solid #e5e7eb', borderRadius: 7, padding: '0.3rem 0.65rem', fontSize: '0.78rem', cursor: 'pointer', color: '#6b7280', display: 'none' }}
                      className="msg-back">← Back
                    </button>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#111827' }}>{project.title}</div>
                      <div style={{ fontSize: '0.72rem', color: '#9ca3af' }}>Messages are replied to by the Ryters Spot team</div>
                    </div>
                  </>}
                </div>
                <div className="msg-messages">
                  {loadingMsgs && messages.length === 0 ? (
                    <div style={{ textAlign: 'center', color: '#9ca3af', padding: '2rem' }}>Loading messages...</div>
                  ) : messages.length === 0 ? (
                    <div style={{ textAlign: 'center', color: '#9ca3af', padding: '2rem', fontSize: '0.875rem' }}>
                      No messages yet. Start the conversation below.
                    </div>
                  ) : (
                    messages.map(m => (
                      <div key={m.id} style={{ display: 'flex', flexDirection: 'column', alignItems: m.is_admin ? 'flex-start' : 'flex-end' }}>
                        <div className={`msg-bubble ${m.is_admin ? 'theirs' : 'mine'}`}>{m.body}</div>
                        <div className="msg-meta" style={{ textAlign: m.is_admin ? 'left' : 'right' }}>
                          {m.is_admin ? (m.profiles?.full_name || 'Ryters Spot') : 'You'} · {fmtTime(m.created_at)}
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={bottomRef} />
                </div>
                <div className="msg-input-area">
                  <textarea
                    rows={1}
                    value={body}
                    onChange={e => setBody(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Write a message... (Enter to send)"
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
