import { buildConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { postgresAdapter } from '@payloadcms/db-postgres'
import sharp from 'sharp'
import path from 'path'
import { fileURLToPath } from 'url'
import crypto from 'crypto'

// Collections
import { Users } from './payload/collections/Users'
import { Media } from './payload/collections/Media'
import { Posts } from './payload/collections/Posts'
import { Publications } from './payload/collections/Publications'
import { Events } from './payload/collections/Events'
import { Team } from './payload/collections/Team'
import { Partners } from './payload/collections/Partners'
import { Categories } from './payload/collections/Categories'
import { Tags } from './payload/collections/Tags'
import { Subscribers } from './payload/collections/Subscribers'
import { Programmes } from './payload/collections/Programmes'
import { GalleryItems } from './payload/collections/GalleryItems'
import { Testimonials } from './payload/collections/Testimonials'

// Globals
import { SiteSettings } from './payload/globals/SiteSettings'
import { PartnersSettings } from './payload/globals/PartnersSettings'
import { AwardSettings } from './payload/globals/AwardSettings'
import { FooterSettings } from './payload/globals/FooterSettings'
import { SEOSettings } from './payload/globals/SEOSettings'
import { SocialMediaSettings } from './payload/globals/SocialMediaSettings'
import { ContactSettings } from './payload/globals/ContactSettings'
import { GeneralSettings } from './payload/globals/GeneralSettings'
import { HomePageSettings } from './payload/globals/HomePageSettings'
import { AboutUsPageSettings } from './payload/globals/AboutUsPageSettings'
import { ProgrammePageSettings } from './payload/globals/ProgrammePageSettings'
import { EventPageSettings } from './payload/globals/EventPageSettings'
import { MediaPageSettings } from './payload/globals/MediaPageSettings'
// ReportsSettings removed - annual reports page content no longer needed in admin
import { ContactUsPageSettings } from './payload/globals/ContactUsPageSettings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
const isProduction = process.env.NODE_ENV === 'production'

// Resolve site URL: explicit env var > Vercel auto-detection > localhost fallback
const siteURL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')

const normalizeConnectionString = (raw: string): string => {
  // Use session pooler (5432) for Supabase — it supports prepared statements
  // and lateral joins that Payload CMS requires. Transaction pooler (6543)
  // uses PgBouncer transaction mode which breaks these features.
  // With max:1 pool size, session pooler client limits are not an issue.
  const base = raw.replace('sslmode=require', 'sslmode=no-verify')

  // If transaction pooler (6543) is configured, rewrite to session pooler (5432)
  if (base.includes('.pooler.supabase.com:6543/')) {
    return base.replace('.pooler.supabase.com:6543/', '.pooler.supabase.com:5432/')
  }

  return base
}

const isEmptyValue = (value: unknown): boolean => {
  if (value === undefined || value === null) return true
  if (typeof value === 'string') return value.trim().length === 0
  if (Array.isArray(value)) return value.length === 0
  return false
}

const mergeWithDefaults = (current: unknown, fallback: unknown): unknown => {
  if (isEmptyValue(current)) return fallback

  if (Array.isArray(fallback)) {
    if (!Array.isArray(current) || current.length === 0) return fallback
    return current
  }

  if (
    fallback &&
    typeof fallback === 'object' &&
    current &&
    typeof current === 'object' &&
    !Array.isArray(current)
  ) {
    const currentObject = current as Record<string, unknown>
    const fallbackObject = fallback as Record<string, unknown>
    const merged: Record<string, unknown> = { ...currentObject }

    for (const key of Object.keys(fallbackObject)) {
      merged[key] = mergeWithDefaults(currentObject[key], fallbackObject[key])
    }

    return merged
  }

  return current
}

const globalPrefillDefaults: Record<string, Record<string, unknown>> = {
  'home-page-settings': {
    slogan: 'Empowering Communities for Peace',
    mainTitle: 'Building Blocks for Peace',
    stats: [
      { label: 'Youth Reached', value: '5000+' },
      { label: 'Programs', value: '20+' },
      { label: 'States Covered', value: '15' },
      { label: 'Publications', value: '30+' },
    ],
    heading: 'Why BBFORPEACE?',
    content:
      'Building Blocks for Peace (BBFORPEACE) is a youth-led organization bridging grassroots action, policy advocacy, and regional networking for sustainable peace in Nigeria and West Africa.',
    focusHeading: 'Our Focus & Approach',
    focusSummary:
      'We equip youth, women and men as peacebuilders through peace education, policy advocacy, partnerships, and community-based interventions that prevent conflict and strengthen resilience.',
    initiativesHeading: 'Our Initiatives',
    videoYoutubeId: 'xvQ_AXIQbPM',
    activitiesHeading: 'Recent Activities',
    publicationsHeading: 'Publications',
  },
  'about-us-page-settings': {
    story:
      'Building Blocks for Peace (BBFORPEACE) Foundation is a non-governmental organization working on conflict prevention, prevention of violent extremism, peacebuilding and sustainable development in Nigeria. Founded by Rafiu Adeniran Lawal through the Nigeria Youth 4 Peace Initiative in 2016, we have trained and empowered over 5,000 youth and children as peace champions.',
    vision:
      'A peaceful, just and inclusive Africa where youth, women and men lead resilient communities, accountable governance, and sustainable development.',
    mission:
      'To equip youth, women and men as peacebuilders to prevent violent conflict, protect civic space, and promote sustainable peace through knowledge-sharing, policy advocacy, partnerships and programs.',
    coreValuesSummary:
      'Our core values are integrity and accountability, inclusivity and gender equality, innovation and learning, collaboration and solidarity, non-violence and do-no-harm, and youth leadership.',
    uniquePositioning:
      'BBFORPEACE uniquely combines grassroots peace action, policy advocacy, and regional partnership networks to deliver practical and scalable peacebuilding outcomes across Nigeria and West Africa.',
    teamHeading: 'Meet Our Team',
    boardHeading: 'Board of Trustees',
  },
  'programme-page-settings': {
    section1Title: 'Peace Education & Youth Empowerment',
    section1Content:
      'Integrating peace education into school curricula and empowering young people with leadership skills, conflict resolution techniques, and advocacy training.',
    section2Title: 'Conflict Prevention, Governance & Accountability',
    section2Content:
      'Facilitating constructive conversations between diverse community groups, building early warning systems, and promoting transparent governance.',
    section3Title: 'Gender, Climate & Environmental Security',
    section3Content:
      'Supporting women as key actors in peacebuilding while addressing the nexus between climate change, environmental degradation, and conflict.',
    section4Title: 'Organizational Sustainability & Partnerships',
    section4Content:
      'Building strategic partnerships with local and international organizations to expand reach and ensure long-term sustainability of peace initiatives.',
  },
  'event-page-settings': {
    pastHeading: 'Past Events',
    pastDescription:
      'Browse our event archive and highlights from previous conferences, summits, workshops, and community engagement sessions.',
    ongoingHeading: 'Ongoing Events',
    ongoingDescription:
      'Track activities currently running across our programmes, including training, dialogues, and regional collaboration events.',
    upcomingHeading: 'Upcoming Events',
    upcomingDescription:
      'Join our upcoming workshops, conferences, and community events to learn, connect, and contribute to building peace.',
  },
  'media-page-settings': {
    blogNote:
      'Stay updated with the latest news, stories, and insights from our peacebuilding work across Nigeria. Use Posts to create articles and Categories/Tags to structure them.',
    pressNote:
      'Official announcements, press releases, and statements from Building Blocks for Peace Foundation. Create press entries via Posts and set the press category.',
    testimonialsSectionHeading: 'Stories of Transformation',
    testimonialsSectionDescription:
      'Every voice tells a story of hope, change, and the power of youth-led peacebuilding.',
    testimonialsCtaHeading: 'Have a Story to Tell?',
    testimonialsCtaDescription:
      "If our work has impacted your life or community, we'd love to hear from you. Share your experience and inspire others to join the movement for peace.",
    testimonialsCtaButtonText: 'Share Your Testimonial',
    photoTabTitle: 'Photos',
    videoTabTitle: 'Videos',
  },

  'contact-us-page-settings': {
    officeHours: 'Mon - Fri: 9:00 AM - 5:00 PM',
    website: 'bbforpeace.org',
  },
  'partners-settings': {
    heading: 'Our Partners',
  },
}

// Ensure PAYLOAD_SECRET is set in production - fail loudly if not
const payloadSecret = process.env.PAYLOAD_SECRET
if (!payloadSecret && process.env.NODE_ENV === 'production') {
  throw new Error('PAYLOAD_SECRET environment variable is required in production. Generate one with: node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"')
}

// Build allowed origins list (site URL + Vercel preview URL if available)
const allowedOrigins = [siteURL]
if (process.env.VERCEL_URL && !siteURL.includes(process.env.VERCEL_URL)) {
  allowedOrigins.push(`https://${process.env.VERCEL_URL}`)
}
if (process.env.VERCEL_PROJECT_PRODUCTION_URL && !siteURL.includes(process.env.VERCEL_PROJECT_PRODUCTION_URL)) {
  allowedOrigins.push(`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`)
}

export default buildConfig({
  serverURL: siteURL,

  // CORS: restrict API access to known origins
  cors: allowedOrigins.filter(Boolean) as string[],

  // CSRF: protect against cross-site request forgery
  csrf: allowedOrigins.filter(Boolean) as string[],

  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: '- BBFORPEACE Admin',
      icons: [{ url: '/images/logo.jpg' }],
    },
    components: {
      actions: ['/src/components/admin/AdminActions#AdminActions'],
      Nav: '/src/components/admin/CustomNav#CustomNav',
      afterNavLinks: ['/src/components/admin/NavOpenDefault#NavOpenDefault'],
      providers: ['/src/components/admin/HidePasswordField#HidePasswordField'],
      views: {
        dashboard: {
          Component: '/src/components/admin/CustomDashboard#CustomDashboard',
        },
      },
      graphics: {
        Logo: '/src/components/admin/Logo#Logo',
        Icon: '/src/components/admin/Icon#Icon',
      },
    },
  },

  editor: lexicalEditor({}),

  collections: [
    Users,
    Media,
    Posts,
    Publications,
    Events,
    Team,
    Partners,
    Programmes,
    GalleryItems,
    Testimonials,
    Categories,
    Tags,
    Subscribers,
  ].map((col) => ({ ...col, admin: { ...col.admin, hideAPIURL: true } })),

  globals: [
    SiteSettings,
    PartnersSettings,
    AwardSettings,
    FooterSettings,
    SEOSettings,
    SocialMediaSettings,
    ContactSettings,
    GeneralSettings,
    HomePageSettings,
    AboutUsPageSettings,
    ProgrammePageSettings,
    EventPageSettings,
    MediaPageSettings,
    ContactUsPageSettings,
  ].map((g) => ({ ...g, admin: { ...g.admin, hideAPIURL: true } })),

  // In production serverless, avoid schema push and prefer pooled runtime connections.
  // Use local/session URL in development for DDL when push is enabled.
  // Recommended env setup:
  // - Production POSTGRES_URL => Supabase transaction pooler (port 6543)
  // - Local DATABASE_URI => Supabase session pooler (port 5432)
  db: postgresAdapter({
    push: !isProduction,
    pool: {
      connectionString: normalizeConnectionString(
        (
        isProduction
          ? (process.env.POSTGRES_URL || process.env.DATABASE_URI || process.env.POSTGRES_URL_NON_POOLING || '')
          : (process.env.DATABASE_URI || process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_URL || '')
        )
      ),
      ssl: { rejectUnauthorized: false },
      max: isProduction ? 2 : 10,
      connectionTimeoutMillis: 30000,
      idleTimeoutMillis: 20000,
    },
  }),

  secret: payloadSecret || crypto.randomBytes(32).toString('hex'),

  sharp,

  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },

  plugins: [],

  upload: {
    limits: {
      fileSize: 25000000, // 25MB max – allows large PDFs and report documents
    },
  },

  // Auto-create super admin on first run - ensures login form shows instead of registration
  onInit: async (payload) => {
    // Never run startup writes on production serverless cold starts.
    if (isProduction) return

    try {
      // Check if any users exist
      const existingUsers = await payload.find({
        collection: 'users',
        limit: 1,
      })
      
      if (existingUsers.docs.length === 0) {
        // Create super admin with env vars or defaults
        const superAdminEmail = process.env.SUPER_ADMIN_EMAIL || 'superadmin@bbforpeace.org'
        const superAdminPassword = process.env.SUPER_ADMIN_PASSWORD
        const superAdminName = process.env.SUPER_ADMIN_NAME || 'Super Administrator'

        if (!superAdminPassword) {
          console.error('❌ SUPER_ADMIN_PASSWORD env var is required to create initial admin. Skipping auto-creation.')
          return
        }

        if (superAdminPassword.length < 12) {
          console.error('❌ SUPER_ADMIN_PASSWORD must be at least 12 characters. Skipping auto-creation.')
          return
        }
        
        await payload.create({
          collection: 'users',
          data: {
            email: superAdminEmail,
            password: superAdminPassword,
            name: superAdminName,
            role: 'super-admin',
            isActive: true,
          },
        })
        console.log('✅ Super admin created. Change password immediately after first login.')
      }

      for (const [slug, defaults] of Object.entries(globalPrefillDefaults)) {
        try {
          const currentGlobal = await payload.findGlobal({ slug: slug as any })
          const mergedData = mergeWithDefaults(currentGlobal, defaults) as Record<string, unknown>
          // Only update fields present in our defaults to avoid validation errors
          // on upload/relationship fields (e.g. heroSlides images) that aren't in defaults
          const safeData: Record<string, unknown> = {}
          for (const key of Object.keys(defaults)) {
            safeData[key] = mergedData[key]
          }
          await payload.updateGlobal({
            slug: slug as any,
            data: safeData,
          })
        } catch (globalError) {
          console.error(`Error pre-filling global ${slug}:`, globalError)
        }
      }
    } catch (error) {
      console.error('Error auto-creating super admin:', error)
    }
  },
})
