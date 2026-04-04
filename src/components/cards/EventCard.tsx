import Link from 'next/link'
import Image from 'next/image'
import { Calendar, MapPin, ArrowRight } from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface EventCardProps {
  event: {
    id: string
    title: string
    excerpt?: string
    slug: string
    featuredImage: string
    location: string
    startDate: string
    endDate?: string
    status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled'
  }
  index?: number
}

const statusStyles = {
  upcoming: { bg: 'linear-gradient(135deg, #1f97d4, #26bde2)', label: 'Upcoming' },
  ongoing: { bg: 'linear-gradient(135deg, #4c9f38, #26bde2)', label: 'Ongoing' },
  completed: { bg: 'linear-gradient(135deg, #6b7280, #9ca3af)', label: 'Completed' },
  cancelled: { bg: 'linear-gradient(135deg, #e5243b, #ff6b6b)', label: 'Cancelled' },
}

export function EventCard({ event, index = 0 }: EventCardProps) {
  const eventDate = new Date(event.startDate)
  const day = eventDate.getDate()
  const month = eventDate.toLocaleDateString('en-US', { month: 'short' })
  const status = statusStyles[event.status]

  return (
    <article className="group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
      <Link href={`/events/${event.slug}`} className="flex flex-col md:flex-row">
        {/* Date Badge (Desktop) */}
        <div 
          className="hidden md:flex flex-col items-center justify-center text-white px-8 py-6 min-w-28"
          style={{ background: 'linear-gradient(135deg, #28005b, #7c3aed)' }}
        >
          <span className="text-4xl font-bold">{day}</span>
          <span className="text-sm uppercase tracking-wider">{month}</span>
        </div>

        {/* Image */}
        <div className="relative aspect-video md:aspect-square md:w-56 shrink-0 overflow-hidden">
          <Image
            src={event.featuredImage}
            alt={event.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />
          
          {/* Date Badge (Mobile) */}
          <div 
            className="md:hidden absolute top-4 left-4 px-4 py-2 rounded-2xl text-white text-center"
            style={{ background: 'linear-gradient(135deg, #28005b, #7c3aed)' }}
          >
            <span className="text-2xl font-bold block">{day}</span>
            <span className="text-xs uppercase">{month}</span>
          </div>

          {/* Status Badge */}
          <div 
            className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold text-white"
            style={{ background: status.bg }}
          >
            {status.label}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-900 transition-colors line-clamp-2">
            {event.title}
          </h3>
          
          <div className="space-y-2 text-sm text-gray-600 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #e5243b, #ffa500)' }}>
                <Calendar className="w-3 h-3 text-white" />
              </div>
              <span>{formatDate(event.startDate)}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #4c9f38, #26bde2)' }}>
                <MapPin className="w-3 h-3 text-white" />
              </div>
              <span className="line-clamp-1">{event.location}</span>
            </div>
          </div>
          
          {event.excerpt && (
            <p className="text-gray-600 text-sm line-clamp-2 mb-4">
              {event.excerpt}
            </p>
          )}
          
          <span className="inline-flex items-center text-primary-900 font-semibold text-sm group-hover:text-primary-700">
            View Details
            <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </span>
        </div>
      </Link>
    </article>
  )
}
