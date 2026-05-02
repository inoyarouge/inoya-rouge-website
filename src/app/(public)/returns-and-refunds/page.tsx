import type { Metadata } from 'next'
import PromotionBannerResolver from '@/components/public/PromotionBannerResolver'
import ReturnsRefundsContent from '@/components/public/ReturnsRefundsContent'

export const revalidate = false

export const metadata: Metadata = {
    title: 'Returns & Refunds | Inoya Rouge',
    description: 'Inoya Rouge Returns and Refunds policy. Learn about our conditions for returns, exchanges, and refund process.',
}

export default function ReturnsRefundsPage() {
    return (
        <div className="bg-[#fffcfb] min-h-screen">
            <PromotionBannerResolver />
            <ReturnsRefundsContent />
        </div>
    )
}
