import type { Metadata } from 'next'
import PromotionBannerResolver from '@/components/public/PromotionBannerResolver'
import ProductInfoContent from '@/components/public/ProductInfoContent'

export const revalidate = false

export const metadata: Metadata = {
    title: 'Product Information | Inoya Rouge',
    description: 'Inoya Rouge Product Information. Learn about our product descriptions, accuracy, and variations.',
}

export default function ProductInformationPage() {
    return (
        <div className="bg-[#fffcfb] min-h-screen flex flex-col">
            <PromotionBannerResolver />
            <ProductInfoContent />
        </div>
    )
}
