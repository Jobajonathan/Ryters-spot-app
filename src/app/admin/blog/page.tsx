'use client'

import { useEffect, useState, useRef } from 'react'

type Post = {
  id: string
  title: string
  excerpt: string | null
  category: string | null
  status: 'draft' | 'published' | 'archived'
  published_at: string | null
  created_at: string
  author_name?: string
  cover_image_url?: string | null
}

const CATEGORIES = ['Research', 'Ed-Tech', 'Digital Transformation', 'Product Management', 'AI & Automation', 'Company News', 'Tips & Guides']

const EMPTY_POST = { title: '', excerpt: '', content: '', category: CATEGORIES[0], status: 'draft' as const, cover_image_url: '' }

export default function BlogPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Partial<Post & { content: string }> | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')
  const [msgOk, setMsgOk] = useState(true)
  const [filter, setFilter] = useState<'all' | 'draft' | 'published'>('all')
  const [uploadingImg, setUploadingImg] = useState(false)
  const [imgError, setImgError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  function loadPosts() {
    fetch('/api/admin/blog')
      .then(r => r.json())
      .then(data => { setPosts(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => setLoading(false))
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { loadPosts() }, [])

  async function save() {
    if (!editing?.title) { setMsg('Title is required.'); setMsgOk(false); return }
    setSaving(true); setMsg('')
    const method = isNew ? 'POST' : 'PATCH'
    const res = await fetch('/api/admin/blog', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(editing) })
    const data = await res.json()
    if (data.success) {
      setMsg(data.data?.status === 'published' ? 'Post published!' : 'Saved as draft.'); setMsgOk(true)
      loadPosts()
      setTimeout(() => { setEditing(null); setMsg('') }, 1000)
    } else {
      setMsg(data.error || 'Could not save post.'); setMsgOk(false)
    }
    setSaving(false)
  }

  async function openEditById(id: string) {
    const res = await fetch(`/api/admin/blog?id=${id}`)
    const data = await res.json()
    if (data.id) { setEditing(data); setIsNew(false) }
  }

  async function deletePost(id: string, title: string) {
    if (!confirm(`Delete "${title}"?`)) return
    await fetch('/api/admin/blog', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    setPosts(prev => prev.filter(p => p.id !== id))
  }

  async function handleImageUpload(file: File) {
    setUploadingImg(true)
    setImgError('')
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/admin/blog/upload', { method: 'POST', body: formData })
      const data = await res.json()
      if (data.success && data.url) {
        setEditing(p => ({ ...p, cover_image_url: data.url }))
      } else {
        setImgError(data.error || 'Upload failed.')
      }
    } catch {
      setImgError('Upload failed. Please try again.')
    }
    setUploadingImg(false)
  }

  const filtered = filter === 'all' ? posts : posts.filter(p => p.status === filter)

  const STATUS_STYLES: Record<string, { bg: string; color: string }> = {
    published: { bg: '#f0fdf4', color: '#166534' },
    draft:     { bg: '#f3f4f6', color: '#6b7280' },
    archived:  { bg: '#fff7ed', color: '#9a3412' },
  }

  if (editing !== null) {
    return (
      <>
        <style>{`
          .blog-editor textarea { width: 100%; padding: 0.75rem; border: 1px solid #e5e7eb; border-radius: 8px; font-size: 0.875rem; outline: none; resize: vertical; line-height: 1.6; font-family: inherit; }
          .blog-editor textarea:focus { border-color: #1B4332; }
          .blog-editor input[type=text] { width: 100%; padding: 0.65rem 0.85rem; border: 1px solid #e5e7eb; border-radius: 8px; font-size: 0.875rem; outline: none; }
          .blog-editor input[type=text]:focus { border-color: #1B4332; }
          .blog-field { margin-bottom: 1.25rem; }
          .blog-field label { display: block; font-size: 0.72rem; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 0.4rem; }
          .blog-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
          .img-upload-area { border: 2px dashed #e5e7eb; border-radius: 10px; padding: 1.25rem; text-align: center; cursor: pointer; transition: border-color 0.2s; }
          .img-upload-area:hover { border-color: #1B4332; }
          .img-upload-area input[type=file] { display: none; }
        `}</style>
        <div className="blog-editor">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.75rem', flexWrap: 'wrap' }}>
            <button onClick={() => setEditing(null)} style={{ background: 'none', border: '1px solid #e5e7eb', color: '#6b7280', padding: '0.45rem 0.85rem', borderRadius: 8, fontSize: '0.82rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              ← Back to posts
            </button>
            <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '1.35rem', fontWeight: 700, color: '#111827', margin: 0, flex: 1 }}>
              {isNew ? 'New Blog Post' : 'Edit Post'}
            </h1>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={() => { setEditing(p => ({ ...p, status: 'draft' })); setTimeout(save, 100) }} disabled={saving}
                style={{ padding: '0.55rem 1rem', background: '#f3f4f6', color: '#374151', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer' }}>
                Save Draft
              </button>
              <button onClick={() => { setEditing(p => ({ ...p, status: 'published' })); setTimeout(save, 100) }} disabled={saving}
                style={{ padding: '0.55rem 1.25rem', background: '#1B4332', color: '#fff', border: 'none', borderRadius: 8, fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer', opacity: saving ? 0.7 : 1 }}>
                {saving ? 'Saving...' : 'Publish'}
              </button>
            </div>
          </div>

          {msg && <div style={{ padding: '10px 14px', borderRadius: 8, marginBottom: '1rem', background: msgOk ? '#f0fff4' : '#fff5f5', border: `1px solid ${msgOk ? '#9ae6b4' : '#feb2b2'}`, color: msgOk ? '#276749' : '#c53030', fontSize: '0.82rem' }}>{msg}</div>}

          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: '1.75rem', maxWidth: 800 }}>
            <div className="blog-field">
              <label>Post Title *</label>
              <input type="text" value={editing.title || ''} onChange={e => setEditing(p => ({ ...p, title: e.target.value }))} placeholder="Enter an engaging title..." style={{ fontSize: '1rem' }} />
            </div>

            <div className="blog-row">
              <div className="blog-field">
                <label>Category</label>
                <select value={editing.category || ''} onChange={e => setEditing(p => ({ ...p, category: e.target.value }))}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: '0.875rem', outline: 'none', background: '#fff' }}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="blog-field">
                <label>Status</label>
                <select value={editing.status || 'draft'} onChange={e => setEditing(p => ({ ...p, status: e.target.value as 'draft' | 'published' }))}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: '0.875rem', outline: 'none', background: '#fff' }}>
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>

            <div className="blog-field">
              <label>Excerpt (shown in blog listings)</label>
              <textarea rows={2} value={editing.excerpt || ''} onChange={e => setEditing(p => ({ ...p, excerpt: e.target.value }))} placeholder="A short summary of the post..." />
            </div>

            {/* Cover Image Upload */}
            <div className="blog-field">
              <label>Cover Image</label>
              {editing.cover_image_url ? (
                <div style={{ marginBottom: '0.75rem' }}>
                  <img
                    src={editing.cover_image_url}
                    alt="Cover preview"
                    style={{ width: '100%', maxHeight: 220, objectFit: 'cover', borderRadius: 8, border: '1px solid #e5e7eb', display: 'block' }}
                  />
                  <button
                    type="button"
                    onClick={() => setEditing(p => ({ ...p, cover_image_url: '' }))}
                    style={{ marginTop: '0.5rem', padding: '0.3rem 0.75rem', background: '#fff5f5', color: '#991b1b', border: '1px solid #fecaca', borderRadius: 6, fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
                  >
                    Remove Image
                  </button>
                </div>
              ) : (
                <div
                  className="img-upload-area"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {uploadingImg ? (
                    <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>Uploading image...</div>
                  ) : (
                    <>
                      <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🖼️</div>
                      <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Click to upload a cover image</div>
                      <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>JPEG, PNG, WebP or GIF — max 5MB</div>
                    </>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={e => {
                      const file = e.target.files?.[0]
                      if (file) handleImageUpload(file)
                      e.target.value = ''
                    }}
                  />
                </div>
              )}
              {imgError && <p style={{ fontSize: '0.78rem', color: '#c53030', marginTop: '0.35rem' }}>{imgError}</p>}
            </div>

            <div className="blog-field">
              <label>Content</label>
              <textarea rows={18} value={(editing as { content?: string }).content || ''} onChange={e => setEditing(p => ({ ...p, content: e.target.value }))} placeholder={`Write your full blog post content here...

You can use basic formatting:
- **bold** for bold text
- Line breaks for paragraphs`} />
              <div style={{ fontSize: '0.72rem', color: '#9ca3af', marginTop: '0.3rem' }}>
                {((editing as { content?: string }).content || '').split(/\s+/).filter(Boolean).length} words
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '1.5rem', fontWeight: 700, color: '#111827', margin: '0 0 0.25rem' }}>Blog Posts</h1>
          <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0 }}>Create and manage content for the Ryters Spot blog.</p>
        </div>
        <button onClick={() => { setEditing({ ...EMPTY_POST }); setIsNew(true) }}
          style={{ padding: '0.6rem 1.25rem', background: '#1B4332', color: '#fff', border: 'none', borderRadius: 8, fontSize: '0.875rem', fontWeight: 700, cursor: 'pointer' }}>
          + New Post
        </button>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {(['all', 'published', 'draft'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            style={{ padding: '0.3rem 0.85rem', borderRadius: '100px', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', border: `1px solid ${filter === f ? '#1B4332' : '#e5e7eb'}`, background: filter === f ? '#1B4332' : '#fff', color: filter === f ? '#fff' : '#6b7280' }}>
            {f.charAt(0).toUpperCase() + f.slice(1)} ({f === 'all' ? posts.length : posts.filter(p => p.status === f).length})
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af' }}>Loading posts...</div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>✍️</div>
          <div style={{ fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>No posts yet</div>
          <div style={{ color: '#9ca3af', fontSize: '0.875rem', marginBottom: '1.25rem' }}>Create your first blog post to engage your audience.</div>
          <button onClick={() => { setEditing({ ...EMPTY_POST }); setIsNew(true) }}
            style={{ padding: '0.6rem 1.25rem', background: '#1B4332', color: '#fff', border: 'none', borderRadius: 8, fontSize: '0.875rem', fontWeight: 700, cursor: 'pointer' }}>
            Write First Post
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {filtered.map(post => {
            const s = STATUS_STYLES[post.status] || STATUS_STYLES.draft
            return (
              <div key={post.id} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                {post.cover_image_url && (
                  <img
                    src={post.cover_image_url}
                    alt=""
                    style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 8, flexShrink: 0, border: '1px solid #e5e7eb' }}
                  />
                )}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.35rem', flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#111827' }}>{post.title}</span>
                    <span style={{ fontSize: '0.68rem', fontWeight: 700, padding: '2px 8px', borderRadius: '100px', background: s.bg, color: s.color }}>{post.status}</span>
                    {post.category && <span style={{ fontSize: '0.68rem', background: 'rgba(27,67,50,0.08)', color: '#1B4332', padding: '2px 8px', borderRadius: '100px', fontWeight: 600 }}>{post.category}</span>}
                  </div>
                  {post.excerpt && <p style={{ margin: 0, fontSize: '0.82rem', color: '#6b7280', lineHeight: 1.5 }}>{post.excerpt}</p>}
                  <div style={{ fontSize: '0.72rem', color: '#9ca3af', marginTop: '0.5rem' }}>
                    {post.status === 'published' && post.published_at
                      ? `Published ${new Date(post.published_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}`
                      : `Created ${new Date(post.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}`
                    }
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                  <button onClick={() => openEditById(post.id)}
                    style={{ padding: '0.35rem 0.75rem', background: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0', borderRadius: 7, fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>
                    Edit
                  </button>
                  <button onClick={() => deletePost(post.id, post.title)}
                    style={{ padding: '0.35rem 0.75rem', background: '#fff5f5', color: '#991b1b', border: '1px solid #fecaca', borderRadius: 7, fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>
                    Delete
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </>
  )
}
