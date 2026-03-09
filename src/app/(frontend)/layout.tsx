import type { Metadata } from 'next'
import { Inter, Poppins } from 'next/font/google'
import { Header, Footer } from '@/components/layout'
import { ScrollObserver } from '@/components/ui/ScrollObserver'
import { BackToTop } from '@/components/ui/BackToTop'

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

export const metadata: Metadata = {
  title: {
    default: 'Building Blocks for Peace Foundation | Empowering Communities for Peace',
    template: '%s | BB4Peace',
  },
  description:
    'Empowering Communities for Peace — Building Blocks for Peace Foundation is a youth-led peacebuilding NGO in Nigeria, working to create sustainable peace through education, dialogue, and community engagement.',
  keywords: [
    'peacebuilding',
    'youth empowerment',
    'Nigeria NGO',
    'conflict resolution',
    'peace education',
    'community development',
    'BB4Peace',
    'Building Blocks for Peace',
  ],
  authors: [{ name: 'Building Blocks for Peace Foundation' }],
  creator: 'BB4Peace',
  publisher: 'Building Blocks for Peace Foundation',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://bbforpeace.org'),
  openGraph: {
    type: 'website',
    locale: 'en_NG',
    url: '/',
    siteName: 'Building Blocks for Peace Foundation',
    title: 'Building Blocks for Peace Foundation | Youth-Led Peacebuilding NGO',
    description:
      'Youth-led peacebuilding NGO in Nigeria, working to create sustainable peace through education, dialogue, and community engagement.',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Building Blocks for Peace Foundation',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Building Blocks for Peace Foundation',
    description: 'Youth-led peacebuilding NGO in Nigeria',
    images: ['/images/og-image.jpg'],
    creator: '@bbforpeace',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/images/logo.jpg',
    shortcut: '/images/logo.jpg',
    apple: '/images/logo.jpg',
  },
}

export default function FrontendLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body className="font-sans antialiased bg-white text-gray-900">
        <ScrollObserver />
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <BackToTop />
      </body>
    </html>
  )
}
