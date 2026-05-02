import Link from 'next/link'
import PromotionForm from '@/components/admin/PromotionForm'
import { ArrowLeft } from 'lucide-react'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default function NewPromotionPage() {
  return (
    <div className="max-w-3xl mx-auto w-full">
      <Link
        href="/admin/promotions"
        prefetch={false}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors mb-6"
      >
        <ArrowLeft size={16} />
        Back to Promotions
      </Link>

      <h1 className="text-3xl font-display text-gray-900 mb-8">New Promotion</h1>

      <PromotionForm promotion={null} />
    </div>
  )
}
