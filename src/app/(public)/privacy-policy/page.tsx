import type { Metadata } from 'next'
import PromotionBannerResolver from '@/components/public/PromotionBannerResolver'
import PrivacyPolicyContent from '@/components/public/PrivacyPolicyContent'

export const revalidate = false

export const metadata: Metadata = {
    title: 'Privacy Policy | Inoya Rouge',
    description: 'Inoya Rouge Privacy Policy. Learn about how we collect, use, and protect your personal data.',
}

export default function PrivacyPolicyPage() {
    return (
        <div className="bg-[#fffcfb] min-h-screen">
            <PromotionBannerResolver />
            <PrivacyPolicyContent />
        </div>
    )
}
