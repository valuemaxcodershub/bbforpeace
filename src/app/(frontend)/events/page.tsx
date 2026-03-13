import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { PageHero } from '@/components/layout'
import { Calendar, MapPin, Filter, Clock, Users, ArrowRight, Sparkles } from 'lucide-react'
import { getPayload } from 'payload'
import config from '@payload-config'
import { getMediaUrl } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Events | BBFORPEACE',
  description:
    'Discover upcoming events, workshops, and conferences from Building Blocks for Peace Foundation.',
}

const eventsHero = {
  title: 'Events',
  subtitle: 'Join Us',
  description:
    'Join our workshops, conferences, and community events. Learn, connect, and contribute to building peace.',
  backgroundImage: '/images/_VEE6792.jpg',
}

export default async function EventsPage({ searchParams }: { searchParams: Promise<{ filter?: string }> }) {
  const { filter: activeFilter } = await searchParams
  const payload = await getPayload({ config })

  let upcomingEvents: any[] = []
  let pastEvents: any[] = []
  try {
    const [upcomingResult, pastResult] = await Promise.all([
      payload.find({ collection: 'events', where: { status: { in: ['upcoming', 'ongoing'] } }, sort: 'startDate', limit: 10, depth: 1 }),
      payload.find({ collection: 'events', where: { status: { equals: 'completed' } }, sort: '-startDate', limit: 10, depth: 1 }),
    ])
    upcomingEvents = upcomingResult.docs
    pastEvents = pastResult.docs
  } catch (error) {
    console.error('Failed to fetch events:', error)
  }

  const normalize = (events: any[]) => {
    return events.map((e: any) => ({
      id: e.id,
      title: e.title,
      excerpt: e.excerpt || '',
      slug: e.slug,
      featuredImage: getMediaUrl(e.featuredImage),
      location: e.location || '',
      startDate: e.startDate,
      endDate: e.endDate || null,
      type: e.status === 'upcoming' ? 'Upcoming' : e.status === 'ongoing' ? 'Ongoing' : 'Event',
      maxAttendees: e.maxAttendees || null,
      isFeatured: e.isFeatured || false,
    }))
  }

  const allUpcoming = normalize(upcomingEvents)
  const allPast = normalize(pastEvents)

  // Filter based on search param
  let displayUpcoming = allUpcoming
  const displayPast = allPast
  let showUpcoming = true
  let showPast = true

  if (activeFilter === 'Past') {
    showUpcoming = false
  } else if (activeFilter === 'Ongoing') {
    displayUpcoming = allUpcoming.filter(e => e.type === 'Ongoing')
    showPast = false
  } else if (activeFilter === 'Upcoming') {
    displayUpcoming = allUpcoming.filter(e => e.type === 'Upcoming')
    showPast = false
  }
  // 'All' or no filter shows everything

  const featuredEvent = displayUpcoming.find((e: any) => e.isFeatured) || displayUpcoming[0]
  const otherUpcoming = displayUpcoming.filter((e: any) => e.id !== featuredEvent?.id)

  const filters = ['All', 'Upcoming', 'Ongoing', 'Past']
  const eventTypes = ['All Types', 'Conference', 'Workshop', 'Training', 'Webinar', 'Summit']

  return (
    <>
      <PageHero
        title={eventsHero.title}
        subtitle={eventsHero.subtitle}
        description={eventsHero.description}
        backgroundImage={eventsHero.backgroundImage}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Events', href: '/events' },
        ]}
      />

      {/* Filters */}
        <section className="py-6 border-b bg-white/95 backdrop-blur-md sticky top-0 z-30 shadow-sm">
          <div className="container">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              {/* Status Filters */}
              <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
                <Filter className="w-5 h-5 text-gray-400 flex-shrink-0" />
                {filters.map((filter) => {
                  const isActive = filter === 'All' ? !activeFilter : activeFilter === filter
                  const href = filter === 'All' ? '/events' : `/events?filter=${encodeURIComponent(filter)}`
                  return (
                    <Link
                      key={filter}
                      href={href}
                      className={`px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                        isActive
                          ? 'bg-primary-900 text-white shadow-lg shadow-primary-900/30'
                          : 'bg-gray-100 text-gray-700 hover:bg-primary-100 hover:text-primary-900'
                      }`}
                    >
                      {filter}
                    </Link>
                  )
                })}
              </div>

              {/* Event Type */}
              <select className="px-5 py-3.5 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-primary-500 text-sm font-medium">
                {eventTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* Featured Event */}
        {showUpcoming && featuredEvent && (
          <section className="py-16 bg-white">
            <div className="container">
              <div className="max-w-5xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-12 items-center" data-scroll="up">
                <div className="relative">
                  <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
                    <Image 
                      src={featuredEvent.featuredImage} 
                      alt={featuredEvent.title} 
                      fill 
                      className="object-cover" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary-950/50 to-transparent" />
                  </div>
                  <div className="absolute top-5 left-5">
                    <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold bg-accent-gold text-primary-950 shadow-lg">
                      <Sparkles className="w-3.5 h-3.5" />
                      Featured Event
                    </span>
                  </div>
                  <div className="absolute bottom-5 left-5 right-5">
                    <div className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/95 text-primary-900 font-bold backdrop-blur-sm shadow-lg">
                      <Calendar className="w-5 h-5" />
                      {new Date(featuredEvent.startDate).toLocaleDateString('en-US', { 
                        month: 'short', day: 'numeric', year: 'numeric' 
                      })}
                      {featuredEvent.endDate && (
                        <> - {new Date(featuredEvent.endDate).toLocaleDateString('en-US', { day: 'numeric' })}</>
                      )}
                    </div>
                  </div>
                  <div className="absolute -z-10 w-full h-full rounded-3xl -bottom-5 -right-5 bg-gradient-to-br from-primary-200 to-primary-100" />
                </div>
                <div>
                  <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold bg-green-100 text-green-700 mb-5">
                    {featuredEvent.type} • Upcoming
                  </span>
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-5 leading-tight">{featuredEvent.title}</h2>
                  <p className="text-gray-600 text-lg mb-8">{featuredEvent.excerpt}</p>
                  
                  <div className="flex flex-wrap gap-5 mb-10">
                    <div className="flex items-center gap-2 text-gray-600">
                      <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-primary-900" />
                      </div>
                      {featuredEvent.location}
                    </div>
                    {featuredEvent.maxAttendees && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center">
                          <Users className="w-5 h-5 text-primary-900" />
                        </div>
                        {featuredEvent.maxAttendees} expected
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-4">
                    <Link 
                      href={`/events/${featuredEvent.slug}`}
                      className="inline-flex items-center gap-2 px-7 py-4 bg-primary-900 text-white font-bold rounded-xl hover:bg-primary-800 transition-colors shadow-lg shadow-primary-900/30"
                    >
                      Register Now <ArrowRight className="w-5 h-5" />
                    </Link>
                    <Link 
                      href={`/events/${featuredEvent.slug}`}
                      className="inline-flex items-center gap-2 px-7 py-4 border-2 border-gray-200 text-gray-700 font-bold rounded-xl hover:border-primary-900 hover:text-primary-900 transition-colors"
                    >
                      Learn More
                    </Link>
                  </div>
                </div>
              </div>
              </div>
            </div>
          </section>
        )}

        {/* More Upcoming Events */}
        {showUpcoming && otherUpcoming.length > 0 && (
          <section className="py-20 bg-gray-50">
            <div className="container">
              <div className="flex items-center mb-10" data-scroll="up">
                <div className="w-12 h-12 rounded-2xl bg-primary-100 flex items-center justify-center mr-4">
                  <Calendar className="w-6 h-6 text-primary-900" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">More Upcoming Events</h2>
              </div>
              
              <div className="max-w-5xl mx-auto">
              <div className="grid md:grid-cols-2 gap-6">
                {otherUpcoming.map((event, idx) => (
                  <Link key={event.id} href={`/events/${event.slug}`} className="group" data-scroll="scale" data-delay={idx * 100}>
                    <article className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all flex border border-gray-100">
                      <div className="relative w-44 flex-shrink-0">
                        <Image 
                          src={event.featuredImage} 
                          alt={event.title} 
                          fill 
                          className="object-cover group-hover:scale-105 transition-transform duration-500" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-primary-950/30 to-transparent" />
                      </div>
                      <div className="p-6 flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-primary-100 text-primary-900">
                            {event.type}
                          </span>
                          <span className="text-sm text-gray-500 font-medium">
                            {new Date(event.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                        <h3 className="font-bold text-gray-900 text-lg mb-2 group-hover:text-primary-900 transition-colors">
                          {event.title}
                        </h3>
                        <div className="flex items-center gap-1.5 text-sm text-gray-500">
                          <MapPin className="w-4 h-4" />
                          {event.location}
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
              </div>
            </div>
          </section>
        )}

        {/* Past Events */}
        {showPast && displayPast.length > 0 && (
        <section className="py-20 bg-white">
          <div className="container">
            <div className="text-center mb-14" data-scroll="up">
              <span className="inline-flex items-center gap-3 justify-center text-primary-900 text-sm font-semibold uppercase tracking-widest mb-4">
                <span className="w-8 h-[2px] bg-primary-900" />
                Archive
                <span className="w-8 h-[2px] bg-primary-900" />
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Past Events</h2>
            </div>
            <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayPast.map((event: any, idx: number) => (
                <Link key={event.id} href={`/events/${event.slug}`} className="group" data-scroll="scale" data-delay={idx * 100}>
                  <article className="bg-gray-50 rounded-3xl overflow-hidden hover:shadow-xl transition-all border border-gray-100">
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <Image 
                        src={event.featuredImage} 
                        alt={event.title} 
                        fill 
                        className="object-cover grayscale-[30%] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700" 
                      />
                      <div className="absolute inset-0 bg-primary-950/20 group-hover:bg-primary-950/10 transition-colors" />
                      <div className="absolute top-4 left-4">
                        <span className="inline-block px-3 py-1.5 rounded-full text-xs font-bold bg-white/95 text-gray-700 shadow-lg backdrop-blur-sm">
                          {event.type}
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                        <Clock className="w-4 h-4" />
                        {new Date(event.startDate).toLocaleDateString('en-US', { 
                          year: 'numeric', month: 'short', day: 'numeric' 
                        })}
                      </div>
                      <h3 className="font-bold text-gray-900 text-lg mb-2 group-hover:text-primary-900 transition-colors leading-snug">
                        {event.title}
                      </h3>
                      <div className="flex items-center gap-1.5 text-sm text-gray-500">
                        <MapPin className="w-4 h-4" />
                        {event.location}
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
            </div>
            
            {/* Load More */}
            <div className="mt-16 text-center" data-scroll="up">
              <button className="inline-flex items-center gap-2 px-8 py-4 border-2 border-primary-900 text-primary-900 font-bold rounded-xl hover:bg-primary-900 hover:text-white transition-all shadow-lg">
                View More Past Events
              </button>
            </div>
          </div>
        </section>
        )}

        {/* CTA Section */}
        <section 
          className="py-24 relative overflow-hidden bg-fixed bg-cover bg-center"
          style={{ backgroundImage: 'url(/images/PXL_20251023_124331635.MP~2.jpg)' }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary-950/95 via-primary-900/90 to-primary-950/95" />
          <div className="container relative z-10">
            <div className="max-w-3xl mx-auto text-center" data-scroll="up">
              <span className="inline-flex items-center gap-3 justify-center text-accent-gold text-sm font-semibold uppercase tracking-widest mb-6">
                <span className="w-8 h-[2px] bg-accent-gold" />
                Partner With Us
                <span className="w-8 h-[2px] bg-accent-gold" />
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
                Want to Host an Event?
              </h2>
              <p className="text-gray-300 text-lg mb-10">
                Partner with us to organize peacebuilding events, workshops, or training sessions in your community.
              </p>
              <Link 
                href="/contact" 
                className="inline-flex items-center gap-2 px-8 py-4 bg-accent-gold text-primary-950 font-bold rounded-xl hover:bg-yellow-400 transition-colors shadow-lg shadow-accent-gold/30"
              >
                Contact Us <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>
    </>
  )
}
