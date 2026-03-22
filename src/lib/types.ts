export type UserRole = 'client' | 'admin'

export interface Profile {
  id: string
  email: string
  full_name: string
  role: UserRole
  country?: string
  company?: string
  avatar_url?: string
  created_at: string
}

export type ServiceType =
  | 'research_academic'
  | 'digital_transformation'
  | 'edtech'
  | 'product_management'

export type ProjectStatus =
  | 'pending'
  | 'in_review'
  | 'in_progress'
  | 'completed'
  | 'cancelled'

export interface Project {
  id: string
  client_id: string
  service: ServiceType
  title: string
  description: string
  deadline: string
  status: ProjectStatus
  created_at: string
  updated_at: string
}
