import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHero } from '@/components/layout'
import { Newspaper, MessageSquareQuote, Camera, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Media | BB4Peace',
  description:
    'Press statements, testimonials, and gallery from Building Blocks for Peace Foundation.',
}

const sections = [
  {
    title: 'Press Statements',
    description:
      'Official announcements, press releases, and statements from Building Blocks for Peace Foundation.',
    href: '/media/press',
    icon: Newspaper,
    gradient: 'from-primary-600 to-primary-900',
  },
  {
    title: 'Testimonials',
    description:
      'Hear from community members, partners, and youth leaders about the impact of our peacebuilding work.',
    href: '/media/testimonials',
    icon: MessageSquareQuote,
    gradient: 'from-accent-gold to-amber-600',
  },
  {
    title: 'Gallery',
    description:
      'Photos and videos from our events, programmes, and community engagement activities.',
    href: '/gallery',
    icon: Camera,
    gradient: 'from-emerald-600 to-teal-700',
  },
]

export default function MediaPage() {
  return (
    <main>
      <PageHero
        title="Media"
        subtitle="News & Stories"
        description="Explore our press statements, testimonials, and photo gallery."
        backgroundImage="/images/_VEE7009 (1).jpg"
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Media', href: '/media' },
        ]}
      />

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {sections.map((section) => {
              const Icon = section.icon
              return (
                <Link
                  key={section.href}
                  href={section.href}
                  className="group relative rounded-2xl border border-gray-100 bg-white p-8 shadow-sm hover:shadow-xl transition-all"
                >
                  <div
                    className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-linear-to-br ${section.gradient} text-white mb-6`}
                  >
                    <Icon className="w-7 h-7" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-900 transition-colors">
                    {section.title}
                  </h2>
                  <p className="text-gray-600 mb-6 leading-relaxed">{section.description}</p>
                  <span className="inline-flex items-center gap-2 text-primary-900 font-semibold group-hover:gap-3 transition-all">
                    Explore
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
      </section>
    </main>
  )
}
