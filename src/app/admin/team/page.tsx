'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

// Redirect /admin/team to /admin/users (admins tab)
export default function TeamRedirect() {
  const router = useRouter()
  useEffect(() => { router.replace('/admin/users') }, [router])
  return null
}
