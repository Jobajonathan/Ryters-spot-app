export const ADMIN_ROLES = ['superadmin', 'admin', 'finance', 'support', 'content', 'operations'] as const

export type AdminRole = typeof ADMIN_ROLES[number]

export function isAdminRole(role: string | null | undefined): role is AdminRole {
  return typeof role === 'string' && (ADMIN_ROLES as readonly string[]).includes(role)
}

