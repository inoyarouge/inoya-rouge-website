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
      <main className="min-h-screen">{children}</main>
      <Footer />
      <CookieNotice />
    </>
  )
}
