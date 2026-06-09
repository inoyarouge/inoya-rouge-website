import PromotionBanner from './PromotionBanner'
import { createPublicClient } from '@/lib/supabase/public'
import { isPromotionLive } from '@/lib/pricing'
import type { Promotion } from '@/lib/types'

export default async function PromotionBannerResolver({
  category,
}: {
  category?: string | null
}) {
  const supabase = createPublicClient()
  const { data } = await supabase
    .from('promotions')
    .select('*')
    .eq('is_active', true)

  const live = ((data ?? []) as Promotion[]).filter((p) => isPromotionLive(p))
  if (live.length === 0) return null

  if (category) {
    const match = live.find(
      (p) => p.scope === 'category' && p.scope_value === category,
    )
    if (match) return <PromotionBanner promotion={match} />
  }

  const allScope = live.filter((p) => p.scope === 'all')
  if (allScope.length === 0) return null

  const best = allScope.sort((a, b) => {
    if (a.discount_type === b.discount_type) return b.discount_value - a.discount_value
    return a.discount_type === 'percent' ? -1 : 1
  })[0]

  return <PromotionBanner promotion={best} />
}
