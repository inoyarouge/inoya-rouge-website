import { createClient } from '@/lib/supabase/server'
import PromotionTable from '@/components/admin/PromotionTable'
import type { Promotion } from '@/lib/types'
import { Plus } from 'lucide-react'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function PromotionsPage() {
  const supabase = await createClient()

  const { data } = await supabase
    .from('promotions')
    .select('*')
    .order('created_at', { ascending: false })

  const promotions = (data ?? []) as Promotion[]

  return (
    <div className="max-w-5xl mx-auto w-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-display text-gray-900">Promotions</h1>
          <p className="text-sm text-gray-500 mt-1">
            Run site-wide or category-wide sales. These layer on top of per-product discounts — best discount wins.
          </p>
        </div>
        <a
          href="/admin/promotions/new"
          className="flex items-center gap-2 px-4 py-2.5 bg-[#720B0B] text-white text-sm font-medium rounded-md shrink-0"
        >
          <Plus size={16} />
          New Promotion
        </a>
      </div>
      <PromotionTable promotions={promotions} />
    </div>
  )
}
