'use client'

import { useState, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import ProductCard from '@/components/public/ProductCard'
import type { Product } from '@/lib/types'

const categories = ['All', 'Lips', 'Eyes', 'Face'] as const
type Category = (typeof categories)[number]

const lipsCollections = ['All Lips', 'Kysmé', 'Liquid Allure', 'Tint Amour']

const taglines: Record<string, string> = {
  Eyes: 'Define, Dazzle, Dominate',
  Face: 'Naturally Luxe, Perfectly You',
}

export default function CategoryFilter({ products }: { products: Product[] }) {
  const searchParams = useSearchParams()
  const initialCategory = searchParams.get('category')
  const validCategory = categories.includes(initialCategory as Category)
    ? (initialCategory as Category)
    : 'All'

  const [activeCategory, setActiveCategory] = useState<Category>(validCategory)
  const [activeCollection, setActiveCollection] = useState('All Lips')

  const filtered = useMemo(() => {
    let result = products
    if (activeCategory !== 'All') {
      result = result.filter(p => p.category === activeCategory)
    }
    if (activeCategory === 'Lips' && activeCollection !== 'All Lips') {
      result = result.filter(p => p.collection === activeCollection)
    }
    return result
  }, [products, activeCategory, activeCollection])

  function handleCategoryChange(cat: Category) {
    setActiveCategory(cat)
    setActiveCollection('All Lips')
  }

  return (
    <div>
      {/* Category tabs */}
      <div className="flex flex-wrap gap-2 mb-4">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => handleCategoryChange(cat)}
            className={`min-h-[44px] px-4 rounded-full text-sm font-medium transition-colors ${
              activeCategory === cat
                ? 'bg-brand-rose text-white'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Lips sub-filters */}
      {activeCategory === 'Lips' && (
        <div className="flex flex-wrap gap-2 mb-4">
          {lipsCollections.map(col => (
            <button
              key={col}
              onClick={() => setActiveCollection(col)}
              className={`min-h-[44px] px-3 rounded-full text-xs font-medium transition-colors ${
                activeCollection === col
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-500'
              }`}
            >
              {col}
            </button>
          ))}
        </div>
      )}

      {/* Tagline */}
      {taglines[activeCategory] && (
        <p className="text-center text-gray-500 text-sm italic mb-6">
          {taglines[activeCategory]}
        </p>
      )}

      {/* Product grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <p className="text-gray-400 text-center py-12">
          No products in this category yet.
        </p>
      )}
    </div>
  )
}
