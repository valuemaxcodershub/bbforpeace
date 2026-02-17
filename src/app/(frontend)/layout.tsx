import { Header, Footer } from '@/components/layout'
import { ScrollObserver } from '@/components/ui/ScrollObserver'

export default function FrontendLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <ScrollObserver />
      <Header />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  )
}
