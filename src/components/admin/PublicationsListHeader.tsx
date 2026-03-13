'use client'

import { useSearchParams } from 'next/navigation'

const headingMap: Record<string, string> = {
  publication: 'Publications Settings',
  'annual-report': 'Annual Report Settings',
  'project-report': 'Project Report Settings',
  'strategic-plan': 'Strategic Report Settings',
}

export function PublicationsListHeader() {
  const searchParams = useSearchParams()

  // Extract the subMenu filter value from Payload's encoded where clause
  // Pattern: where[or][0][and][0][subMenu][equals]=<value>
  let subMenu: string | null = null
  searchParams.forEach((value, key) => {
    if (key.includes('subMenu') && key.includes('equals')) {
      subMenu = value
    }
  })

  const heading = subMenu ? headingMap[subMenu] : null
  if (!heading) return null

  return (
    <div style={{ marginBottom: '1rem' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 600, margin: 0 }}>{heading}</h2>
    </div>
  )
}
