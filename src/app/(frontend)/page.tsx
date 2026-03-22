import {
  HeroSection,
  ImpactStats,
  AboutPreview,
  ProgrammesSection,
  OurApproachSection,
  InitiativesSection,
  RecentActivities,
  VideoSection,
  AwardsSection,
  PublicationsSection,
  PartnersSection,
  NewsletterSection,
} from '@/components/sections'
import { organizationJsonLd } from '@/lib/seo'
import { getPayload } from 'payload'
import config from '@payload-config'
import Script from 'next/script'

export const revalidate = 60

async function getPayloadWithTimeout(timeoutMs = 5000) {
  return await Promise.race([
    getPayload({ config }),
    new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error(`Payload init timeout after ${timeoutMs}ms`)), timeoutMs)
    }),
  ])
}

export default async function HomePage() {
  let payload: Awaited<ReturnType<typeof getPayload>> | null = null
  try {
    payload = await getPayloadWithTimeout()
  } catch (error) {
    console.error('Failed to initialize payload for homepage:', error)
  }

  // Fetch ALL homepage data concurrently to avoid serial 5s timeouts per query.
  // Each query has its own .catch() so one failure doesn't block the others.
  let hs: Record<string, any> = {}
  let partnersData: any = null
  let partnersDocs: any[] = []
  let awardData: any = null
  let recentPostsDocs: any[] = []
  let recentPubsDocs: any[] = []

  if (payload) {
    try {
      const [homeSettings, partners, partnersList, awards, posts, pubs] = await Promise.all([
        payload.findGlobal({ slug: 'home-page-settings' }).catch(() => ({})),
        payload.findGlobal({ slug: 'partners-settings' }).catch(() => null),
        payload.find({ collection: 'partners', where: { isActive: { equals: true } }, sort: 'order', limit: 20, depth: 1 }).catch(() => ({ docs: [] })),
        payload.findGlobal({ slug: 'award-settings' }).catch(() => null),
        payload.find({ collection: 'posts', where: { status: { equals: 'published' } }, sort: '-publishedAt', limit: 3, depth: 1 }).catch(() => ({ docs: [] })),
        payload.find({ collection: 'publications', sort: '-year', limit: 4, depth: 1 }).catch(() => ({ docs: [] })),
      ])
      hs = (homeSettings ?? {}) as Record<string, any>
      partnersData = partners
      partnersDocs = (partnersList as any)?.docs ?? []
      awardData = awards
      recentPostsDocs = (posts as any)?.docs ?? []
      recentPubsDocs = (pubs as any)?.docs ?? []
    } catch (error) {
      console.error('Homepage data fetch failed:', error)
    }
  }

  return (
    <>
      <HeroSection
        mainTitle={hs.heroMainTitle}
        slides={hs.heroSlides}
        typewriterPhrases={hs.typewriterPhrases}
        cta={hs.heroCta}
      />
      <ImpactStats
        badge={hs.impactBadge}
        heading={hs.impactHeading}
        description={hs.impactDescription}
        image={hs.impactImage}
        highlights={hs.impactHighlights}
        stats={hs.impactStats}
      />
      <AboutPreview
        title={hs.aboutTitle}
        paragraph1={hs.aboutParagraph1}
        paragraph2={hs.aboutParagraph2}
        highlights={hs.aboutHighlights}
        video={{ youtubeId: hs.aboutVideoId, title: hs.aboutVideoTitle }}
        images={{ mainImage: hs.aboutMainImage, secondaryImage: hs.aboutSecondaryImage }}
        yearsOfImpact={hs.aboutYearsOfImpact}
        mission={hs.aboutMission}
        vision={hs.aboutVision}
      />
      <ProgrammesSection
        badge={hs.focusBadge}
        heading={hs.focusHeading}
        description={hs.focusDescription}
        backgroundImage={hs.focusBackgroundImage}
        focusAreas={hs.focusAreas}
      />
      <OurApproachSection
        badge={hs.approachBadge}
        heading={hs.approachHeading}
        description={hs.approachDescription}
        pillars={hs.approachPillars}
      />
      <InitiativesSection
        badge={hs.initiativesBadge}
        heading={hs.initiativesHeading}
        description={hs.initiativesDescription}
        initiatives={hs.initiatives}
      />
      <RecentActivities
        posts={recentPostsDocs.length ? recentPostsDocs.map((p: any) => ({
          id: p.id,
          title: p.title,
          excerpt: p.excerpt,
          slug: p.slug,
          featuredImage: p.featuredImage,
          category: p.category,
          publishedAt: p.publishedAt,
        })) : undefined}
      />
      <VideoSection
        badge={hs.videoBadge}
        heading={hs.videoHeading}
        description={hs.videoDescription}
        videos={hs.videos}
      />
      <AwardsSection
        heading={awardData?.heading || hs.awardsHeading}
        description={awardData?.description || hs.awardsDescription}
        backgroundImage={awardData?.backgroundImage || hs.awardsBackgroundImage}
        awards={awardData?.awards?.length ? awardData.awards : hs.awards}
      />
      <PublicationsSection
        publications={recentPubsDocs.length ? recentPubsDocs.map((p: any) => ({
          id: p.id,
          title: p.title,
          coverImage: p.coverImage,
          file: p.file,
          year: p.year,
          category: p.category,
        })) : undefined}
      />
      <PartnersSection
        heading={(partnersData as any)?.heading}
        subheading={(partnersData as any)?.subheading}
        description={(partnersData as any)?.description}
        ctaText={(partnersData as any)?.ctaText}
        ctaLinkLabel={(partnersData as any)?.ctaLinkLabel}
        partners={partnersDocs.length ? partnersDocs.map((p: any) => ({
          name: p.name,
          logo: p.logo,
        })) : undefined}
      />
      <NewsletterSection
        heading={hs.newsletterHeading}
        description={hs.newsletterDescription}
        buttonText={hs.newsletterButtonText}
      />
      
      {/* Structured Data */}
      <Script
        id="organization-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationJsonLd)
        }}
      />
    </>
  )
}
