import { createClient } from '@/lib/supabase/server'
import Sidebar from '@/components/admin/Sidebar'

export const revalidate = 0

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  // Get pending testimonial count for sidebar badge
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
      <Sidebar pendingCount={pendingCount} />
      <main className="flex-1 p-6 bg-gray-50">{children}</main>
    </div>
  )
}
