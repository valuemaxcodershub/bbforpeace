import Image from 'next/image'
import { Linkedin, Twitter, Mail } from 'lucide-react'
import { getInitials } from '@/lib/utils'

const gradients = [
  'linear-gradient(135deg, #e5243b, #ff6b6b)',
  'linear-gradient(135deg, #4c9f38, #26bde2)',
  'linear-gradient(135deg, #ffa500, #fcc30b)',
  'linear-gradient(135deg, #1f97d4, #28005b)',
  'linear-gradient(135deg, #28005b, #7c3aed)',
]

interface TeamMemberCardProps {
  member: {
    id: string
    name: string
    position: string
    shortBio?: string
    photo?: string
    socialLinks?: {
      linkedin?: string
      twitter?: string
      email?: string
    }
  }
  index?: number
}

export function TeamMemberCard({ member, index = 0 }: TeamMemberCardProps) {
  const gradient = gradients[index % gradients.length]
  
  return (
    <div className="group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 text-center">
      {/* Top Gradient Bar */}
      <div className="h-1.5 w-full" style={{ background: gradient }} />
      
      {/* Photo */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        {member.photo ? (
          <Image
            src={member.photo}
            alt={member.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div 
            className="w-full h-full flex items-center justify-center text-white"
            style={{ background: gradient }}
          >
            <span className="text-5xl font-bold">
              {getInitials(member.name)}
            </span>
          </div>
        )}
        
        {/* Social Links Overlay */}
        {member.socialLinks && (
          <div 
            className="absolute inset-0 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ background: 'linear-gradient(135deg, rgba(40,0,91,0.9), rgba(124,58,237,0.9))' }}
          >
            {member.socialLinks.linkedin && (
              <a
                href={member.socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-white rounded-2xl text-primary-900 hover:scale-110 shadow-lg transition-all"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            )}
            {member.socialLinks.twitter && (
              <a
                href={member.socialLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-white rounded-2xl text-primary-900 hover:scale-110 shadow-lg transition-all"
              >
                <Twitter className="w-5 h-5" />
              </a>
            )}
            {member.socialLinks.email && (
              <a
                href={`mailto:${member.socialLinks.email}`}
                className="p-3 bg-white rounded-2xl text-primary-900 hover:scale-110 shadow-lg transition-all"
              >
                <Mail className="w-5 h-5" />
              </a>
            )}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-6">
        <h3 className="text-lg font-bold text-gray-900">{member.name}</h3>
        <p 
          className="text-sm font-semibold mt-1"
          style={{ background: gradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
        >
          {member.position}
        </p>
        {member.shortBio && (
          <p className="text-gray-600 text-sm mt-3 line-clamp-2">
            {member.shortBio}
          </p>
        )}
      </div>
    </div>
  )
}
