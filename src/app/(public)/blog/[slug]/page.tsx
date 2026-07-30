import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

function renderContent(text: string) {
  const paragraphs = text.split(/\n\n+/).filter(Boolean)
  return paragraphs.map((para, index) => {
    const parts = para.split(/\*\*(.+?)\*\*/g)
    const content = parts.map((part, partIndex) => partIndex % 2 === 1 ? <strong key={partIndex}>{part}</strong> : part)
    return <p key={index}>{content}</p>
  })
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const { data: post, error } = await getSupabase()
    .from('blog_posts')
    .select('*, profiles:author_id(full_name)')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (error || !post) notFound()

  const authorName = (post.profiles as { full_name?: string } | null)?.full_name || 'Ryters Spot'
  const publishedDate = post.published_at
    ? new Date(post.published_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    : ''
  const wordCount = (post.content || '').split(/\s+/).filter(Boolean).length
  const readTime = Math.max(1, Math.ceil(wordCount / 200))

  return (
    <>
      <header className="page-hero liquid-page-hero post-liquid-hero">
        <div className="container">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span className="breadcrumb-sep">/</span>
            <Link href="/blog">Insights</Link>
            <span className="breadcrumb-sep">/</span>
            <span>{post.title}</span>
          </nav>
          {post.category && <span className="blog-tag">{post.category}</span>}
          <h1>{post.title}</h1>
          <div className="blog-meta">
            <span>{authorName}</span>
            {publishedDate && <><span className="blog-meta-dot" /><span>{publishedDate}</span></>}
            <span className="blog-meta-dot" />
            <span>{readTime} min read</span>
          </div>
        </div>
      </header>

      {post.cover_image_url && <img src={post.cover_image_url} alt={post.title} className="post-cover" />}

      <div className="container">
        <article className="post-body liquid-glass">
          {post.excerpt && <p className="post-excerpt">{post.excerpt}</p>}
          <div className="post-content">{post.content ? renderContent(post.content) : <p>No content yet.</p>}</div>
          <footer className="post-footer">
            <Link href="/blog">Back to insights</Link>
            <Link href="/contact" className="btn btn-accent btn-sm">Start a project</Link>
          </footer>
        </article>
      </div>
    </>
  )
}
