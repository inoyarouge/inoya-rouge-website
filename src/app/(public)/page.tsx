import { Suspense } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import CuratedCollectionCarousel from '@/components/public/CuratedCollectionCarousel'
import TrustBadges from '@/components/public/TrustBadges'
import CommunityStoryForm from '@/components/public/CommunityStoryForm'
import HomePageAnimator from '@/components/public/HomePageAnimator'
import type { Product, ProductVariant } from '@/lib/types'
import { normalizeDiscount } from '@/lib/pricing'

export const dynamic = 'force-dynamic'
export const revalidate = 3600

// --- Skeleton fallbacks ---

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="space-y-3">
          <div className="aspect-[211/264] bg-gray-200 animate-pulse" />
          <div className="h-5 bg-gray-200 animate-pulse w-3/4" />
          <div className="h-4 bg-gray-200 animate-pulse w-1/4" />
          <div className="h-9 bg-gray-200 animate-pulse" />
        </div>
      ))}
    </div>
  )
}

// --- Async data components ---

async function CuratedCollection() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('products')
    .select('*, product_variants(*), discounts(*)')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })
    .limit(8)

  const products: Product[] = (data ?? []).map((p) => ({
    ...p,
    variants: ((p.product_variants as ProductVariant[] | undefined) ?? [])
      .filter((v) => v.is_active)
      .sort((a, b) => a.sort_order - b.sort_order),
    discount: normalizeDiscount(p.discounts),
  }))

  if (products.length === 0) {
    return <p className="text-gray-500 font-sans">No products available yet.</p>
  }

  return <CuratedCollectionCarousel products={products} />
}

// --- Why Us bullet data ---

const whyBullets = [
  {
    icon: '/images/why/skin-friendly.svg',
    iconSize: { w: 36, h: 39 },
    heading: 'Skin-Friendly Formulas',
    body: 'Our cosmetics are designed to enhance Beauty while protecting the delicate skin of your lips.',
  },
  {
    icon: '/images/why/rich-pigmentation.svg',
    iconSize: { w: 46, h: 36 },
    heading: 'Rich Pigmentation',
    body: 'Highly pigmented colors that complement the diverse beauty of Indian skin tones.',
  },
  {
    icon: '/images/why/comfortable-wear.svg',
    iconSize: { w: 48, h: 44 },
    heading: 'Comfortable Wear',
    body: 'Lightweight, breathable textures that feel smooth and moisturizing throughout the day.',
  },
  {
    icon: '/images/why/cruelty-free.svg',
    iconSize: { w: 48, h: 40 },
    heading: 'Cruelty Free Beauty',
    body: 'We believe beauty should be compassionate. Our products are created without animal testing.',
  },
  {
    icon: '/images/why/indian-elegance.svg',
    iconSize: { w: 39, h: 48 },
    heading: 'Modern Indian Elegance',
    body: "A brand inspired by India's natural richness and crafted for the modern woman.",
  },
]

// --- Homepage ---

export default function HomePage() {
  return (
    <div>
      <HomePageAnimator />
      {/* 1. Hero Section */}
      <section className="relative w-full h-[100dvh] overflow-hidden bg-[#eaddd6]">
        <Image
          src="/images/hero/hero-bg.png"
          alt="Inoya Rouge hero"
          fill
          priority
          className="object-cover object-[center_center] md:object-[85%_80%] lg:object-[90%_80%]"
          sizes="100vw"
        />
        <div className="absolute inset-0 flex flex-col pt-[120px] md:pt-[160px] lg:pt-[200px] px-6 md:px-16 lg:px-[100px] xl:px-[140px] max-w-[1440px] mx-auto w-full">
          <h1 className="hero-text-anim font-display font-light text-[clamp(60px,9vw,110px)] text-burgundy leading-none tracking-tight">
            Inoya Rouge
          </h1>
          <div className="hero-text-anim mt-4 md:mt-6">
            <p className="font-sans text-[clamp(26px,4vw,48px)] text-[#211a17] leading-[1.1] tracking-tight">
              Inspired by nature,<br />
              defined by{' '}
              <span className="font-accent italic text-burgundy">colour</span>
            </p>
          </div>
          <div className="hero-text-anim mt-8 md:mt-12">
            <Link
              href="/shop"
              className="inline-flex items-center bg-burgundy text-white font-sans text-[13px] uppercase tracking-wider px-12 py-[14px] hover:bg-burgundy-dark transition-colors"
            >
              EXPLORE
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Trust Badges + Curated Collection */}
      <section className="bg-cream">
        <TrustBadges />

        {/* Curated Collection */}
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 pb-16">
          <div className="scroll-fade-up flex items-end justify-between mb-8 md:mb-12">
            <h2 className="font-display text-[clamp(28px,4vw,41px)] text-burgundy leading-none tracking-tight">
              Curated Collection
            </h2>
            <Link
              href="/shop"
              className="font-sans text-[13px] text-[#211a17] tracking-tight hover:text-burgundy transition-colors min-h-[44px] inline-flex items-center"
            >
              VIEW ALL
            </Link>
          </div>
          <Suspense fallback={<SkeletonGrid />}>
            <CuratedCollection />
          </Suspense>
        </div>
      </section>

      {/* 3. About Us */}
      <section className="relative overflow-hidden bg-[#FEF6F4] py-16 md:py-24">
        {/* Background floral watermark */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <Image
            src="/images/about/floral-illustration.png"
            alt=""
            fill
            className="object-cover md:object-contain object-right opacity-40 mix-blend-multiply"
            sizes="100vw"
            quality={100}
          />
        </div>

        <div className="relative z-10 max-w-[1440px] mx-auto px-6 md:px-12 xl:px-24 grid grid-cols-1 md:grid-cols-2 items-center gap-10 md:gap-16">
          {/* Left: Floating Composition Image */}
          <div className="scroll-image-subtle relative w-full aspect-square md:aspect-[4/5] lg:aspect-square flex justify-center items-center">
            <Image
              src="/images/about/about-image.png"
              alt="About Inoya Rouge"
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 50vw"
              quality={100}
            />
          </div>

          {/* Right: Text Content */}
          <div className="scroll-stagger-group flex flex-col justify-center max-w-[580px]">
            <h2 className="scroll-stagger-item font-display text-[clamp(32px,3.8vw,48px)] text-[#720B0B] leading-[1.25] tracking-wide">
              Inoya Rouge -The Power of <br /> Nature in Every Rouge
            </h2>
            <p className="scroll-stagger-item font-sans text-[clamp(16px,1.4vw,20px)] text-[#2C2C2C] leading-[1.5] mt-6 md:mt-8 tracking-wide">
              At Inoya Rouge, beauty is more than just color, it&apos;s
              confidence, creativity, and the art of self-expression.
              Rooted in India and designed for the modern
              woman, our cosmetics celebrate radiance that feels
              as good as it looks.
            </p>
            <div className="scroll-stagger-item mt-8 md:mt-10">
              <Link
                href="/our-story"
                className="inline-flex items-center justify-center bg-[#720B0B] text-white font-sans text-[12px] uppercase tracking-widest px-10 min-h-[46px] hover:opacity-90 transition-opacity"
              >
                ABOUT US
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Categories */}
      <section className="bg-cream py-16 md:py-20">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
          <h2 className="scroll-fade-up font-display text-[clamp(28px,4vw,47px)] text-burgundy text-center leading-none tracking-tight mb-10 md:mb-16">
            Explore Our Categories
          </h2>

          {/* Asymmetric grid */}
          <div className="scroll-stagger-group grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-4">
            {/* Lips - tall left card */}
            <Link
              href="/shop?category=Lips"
              className="scroll-stagger-item relative overflow-hidden row-span-1 md:row-span-2 aspect-[458/663] md:aspect-auto group"
            >
              <Image
                src="/images/categories/lips.png"
                alt="Lips collection"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, 458px"
              />
              <div className="absolute inset-0 bg-black/40" />
              <div className="absolute inset-0 bg-black/[0.02]" />
              <div className="absolute bottom-6 left-6 text-white">
                <h3 className="font-display text-[33px] tracking-tight leading-none">Lips</h3>
                <p className="font-sans text-[13px] tracking-tight mt-1">THE SIGNATURE COLLECTION</p>
              </div>
            </Link>

            {/* Eyes - top right */}
            <Link
              href="/shop?category=Eyes"
              className="scroll-stagger-item relative overflow-hidden aspect-[384/325] group"
            >
              <Image
                src="/images/categories/eyes.png"
                alt="Eyes collection"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, 384px"
              />
              <div className="absolute inset-0 bg-black/40" />
              <div className="absolute inset-0 bg-black/[0.02]" />
              <div className="absolute bottom-6 left-6 text-white">
                <h3 className="font-display text-[33px] tracking-tight leading-none">Eyes</h3>
                <p className="font-sans text-[13px] tracking-tight mt-1">CHROMATIC DEPTH</p>
              </div>
            </Link>

            {/* Face - bottom right */}
            <Link
              href="/shop?category=Face"
              className="scroll-stagger-item relative overflow-hidden aspect-[384/325] group"
            >
              <Image
                src="/images/categories/face.png"
                alt="Face collection"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, 384px"
              />
              <div className="absolute inset-0 bg-black/40" />
              <div className="absolute inset-0 bg-black/[0.02]" />
              <div className="absolute bottom-6 left-6 text-white">
                <h3 className="font-display text-[33px] tracking-tight leading-none">Face</h3>
                <p className="font-sans text-[13px] tracking-tight mt-1">THE CANVAS ESSENCE</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Why Inoya Rouge */}
      <section className="relative bg-warm-pink overflow-hidden py-12 lg:py-0 lg:h-[650px]">
        {/* Background illustration */}
        <div className="absolute inset-0 pointer-events-none opacity-60">
          <Image
            src="/images/why/bg-illustration.png"
            alt=""
            fill
            className="object-cover object-center scale-y-[-1]"
            sizes="100vw"
            quality={100}
          />
        </div>

        <div className="relative z-10 max-w-[1440px] mx-auto px-6 md:px-12 xl:px-[100px] h-full grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-8 lg:gap-0 items-center">
          {/* Left: Heading + Bullets */}
          <div className="scroll-stagger-group flex flex-col gap-6 md:gap-[32px] justify-center max-w-[650px]">
            {/* The heading is offset to align with the text of the bullets */}
            <div className="scroll-stagger-item flex gap-4 md:gap-[24px]">
              <div className="w-[44px] md:w-[50px] shrink-0" /> {/* Spacer for icon column */}
              <h2 className="font-display text-[clamp(36px,5vw,56px)] text-[#720B0B] leading-[1] m-0 font-normal">
                Why Inoya Rouge
              </h2>
            </div>
            
            <div className="flex flex-col gap-6 md:gap-[28px]">
              {whyBullets.map(bullet => (
                <div key={bullet.heading} className="scroll-stagger-item flex gap-4 md:gap-[24px] items-start group">
                  {/* Icon Column */}
                  <div className="relative shrink-0 flex justify-center mt-1 w-[44px] md:w-[50px]">
                    <div className="relative origin-top transition-transform duration-300 group-hover:scale-110" style={{ width: bullet.iconSize.w, height: bullet.iconSize.h }}>
                      <Image
                        src={bullet.icon}
                        alt=""
                        fill
                        className="object-contain"
                        sizes={`${Math.max(bullet.iconSize.w, bullet.iconSize.h)}px`}
                      />
                    </div>
                  </div>
                  {/* Text Column */}
                  <div className="flex flex-col gap-[8px]">
                    <h3 className="font-display text-[clamp(20px,2vw,24px)] text-[#720B0B] leading-[1.2] m-0 font-normal">
                      {bullet.heading}
                    </h3>
                    <p className="font-sans text-[clamp(14px,1.2vw,16px)] text-[#333333] leading-[1.5] m-0 max-w-[420px]">
                      {bullet.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Product image */}
          <div className="scroll-image-subtle relative w-full h-[320px] md:h-[450px] lg:h-full flex items-center justify-center lg:justify-end mt-8 lg:mt-0">
            <div className="relative w-full h-full lg:scale-110 xl:scale-[1.15] lg:translate-y-4 lg:-translate-x-8">
              <Image
                src="/images/why/product-image.png"
                alt="Inoya Rouge product"
                fill
                className="object-contain object-center lg:object-right"
                sizes="(max-width: 1024px) 100vw, 50vw"
                quality={100}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 6. Community Story */}
      <section className="bg-cream py-12 md:py-20 px-4">
        <div className="scroll-fade-up max-w-[700px] mx-auto bg-pink-accent overflow-hidden px-8 md:px-16 py-12 md:py-16">
          <div className="text-center">
            <h2 className="font-accent text-[clamp(40px,5.5vw,66px)] text-burgundy-dark tracking-tight leading-[0.9]">
              Your Shade,
            </h2>
            <h2 className="font-accent italic text-[clamp(48px,6.5vw,78px)] text-accent-pink tracking-tight leading-[0.9]">
              Your Story.
            </h2>
          </div>
          <div className="flex justify-center mt-8 md:mt-10">
            <CommunityStoryForm />
          </div>
        </div>
      </section>
    </div>
  )
}
