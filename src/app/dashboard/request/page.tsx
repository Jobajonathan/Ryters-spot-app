'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const SERVICES = [
  { id: 'research_academic', icon: '📖', title: 'Research and Academic Enquiry', desc: 'Dissertation support, literature reviews, data analysis and academic advisory for scholars and institutions worldwide.', badge: 'Academic' },
  { id: 'digital_transformation', icon: '🚀', title: 'Digital Transformation and Automation', desc: 'End-to-end digital transformation roadmaps, process automation and modernisation for enterprises ready to scale.', badge: 'Enterprise' },
  { id: 'edtech', icon: '💻', title: 'Ed-Tech Services', desc: 'LMS deployment, interactive content design and educational technology strategy for institutions and learners.', badge: 'Education' },
  { id: 'product_management', icon: '📦', title: 'Product Management', desc: 'Product strategy, roadmap development and go-to-market support for teams building the next generation of products.', badge: 'Product' },
]

const BUDGET_RANGES = [
  'Under £500', '£500 – £1,000', '£1,000 – £2,500',
  '£2,500 – £5,000', '£5,000 – £10,000', 'Over £10,000', 'To be discussed'
]

export default function RequestPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    service: '',
    title: '',
    description: '',
    deadline: '',
    urgency: 'standard',
    budget_range: '',
  })

  function update(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  function nextStep() {
    setError('')
    if (step === 1 && !form.service) { setError('Please select a service to continue.'); return }
    if (step === 2) {
      if (!form.title.trim()) { setError('Please enter a project title.'); return }
      if (!form.description.trim() || form.description.length < 30) { setError('Please describe your project in at least 30 characters.'); return }
    }
    setStep(s => s + 1)
  }

  async function handleSubmit() {
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Something went wrong. Please try again.')
        setLoading(false)
        return
      }
      router.push('/dashboard/projects?submitted=1')
    } catch {
      setError('Could not submit your request. Please try again.')
      setLoading(false)
    }
  }

  const selectedService = SERVICES.find(s => s.id === form.service)

  return (
    <>
      <style>{`
        .req-header { margin-bottom: 2rem; }
        .req-header h2 { font-family: var(--font-serif); font-size: 1.5rem; color: var(--clr-text); margin-bottom: 0.35rem; }
        .req-header p { color: var(--clr-text-muted); font-size: 0.9rem; }
        .req-steps { display: flex; align-items: center; gap: 0; margin-bottom: 2.5rem; }
        .req-step { display: flex; align-items: center; gap: 0.5rem; flex: 1; }
        .req-step-num { width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.85rem; flex-shrink: 0; transition: all 0.2s; }
        .req-step-num.done { background: var(--clr-primary); color: #fff; }
        .req-step-num.active { background: var(--clr-accent); color: #fff; }
        .req-step-num.todo { background: var(--clr-surface-2); color: var(--clr-text-muted); }
        .req-step-label { font-size: 0.78rem; font-weight: 600; color: var(--clr-text-muted); display: none; }
        .req-step-label.active { color: var(--clr-text); display: block; }
        .req-step-line { flex: 1; height: 2px; background: var(--clr-border); margin: 0 0.5rem; }
        .req-step-line.done { background: var(--clr-primary); }
        .req-card { background: var(--clr-surface); border: 1px solid var(--clr-border); border-radius: var(--radius-xl); padding: 2rem; }
        .svc-grid { display: grid; grid-template-columns: repeat(2,1fr); gap: 1rem; }
        .svc-card { border: 2px solid var(--clr-border); border-radius: var(--radius-lg); padding: 1.25rem; cursor: pointer; transition: all 0.2s; background: var(--clr-bg); }
        .svc-card:hover { border-color: var(--clr-primary-light); transform: translateY(-2px); box-shadow: var(--shadow-md); }
        .svc-card.selected { border-color: var(--clr-primary); background: rgba(27,67,50,0.04); }
        .svc-icon { font-size: 1.75rem; margin-bottom: 0.6rem; }
        .svc-badge { display: inline-block; font-size: 0.65rem; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; padding: 2px 8px; border-radius: 100px; background: var(--clr-surface-2); color: var(--clr-primary-light); margin-bottom: 0.5rem; }
        .svc-title { font-family: var(--font-serif); font-size: 1rem; margin-bottom: 0.4rem; color: var(--clr-text); font-weight: 700; }
        .svc-desc { font-size: 0.8rem; color: var(--clr-text-muted); line-height: 1.5; }
        .urgency-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 0.75rem; }
        .urgency-card { border: 2px solid var(--clr-border); border-radius: var(--radius-md); padding: 1rem; cursor: pointer; text-align: center; transition: all 0.2s; background: var(--clr-bg); }
        .urgency-card:hover { border-color: var(--clr-primary-light); }
        .urgency-card.selected { border-color: var(--clr-primary); background: rgba(27,67,50,0.04); }
        .urgency-icon { font-size: 1.5rem; margin-bottom: 0.4rem; }
        .urgency-label { font-size: 0.85rem; font-weight: 700; color: var(--clr-text); margin-bottom: 0.25rem; }
        .urgency-desc { font-size: 0.75rem; color: var(--clr-text-muted); }
        .review-row { display: flex; padding: 0.75rem 0; border-bottom: 1px solid var(--clr-border); }
        .review-label { width: 140px; font-size: 0.82rem; color: var(--clr-text-muted); flex-shrink: 0; padding-top: 1px; }
        .review-value { font-size: 0.9rem; color: var(--clr-text); font-weight: 500; flex: 1; }
        .req-error { background: #fff5f5; border: 1px solid #feb2b2; color: #c53030; padding: 0.85rem 1rem; border-radius: var(--radius-md); font-size: 0.875rem; margin-bottom: 1.25rem; }
        .req-nav { display: flex; justify-content: space-between; align-items: center; margin-top: 2rem; padding-top: 1.5rem; border-top: 1px solid var(--clr-border); }
        .char-count { font-size: 0.75rem; color: var(--clr-text-muted); text-align: right; margin-top: 4px; }
        @media (max-width: 600px) { .svc-grid { grid-template-columns: 1fr; } .urgency-grid { grid-template-columns: 1fr; } }
      `}</style>

      <div className="req-header">
        <h2>Request a Service</h2>
        <p>Tell us about your project and we will get back to you within one business day.</p>
      </div>

      {/* Step Indicator */}
      <div className="req-steps">
        {['Service', 'Details', 'Timeline', 'Review'].map((label, i) => (
          <div key={label} className="req-step" style={{ flex: i < 3 ? '1' : 'none' }}>
            <div className={`req-step-num ${step > i + 1 ? 'done' : step === i + 1 ? 'active' : 'todo'}`}>
              {step > i + 1 ? '✓' : i + 1}
            </div>
            <span className={`req-step-label ${step === i + 1 ? 'active' : ''}`}>{label}</span>
            {i < 3 && <div className={`req-step-line ${step > i + 1 ? 'done' : ''}`} />}
          </div>
        ))}
      </div>

      {error && <div className="req-error">{error}</div>}

      <div className="req-card">

        {/* STEP 1 — Choose Service */}
        {step === 1 && (
          <>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', marginBottom: '0.35rem' }}>What service do you need?</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--clr-text-muted)', marginBottom: '1.5rem' }}>Select the area that best describes your project.</p>
            <div className="svc-grid">
              {SERVICES.map(s => (
                <div key={s.id} className={`svc-card${form.service === s.id ? ' selected' : ''}`} onClick={() => update('service', s.id)} role="button" tabIndex={0} onKeyDown={e => e.key === 'Enter' && update('service', s.id)}>
                  <div className="svc-icon">{s.icon}</div>
                  <div className="svc-badge">{s.badge}</div>
                  <div className="svc-title">{s.title}</div>
                  <div className="svc-desc">{s.desc}</div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* STEP 2 — Project Details */}
        {step === 2 && (
          <>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', marginBottom: '0.35rem' }}>Tell us about your project</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--clr-text-muted)', marginBottom: '1.5rem' }}>The more detail you provide, the better we can match you with the right expert.</p>

            <div style={{ background: 'rgba(27,67,50,0.05)', border: '1px solid rgba(27,67,50,0.15)', borderRadius: 'var(--radius-md)', padding: '0.75rem 1rem', marginBottom: '1.5rem', fontSize: '0.875rem', color: 'var(--clr-primary)' }}>
              Service: <strong>{selectedService?.title}</strong>
            </div>

            <div className="form-group">
              <label className="form-label">Project Title <span style={{ color: '#e53e3e' }}>*</span></label>
              <input className="form-control" type="text" placeholder="e.g. PhD Dissertation on Climate Change Policy" value={form.title} onChange={e => update('title', e.target.value)} maxLength={100} />
              <div className="char-count">{form.title.length}/100</div>
            </div>

            <div className="form-group">
              <label className="form-label">Project Description <span style={{ color: '#e53e3e' }}>*</span></label>
              <textarea
                className="form-control"
                placeholder="Describe your project in detail. Include: what you need done, the context or background, any specific requirements, preferred approach, and any constraints we should be aware of..."
                value={form.description}
                onChange={e => update('description', e.target.value)}
                style={{ minHeight: '160px' }}
              />
              <div className="char-count" style={{ color: form.description.length < 30 ? '#e53e3e' : 'var(--clr-text-muted)' }}>{form.description.length} characters {form.description.length < 30 ? `(${30 - form.description.length} more needed)` : '✓'}</div>
            </div>
          </>
        )}

        {/* STEP 3 — Timeline & Budget */}
        {step === 3 && (
          <>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', marginBottom: '0.35rem' }}>Timeline and budget</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--clr-text-muted)', marginBottom: '1.5rem' }}>Help us understand your timeline and budget expectations.</p>

            <div className="form-group">
              <label className="form-label">How urgent is this project?</label>
              <div className="urgency-grid">
                {[
                  { id: 'flexible', icon: '🌿', label: 'Flexible', desc: 'No strict deadline' },
                  { id: 'standard', icon: '📅', label: 'Standard', desc: 'Within a few weeks' },
                  { id: 'urgent', icon: '⚡', label: 'Urgent', desc: 'ASAP — within days' },
                ].map(u => (
                  <div key={u.id} className={`urgency-card${form.urgency === u.id ? ' selected' : ''}`} onClick={() => update('urgency', u.id)} role="button" tabIndex={0} onKeyDown={e => e.key === 'Enter' && update('urgency', u.id)}>
                    <div className="urgency-icon">{u.icon}</div>
                    <div className="urgency-label">{u.label}</div>
                    <div className="urgency-desc">{u.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Preferred deadline</label>
              <input className="form-control" type="date" value={form.deadline} onChange={e => update('deadline', e.target.value)} min={new Date().toISOString().split('T')[0]} />
            </div>

            <div className="form-group">
              <label className="form-label">Budget range</label>
              <select className="form-control" value={form.budget_range} onChange={e => update('budget_range', e.target.value)}>
                <option value="">Select a range (optional)</option>
                {BUDGET_RANGES.map(b => <option key={b}>{b}</option>)}
              </select>
              <p style={{ fontSize: '0.78rem', color: 'var(--clr-text-muted)', marginTop: '6px' }}>We will confirm exact pricing after reviewing your project brief.</p>
            </div>
          </>
        )}

        {/* STEP 4 — Review */}
        {step === 4 && (
          <>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', marginBottom: '0.35rem' }}>Review your request</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--clr-text-muted)', marginBottom: '1.5rem' }}>Please review your details before submitting.</p>

            <div style={{ marginBottom: '1.5rem' }}>
              <div className="review-row"><span className="review-label">Service</span><span className="review-value">{selectedService?.title}</span></div>
              <div className="review-row"><span className="review-label">Title</span><span className="review-value">{form.title}</span></div>
              <div className="review-row"><span className="review-label">Description</span><span className="review-value" style={{ whiteSpace: 'pre-wrap' }}>{form.description}</span></div>
              <div className="review-row"><span className="review-label">Urgency</span><span className="review-value" style={{ textTransform: 'capitalize' }}>{form.urgency}</span></div>
              <div className="review-row"><span className="review-label">Deadline</span><span className="review-value">{form.deadline || 'Not specified'}</span></div>
              <div className="review-row" style={{ borderBottom: 'none' }}><span className="review-label">Budget</span><span className="review-value">{form.budget_range || 'To be discussed'}</span></div>
            </div>

            <div style={{ background: 'rgba(27,67,50,0.05)', border: '1px solid rgba(27,67,50,0.15)', borderRadius: 'var(--radius-md)', padding: '1rem', fontSize: '0.85rem', color: 'var(--clr-primary)' }}>
              After submission, our team will review your request and respond within <strong>one business day</strong>. You will receive a confirmation email immediately.
            </div>
          </>
        )}

        <div className="req-nav">
          {step > 1 ? (
            <button className="btn btn-outline" onClick={() => { setError(''); setStep(s => s - 1) }}>Back</button>
          ) : (
            <Link href="/dashboard" className="btn btn-outline">Cancel</Link>
          )}

          {step < 4 ? (
            <button className="btn btn-primary" onClick={nextStep}>Continue</button>
          ) : (
            <button className="btn btn-primary" onClick={handleSubmit} disabled={loading} style={{ minWidth: '140px', justifyContent: 'center' }}>
              {loading ? 'Submitting...' : 'Submit Request'}
            </button>
          )}
        </div>

      </div>
    </>
  )
}
