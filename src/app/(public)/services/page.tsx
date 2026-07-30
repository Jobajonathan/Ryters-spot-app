import Link from 'next/link'

const services = [
  {
    id: 'research-intelligence',
    title: 'Research Intelligence',
    text: 'For founders, teams and institutions that need evidence before committing money, time or reputation.',
    items: ['Market and competitor research', 'User interviews and synthesis', 'Academic and literature reviews', 'Policy, sector and trend reports', 'Decision briefs and insight decks'],
  },
  {
    id: 'product-development',
    title: 'Product Development',
    text: 'For teams moving from an idea or broken workflow into a product, feature, platform or operational system.',
    items: ['Product discovery and requirements', 'Roadmaps and MVP definition', 'Prototype and workflow planning', 'Launch documentation', 'Product/project delivery coordination'],
  },
  {
    id: 'knowledge-systems',
    title: 'Knowledge Products and Systems',
    text: 'For organisations that need their expertise turned into structured assets that can be taught, sold, scaled or operated.',
    items: ['Research documentation', 'Learning products and curricula', 'Reports, manuals and playbooks', 'AI-assisted workflow design', 'Content and knowledge operations'],
  },
]

export default function ServicesPage() {
  return (
    <>
      <header className="page-hero liquid-page-hero">
        <div className="container">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span className="breadcrumb-sep">/</span>
            <span>Capabilities</span>
          </nav>
          <p className="rpd-kicker">Capabilities</p>
          <h1>R&amp;PD services for teams turning ideas into assets.</h1>
          <p>We organise the work into three capability areas so clients can hire us by outcome, not by a confusing list of activities.</p>
        </div>
      </header>

      <section className="section">
        <div className="container service-stack">
          {services.map((service, index) => (
            <article className="service-suite liquid-glass" id={service.id} key={service.id}>
              <div>
                <p className="rpd-kicker">Capability 0{index + 1}</p>
                <h2>{service.title}</h2>
                <p>{service.text}</p>
              </div>
              <div>
                <h3>Typical outputs</h3>
                <ul className="liquid-list">
                  {service.items.map((item) => <li key={item}>{item}</li>)}
                </ul>
                <Link href="/contact" className="btn btn-primary">Discuss this capability</Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section section-deep">
        <div className="container liquid-cta liquid-cta-dark">
          <p className="rpd-kicker">Not Sure Where It Fits?</p>
          <h2>Most R&amp;PD work crosses categories. That is normal.</h2>
          <p>Send the context and we will shape the engagement around the result you need.</p>
          <Link href="/contact" className="btn btn-accent btn-lg">Start a project enquiry</Link>
        </div>
      </section>
    </>
  )
}
