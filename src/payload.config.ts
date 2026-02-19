import { buildConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import path from 'path'
import { fileURLToPath } from 'url'

// Collections
import { Users } from './payload/collections/Users'
import { Media } from './payload/collections/Media'
import { Posts } from './payload/collections/Posts'
import { Pages } from './payload/collections/Pages'
import { Publications } from './payload/collections/Publications'
import { Events } from './payload/collections/Events'
import { Team } from './payload/collections/Team'
import { Partners } from './payload/collections/Partners'
import { Categories } from './payload/collections/Categories'
import { Tags } from './payload/collections/Tags'
import { Subscribers } from './payload/collections/Subscribers'
import { Programmes } from './payload/collections/Programmes'

// Globals
import { SiteSettings } from './payload/globals/SiteSettings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: '- BBFORPEACE Admin',
      icons: [{ url: '/favicon.ico' }],
    },
  },

  editor: lexicalEditor({}),

  collections: [
    Users,
    Media,
    Posts,
    Pages,
    Publications,
    Events,
    Team,
    Partners,
    Programmes,
    Categories,
    Tags,
    Subscribers,
  ],

  globals: [SiteSettings],

  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URI || 'file:./db/payload.db',
    },
  }),

  secret: process.env.PAYLOAD_SECRET || 'CHANGE_ME_IN_PRODUCTION_TO_SECURE_SECRET',

  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },

  upload: {
    limits: {
      fileSize: 10000000, // 10MB
    },
  },

  // Auto-create super admin on first run if configured via environment variables
  onInit: async (payload) => {
    // Check if we should auto-seed super admin
    const superAdminEmail = process.env.SUPER_ADMIN_EMAIL
    const superAdminPassword = process.env.SUPER_ADMIN_PASSWORD
    
    if (superAdminEmail && superAdminPassword) {
      try {
        // Check if any users exist
        const existingUsers = await payload.find({
          collection: 'users',
          limit: 1,
        })
        
        if (existingUsers.docs.length === 0) {
          // Create super admin
          await payload.create({
            collection: 'users',
            data: {
              email: superAdminEmail,
              password: superAdminPassword,
              name: process.env.SUPER_ADMIN_NAME || 'Super Administrator',
              role: 'super-admin',
              isActive: true,
            },
          })
          console.log('✅ Super admin created automatically via environment variables')
        }
      } catch (error) {
        console.error('Error auto-creating super admin:', error)
      }
    }
  },
})
