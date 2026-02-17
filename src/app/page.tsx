import { Header, Footer } from '@/components/layout'
import {
  HeroSection,
  ImpactStats,
  AboutPreview,
  ProgrammesSection,
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
      <Header />
      <main>
        <HeroSection />
        <ImpactStats />
        <AboutPreview />
        <ProgrammesSection />
        <InitiativesSection />
        <RecentActivities />
        <VideoSection />
        <AwardsSection />
        <PublicationsSection />
        <PartnersSection />
        <NewsletterSection />
      </main>
      <Footer />
      
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
