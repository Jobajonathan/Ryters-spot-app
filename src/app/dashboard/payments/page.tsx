export default function PaymentsPage() {
  return (
    <>
      <style>{`
        .placeholder-page { text-align: center; padding: 4rem 2rem; }
        .placeholder-icon { font-size: 4rem; margin-bottom: 1.25rem; }
        .placeholder-page h2 { font-family: var(--font-serif); font-size: 1.5rem; color: var(--clr-text); margin-bottom: 0.5rem; }
        .placeholder-page p { color: var(--clr-text-muted); font-size: 0.95rem; margin-bottom: 1.5rem; max-width: 40ch; margin-inline: auto; }
      `}</style>
      <div className="placeholder-page">
        <div className="placeholder-icon">&#128179;</div>
        <h2>Payments</h2>
        <p>Your payment history, invoices and receipts will appear here. Full payment integration is coming in Phase 2.</p>
      </div>
    </>
  )
}
