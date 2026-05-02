'use client'

import { useMemo } from 'react'
import PromotionBanner from './PromotionBanner'
import { isPromotionLive } from '@/lib/pricing'
import type { Promotion } from '@/lib/types'

export default function PromotionBannerClient({
  promotions,
  category,
}: {
  promotions: Promotion[]
  category?: string | null
}) {
  const picked = useMemo(() => {
    const live = promotions.filter((p) => isPromotionLive(p))
    if (live.length === 0) return null

    if (category) {
      const match = live.find(
        (p) => p.scope === 'category' && p.scope_value === category,
      )
      if (match) return match
    }

    const allScope = live.filter((p) => p.scope === 'all')
    if (allScope.length === 0) return null

    return allScope.sort((a, b) => {
      if (a.discount_type === b.discount_type) return b.discount_value - a.discount_value
      return a.discount_type === 'percent' ? -1 : 1
    })[0]
  }, [promotions, category])

  if (!picked) return null
  return <PromotionBanner promotion={picked} />
}
