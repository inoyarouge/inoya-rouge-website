import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import type { Testimonial } from '@/lib/types'
import CommunityClient from './CommunityClient'
import PromotionBannerResolver from '@/components/public/PromotionBannerResolver'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata: Metadata = {
  title: 'Community | Inoya Rouge',
  description: 'Read stories from Inoya Rouge customers. Share your own story with our community.',
}

export default async function CommunityPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('testimonials')
    .select('id, author_name, title, content, created_at')
    .eq('status', 'approved')
    .order('created_at', { ascending: false })

  const testimonials = (data ?? []) as Pick<Testimonial, 'id' | 'author_name' | 'title' | 'content' | 'created_at'>[]

  return <CommunityClient testimonials={testimonials} promotionBanner={<PromotionBannerResolver />} />
}
