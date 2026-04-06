'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

type Deliverable = {
  id: string
  title: string
  service: string
  status: string
  deliverable_path: string | null
  ai_report_path: string | null
  balance_paid_at: string | null
  updated_at: string
}

const SERVICE_LABELS: Record<string, string> = {
  research_academic: 'Research & Academic',
  digital_transformation: 'Digital Transformation',
  edtech: 'EdTech Services',
  product_management: 'Product Management',
}

export default function DeliverablesPage() {
  const [projects, setProjects] = useState<Deliverable[]>([])
  const [loading, setLoading] = useState(true)
  const [downloading, setDownloading] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/projects')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) {
          const withFiles = data.filter((p: Deliverable) => p.deliverable_path || p.ai_report_path)
          setProjects(withFiles)
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  async function download(path: string, label: string) {
    setDownloading(label)
    try {
      const res = await fetch(`/api/admin/download?path=${encodeURIComponent(path)}`, { redirect: 'follow' })
      if (res.ok && res.url) {
        window.open(res.url, '_blank')
      } else {
        const w = window.open('', '_blank')
        const r = await fetch(`/api/admin/download?path=${encodeURIComponent(path)}`)
        const data = await r.json().catch(() => ({}))
        if (w) w.close()
        alert(data.error || 'Could not generate download link. Please try again.')
      }
    } catch {
      alert('Download failed. Please try again.')
    } finally {
      setDownloading(null)
    }
  }

  return (
    <>
      <style>{`
        .deliv-header { margin-bottom: 2rem; }
        .deliv-header h1 { font-family: var(--font-serif); font-size: 1.5rem; font-weight: 700; color: var(--clr-text); margin: 0 0 0.25rem; }
        .deliv-header p { color: var(--clr-text-muted); font-size: 0.9rem; margin: 0; }
        .deliv-card { background: var(--clr-surface); border: 1px solid var(--clr-border); border-radius: 14px; padding: 1.5rem; margin-bottom: 1rem; }
        .deliv-card-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; flex-wrap: wrap; margin-bottom: 1rem; }
        .deliv-title { font-family: var(--font-serif); font-size: 1.05rem; font-weight: 700; color: var(--clr-text); margin: 0 0 0.3rem; }
        .deliv-meta { font-size: 0.8rem; color: var(--clr-text-muted); }
        .deliv-badge { display: inline-block; padding: 0.25rem 0.7rem; border-radius: 100px; font-size: 0.72rem; font-weight: 700; background: #d1fae5; color: #065f46; }
        .deliv-files { display: flex; flex-wrap: wrap; gap: 0.75rem; }
        .deliv-file-btn { display: flex; align-items: center; gap: 0.5rem; padding: 0.55rem 1.1rem; background: var(--clr-primary); color: #fff; border: none; border-radius: 8px; font-size: 0.82rem; font-weight: 600; cursor: pointer; transition: opacity 0.15s; font-family: inherit; }
        .deliv-file-btn:hover { opacity: 0.88; }
        .deliv-file-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .deliv-file-btn.secondary { background: var(--clr-surface-2); color: var(--clr-text); border: 1px solid var(--clr-border); }
        .deliv-empty { text-align: center; padding: 4rem 2rem; }
        .deliv-empty-icon { font-size: 3.5rem; margin-bottom: 1rem; }
        .deliv-empty h2 { font-family: var(--font-serif); font-size: 1.35rem; color: var(--clr-text); margin-bottom: 0.5rem; }
        .deliv-empty p { color: var(--clr-text-muted); font-size: 0.9rem; max-width: 38ch; margin: 0 auto 1.5rem; }
      `}</style>

      <div className="deliv-header">
        <h1>Deliverables</h1>
        <p>Download your completed work securely from your portal.</p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--clr-text-muted)' }}>Loading your files...</div>
      ) : projects.length === 0 ? (
        <div className="deliv-empty">
          <div className="deliv-empty-icon">&#8681;</div>
          <h2>No deliverables yet</h2>
          <p>Your completed work will appear here once your project is finished and files have been uploaded by our team.</p>
          <Link href="/dashboard/projects" className="btn btn-primary">View My Projects</Link>
        </div>
      ) : (
        <div>
          {projects.map(p => (
            <div key={p.id} className="deliv-card">
              <div className="deliv-card-top">
                <div>
                  <p className="deliv-title">{p.title}</p>
                  <p className="deliv-meta">
                    {SERVICE_LABELS[p.service] || p.service}
                    {p.balance_paid_at && ` · Delivered ${new Date(p.balance_paid_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`}
                  </p>
                </div>
                <span className="deliv-badge">&#10003; Ready to Download</span>
              </div>
              <div className="deliv-files">
                {p.deliverable_path && (
                  <button
                    className="deliv-file-btn"
                    disabled={downloading === `deliv-${p.id}`}
                    onClick={() => download(p.deliverable_path!, `deliv-${p.id}`)}
                  >
                    &#8681; {downloading === `deliv-${p.id}` ? 'Preparing...' : 'Download Deliverable'}
                  </button>
                )}
                {p.ai_report_path && (
                  <button
                    className="deliv-file-btn secondary"
                    disabled={downloading === `report-${p.id}`}
                    onClick={() => download(p.ai_report_path!, `report-${p.id}`)}
                  >
                    &#128196; {downloading === `report-${p.id}` ? 'Preparing...' : 'Download AI Report'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
