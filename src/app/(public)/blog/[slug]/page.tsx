import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

function renderContent(text: string) {
  const paragraphs = text.split(/\n\n+/).filter(Boolean)
  return paragraphs.map((para, i) => {
    // Simple **bold** rendering
    const parts = para.split(/\*\*(.+?)\*\*/g)
    const content = parts.map((part, j) => j % 2 === 1 ? <strong key={j}>{part}</strong> : part)
    return <p key={i} style={{ fontSize: '1.05rem', lineHeight: 1.85, color: '#374151', margin: '0 0 1.25rem' }}>{content}</p>
  })
}

const CATEGORY_COLORS: Record<string, string> = {
  'Research': '#1B4332',
  'Ed-Tech': '#065f46',
  'Digital Transformation': '#1B4332',
  'Product Management': '#1B4332',
  'AI & Automation': '#065f46',
  'Company News': '#C9A84C',
  'Tips & Guides': '#065f46',
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const { data: post, error } = await supabase
    .from('blog_posts')
    .select('*, profiles:author_id(full_name)')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (error || !post) notFound()

  const authorName = (post.profiles as { full_name?: string } | null)?.full_name || 'Ryters Spot Editorial'
  const publishedDate = post.published_at
    ? new Date(post.published_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    : ''
  const wordCount = (post.content || '').split(/\s+/).filter(Boolean).length
  const readTime = Math.max(1, Math.ceil(wordCount / 200))

  return (
    <>
      <style>{`
        .post-hero { background: var(--clr-primary); padding: 4rem 0 3rem; }
        .post-hero .container { max-width: 800px; }
        .post-body { max-width: 800px; margin: 0 auto; padding: 3rem 1.5rem; }
        .post-category { display: inline-block; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; padding: 4px 12px; border-radius: 100px; background: rgba(201,168,76,0.2); color: #C9A84C; margin-bottom: 1rem; }
        .post-title { font-family: Georgia, serif; font-size: clamp(1.75rem, 4vw, 2.5rem); font-weight: 700; color: #fff; line-height: 1.25; margin: 0 0 1.25rem; }
        .post-meta { display: flex; align-items: center; gap: 1rem; flex-wrap: wrap; font-size: 0.85rem; color: rgba(255,255,255,0.7); }
        .post-meta-dot { width: 4px; height: 4px; border-radius: 50%; background: rgba(255,255,255,0.4); display: inline-block; }
        .post-cover { width: 100%; max-height: 400px; object-fit: cover; display: block; }
      `}</style>

      <header className="post-hero">
        <div className="container">
          <nav style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: 'rgba(255,255,255,0.6)', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            <Link href="/" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>Home</Link>
            <span>›</span>
            <Link href="/blog" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>Blog</Link>
            <span>›</span>
            <span style={{ color: 'rgba(255,255,255,0.9)' }}>{post.title}</span>
          </nav>
          {post.category && (
            <span className="post-category" style={{ background: `rgba(${CATEGORY_COLORS[post.category] === '#C9A84C' ? '201,168,76' : '255,255,255'},0.15)`, color: '#C9A84C' }}>
              {post.category}
            </span>
          )}
          <h1 className="post-title">{post.title}</h1>
          <div className="post-meta">
            <span>{authorName}</span>
            {publishedDate && <><span className="post-meta-dot" /><span>{publishedDate}</span></>}
            <span className="post-meta-dot" />
            <span>{readTime} min read</span>
          </div>
        </div>
      </header>

      {post.cover_image_url && (
        <img
          src={post.cover_image_url}
          alt={post.title}
          className="post-cover"
        />
      )}

      <div className="container">
        <div className="post-body">
          {post.excerpt && (
            <p style={{ fontSize: '1.15rem', fontStyle: 'italic', color: '#6b7280', lineHeight: 1.7, borderLeft: '3px solid #C9A84C', paddingLeft: '1.25rem', margin: '0 0 2rem' }}>
              {post.excerpt}
            </p>
          )}
          <div>{post.content ? renderContent(post.content) : <p style={{ color: '#9ca3af' }}>No content yet.</p>}</div>
          <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <Link href="/blog" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#1B4332', fontWeight: 600, textDecoration: 'none', fontSize: '0.9rem' }}>
              ← Back to Blog
            </Link>
            <Link href="/get-started" style={{ display: 'inline-block', background: '#1B4332', color: '#fff', padding: '0.6rem 1.5rem', borderRadius: 8, fontWeight: 700, textDecoration: 'none', fontSize: '0.9rem' }}>
              Work with Us
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
