# BB4Peace Web Application - Copilot Instructions

## Project Overview
A modern, SEO-optimized web application for Building Blocks for Peace Foundation (bbforpeace.org) - a youth-led peacebuilding NGO in Nigeria. Features admin CMS, blog, publications, and event management.

## Tech Stack
- **Framework**: Next.js 14+ (App Router) with TypeScript
- **CMS**: Payload CMS 3.0 (self-hosted admin panel)
- **Database**: MySQL 8.0 with Prisma ORM
- **Styling**: Tailwind CSS + shadcn/ui components
- **Auth**: Payload built-in auth for admin
- **Search**: Meilisearch (AI-ready, typo-tolerant)
- **File Storage**: Local uploads via Payload Media
- **Deployment**: cPanel with Node.js (Passenger)

## Brand Guidelines
- **Primary Color**: `#28005b` (Deep Purple)
- **Logo Files**: `/public/images/logo.jpg`, `/public/images/logo-alt.jpg`
- **Typography**: Poppins (headings) + Inter (body)
- **Design**: Fluid, modern, mobile-first responsive

## Project Structure
```
bb4peace/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (frontend)/         # Public routes group
│   │   │   ├── page.tsx        # Homepage
│   │   │   ├── about/
│   │   │   ├── blog/
│   │   │   ├── publications/
│   │   │   ├── programmes/
│   │   │   ├── events/
│   │   │   ├── gallery/
│   │   │   └── contact/
│   │   ├── (payload)/          # Payload admin routes
│   │   │   └── admin/[[...segments]]/
│   │   ├── api/                # API routes
│   │   └── layout.tsx          # Root layout
│   ├── components/
│   │   ├── ui/                 # shadcn/ui components
│   │   ├── layout/             # Header, Footer, Nav
│   │   ├── sections/           # Homepage sections
│   │   └── cards/              # Reusable card components
│   ├── lib/
│   │   ├── utils.ts            # Utility functions (cn helper)
│   │   └── seo.ts              # SEO helpers
│   ├── payload/
│   │   ├── collections/        # Payload collections
│   │   │   ├── Posts.ts
│   │   │   ├── Pages.ts
│   │   │   ├── Publications.ts
│   │   │   ├── Events.ts
│   │   │   ├── Team.ts
│   │   │   ├── Partners.ts
│   │   │   ├── Media.ts
│   │   │   └── Users.ts
│   │   ├── globals/            # Site settings
│   │   │   └── Settings.ts
│   │   └── payload.config.ts
│   └── styles/
│       └── globals.css
├── public/
│   ├── images/
│   └── uploads/                # Payload uploads
├── next.config.mjs
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## Payload Collections Schema

### Posts (Blog/Activities)
```typescript
// src/payload/collections/Posts.ts
export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: { useAsTitle: 'title' },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', unique: true },
    { name: 'content', type: 'richText' },
    { name: 'excerpt', type: 'textarea' },
    { name: 'featuredImage', type: 'upload', relationTo: 'media' },
    { name: 'category', type: 'relationship', relationTo: 'categories' },
    { name: 'tags', type: 'relationship', relationTo: 'tags', hasMany: true },
    { name: 'status', type: 'select', options: ['draft', 'published'] },
    { name: 'publishedAt', type: 'date' },
    { name: 'seo', type: 'group', fields: [
      { name: 'metaTitle', type: 'text' },
      { name: 'metaDescription', type: 'textarea' },
    ]},
  ],
}
```

### Publications
```typescript
// src/payload/collections/Publications.ts
fields: [title, slug, description, coverImage, file (upload), category, year, downloadCount, seo]
```

### Events
```typescript
fields: [title, slug, description, location, startDate, endDate, featuredImage, maxAttendees, registrations, status]
```

### Site Settings (Global)
```typescript
// src/payload/globals/Settings.ts
fields: [siteName, logo, favicon, contactEmail, phone, address, socialLinks, footerText, impactStats]
```

## Coding Conventions

### File Naming
- Components: PascalCase (`HeroSection.tsx`)
- Utilities: camelCase (`formatDate.ts`)
- Routes: lowercase folders (`/about-us/page.tsx`)
- Collections: PascalCase (`Posts.ts`)

### Component Pattern
```tsx
// src/components/cards/BlogCard.tsx
import { cn } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import type { Post } from '@/payload-types'

interface BlogCardProps {
  post: Post
  className?: string
}

export function BlogCard({ post, className }: BlogCardProps) {
  return (
    <article className={cn('rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow', className)}>
      {post.featuredImage && (
        <Image 
          src={post.featuredImage.url} 
          alt={post.featuredImage.alt || post.title} 
          width={400} 
          height={250} 
          className="object-cover w-full h-48"
        />
      )}
      <div className="p-4">
        <time className="text-sm text-gray-500">{new Date(post.publishedAt).toLocaleDateString()}</time>
        <h3 className="font-semibold text-lg mt-1 text-gray-900">{post.title}</h3>
        <p className="text-gray-600 mt-2 line-clamp-2">{post.excerpt}</p>
        <Link href={`/blog/${post.slug}`} className="text-primary-600 hover:text-primary-700 mt-3 inline-block font-medium">
          Read more →
        </Link>
      </div>
    </article>
  )
}
```

### Data Fetching (Server Components)
```tsx
// src/app/(frontend)/blog/page.tsx
import { getPayload } from 'payload'
import config from '@payload-config'

export default async function BlogPage() {
  const payload = await getPayload({ config })
  
  const { docs: posts } = await payload.find({
    collection: 'posts',
    where: { status: { equals: 'published' } },
    sort: '-publishedAt',
    limit: 12,
  })
  
  return (
    <main className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Blog & Activities</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map(post => <BlogCard key={post.id} post={post} />)}
      </div>
    </main>
  )
}
```

### Server Actions
```tsx
// src/app/actions/newsletter.ts
'use server'

import { getPayload } from 'payload'
import config from '@payload-config'
import { z } from 'zod'

const schema = z.object({ email: z.string().email() })

export async function subscribeNewsletter(formData: FormData) {
  const result = schema.safeParse({ email: formData.get('email') })
  
  if (!result.success) {
    return { error: 'Invalid email address' }
  }
  
  const payload = await getPayload({ config })
  
  try {
    await payload.create({
      collection: 'subscribers',
      data: { email: result.data.email, status: 'active', subscribedAt: new Date() }
    })
    return { success: true, message: 'Successfully subscribed!' }
  } catch {
    return { error: 'Already subscribed or error occurred' }
  }
}
```

## SEO Implementation

### Metadata Pattern
```tsx
// src/app/(frontend)/blog/[slug]/page.tsx
import type { Metadata } from 'next'

export async function generateMetadata({ params }): Promise<Metadata> {
  const post = await getPost(params.slug)
  
  return {
    title: post.seo?.metaTitle || `${post.title} | BB4Peace`,
    description: post.seo?.metaDescription || post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.featuredImage ? [{ url: post.featuredImage.url }] : [],
      type: 'article',
      publishedTime: post.publishedAt,
    },
    twitter: { card: 'summary_large_image' },
  }
}
```

### JSON-LD Component
```tsx
// src/components/seo/OrganizationJsonLd.tsx
export function OrganizationJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'NGO',
    name: 'Building Blocks for Peace Foundation',
    url: 'https://bbforpeace.org',
    logo: 'https://bbforpeace.org/images/logo.png',
    description: 'Youth-led peacebuilding NGO in Nigeria',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '256, 1st Avenue, FHA, Lugbe',
      addressLocality: 'Abuja',
      addressCountry: 'Nigeria'
    },
    sameAs: [
      'https://facebook.com/bbforpeace',
      'https://twitter.com/bbforpeace',
      'https://instagram.com/bbforpeace'
    ]
  }
  
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
}
```

## Key Dependencies
```json
{
  "dependencies": {
    "next": "^14.2.0",
    "react": "^18.3.0",
    "payload": "^3.0.0",
    "@payloadcms/next": "^3.0.0",
    "@payloadcms/richtext-lexical": "^3.0.0",
    "@payloadcms/db-mysql": "^3.0.0",
    "tailwindcss": "^3.4.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.2.0",
    "lucide-react": "^0.300.0",
    "zod": "^3.22.0",
    "meilisearch": "^0.40.0",
    "@radix-ui/react-slot": "^1.0.0"
  }
}
```

## Development Commands
```bash
# Install dependencies
npm install

# Run development server (Next.js + Payload)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Generate Payload types
npm run payload generate:types

# Seed initial data
npm run seed
```

## Environment Variables
```env
# App
NODE_ENV=production
NEXT_PUBLIC_SITE_URL=https://bbforpeace.org

# Database (MySQL)
DATABASE_URI=mysql://user:password@localhost:3306/bb4peace

# Payload
PAYLOAD_SECRET=your-secret-key-minimum-32-characters-long

# Meilisearch (optional)
MEILISEARCH_HOST=http://localhost:7700
MEILISEARCH_API_KEY=your-master-key

# Email
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=info@bbforpeace.org
SMTP_PASS=password
```

## cPanel Deployment

### next.config.mjs
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'bbforpeace.org' }
    ]
  }
}
export default nextConfig
```

### Steps
1. Build locally: `npm run build`
2. Upload `.next/standalone/` + `.next/static/` + `public/` to cPanel
3. Create Node.js Application in cPanel (Node 20.x)
4. Application startup file: `server.js`
5. Set environment variables
6. Run/Restart application

## Admin Panel
- **URL**: `https://bbforpeace.org/admin`
- **Roles**: Super Admin (full access), Editor (content only)
- **Features**: Visual rich text editor, media library, draft/publish workflow

## Performance Checklist
- [ ] Use `next/image` for all images (auto optimization)
- [ ] Implement ISR: `export const revalidate = 3600` for dynamic pages
- [ ] Use `loading.tsx` for streaming UI
- [ ] Lazy load heavy components with `dynamic()`
- [ ] Enable gzip/brotli compression
- [ ] Set up Cloudflare CDN for static assets
