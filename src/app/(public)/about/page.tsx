import Link from 'next/link'

const principles = [
  ['Evidence', 'We begin with context, research and the uncomfortable questions that make products and documents stronger.'],
  ['Clarity', 'We turn scattered ideas into structured requirements, narratives, roadmaps and deliverables.'],
  ['Discretion', 'We protect client work, client identity and project context as a default operating standard.'],
  ['Delivery', 'We care about the finished asset: the report, prototype, roadmap, system, document or launch plan people can actually use.'],
]

export default function AboutPage() {
  return (
    <>
      <header className="page-hero liquid-page-hero">
        <div className="container">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span className="breadcrumb-sep">/</span>
            <span>About</span>
          </nav>
          <p className="rpd-kicker">About Ryters Spot</p>
          <h1>An R&amp;PD company built for thoughtful execution.</h1>
          <p>Ryters Spot sits at the intersection of research, writing, product thinking and delivery.</p>
        </div>
      </header>

      <section className="section">
        <div className="container split-section">
          <div>
            <p className="rpd-kicker">Why We Exist</p>
            <h2>Important ideas often fail between research and execution.</h2>
          </div>
          <div className="editorial-copy">
            <p>Ryters Spot was created for that gap. We help clients understand the problem, shape the asset and develop the materials required to move forward with confidence.</p>
            <p>Our work can look like a research report, a product roadmap, a knowledge product, a learning system, a technical brief, a launch document or a full project delivery structure. The common thread is the same: clear thinking made usable.</p>
            <p>We work quietly, with strong documentation, careful project handling and a preference for substance over performance.</p>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <div className="section-intro">
            <p className="rpd-kicker">Operating Principles</p>
            <h2>The standard behind the work.</h2>
          </div>
          <div className="principles-panel liquid-glass">
            {principles.map(([title, text]) => (
              <article className="principle-item" key={title}>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container liquid-cta">
          <p className="rpd-kicker">Work With Us</p>
          <h2>If the work needs research, structure and development, it belongs here.</h2>
          <Link href="/contact" className="btn btn-accent btn-lg">Start the conversation</Link>
        </div>
      </section>
    </>
  )
}
