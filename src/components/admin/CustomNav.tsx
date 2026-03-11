'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useMemo, useState } from 'react'
import type { LucideIcon } from 'lucide-react'
import {
  LayoutDashboard,
  Settings,
  House,
  Info,
  Layers,
  CalendarDays,
  Image,
  FileText,
  Phone,
  Users,
  LogOut,
  Circle,
} from 'lucide-react'

type MenuItem = {
  label: string
  href?: string
  children?: MenuItem[]
  icon?: LucideIcon
}

const menuConfig: MenuItem[] = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  {
    label: 'Global setting',
    icon: Settings,
    children: [
      { label: 'Partners settings', href: '/admin/globals/partners-settings', icon: Circle },
      { label: 'Award setting', href: '/admin/globals/award-settings', icon: Circle },
      { label: 'Footer setting', href: '/admin/globals/footer-settings', icon: Circle },
      { label: 'SEO', href: '/admin/globals/seo-settings', icon: Circle },
      { label: 'Social Media settings', href: '/admin/globals/social-media-settings', icon: Circle },
      { label: 'contact', href: '/admin/globals/contact-settings', icon: Circle },
      { label: 'General', href: '/admin/globals/general-settings', icon: Circle },
    ],
  },
  {
    label: 'Home page',
    icon: House,
    children: [
      { label: 'Hero section', href: '/admin/globals/home-page-settings', icon: Circle },
      { label: 'impact section', href: '/admin/globals/home-page-settings', icon: Circle },
      { label: 'why bbfor Peace section', href: '/admin/globals/home-page-settings', icon: Circle },
      { label: 'our focus and approach section', href: '/admin/globals/home-page-settings', icon: Circle },
      { label: 'our initiatives and watch our impact', href: '/admin/globals/home-page-settings', icon: Circle },
      { label: 'recent activities & Publications section', href: '/admin/globals/home-page-settings', icon: Circle },
    ],
  },
  {
    label: 'About us page',
    icon: Info,
    children: [
      { label: 'our story', href: '/admin/globals/about-us-page-settings', icon: Circle },
      { label: 'vision and Mission', href: '/admin/globals/about-us-page-settings', icon: Circle },
      { label: 'our core values and unique positioning', href: '/admin/globals/about-us-page-settings', icon: Circle },
      { label: 'meet our team and board of trustees section', href: '/admin/globals/about-us-page-settings', icon: Circle },
    ],
  },
  {
    label: 'Programme page',
    icon: Layers,
    children: [
      { label: 'page content and cta', href: '/admin/globals/programme-page-settings', icon: Circle },
      { label: 'programme items', href: '/admin/collections/programmes', icon: Circle },
    ],
  },
  {
    label: 'Event page',
    icon: CalendarDays,
    children: [
      { label: 'past Event', href: '/admin/globals/event-page-settings', icon: Circle },
      { label: 'Ongoing Event', href: '/admin/globals/event-page-settings', icon: Circle },
      { label: 'Upcoming Evenet', href: '/admin/globals/event-page-settings', icon: Circle },
    ],
  },
  {
    label: 'Media Page',
    icon: Image,
    children: [
      { label: 'Blog posts', href: '/admin/collections/posts', icon: Circle },
      { label: 'press statement', href: '/admin/collections/posts', icon: Circle },
      { label: 'gallery items', href: '/admin/collections/gallery-items', icon: Circle },
      { label: 'testimonials', href: '/admin/collections/testimonials', icon: Circle },
      { label: 'Post category', href: '/admin/collections/categories', icon: Circle },
    ],
  },
  {
    label: 'Reports',
    icon: FileText,
    children: [
      { label: 'Publications', href: '/admin/collections/publications', icon: Circle },
      { label: 'Annual report items', href: '/admin/collections/publications', icon: Circle },
      { label: 'Project report items', href: '/admin/collections/publications', icon: Circle },
      { label: 'Strategic plan items', href: '/admin/collections/publications', icon: Circle },
      { label: 'annual reports page content', href: '/admin/globals/reports-settings', icon: Circle },
    ],
  },
  {
    label: 'Contact us page',
    icon: Phone,
    children: [{ label: 'Contact page content', href: '/admin/globals/contact-us-page-settings', icon: Circle }],
  },
  {
    label: 'user',
    icon: Users,
    children: [
      { label: 'Admin', href: '/admin/collections/users', icon: Circle },
      { label: 'Subscribers', href: '/admin/collections/subscribers', icon: Circle },
    ],
  },
  { label: 'Logout', href: '/admin/logout', icon: LogOut },
]

function isActivePath(currentPath: string, href?: string) {
  if (!href) return false
  if (href === '/admin') return currentPath === '/admin'
  return currentPath.startsWith(href)
}

export function CustomNav() {
  const pathname = usePathname()

  const defaultExpanded = useMemo(() => {
    const expanded = new Set<string>()
    menuConfig.forEach((section) => {
      if (section.children?.some((child) => isActivePath(pathname, child.href))) {
        expanded.add(section.label)
      }
    })
    return expanded
  }, [pathname])

  const [expandedSections, setExpandedSections] = useState<Set<string>>(defaultExpanded)

  const toggleSection = (label: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev)
      if (next.has(label)) next.delete(label)
      else next.add(label)
      return next
    })
  }

  return (
    <aside className="bb-custom-nav">
      {menuConfig.map((section) => {
        const SectionIcon = section.icon || Circle

        if (!section.children) {
          return (
            <Link
              key={section.label}
              href={section.href || '/admin'}
              className={`bb-custom-nav__item ${isActivePath(pathname, section.href) ? 'is-active' : ''}`}
            >
              <span className="bb-custom-nav__item-content">
                <SectionIcon className="bb-custom-nav__icon" size={15} />
                <span>{section.label}</span>
              </span>
            </Link>
          )
        }

        const isOpen = expandedSections.has(section.label)

        return (
          <div key={section.label} className="bb-custom-nav__group">
            <button type="button" className="bb-custom-nav__parent" onClick={() => toggleSection(section.label)}>
              <span className="bb-custom-nav__item-content">
                <SectionIcon className="bb-custom-nav__icon" size={15} />
                <span>{section.label}</span>
              </span>
              <span className={`bb-custom-nav__caret ${isOpen ? 'is-open' : ''}`}>▾</span>
            </button>

            {isOpen && (
              <div className="bb-custom-nav__children">
                {section.children.map((child) => (
                  (() => {
                    const ChildIcon = child.icon || Circle

                    return (
                  <Link
                    key={`${section.label}-${child.label}`}
                    href={child.href || '/admin'}
                    className={`bb-custom-nav__child ${isActivePath(pathname, child.href) ? 'is-active' : ''}`}
                  >
                    <span className="bb-custom-nav__child-content">
                      <ChildIcon className="bb-custom-nav__icon bb-custom-nav__icon--child" size={10} />
                      <span>{child.label}</span>
                    </span>
                  </Link>
                    )
                  })()
                ))}
              </div>
            )}
          </div>
        )
      })}
    </aside>
  )
}
