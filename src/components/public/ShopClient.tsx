'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import ProductCard from '@/components/public/ProductCard'
import PromotionBannerClient from '@/components/public/PromotionBannerClient'
import type { Product, Collection, Promotion } from '@/lib/types'

const categories = ['All', 'Lips', 'Eyes', 'Face'] as const
type Category = (typeof categories)[number]

const categoryLabels: Record<Category, string> = {
  All: 'ALL PRODUCTS',
  Lips: 'LIPS',
  Eyes: 'EYES',
  Face: 'FACE',
}

const heroContent: Record<Category, { title: string, subtitle: string, ctaText: string, image: string, mobileImage?: string, mobileImageClass?: string, theme: 'light' | 'dark' }> = {
  All: {
    title: 'Shop',
    subtitle: 'Beauty should never come\nat the cost of your skin.',
    ctaText: 'VIEW ALL PRODUCTS',
    image: '/images/Shop page/Shop bg.jpeg',
    mobileImage: '/images/mobile images/shop bg.jpeg',
    theme: 'light'
  },
  Lips: {
    title: 'Lips',
    subtitle: 'Color that speaks.\nCare that stays.',
    ctaText: 'SHOP LIP PRODUCTS',
    image: '/images/Shop page/Shop lips.jpeg',
    mobileImage: '/images/mobile images/lips bg mobile.jpeg',
    theme: 'light'
  },
  Eyes: {
    title: 'Eyes',
    subtitle: 'Define. Dazzle.\nDominate',
    ctaText: 'SHOP EYE PRODUCTS',
    image: '/images/Shop page/shop eyes.jpeg',
    mobileImage: '/images/mobile images/eyes bg mobile.jpeg',
    mobileImageClass: 'object-[80%_center]',
    theme: 'light'
  },
  Face: {
    title: 'Face',
    subtitle: 'Naturally Luxe.\nPerfectly You',
    ctaText: 'SHOP FACE PRODUCTS',
    image: '/images/Shop page/shop face.jpeg',
    mobileImage: '/images/mobile images/face bg mobile.jpeg',
    mobileImageClass: 'object-[90%_center] saturate-[.8]',
    theme: 'light'
  }
}

export default function ShopClient({
  products,
  collections,
  promotions = [],
  initialCategory = 'All',
}: {
  products: Product[]
  collections: Collection[]
  promotions?: Promotion[]
  initialCategory?: Category
}) {
  const [activeCategory, setActiveCategory] = useState<Category>(initialCategory)
  const [activeCollection, setActiveCollection] = useState<string | null>(null)

  // Mobile dropdown state
  const [isMobileCategoryMenuOpen, setIsMobileCategoryMenuOpen] = useState(false)

  // View mode & Sorting state
  const [viewMode, setViewMode] = useState<'grid-1' | 'grid-2' | 'grid-3' | 'default'>('default')
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
      <PromotionBannerClient
        promotions={promotions}
        category={activeCategory === 'All' ? null : activeCategory}
      />
      {/* ── Hero Banner ── */}
      <section className="relative w-full h-[400px] md:h-[442px] overflow-hidden bg-warm-tan">
        {/* Background image with fade transition */}
        <AnimatePresence>
          <motion.div
            key={currentHero.image}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            {currentHero.mobileImage ? (
              <>
                <Image
                  src={currentHero.image}
                  alt={currentHero.title}
                  fill
                  priority
                  className="hidden md:block object-cover"
                  sizes="100vw"
                />
                <Image
                  src={currentHero.mobileImage}
                  alt={currentHero.title}
                  fill
                  priority
                  className={`block md:hidden object-cover ${currentHero.mobileImageClass || ''}`}
                  sizes="100vw"
                />
              </>
            ) : (
              <Image
                src={currentHero.image}
                alt={currentHero.title}
                fill
                priority
                className="object-cover"
                sizes="100vw"
              />
            )}
            {/* Dark overlay — always on for dark theme, and on mobile for light theme to ensure white text is legible */}
            <div className={`absolute inset-0 bg-black/20 ${currentHero.theme === 'light' ? 'max-md:block hidden' : ''}`} />
          </motion.div>
        </AnimatePresence>

        {/* Hero content — centered */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentHero.title}
            className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-10"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
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
              className={`font-sans tracking-tight text-[clamp(20px,3.2vw,30px)] leading-[1.2] mt-4 md:mt-3 max-w-[500px] whitespace-pre-line md:whitespace-normal ${currentHero.theme === 'dark' ? 'text-white' : 'max-md:text-white text-charcoal'}`}
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
              className="group/btn relative overflow-hidden inline-flex items-center justify-center bg-burgundy text-white font-sans text-[12px] uppercase tracking-[1px] px-8 min-h-[36px] mt-8 md:mt-8 pointer-events-auto"
            >
              <span className="absolute top-0 -left-[100%] w-[60%] h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-25deg] transition-all duration-[800ms] ease-in-out group-hover/btn:left-[200%]" />
              <span className="relative z-10">
                {currentHero.ctaText}
              </span>
            </motion.button>
          </motion.div>
        </AnimatePresence>
      </section>

      {/* ── Products Section ── */}
      <section id="products" className="bg-[#FFF3EE] pt-4 pb-6">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-16">
          {/* Mobile Toolbar (3-section layout) */}
          <div className="md:hidden flex items-center border-y border-burgundy/20 h-14 mb-6 text-[12px] font-sans tracking-widest text-burgundy/80 uppercase divide-x divide-burgundy/20">
            {/* Custom Category Dropdown */}
            <div className="relative flex-1 h-full">
              <button
                className="w-full h-full flex items-center justify-center gap-1.5 hover:bg-burgundy/5 transition-colors focus:outline-none"
                onClick={() => setIsMobileCategoryMenuOpen(!isMobileCategoryMenuOpen)}
              >
                <span>{activeCategory === 'All' ? 'CATEGORY' : categoryLabels[activeCategory]}</span>
                <motion.svg
                  width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                  animate={{ rotate: isMobileCategoryMenuOpen ? 180 : 0 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </motion.svg>
              </button>

              <AnimatePresence>
                {isMobileCategoryMenuOpen && (
                  <>
                    {/* Transparent overlay for clicking outside to close */}
                    <div
                      className="fixed inset-0 z-40 bg-transparent"
                      onClick={() => setIsMobileCategoryMenuOpen(false)}
                    />

                    {/* Dropdown Menu */}
                    <motion.div
                      initial={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
                      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                      exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute top-full left-0 w-[180px] mt-1 bg-white/80 backdrop-blur-xl border border-burgundy/10 shadow-[0_10px_40px_rgb(0,0,0,0.08)] rounded-xl overflow-hidden z-50 py-2 flex flex-col"
                    >
                      {categories.map((cat, index) => (
                        <motion.button
                          key={cat}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          transition={{ duration: 0.3, delay: index * 0.05, ease: "easeOut" }}
                          onClick={() => {
                            handleCategoryChange(cat)
                            setIsMobileCategoryMenuOpen(false)
                          }}
                          className={`w-full text-left px-5 py-3 text-[11px] font-sans tracking-[2px] transition-colors ${activeCategory === cat
                            ? 'text-burgundy bg-burgundy/5'
                            : 'text-burgundy/60 hover:text-burgundy hover:bg-burgundy/5'
                            }`}
                        >
                          {categoryLabels[cat]}
                        </motion.button>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Product Count */}
            <div className="flex-1 flex items-center justify-center h-full">
              {filtered.length} PRODUCTS
            </div>

            {/* View options */}
            <div className="flex-1 flex items-center justify-center h-full gap-4">
              {/* Single Square (grid-1) - Zoomed In */}
              <button
                onClick={() => setViewMode('grid-1')}
                className={`transition-colors hover:text-burgundy focus:outline-none ${viewMode === 'grid-1' ? 'text-burgundy' : 'text-burgundy/40'}`}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="4" y="4" width="16" height="16" />
                </svg>
              </button>

              {/* 4 square grid icon (grid-2) - Zoomed Out */}
              <button
                onClick={() => setViewMode('grid-2')}
                className={`transition-colors hover:text-burgundy focus:outline-none ${viewMode === 'grid-2' || viewMode === 'grid-3' || viewMode === 'default' ? 'text-burgundy' : 'text-burgundy/40'}`}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="4" y="4" width="7" height="7" />
                  <rect x="13" y="4" width="7" height="7" />
                  <rect x="13" y="13" width="7" height="7" />
                  <rect x="4" y="13" width="7" height="7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Collections Pills */}
          {subFilters.length > 0 && (
            <div className="md:hidden flex items-center overflow-x-auto gap-2.5 pb-2 mb-6 -mt-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] scroll-smooth">
              <button
                onClick={() => setActiveCollection(null)}
                className={`flex-shrink-0 px-4 py-[7px] rounded-sm text-[10px] tracking-[1.5px] uppercase transition-all whitespace-nowrap border ${activeCollection === null ? 'bg-[#720B0B] text-white border-[#720B0B]' : 'bg-transparent text-[#720B0B]/70 border-[#720B0B]/20 hover:border-[#720B0B]'}`}
              >
                ALL {activeCategory}
              </button>
              {subFilters.map(col => (
                <button
                  key={col.id}
                  onClick={() => setActiveCollection(col.name)}
                  className={`flex-shrink-0 px-4 py-[7px] rounded-sm text-[10px] tracking-[1.5px] uppercase transition-all whitespace-nowrap border ${activeCollection === col.name ? 'bg-[#720B0B] text-white border-[#720B0B]' : 'bg-transparent text-[#720B0B]/70 border-[#720B0B]/20 hover:border-[#720B0B]'}`}
                >
                  {col.name}
                </button>
              ))}
            </div>
          )}

          {/* Desktop Toolbar (Original layout) */}
          <div className="hidden md:flex items-center justify-between border-y border-burgundy/10 py-4 mb-6 text-[13px] font-sans text-burgundy/60 uppercase tracking-widest">
            {/* View options */}
            <div className="flex items-center gap-4">
              {/* 4 square grid icon (grid-2) */}
              <button onClick={() => setViewMode('grid-2')} className={`transition-colors hover:text-burgundy focus:outline-none ${viewMode === 'grid-2' ? 'text-burgundy' : 'text-burgundy/40'}`}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="4" y="4" width="6" height="6" />
                  <rect x="14" y="4" width="6" height="6" />
                  <rect x="14" y="14" width="6" height="6" />
                  <rect x="4" y="14" width="6" height="6" />
                </svg>
              </button>
              {/* 9 square grid icon (grid-3) */}
              <button onClick={() => setViewMode('grid-3')} className={`transition-colors hover:text-burgundy focus:outline-none ${viewMode === 'grid-3' || viewMode === 'default' ? 'text-burgundy' : 'text-burgundy/40'}`}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="3" width="4" height="4" />
                  <rect x="10" y="3" width="4" height="4" />
                  <rect x="17" y="3" width="4" height="4" />
                  <rect x="3" y="10" width="4" height="4" />
                  <rect x="10" y="10" width="4" height="4" />
                  <rect x="17" y="10" width="4" height="4" />
                  <rect x="3" y="17" width="4" height="4" />
                  <rect x="10" y="17" width="4" height="4" />
                  <rect x="17" y="17" width="4" height="4" />
                </svg>
              </button>
            </div>

            {/* Product Count */}
            <div>{filtered.length} PRODUCTS</div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            {/* Sidebar Filters */}
            <aside id="filters-sidebar" className="hidden lg:block w-[240px] flex-shrink-0">
              {/* Categories filter */}
              <div className="mb-8">
                <div
                  className="flex items-center justify-between border-b border-burgundy/10 pb-3 mb-4 cursor-pointer"
                  onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                >
                  <h3 className="text-[13px] font-sans tracking-widest text-burgundy font-medium">CATEGORY</h3>
                  <svg className={`text-burgundy/50 transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M6 9l6 6 6-6" /></svg>
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
                    <svg className={`text-burgundy/50 transition-transform ${isCollectionOpen ? 'rotate-180' : ''}`} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M6 9l6 6 6-6" /></svg>
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
                  className={`grid ${viewMode === 'grid-1' ? 'grid-cols-1 gap-y-12' :
                    viewMode === 'grid-2' ? 'grid-cols-2 gap-x-4 gap-y-10 md:gap-x-6 md:gap-y-12' :
                      viewMode === 'grid-3' ? 'grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-10 md:gap-x-6 md:gap-y-12' :
                        'grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-10 md:gap-x-6 md:gap-y-12'
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
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8 }}
                  className="relative w-full flex items-center justify-center overflow-hidden"
                >
                  <motion.div
                    initial={{ scale: 1.05 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 2, ease: "easeOut" }}
                    className="w-full h-full"
                  >
                    <Image
                      src="/images/More to come/More to come.jpeg"
                      alt="More products coming soon"
                      width={1200}
                      height={700}
                      className="hidden md:block w-full h-auto object-cover"
                      sizes="(max-width: 768px) 100vw, 75vw"
                    />
                    {/* Mobile: overflow-hidden wrapper lets translateX shift the image right */}
                    <div className="block md:hidden w-full overflow-hidden">
                      <Image
                        src="/images/mobile images/more to come mobile.jpeg"
                        alt="More products coming soon"
                        width={1200}
                        height={700}
                        className="w-full h-auto"
                        style={{ transform: 'scale(1) translateX(15%)' }}
                        sizes="100vw"
                      />
                    </div>
                  </motion.div>
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{ background: 'radial-gradient(ellipse at center, transparent 30%, #FFF3EE 80%)' }}
                  />

                  {/* Text Overlay */}
                  <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-20 lg:px-24 -translate-y-8 md:translate-y-0">
                    <motion.div
                      className="max-w-md mt-4"
                      initial="hidden"
                      animate="visible"
                      variants={{
                        hidden: {},
                        visible: {
                          transition: {
                            staggerChildren: 0.15,
                            delayChildren: 0.3
                          }
                        }
                      }}
                    >
                      <motion.h2
                        variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="text-burgundy font-display text-[clamp(40px,10vw,54px)] leading-[1.1] tracking-tight mb-4 whitespace-nowrap"
                      >
                        More To Come
                      </motion.h2>
                      <motion.p
                        variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="font-sans text-[#2a2a2a] text-[14px] md:text-[15px] leading-[1.4] tracking-wide mb-1"
                      >
                        We&apos;re creating<br className="md:hidden" />
                        <span className="hidden md:inline"> </span>something beautiful.
                      </motion.p>
                      <motion.p
                        variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="font-sans text-[#2a2a2a] text-[14px] md:text-[15px] leading-[1.4] tracking-wide mb-8"
                      >
                        New essentials are<br className="md:hidden" />
                        <span className="hidden md:inline"> </span>on the way.
                      </motion.p>

                      <motion.div
                        variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="flex justify-start"
                      >
                        <button
                          onClick={() => handleCategoryChange('All')}
                          className="group/btn relative overflow-hidden inline-flex items-center bg-burgundy text-white font-sans text-[12px] uppercase tracking-wider px-10 py-[12px]"
                        >
                          <span className="absolute top-0 -left-[100%] w-[60%] h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-25deg] transition-all duration-[800ms] ease-in-out group-hover/btn:left-[200%]" />
                          <span className="relative z-10">
                            <span className="md:hidden">SHOP</span>
                            <span className="hidden md:inline">BACK TO SHOP</span>
                          </span>
                        </button>
                      </motion.div>
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
