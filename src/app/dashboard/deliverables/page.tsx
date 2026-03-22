import Link from 'next/link'

export default function DeliverablesPage() {
  return (
    <>
      <style>{`
        .placeholder-page { text-align: center; padding: 4rem 2rem; }
        .placeholder-icon { font-size: 4rem; margin-bottom: 1.25rem; }
        .placeholder-page h2 { font-family: var(--font-serif); font-size: 1.5rem; color: var(--clr-text); margin-bottom: 0.5rem; }
        .placeholder-page p { color: var(--clr-text-muted); font-size: 0.95rem; margin-bottom: 1.5rem; max-width: 40ch; margin-inline: auto; }
      `}</style>
      <div className="placeholder-page">
        <div className="placeholder-icon">&#8681;</div>
        <h2>Deliverables</h2>
        <p>Your completed deliverables will appear here. Download documents, reports and files securely from the portal.</p>
        <Link href="/dashboard/request" className="btn btn-primary">Request a Service</Link>
      </div>
    </>
  )
}
