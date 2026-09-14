import type { Metadata } from 'next'
import { createPublicClient } from '@/lib/supabase/public'
import type { Testimonial } from '@/lib/types'
import CommunityClient from './CommunityClient'
import PromotionBannerResolver from '@/components/public/PromotionBannerResolver'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Community | Inoya Rouge',
  description: 'Read stories from Inoya Rouge customers. Share your own story with our community.',
  openGraph: {
    title: 'Community | Inoya Rouge',
    description: 'Read stories from Inoya Rouge customers. Share your own story with our community.',
    url: '/community',
  },
}

export default async function CommunityPage() {
  const supabase = createPublicClient()
  const { data } = await supabase
    .from('testimonials')
    .select('id, author_name, title, content, created_at')
    .eq('status', 'approved')
    .order('created_at', { ascending: false })

  const testimonials = (data ?? []) as Pick<Testimonial, 'id' | 'author_name' | 'title' | 'content' | 'created_at'>[]

  return <CommunityClient testimonials={testimonials} promotionBanner={<PromotionBannerResolver />} />
}
