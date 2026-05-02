import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth/requireAdmin'
import Sidebar from '@/components/admin/Sidebar'
import NavigationProgress from '@/components/public/NavigationProgress'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await requireAdmin()

  const supabase = await createClient()

  let pendingCount = 0
  try {
    const { count } = await supabase
      .from('testimonials')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending')
    pendingCount = count ?? 0
  } catch {
    // Layout must render even if Supabase is unreachable
  }

  return (
    <div className="min-h-screen flex">
      <Suspense fallback={null}>
        <NavigationProgress />
      </Suspense>
      <Sidebar pendingCount={pendingCount} />
      <main className="flex-1 min-w-0 overflow-hidden p-6 bg-gray-50">{children}</main>
    </div>
  )
}
