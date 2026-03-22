import Link from 'next/link'
import Image from 'next/image'
import { Facebook, Twitter, Instagram, Youtube, Linkedin, Mail, Phone, MapPin } from 'lucide-react'
import { getPayload } from 'payload'
import config from '@payload-config'
import { getMediaUrl } from '@/lib/utils'

const quickLinks = [
  { name: 'Home', href: '/' },
  { name: 'About Us', href: '/about' },
  { name: 'Programmes', href: '/programmes' },
  { name: 'Media', href: '/blog' },
  { name: 'Reports', href: '/publications' },
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

const iconMap: Record<string, typeof Twitter> = {
  twitter: Twitter,
  facebook: Facebook,
  instagram: Instagram,
  youtube: Youtube,
  linkedin: Linkedin,
}

export async function Footer() {
  const currentYear = new Date().getFullYear()

  // Fetch CMS data
  let socialData: Record<string, string> = {}
  let footerData: Record<string, string> = {}
  let contactData: Record<string, string> = {}
  let generalData: Record<string, any> = {}
  let programmeLinks: Array<{ name: string; href: string }> = []

  try {
    const payload = await getPayloadWithTimeout()
    const [social, footer, contact, general, programmes] = await Promise.all([
      payload.findGlobal({ slug: 'social-media-settings' }),
      payload.findGlobal({ slug: 'footer-settings' }),
      payload.findGlobal({ slug: 'contact-settings' }),
      payload.findGlobal({ slug: 'general-settings' }),
      payload.find({
        collection: 'programmes',
        where: { status: { equals: 'active' } },
        sort: 'order',
        limit: 4,
        depth: 0,
      }),
    ])
    socialData = social as unknown as Record<string, string>
    footerData = footer as unknown as Record<string, string>
    contactData = contact as unknown as Record<string, string>
    generalData = general as unknown as Record<string, any>
    programmeLinks = programmes.docs.map((programme: any) => ({
      name: programme.title,
      href: '/programmes',
    }))
  } catch (error) {
    console.error('Failed to fetch footer settings:', error)
  }

  // Build social links from CMS data
  const socialEntries = ['twitter', 'facebook', 'instagram', 'youtube', 'linkedin'] as const
  const socialLinks = socialEntries
    .filter((key) => socialData[key])
    .map((key) => ({
      name: key.charAt(0).toUpperCase() + key.slice(1),
      href: socialData[key],
      icon: iconMap[key],
    }))

  const email = contactData.contactEmail || 'info@bbforpeace.org'
  const phone = contactData.phone || '+234-8054151494'
  const address = contactData.address || '256, 1st Avenue, FHA, Lugbe, Abuja, Nigeria'
  const footerText =
    footerData.footerText ||
    'A movement of young people committed to advocating for meaningful youth engagement in peacebuilding.'
  const siteName = generalData.siteName || 'Building Blocks for Peace'
  const siteTagline = generalData.siteTagline || 'Empowering Communities for Peace'
  const logoUrl = getMediaUrl(generalData.logo, '/images/logo.jpg')
  const logoAlt = generalData.logoAlt || generalData.logo?.alt || siteName
  const quickLinksTitle = footerData.quickLinksTitle || 'Quick Links'
  const programmesTitle = footerData.programmesTitle || 'Programmes'
  const contactTitle = footerData.contactTitle || 'Contact'
  const developedByText = footerData.developedByText || 'Developed by'
  const privacyLabel = footerData.privacyLabel || 'Privacy Policy'
  const termsLabel = footerData.termsLabel || 'Terms of Service'
  const copyrightText =
    footerData.copyrightText || `© ${currentYear} ${siteName}. All Rights Reserved.`

  return (
    <footer className="bg-gray-900 text-white">
      {/* Top accent */}
      <div className="h-1 bg-primary-900" />

      <div className="container py-14">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* About */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="relative w-12 h-12 rounded-full overflow-hidden">
                <Image
                  src={logoUrl}
                  alt={logoAlt}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <span className="block font-bold">{siteName}</span>
                <span className="block text-[10px] text-gray-400">— {siteTagline}</span>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-5">
              {footerText}
            </p>
            <div className="flex gap-2">
              {socialLinks.map((link) => (
                <a 
                  key={link.name}
                  href={link.href} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center hover:bg-primary-900 transition-colors"
                >
                  <link.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-5">{quickLinksTitle}</h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-gray-400 hover:text-white transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Programmes */}
          <div>
            <h4 className="font-semibold mb-5">{programmesTitle}</h4>
            <ul className="space-y-2.5">
              {(programmeLinks.length ? programmeLinks : [{ name: 'Programmes', href: '/programmes' }]).map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-gray-400 hover:text-white transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold mb-5">{contactTitle}</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-gray-400 text-sm">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{address}</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <a href={`mailto:${email}`} className="hover:text-white transition-colors">
                  {email}
                </a>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <a href={`tel:${phone.replace(/[^+\d]/g, '')}`} className="hover:text-white transition-colors">
                  {phone}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container py-5">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3 text-sm">
            <p className="text-gray-500 flex items-center gap-1 flex-wrap justify-center md:justify-start">
              {copyrightText.replace(/^©\s*\d{4}\s*/i, '© ')} {developedByText}{' '}
              <a 
                href="https://valuemaxonline.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-accent-gold hover:text-white transition-colors font-medium"
              >
                Valuemax CodersHub
              </a>
            </p>
            <div className="flex gap-5">
              <Link href="/privacy" className="text-gray-500 hover:text-white transition-colors">
                {privacyLabel}
              </Link>
              <Link href="/terms" className="text-gray-500 hover:text-white transition-colors">
                {termsLabel}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
