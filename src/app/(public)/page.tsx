'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { useScrollReveal, useCounterAnimation } from '@/hooks/useScrollReveal'

export default function HomePage() {
  useScrollReveal()
  useCounterAnimation()

  const trackRef = useRef<HTMLDivElement>(null)
  const currentSlide = useRef(0)
  const totalSlides = 4

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    function goTo(index: number) {
      if (!track) return
      track.style.transform = `translateX(-${index * 100}%)`
      const dots = document.querySelectorAll('.slider-dot')
      dots.forEach((d, i) => d.classList.toggle('active', i === index))
      currentSlide.current = index
    }

    const prevBtn = document.querySelector('.slider-prev')
    const nextBtn = document.querySelector('.slider-next')
    const dots = document.querySelectorAll('.slider-dot')

    prevBtn?.addEventListener('click', () => {
      const prev = (currentSlide.current - 1 + totalSlides) % totalSlides
      goTo(prev)
    })
    nextBtn?.addEventListener('click', () => {
      const next = (currentSlide.current + 1) % totalSlides
      goTo(next)
    })
    dots.forEach((dot, i) => dot.addEventListener('click', () => goTo(i)))

    const interval = setInterval(() => {
      const next = (currentSlide.current + 1) % totalSlides
      goTo(next)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <>
      {/* HERO */}
      <section className="hero" aria-label="Welcome to Ryters Spot">
        <div className="container">
          <div className="hero-inner">

            <div className="hero-content fade-up">
              <div className="hero-label">
                <span className="hero-label-dot"></span>
                Trusted by Organisations Across Europe, North America and Beyond
              </div>

              <h1>Where <span>Words</span> Meet<br />Impact &amp; Authority</h1>

              <p className="hero-sub">
                Ryters Spot delivers specialist research, digital transformation, Ed-Tech and product management services to organisations, institutions and scholars across the UK, Europe, North America and beyond.
              </p>

              <div className="hero-ctas">
                <Link href="/services" className="btn btn-accent btn-lg">Explore Our Services</Link>
                <Link href="/contact" className="btn btn-lg" style={{ background: 'rgba(255,255,255,0.12)', color: '#fff', borderColor: 'rgba(255,255,255,0.3)' }}>Talk to an Expert</Link>
              </div>

              <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.6)', marginBottom: '0.75rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>I AM A:</p>
              <div className="hero-personas">
                <Link href="/services#digital-transformation" className="hero-persona-btn">&#127970; Business / Enterprise</Link>
                <Link href="/services#edtech" className="hero-persona-btn">&#127891; Educator / Institution</Link>
                <Link href="/services#academic" className="hero-persona-btn">&#128218; Researcher / Student</Link>
                <Link href="/services#product-management" className="hero-persona-btn">&#128640; Product Team</Link>
              </div>
            </div>

            <div className="hero-visual fade-up fade-up-delay-2">
              <div className="hero-card">
                <div className="hero-card-header">
                  <div className="hero-card-icon">&#128302;</div>
                  <div>
                    <p className="hero-card-title">Research and Academic Enquiry</p>
                    <p className="hero-card-sub">Dissertations &middot; Data Analysis &middot; Advisory</p>
                  </div>
                </div>
                <div className="hero-stat-row">
                  <div className="hero-stat">
                    <div className="hero-stat-num">500+</div>
                    <div className="hero-stat-lbl">Projects Delivered</div>
                  </div>
                  <div className="hero-stat">
                    <div className="hero-stat-num">98%</div>
                    <div className="hero-stat-lbl">Client Satisfaction</div>
                  </div>
                  <div className="hero-stat">
                    <div className="hero-stat-num">50+</div>
                    <div className="hero-stat-lbl">Expert Writers</div>
                  </div>
                </div>
              </div>

              <div className="hero-card">
                <div className="hero-card-header">
                  <div className="hero-card-icon">&#128640;</div>
                  <div>
                    <p className="hero-card-title">Digital Transformation</p>
                    <p className="hero-card-sub">Automation &middot; Modernisation &middot; Scale</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '4px' }}>
                  <span style={{ background: 'rgba(255,255,255,0.12)', padding: '4px 10px', borderRadius: '100px', fontSize: '0.75rem', color: 'rgba(255,255,255,0.8)' }}>Ed-Tech Services</span>
                  <span style={{ background: 'rgba(255,255,255,0.12)', padding: '4px 10px', borderRadius: '100px', fontSize: '0.75rem', color: 'rgba(255,255,255,0.8)' }}>Product Management</span>
                  <span style={{ background: 'rgba(201,168,76,0.25)', padding: '4px 10px', borderRadius: '100px', fontSize: '0.75rem', color: '#C9A84C' }}>Research and Academic</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <div className="trust-bar">
        <div className="container">
          <p className="trust-bar-label">Trusted by organizations &amp; institutions across Nigeria</p>
          <div className="trust-logos">
            <span className="trust-logo">Enterprise Partners</span>
            <span className="trust-logo">Academic Institutions</span>
            <span className="trust-logo">Government Agencies</span>
            <span className="trust-logo">SMEs &amp; Startups</span>
            <span className="trust-logo">NGOs</span>
            <span className="trust-logo">Research Bodies</span>
          </div>
        </div>
      </div>

      {/* SERVICES */}
      <section className="section section-alt" aria-labelledby="services-heading">
        <div className="container">
          <div className="text-center">
            <span className="section-label">Our Services</span>
            <h2 className="section-heading reveal" id="services-heading">Everything You Need, Under One Roof</h2>
            <p className="section-sub reveal" style={{ marginInline: 'auto' }}>Four core service areas. One integrated team. A single point of accountability for every engagement.</p>
          </div>

          <div className="services-grid services-grid--featured">

            <article className="service-card service-card--featured reveal">
              <div className="service-card-top">
                <div className="service-icon">&#128302;</div>
                <span className="service-badge service-badge--accent">For Academics</span>
              </div>
              <h3 className="service-title">Research and Academic Enquiry</h3>
              <p className="service-desc">Expert academic writing, research support, data analysis and dissertation advisory for postgraduate students, researchers and institutions worldwide.</p>
              <ul className="service-checklist">
                <li>Dissertation and thesis support</li>
                <li>Data analysis and interpretation</li>
                <li>Journal article preparation</li>
              </ul>
              <Link href="/services#academic" className="btn btn-primary btn-sm" style={{ marginTop: 'auto' }}>Explore Service</Link>
            </article>

            <article className="service-card service-card--featured reveal fade-up-delay-1">
              <div className="service-card-top">
                <div className="service-icon">&#128640;</div>
                <span className="service-badge service-badge--green">For Enterprises</span>
              </div>
              <h3 className="service-title">Digital Transformation and Automation</h3>
              <p className="service-desc">End-to-end digital transformation roadmaps that modernize processes, leverage automation and future-proof your organization for sustainable growth.</p>
              <ul className="service-checklist">
                <li>Digital strategy and roadmapping</li>
                <li>Process automation and modernization</li>
                <li>Change management and advisory</li>
              </ul>
              <Link href="/services#digital-transformation" className="btn btn-primary btn-sm" style={{ marginTop: 'auto' }}>Explore Service</Link>
            </article>

            <article className="service-card service-card--featured reveal fade-up-delay-2">
              <div className="service-card-top">
                <div className="service-icon">&#129489;&#8205;&#128187;</div>
                <span className="service-badge">Ed-Tech</span>
              </div>
              <h3 className="service-title">Ed-Tech Services</h3>
              <p className="service-desc">Cutting-edge educational technology solutions that transform how institutions teach, assess and deliver learning at scale globally.</p>
              <ul className="service-checklist">
                <li>LMS design and deployment</li>
                <li>Interactive content development</li>
                <li>eLearning platform strategy</li>
              </ul>
              <Link href="/services#edtech" className="btn btn-primary btn-sm" style={{ marginTop: 'auto' }}>Explore Service</Link>
            </article>

            <article className="service-card service-card--featured reveal fade-up-delay-3">
              <div className="service-card-top">
                <div className="service-icon">&#128230;</div>
                <span className="service-badge service-badge--green">For Businesses</span>
              </div>
              <h3 className="service-title">Product Management</h3>
              <p className="service-desc">From ideation to market launch, we help you build, position and scale products that delight users and deliver measurable business results.</p>
              <ul className="service-checklist">
                <li>Product strategy and roadmapping</li>
                <li>User research and validation</li>
                <li>Go-to-market planning</li>
              </ul>
              <Link href="/services#product-management" className="btn btn-primary btn-sm" style={{ marginTop: 'auto' }}>Explore Service</Link>
            </article>

          </div>

          <div className="text-center" style={{ marginTop: '2.5rem' }}>
            <Link href="/services" className="btn btn-outline">View All Services</Link>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="section" aria-labelledby="stats-heading">
        <div className="container">
          <div className="text-center" style={{ marginBottom: 'var(--space-2xl)' }}>
            <span className="section-label">Our Impact</span>
            <h2 className="reveal" id="stats-heading">Numbers That Tell Our Story</h2>
          </div>
          <div className="stats-grid">
            <div className="stat-item reveal">
              <span className="stat-num" data-count="500" data-suffix="+">0+</span>
              <span className="stat-label">Projects Delivered</span>
            </div>
            <div className="stat-item reveal fade-up-delay-1">
              <span className="stat-num" data-count="200" data-suffix="+">0+</span>
              <span className="stat-label">Clients Served</span>
            </div>
            <div className="stat-item reveal fade-up-delay-2">
              <span className="stat-num" data-count="98" data-suffix="%">0%</span>
              <span className="stat-label">Client Satisfaction Rate</span>
            </div>
            <div className="stat-item reveal fade-up-delay-3">
              <span className="stat-num" data-count="7" data-suffix="+">0+</span>
              <span className="stat-label">Years of Excellence</span>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="testimonials" aria-labelledby="testimonials-heading">
        <div className="container">
          <div className="text-center">
            <span className="section-label">Client Testimonials</span>
            <h2 className="section-heading" id="testimonials-heading">What Our Clients Say</h2>
            <p className="section-sub" style={{ marginInline: 'auto' }}>Real words from real people who have experienced the Ryters Spot difference.</p>
          </div>

          <div className="testimonial-slider">
            <div className="testimonial-track" ref={trackRef}>

              <div className="testimonial-slide">
                <div className="testimonial-card">
                  <span className="testimonial-quote-icon">&ldquo;</span>
                  <div className="testimonial-stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
                  <p className="testimonial-text">Ryters Spot transformed how our organisation approaches digital transformation. Their roadmap was methodical, practically grounded and aligned perfectly with our strategic goals. We saw measurable results within the first quarter. Truly world-class expertise.</p>
                  <div className="testimonial-author">
                    <div className="testimonial-avatar">C</div>
                    <div>
                      <p className="testimonial-name">Verified Client</p>
                      <p className="testimonial-role">Chief Operations Officer, Financial Services</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="testimonial-slide">
                <div className="testimonial-card">
                  <span className="testimonial-quote-icon">&ldquo;</span>
                  <div className="testimonial-stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
                  <p className="testimonial-text">The academic research support I received was exceptional. My dissertation was completed to the highest standard, and my supervisor was very impressed with the quality of analysis and writing. I could not have done it without the Ryters Spot team.</p>
                  <div className="testimonial-author">
                    <div className="testimonial-avatar">C</div>
                    <div>
                      <p className="testimonial-name">Verified Client</p>
                      <p className="testimonial-role">PhD Candidate, UK University</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="testimonial-slide">
                <div className="testimonial-card">
                  <span className="testimonial-quote-icon">&ldquo;</span>
                  <div className="testimonial-stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
                  <p className="testimonial-text">We engaged Ryters Spot for a full digital transformation advisory project. Their approach was methodical, data-driven, and deeply customized to our industry context. The ROI has been remarkable and we highly recommend them to any enterprise looking to modernize.</p>
                  <div className="testimonial-author">
                    <div className="testimonial-avatar">C</div>
                    <div>
                      <p className="testimonial-name">Verified Client</p>
                      <p className="testimonial-role">Director of Strategy, Global Enterprise</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="testimonial-slide">
                <div className="testimonial-card">
                  <span className="testimonial-quote-icon">&ldquo;</span>
                  <div className="testimonial-stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
                  <p className="testimonial-text">Our institution partnered with Ryters Spot for Ed-Tech platform development and the results exceeded our expectations. Student engagement increased dramatically and the platform has become central to our digital learning strategy.</p>
                  <div className="testimonial-author">
                    <div className="testimonial-avatar">C</div>
                    <div>
                      <p className="testimonial-name">Verified Client</p>
                      <p className="testimonial-role">Dean of Academic Affairs, Private University</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            <div className="slider-controls">
              <button className="slider-btn slider-prev" aria-label="Previous testimonial">&#8592;</button>
              <div className="slider-dots">
                <button className="slider-dot active" aria-label="Testimonial 1"></button>
                <button className="slider-dot" aria-label="Testimonial 2"></button>
                <button className="slider-dot" aria-label="Testimonial 3"></button>
                <button className="slider-dot" aria-label="Testimonial 4"></button>
              </div>
              <button className="slider-btn slider-next" aria-label="Next testimonial">&#8594;</button>
            </div>
          </div>
        </div>
      </section>

      {/* BLOG PREVIEW */}
      <section className="section section-alt" aria-labelledby="blog-heading">
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '0.5rem' }}>
            <div>
              <span className="section-label">Thought Leadership</span>
              <h2 className="reveal" id="blog-heading">Latest Insights</h2>
            </div>
            <Link href="/blog" className="btn btn-outline btn-sm reveal">View All Articles</Link>
          </div>

          <div className="blog-grid">

            <article className="blog-card reveal">
              <Link href="/blog" className="blog-card-img-link" aria-hidden="true" tabIndex={-1}>
                <div className="blog-card-img blog-card-img--transform">
                  <span className="blog-card-img-label">Digital Transformation</span>
                </div>
              </Link>
              <div className="blog-card-body">
                <span className="blog-tag">Digital Transformation</span>
                <h3 className="blog-title"><Link href="/blog">How Nigerian Enterprises Are Winning with Digital Transformation in 2025</Link></h3>
                <p className="blog-excerpt">A deep-dive into the strategies driving digital adoption across banking, telecoms, and manufacturing in Nigeria's rapidly evolving market.</p>
                <div className="blog-meta">
                  <span>Ryters Spot Editorial</span>
                  <span className="blog-meta-dot"></span>
                  <span>8 min read</span>
                </div>
              </div>
            </article>

            <article className="blog-card reveal fade-up-delay-1">
              <Link href="/blog" className="blog-card-img-link" aria-hidden="true" tabIndex={-1}>
                <div className="blog-card-img blog-card-img--academic">
                  <span className="blog-card-img-label">Academic Writing</span>
                </div>
              </Link>
              <div className="blog-card-body">
                <span className="blog-tag">Academic Writing</span>
                <h3 className="blog-title"><Link href="/blog">The PhD Student's Complete Guide to Research Integrity in Africa</Link></h3>
                <p className="blog-excerpt">Essential principles, practical frameworks, and common pitfalls to avoid in your doctoral research journey.</p>
                <div className="blog-meta">
                  <span>Dr. A. Nwosu</span>
                  <span className="blog-meta-dot"></span>
                  <span>12 min read</span>
                </div>
              </div>
            </article>

            <article className="blog-card reveal fade-up-delay-2">
              <Link href="/blog" className="blog-card-img-link" aria-hidden="true" tabIndex={-1}>
                <div className="blog-card-img blog-card-img--content">
                  <span className="blog-card-img-label">Content Strategy</span>
                </div>
              </Link>
              <div className="blog-card-body">
                <span className="blog-tag">Content Strategy</span>
                <h3 className="blog-title"><Link href="/blog">Building a Content Strategy that Converts: Lessons from Top Nigerian Brands</Link></h3>
                <p className="blog-excerpt">What separates content that drives results from content that sits unread? We break down the frameworks behind Nigeria's most effective content programs.</p>
                <div className="blog-meta">
                  <span>Ryters Spot Editorial</span>
                  <span className="blog-meta-dot"></span>
                  <span>6 min read</span>
                </div>
              </div>
            </article>

          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="cta-banner" aria-label="Call to action">
        <div className="container">
          <h2 className="reveal">Ready to Elevate Your Writing &amp; Strategy?</h2>
          <p className="reveal">Whether you need a ghostwriter, an academic consultant, a training partner or a full digital transformation team, Ryters Spot is ready.</p>
          <div className="cta-banner-btns reveal">
            <Link href="/contact" className="btn btn-accent btn-lg">Get a Free Consultation</Link>
            <Link href="/services" className="btn btn-white btn-lg">Browse Services</Link>
          </div>
        </div>
      </section>
    </>
  )
}
