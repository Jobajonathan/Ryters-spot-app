'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

type Post = {
  id: string
  title: string
  slug: string
  excerpt: string | null
  category: string | null
  published_at: string | null
  author_name: string | null
  cover_image_url: string | null
}

const CATEGORIES = [
  { key: 'all', label: 'All' },
  { key: 'Research', label: 'Research' },
  { key: 'Product Management', label: 'Product' },
  { key: 'Digital Transformation', label: 'Systems' },
  { key: 'AI & Automation', label: 'Automation' },
  { key: 'Ed-Tech', label: 'Learning Products' },
]

const fallbackPosts: Post[] = [
  {
    id: 'fallback-research-product-decisions',
    title: 'Research before product decisions',
    slug: 'research-before-product-decisions',
    excerpt: 'A practical note on using evidence, user context and decision briefs before committing product effort.',
    category: 'Research',
    published_at: null,
    author_name: 'Ryters Spot',
    cover_image_url: null,
  },
  {
    id: 'fallback-knowledge-systems',
    title: 'Turning expertise into knowledge systems',
    slug: 'turning-expertise-into-knowledge-systems',
    excerpt: 'How teams can turn scattered expertise into documentation, learning products and repeatable delivery assets.',
    category: 'Digital Transformation',
    published_at: null,
    author_name: 'Ryters Spot',
    cover_image_url: null,
  },
  {
    id: 'fallback-product-roadmaps',
    title: 'From idea to usable roadmap',
    slug: 'from-idea-to-usable-roadmap',
    excerpt: 'The R&PD lens for moving from early ambition to scoped requirements, product direction and execution rhythm.',
    category: 'Product Management',
    published_at: null,
    author_name: 'Ryters Spot',
    cover_image_url: null,
  },
]

function fmtDate(iso: string | null) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default function BlogPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState('all')

  useEffect(() => {
    fetch('/api/blog')
      .then((res) => res.json())
      .then((data) => { setPosts(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const displayPosts = posts.length > 0 ? posts : fallbackPosts
  const filtered = activeFilter === 'all' ? displayPosts : displayPosts.filter((post) => post.category === activeFilter)
  const featured = displayPosts[0] || null
  const gridPosts = activeFilter === 'all' ? displayPosts.slice(1) : filtered
  const usingFallback = !loading && posts.length === 0

  return (
    <>
      <header className="page-hero liquid-page-hero">
        <div className="container">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span className="breadcrumb-sep">/</span>
            <span>Insights</span>
          </nav>
          <p className="rpd-kicker">R&amp;PD Insights</p>
          <h1>Notes on research, products and knowledge systems.</h1>
          <p>Clear thinking for people turning ideas into deliverables, systems and products.</p>
        </div>
      </header>

      <div className="liquid-filter">
        <div className="container">
          {CATEGORIES.map(({ key, label }) => (
            <button key={key} className={activeFilter === key ? 'active' : ''} onClick={() => setActiveFilter(key)}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <section className="section"><div className="container empty-state">Loading insights...</div></section>
      ) : (
        <>
          {activeFilter === 'all' && featured && (
            <section className="section">
              <div className="container">
                <article className="blog-featured liquid-glass">
                  <div className="blog-featured-img">
                    {featured.cover_image_url ? <img src={featured.cover_image_url} alt={featured.title} /> : <span>R&amp;PD Insight</span>}
                  </div>
                  <div className="blog-featured-body">
                    {usingFallback && <span className="blog-status">Editorial preview</span>}
                    {featured.category && <span className="blog-tag">{featured.category}</span>}
                    <h2>{featured.title}</h2>
                    {featured.excerpt && <p>{featured.excerpt}</p>}
                    <div className="blog-row">
                      <div className="blog-meta">
                        <span>{featured.author_name || 'Ryters Spot'}</span>
                        {featured.published_at && <><span className="blog-meta-dot" /><span>{fmtDate(featured.published_at)}</span></>}
                      </div>
                      <Link href={usingFallback ? '/blog' : `/blog/${featured.slug}`} className="btn btn-liquid btn-sm">Read insight</Link>
                    </div>
                  </div>
                </article>
              </div>
            </section>
          )}

          <section className={`section${activeFilter === 'all' ? ' section-alt' : ''}`}>
            <div className="container">
              <div className="blog-heading-row">
                <h2>{activeFilter === 'all' ? 'All insights' : CATEGORIES.find((item) => item.key === activeFilter)?.label}</h2>
                <p>Showing {gridPosts.length} article{gridPosts.length !== 1 ? 's' : ''}</p>
              </div>
              {usingFallback && (
                <div className="blog-note liquid-glass">
                  <strong>Blog publishing is connected.</strong>
                  <span>These are editorial placeholders until published posts are available from the content system.</span>
                </div>
              )}
              {gridPosts.length === 0 ? (
                <p className="empty-state">No articles in this category yet.</p>
              ) : (
                <div className="blog-grid">
                  {gridPosts.map((post) => (
                    <article key={post.id} className="blog-card liquid-glass">
                      <div className="blog-card-img">
                        {post.cover_image_url ? <img src={post.cover_image_url} alt={post.title} /> : <span>{post.category || 'Insight'}</span>}
                      </div>
                      <div className="blog-card-body">
                        {post.category && <span className="blog-tag">{post.category}</span>}
                        <h3>{post.title}</h3>
                        {post.excerpt && <p>{post.excerpt}</p>}
                        <div className="blog-row">
                          <div className="blog-meta">
                            <span>{post.author_name || 'Ryters Spot'}</span>
                            {post.published_at && <><span className="blog-meta-dot" /><span>{fmtDate(post.published_at)}</span></>}
                          </div>
                          <Link href={usingFallback ? '/blog' : `/blog/${post.slug}`}>Read</Link>
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
    </>
  )
}
