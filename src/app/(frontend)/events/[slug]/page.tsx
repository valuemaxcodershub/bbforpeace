import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayloadClient } from '@/lib/payload-client'
import { PageHero } from '@/components/layout'
import { formatDate, getMediaUrl } from '@/lib/utils'
import {
  Calendar,
  MapPin,
  Users,
  ExternalLink,
  ArrowLeft,
} from 'lucide-react'

interface Props {
  params: Promise<{ slug: string }>
}

async function getEvent(slug: string) {
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'events',
      where: { slug: { equals: slug } },
      depth: 2,
      limit: 1,
    })
    return result.docs[0] || null
  } catch (error) {
    console.error('Failed to fetch event:', error)
    return null
  }
}

async function getUpcomingEvents(excludeId: number | string) {
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'events',
      where: {
        status: { in: ['upcoming', 'ongoing'] },
        id: { not_equals: excludeId },
      },
      sort: 'startDate',
      depth: 1,
      limit: 3,
    })
    return result.docs
  } catch (error) {
    console.error('Failed to fetch upcoming events:', error)
    return []
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const event = await getEvent(slug)
  if (!event) return { title: 'Event Not Found | BB4Peace' }

  return {
    title: event.seo?.metaTitle || `${event.title} | BB4Peace`,
    description: event.seo?.metaDescription || event.excerpt || `${event.title} at ${event.location}`,
    openGraph: {
      title: event.title,
      description: event.excerpt || `Join us at ${event.location}`,
      type: 'article',
      images: event.featuredImage && typeof event.featuredImage === 'object'
        ? [{ url: event.featuredImage.url! }]
        : [],
    },
    twitter: { card: 'summary_large_image' },
  }
}

const statusConfig: Record<string, { label: string; bg: string; text: string }> = {
  upcoming: { label: 'Upcoming', bg: 'bg-blue-100', text: 'text-blue-800' },
  ongoing: { label: 'Ongoing', bg: 'bg-green-100', text: 'text-green-800' },
  completed: { label: 'Completed', bg: 'bg-gray-100', text: 'text-gray-700' },
  cancelled: { label: 'Cancelled', bg: 'bg-red-100', text: 'text-red-800' },
}

function RichTextContent({ content }: { content: any }) {
  if (!content) return null
  if (typeof content === 'object' && content.root) {
    return <RichTextNode node={content.root} />
  }
  if (typeof content === 'string') {
    return <div dangerouslySetInnerHTML={{ __html: content }} />
  }
  return null
}

function RichTextNode({ node }: { node: any }) {
  if (!node) return null

  if (node.type === 'text') {
    let text: React.ReactNode = node.text
    if (node.format & 1) text = <strong>{text}</strong>
    if (node.format & 2) text = <em>{text}</em>
    if (node.format & 8) text = <u>{text}</u>
    if (node.format & 16) text = <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">{text}</code>
    return <>{text}</>
  }

  if (node.type === 'linebreak') return <br />

  const children = node.children?.map((child: any, i: number) => (
    <RichTextNode key={i} node={child} />
  ))

  switch (node.type) {
    case 'root':
      return <>{children}</>
    case 'paragraph':
      return <p className="mb-4 leading-relaxed">{children}</p>
    case 'heading': {
      const HeadingTag = (`h${node.tag?.replace('h', '') || '2'}`) as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
      const cls: Record<string, string> = {
        h1: 'text-3xl font-bold mt-8 mb-4',
        h2: 'text-2xl font-bold mt-8 mb-3',
        h3: 'text-xl font-semibold mt-6 mb-3',
        h4: 'text-lg font-semibold mt-4 mb-2',
      }
      return <HeadingTag className={cls[node.tag] || 'text-lg font-semibold mt-4 mb-2'}>{children}</HeadingTag>
    }
    case 'list':
      if (node.listType === 'number') {
        return <ol className="list-decimal list-inside mb-4 space-y-1">{children}</ol>
      }
      return <ul className="list-disc list-inside mb-4 space-y-1">{children}</ul>
    case 'listitem':
      return <li>{children}</li>
    case 'link':
      return (
        <a
          href={node.fields?.url || '#'}
          target={node.fields?.newTab ? '_blank' : undefined}
          rel={node.fields?.newTab ? 'noopener noreferrer' : undefined}
          className="text-primary-700 hover:text-primary-900 underline"
        >
          {children}
        </a>
      )
    case 'quote':
      return (
        <blockquote className="border-l-4 border-primary-500 pl-4 my-6 italic text-gray-700">
          {children}
        </blockquote>
      )
    default:
      return <>{children}</>
  }
}

export default async function EventDetailPage({ params }: Props) {
  const { slug } = await params
  const event = await getEvent(slug)
  if (!event) notFound()

  const featuredImage = getMediaUrl(event.featuredImage)
  const status = statusConfig[event.status] || statusConfig.upcoming
  const upcomingEvents = await getUpcomingEvents(event.id)

  return (
    <>
      <PageHero
        title={event.title}
        subtitle={status.label}
        backgroundImage={featuredImage}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Events', href: '/events' },
          { label: event.title },
        ]}
      />

      <article className="py-16">
        <div className="container">
          <div className="max-w-5xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-12">
              {/* Main Content */}
              <div className="lg:col-span-2">
                {/* Featured Image */}
                <div className="relative aspect-video rounded-2xl overflow-hidden mb-8 shadow-xl">
                  <Image
                    src={featuredImage}
                    alt={event.title}
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className={`absolute top-4 right-4 px-4 py-2 rounded-full font-semibold text-sm ${status.bg} ${status.text}`}>
                    {status.label}
                  </div>
                </div>

                {/* Description */}
                <div className="prose prose-lg max-w-none text-gray-700">
                  <RichTextContent content={event.description} />
                </div>

                {/* Back Link */}
                <div className="mt-10 pt-8 border-t">
                  <Link
                    href="/events"
                    className="inline-flex items-center gap-2 text-primary-900 hover:text-primary-700 font-semibold transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Events
                  </Link>
                </div>
              </div>

              {/* Sidebar */}
              <aside className="lg:col-span-1">
                <div className="sticky top-24 space-y-6">
                  {/* Event Details Card */}
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-5">Event Details</h3>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-primary-100 text-primary-900 shrink-0">
                          <Calendar className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Date</p>
                          <p className="text-sm text-gray-600">{formatDate(event.startDate)}</p>
                          {event.endDate && (
                            <p className="text-sm text-gray-500">to {formatDate(event.endDate)}</p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-emerald-100 text-emerald-700 shrink-0">
                          <MapPin className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Location</p>
                          <p className="text-sm text-gray-600">{event.location}</p>
                          {event.venue && (
                            <p className="text-sm text-gray-500">{event.venue}</p>
                          )}
                        </div>
                      </div>

                      {event.maxAttendees && (
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-amber-100 text-amber-700 shrink-0">
                            <Users className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">Capacity</p>
                            <p className="text-sm text-gray-600">{event.maxAttendees} attendees</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Registration Button */}
                    {event.registrationLink && event.status !== 'completed' && event.status !== 'cancelled' && (
                      <a
                        href={event.registrationLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-6 w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary-900 text-white font-semibold hover:bg-primary-800 transition-colors"
                      >
                        Register Now
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>

                  {/* Other Upcoming Events */}
                  {upcomingEvents.length > 0 && (
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-4">Upcoming Events</h3>
                      <div className="space-y-4">
                        {upcomingEvents.map((e: any) => (
                          <Link
                            key={e.id}
                            href={`/events/${e.slug}`}
                            className="block group"
                          >
                            <div className="flex gap-3">
                              <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 relative">
                                <Image
                                  src={getMediaUrl(e.featuredImage)}
                                  alt={e.title}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-semibold text-gray-900 line-clamp-2 group-hover:text-primary-700 transition-colors">
                                  {e.title}
                                </h4>
                                <p className="text-xs text-gray-500 mt-1">{formatDate(e.startDate)}</p>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </aside>
            </div>
          </div>
        </div>
      </article>
    </>
  )
}
