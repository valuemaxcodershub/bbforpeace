import { getPayload } from 'payload'
import config from '@payload-config'
import { HeaderClient } from './HeaderClient'
import { getMediaUrl } from '@/lib/utils'

const navigation = [
  { name: 'Home', href: '/' },
  {
    name: 'About Us',
    href: '/about',
    children: [
      { name: 'Who We Are', href: '/about', iconKey: 'users', description: 'Learn about our mission and vision' },
      { name: 'Our Strategy', href: '/about#strategy', iconKey: 'target', description: 'Our strategic approach to peacebuilding' },
      { name: 'Our Team', href: '/about#team', iconKey: 'userCircle', description: 'Meet the people behind BBFORPEACE' },
    ],
  },
  { name: 'Programmes', href: '/programmes' },
  { name: 'Events', href: '/events' },
  {
    name: 'Media',
    href: '/blog',
    children: [
      { name: 'Blog', href: '/blog', iconKey: 'bookOpen', description: 'Latest news and insights' },
      { name: 'Press Statements', href: '/media/press', iconKey: 'newspaper', description: 'Official press releases' },
      { name: 'Gallery', href: '/gallery', iconKey: 'imageIcon', description: 'Photos from our activities' },
      { name: 'Testimonials', href: '/media/testimonials', iconKey: 'messageSquareQuote', description: 'What people say about our work' },
    ],
  },
  {
    name: 'Reports',
    href: '/reports',
    children: [
      { name: 'Publications', href: '/publications', iconKey: 'fileText', description: 'Research and publications' },
      { name: 'Annual Reports', href: '/reports', iconKey: 'calendar', description: 'Yearly impact reports' },
      { name: 'Project Reports', href: '/reports/projects', iconKey: 'fileText', description: 'Project documentation' },
      { name: 'Strategic Plan', href: '/reports/strategic-plan', iconKey: 'target', description: 'Our strategic direction 2026-2030' },
    ],
  },
  { name: 'Contact', href: '/contact' },
]

async function getPayloadWithTimeout(timeoutMs = 12000) {
  return await Promise.race([
    getPayload({ config }),
    new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error(`Payload init timeout after ${timeoutMs}ms`)), timeoutMs)
    }),
  ])
}

export async function Header() {
  let siteName = 'Building Blocks for Peace'
  let siteTagline = '--Empowering Communities for Peace'
  let logoUrl = '/images/logo.jpg'
  let logoAlt = 'Building Blocks for Peace Logo'

  try {
    const payload = await getPayloadWithTimeout()
    const generalSettings = await payload.findGlobal({ slug: 'general-settings' }).catch(() => null)

    const general = (generalSettings || {}) as Record<string, any>
    siteName = general.siteName || siteName
    siteTagline = general.siteTagline ? `--${general.siteTagline}` : siteTagline
    logoUrl = getMediaUrl(general.logo, logoUrl)
    logoAlt = general.logoAlt || general.logo?.alt || general.siteName || logoAlt
  } catch (error) {
    console.error('Failed to fetch header settings:', error)
  }

  return (
    <HeaderClient
      navigation={navigation}
      siteName={siteName}
      siteTagline={siteTagline}
      logoUrl={logoUrl}
      logoAlt={logoAlt}
    />
  )
}
