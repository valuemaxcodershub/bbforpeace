'use client'

import { useAuth } from '@payloadcms/ui'
import Link from 'next/link'
import {
  ArrowRight,
  BookOpen,
  ClipboardList,
  FileBarChart2,
  FileText,
  Home,
  Image,
  Info,
  Newspaper,
  Settings,
  Users,
  type LucideIcon,
} from 'lucide-react'

type UserRole = 'super-admin' | 'admin' | 'editor'

type DashboardItem = {
  label: string
  description: string
  href: string
  icon: LucideIcon
  accent: string
}

const superAdminItems: DashboardItem[] = [
  {
    label: 'Global Settings',
    description: 'General, SEO, social, footer and menu',
    href: '/admin/globals/general-settings',
    icon: Settings,
    accent: '#8b5cf6',
  },
  {
    label: 'Home Page',
    description: 'Hero, impact, focus, initiatives and publications',
    href: '/admin/globals/home-page-settings',
    icon: Home,
    accent: '#6366f1',
  },
  {
    label: 'About Us Page',
    description: 'Story, vision, mission, values, team and board',
    href: '/admin/globals/about-us-page-settings',
    icon: Info,
    accent: '#3b82f6',
  },
  {
    label: 'Media Page',
    description: 'Blog, press statements and gallery content',
    href: '/admin/collections/posts',
    icon: Newspaper,
    accent: '#14b8a6',
  },
  {
    label: 'Reports',
    description: 'Publications, annual, project and strategic plan',
    href: '/admin/collections/publications',
    icon: FileBarChart2,
    accent: '#f59e0b',
  },
  {
    label: 'Users',
    description: 'Admins and subscribers management',
    href: '/admin/collections/users',
    icon: Users,
    accent: '#ec4899',
  },
]

const editorItems: DashboardItem[] = [
  {
    label: 'Blog Posts',
    description: 'Create and manage blog articles',
    href: '/admin/collections/posts?where%5Bor%5D%5B0%5D%5Band%5D%5B0%5D%5BsubMenu%5D%5Bequals%5D=blog',
    icon: Newspaper,
    accent: '#14b8a6',
  },
  {
    label: 'Press Statements',
    description: 'Manage press releases and statements',
    href: '/admin/collections/posts?where%5Bor%5D%5B0%5D%5Band%5D%5B0%5D%5BsubMenu%5D%5Bequals%5D=press-statement',
    icon: FileText,
    accent: '#6366f1',
  },
  {
    label: 'Gallery',
    description: 'Manage gallery images and media',
    href: '/admin/collections/gallery-items',
    icon: Image,
    accent: '#3b82f6',
  },
  {
    label: 'Publications',
    description: 'Manage publications and resources',
    href: '/admin/collections/publications?where%5Bor%5D%5B0%5D%5Band%5D%5B0%5D%5BsubMenu%5D%5Bequals%5D=publication',
    icon: BookOpen,
    accent: '#8b5cf6',
  },
  {
    label: 'Annual Reports',
    description: 'Manage annual report documents',
    href: '/admin/collections/publications?where%5Bor%5D%5B0%5D%5Band%5D%5B0%5D%5BsubMenu%5D%5Bequals%5D=annual-report',
    icon: FileBarChart2,
    accent: '#f59e0b',
  },
  {
    label: 'Project Reports',
    description: 'Manage project report documents',
    href: '/admin/collections/publications?where%5Bor%5D%5B0%5D%5Band%5D%5B0%5D%5BsubMenu%5D%5Bequals%5D=project-report',
    icon: ClipboardList,
    accent: '#ec4899',
  },
]

export function DashboardStats() {
  const { user } = useAuth()
  const userRole = (user as { role?: UserRole } | null)?.role

  if (!user) return null

  const isSuperAdmin = userRole === 'super-admin'
  const items = isSuperAdmin ? superAdminItems : editorItems

  return (
    <section className="bb-dash">
      <div className="bb-dash__welcome">
        <div className="bb-dash__welcome-text">
          <h1 className="bb-dash__heading">Welcome back 👋</h1>
          <p className="bb-dash__subheading">
            {isSuperAdmin
              ? 'Manage your website content with quick access to every section.'
              : 'Manage your content with quick access to your sections.'}
          </p>
        </div>
        <div className="bb-dash__welcome-badge">
          <span>BBforPeace CMS</span>
        </div>
      </div>

      <div className="bb-dash__grid">
        {items.map((item) => {
          const Icon = item.icon

          return (
            <Link key={item.label} href={item.href} className="bb-dash-card">
              <div className="bb-dash-card__icon-wrap" style={{ background: item.accent }}>
                <Icon size={22} strokeWidth={2} color="#fff" />
              </div>
              <div className="bb-dash-card__body">
                <span className="bb-dash-card__label">{item.label}</span>
                <span className="bb-dash-card__desc">{item.description}</span>
              </div>
              <span className="bb-dash-card__arrow" aria-hidden="true">
                <ArrowRight size={16} />
              </span>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
