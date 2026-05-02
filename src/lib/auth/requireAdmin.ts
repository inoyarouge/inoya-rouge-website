import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function requireAdmin() {
  let userId: string | null = null
  let isAdmin = false

  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    userId = user?.id ?? null

    if (userId) {
      const { data: row } = await supabase
        .from('admin_users')
        .select('user_id')
        .eq('user_id', userId)
        .maybeSingle()
      isAdmin = !!row
    }
  } catch {
    redirect('/admin/login')
  }

  if (!userId || !isAdmin) redirect('/admin/login')
  return { id: userId }
}
