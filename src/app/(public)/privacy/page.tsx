import Link from 'next/link'

export default function PrivacyPage() {
  return (
    <>
      <header className="page-hero liquid-page-hero">
        <div className="container">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span className="breadcrumb-sep">/</span>
            <span>Privacy</span>
          </nav>
          <p className="rpd-kicker">Privacy Policy</p>
          <h1>How we protect personal and project information.</h1>
          <p>Last updated: 29 July 2026</p>
        </div>
      </header>

      <div className="container">
        <article className="legal-body liquid-glass">
          <h2>1. Who We Are</h2>
          <p>Ryters Spot Limited is a Research and Product Development company registered in Nigeria. We operate globally and support clients across Africa, Europe, North America and beyond.</p>
          <p>We are the data controller for personal information collected through this website and in connection with our work. You can contact us at <a href="mailto:hello@theryters.com">hello@theryters.com</a>.</p>

          <h2>2. Data We Collect</h2>
          <ul>
            <li>Name, email address and phone number when you contact us or submit an enquiry.</li>
            <li>Organisation name, role and project context where relevant.</li>
            <li>Research materials, product information, documents or files you choose to share with us.</li>
            <li>Payment information processed through secure third-party payment processors.</li>
            <li>Basic website analytics such as browser, device, pages visited and referral source.</li>
          </ul>

          <h2>3. How We Use Data</h2>
          <p>We use personal information to respond to enquiries, scope and deliver engagements, communicate with clients, operate the client portal, improve our website, send opted-in updates and meet legal or accounting obligations.</p>

          <h2>4. Confidential Project Material</h2>
          <p>Research materials, product ideas, briefs, manuscripts, internal documents and project files shared with us are treated as confidential. We do not publish, sell or disclose client project material outside the team required to complete the work, unless required by law or expressly agreed in writing.</p>

          <h2>5. Sharing Data</h2>
          <p>We may use trusted service providers for email, hosting, analytics, payment processing, file storage and business operations. These providers only receive information needed to perform their function.</p>

          <h2>6. Retention</h2>
          <p>We retain enquiry and client records for as long as necessary to provide services, maintain business records, resolve disputes and comply with law. Newsletter data is retained until you unsubscribe.</p>

          <h2>7. Your Rights</h2>
          <p>Depending on your location, you may request access, correction, deletion, restriction, portability or objection to certain processing. Contact <a href="mailto:hello@theryters.com">hello@theryters.com</a> to make a request.</p>

          <h2>8. Cookies</h2>
          <p>We use essential cookies for website functionality and may use analytics cookies to understand site performance. You can control cookies through your browser settings.</p>

          <h2>9. Contact</h2>
          <p>Email: <a href="mailto:hello@theryters.com">hello@theryters.com</a></p>
          <p>Phone: <a href="tel:+2347062057116">+234 706 205 7116</a></p>
        </article>
      </div>
    </>
  )
}
