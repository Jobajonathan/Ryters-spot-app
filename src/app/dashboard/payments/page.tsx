'use client'

import { useEffect, useState } from 'react'

type Payment = {
  id: string
  payment_type: 'deposit' | 'balance'
  amount: number
  currency: string
  tx_ref: string
  flw_ref: string | null
  status: 'pending' | 'successful' | 'failed'
  created_at: string
  paid_at: string | null
  projects: { title: string; service: string } | null
}

function fmtDate(iso: string | null) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function fmtAmount(amount: number, currency: string) {
  const symbols: Record<string, string> = { NGN: '₦', GBP: '£', EUR: '€', USD: '$' }
  return `${symbols[currency] || currency + ' '}${amount.toLocaleString()}`
}

const STATUS_STYLE: Record<string, { bg: string; color: string }> = {
  successful: { bg: '#d1fae5', color: '#065f46' },
  pending:    { bg: '#fef3c7', color: '#92400e' },
  failed:     { bg: '#fee2e2', color: '#991b1b' },
}

export default function DashboardPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/payments')
      .then(r => r.json())
      .then(data => { setPayments(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const successCount = payments.filter(p => p.status === 'successful').length
  const totalPaid = payments
    .filter(p => p.status === 'successful')
    .reduce((sum, p) => {
      const rate = p.currency === 'NGN' ? 1 : p.currency === 'GBP' ? 1900 : p.currency === 'EUR' ? 1650 : 1500
      return sum + p.amount * rate
    }, 0)

  return (
    <>
      <style>{`
        .pay-kpis { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 2rem; }
        .pay-kpi { background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 1.25rem 1.5rem; }
        .pay-kpi-label { font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.07em; color: #9ca3af; margin-bottom: 0.4rem; }
        .pay-kpi-value { font-size: 1.6rem; font-weight: 700; color: #111827; font-family: Georgia, serif; line-height: 1; }
        .pay-kpi-sub { font-size: 0.72rem; color: #9ca3af; margin-top: 4px; }
        .pay-table { width: 100%; border-collapse: collapse; background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; font-size: 0.82rem; }
        .pay-table th { background: #f9fafb; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.07em; color: #9ca3af; padding: 0.85rem 1rem; text-align: left; border-bottom: 1px solid #e5e7eb; white-space: nowrap; }
        .pay-table td { padding: 0.9rem 1rem; border-bottom: 1px solid #f9fafb; vertical-align: middle; }
        .pay-table tr:last-child td { border-bottom: none; }
        .pay-badge { display: inline-block; font-size: 0.7rem; font-weight: 700; padding: 3px 10px; border-radius: 100px; text-transform: capitalize; }
        .pay-type { display: inline-block; font-size: 0.7rem; font-weight: 700; padding: 2px 8px; border-radius: 100px; background: rgba(27,67,50,0.08); color: #1B4332; text-transform: capitalize; }
        @media (max-width: 600px) { .pay-kpis { grid-template-columns: 1fr; } }
      `}</style>

      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '1.5rem', fontWeight: 700, color: '#111827', margin: '0 0 0.25rem' }}>Payments</h1>
        <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0 }}>Your payment history and transaction records.</p>
      </div>

      <div className="pay-kpis">
        <div className="pay-kpi">
          <div className="pay-kpi-label">Total Paid</div>
          <div className="pay-kpi-value">₦{Math.round(totalPaid).toLocaleString()}</div>
          <div className="pay-kpi-sub">NGN equivalent</div>
        </div>
        <div className="pay-kpi">
          <div className="pay-kpi-label">Transactions</div>
          <div className="pay-kpi-value">{successCount}</div>
          <div className="pay-kpi-sub">successful payments</div>
        </div>
        <div className="pay-kpi">
          <div className="pay-kpi-label">Total Records</div>
          <div className="pay-kpi-value">{payments.length}</div>
          <div className="pay-kpi-sub">all time</div>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af' }}>Loading payments...</div>
      ) : payments.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb', color: '#9ca3af' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>💳</div>
          <p style={{ fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>No payments yet</p>
          <p style={{ fontSize: '0.875rem' }}>Your payment history will appear here once you make your first payment.</p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table className="pay-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Project</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Reference</th>
                <th>Paid At</th>
              </tr>
            </thead>
            <tbody>
              {payments.map(p => {
                const st = STATUS_STYLE[p.status] || STATUS_STYLE.pending
                return (
                  <tr key={p.id}>
                    <td style={{ color: '#6b7280', whiteSpace: 'nowrap' }}>{fmtDate(p.created_at)}</td>
                    <td style={{ fontWeight: 500, color: '#374151', maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {p.projects?.title || '—'}
                    </td>
                    <td><span className="pay-type">{p.payment_type}</span></td>
                    <td style={{ fontWeight: 700, color: '#111827', whiteSpace: 'nowrap' }}>{fmtAmount(p.amount, p.currency)}</td>
                    <td><span className="pay-badge" style={{ background: st.bg, color: st.color }}>{p.status}</span></td>
                    <td style={{ fontSize: '0.72rem', color: '#6b7280', fontFamily: 'monospace' }}>{p.tx_ref.split('-').pop() || '—'}</td>
                    <td style={{ color: '#6b7280', whiteSpace: 'nowrap' }}>{fmtDate(p.paid_at)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}
