'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

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

  // Update breadcrumb text and page title
  useEffect(() => {
    if (!heading) return

    // Update the breadcrumb last item
    const breadcrumbLast = document.querySelector('.step-nav .step-nav__last')
    if (breadcrumbLast && breadcrumbLast.textContent?.trim() === 'Publications') {
      breadcrumbLast.textContent = heading
    }

    // Update browser tab title
    document.title = `${heading} | BBforPeace CMS`
  }, [heading])

  if (!heading) return null

  return (
    <>
      <style>{`
        /* Hide default Payload heading when our custom header is present */
        .collection-list--publications .list-header__title {
          display: none !important;
        }
        .collection-list--publications .collection-list__sub-header {
          display: none !important;
        }
      `}</style>
      <div className="pub-custom-header" style={{
        marginBottom: '0.5rem',
        marginTop: '-1rem',
      }}>
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
