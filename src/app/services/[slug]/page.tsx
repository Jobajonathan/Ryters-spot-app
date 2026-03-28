import { notFound } from 'next/navigation'
import ServicePageClient from './ServicePageClient'

export type ServiceData = {
  icon: string
  title: string
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
    icon: '🤖',
    title: 'AI Automation',
    tagline: 'Intelligent automation for the modern enterprise.',
    description: 'We help organisations harness the power of artificial intelligence to automate workflows, reduce operational costs and build sustainable competitive advantage at scale.',
    features: [
      { title: 'AI Strategy & Roadmapping', desc: 'We assess your current operations and design a practical AI adoption roadmap that aligns with your business goals — no hype, just actionable strategy.' },
      { title: 'Workflow Automation', desc: 'Identify and automate repetitive, high-volume processes across your organisation. From document processing to customer communications and internal approvals.' },
      { title: 'LLM Integration & Deployment', desc: 'Integrate large language models (GPT-4, Claude, Gemini) into your products, internal tools and workflows — securely and responsibly.' },
      { title: 'AI Training & Enablement', desc: 'Upskill your team to understand, work with and govern AI systems confidently. Bespoke training programmes for technical and non-technical staff.' },
    ],
    offerings: [
      { name: 'AI Readiness Assessment', desc: 'A structured audit of your processes, data and infrastructure to identify the highest-value AI opportunities.' },
      { name: 'Automation POC & Pilot', desc: 'Build and validate a proof of concept before committing to full-scale deployment.' },
      { name: 'Full AI Implementation', desc: 'End-to-end delivery from scoping through deployment, testing and handover.' },
      { name: 'Ongoing AI Advisory', desc: 'Retained advisory support as your AI capability matures and scales.' },
    ],
    personas: ['Enterprise Businesses', 'SMEs & Startups', 'Government Agencies', 'Financial Services'],
    ctaLabel: 'Start Your AI Journey',
    relatedSlugs: ['product-management', 'edtech'],
  },
  'edtech': {
    icon: '🎓',
    title: 'EdTech Services',
    tagline: 'Transforming how organisations teach, learn and develop.',
    description: 'We design and deploy educational technology solutions that help institutions and organisations deliver learning at scale — engaging, accessible and measurable.',
    features: [
      { title: 'LMS Design & Deployment', desc: 'Full learning management system strategy, configuration, content migration and rollout. Moodle, Canvas, TalentLMS, custom platforms and more.' },
      { title: 'Interactive Content Development', desc: 'SCORM-compliant eLearning modules, video-based learning, assessments and gamified content built to your curriculum and brand.' },
      { title: 'eLearning Platform Strategy', desc: 'We help you define the right technology stack, vendor selection, and digital learning architecture for your institution.' },
      { title: 'Digital Assessment Design', desc: 'Secure, scalable online assessment systems — from formative quizzes to high-stakes examinations.' },
    ],
    offerings: [
      { name: 'EdTech Audit & Strategy', desc: 'Review your current learning technology landscape and build a prioritised transformation plan.' },
      { name: 'LMS Implementation', desc: 'End-to-end LMS setup, configuration, and training for administrators and learners.' },
      { name: 'Content Development', desc: 'Bespoke eLearning content created by instructional designers and subject matter experts.' },
      { name: 'EdTech Training', desc: 'Upskill educators and trainers to use digital tools effectively and confidently.' },
    ],
    personas: ['Universities & Colleges', 'Corporate L&D Teams', 'Government Training Bodies', 'EdTech Startups'],
    ctaLabel: 'Transform Your Learning Environment',
    relatedSlugs: ['ai-automation', 'writing'],
  },
  'writing': {
    icon: '📖',
    title: 'Writing & Research',
    tagline: 'Expert writing and research for academics, businesses and institutions.',
    description: 'From doctoral dissertations to corporate content strategy, our team of specialist writers, researchers and analysts delivers work of the highest standard — on time, every time.',
    features: [
      { title: 'Academic Writing Support', desc: 'Specialist support for postgraduate students, PhD candidates and researchers. Dissertation writing, editing, proofreading and advisory.' },
      { title: 'Content Strategy & Creation', desc: 'Research-backed content that builds authority, drives traffic and converts readers into clients. Blogs, whitepapers, case studies and reports.' },
      { title: 'Data Analysis & Interpretation', desc: 'Quantitative and qualitative data analysis using SPSS, R, NVivo and Python. Clear interpretation and presentation of complex findings.' },
      { title: 'Research & Literature Review', desc: 'Comprehensive systematic reviews, annotated bibliographies and research synthesis for academic and commercial purposes.' },
    ],
    offerings: [
      { name: 'Dissertation & Thesis Support', desc: 'Structured support from proposal through submission — writing, editing, methodology and viva preparation.' },
      { name: 'Journal Article Preparation', desc: 'Transform your research into publication-ready manuscripts for peer-reviewed journals.' },
      { name: 'Corporate Content Packages', desc: 'Monthly content creation and strategy retainers for businesses building thought leadership.' },
      { name: 'Turnitin & Plagiarism Review', desc: 'Pre-submission integrity checks and editing to ensure your work is original and compliant.' },
    ],
    personas: ['PhD & Postgraduate Students', 'Academic Researchers', 'Businesses & Brands', 'Publishers & NGOs'],
    ctaLabel: 'Get Writing & Research Support',
    relatedSlugs: ['edtech', 'product-management'],
  },
  'product-management': {
    icon: '🚀',
    title: 'Product & Project Management',
    tagline: 'From strategy to launch — delivering products and projects that matter.',
    description: 'We partner with product teams, executives and founders to define, build and ship products and projects that delight users and deliver real business outcomes.',
    features: [
      { title: 'Product Strategy & Roadmapping', desc: 'Define your product vision, set objectives, prioritise features and build a clear roadmap that aligns stakeholders and guides your team.' },
      { title: 'Agile Delivery & PMO', desc: 'Experienced scrum masters, agile coaches and project managers embedded in your team or working as an external PMO function.' },
      { title: 'User Research & Validation', desc: 'Qualitative and quantitative research to validate assumptions, understand user needs and inform product decisions with confidence.' },
      { title: 'Go-to-Market Planning', desc: 'Launch strategy, positioning, pricing and messaging that gives your product the best chance of market success.' },
    ],
    offerings: [
      { name: 'Product Discovery Sprint', desc: 'A structured 2–4 week engagement to clarify your product opportunity and define the MVP scope.' },
      { name: 'Agile Delivery Partner', desc: 'Embedded project management and agile facilitation for your delivery team.' },
      { name: 'Product Leadership Advisory', desc: 'Fractional CPO or Head of Product support for growing organisations.' },
      { name: 'Post-Launch Optimisation', desc: 'Analytics, user feedback loops and iteration planning after your product goes live.' },
    ],
    personas: ['Founders & Startups', 'Enterprise Product Teams', 'Technology Companies', 'Government Digital Teams'],
    ctaLabel: 'Start Your Product Journey',
    relatedSlugs: ['ai-automation', 'writing'],
  },
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const service = serviceData[slug]
  if (!service) notFound()
  return <ServicePageClient slug={slug} service={service} />
}
