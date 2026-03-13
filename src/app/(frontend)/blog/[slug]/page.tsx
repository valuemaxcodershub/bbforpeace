import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import { PageHero } from '@/components/layout'
import { BlogCard } from '@/components/cards'
import { formatDate, getMediaUrl } from '@/lib/utils'
import {
  Calendar,
  Clock,
  Tag,
  User,
  ArrowLeft,
} from 'lucide-react'

interface Props {
  params: Promise<{ slug: string }>
}

async function getPost(slug: string) {
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'posts',
    where: {
      slug: { equals: slug },
      status: { equals: 'published' },
    },
    depth: 2,
    limit: 1,
  })
  return result.docs[0] || null
}

async function getRelatedPosts(categoryId: number | string, currentId: number | string) {
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'posts',
    where: {
      status: { equals: 'published' },
      category: { equals: categoryId },
      id: { not_equals: currentId },
    },
    sort: '-publishedAt',
    depth: 2,
    limit: 3,
  })
  return result.docs
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) return { title: 'Post Not Found | BB4Peace' }

  return {
    title: post.seo?.metaTitle || `${post.title} | BB4Peace`,
    description: post.seo?.metaDescription || post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.publishedAt || undefined,
      images: post.featuredImage && typeof post.featuredImage === 'object'
        ? [{ url: post.featuredImage.url! }]
        : [],
    },
    twitter: { card: 'summary_large_image' },
  }
}

function getCategoryName(cat: any): string {
  if (!cat) return 'Uncategorized'
  if (typeof cat === 'object') return cat.name || 'Uncategorized'
  return String(cat)
}

function getCategoryId(cat: any): string | number | null {
  if (!cat) return null
  if (typeof cat === 'object') return cat.id
  return cat
}

function RichTextContent({ content }: { content: any }) {
  if (!content) return null

  // Payload Lexical rich text stores content as a JSON tree
  if (typeof content === 'object' && content.root) {
    return <RichTextNode node={content.root} />
  }

  // Fallback: if it's somehow a string
  if (typeof content === 'string') {
    return <div dangerouslySetInnerHTML={{ __html: content }} />
  }

  return null
}

function RichTextNode({ node }: { node: any }) {
  if (!node) return null

  // Handle text nodes
  if (node.type === 'text') {
    let text: React.ReactNode = node.text
    if (node.format & 1) text = <strong>{text}</strong>
    if (node.format & 2) text = <em>{text}</em>
    if (node.format & 8) text = <u>{text}</u>
    if (node.format & 16) text = <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">{text}</code>
    return <>{text}</>
  }

  // Handle linebreak
  if (node.type === 'linebreak') return <br />

  // Render children
  const children = node.children?.map((child: any, i: number) => (
    <RichTextNode key={i} node={child} />
  ))

  switch (node.type) {
    case 'root':
      return <>{children}</>
    case 'paragraph':
      return <p className="mb-4 leading-relaxed">{children}</p>
    case 'heading':
      const HeadingTag = (`h${node.tag?.replace('h', '') || '2'}`) as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
      const headingClasses: Record<string, string> = {
        h1: 'text-3xl font-bold mt-8 mb-4',
        h2: 'text-2xl font-bold mt-8 mb-3',
        h3: 'text-xl font-semibold mt-6 mb-3',
        h4: 'text-lg font-semibold mt-4 mb-2',
      }
      return <HeadingTag className={headingClasses[node.tag] || 'text-lg font-semibold mt-4 mb-2'}>{children}</HeadingTag>
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
            {node.value.caption && (
              <figcaption className="text-sm text-gray-500 mt-2 text-center">{node.value.caption}</figcaption>
            )}
          </figure>
        )
      }
      return null
    default:
      return <>{children}</>
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) notFound()

  const categoryId = getCategoryId(post.category)
  const relatedPosts = categoryId ? await getRelatedPosts(categoryId, post.id) : []

  const featuredImage = getMediaUrl(post.featuredImage)
  const categoryName = getCategoryName(post.category)
  const authorName = post.author && typeof post.author === 'object'
    ? (post.author as any).name || 'BB4Peace Team'
    : 'BB4Peace Team'
  const publishedDate = post.publishedAt || post.createdAt
  const readTime = `${Math.max(2, Math.ceil((post.excerpt?.length || 100) / 200))} min read`

  const normalizedRelated = relatedPosts.map((p: any) => ({
    id: String(p.id),
    title: p.title,
    excerpt: p.excerpt || '',
    slug: p.slug,
    featuredImage: getMediaUrl(p.featuredImage),
    category: getCategoryName(p.category),
    publishedAt: p.publishedAt || p.createdAt,
  }))

  return (
    <>
      <PageHero
        title={post.title}
        subtitle={categoryName}
        backgroundImage={featuredImage}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Blog', href: '/blog' },
          { label: post.title },
        ]}
      />

      <article className="py-16">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 mb-8 text-sm text-gray-500">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-100 text-primary-900 font-semibold text-xs">
                <Tag className="w-3 h-3" />
                {categoryName}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {formatDate(publishedDate)}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {readTime}
              </span>
              <span className="flex items-center gap-1.5">
                <User className="w-4 h-4" />
                {authorName}
              </span>
            </div>

            {/* Featured Image */}
            <div className="relative aspect-video rounded-2xl overflow-hidden mb-10 shadow-xl">
              <Image
                src={featuredImage}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Content */}
            <div className="prose prose-lg max-w-none text-gray-700">
              <RichTextContent content={post.content} />
            </div>

            {/* Media Gallery */}
            {post.mediaGallery && (post.mediaGallery as any[]).length > 0 && (
              <div className="mt-12">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Gallery</h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {(post.mediaGallery as any[]).map((item: any, idx: number) => (
                    <div key={idx} className="relative rounded-xl overflow-hidden shadow-md">
                      {item.type === 'image' && item.image && (
                        <div className="relative aspect-video">
                          <Image
                            src={getMediaUrl(item.image)}
                            alt={item.caption || `Gallery image ${idx + 1}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      {item.type === 'youtube' && item.youtubeId && (
                        <div className="relative aspect-video">
                          <iframe
                            src={`https://www.youtube-nocookie.com/embed/${item.youtubeId}`}
                            title={item.youtubeTitle || `Video ${idx + 1}`}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="absolute inset-0 w-full h-full"
                          />
                        </div>
                      )}
                      {item.caption && (
                        <p className="p-3 text-sm text-gray-600 bg-gray-50">{item.caption}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            {post.tags && (post.tags as any[]).length > 0 && (
              <div className="mt-10 pt-8 border-t flex flex-wrap items-center gap-2">
                <Tag className="w-4 h-4 text-gray-400" />
                {(post.tags as any[]).map((tag: any) => {
                  const tagName = typeof tag === 'object' ? tag.name : tag
                  return (
                    <span
                      key={typeof tag === 'object' ? tag.id : tag}
                      className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-sm font-medium"
                    >
                      {tagName}
                    </span>
                  )
                })}
              </div>
            )}

            {/* Navigation */}
            <div className="mt-10 pt-8 border-t flex justify-between">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-primary-900 hover:text-primary-700 font-semibold transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Blog
              </Link>
            </div>
          </div>
        </div>
      </article>

      {/* Related Posts */}
      {normalizedRelated.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container">
            <div className="text-center mb-12">
              <span className="inline-flex items-center gap-3 justify-center text-primary-900 text-sm font-semibold uppercase tracking-widest mb-4">
                <span className="w-8 h-[2px] bg-primary-900" />
                More to Read
                <span className="w-8 h-[2px] bg-primary-900" />
              </span>
              <h2 className="text-3xl font-bold text-gray-900">Related Articles</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {normalizedRelated.map((p, i) => (
                <BlogCard key={p.id} post={p} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
