import type { Metadata } from 'next'
import PolicyTabs from '@/components/public/PolicyTabs'

export const revalidate = false

export const metadata: Metadata = {
  title: 'Policies | Inoya Rouge',
  description: 'Privacy Policy, Shipping Information, and Returns Policy for Inoya Rouge.',
}

export default async function PoliciesPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>
}) {
  const { tab } = await searchParams

  return (
    <div>
      <section className="bg-gray-900 text-white px-4 py-20 text-center">
        <h1 className="font-serif text-4xl md:text-5xl">Policies</h1>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-16">
        <PolicyTabs defaultTab={tab} />
      </section>
    </div>
  )
}
