'use client'

import { useEffect, useState, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

type Project = {
  id: string
  service: string
  title: string
  description: string
  deadline: string | null
  urgency: string
  budget_range: string | null
  status: string
  created_at: string
  admin_notes: string | null
  payment_instructions: string | null
  deposit_amount: number | null
  balance_amount: number | null
  work_started_at: string | null
  expected_delivery_at: string | null
  deliverable_signed?: string
  ai_report_signed?: string
}

const SERVICE_LABELS: Record<string, string> = {
  research_academic: 'Research and Academic Enquiry',
  digital_transformation: 'Digital Transformation and Automation',
  edtech: 'Ed-Tech Services',
  product_management: 'Product Management',
  writing: 'Writing',
  dissertation: 'Dissertation',
  ai_automation: 'AI Automation',
}

const STATUS_CONFIG: Record<string, { bg: string; color: string; label: string; step: number }> = {
  pending:         { bg: '#fef3c7', color: '#92400e', label: 'Pending Review', step: 0 },
  in_review:       { bg: '#dbeafe', color: '#1e40af', label: 'Under Review',   step: 1 },
  accepted:        { bg: '#fef9c3', color: '#854d0e', label: 'Awaiting Deposit', step: 2 },
  in_progress:     { bg: '#d1fae5', color: '#065f46', label: 'In Progress',    step: 3 },
  pending_balance: { bg: '#ede9fe', color: '#5b21b6', label: 'Balance Due',    step: 4 },
  completed:       { bg: '#f0fdf4', color: '#166534', label: 'Delivered',      step: 5 },
  cancelled:       { bg: '#fee2e2', color: '#991b1b', label: 'Cancelled',      step: -1 },
}

const STEPS = ['Submitted', 'Under Review', 'Accepted', 'In Progress', 'Balance Due', 'Delivered']

function fmtDate(iso: string | null) {
  if (!iso) return null
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}

function fmtAmount(n: number | null) {
  if (!n) return '—'
  return n.toLocaleString('en-GB', { minimumFractionDigits: 0 })
}

function ProjectCard({ project }: { project: Project }) {
  const cfg = STATUS_CONFIG[project.status] || STATUS_CONFIG.pending
  const currentStep = cfg.step
  const isCancelled = project.status === 'cancelled'

  return (
    <div style={{ background: 'var(--clr-surface)', border: '1px solid var(--clr-border)', borderRadius: 'var(--radius-lg)', marginBottom: '1.25rem', overflow: 'hidden' }}>
      {/* Card header */}
      <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--clr-border)', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
        <div>
          <span style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--clr-primary-light)', background: 'rgba(27,67,50,0.08)', padding: '3px 10px', borderRadius: '100px' }}>
            {SERVICE_LABELS[project.service] || project.service}
          </span>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.05rem', fontWeight: 700, color: 'var(--clr-text)', marginTop: '0.4rem' }}>{project.title}</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--clr-text-muted)', marginTop: '0.2rem' }}>Submitted {fmtDate(project.created_at)}</div>
        </div>
        <span style={{ background: cfg.bg, color: cfg.color, fontSize: '0.72rem', fontWeight: 700, padding: '4px 12px', borderRadius: '100px', whiteSpace: 'nowrap', flexShrink: 0 }}>
          {cfg.label}
        </span>
      </div>

      {/* Progress timeline (only for non-cancelled) */}
      {!isCancelled && (
        <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--clr-border)', overflowX: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', minWidth: 480 }}>
            {STEPS.map((step, i) => {
              const done = currentStep > i
              const active = currentStep === i
              return (
                <div key={step} style={{ display: 'flex', alignItems: 'center', flex: i < STEPS.length - 1 ? 1 : undefined }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                    <div style={{
                      width: 22, height: 22, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: done ? '#1B4332' : active ? '#C9A84C' : '#e5e7eb',
                      color: done || active ? '#fff' : '#9ca3af',
                      fontSize: '0.65rem', fontWeight: 700, flexShrink: 0,
                    }}>
                      {done ? '✓' : i + 1}
                    </div>
                    <div style={{ fontSize: '0.6rem', color: done ? '#1B4332' : active ? '#C9A84C' : '#9ca3af', fontWeight: active || done ? 700 : 400, whiteSpace: 'nowrap', textAlign: 'center' }}>
                      {step}
                    </div>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div style={{ flex: 1, height: 2, background: done ? '#1B4332' : '#e5e7eb', margin: '0 4px', marginBottom: 18 }} />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Status-specific action area */}
      <div style={{ padding: '1.25rem 1.5rem' }}>

        {/* ACCEPTED — pay deposit */}
        {project.status === 'accepted' && (
          <div style={{ background: '#fef9c3', border: '1px solid #f6c90e', borderRadius: 10, padding: '1rem 1.25rem' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: '#854d0e', letterSpacing: '0.06em', marginBottom: 4 }}>Deposit Payment Required</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827', fontFamily: 'var(--font-serif)', marginBottom: '0.5rem' }}>
              {fmtAmount(project.deposit_amount)}
            </div>
            <p style={{ fontSize: '0.82rem', color: '#374151', margin: '0 0 0.6rem', lineHeight: 1.6 }}>
              Your application has been accepted! To begin work, please make the deposit payment using the details below.
            </p>
            {project.payment_instructions && (
              <div style={{ background: '#fff', border: '1px solid #f6c90e', borderRadius: 8, padding: '0.75rem 1rem', fontSize: '0.82rem', color: '#374151', whiteSpace: 'pre-wrap', lineHeight: 1.7 }}>
                {project.payment_instructions}
              </div>
            )}
            <p style={{ fontSize: '0.75rem', color: '#854d0e', margin: '0.6rem 0 0' }}>Once payment is made, please email your payment reference to <strong>hello@theryters.com</strong>.</p>
          </div>
        )}

        {/* IN PROGRESS */}
        {project.status === 'in_progress' && (
          <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: 10, padding: '1rem 1.25rem' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: '#166534', letterSpacing: '0.06em', marginBottom: 4 }}>Work in Progress</div>
            <p style={{ fontSize: '0.875rem', color: '#374151', margin: '0 0 4px', lineHeight: 1.6 }}>
              Your deposit has been received and work is underway.
            </p>
            {project.expected_delivery_at && (
              <div style={{ fontSize: '0.82rem', color: '#166534', fontWeight: 700 }}>
                Expected delivery: {fmtDate(project.expected_delivery_at)}
              </div>
            )}
          </div>
        )}

        {/* PENDING BALANCE — pay balance */}
        {project.status === 'pending_balance' && (
          <div style={{ background: '#ede9fe', border: '1px solid #c4b5fd', borderRadius: 10, padding: '1rem 1.25rem' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: '#5b21b6', letterSpacing: '0.06em', marginBottom: 4 }}>Balance Payment Required</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827', fontFamily: 'var(--font-serif)', marginBottom: '0.5rem' }}>
              {fmtAmount(project.balance_amount)}
            </div>
            <p style={{ fontSize: '0.82rem', color: '#374151', margin: '0 0 0.6rem', lineHeight: 1.6 }}>
              Your work is complete! Please pay the remaining balance to receive your files.
            </p>
            {project.payment_instructions && (
              <div style={{ background: '#fff', border: '1px solid #c4b5fd', borderRadius: 8, padding: '0.75rem 1rem', fontSize: '0.82rem', color: '#374151', whiteSpace: 'pre-wrap', lineHeight: 1.7 }}>
                {project.payment_instructions}
              </div>
            )}
            <p style={{ fontSize: '0.75rem', color: '#5b21b6', margin: '0.6rem 0 0' }}>Once payment is made, please email your payment reference to <strong>hello@theryters.com</strong>.</p>
          </div>
        )}

        {/* COMPLETED — download files */}
        {project.status === 'completed' && (
          <div>
            <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: 10, padding: '1rem 1.25rem', marginBottom: '0.85rem' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: '#166534', letterSpacing: '0.06em', marginBottom: 4 }}>Project Delivered</div>
              <p style={{ fontSize: '0.875rem', color: '#374151', margin: 0, lineHeight: 1.6 }}>
                Your project is complete. Download your files below. Links are valid for 7 days — revisit this page to refresh them.
              </p>
            </div>
            {project.admin_notes && (
              <div style={{ background: 'var(--clr-surface-2)', border: '1px solid var(--clr-border)', borderRadius: 8, padding: '0.75rem 1rem', fontSize: '0.82rem', color: 'var(--clr-text)', marginBottom: '0.85rem', whiteSpace: 'pre-wrap' }}>
                <strong>Note from our team:</strong><br />{project.admin_notes}
              </div>
            )}
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              {project.deliverable_signed ? (
                <a href={project.deliverable_signed} target="_blank" rel="noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.65rem 1.25rem', background: '#1B4332', color: '#fff', borderRadius: 8, fontWeight: 700, fontSize: '0.875rem', textDecoration: 'none' }}>
                  Download Deliverable
                </a>
              ) : (
                <div style={{ padding: '0.65rem 1.25rem', background: '#f3f4f6', color: '#9ca3af', borderRadius: 8, fontSize: '0.875rem' }}>No deliverable uploaded yet</div>
              )}
              {project.ai_report_signed && (
                <a href={project.ai_report_signed} target="_blank" rel="noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.65rem 1.25rem', background: '#374151', color: '#fff', borderRadius: 8, fontWeight: 700, fontSize: '0.875rem', textDecoration: 'none' }}>
                  Download AI/Similarity Report
                </a>
              )}
            </div>
          </div>
        )}

        {/* PENDING / IN REVIEW */}
        {(project.status === 'pending' || project.status === 'in_review') && (
          <p style={{ fontSize: '0.875rem', color: 'var(--clr-text-muted)', margin: 0, lineHeight: 1.6 }}>
            {project.status === 'pending'
              ? 'Your application is in the queue. We review all requests within 1 business day.'
              : 'Our team is reviewing your application. We will be in touch shortly.'}
          </p>
        )}

        {/* CANCELLED */}
        {project.status === 'cancelled' && (
          <div style={{ background: '#fff5f5', border: '1px solid #feb2b2', borderRadius: 10, padding: '1rem 1.25rem' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: '#991b1b', letterSpacing: '0.06em', marginBottom: 4 }}>Application Not Accepted</div>
            <p style={{ fontSize: '0.875rem', color: '#374151', margin: '0 0 6px', lineHeight: 1.6 }}>
              {project.admin_notes || 'Unfortunately we were unable to proceed with this application at this time.'}
            </p>
            <p style={{ fontSize: '0.78rem', color: '#991b1b', margin: 0 }}>Contact us at <a href="mailto:hello@theryters.com" style={{ color: 'inherit' }}>hello@theryters.com</a> to discuss further.</p>
          </div>
        )}

        {/* Description (collapsible summary) */}
        <details style={{ marginTop: '1rem' }}>
          <summary style={{ fontSize: '0.78rem', color: 'var(--clr-text-muted)', cursor: 'pointer', userSelect: 'none' }}>View your submission details</summary>
          <div style={{ marginTop: '0.5rem', fontSize: '0.82rem', color: 'var(--clr-text-muted)', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{project.description}</div>
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
            {project.deadline && <span style={{ fontSize: '0.75rem', color: 'var(--clr-text-muted)' }}>Deadline: {fmtDate(project.deadline)}</span>}
            <span style={{ fontSize: '0.75rem', color: 'var(--clr-text-muted)', textTransform: 'capitalize' }}>Urgency: {project.urgency}</span>
            {project.budget_range && <span style={{ fontSize: '0.75rem', color: 'var(--clr-text-muted)' }}>Budget: {project.budget_range}</span>}
          </div>
        </details>
      </div>
    </div>
  )
}

function ProjectsContent() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const searchParams = useSearchParams()
  const submitted = searchParams.get('submitted')

  useEffect(() => {
    fetch('/api/projects')
      .then(r => r.json())
      .then(data => { setProjects(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: 'var(--clr-text)', margin: 0 }}>My Projects</h2>
        <Link href="/dashboard/request" className="btn btn-primary btn-sm">+ New Request</Link>
      </div>

      {submitted && (
        <div style={{ background: '#f0fff4', border: '1px solid #9ae6b4', color: '#276749', padding: '1rem 1.25rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '1.25rem' }}>✓</span>
          <div><strong>Request submitted!</strong> We will review and respond within 1 business day.</div>
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--clr-text-muted)' }}>Loading your projects...</div>
      ) : projects.length === 0 ? (
        <div style={{ background: 'var(--clr-surface)', border: '1px solid var(--clr-border)', borderRadius: 'var(--radius-xl)', padding: '4rem 2rem', textAlign: 'center' }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>📁</div>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--clr-text)' }}>No projects yet</h3>
          <p style={{ color: 'var(--clr-text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem', maxWidth: '40ch', marginInline: 'auto' }}>
            Submit your first service request and track everything right here.
          </p>
          <Link href="/dashboard/request" className="btn btn-primary">Request a Service</Link>
        </div>
      ) : (
        projects.map(project => <ProjectCard key={project.id} project={project} />)
      )}
    </>
  )
}

export default function ProjectsPage() {
  return (
    <Suspense fallback={<div style={{ textAlign: 'center', padding: '4rem', color: 'var(--clr-text-muted)' }}>Loading...</div>}>
      <ProjectsContent />
    </Suspense>
  )
}
