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

export default async function HomePage() {
  // Fetch site settings from CMS
  let siteSettings = null
  try {
    const payload = await getPayload({ config })
    siteSettings = await payload.findGlobal({
      slug: 'site-settings',
    })
  } catch (error) {
    console.error('Failed to fetch site settings:', error)
  }

  // Extract hero section data
  const heroData = siteSettings ? {
    slogan: siteSettings.heroSlogan,
    mainTitle: siteSettings.heroMainTitle,
    slides: siteSettings.heroSlides,
    typewriterPhrases: siteSettings.typewriterPhrases,
    cta: siteSettings.heroCta,
  } : {}

  // Extract about section data
  const aboutData = siteSettings ? {
    title: siteSettings.aboutTitle,
    highlights: siteSettings.aboutHighlights,
    video: siteSettings.aboutVideo,
    images: siteSettings.aboutImages,
    yearsOfImpact: siteSettings.yearsOfImpact,
    mission: siteSettings.mission,
    vision: siteSettings.vision,
  } : {}

  return (
    <>
      <HeroSection {...heroData} />
      <ImpactStats />
      <AboutPreview {...aboutData} />
      <ProgrammesSection />
      <OurApproachSection />
      <InitiativesSection />
      <RecentActivities />
      <VideoSection />
      <AwardsSection />
      <PublicationsSection />
      <PartnersSection />
      <NewsletterSection />
      
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationJsonLd)
        }}
      />
    </>
  )
}
