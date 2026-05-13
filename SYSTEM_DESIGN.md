# BB4Peace System Design

## Executive Summary

BB4Peace is implemented as a content-managed website for Building Blocks for Peace Foundation. The public website and Payload CMS admin are deployed on Vercel, CMS data is stored in Supabase PostgreSQL, and media is stored and delivered through Cloudflare R2.

This document replaces the earlier cPanel/MySQL design and reflects the architecture currently implemented in the codebase.

## Current Stack

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | Next.js 15 App Router | Public website, SSR/route rendering, SEO |
| CMS | Payload CMS 3 | Admin dashboard at `/admin` |
| Database | Supabase PostgreSQL | Payload collections, globals, users, media metadata |
| Media Storage | Cloudflare R2 | S3-compatible object storage for uploaded media |
| Media Delivery | Cloudflare R2 public URL | Public image/document delivery |
| Deployment | Vercel | GitHub `main` branch auto-deploy |
| Language | TypeScript | Type safety and maintainability |
| Styling | Tailwind CSS | Frontend and admin styling |

## Architecture

```text
Visitors / Admin Users
        |
        v
Vercel / Next.js 15
        |
        |-- Public website routes: src/app/(frontend)
        |-- Payload admin: /admin
        |-- Payload API routes: /api
        |
        +--> Supabase PostgreSQL
        |
        +--> Cloudflare R2 via Payload S3 storage adapter
                |
                v
          Public R2 media URLs
```

## Runtime Components

### Public Website

The public website is under `src/app/(frontend)` and includes:

- Home
- About
- Programmes
- Events
- Blog and press
- Gallery
- Publications and reports
- Contact

Most public content is read from Payload collections and globals. Media values are normalized using `getMediaUrl()` from `src/lib/utils.ts`.

### Payload Admin

Payload admin runs at `/admin` from `src/app/(payload)`.

Current admin customizations include:

- Custom admin navigation
- Custom dashboard cards
- Custom logo/icon
- Mobile admin navigation overlay
- Role-aware admin field behavior

Primary roles are:

- `super-admin`
- `admin`
- `editor`

Access control is defined in Payload collection configs.

### Database

Supabase PostgreSQL is the source of truth for CMS content.

Important collections include:

- `users`
- `media`
- `posts`
- `publications`
- `events`
- `team`
- `partners`
- `programmes`
- `gallery-items`
- `testimonials`
- `categories`
- `tags`
- `subscribers`

Important globals include:

- General settings
- Home page settings
- About page settings
- Programme page settings
- Event page settings
- Media page settings
- Contact settings
- SEO/social/footer settings

### Media Storage

Cloudflare R2 is configured through `@payloadcms/storage-s3`.

Required environment variables:

```text
R2_BUCKET
R2_ACCESS_KEY_ID
R2_SECRET_ACCESS_KEY
R2_ENDPOINT
R2_REGION=auto
R2_PUBLIC_URL
```

Media uploads from Payload should go to R2. Vercel Blob has been removed from active dependencies.

## Deployment

### Vercel

Vercel deploys from GitHub `main`.

Required Vercel environment variables:

```text
DATABASE_URL or DATABASE_URI
PAYLOAD_SECRET
NEXT_PUBLIC_SITE_URL=https://www.bbforpeace.org
R2_BUCKET
R2_ACCESS_KEY_ID
R2_SECRET_ACCESS_KEY
R2_ENDPOINT
R2_REGION=auto
R2_PUBLIC_URL
```

Build command:

```bash
npm run build
```

### Supabase

Supabase hosts the production PostgreSQL database. Use a stable database URL in Vercel and local `.env`. If the Supabase pooler causes connection resets during scripts or admin usage, use the direct database host where appropriate.

### Cloudflare R2

R2 stores and serves media. `next.config.ts` allowlists the R2 hostname so `next/image` can display R2-hosted images.

## Security Baseline

Implemented baseline:

- `PAYLOAD_SECRET` is required in production.
- Payload CORS and CSRF are restricted to configured site origins.
- Security headers are set in `next.config.ts`.
- Admin and API responses use no-cache headers in middleware.
- Basic API/admin-login rate limiting is implemented in middleware.
- Payload collection access controls enforce role-based writes.
- Media deletion checks prevent deleting referenced media.
- Vercel local filesystem uploads are disabled.
- R2 and database credentials are environment-only.
- Old scripts containing hardcoded credentials were removed.

Recommended next hardening:

- Move from in-memory rate limiting to durable rate limiting, e.g. Cloudflare rules or Redis/Upstash.
- Add Cloudflare WAF managed rules.
- Add Cloudflare rate limiting for `/admin/*`, `/api/*`, and auth endpoints.
- Consider Cloudflare Access in front of `/admin/*`.
- Rotate Supabase credentials that may have appeared in historical scripts or git history.
- Add uptime and error monitoring.

## Cloudflare Security Plan

Cloudflare can improve security in front of Vercel and R2.

Recommended technical setup:

1. Manage DNS for `bbforpeace.org` in Cloudflare.
2. Use SSL/TLS mode: Full Strict.
3. Enable WAF managed rules.
4. Add rate-limit rules for `/admin/*` and `/api/*`.
5. Enable bot protection and consider Turnstile for public forms if spam appears.
6. Consider Cloudflare Access for `/admin/*` to require an extra identity check before Payload login.
7. Use a custom R2 media domain if desired.
8. Cache static assets/media where safe.

Financial notes:

- Cloudflare Free is sufficient for DNS, SSL, CDN, and basic DDoS protection.
- Cloudflare Pro adds stronger WAF controls and is often enough for a small organization.
- Business/Enterprise is only needed for advanced compliance/SLA needs.
- Cloudflare Zero Trust/Access may be free for small teams, with paid tiers depending on users/features.
- R2 costs depend on storage and operations; it is typically cost-effective for media delivery.

## Operational Scripts

Active scripts are intentionally limited to:

```text
scripts/backup-db.js
scripts/cleanup-unused-media.js
scripts/test-db-conn.js
```

Old migration, diagnostic, repair, and Vercel Blob scripts were removed after the R2 migration and media cleanup.

## Known Optional Enhancements

- Full frontend visual/facial uplift.
- Deeper admin dashboard redesign beyond current custom dashboard/navigation.
- Durable rate limiting.
- Cloudflare Access for admin.
- Automated monitoring and alerting.
- Formal penetration test before major public campaigns.
# BB4Peace - System Design Document

## 1. Executive Summary

This document outlines the complete system architecture for rebuilding **Building Blocks for Peace Foundation** (bbforpeace.org) as a modern, full-featured web application with content management capabilities.

### Goals
- Modern, fluid, mobile-first responsive design
- Full content management system (CMS) for non-technical users
- SEO and AI search engine optimization
- Scalable architecture for future growth
- cPanel hosting compatibility

---

## 2. Technology Stack

### Chosen Stack: Next.js + Payload CMS

| Component | Technology | Purpose |
|-----------|------------|---------|
| **Framework** | Next.js 14 (App Router) | Full-stack React, SSR/SSG for SEO |
| **Language** | TypeScript | Type safety, better DX |
| **CMS** | Payload CMS 3.0 | Self-hosted admin panel |
| **Database** | MySQL 8.0 | cPanel native support |
| **ORM** | Prisma (via Payload) | Type-safe database queries |
| **Styling** | Tailwind CSS + shadcn/ui | Modern, customizable UI |
| **Search** | Meilisearch | Fast, AI-ready, typo-tolerant |
| **Deployment** | cPanel Node.js | Passenger-managed Node app |

### Why This Stack?
- **Next.js**: SEO-perfect with server rendering, excellent developer experience
- **Payload CMS**: Modern, self-hosted CMS that integrates directly with Next.js
- **TypeScript**: Catches errors early, better code completion
- **Tailwind + shadcn/ui**: Rapid UI development with beautiful components
- **cPanel Compatible**: Node.js apps work via Phusion Passenger

---

## 3. System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         INTERNET                                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      CLOUDFLARE CDN                              │
│              (DDoS Protection, SSL, Edge Caching)                │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                       cPanel Server                              │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │              Phusion Passenger (Node.js)                   │  │
│  └───────────────────────────────────────────────────────────┘  │
│                              │                                   │
│                              ▼                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │              Next.js 14 Application                        │  │
│  │  ┌─────────────────────────────────────────────────────┐  │  │
│  │  │                    App Router                        │  │  │
│  │  │  ┌───────────┐ ┌───────────┐ ┌───────────────────┐  │  │  │
│  │  │  │ Frontend  │ │  Payload  │ │    API Routes     │  │  │  │
│  │  │  │  Routes   │ │   Admin   │ │  (Server Actions) │  │  │  │
│  │  │  │ (Public)  │ │  (/admin) │ │                   │  │  │  │
│  │  │  └───────────┘ └───────────┘ └───────────────────┘  │  │  │
│  │  └─────────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────────┘  │
│                              │                                   │
│          ┌───────────────────┼───────────────────┐              │
│          ▼                   ▼                   ▼              │
│  ┌──────────────┐   ┌──────────────┐   ┌──────────────┐        │
│  │    MySQL     │   │ File Storage │   │  Meilisearch │        │
│  │   Database   │   │  (/uploads)  │   │   (Search)   │        │
│  └──────────────┘   └──────────────┘   └──────────────┘        │
└─────────────────────────────────────────────────────────────────┘
```

---

## 4. Database Design

### Entity Relationship Diagram

```
┌──────────────────┐       ┌──────────────────┐       ┌──────────────────┐
│      users       │       │      posts       │       │   categories     │
├──────────────────┤       ├──────────────────┤       ├──────────────────┤
│ id (PK)          │       │ id (PK)          │       │ id (PK)          │
│ email            │       │ title            │       │ name             │
│ password (hash)  │       │ slug (unique)    │       │ slug (unique)    │
│ name             │       │ content (rich)   │       │ description      │
│ role             │◄──────│ author_id (FK)   │       │ parent_id (FK)   │
│ avatar_id (FK)   │       │ category_id (FK) │───────►│ created_at       │
│ created_at       │       │ featured_img (FK)│       └──────────────────┘
│ updated_at       │       │ excerpt          │              │
└──────────────────┘       │ status           │              │
                           │ published_at     │              ▼
                           │ meta_title       │       ┌──────────────────┐
                           │ meta_description │       │      tags        │
                           │ created_at       │       ├──────────────────┤
                           │ updated_at       │       │ id (PK)          │
                           └──────────────────┘       │ name             │
                                  │                   │ slug (unique)    │
                                  │                   └──────────────────┘
                                  ▼                          │
                           ┌──────────────────┐              │
                           │    posts_tags    │              │
                           ├──────────────────┤              │
                           │ post_id (FK)     │──────────────┘
                           │ tag_id (FK)      │
                           └──────────────────┘

┌──────────────────┐       ┌──────────────────┐       ┌──────────────────┐
│      pages       │       │   publications   │       │      events      │
├──────────────────┤       ├──────────────────┤       ├──────────────────┤
│ id (PK)          │       │ id (PK)          │       │ id (PK)          │
│ title            │       │ title            │       │ title            │
│ slug (unique)    │       │ slug (unique)    │       │ slug (unique)    │
│ content (rich)   │       │ description      │       │ description      │
│ template         │       │ cover_image (FK) │       │ content (rich)   │
│ meta_title       │       │ file_id (FK)     │       │ location         │
│ meta_description │       │ category         │       │ start_date       │
│ is_published     │       │ year             │       │ end_date         │
│ created_at       │       │ author           │       │ featured_img (FK)│
└──────────────────┘       │ download_count   │       │ max_attendees    │
                           │ meta_title       │       │ status           │
                           │ meta_description │       │ created_at       │
                           │ created_at       │       └──────────────────┘
                           └──────────────────┘

┌──────────────────┐       ┌──────────────────┐       ┌──────────────────┐
│      media       │       │    partners      │       │   team_members   │
├──────────────────┤       ├──────────────────┤       ├──────────────────┤
│ id (PK)          │       │ id (PK)          │       │ id (PK)          │
│ filename         │       │ name             │       │ name             │
│ alt_text         │       │ logo_id (FK)     │       │ position         │
│ mime_type        │       │ website          │       │ bio              │
│ file_size        │       │ order            │       │ photo_id (FK)    │
│ width            │       │ is_active        │       │ email            │
│ height           │       │ created_at       │       │ social_links     │
│ url              │       └──────────────────┘       │ category         │
│ created_at       │                                  │ order            │
└──────────────────┘       ┌──────────────────┐       │ created_at       │
                           │   subscribers    │       └──────────────────┘
                           ├──────────────────┤
                           │ id (PK)          │       ┌──────────────────┐
                           │ email (unique)   │       │  site_settings   │
                           │ status           │       ├──────────────────┤
                           │ subscribed_at    │       │ id (PK)          │
                           │ unsubscribe_token│       │ site_name        │
                           │ created_at       │       │ logo_id (FK)     │
                           └──────────────────┘       │ favicon_id (FK)  │
                                                      │ contact_email    │
                                                      │ phone            │
                                                      │ address          │
                                                      │ social_links     │
                                                      │ footer_text      │
                                                      │ impact_stats     │
                                                      └──────────────────┘
```

---

## 5. Application Routes & Pages

### Frontend Routes (Public)

| Route | Page | Description |
|-------|------|-------------|
| `/` | Home | Hero, impact stats, activities, publications, partners |
| `/about` | About Us | Mission, vision, history |
| `/about/team` | Our Team | Board, staff, advisors |
| `/about/partners` | Partners | Collaborators grid |
| `/programmes` | Programmes | All programs overview |
| `/programmes/[slug]` | Programme Detail | Individual program |
| `/blog` | Blog/Activities | Paginated posts |
| `/blog/[slug]` | Blog Post | Article with related posts |
| `/publications` | Publications | PDF library |
| `/publications/[slug]` | Publication | Details + download |
| `/events` | Events | Upcoming and past events |
| `/events/[slug]` | Event Detail | Info + registration |
| `/gallery` | Gallery | Photo/video gallery |
| `/contact` | Contact | Form + map + details |
| `/get-involved` | Get Involved | Volunteer, partner, donate |

### Admin Routes (Payload CMS)

| Route | Purpose |
|-------|---------|
| `/admin` | Dashboard |
| `/admin/collections/posts` | Manage blog posts |
| `/admin/collections/pages` | Manage static pages |
| `/admin/collections/publications` | Manage publications |
| `/admin/collections/events` | Manage events |
| `/admin/collections/team` | Manage team members |
| `/admin/collections/partners` | Manage partners |
| `/admin/collections/media` | Media library |
| `/admin/collections/subscribers` | Newsletter list |
| `/admin/globals/settings` | Site settings |

---

## 6. Component Architecture

### UI Component Hierarchy

```
src/components/
├── ui/                          # shadcn/ui base components
│   ├── button.tsx
│   ├── card.tsx
│   ├── input.tsx
│   ├── dialog.tsx
│   ├── sheet.tsx               # Mobile menu
│   ├── carousel.tsx
│   ├── tabs.tsx
│   └── ...
│
├── layout/
│   ├── Header/
│   │   ├── Header.tsx          # Main header wrapper
│   │   ├── TopBar.tsx          # Contact info + social
│   │   ├── MainNav.tsx         # Desktop navigation
│   │   ├── MobileNav.tsx       # Hamburger + sheet
│   │   └── SearchDialog.tsx    # Search modal
│   ├── Footer/
│   │   ├── Footer.tsx          # Main footer wrapper
│   │   ├── FooterLinks.tsx     # Quick links columns
│   │   ├── FooterContact.tsx   # Contact details
│   │   └── FooterNewsletter.tsx # Subscribe form
│   └── Container.tsx           # Max-width wrapper
│
├── sections/                    # Homepage sections
│   ├── HeroSection.tsx         # Full-width slider/video
│   ├── ImpactStats.tsx         # Animated counters
│   ├── AboutPreview.tsx        # Brief about section
│   ├── ProgramsGrid.tsx        # Featured programs
│   ├── RecentActivities.tsx    # Latest blog posts
│   ├── PublicationsCarousel.tsx # Publications slider
│   ├── PartnersSlider.tsx      # Partner logos
│   ├── TestimonialsSection.tsx # Quotes/testimonials
│   └── CTASection.tsx          # Call to action
│
├── cards/
│   ├── BlogCard.tsx            # Blog post card
│   ├── PublicationCard.tsx     # Publication with download
│   ├── EventCard.tsx           # Event card
│   ├── TeamMemberCard.tsx      # Team member profile
│   ├── ProgramCard.tsx         # Program preview
│   └── PartnerCard.tsx         # Partner logo + link
│
├── forms/
│   ├── ContactForm.tsx         # Contact page form
│   ├── NewsletterForm.tsx      # Email subscribe
│   └── EventRegistrationForm.tsx
│
└── seo/
    ├── OrganizationJsonLd.tsx  # Org schema
    ├── ArticleJsonLd.tsx       # Blog post schema
    └── BreadcrumbJsonLd.tsx    # Navigation schema
```

---

## 7. Design System

### Color Palette

```css
/* tailwind.config.ts */
colors: {
  primary: {
    50: '#f5f3ff',
    100: '#ede9fe',
    200: '#ddd6fe',
    300: '#c4b5fd',
    400: '#a78bfa',
    500: '#8b5cf6',
    600: '#7c3aed',
    700: '#6d28d9',
    800: '#5b21b6',
    900: '#28005b',  /* Brand color - use as primary-900 */
    950: '#1a0040',
  },
  accent: {
    gold: '#f59e0b',
    green: '#10b981',
  },
  gray: {
    // Tailwind defaults
  }
}
```

### Typography

```css
/* globals.css */
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap');

/* tailwind.config.ts */
fontFamily: {
  sans: ['Inter', 'sans-serif'],
  heading: ['Poppins', 'sans-serif'],
}
```

### Spacing & Layout

```css
/* Container max-widths */
max-w-7xl (1280px) - Main content
max-w-4xl (896px)  - Blog post content
max-w-2xl (672px)  - Narrow content

/* Section padding */
py-16 md:py-24 - Standard section padding
px-4 md:px-6   - Horizontal padding
```

---

## 8. SEO & AI Search Strategy

### On-Page SEO (Automatic via Next.js Metadata)

```tsx
// src/app/(frontend)/layout.tsx
export const metadata: Metadata = {
  metadataBase: new URL('https://bbforpeace.org'),
  title: {
    default: 'BB4Peace - Building Blocks for Peace Foundation',
    template: '%s | BB4Peace'
  },
  description: 'Youth-led peacebuilding NGO in Nigeria advocating for meaningful youth engagement in peace processes.',
  openGraph: {
    type: 'website',
    locale: 'en_NG',
    siteName: 'Building Blocks for Peace Foundation',
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@bbforpeace',
  },
  robots: {
    index: true,
    follow: true,
  },
}
```

### Dynamic SEO per Page

```tsx
// Each page generates its own metadata
export async function generateMetadata({ params }): Promise<Metadata> {
  const data = await fetchData(params.slug)
  return {
    title: data.seo?.metaTitle || data.title,
    description: data.seo?.metaDescription || data.excerpt,
    openGraph: {
      images: [{ url: data.featuredImage?.url }],
    },
  }
}
```

### Structured Data (JSON-LD)

1. **Organization** - Site-wide
2. **Article** - Blog posts
3. **Event** - Events
4. **BreadcrumbList** - Navigation
5. **FAQPage** - FAQ sections

### Sitemap Generation

```tsx
// src/app/sitemap.ts
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPosts()
  const publications = await getAllPublications()
  
  return [
    { url: 'https://bbforpeace.org', lastModified: new Date() },
    { url: 'https://bbforpeace.org/about', lastModified: new Date() },
    ...posts.map(post => ({
      url: `https://bbforpeace.org/blog/${post.slug}`,
      lastModified: post.updatedAt,
    })),
    ...publications.map(pub => ({
      url: `https://bbforpeace.org/publications/${pub.slug}`,
      lastModified: pub.updatedAt,
    })),
  ]
}
```

### AI Search Optimization

1. **Semantic HTML**: Proper heading hierarchy (h1 → h6)
2. **Descriptive URLs**: `/blog/youth-participation-peacebuilding`
3. **Alt Text**: Every image has meaningful alt text
4. **Structured Content**: Clear sections with headings
5. **Fast Loading**: Core Web Vitals optimization

---

## 9. Payload CMS Configuration

### Collections Setup

```typescript
// src/payload.config.ts
import { buildConfig } from 'payload'
import { mysqlAdapter } from '@payloadcms/db-mysql'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Posts } from './collections/Posts'
import { Pages } from './collections/Pages'
import { Publications } from './collections/Publications'
import { Events } from './collections/Events'
import { Team } from './collections/Team'
import { Partners } from './collections/Partners'
import { Categories } from './collections/Categories'
import { Tags } from './collections/Tags'
import { Subscribers } from './collections/Subscribers'

import { Settings } from './globals/Settings'

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SITE_URL,
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: '- BB4Peace Admin',
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
    Categories,
    Tags,
    Subscribers,
  ],
  globals: [Settings],
  db: mysqlAdapter({
    pool: { connectionString: process.env.DATABASE_URI },
  }),
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },
})
```

### Admin Features

- **Rich Text Editor**: Lexical editor with media embeds
- **Media Library**: Drag-drop uploads, image optimization
- **Draft/Publish**: Content workflow with preview
- **Scheduling**: Future publish dates
- **Versions**: Content history and rollback
- **Access Control**: Role-based permissions

---

## 10. cPanel Deployment Guide

### Prerequisites
- cPanel with Node.js support
- Node.js 18.x or 20.x
- MySQL 8.0 database

### Build Process

```bash
# Local development
npm install
npm run dev

# Production build
npm run build

# Output structure after build:
.next/
├── standalone/          # ← Upload this
│   ├── server.js       # Entry point
│   ├── node_modules/   # Minimal deps
│   └── .next/
└── static/             # ← Upload to standalone/.next/
```

### cPanel Setup Steps

1. **Create MySQL Database**
   - Database: `bb4peace_db`
   - User: `bb4peace_user`
   - Grant all privileges

2. **Create Node.js Application**
   - Node version: 20.x
   - Application mode: Production
   - Application root: `/home/username/bb4peace`
   - Application URL: `bbforpeace.org`
   - Application startup file: `server.js`

3. **Upload Files**
   ```
   /home/username/bb4peace/
   ├── server.js
   ├── .next/
   ├── public/
   ├── node_modules/
   └── .env
   ```

4. **Environment Variables** (via cPanel or .env)
   ```env
   NODE_ENV=production
   NEXT_PUBLIC_SITE_URL=https://bbforpeace.org
   DATABASE_URI=mysql://user:pass@localhost:3306/bb4peace_db
   PAYLOAD_SECRET=your-secret-key-at-least-32-chars
   ```

5. **Restart Application**

### Folder Permissions
```
public/uploads/ → 755
.next/ → 755
```

---

## 11. Security Implementation

| Security Measure | Implementation |
|------------------|----------------|
| **HTTPS** | Cloudflare SSL (Full Strict) |
| **CSRF** | Built into Next.js Server Actions |
| **SQL Injection** | Prisma parameterized queries |
| **XSS** | React auto-escaping |
| **Rate Limiting** | Middleware on forms |
| **Auth** | Payload secure session handling |
| **Passwords** | bcrypt hashing |
| **File Uploads** | Type validation, size limits |

---

## 12. Performance Optimization

### Next.js Optimizations

```tsx
// Image optimization
import Image from 'next/image'
<Image src={url} alt={alt} width={800} height={600} priority={isAboveFold} />

// Font optimization
import { Inter, Poppins } from 'next/font/google'

// Dynamic imports for heavy components
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <Skeleton />,
})

// ISR for dynamic pages
export const revalidate = 3600 // Revalidate every hour
```

### Caching Strategy

| Content Type | Cache Strategy |
|--------------|----------------|
| Static pages | Build-time (SSG) |
| Blog posts | ISR (1 hour) |
| Publications | ISR (1 hour) |
| API routes | No cache / short cache |
| Static assets | Long-term (CDN) |

---

## 13. Development Timeline

| Phase | Duration | Deliverables |
|-------|----------|--------------|
| **Phase 1: Setup** | 1 week | Project scaffold, Payload config, DB schema |
| **Phase 2: Admin CMS** | 2 weeks | All collections, media library, settings |
| **Phase 3: Frontend** | 2 weeks | All pages, responsive design, components |
| **Phase 4: Features** | 1 week | Search, newsletter, contact form |
| **Phase 5: SEO** | 1 week | Metadata, sitemaps, structured data |
| **Phase 6: Testing** | 1 week | QA, performance, deployment |

**Total: ~8 weeks**

---

## 14. Future Enhancements

1. **Online Donations**: Flutterwave/Paystack integration
2. **Multi-language**: i18n support (English, Hausa, Yoruba, Igbo)
3. **Member Portal**: Volunteer registration and management
4. **Event RSVP**: Online registration with QR codes
5. **Analytics Dashboard**: Integrated stats in admin
6. **Mobile App**: API already ready for React Native

---

*Document Version: 2.0*
*Stack: Next.js 14 + Payload CMS 3.0*
*Created: January 2026*
*For: Building Blocks for Peace Foundation*
