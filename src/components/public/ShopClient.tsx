'use client'

import { useState, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import ProductCard from '@/components/public/ProductCard'
import type { Product, Collection } from '@/lib/types'

const categories = ['All', 'Lips', 'Eyes', 'Face'] as const
type Category = (typeof categories)[number]

const categoryLabels: Record<Category, string> = {
  All: 'ALL PRODUCTS',
  Lips: 'LIPS',
  Eyes: 'EYES',
  Face: 'FACE',
}

const heroContent: Record<Category, { title: string, subtitle: string, ctaText: string, image: string, theme: 'light' | 'dark' }> = {
  All: {
    title: 'Shop',
    subtitle: 'Beauty should never come at the cost of your skin.',
    ctaText: 'VIEW ALL PRODUCTS',
    image: '/images/Shop page/Shop bg.jpeg',
    theme: 'dark'
  },
  Lips: {
    title: 'Lips',
    subtitle: 'Color that speaks.\nCare that stays.',
    ctaText: 'SHOP LIP PRODUCTS',
    image: '/images/Shop page/Shop lips.jpeg',
    theme: 'dark'
  },
  Eyes: {
    title: 'Eyes',
    subtitle: 'Define. Dazzle.\nDominate',
    ctaText: 'SHOP EYE PRODUCTS',
    image: '/images/Shop page/shop eyes.jpeg',
    theme: 'dark'
  },
  Face: {
    title: 'Face',
    subtitle: 'Naturally Luxe.\nPerfectly You',
    ctaText: 'SHOP FACE PRODUCTS',
    image: '/images/Shop page/shop face.jpeg',
    theme: 'dark'
  }
}

export default function ShopClient({
  products,
  collections,
}: {
  products: Product[]
  collections: Collection[]
}) {
  const searchParams = useSearchParams()
  const initialCategory = searchParams.get('category')
  const validCategory = categories.includes(initialCategory as Category)
    ? (initialCategory as Category)
    : 'All'

  const [activeCategory, setActiveCategory] = useState<Category>(validCategory)
  const [activeCollection, setActiveCollection] = useState<string | null>(null)
  
  // View mode & Sorting state
  const [viewMode, setViewMode] = useState<'grid-2' | 'grid-3'>('grid-3')
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured')
  const [showSortMenu, setShowSortMenu] = useState(false)

  // Filter Accordion State
  const [isCategoryOpen, setIsCategoryOpen] = useState(true)
  const [isCollectionOpen, setIsCollectionOpen] = useState(true)
  const [isPriceOpen, setIsPriceOpen] = useState(true)

  const subFilters = useMemo(() => {
    if (activeCategory === 'All') return []
    return collections.filter((c) => c.category === activeCategory)
  }, [collections, activeCategory])

  const filtered = useMemo(() => {
    let result = products
    if (activeCategory !== 'All') {
      result = result.filter(p => p.category === activeCategory)
    }
    if (activeCollection !== null) {
      result = result.filter(p => p.collection === activeCollection)
    }
    
    // Sort logic
    result = [...result]
    if (sortBy === 'price-asc') {
      result.sort((a, b) => {
        const priceA = a.variants?.[0]?.price_override ?? a.base_price ?? 0
        const priceB = b.variants?.[0]?.price_override ?? b.base_price ?? 0
        return priceA - priceB
      })
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => {
        const priceA = a.variants?.[0]?.price_override ?? a.base_price ?? 0
        const priceB = b.variants?.[0]?.price_override ?? b.base_price ?? 0
        return priceB - priceA
      })
    }

    return result
  }, [products, activeCategory, activeCollection, sortBy])

  function handleCategoryChange(cat: Category) {
    setActiveCategory(cat)
    setActiveCollection(null)
  }

  const currentHero = heroContent[activeCategory] || heroContent.All

  return (
    <>
      {/* ── Hero Banner ── */}
      <section className="relative w-full h-[400px] md:h-[442px] overflow-hidden bg-[#FFF3EE]">
        {/* Background image */}
        <Image
          src={currentHero.image}
          alt={currentHero.title}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        {/* Dark overlay — only for dark theme images */}
        {currentHero.theme === 'dark' && (
          <div className="absolute inset-0 bg-black/[0.35]" />
        )}
        
        {/* Hero content — centered */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className={`font-display text-[clamp(60px,8vw,90px)] leading-none tracking-tight ${currentHero.theme === 'dark' ? 'text-cream font-thin' : 'text-burgundy font-normal'}`}
          >
            {currentHero.title}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className={`font-sans tracking-tight text-[clamp(20px,3.2vw,30px)] leading-[1.2] mt-4 md:mt-3 max-w-[500px] whitespace-pre-line ${currentHero.theme === 'dark' ? 'text-white' : 'text-[#2a2a2a]'}`}
          >
            {currentHero.subtitle}
          </motion.p>
          <motion.button
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            onClick={() => {
              document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })
            }}
            className="inline-flex items-center justify-center bg-burgundy text-white font-sans text-[12px] uppercase tracking-[1px] px-8 min-h-[36px] mt-8 md:mt-8 hover:bg-burgundy-dark transition-colors"
          >
            {currentHero.ctaText}
          </motion.button>
        </div>
      </section>

      {/* ── Products Section ── */}
      <section id="products" className="bg-[#FFF3EE] pt-12 pb-24">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-16">
          {/* Toolbar */}
          <div className="flex items-center justify-between border-y border-burgundy/10 py-4 mb-12 text-[13px] font-sans text-burgundy/60 uppercase tracking-widest">
            {/* View options */}
            <div className="flex items-center gap-4">
               {/* 4 square grid icon (grid-2) */}
               <button onClick={() => setViewMode('grid-2')} className={`transition-colors hover:text-burgundy focus:outline-none ${viewMode === 'grid-2' ? 'text-burgundy' : 'text-burgundy/40'}`}>
                 <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="4" y="4" width="6" height="6"/>
                    <rect x="14" y="4" width="6" height="6"/>
                    <rect x="14" y="14" width="6" height="6"/>
                    <rect x="4" y="14" width="6" height="6"/>
                 </svg>
               </button>
               {/* 9 square grid icon (grid-3) */}
               <button onClick={() => setViewMode('grid-3')} className={`transition-colors hover:text-burgundy focus:outline-none hidden md:block ${viewMode === 'grid-3' ? 'text-burgundy' : 'text-burgundy/40'}`}>
                 <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="3" y="3" width="4" height="4"/>
                    <rect x="10" y="3" width="4" height="4"/>
                    <rect x="17" y="3" width="4" height="4"/>
                    <rect x="3" y="10" width="4" height="4"/>
                    <rect x="10" y="10" width="4" height="4"/>
                    <rect x="17" y="10" width="4" height="4"/>
                    <rect x="3" y="17" width="4" height="4"/>
                    <rect x="10" y="17" width="4" height="4"/>
                    <rect x="17" y="17" width="4" height="4"/>
                 </svg>
               </button>
            </div>

            {/* Product Count */}
            <div>{filtered.length} PRODUCTS</div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            {/* Sidebar Filters */}
            <aside className="w-full lg:w-[240px] flex-shrink-0">
               {/* Categories filter */}
               <div className="mb-8">
                 <div 
                   className="flex items-center justify-between border-b border-burgundy/10 pb-3 mb-4 cursor-pointer"
                   onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                 >
                   <h3 className="text-[13px] font-sans tracking-widest text-burgundy font-medium">CATEGORY</h3>
                   <svg className={`text-burgundy/50 transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M6 9l6 6 6-6"/></svg>
                 </div>
                 {isCategoryOpen && (
                   <div className="flex flex-col gap-3.5 overflow-hidden transition-all">
                     {categories.map(cat => (
                       <button
                         key={cat}
                         onClick={() => handleCategoryChange(cat)}
                         className={`text-left text-[13px] font-sans tracking-wide transition-colors ${activeCategory === cat ? 'text-burgundy font-medium' : 'text-burgundy/50 hover:text-burgundy'}`}
                       >
                         {categoryLabels[cat]}
                       </button>
                     ))}
                   </div>
                 )}
               </div>

               {/* Collections filter */}
               {subFilters.length > 0 && (
                 <div className="mb-8">
                   <div 
                     className="flex items-center justify-between border-b border-burgundy/10 pb-3 mb-4 cursor-pointer"
                     onClick={() => setIsCollectionOpen(!isCollectionOpen)}
                   >
                     <h3 className="text-[13px] font-sans tracking-widest text-burgundy font-medium">COLLECTION</h3>
                     <svg className={`text-burgundy/50 transition-transform ${isCollectionOpen ? 'rotate-180' : ''}`} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M6 9l6 6 6-6"/></svg>
                   </div>
                   {isCollectionOpen && (
                     <div className="flex flex-col gap-3.5 overflow-hidden transition-all">
                       <button
                         onClick={() => setActiveCollection(null)}
                         className={`text-left text-[13px] font-sans tracking-wide transition-colors ${activeCollection === null ? 'text-burgundy font-medium' : 'text-burgundy/50 hover:text-burgundy'}`}
                       >
                         ALL {activeCategory.toUpperCase()}
                       </button>
                       {subFilters.map(col => (
                         <button
                           key={col.id}
                           onClick={() => setActiveCollection(col.name)}
                           className={`text-left text-[13px] font-sans tracking-wide transition-colors ${activeCollection === col.name ? 'text-burgundy font-medium' : 'text-burgundy/50 hover:text-burgundy'}`}
                         >
                           {col.name.toUpperCase()}
                         </button>
                       ))}
                     </div>
                   )}
                 </div>
               )}

               {/* Filter Section Removed - Waiting for new selection */}
            </aside>

            {/* Product Grid */}
            <div className="flex-1">
              {filtered.length > 0 ? (
                <motion.div 
                  layout
                  className={`grid gap-x-6 gap-y-12 ${
                    viewMode === 'grid-2' ? 'grid-cols-1 sm:grid-cols-2' :
                    'grid-cols-1 sm:grid-cols-2 md:grid-cols-3'
                  }`}
                >
                  <AnimatePresence mode="popLayout">
                    {filtered.map(p => (
                      <motion.div
                        layout
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        key={p.id}
                      >
                        <ProductCard product={p} variant="shop" />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              ) : (
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-gray-400 text-center py-12 font-sans"
                >
                  No products in this category yet.
                </motion.p>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
