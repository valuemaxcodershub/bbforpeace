'use client'

import { useSearchParams } from 'next/navigation'

const headingMap: Record<string, string> = {
  publication: 'Publications Settings',
  'annual-report': 'Annual Report Settings',
  'project-report': 'Project Report Settings',
  'strategic-plan': 'Strategic Report Settings',
}

const descriptionMap: Record<string, string> = {
  publication: 'Manage publications and downloadable resources',
  'annual-report': 'Manage annual reports',
  'project-report': 'Manage project reports',
  'strategic-plan': 'Manage strategic plans and documents',
}

export function PublicationsListHeader() {
  const searchParams = useSearchParams()

  // Extract the subMenu filter value from Payload's encoded where clause
  let subMenu: string | null = null
  searchParams.forEach((value, key) => {
    if (key.includes('subMenu') && key.includes('equals')) {
      subMenu = value
    }
  })

  const heading = subMenu ? headingMap[subMenu] : null
  const description = subMenu ? descriptionMap[subMenu] : null

  if (!heading) return null

  // Render a custom header and use CSS to hide Payload's default one
  return (
    <>
      {/* Inject a style tag to hide the default Payload heading for this view */}
      <style>{`
        .pub-custom-header ~ .list-header,
        .pub-custom-header ~ [class*="ListHeader"],
        .pub-custom-header ~ [class*="list-header"] {
          display: none !important;
        }
      `}</style>
      <div className="pub-custom-header" style={{ marginBottom: '1rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>{heading}</h1>
        {description && (
          <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0.25rem 0 0' }}>
            {description}
          </p>
        )}
      </div>
    </>
  )
}
