'use client'

import { useEffect, useState } from 'react'
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
}

const SERVICE_LABELS: Record<string, string> = {
  research_academic: 'Research and Academic Enquiry',
  digital_transformation: 'Digital Transformation and Automation',
  edtech: 'Ed-Tech Services',
  product_management: 'Product Management',
}

const STATUS_STYLES: Record<string, { bg: string; color: string; label: string }> = {
  pending:      { bg: '#fef3c7', color: '#92400e', label: 'Pending Review' },
  in_review:    { bg: '#dbeafe', color: '#1e40af', label: 'In Review' },
  in_progress:  { bg: '#d1fae5', color: '#065f46', label: 'In Progress' },
  completed:    { bg: '#f0fdf4', color: '#166534', label: 'Completed' },
  cancelled:    { bg: '#fee2e2', color: '#991b1b', label: 'Cancelled' },
}

export default function ProjectsPage() {
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
      <style>{`
        .projects-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.75rem; flex-wrap: wrap; gap: 1rem; }
        .projects-header h2 { font-family: var(--font-serif); font-size: 1.5rem; color: var(--clr-text); margin: 0; }
        .project-card { background: var(--clr-surface); border: 1px solid var(--clr-border); border-radius: var(--radius-lg); padding: 1.5rem; margin-bottom: 1rem; transition: box-shadow 0.2s; }
        .project-card:hover { box-shadow: var(--shadow-md); }
        .project-card-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; margin-bottom: 0.75rem; }
        .project-service-tag { font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: var(--clr-primary-light); background: rgba(27,67,50,0.08); padding: 3px 10px; border-radius: 100px; }
        .project-title { font-family: var(--font-serif); font-size: 1.1rem; color: var(--clr-text); margin: 0.35rem 0 0.5rem; }
        .project-desc { font-size: 0.875rem; color: var(--clr-text-muted); line-height: 1.6; margin-bottom: 1rem; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .project-meta { display: flex; gap: 1.5rem; flex-wrap: wrap; }
        .project-meta-item { font-size: 0.78rem; color: var(--clr-text-muted); display: flex; align-items: center; gap: 4px; }
        .status-badge { display: inline-block; font-size: 0.72rem; font-weight: 700; padding: 3px 10px; border-radius: 100px; }
        .submitted-banner { background: #f0fff4; border: 1px solid #9ae6b4; color: #276749; padding: 1rem 1.25rem; border-radius: var(--radius-md); margin-bottom: 1.5rem; display: flex; align-items: center; gap: 0.75rem; }
        .empty-state { background: var(--clr-surface); border: 1px solid var(--clr-border); border-radius: var(--radius-xl); padding: 4rem 2rem; text-align: center; }
        .empty-icon { font-size: 3.5rem; margin-bottom: 1rem; }
        .empty-state h3 { font-family: var(--font-serif); font-size: 1.25rem; margin-bottom: 0.5rem; color: var(--clr-text); }
        .empty-state p { color: var(--clr-text-muted); font-size: 0.9rem; margin-bottom: 1.5rem; max-width: 40ch; margin-inline: auto; }
      `}</style>

      <div className="projects-header">
        <h2>My Projects</h2>
        <Link href="/dashboard/request" className="btn btn-primary btn-sm">+ New Request</Link>
      </div>

      {submitted && (
        <div className="submitted-banner">
          <span style={{ fontSize: '1.25rem' }}>✓</span>
          <div>
            <strong>Request submitted successfully!</strong> We have sent a confirmation to your email. Our team will review and respond within one business day.
          </div>
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--clr-text-muted)' }}>Loading your projects...</div>
      ) : projects.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📁</div>
          <h3>No projects yet</h3>
          <p>Submit your first service request and we will get to work. Track everything right here.</p>
          <Link href="/dashboard/request" className="btn btn-primary">Request a Service</Link>
        </div>
      ) : (
        projects.map(project => {
          const status = STATUS_STYLES[project.status] || STATUS_STYLES.pending
          return (
            <div key={project.id} className="project-card">
              <div className="project-card-top">
                <span className="project-service-tag">{SERVICE_LABELS[project.service] || project.service}</span>
                <span className="status-badge" style={{ background: status.bg, color: status.color }}>{status.label}</span>
              </div>
              <div className="project-title">{project.title}</div>
              <div className="project-desc">{project.description}</div>
              <div className="project-meta">
                <span className="project-meta-item">📅 Submitted {new Date(project.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                {project.deadline && <span className="project-meta-item">⏰ Deadline: {new Date(project.deadline).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>}
                <span className="project-meta-item" style={{ textTransform: 'capitalize' }}>⚡ {project.urgency}</span>
                {project.budget_range && <span className="project-meta-item">💷 {project.budget_range}</span>}
              </div>
            </div>
          )
        })
      )}
    </>
  )
}
