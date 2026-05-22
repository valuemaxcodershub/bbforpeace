import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayloadClient } from '@/lib/payload-client'
import { PageHero } from '@/components/layout'
import { getMediaUrl, getPublicationFileUrl } from '@/lib/utils'

import {
  Download,
  FileText,
  Calendar,
  User,
  ArrowLeft,
  MapPin,
} from 'lucide-react'
import { DownloadButton } from '@/components/ui/DownloadButton'

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ slug: string }>
}

async function getReport(slug: string) {
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'publications',
      where: {
        slug: { equals: slug },
      },
      depth: 2,
      limit: 1,
    })
    return result.docs[0] || null
  } catch (error) {
    console.error('Failed to fetch project report:', error)
    return null
  }
}

async function getRelatedReports(excludeId: number | string) {
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'publications',
      where: {
        subMenu: { equals: 'project-report' },
        id: { not_equals: excludeId },
      },
      sort: '-year',
      depth: 1,
      limit: 3,
    })
    return result.docs
  } catch (error) {
    console.error('Failed to fetch related reports:', error)
    return []
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const report = await getReport(slug)
  if (!report) return { title: 'Report Not Found | BB4Peace' }

  return {
    title: report.seo?.metaTitle || `${report.title} | BB4Peace`,
    description: report.seo?.metaDescription || report.excerpt || report.title,
    openGraph: {
      title: report.title,
      description: report.excerpt || report.title,
      type: 'article',
      images: report.coverImage && typeof report.coverImage === 'object'
        ? [{ url: report.coverImage.url! }]
        : [],
    },
    twitter: { card: 'summary_large_image' },
  }
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

export default async function ProjectReportDetailPage({ params }: Props) {
  const { slug } = await params
  const report = await getReport(slug)
  if (!report) notFound()

  const coverImage = getMediaUrl(report.coverImage)
  const fileUrl = getPublicationFileUrl(report)
  const relatedReports = await getRelatedReports(report.id)

  return (
    <>
      <PageHero
        title={report.title}
        subtitle="Project Report"
        backgroundImage={coverImage}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Annual Reports', href: '/reports' },
          { label: 'Project Reports', href: '/reports/projects' },
          { label: report.title },
        ]}
      />

      <article className="py-12 lg:py-16">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-10 lg:gap-14">
              {/* Main Content */}
              <div className="lg:col-span-2 order-2 lg:order-1">
                {/* Excerpt Intro */}
                {report.excerpt && (
                  <div className="mb-10 p-6 bg-primary-50 border-l-4 border-primary-700 rounded-r-xl">
                    <p className="text-gray-800 text-lg leading-relaxed italic">
                      {report.excerpt}
                    </p>
                  </div>
                )}

                {/* Description (Rich Text) */}
                <div className="prose prose-lg max-w-none text-gray-700">
                  <RichTextContent content={report.description} />
                </div>

                <div className="mt-10 pt-8 border-t">
                  <Link
                    href="/reports/projects"
                    className="inline-flex items-center gap-2 text-primary-900 hover:text-primary-700 font-semibold transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Project Reports
                  </Link>
                </div>
              </div>

              {/* Sidebar */}
              <aside className="lg:col-span-1 order-1 lg:order-2">
                <div className="sticky top-24 space-y-6">
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                    <div className="relative aspect-3/4">
                      <Image
                        src={coverImage}
                        alt={report.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-6 space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <FileText className="w-4 h-4 text-gray-400" />
                          <span>{report.category || 'Project Report'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span>{report.year}</span>
                        </div>
                        {report.region && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <span>{report.region}</span>
                          </div>
                        )}
                        {report.author && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <User className="w-4 h-4 text-gray-400" />
                            <span>{report.author}</span>
                          </div>
                        )}
                        {(report.pages ?? 0) > 0 && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <FileText className="w-4 h-4 text-gray-400" />
                            <span>{report.pages} pages</span>
                          </div>
                        )}
                      </div>

                      {fileUrl && (
                        <DownloadButton
                          publicationId={report.id}
                          fileUrl={fileUrl}
                          initialDownloadCount={report.downloadCount ?? 0}
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

      {/* Related Reports */}
      {relatedReports.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container">
            <div className="text-center mb-12">
              <span className="inline-flex items-center gap-3 justify-center text-primary-900 text-sm font-semibold uppercase tracking-widest mb-4">
                <span className="w-8 h-0.5 bg-primary-900" />
                More Reports
                <span className="w-8 h-0.5 bg-primary-900" />
              </span>
              <h2 className="text-3xl font-bold text-gray-900">Related Project Reports</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {relatedReports.map((r: any) => {
                const img = getMediaUrl(r.coverImage)
                return (
                  <Link
                    key={r.id}
                    href={`/reports/projects/${r.slug}`}
                    className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100"
                  >
                    <div className="relative aspect-4/3">
                      <Image src={img} alt={r.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="p-5">
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                        <span>{r.year}</span>
                        {r.region && <><span>·</span><span>{r.region}</span></>}
                      </div>
                      <h3 className="font-bold text-gray-900 group-hover:text-primary-900 transition-colors line-clamp-2">{r.title}</h3>
                      {r.excerpt && <p className="text-gray-600 text-sm mt-2 line-clamp-2">{r.excerpt}</p>}
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
