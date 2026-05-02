import type { Metadata } from 'next'
import PromotionBannerResolver from '@/components/public/PromotionBannerResolver'
import ShippingDeliveryContent from '@/components/public/ShippingDeliveryContent'

export const revalidate = false

export const metadata: Metadata = {
    title: 'Shipping & Delivery | Inoya Rouge',
    description: 'Inoya Rouge Shipping and Delivery information. Learn about our delivery timelines, charges, and process.',
}

export default function ShippingDeliveryPage() {
    return (
        <div className="bg-[#fffcfb] min-h-screen">
            <PromotionBannerResolver />
            <ShippingDeliveryContent />
        </div>
    )
}
