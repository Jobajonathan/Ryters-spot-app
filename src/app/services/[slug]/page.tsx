import { notFound } from 'next/navigation'
import ServicePageClient from './ServicePageClient'

export type ServiceData = {
  title: string
  label: string
  tagline: string
  description: string
  features: { title: string; desc: string }[]
  offerings: { name: string; desc: string }[]
  personas: string[]
  ctaLabel: string
  relatedSlugs: string[]
}

export const serviceData: Record<string, ServiceData> = {
  'ai-automation': {
    title: 'Research Automation',
    label: 'Research Intelligence',
    tagline: 'Use AI to make research faster, cleaner and more repeatable.',
    description: 'We design research workflows, synthesis systems and AI-assisted knowledge operations for teams that need better decisions without drowning in manual work.',
    features: [
      { title: 'Research Workflow Mapping', desc: 'We identify how information moves through your team and where automation can improve speed, quality and traceability.' },
      { title: 'AI-Assisted Synthesis', desc: 'Set up controlled workflows for summarising interviews, documents, reports and market material without losing human judgment.' },
      { title: 'Knowledge Base Design', desc: 'Structure reusable repositories for research findings, product decisions, client knowledge and institutional memory.' },
      { title: 'Governance and Handover', desc: 'Document how the system should be used, reviewed and improved by your internal team.' },
    ],
    offerings: [
      { name: 'Research Systems Audit', desc: 'A practical review of your current research and documentation workflow.' },
      { name: 'Automation Prototype', desc: 'A pilot workflow for one high-value research or knowledge process.' },
      { name: 'Knowledge Operations Setup', desc: 'End-to-end setup for research capture, synthesis and retrieval.' },
      { name: 'Team Enablement', desc: 'Training and documentation so your team can operate the system responsibly.' },
    ],
    personas: ['Research teams', 'Founders', 'Product teams', 'Institutions'],
    ctaLabel: 'Build a research system',
    relatedSlugs: ['writing', 'product-management'],
  },
  edtech: {
    title: 'Learning Product Development',
    label: 'Knowledge Systems',
    tagline: 'Turn expertise into learning products that can scale.',
    description: 'We help organisations design curricula, digital learning products, knowledge assets and learning systems that are structured, usable and measurable.',
    features: [
      { title: 'Learning Product Strategy', desc: 'Define the audience, outcomes, modules, delivery model and success measures for the learning product.' },
      { title: 'Curriculum and Content Architecture', desc: 'Turn expertise into structured modules, lessons, assessments, workbooks and facilitator guides.' },
      { title: 'Platform and Workflow Planning', desc: 'Select or shape the tools needed to deliver, track and improve the learning experience.' },
      { title: 'Launch Materials', desc: 'Create the documentation, onboarding content and operating materials required for rollout.' },
    ],
    offerings: [
      { name: 'Learning Product Blueprint', desc: 'A complete structure for a course, programme or training product.' },
      { name: 'Curriculum Buildout', desc: 'Module-by-module development of learning content and assessments.' },
      { name: 'LMS Readiness Pack', desc: 'Requirements, content structure and workflow plans for digital delivery.' },
      { name: 'Knowledge Product Sprint', desc: 'A focused sprint to turn expertise into a market-ready educational asset.' },
    ],
    personas: ['Training teams', 'Schools', 'Creators', 'NGOs'],
    ctaLabel: 'Develop a learning product',
    relatedSlugs: ['writing', 'ai-automation'],
  },
  writing: {
    title: 'Research and Knowledge Products',
    label: 'Research Intelligence',
    tagline: 'Serious writing built on research, structure and judgment.',
    description: 'We develop reports, briefs, manuscripts, research documents, thought leadership assets and knowledge products for clients who need substance and polish.',
    features: [
      { title: 'Research Design and Synthesis', desc: 'Frame the research question, gather relevant material and turn findings into usable insight.' },
      { title: 'Reports and Decision Briefs', desc: 'Develop clear, evidence-led documents for stakeholders, funders, boards, customers or internal teams.' },
      { title: 'Manuscript and Long-form Development', desc: 'Support complex long-form documents with structure, editing, argument flow and publication readiness.' },
      { title: 'Knowledge Asset Production', desc: 'Create playbooks, guides, white papers and strategic content assets from raw expertise.' },
    ],
    offerings: [
      { name: 'Research Report', desc: 'A polished report built from desk research, interviews, data or internal material.' },
      { name: 'Executive Brief Pack', desc: 'Concise decision documents for leadership, funders or partners.' },
      { name: 'Long-form Development', desc: 'Structured support for manuscripts, dissertations, theses and major documents.' },
      { name: 'Knowledge Asset Retainer', desc: 'Ongoing production of high-quality research-backed content and documents.' },
    ],
    personas: ['Founders', 'Researchers', 'Executives', 'Institutions'],
    ctaLabel: 'Develop a research asset',
    relatedSlugs: ['product-management', 'edtech'],
  },
  'product-management': {
    title: 'Product Development',
    label: 'Product Development',
    tagline: 'Move from idea to software, digital presence and scalable market traction.',
    description: 'We help teams investigate opportunities, define the product, plan software and digital delivery, shape the offer, organise launch assets and build the sales, marketing and business development systems required for growth.',
    features: [
      { title: 'Product Discovery', desc: 'Clarify the user, problem, opportunity, constraints, revenue logic and success measures before build work begins.' },
      { title: 'Software and Digital Planning', desc: 'Translate ideas into requirements, MVP scope, feature priorities, web/app direction and phased product plans.' },
      { title: 'Market and Growth Assets', desc: 'Shape positioning, landing pages, sales materials, marketing workflows and business development assets around the product.' },
      { title: 'Delivery and Scale Coordination', desc: 'Support project rhythm, stakeholder alignment, documentation, launch readiness and post-launch growth systems.' },
    ],
    offerings: [
      { name: 'Discovery Sprint', desc: 'A focused sprint to validate the opportunity and define the product direction.' },
      { name: 'Product Requirements Pack', desc: 'Clear software requirements, workflows and acceptance criteria for build teams.' },
      { name: 'Launch and Growth Pack', desc: 'Positioning, digital presence, sales materials, marketing plan, go-live checklist and stakeholder materials.' },
      { name: 'Development Partner', desc: 'Ongoing product/project support from concept through delivery, launch and scaling.' },
    ],
    personas: ['Founders', 'Operators', 'Software teams', 'Growth teams'],
    ctaLabel: 'Develop a product',
    relatedSlugs: ['writing', 'ai-automation'],
  },
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const service = serviceData[slug]
  if (!service) notFound()
  return <ServicePageClient slug={slug} service={service} />
}
