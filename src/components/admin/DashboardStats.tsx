'use client'

import {
  Settings,
  Home,
  Info,
  Newspaper,
  FileBarChart2,
  Users,
  ArrowRight,
  type LucideIcon,
} from 'lucide-react'

type DashboardItem = {
  label: string
  description: string
  href: string
  icon: LucideIcon
  accent: string
}

const dashboardItems: DashboardItem[] = [
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
    href: '/admin/globals/reports-settings',
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

export function DashboardStats() {
  return (
    <section className="bb-dash">
      {/* Welcome banner */}
      <div className="bb-dash__welcome">
        <div className="bb-dash__welcome-text">
          <h1 className="bb-dash__heading">Welcome back 👋</h1>
          <p className="bb-dash__subheading">
            Manage your website content with quick access to every section.
          </p>
        </div>
        <div className="bb-dash__welcome-badge">
          <span>BBforPeace CMS</span>
        </div>
      </div>

      {/* Cards grid */}
      <div className="bb-dash__grid">
        {dashboardItems.map((item) => {
          const Icon = item.icon
          return (
            <a key={item.label} href={item.href} className="bb-dash-card">
              <div className="bb-dash-card__icon-wrap" style={{ background: item.accent }}>
                <Icon size={22} strokeWidth={2} color="#fff" />
              </div>
              <div className="bb-dash-card__body">
                <span className="bb-dash-card__label">{item.label}</span>
                <span className="bb-dash-card__desc">{item.description}</span>
              </div>
              <span className="bb-dash-card__arrow">
                <ArrowRight size={16} />
              </span>
            </a>
          )
        })}
      </div>
    </section>
  )
}
