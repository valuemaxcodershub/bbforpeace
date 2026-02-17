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
      titleSuffix: '- BB4Peace Admin',
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
      url: process.env.DATABASE_URI || 'file:./bb4peace.db',
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
})
