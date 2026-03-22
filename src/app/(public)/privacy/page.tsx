import Link from 'next/link'

export default function PrivacyPage() {
  return (
    <>
      <header className="page-hero">
        <div className="container">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span className="breadcrumb-sep">&#8250;</span>
            <span>Privacy Policy</span>
          </nav>
          <h1>Privacy Policy</h1>
          <p>How Ryters Spot collects, uses and protects your personal information.</p>
        </div>
      </header>

      <div className="container">
        <div className="legal-body">

          <p className="legal-last-updated">Last updated: 21 March 2026</p>

          <div className="legal-toc">
            <h4>Contents</h4>
            <ol>
              <li><a href="#who-we-are">Who We Are</a></li>
              <li><a href="#data-we-collect">Data We Collect</a></li>
              <li><a href="#how-we-use">How We Use Your Data</a></li>
              <li><a href="#legal-basis">Legal Basis for Processing</a></li>
              <li><a href="#sharing">Sharing Your Data</a></li>
              <li><a href="#retention">Data Retention</a></li>
              <li><a href="#your-rights">Your Rights</a></li>
              <li><a href="#cookies">Cookies</a></li>
              <li><a href="#international">International Transfers</a></li>
              <li><a href="#security">Security</a></li>
              <li><a href="#changes">Changes to This Policy</a></li>
              <li><a href="#contact-us">Contact Us</a></li>
            </ol>
          </div>

          <h2 id="who-we-are">1. Who We Are</h2>
          <p>Ryters Spot Limited ("Ryters Spot", "we", "us" or "our") is a writing, research and advisory firm registered in Nigeria. We operate globally, serving clients across Europe, North America and beyond. Our registered address is Abuja, Nigeria.</p>
          <p>We are the data controller for personal information collected through this website and in connection with our services. You can contact us at <a href="mailto:hello@ryters-spot.com">hello@ryters-spot.com</a>.</p>

          <h2 id="data-we-collect">2. Data We Collect</h2>
          <h3>Information you provide directly</h3>
          <ul>
            <li>Name, email address and phone number when you contact us or submit an enquiry</li>
            <li>Organisation or institution name where relevant</li>
            <li>Project details, requirements and any content you share with us</li>
            <li>Payment information processed through secure third-party payment processors</li>
            <li>Email address if you subscribe to our newsletter</li>
          </ul>
          <h3>Information collected automatically</h3>
          <ul>
            <li>Browser type, device type and operating system</li>
            <li>Pages visited, time spent on pages and referral source</li>
            <li>IP address and approximate geographic location</li>
            <li>Cookies and similar tracking technologies (see Section 8)</li>
          </ul>

          <h2 id="how-we-use">3. How We Use Your Data</h2>
          <p>We use your personal information to:</p>
          <ul>
            <li>Respond to your enquiries and provide our services</li>
            <li>Manage our client relationships and deliver projects</li>
            <li>Send our newsletter and marketing communications where you have consented</li>
            <li>Improve our website and services</li>
            <li>Comply with legal and regulatory obligations</li>
            <li>Detect and prevent fraud or abuse</li>
          </ul>

          <h2 id="legal-basis">4. Legal Basis for Processing</h2>
          <p>For clients and prospective clients in the European Economic Area (EEA) and the United Kingdom, we process your personal data on the following legal bases:</p>
          <ul>
            <li><strong>Contract:</strong> Where processing is necessary to fulfil a contract with you or to take steps before entering into a contract</li>
            <li><strong>Legitimate interests:</strong> Where we have a legitimate business interest, such as responding to enquiries and improving our services</li>
            <li><strong>Consent:</strong> Where you have given explicit consent, such as for newsletter subscriptions</li>
            <li><strong>Legal obligation:</strong> Where we are required to process data to comply with applicable law</li>
          </ul>

          <h2 id="sharing">5. Sharing Your Data</h2>
          <p>We do not sell your personal data. We may share your information with:</p>
          <ul>
            <li><strong>Service providers:</strong> Third-party tools used to operate our business (email platforms, form processors, analytics tools), all bound by data processing agreements</li>
            <li><strong>Professional advisors:</strong> Legal, accounting or compliance advisors where required</li>
            <li><strong>Authorities:</strong> Regulatory or law enforcement authorities where required by law</li>
          </ul>
          <p>All project content and client information shared with us in connection with service delivery is treated as strictly confidential and is never disclosed to third parties outside the direct project team.</p>

          <h2 id="retention">6. Data Retention</h2>
          <p>We retain personal data only for as long as necessary to fulfil the purposes for which it was collected, or as required by applicable law. In practice:</p>
          <ul>
            <li>Enquiry and contact data is retained for up to 3 years</li>
            <li>Client project data is retained for up to 7 years for contractual and accounting purposes</li>
            <li>Newsletter subscriber data is retained until you unsubscribe</li>
          </ul>

          <h2 id="your-rights">7. Your Rights</h2>
          <p>Depending on your location, you may have the following rights regarding your personal data:</p>
          <ul>
            <li><strong>Right of access:</strong> Request a copy of the personal data we hold about you</li>
            <li><strong>Right to rectification:</strong> Request correction of inaccurate or incomplete data</li>
            <li><strong>Right to erasure:</strong> Request deletion of your personal data in certain circumstances</li>
            <li><strong>Right to restriction:</strong> Request that we restrict processing of your data</li>
            <li><strong>Right to portability:</strong> Receive your data in a structured, machine-readable format</li>
            <li><strong>Right to object:</strong> Object to processing based on legitimate interests or for direct marketing</li>
            <li><strong>Right to withdraw consent:</strong> Withdraw consent at any time where processing is based on consent</li>
          </ul>
          <p>To exercise any of these rights, please contact us at <a href="mailto:hello@ryters-spot.com">hello@ryters-spot.com</a>. We will respond within 30 days.</p>

          <h2 id="cookies">8. Cookies</h2>
          <p>We use cookies and similar technologies to operate our website and understand how visitors use it. These include:</p>
          <ul>
            <li><strong>Essential cookies:</strong> Required for the website to function (such as your theme preference)</li>
            <li><strong>Analytics cookies:</strong> Help us understand visitor behaviour and improve the site</li>
          </ul>
          <p>You can control cookies through your browser settings. Disabling cookies may affect certain website functionality.</p>

          <h2 id="international">9. International Transfers</h2>
          <p>Our servers and service providers may process data in countries outside your own, including Nigeria, the European Economic Area and the United States. Where data is transferred outside the EEA or UK, we ensure appropriate safeguards are in place in accordance with applicable data protection law.</p>

          <h2 id="security">10. Security</h2>
          <p>We implement appropriate technical and organisational measures to protect your personal data against unauthorised access, loss or disclosure. All sensitive communications are encrypted in transit. However, no method of transmission over the internet is entirely secure and we cannot guarantee absolute security.</p>

          <h2 id="changes">11. Changes to This Policy</h2>
          <p>We may update this Privacy Policy from time to time. When we do, we will update the "last updated" date at the top of this page. We encourage you to review this policy periodically.</p>

          <h2 id="contact-us">12. Contact Us</h2>
          <p>If you have any questions, concerns or requests regarding this Privacy Policy or our data practices, please contact us:</p>
          <ul>
            <li>Email: <a href="mailto:hello@ryters-spot.com">hello@ryters-spot.com</a></li>
            <li>Phone: <a href="tel:+2347062057116">+234 706 205 7116</a></li>
            <li>Address: Abuja, Nigeria</li>
          </ul>

        </div>
      </div>

      <style>{`
        .legal-body { max-width: 720px; margin-inline: auto; padding: var(--space-4xl) 0; }
        .legal-body h2 { font-size: 1.25rem; margin-top: var(--space-2xl); margin-bottom: var(--space-md); color: var(--clr-primary); }
        .legal-body h3 { font-size: 1rem; font-weight: 700; margin-top: var(--space-lg); margin-bottom: var(--space-sm); }
        .legal-body p, .legal-body li { font-size: 0.9375rem; line-height: 1.75; color: var(--clr-text-muted); margin-bottom: var(--space-md); }
        .legal-body ul { padding-left: 1.5rem; margin-bottom: var(--space-md); }
        .legal-body ul li { list-style: disc; margin-bottom: 0.4rem; }
        .legal-last-updated { font-size: 0.82rem; color: var(--clr-text-subtle); margin-bottom: var(--space-2xl); }
        .legal-toc { background: var(--clr-surface-2); border-left: 3px solid var(--clr-primary-light); border-radius: 0 var(--radius-md) var(--radius-md) 0; padding: var(--space-lg); margin-bottom: var(--space-2xl); }
        .legal-toc h4 { font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.06em; color: var(--clr-text-subtle); margin-bottom: var(--space-sm); }
        .legal-toc ol { padding-left: 1.2rem; margin: 0; }
        .legal-toc li { list-style: decimal; font-size: 0.875rem; margin-bottom: 4px; }
        .legal-toc a { color: var(--clr-primary-light); text-decoration: none; }
        .legal-toc a:hover { text-decoration: underline; }
      `}</style>
    </>
  )
}
