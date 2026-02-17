import type { Metadata } from 'next'

interface SEOProps {
  title?: string
  description?: string
  image?: string
  url?: string
  type?: 'website' | 'article'
  publishedTime?: string
  modifiedTime?: string
  author?: string
  keywords?: string[]
}

const defaultSEO = {
  siteName: 'Building Blocks for Peace Foundation',
  title: 'BB4Peace - Empowering Communities for Peace',
  description: 'Empowering Communities for Peace — Building Blocks for Peace Foundation is a youth-led peacebuilding NGO advocating for meaningful youth engagement in peace processes and sustainable development in Nigeria.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://bbforpeace.org',
  image: '/images/og-image.jpg',
  twitterHandle: '@bbforpeace',
}

export function generateSEO({
  title,
  description,
  image,
  url,
  type = 'website',
  publishedTime,
  modifiedTime,
  author,
  keywords,
}: SEOProps = {}): Metadata {
  const seoTitle = title ? `${title} | BB4Peace` : defaultSEO.title
  const seoDescription = description || defaultSEO.description
  const seoImage = image || defaultSEO.image
  const seoUrl = url || defaultSEO.url

  return {
    title: seoTitle,
    description: seoDescription,
    keywords: keywords?.join(', '),
    authors: author ? [{ name: author }] : [{ name: defaultSEO.siteName }],
    openGraph: {
      title: seoTitle,
      description: seoDescription,
      url: seoUrl,
      siteName: defaultSEO.siteName,
      images: [
        {
          url: seoImage,
          width: 1200,
          height: 630,
          alt: seoTitle,
        },
      ],
      locale: 'en_NG',
      type,
      ...(type === 'article' && {
        publishedTime,
        modifiedTime,
        authors: author ? [author] : undefined,
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title: seoTitle,
      description: seoDescription,
      images: [seoImage],
      creator: defaultSEO.twitterHandle,
    },
    alternates: {
      canonical: seoUrl,
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
  }
}

export const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'NGO',
  name: 'Building Blocks for Peace Foundation',
  alternateName: 'BB4Peace',
  slogan: 'Empowering Communities for Peace',
  url: 'https://bbforpeace.org',
  logo: 'https://bbforpeace.org/images/logo.png',
  description: 'Empowering Communities for Peace — Youth-led peacebuilding NGO in Nigeria advocating for meaningful youth engagement in peace processes.',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '256, 1st Avenue, Federal Housing Authority (FHA), Lugbe',
    addressLocality: 'Abuja',
    addressCountry: 'Nigeria',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+234-8054151494',
    contactType: 'customer service',
    email: 'info@bbforpeace.org',
  },
  sameAs: [
    'https://web.facebook.com/bbforpeace',
    'https://twitter.com/bbforpeace',
    'https://www.instagram.com/bbforpeace/',
    'https://www.youtube.com/channel/UC10Im94vib-oh7AvVhZNPIg',
  ],
}

export function generateArticleJsonLd({
  title,
  description,
  url,
  image,
  publishedTime,
  modifiedTime,
  author,
}: {
  title: string
  description: string
  url: string
  image?: string
  publishedTime: string
  modifiedTime?: string
  author?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    url,
    image: image || 'https://bbforpeace.org/images/og-image.jpg',
    datePublished: publishedTime,
    dateModified: modifiedTime || publishedTime,
    author: {
      '@type': 'Organization',
      name: author || 'Building Blocks for Peace Foundation',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Building Blocks for Peace Foundation',
      logo: {
        '@type': 'ImageObject',
        url: 'https://bbforpeace.org/images/logo.png',
      },
    },
  }
}
