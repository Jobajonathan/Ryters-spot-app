import Link from 'next/link'

const paths = [
  ['Research Intelligence', 'Validate an idea, understand a market, analyse users or produce a research-backed decision asset.'],
  ['Product Development', 'Shape a product, workflow, platform or launch plan from discovery through build coordination.'],
  ['Knowledge Systems', 'Turn expertise into playbooks, learning products, documentation, reports or repeatable content systems.'],
]

export default function GetStartedPage() {
  return (
    <>
      <header className="page-hero liquid-page-hero">
        <div className="container">
          <p className="rpd-kicker">Get Started</p>
          <h1>Choose the kind of R&amp;PD support you need.</h1>
          <p>You can create a client portal account, or send a project enquiry first if the shape of the work is still forming.</p>
        </div>
      </header>

      <section className="section">
        <div className="container pillar-grid">
          {paths.map(([title, text], index) => (
            <Link href="/contact" className="liquid-glass pillar-card" key={title}>
              <span>0{index + 1}</span>
              <h3>{title}</h3>
              <p>{text}</p>
              <strong>Start enquiry</strong>
            </Link>
          ))}
        </div>
      </section>

      <section className="section section-deep">
        <div className="container liquid-cta liquid-cta-dark">
          <p className="rpd-kicker">Client Portal</p>
          <h2>Prefer to submit and track work through the portal?</h2>
          <p>Create an account to request work, send files, follow project progress and receive deliverables.</p>
          <div className="liquid-actions center">
            <Link href="/signup" className="btn btn-accent btn-lg">Create free account</Link>
            <Link href="/login" className="btn btn-liquid btn-lg">Log in</Link>
          </div>
        </div>
      </section>
    </>
  )
}
