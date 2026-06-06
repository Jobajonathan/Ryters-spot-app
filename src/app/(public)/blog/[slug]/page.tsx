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
    return <p key={i} style={{ fontSize: '1.05rem', lineHeight: 1.85, color: 'var(--clr-text-muted)', margin: '0 0 1.25rem' }}>{content}</p>
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
        .post-hero {
          background: var(--clr-bg);
          border-bottom: 1px solid var(--clr-border);
          padding: var(--space-3xl) 0 var(--space-2xl);
        }
        .post-hero .container { max-width: 800px; }
        .post-body { max-width: 800px; margin: 0 auto; padding: 3rem 1.5rem; }
        .post-category {
          display: inline-block;
          font-size: 0.72rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          padding: 4px 12px;
          border-radius: 100px;
          background: rgba(201,168,76,0.12);
          color: var(--clr-accent);
          margin-bottom: 1.25rem;
        }
        .post-title {
          font-size: clamp(1.75rem, 4vw, 2.8rem);
          font-weight: 800;
          letter-spacing: -0.03em;
          color: var(--clr-text);
          line-height: 1.15;
          margin: 0 0 1.25rem;
        }
        .post-meta { display: flex; align-items: center; gap: 1rem; flex-wrap: wrap; font-size: 0.82rem; color: var(--clr-text-subtle); }
        .post-meta-dot { width: 3px; height: 3px; border-radius: 50%; background: var(--clr-border); display: inline-block; }
        .post-cover { width: 100%; max-height: 420px; object-fit: cover; display: block; border-bottom: 1px solid var(--clr-border); }
      `}</style>

      <header className="post-hero">
        <div className="container">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span className="breadcrumb-sep">&#8250;</span>
            <Link href="/blog">Blog</Link>
            <span className="breadcrumb-sep">&#8250;</span>
            <span>{post.title}</span>
          </nav>
          {post.category && (
            <span className="post-category">{post.category}</span>
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
        <img src={post.cover_image_url} alt={post.title} className="post-cover" />
      )}

      <div className="container">
        <div className="post-body">
          {post.excerpt && (
            <p style={{ fontSize: '1.1rem', fontStyle: 'italic', color: 'var(--clr-text-muted)', lineHeight: 1.75, borderLeft: '2px solid var(--clr-accent)', paddingLeft: '1.25rem', margin: '0 0 2rem' }}>
              {post.excerpt}
            </p>
          )}
          <div>{post.content ? renderContent(post.content) : <p style={{ color: 'var(--clr-text-subtle)' }}>No content yet.</p>}</div>
          <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--clr-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <Link href="/blog" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--clr-primary)', fontWeight: 600, textDecoration: 'none', fontSize: '0.9rem' }}>
              &#8592; Back to Blog
            </Link>
            <a href="https://wa.me/2347062057116" target="_blank" rel="noopener noreferrer" className="btn btn-accent btn-sm">
              Hire Us
            </a>
          </div>
        </div>
      </div>
    </>
  )
}
