import { Suspense } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import ProductCard from '@/components/public/ProductCard'
import TrustBadges from '@/components/public/TrustBadges'
import type { Product, Testimonial } from '@/lib/types'

export const revalidate = 3600

// --- Skeleton fallbacks ---

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3].map(i => (
        <div key={i} className="aspect-[3/4] bg-gray-100 rounded animate-pulse" />
      ))}
    </div>
  )
}

function SkeletonCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[1, 2, 3].map(i => (
        <div key={i} className="h-32 bg-gray-100 rounded animate-pulse" />
      ))}
    </div>
  )
}

// --- Async data components ---

async function FeaturedProducts() {
  const supabase = await createClient()
  const categories = ['Lips', 'Eyes', 'Face'] as const
  const products: Product[] = []

  for (const cat of categories) {
    const { data } = await supabase
      .from('products')
      .select('*, product_variants(*)')
      .eq('category', cat)
      .eq('is_active', true)
      .order('sort_order', { ascending: true })
      .limit(1)
      .single()
    if (data) products.push(data as Product)
  }

  if (products.length === 0) {
    return <p className="text-gray-500">No products available yet.</p>
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map(p => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  )
}

async function CustomerStories() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('testimonials')
    .select('*')
    .eq('status', 'approved')
    .order('created_at', { ascending: false })
    .limit(3)

  const testimonials = data as Testimonial[] | null

  if (!testimonials?.length) {
    return <p className="text-gray-500">No stories yet — be the first to share yours!</p>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {testimonials.map(t => (
        <blockquote key={t.id} className="bg-white rounded-lg p-6 border border-gray-100">
          <div className="text-brand-rose text-2xl font-serif mb-2">&ldquo;</div>
          <h3 className="font-medium mb-2">{t.title}</h3>
          <p className="text-gray-600 text-sm leading-relaxed">{t.content}</p>
          <footer className="mt-4 text-xs text-gray-400 font-medium uppercase tracking-wide">— {t.author_name}</footer>
        </blockquote>
      ))}
    </div>
  )
}

// --- Homepage ---

export default function HomePage() {
  return (
    <div>
      {/* 1. Hero */}
      <section className="relative bg-gray-900 flex items-center justify-center min-h-[60vh] md:min-h-[80vh] px-4">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/80 to-gray-900/40" />
        <div className="relative z-10 text-center text-white max-w-3xl">
          <p className="text-xs uppercase tracking-[0.3em] text-gray-300 mb-4">Indian Luxury Cosmetics</p>
          <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl mb-6 leading-tight">
            Inspired by Nature, Defined by Color
          </h1>
          <p className="text-lg text-gray-300 mb-8 max-w-xl mx-auto">
            Conscious beauty rooted in India&apos;s rich traditions, crafted for the modern woman.
          </p>
          <Link
            href="/shop"
            className="inline-block bg-brand-rose text-white px-8 py-4 min-h-[44px] text-sm uppercase tracking-widest font-medium rounded hover:bg-brand-rose/90"
          >
            Shop the Collection
          </Link>
        </div>
      </section>

      {/* 2. Trust Badges */}
      <TrustBadges />

      {/* 3. Featured Products */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="font-serif text-3xl mb-2 text-center">Featured Products</h2>
        <p className="text-gray-400 text-sm text-center mb-10">One from each collection</p>
        <Suspense fallback={<SkeletonGrid />}>
          <FeaturedProducts />
        </Suspense>
      </section>

      {/* 4. Brand Story Teaser */}
      <section className="bg-gray-50 px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-gray-400 mb-4">About Us</p>
          <h2 className="font-serif text-3xl mb-6">Our Story</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            Inoya Rouge is born from a deep love for India&apos;s natural beauty traditions,
            reimagined for the modern woman. We believe beauty should be conscious, inclusive,
            and inspired by nature.
          </p>
          <Link
            href="/our-story"
            className="text-brand-rose text-sm font-medium uppercase tracking-wide min-h-[44px] inline-flex items-center hover:underline"
          >
            Read our story →
          </Link>
        </div>
      </section>

      {/* 5. Shop by Category */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="font-serif text-3xl mb-2 text-center">Shop by Category</h2>
        <p className="text-gray-400 text-sm text-center mb-10">Find your perfect match</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {([
            { name: 'Lips', tagline: 'Bold color, lasting comfort' },
            { name: 'Eyes', tagline: 'Define your gaze' },
            { name: 'Face', tagline: 'Your natural canvas' },
          ] as const).map(cat => (
            <Link
              key={cat.name}
              href={`/shop?category=${cat.name}`}
              className="block bg-gray-900 text-white rounded-lg p-10 text-center hover:bg-gray-800 min-h-[44px]"
            >
              <span className="font-serif text-2xl block mb-2">{cat.name}</span>
              <span className="text-xs text-gray-400 uppercase tracking-wide">{cat.tagline}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* 6. Customer Stories */}
      <section className="bg-gray-50 px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="font-serif text-3xl">What Our Customers Say</h2>
              <p className="text-gray-400 text-sm mt-1">Real stories from our community</p>
            </div>
            <Link href="/community" className="text-sm text-brand-rose font-medium uppercase tracking-wide min-h-[44px] inline-flex items-center hover:underline">
              See all →
            </Link>
          </div>
          <Suspense fallback={<SkeletonCards />}>
            <CustomerStories />
          </Suspense>
        </div>
      </section>

      {/* 7. Instagram Placeholder */}
      <section className="max-w-6xl mx-auto px-4 py-16 text-center">
        <h2 className="font-serif text-3xl mb-3">Follow Us on Instagram</h2>
        <p className="text-gray-400 text-sm">@inoyarouge — feed coming soon</p>
      </section>
    </div>
  )
}
