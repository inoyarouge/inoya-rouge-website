import type { Metadata } from 'next'
import ContactClient from './ContactClient'
import PromotionBannerResolver from '@/components/public/PromotionBannerResolver'
import CommunityStoryForm from '@/components/public/CommunityStoryForm'
import TestimonialList from '@/components/public/TestimonialList'

export const revalidate = false

export const metadata: Metadata = {
  title: 'Contact Us | Inoya Rouge',
  description: 'Get in touch with Inoya Rouge. Phone, email, and social media contact information.',
}

export default function ContactPage() {
  return (
    <ContactClient
      promotionBanner={<PromotionBannerResolver />}
      communityStoryForm={<CommunityStoryForm />}
      testimonialList={<TestimonialList />}
    />
  )
}
