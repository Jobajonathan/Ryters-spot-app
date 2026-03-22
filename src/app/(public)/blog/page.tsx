'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useScrollReveal } from '@/hooks/useScrollReveal'

type Category = 'all' | 'digital-transformation' | 'academic' | 'content-strategy' | 'training' | 'edtech'

const posts = [
  { cat: 'digital-transformation', icon: '&#128640;', tag: 'Digital Transformation', title: '5 Digital Transformation Pitfalls Every Nigerian Business Must Avoid', excerpt: 'From misaligned technology choices to change management failures, we examine the most common mistakes organizations make on the transformation journey.', author: 'Dr. F. Babatunde', read: '7 min read' },
  { cat: 'academic', icon: '&#128214;', tag: 'Academic Writing', title: 'Mastering the Literature Review: A Framework for African Researchers', excerpt: 'A practical, step-by-step approach to writing a literature review that demonstrates critical thinking and positions your research within the scholarly conversation.', author: 'Dr. A. Nwosu', read: '10 min read' },
  { cat: 'content-strategy', icon: '&#9999;&#65039;', tag: 'Content Strategy', title: 'The ROI of Content: How to Prove Your Content Program is Working', excerpt: 'Beyond vanity metrics, the frameworks and measurement approaches that connect content activity to real business outcomes like leads, revenue, and retention.', author: 'Ryters Spot Editorial', read: '9 min read' },
  { cat: 'edtech', icon: '&#128187;', tag: 'Ed-Tech', title: 'LMS Selection 101: Choosing the Right Platform for Your Institution', excerpt: 'With dozens of LMS options on the market, how do you choose the right one? We break down the evaluation criteria every institution should use.', author: 'T. Daniels', read: '8 min read' },
  { cat: 'training', icon: '&#127919;', tag: 'Corporate Training', title: 'Why Business Writing Training Returns 7x ROI for Nigerian Enterprises', excerpt: 'Poor written communication costs organizations billions in misunderstandings, lost deals, and wasted time. Here is the data and how to fix it.', author: 'Ryters Spot Editorial', read: '6 min read' },
  { cat: 'academic', icon: '&#128302;', tag: 'Academic Writing', title: 'Quantitative vs Qualitative Research: Choosing the Right Methodology', excerpt: 'A beginner-friendly breakdown of the two major research paradigms, with guidance on choosing the approach that best fits your research question.', author: 'Dr. A. Nwosu', read: '11 min read' },
  { cat: 'content-strategy', icon: '&#128241;', tag: 'Content Strategy', title: 'Social Media Content Strategy for B2B Brands in Africa', excerpt: 'LinkedIn, Twitter, and beyond, how African B2B brands can build authority, generate leads, and engage decision-makers through strategic social content.', author: 'Ryters Spot Editorial', read: '7 min read' },
  { cat: 'edtech', icon: '&#127757;', tag: 'Ed-Tech', title: 'The Future of Education in Africa: Ed-Tech Trends to Watch in 2025', excerpt: 'From AI-powered adaptive learning to mobile-first design, we identify the technology trends reshaping education across the African continent.', author: 'T. Daniels', read: '9 min read' },
  { cat: 'digital-transformation', icon: '&#127974;', tag: 'Digital Transformation', title: 'Digital Transformation in Nigerian Banking: A 2025 Benchmark Report', excerpt: 'How are Nigeria\'s leading banks performing on the digital maturity scale? Our analysis of 12 institutions reveals the leaders, the laggards, and the lessons.', author: 'Ryters Spot Research', read: '14 min read' },
]

export default function BlogPage() {
  useScrollReveal()
  const [activeFilter, setActiveFilter] = useState<Category>('all')

  const filtered = posts.filter(p => activeFilter === 'all' || p.cat === activeFilter)

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
            {(['all', 'digital-transformation', 'academic', 'content-strategy', 'training', 'edtech'] as Category[]).map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                style={{
                  padding: '0.4rem 1rem',
                  borderRadius: '100px',
                  fontSize: '0.82rem',
                  fontWeight: activeFilter === cat ? 600 : 500,
                  background: activeFilter === cat ? 'var(--clr-primary)' : 'transparent',
                  color: activeFilter === cat ? '#fff' : 'var(--clr-text-muted)',
                  border: activeFilter === cat ? 'none' : '1px solid var(--clr-border)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {cat === 'all' ? 'All' : cat === 'digital-transformation' ? 'Digital Transformation' : cat === 'academic' ? 'Academic Writing' : cat === 'content-strategy' ? 'Content Strategy' : cat === 'training' ? 'Training' : 'Ed-Tech'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Featured + Sidebar */}
      <section className="section">
        <div className="container">
          <span className="section-label">Featured</span>
          <div className="blog-hero-grid">
            <article className="blog-featured reveal">
              <div className="blog-featured-img">&#128202;</div>
              <div className="blog-featured-body">
                <span className="blog-tag">Digital Transformation</span>
                <h2 className="blog-featured-title">How Nigerian Enterprises Are Winning with Digital Transformation in 2025</h2>
                <p className="blog-featured-excerpt">A deep-dive into the strategies driving digital adoption across banking, telecoms, and manufacturing in Nigeria's rapidly evolving market. We examine case studies, challenge the myths, and identify the critical success factors separating leaders from laggards.</p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                  <div className="blog-meta">
                    <span>Ryters Spot Editorial</span>
                    <span className="blog-meta-dot"></span>
                    <span>March 15, 2025</span>
                    <span className="blog-meta-dot"></span>
                    <span>8 min read</span>
                  </div>
                  <Link href="/blog" className="btn btn-outline btn-sm">Read Article</Link>
                </div>
              </div>
            </article>

            <aside className="blog-sidebar">
              <article className="blog-sidebar-card reveal fade-up-delay-1">
                <div className="blog-sidebar-thumb">&#127891;</div>
                <div>
                  <h3 className="blog-sidebar-title">The PhD Student's Complete Guide to Research Integrity in Africa</h3>
                  <p className="blog-sidebar-meta">Academic Writing &middot; 12 min read</p>
                </div>
              </article>
              <article className="blog-sidebar-card reveal fade-up-delay-2">
                <div className="blog-sidebar-thumb">&#128227;</div>
                <div>
                  <h3 className="blog-sidebar-title">Building a Content Strategy that Converts: Lessons from Top Nigerian Brands</h3>
                  <p className="blog-sidebar-meta">Content Strategy &middot; 6 min read</p>
                </div>
              </article>
              <article className="blog-sidebar-card reveal fade-up-delay-3">
                <div className="blog-sidebar-thumb">&#127947;</div>
                <div>
                  <h3 className="blog-sidebar-title">5 Signs Your Team Needs a Business Writing Overhaul</h3>
                  <p className="blog-sidebar-meta">Corporate Training &middot; 5 min read</p>
                </div>
              </article>
            </aside>
          </div>
        </div>
      </section>

      {/* All Posts Grid */}
      <section className="section section-alt" id="all-posts">
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-xl)' }}>
            <h2 className="reveal">All Articles</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--clr-text-muted)' }} className="reveal">Showing {filtered.length} articles</p>
          </div>

          <div className="blog-grid">
            {filtered.map((post, i) => (
              <article key={i} className={`blog-card reveal${i % 3 === 1 ? ' fade-up-delay-1' : i % 3 === 2 ? ' fade-up-delay-2' : ''}`}>
                <div className="blog-card-img" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>
                  <span dangerouslySetInnerHTML={{ __html: post.icon }} />
                </div>
                <div className="blog-card-body">
                  <span className="blog-tag">{post.tag}</span>
                  <h3 className="blog-title">{post.title}</h3>
                  <p className="blog-excerpt">{post.excerpt}</p>
                  <div className="blog-meta">
                    <span>{post.author}</span>
                    <span className="blog-meta-dot"></span>
                    <span>{post.read}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="section newsletter">
        <div className="container">
          <div className="newsletter-inner">
            <div>
              <span className="section-label">Stay Informed</span>
              <h2 className="reveal">Get Expert Insights in Your Inbox</h2>
              <p className="reveal" style={{ marginTop: '0.75rem' }}>Join 2,000+ professionals who receive our fortnightly newsletter on writing, research, and digital strategy.</p>
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
