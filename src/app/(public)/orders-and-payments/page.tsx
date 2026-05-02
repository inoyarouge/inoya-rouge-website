import type { Metadata } from 'next'
import PromotionBannerResolver from '@/components/public/PromotionBannerResolver'
import OrdersPaymentsContent from '@/components/public/OrdersPaymentsContent'

export const revalidate = false

export const metadata: Metadata = {
    title: 'Orders and Payments | Inoya Rouge',
    description: 'Inoya Rouge Orders and Payments. Information on order processing and secure payment methods.',
}

export default function OrdersAndPaymentsPage() {
    return (
        <div className="bg-[#fffcfb] min-h-screen flex flex-col">
            <PromotionBannerResolver />
            <OrdersPaymentsContent />
        </div>
    )
}
