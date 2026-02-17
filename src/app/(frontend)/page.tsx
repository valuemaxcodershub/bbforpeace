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

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ImpactStats />
      <AboutPreview />
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
