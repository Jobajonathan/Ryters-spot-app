import Link from 'next/link'

export default function TermsPage() {
  return (
    <>
      <header className="page-hero liquid-page-hero">
        <div className="container">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span className="breadcrumb-sep">/</span>
            <span>Terms</span>
          </nav>
          <p className="rpd-kicker">Terms of Service</p>
          <h1>The working terms for Ryters Spot engagements.</h1>
          <p>Last updated: 29 July 2026</p>
        </div>
      </header>

      <div className="container">
        <article className="legal-body liquid-glass">
          <h2>1. Acceptance</h2>
          <p>These Terms govern use of the Ryters Spot website and any Research and Product Development engagement agreed with Ryters Spot Limited. By using the website or commissioning work from us, you agree to these Terms.</p>

          <h2>2. Our Work</h2>
          <p>Ryters Spot provides R&amp;PD services across research intelligence, product development, knowledge products, learning products, documentation, automation workflows and related delivery support. Specific scope, deliverables, timelines and fees are defined in a written proposal or statement of work.</p>

          <h2>3. Engagements</h2>
          <p>Work begins after written confirmation of scope and receipt of any agreed deposit. Scope changes must be agreed in writing and may affect fees or timelines.</p>

          <h2>4. Payment</h2>
          <p>A deposit may be required before work begins. Balance payments are due according to the relevant proposal or invoice. We may pause work where payment is overdue.</p>

          <h2>5. Intellectual Property</h2>
          <p>After full payment, client-specific deliverables created for the engagement are assigned to the client unless otherwise stated in the proposal. Ryters Spot retains ownership of pre-existing frameworks, templates, methods, tools and background materials.</p>

          <h2>6. Confidentiality</h2>
          <p>We treat client information, product ideas, research material, project files and communications as confidential. We will not publicly reference client work or relationships without permission.</p>

          <h2>7. Client Responsibilities</h2>
          <p>Clients are responsible for providing accurate information, timely feedback, required materials and lawful authority to use any content supplied to us.</p>

          <h2>8. Warranties</h2>
          <p>We deliver work with reasonable skill and care. We do not guarantee a particular commercial, academic, regulatory, investment or market outcome because many factors sit outside our control.</p>

          <h2>9. Liability</h2>
          <p>To the maximum extent permitted by law, Ryters Spot's total liability for a claim related to an engagement is limited to the fees paid for that specific engagement.</p>

          <h2>10. Governing Law</h2>
          <p>These Terms are governed by the laws of the Federal Republic of Nigeria, unless a different governing law is agreed in a project agreement.</p>

          <h2>11. Contact</h2>
          <p>Email: <a href="mailto:hello@theryters.com">hello@theryters.com</a></p>
          <p>Phone: <a href="tel:+2347062057116">+234 706 205 7116</a></p>
        </article>
      </div>
    </>
  )
}
