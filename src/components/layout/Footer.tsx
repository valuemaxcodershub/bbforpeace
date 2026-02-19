'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Facebook, Twitter, Instagram, Youtube, Linkedin, Mail, Phone, MapPin } from 'lucide-react'

const quickLinks = [
  { name: 'Home', href: '/' },
  { name: 'About Us', href: '/about' },
  { name: 'Programmes', href: '/programmes' },
  { name: 'Media', href: '/blog' },
  { name: 'Reports', href: '/publications' },
  { name: 'Contact', href: '/contact' },
  { name: 'Donate', href: '/donate' },
]

const programmes = [
  { name: 'Youth & Women Peace Security', href: '/programmes/youth-women-peace-security' },
  { name: 'Conflict Management', href: '/programmes/conflict-management' },
  { name: 'Governance & Accountability', href: '/programmes/governance-accountability' },
  { name: 'Peace Education', href: '/programmes/peace-education' },
]

const socialLinks = [
  { name: 'Twitter', href: 'https://twitter.com/bbforpeace', icon: Twitter },
  { name: 'Facebook', href: 'https://web.facebook.com/bbforpeace/?_rdc=1&_rdr', icon: Facebook },
  { name: 'Instagram', href: 'https://www.instagram.com/bbforpeace/', icon: Instagram },
  { name: 'YouTube', href: 'https://www.youtube.com/channel/UC10Im94vib-oh7AvVhZNPIg/videos', icon: Youtube },
  { name: 'LinkedIn', href: 'https://www.linkedin.com/company/43211235/', icon: Linkedin },
]

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-white">
      {/* Top accent */}
      <div className="h-1 bg-primary-900" />

      <div className="container py-14">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* About */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="relative w-10 h-10 rounded-full overflow-hidden">
                <Image
                  src="/images/logo.jpg"
                  alt="BBFORPEACE Logo"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <span className="block font-bold">BBFORPEACE</span>
                <span className="block text-[10px] text-gray-400">Building Blocks for Peace</span>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-3">
              <span className="text-accent-gold italic font-medium">Empowering Communities for Peace</span>
            </p>
            <p className="text-gray-400 text-sm leading-relaxed mb-5">
              A movement of young people committed to advocating for meaningful youth engagement in peacebuilding.
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
            <h4 className="font-semibold mb-5">Quick Links</h4>
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
            <h4 className="font-semibold mb-5">Programmes</h4>
            <ul className="space-y-2.5">
              {programmes.map((link) => (
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
            <h4 className="font-semibold mb-5">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-gray-400 text-sm">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>256, 1st Avenue, FHA, Lugbe, Abuja, Nigeria</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <a href="mailto:info@bbforpeace.org" className="hover:text-white transition-colors">
                  info@bbforpeace.org
                </a>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <a href="tel:+2348054151494" className="hover:text-white transition-colors">
                  +234-8054151494
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
              © {currentYear} BBFORPEACE. Developed by{' '}
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
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-500 hover:text-white transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
