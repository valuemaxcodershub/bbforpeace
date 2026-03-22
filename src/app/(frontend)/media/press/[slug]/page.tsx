import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import { PageHero } from '@/components/layout'
import { formatDate, getMediaUrl } from '@/lib/utils'
import { Calendar, ArrowLeft } from 'lucide-react'

interface Props {
  params: Promise<{ slug: string }>
}

async function getPressArticle(slug: string) {
  try {
    const payload = await getPayload({ config })
    const result = await payload.find({
      collection: 'posts',
      where: {
        slug: { equals: slug },
        subMenu: { equals: 'press-statement' },
        status: { equals: 'published' },
      },
      depth: 2,
      limit: 1,
    })
    return result.docs[0] || null
  } catch (error) {
    console.error('Failed to fetch press article:', error)
    return null
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getPressArticle(slug)
  if (!post) return { title: 'Press Statement Not Found | BB4Peace' }

  return {
    title: post.seo?.metaTitle || `${post.title} | Press | BB4Peace`,
    description: post.seo?.metaDescription || post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt ?? undefined,
      type: 'article',
      publishedTime: post.publishedAt || undefined,
      images:
        post.featuredImage && typeof post.featuredImage === 'object'
          ? [{ url: post.featuredImage.url! }]
          : [],
    },
    twitter: { card: 'summary_large_image' },
  }
}

function RichTextContent({ content }: { content: any }) {
  if (!content) return null
  if (typeof content === 'object' && content.root) return <RichTextNode node={content.root} />
  if (typeof content === 'string') return <div dangerouslySetInnerHTML={{ __html: content }} />
  return null
}

function RichTextNode({ node }: { node: any }) {
  if (!node) return null

  if (node.type === 'text') {
    let text: React.ReactNode = node.text
    if (node.format & 1) text = <strong>{text}</strong>
    if (node.format & 2) text = <em>{text}</em>
    if (node.format & 8) text = <u>{text}</u>
    if (node.format & 16)
      text = <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">{text}</code>
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
      const HeadingTag = (`h${node.tag?.replace('h', '') || '2'}`) as
        | 'h1'
        | 'h2'
        | 'h3'
        | 'h4'
        | 'h5'
        | 'h6'
      const headingClasses: Record<string, string> = {
        h1: 'text-3xl font-bold mt-8 mb-4',
        h2: 'text-2xl font-bold mt-8 mb-3',
        h3: 'text-xl font-semibold mt-6 mb-3',
        h4: 'text-lg font-semibold mt-4 mb-2',
      }
      return (
        <HeadingTag className={headingClasses[node.tag] || 'text-lg font-semibold mt-4 mb-2'}>
          {children}
        </HeadingTag>
      )
    }
    case 'list':
      if (node.listType === 'number')
        return <ol className="list-decimal list-inside mb-4 space-y-1">{children}</ol>
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
    case 'upload':
      if (node.value) {
        return (
          <figure className="my-6">
            <Image
              src={node.value.url}
              alt={node.value.alt || ''}
              width={node.value.width || 800}
              height={node.value.height || 450}
              className="rounded-xl w-full h-auto"
            />
          </figure>
        )
      }
      return null
    default:
      return <>{children}</>
  }
}

export default async function PressArticlePage({ params }: Props) {
  const { slug } = await params
  const post = await getPressArticle(slug)
  if (!post) notFound()

  const featuredImage = getMediaUrl(post.featuredImage, '/images/_VEE7009 (1).jpg')
  const publishedDate = post.publishedAt || post.createdAt

  return (
    <main>
      <PageHero
        title={post.title}
        subtitle="Press Statement"
        backgroundImage={featuredImage}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Media', href: '/media' },
          { label: 'Press', href: '/media/press' },
          { label: post.title, href: `/media/press/${post.slug}` },
        ]}
      />

      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-6">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {formatDate(publishedDate)}
            </div>
          </div>

          <Link
            href="/media/press"
            className="inline-flex items-center gap-2 text-primary-700 hover:text-primary-900 mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Press Statements
          </Link>

          {featuredImage && (
            <div className="mb-8 rounded-lg overflow-hidden">
              <Image
                src={featuredImage}
                alt={post.title}
                width={800}
                height={400}
                className="w-full h-auto object-cover"
                priority
              />
            </div>
          )}

          <article className="prose prose-lg max-w-none mb-12">
            <RichTextContent content={post.content} />
          </article>
        </div>
      </section>
    </main>
  )
}
