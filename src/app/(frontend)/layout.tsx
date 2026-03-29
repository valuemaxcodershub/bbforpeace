import type { Metadata } from 'next'
import { Inter, Poppins } from 'next/font/google'
import { Header, Footer } from '@/components/layout'
import { ScrollObserver } from '@/components/ui/ScrollObserver'
import { BackToTop } from '@/components/ui/BackToTop'
import { getPayloadClient } from '@/lib/payload-client'
import { getMediaUrl } from '@/lib/utils'

// Force dynamic rendering - CMS content is always fresh, no build-time DB needed
export const dynamic = 'force-dynamic'

// Extend Vercel function timeout for Supabase cold starts
export const maxDuration = 60

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
})

const poppins = Poppins({
  variable: '--font-poppins',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
})

// Hardcoded fallbacks if DB is unreachable
const fallbackMeta = {
  title: 'Building Blocks for Peace Foundation | Empowering Communities for Peace',
  titleTemplate: '%s | BB4Peace',
  description:
    'Empowering Communities for Peace — Building Blocks for Peace Foundation is a youth-led peacebuilding NGO in Nigeria, working to create sustainable peace through education, dialogue, and community engagement.',
  keywords:
    'peacebuilding, youth empowerment, Nigeria NGO, conflict resolution, peace education, community development, BB4Peace, Building Blocks for Peace',
}

export async function generateMetadata(): Promise<Metadata> {
  let seo: any = null
  try {
    const payload = await getPayloadClient()
    seo = await payload.findGlobal({ slug: 'seo-settings' })
  } catch {
    // Fall back to hardcoded defaults on cold start / timeout
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://bbforpeace.org'
  const title = seo?.metaTitle || fallbackMeta.title
  const titleTemplate = seo?.titleTemplate || fallbackMeta.titleTemplate
  const description = seo?.metaDescription || fallbackMeta.description
  const keywordsStr = seo?.keywords || fallbackMeta.keywords
  const keywords = keywordsStr.split(',').map((k: string) => k.trim()).filter(Boolean)
  const canonicalUrl = seo?.canonicalUrl || siteUrl

  // Resolve OG image
  const ogImageMedia = seo?.og?.image || seo?.ogImage
  const ogImageUrl = ogImageMedia ? getMediaUrl(ogImageMedia) : '/images/og-image.jpg'

  // Resolve Twitter image (falls back to OG image)
  const twitterImageMedia = seo?.twitter?.image
  const twitterImageUrl = twitterImageMedia ? getMediaUrl(twitterImageMedia) : ogImageUrl

  const robotsIndex = seo?.robots?.index ?? true
  const robotsFollow = seo?.robots?.follow ?? true

  return {
    title: {
      default: title,
      template: titleTemplate,
    },
    description,
    keywords,
    authors: [{ name: 'Building Blocks for Peace Foundation' }],
    creator: 'BB4Peace',
    publisher: 'Building Blocks for Peace Foundation',
    metadataBase: new URL(canonicalUrl),
    openGraph: {
      type: 'website',
      locale: seo?.og?.locale || 'en_NG',
      url: '/',
      siteName: seo?.og?.siteName || 'Building Blocks for Peace Foundation',
      title: seo?.og?.title || title,
      description: seo?.og?.description || description,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: 'Building Blocks for Peace Foundation',
        },
      ],
    },
    twitter: {
      card: (seo?.twitter?.card as 'summary' | 'summary_large_image') || 'summary_large_image',
      title: seo?.twitter?.title || 'Building Blocks for Peace Foundation',
      description: seo?.twitter?.description || 'Youth-led peacebuilding NGO in Nigeria',
      images: [twitterImageUrl],
      creator: seo?.twitter?.handle || '@bbforpeace',
    },
    robots: {
      index: robotsIndex,
      follow: robotsFollow,
      googleBot: {
        index: robotsIndex,
        follow: robotsFollow,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      ...(seo?.verification?.google ? { google: seo.verification.google } : {}),
      ...(seo?.verification?.bing ? { other: { 'msvalidate.01': seo.verification.bing } } : {}),
    },
    icons: {
      icon: '/images/logo.jpg',
      shortcut: '/images/logo.jpg',
      apple: '/images/logo.jpg',
    },
  }
}

export default function FrontendLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable} overflow-x-hidden`}>
      <body className="font-sans antialiased bg-white text-gray-900 overflow-x-hidden">
        <ScrollObserver />
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <BackToTop />
      </body>
    </html>
  )
}
