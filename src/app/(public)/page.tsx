import Link from 'next/link'

const pillars = [
  {
    id: 'research-intelligence',
    label: 'Research Intelligence',
    title: 'Evidence before execution.',
    text: 'Market research, user research, literature reviews, insight reports and decision briefs that turn uncertainty into usable direction.',
  },
  {
    id: 'product-development',
    label: 'Product Development',
    title: 'Products shaped from clear thinking.',
    text: 'Product discovery, requirements, prototypes, roadmaps and build coordination for founders, operators and institutions.',
  },
  {
    id: 'knowledge-systems',
    label: 'Knowledge Systems',
    title: 'Documents, platforms and systems that scale expertise.',
    text: 'Research documentation, learning products, product manuals, content systems and AI-enabled workflows for teams that need repeatable quality.',
  },
]

const proof = [
  ['500+', 'research, writing and product engagements delivered'],
  ['18+', 'countries reached across Africa, Europe and North America'],
  ['24h', 'response window for serious project enquiries'],
]

const insightCards = [
  {
    title: 'Research before product decisions',
    text: 'How better context, evidence and decision briefs reduce expensive product mistakes.',
  },
  {
    title: 'Turning expertise into systems',
    text: 'A practical view of knowledge products, documentation and repeatable delivery assets.',
  },
  {
    title: 'From idea to usable roadmap',
    text: 'The R&PD method for moving from scattered ambition to scoped product direction.',
  },
]

export default function HomePage() {
  return (
    <>
      <section className="liquid-hero">
        <div className="liquid-field" aria-hidden="true" />
        <div className="container liquid-hero-grid">
          <div className="liquid-hero-copy">
            <p className="rpd-kicker">Research and Product Development Company</p>
            <h1>We turn research into products, systems and serious deliverables.</h1>
            <p className="liquid-lede">
              Ryters Spot is an R&amp;PD company helping founders, professionals and organisations investigate ideas, shape products, build knowledge assets and move from concept to execution with clarity.
            </p>
            <div className="liquid-actions">
              <Link href="/contact" className="btn btn-accent btn-lg">Start an R&amp;PD project</Link>
              <Link href="/services" className="btn btn-liquid btn-lg">Explore capabilities</Link>
            </div>
          </div>

          <aside className="liquid-glass hero-lab" aria-label="Ryters Spot operating model">
            <div className="lab-mark">R&amp;PD</div>
            <p className="lab-label">Operating model</p>
            <h2>Research-led. Product-minded. Delivery-focused.</h2>
            <div className="lab-proof">
              {proof.map(([value, label]) => (
                <div key={value}>
                  <strong>{value}</strong>
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-intro">
            <p className="rpd-kicker">What We Build</p>
            <h2>One company for the work between insight and launch.</h2>
            <p>Most important work does not fit neatly into one box. We connect research, writing, product thinking and delivery so your ideas can become usable assets.</p>
          </div>
          <div className="pillar-grid">
            {pillars.map((pillar, index) => (
              <article className="liquid-glass pillar-card" key={pillar.id}>
                <span>0{index + 1}</span>
                <p className="rpd-kicker">{pillar.label}</p>
                <h3>{pillar.title}</h3>
                <p>{pillar.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-deep">
        <div className="container split-section">
          <div>
            <p className="rpd-kicker">How We Work</p>
            <h2>Fluid enough for early ideas. Structured enough for serious delivery.</h2>
          </div>
          <div className="method-stack">
            {[
              ['01', 'Investigate', 'We gather the research, context, users, market realities and constraints behind the work.'],
              ['02', 'Shape', 'We define the product, document, system or strategy with clear requirements and decision logic.'],
              ['03', 'Develop', 'We produce the assets, coordinate delivery and refine the output until it is ready to use.'],
            ].map(([num, title, text]) => (
              <div className="method-row" key={num}>
                <span>{num}</span>
                <div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container liquid-cta">
          <p className="rpd-kicker">Begin</p>
          <h2>Bring the idea, product or research problem. We will help shape the next move.</h2>
          <p>Share the outcome you want, the deadline you are working with and what already exists. We will respond with a sensible route forward.</p>
          <Link href="/contact" className="btn btn-accent btn-lg">Talk to Ryters Spot</Link>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <div className="blog-heading-row insight-preview-head">
            <div>
              <p className="rpd-kicker">Insights</p>
              <h2>Thinking from the R&amp;PD floor.</h2>
            </div>
            <Link href="/blog" className="btn btn-liquid btn-sm">Visit insights</Link>
          </div>
          <div className="insight-preview-grid">
            {insightCards.map((card) => (
              <Link href="/blog" className="liquid-glass insight-preview-card" key={card.title}>
                <span>R&amp;PD Notes</span>
                <h3>{card.title}</h3>
                <p>{card.text}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
