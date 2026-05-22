import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayloadClient } from '@/lib/payload-client'
import { PageHero } from '@/components/layout'
import { PublicationCard } from '@/components/cards'
import { getMediaUrl, getPublicationFileUrl } from '@/lib/utils'

import {
  Download,
  FileText,
  Calendar,
  User,
  ArrowLeft,
} from 'lucide-react'
import { DownloadButton } from '@/components/ui/DownloadButton'

interface Props {
  params: Promise<{ slug: string }>
}

async function getPublication(slug: string) {
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'publications',
      where: { slug: { equals: slug } },
      depth: 2,
      limit: 1,
    })
    return result.docs[0] || null
  } catch (error) {
    console.error('Failed to fetch publication:', error)
    return null
  }
}

async function getRelatedPublications(category: string, excludeId: number | string) {
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'publications',
      where: {
        category: { equals: category },
        id: { not_equals: excludeId },
      },
      sort: '-year',
      depth: 1,
      limit: 3,
    })
    return result.docs
  } catch (error) {
    console.error('Failed to fetch related publications:', error)
    return []
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const pub = await getPublication(slug)
  if (!pub) return { title: 'Publication Not Found | BB4Peace' }

  return {
    title: pub.seo?.metaTitle || `${pub.title} | BB4Peace`,
    description: pub.seo?.metaDescription || pub.excerpt || pub.title,
    openGraph: {
      title: pub.title,
      description: pub.excerpt || pub.title,
      type: 'article',
      images: pub.coverImage && typeof pub.coverImage === 'object'
        ? [{ url: pub.coverImage.url! }]
        : [],
    },
    twitter: { card: 'summary_large_image' },
  }
}

const categoryLabels: Record<string, string> = {
  research: 'Research Paper',
  report: 'Report',
  'policy-brief': 'Policy Brief',
  factsheet: 'Factsheet',
  manual: 'Manual',
  other: 'Other',
}

function RichTextContent({ content }: { content: any }) {
  if (!content) return null
  if (typeof content === 'object' && content.root) {
    return <RichTextNode node={content.root} />
  }
  if (typeof content === 'string') {
    return <div dangerouslySetInnerHTML={{ __html: content }} />
  }
  return null
}

function RichTextNode({ node }: { node: any }) {
  if (!node) return null

  if (node.type === 'text') {
    let text: React.ReactNode = node.text
    if (node.format & 1) text = <strong>{text}</strong>
    if (node.format & 2) text = <em>{text}</em>
    if (node.format & 8) text = <u>{text}</u>
    if (node.format & 16) text = <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">{text}</code>
    return <>{text}</>
  }

  if (node.type === 'linebreak') return <br />

  const children = node.children?.map((child: any, i: number) => (
    <RichTextNode key={i} node={child} />
  ))

  switch (node.type) {
    case 'root':
      return <>{children}</>
    case 'paragraph':
      return <p className="mb-4 leading-relaxed">{children}</p>
    case 'heading': {
      const HeadingTag = (`h${node.tag?.replace('h', '') || '2'}`) as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
      const cls: Record<string, string> = {
        h1: 'text-3xl font-bold mt-8 mb-4',
        h2: 'text-2xl font-bold mt-8 mb-3',
        h3: 'text-xl font-semibold mt-6 mb-3',
        h4: 'text-lg font-semibold mt-4 mb-2',
      }
      return <HeadingTag className={cls[node.tag] || 'text-lg font-semibold mt-4 mb-2'}>{children}</HeadingTag>
    }
    case 'list':
      if (node.listType === 'number') {
        return <ol className="list-decimal list-inside mb-4 space-y-1">{children}</ol>
      }
      return <ul className="list-disc list-inside mb-4 space-y-1">{children}</ul>
    case 'listitem':
      return <li>{children}</li>
    case 'link':
      return (
        <a
          href={node.fields?.url || '#'}
          target={node.fields?.newTab ? '_blank' : undefined}
          rel={node.fields?.newTab ? 'noopener noreferrer' : undefined}
          className="text-primary-700 hover:text-primary-900 underline"
        >
          {children}
        </a>
      )
    case 'quote':
      return (
        <blockquote className="border-l-4 border-primary-500 pl-4 my-6 italic text-gray-700">
          {children}
        </blockquote>
      )
    default:
      return <>{children}</>
  }
}

export default async function PublicationDetailPage({ params }: Props) {
  const { slug } = await params
  const pub = await getPublication(slug)
  if (!pub) notFound()

  const coverImage = getMediaUrl(pub.coverImage)
  const fileUrl = getPublicationFileUrl(pub)
  const categoryLabel = categoryLabels[pub.category] || pub.category
  const relatedPubs = await getRelatedPublications(pub.category, pub.id)

  const normalizedRelated = relatedPubs.map((p: any) => ({
    id: String(p.id),
    title: p.title,
    excerpt: p.excerpt || '',
    slug: p.slug,
    coverImage: getMediaUrl(p.coverImage),
    fileUrl: getPublicationFileUrl(p),
    category: p.category,
    year: p.year,
    downloadCount: p.downloadCount || 0,
  }))

  return (
    <>
      <PageHero
        title={pub.title}
        subtitle={categoryLabel}
        backgroundImage={coverImage}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Publications', href: '/publications' },
          { label: pub.title },
        ]}
      />

      <article className="py-12 lg:py-16">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-10 lg:gap-14">
              {/* Main Content */}
              <div className="lg:col-span-2 order-2 lg:order-1">
                {/* Excerpt Intro */}
                {pub.excerpt && (
                  <div className="mb-10 p-6 bg-primary-50 border-l-4 border-primary-700 rounded-r-xl">
                    <p className="text-gray-800 text-lg leading-relaxed italic">
                      {pub.excerpt}
                    </p>
                  </div>
                )}

                {/* Description (Rich Text) */}
                <div className="prose prose-lg max-w-none text-gray-700">
                  <RichTextContent content={pub.description} />
                </div>

                {/* Back Link */}
                <div className="mt-10 pt-8 border-t">
                  <Link
                    href="/publications"
                    className="inline-flex items-center gap-2 text-primary-900 hover:text-primary-700 font-semibold transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Publications
                  </Link>
                </div>
              </div>

              {/* Sidebar */}
              <aside className="lg:col-span-1 order-1 lg:order-2">
                <div className="sticky top-24 space-y-6">
                  {/* Cover + Download Card */}
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                    <div className="relative aspect-3/4">
                      <Image
                        src={coverImage}
                        alt={pub.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-6 space-y-4">
                      {/* Meta */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <FileText className="w-4 h-4 text-gray-400" />
                          <span>{categoryLabel}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span>{pub.year}</span>
                        </div>
                        {pub.author && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <User className="w-4 h-4 text-gray-400" />
                            <span>{pub.author}</span>
                          </div>
                        )}
                      </div>

                      {/* Download Button */}
                      {fileUrl && (
                        <DownloadButton
                          publicationId={pub.id}
                          fileUrl={fileUrl}
                          initialDownloadCount={pub.downloadCount ?? 0}
                          showCount={false}
                          className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary-900 text-white font-semibold hover:bg-primary-800 transition-colors"
                        />
                      )}
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </article>

      {/* Related Publications */}
      {normalizedRelated.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container">
            <div className="text-center mb-12">
              <span className="inline-flex items-center gap-3 justify-center text-primary-900 text-sm font-semibold uppercase tracking-widest mb-4">
                <span className="w-8 h-0.5 bg-primary-900" />
                More Publications
                <span className="w-8 h-0.5 bg-primary-900" />
              </span>
              <h2 className="text-3xl font-bold text-gray-900">Related Resources</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {normalizedRelated.map((p, i) => (
                <PublicationCard key={p.id} publication={p} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
