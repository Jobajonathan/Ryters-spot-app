'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useScrollReveal } from '@/hooks/useScrollReveal'

type Post = {
  id: string
  title: string
  slug: string
  excerpt: string | null
  category: string | null
  published_at: string | null
  author_name: string | null
}

const CATEGORIES = [
  { key: 'all', label: 'All' },
  { key: 'Digital Transformation', label: 'Digital Transformation' },
  { key: 'Research', label: 'Research' },
  { key: 'Ed-Tech', label: 'Ed-Tech' },
  { key: 'AI & Automation', label: 'AI & Automation' },
  { key: 'Product Management', label: 'Product Management' },
  { key: 'Tips & Guides', label: 'Tips & Guides' },
  { key: 'Company News', label: 'Company News' },
]

function fmtDate(iso: string | null) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default function BlogPage() {
  useScrollReveal()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState('all')

  useEffect(() => {
    fetch('/api/blog')
      .then(r => r.json())
      .then(data => { setPosts(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const filtered = activeFilter === 'all' ? posts : posts.filter(p => p.category === activeFilter)
  const featured = posts[0] || null
  const gridPosts = activeFilter === 'all' ? posts.slice(1) : filtered

  return (
    <>
      <header className="page-hero">
        <div className="container">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span className="breadcrumb-sep">&#8250;</span>
            <span>Blog &amp; Insights</span>
          </nav>
          <h1>Insights &amp; Thought Leadership</h1>
          <p>Expert perspectives on writing, research, strategy, digital transformation, and education from the Ryters Spot team.</p>
        </div>
      </header>

      {/* Category Filter */}
      <div style={{ background: 'var(--clr-surface)', borderBottom: '1px solid var(--clr-border)', overflowX: 'auto' }}>
        <div className="container">
          <div style={{ display: 'flex', gap: '8px', padding: '0.75rem 0', whiteSpace: 'nowrap', alignItems: 'center' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--clr-text-subtle)', textTransform: 'uppercase', letterSpacing: '0.08em', marginRight: '4px' }}>Filter:</span>
            {CATEGORIES.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setActiveFilter(key)}
                style={{
                  padding: '0.4rem 1rem',
                  borderRadius: '100px',
                  fontSize: '0.82rem',
                  fontWeight: activeFilter === key ? 600 : 500,
                  background: activeFilter === key ? 'var(--clr-primary)' : 'transparent',
                  color: activeFilter === key ? '#fff' : 'var(--clr-text-muted)',
                  border: activeFilter === key ? 'none' : '1px solid var(--clr-border)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <section className="section">
          <div className="container" style={{ textAlign: 'center', padding: '4rem', color: 'var(--clr-text-muted)' }}>
            Loading articles...
          </div>
        </section>
      ) : posts.length === 0 ? (
        <section className="section">
          <div className="container" style={{ textAlign: 'center', padding: '5rem 2rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✍️</div>
            <h2 style={{ fontFamily: 'Georgia, serif', color: 'var(--clr-text)', marginBottom: '0.5rem' }}>Coming Soon</h2>
            <p style={{ color: 'var(--clr-text-muted)', maxWidth: '40ch', margin: '0 auto' }}>
              Our team is working on thought-leadership content. Check back soon for expert insights.
            </p>
          </div>
        </section>
      ) : (
        <>
          {/* Featured post */}
          {activeFilter === 'all' && featured && (
            <section className="section">
              <div className="container">
                <span className="section-label">Featured</span>
                <article className="blog-featured reveal" style={{ marginTop: '1rem' }}>
                  <div className="blog-featured-img">✍️</div>
                  <div className="blog-featured-body">
                    {featured.category && <span className="blog-tag">{featured.category}</span>}
                    <h2 className="blog-featured-title">{featured.title}</h2>
                    {featured.excerpt && <p className="blog-featured-excerpt">{featured.excerpt}</p>}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                      <div className="blog-meta">
                        <span>{featured.author_name || 'Ryters Spot Editorial'}</span>
                        {featured.published_at && <><span className="blog-meta-dot" /><span>{fmtDate(featured.published_at)}</span></>}
                      </div>
                      <Link href={`/blog/${featured.slug}`} className="btn btn-outline btn-sm">Read Article</Link>
                    </div>
                  </div>
                </article>
              </div>
            </section>
          )}

          {/* Posts Grid */}
          <section className={`section${activeFilter === 'all' ? ' section-alt' : ''}`} id="all-posts">
            <div className="container">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-xl)' }}>
                <h2 className="reveal">{activeFilter === 'all' ? 'All Articles' : activeFilter}</h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--clr-text-muted)' }} className="reveal">
                  Showing {gridPosts.length} article{gridPosts.length !== 1 ? 's' : ''}
                </p>
              </div>

              {gridPosts.length === 0 ? (
                <p style={{ color: 'var(--clr-text-muted)', textAlign: 'center', padding: '2rem' }}>
                  No articles in this category yet.
                </p>
              ) : (
                <div className="blog-grid">
                  {gridPosts.map((post, i) => (
                    <article key={post.id} className={`blog-card reveal${i % 3 === 1 ? ' fade-up-delay-1' : i % 3 === 2 ? ' fade-up-delay-2' : ''}`}>
                      <div className="blog-card-img" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>
                        ✍️
                      </div>
                      <div className="blog-card-body">
                        {post.category && <span className="blog-tag">{post.category}</span>}
                        <h3 className="blog-title">{post.title}</h3>
                        {post.excerpt && <p className="blog-excerpt">{post.excerpt}</p>}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                          <div className="blog-meta">
                            <span>{post.author_name || 'Ryters Spot'}</span>
                            {post.published_at && <><span className="blog-meta-dot" /><span>{fmtDate(post.published_at)}</span></>}
                          </div>
                          <Link href={`/blog/${post.slug}`} style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--clr-primary)', textDecoration: 'none' }}>
                            Read →
                          </Link>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </section>
        </>
      )}

      {/* Newsletter */}
      <section className="section newsletter">
        <div className="container">
          <div className="newsletter-inner">
            <div>
              <span className="section-label">Stay Informed</span>
              <h2 className="reveal">Get Expert Insights in Your Inbox</h2>
              <p className="reveal" style={{ marginTop: '0.75rem' }}>Join professionals who receive our newsletter on writing, research, and digital strategy.</p>
            </div>
            <div className="reveal">
              <form className="newsletter-form" aria-label="Newsletter signup" noValidate>
                <input type="email" className="newsletter-input" placeholder="Enter your email address" required aria-label="Email address" />
                <button type="submit" className="btn btn-primary">Subscribe</button>
              </form>
              <p style={{ fontSize: '0.75rem', color: 'var(--clr-text-subtle)', marginTop: '0.75rem' }}>No spam. Unsubscribe anytime.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
