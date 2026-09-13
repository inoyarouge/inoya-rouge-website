import { Suspense } from 'react'
import Navbar from '@/components/public/Navbar'
import Footer from '@/components/public/Footer'
import NavigationProgress from '@/components/public/NavigationProgress'
import CookieNotice from '@/components/public/CookieNotice'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Suspense fallback={null}>
        <NavigationProgress />
      </Suspense>
      <Navbar />
      {/* pt reserves space for the fixed 50/60px Navbar, which is out of flow. This lived
          on PromotionBanner before, so pages lost their clearance whenever no promotion was
          live and content slid under the bar. Sections that are meant to run full-bleed
          under the navbar (the homepage hero) opt out with -mt-[50px] md:-mt-[60px]. */}
      <main className="min-h-screen pt-[50px] md:pt-[60px]">{children}</main>
      <Footer />
      <CookieNotice />
    </>
  )
}
