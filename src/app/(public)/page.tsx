import { Suspense } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import CuratedCollectionCarousel from '@/components/public/CuratedCollectionCarousel'
import TrustTicker from '@/components/public/TrustTicker'
import CommunityStoryForm from '@/components/public/CommunityStoryForm'
import HomePageAnimator from '@/components/public/HomePageAnimator'
import PromotionBannerResolver from '@/components/public/PromotionBannerResolver'
import TestimonialList from '@/components/public/TestimonialList'
import type { Product, ProductVariant, Discount, VariantImage } from '@/lib/types'
import { normalizeDiscount } from '@/lib/pricing'

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
    .select('*, product_variants(*, discounts(*), variant_images(*)), discounts(*)')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })
    .limit(8)

  const products: Product[] = (data ?? []).map((p) => ({
    ...p,
    variants: ((p.product_variants as (ProductVariant & {
      discounts?: unknown
      variant_images?: VariantImage[]
    })[] | undefined) ?? [])
      .filter((v) => v.is_active)
      .sort((a, b) => a.sort_order - b.sort_order)
      .map(({ discounts, variant_images, ...rest }) => ({
        ...rest,
        discount: normalizeDiscount(discounts as Discount | Discount[] | null | undefined),
        images: (variant_images ?? []).slice().sort((a, b) => a.sort_order - b.sort_order),
      })),
    discount: normalizeDiscount(p.discounts),
  }))

  if (products.length === 0) {
    return null
  }

  return (
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
      <CuratedCollectionCarousel products={products} />
    </div>
  )
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
      <PromotionBannerResolver />
      <HomePageAnimator />
      {/* 1. Hero Section */}
      <section className="relative w-full h-[100dvh] overflow-hidden bg-[#eaddd6]">
        {/* Desktop Image */}
        <Image
          src="/images/hero/hero-bg.jpeg"
          alt="Inoya Rouge hero"
          fill
          priority
          className="hero-image-zoom-anim hidden md:block object-cover object-[85%_80%] lg:object-[90%_80%] saturate-[.85]"
          sizes="100vw"
        />
        {/* Mobile Image */}
        <Image
          src="/images/mobile images/mobile hero.jpeg"
          alt="Inoya Rouge hero mobile"
          fill
          priority
          className="hero-image-zoom-anim md:hidden object-cover object-center saturate-[.95]"
          sizes="100vw"
        />
        <div className="absolute inset-0 flex flex-col items-center md:items-start text-center md:text-left pt-[100px] md:pt-[160px] lg:pt-[200px] pb-8 md:pb-0 px-6 md:px-16 lg:px-[100px] xl:px-[140px] max-w-[1440px] mx-auto w-full justify-between md:justify-start">
          <div className="flex flex-col items-center md:items-start w-full md:w-auto">
            <h1 className="hero-text-anim flex flex-col md:block font-display font-light text-[clamp(64px,17vw,110px)] md:text-[clamp(60px,9vw,110px)] text-burgundy uppercase md:normal-case leading-[0.9] md:leading-none tracking-tight">
              <span>Inoya</span>
              <span className="md:hidden">Rouge</span>
              <span className="hidden md:inline"> Rouge</span>
            </h1>

            <div className="hero-text-anim flex md:hidden items-center justify-center gap-3 mt-5 w-full max-w-[120px]">
              <div className="h-[1px] flex-1 bg-[#A28263]/50"></div>
              <svg width="18" height="13" viewBox="0 0 24 18" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#A28263]">
                <path d="M12 18C12 18 10 14 7 12C3.5 9.5 0 10 0 10C0 10 4 7 9 9C10.5 9.6 12 11 12 11C12 11 13.5 9.6 15 9C20 7 24 10 24 10C24 10 20.5 9.5 17 12C14 14 12 18 12 18Z" fill="currentColor" />
                <path d="M12 15C12 15 10 9 10 5C10 1.5 12 0 12 0C12 0 14 1.5 14 5C14 9 12 15 12 15Z" fill="currentColor" />
                <path d="M12 17C12 17 8 13 6 8C4 4 4 1 4 1C4 1 8 4 10 7C11.5 9.2 12 12 12 12C12 12 12.5 9.2 14 7C16 4 20 1 20 1C20 1 20 4 18 8C16 13 12 17 12 17Z" fill="currentColor" />
              </svg>
              <div className="h-[1px] flex-1 bg-[#A28263]/50"></div>
            </div>

            <div className="flex flex-col items-center md:items-start w-max md:w-auto mx-auto md:mx-0">
              <div className="hero-text-anim mt-5 md:mt-6 w-full">
                <p className="font-display font-medium text-[clamp(28px,7.5vw,48px)] md:text-[clamp(26px,4vw,48px)] text-[#211a17] text-center md:text-left leading-[1.2] md:leading-[1.1] tracking-tight">
                  Inspired by nature,<br />
                  defined by{' '}
                  <span className="font-accent italic font-normal text-burgundy">colour.</span>
                </p>
              </div>

              <div className="hero-text-anim hidden md:flex mt-8 justify-start w-full">
                <Link
                  href="/shop"
                  className="group/btn relative overflow-hidden w-auto inline-flex items-center justify-center bg-burgundy rounded-none text-white font-sans text-[14px] font-medium uppercase px-14 py-[16px]"
                >
                  {/* Glossy Shine */}
                  <span className="absolute top-0 -left-[100%] w-[60%] h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-25deg] transition-all duration-[800ms] ease-in-out group-hover/btn:left-[200%]" />
                  
                  {/* Text */}
                  <span className="relative z-10 tracking-[0.15em]">
                    EXPLORE
                  </span>
                </Link>
              </div>
            </div>
          </div>

          {/* Mobile: EXPLORE pinned to bottom of hero */}
          <div className="hero-text-anim flex md:hidden justify-center w-full mt-4">
            <Link
              href="/shop"
              className="group/btn relative overflow-hidden w-[75%] inline-flex items-center justify-center bg-burgundy rounded-none text-white font-sans text-[15px] font-medium uppercase px-8 py-[16px] shadow-[0_8px_30px_rgba(114,11,11,0.6)] transition-all duration-500 active:scale-[0.98]"
            >
              {/* Glossy Shine */}
              <span className="absolute top-0 -left-[100%] w-[60%] h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-25deg] transition-all duration-[800ms] ease-in-out group-hover/btn:left-[200%]" />
              
              {/* Text */}
              <span className="relative z-10 tracking-[0.15em]">
                EXPLORE
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Trust Ticker + Curated Collection */}
      <section className="bg-cream">
        <TrustTicker />

        <Suspense fallback={
          <div className="max-w-[1440px] mx-auto px-6 md:px-12 pb-16">
            <SkeletonGrid />
          </div>
        }>
          <CuratedCollection />
        </Suspense>
      </section>

      {/* 3. About Us */}
      <section className="relative overflow-hidden bg-[#FEF6F4]">
        {/* Background floral watermark — desktop only, very subtle */}
        <div className="absolute inset-0 pointer-events-none z-0 hidden md:block">
          <Image
            src="/images/about/floral-illustration.jpeg"
            alt=""
            fill
            className="object-contain object-right"
            sizes="100vw"
            quality={80}
          />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row items-stretch min-h-[520px] md:min-h-[600px]">
          {/* Left: Image flush to left edge */}
          <div
            className="scroll-image-subtle relative w-full md:w-[50%] lg:w-[45%] h-[360px] md:h-auto overflow-hidden flex-shrink-0 rounded-2xl md:rounded-[2rem]"
            style={{
              maskImage: 'linear-gradient(to bottom, transparent 0%, black 1%, black 99%, transparent 100%), linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 1%, black 99%, transparent 100%), linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)',
              maskComposite: 'intersect',
              WebkitMaskComposite: 'source-in'
            }}
          >
            <Image
              src="/images/about/about-image.jpeg"
              alt="About Inoya Rouge"
              fill
              className="object-cover object-center"
              sizes="(max-width: 768px) 100vw, 50vw"
              quality={100}
            />
          </div>

          {/* Right: Text Content */}
          <div className="relative scroll-stagger-group flex flex-col justify-center items-center text-center md:items-start md:text-left px-8 md:px-12 xl:px-20 py-14 md:py-20 overflow-hidden">
            {/* Mobile Background Image - constrained to text region */}
            <div className="absolute inset-0 pointer-events-none z-0 md:hidden">
              <Image
                src="/images/mobile images/about us bg mobile.jpeg"
                alt=""
                fill
                className="object-cover object-right opacity-60 mix-blend-multiply transition-opacity duration-700"
                sizes="100vw"
                quality={100}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#FEF6F4]/20 to-[#FEF6F4]/60" />
            </div>

            <h2 className="relative z-10 scroll-stagger-item font-display text-[clamp(28px,7.5vw,48px)] md:text-[clamp(32px,3.8vw,48px)] text-[#720B0B] leading-[1.2] md:leading-[1.25] tracking-wide text-center md:text-left">
              <span className="hidden md:inline">
                Inoya Rouge — The Power of <br /> Nature in Every Rouge
              </span>
              <span className="md:hidden">
                The Power of Nature <br /> in Every Rouge
              </span>
            </h2>
            <p className="relative z-10 scroll-stagger-item font-sans text-[clamp(16px,1.4vw,20px)] text-[#2C2C2C] leading-[1.5] mt-6 md:mt-8 tracking-wide max-w-[520px] mx-auto md:mx-0 text-justify md:text-left">
              At Inoya Rouge, beauty is more than just color, it&apos;s
              confidence, creativity, and the art of self-expression.
              Rooted in India and designed for the modern
              woman, our cosmetics celebrate radiance that feels
              as good as it looks.
            </p>
            <div className="relative z-10 scroll-stagger-item mt-8 md:mt-10 flex justify-center md:justify-start w-full md:w-auto">
              <Link
                href="/about-us"
                className="group/btn relative inline-flex items-center justify-center bg-[#720B0B] overflow-hidden text-white font-sans text-[12px] uppercase tracking-widest px-10 min-h-[46px]"
              >
                <span className="absolute top-0 -left-[100%] w-[60%] h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-25deg] transition-all duration-[800ms] ease-in-out group-hover/btn:left-[200%]" />
                <span className="relative z-10">
                  ABOUT US
                </span>
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

          {/* Flush Bento Grid */}
          <div className="scroll-stagger-group grid grid-cols-1 md:grid-cols-[1.3fr_1fr] gap-4 md:gap-6 h-auto md:h-[600px] lg:h-[700px]">
            {/* Lips - Left Feature */}
            <Link
              href="/shop?category=Lips"
              className="scroll-stagger-item relative overflow-hidden rounded-[2rem] group h-[400px] md:h-full w-full"
            >
              <Image
                src="/images/categories/lips.jpeg"
                alt="Lips collection"
                fill
                className="hidden md:block object-cover transition-transform duration-[1000ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-[1.03]"
                sizes="(max-width: 768px) 100vw, 60vw"
              />
              <Image
                src="/images/mobile images/lips mobile.jpeg"
                alt="Lips collection mobile"
                fill
                className="md:hidden object-cover transition-transform duration-[1000ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-[1.03]"
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-[800ms]" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-80" />
              
              <div className="absolute bottom-8 left-8 right-8 text-white transform transition-transform duration-[800ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:-translate-y-2">
                <h3 className="font-display text-[clamp(36px,5vw,56px)] tracking-tight leading-none drop-shadow-lg">Lips</h3>
                <p className="font-sans text-[13px] tracking-[0.2em] uppercase mt-3 opacity-90">Signature Collection</p>
              </div>
            </Link>

            {/* Right Stack */}
            <div className="flex flex-col gap-4 md:gap-6 h-[600px] md:h-full w-full">
              {/* Eyes - Top Right */}
              <Link
                href="/shop?category=Eyes"
                className="scroll-stagger-item relative flex-1 overflow-hidden rounded-[2rem] group w-full"
              >
                <Image
                  src="/images/categories/eyes.png"
                  alt="Eyes collection"
                  fill
                  className="hidden md:block object-cover object-[30%] md:object-center transition-transform duration-[1000ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-[1.03]"
                  sizes="(max-width: 768px) 100vw, 40vw"
                />
                <Image
                  src="/images/mobile images/eye mobile.jpeg"
                  alt="Eyes collection mobile"
                  fill
                  className="md:hidden object-cover transition-transform duration-[1000ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-[1.03]"
                  sizes="100vw"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-[800ms]" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-80" />
                
                <div className="absolute bottom-8 left-8 right-8 text-white transform transition-transform duration-[800ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:-translate-y-2">
                  <h3 className="font-display text-[clamp(32px,3vw,42px)] tracking-tight leading-none drop-shadow-lg">Eyes</h3>
                  <p className="font-sans text-[12px] tracking-[0.2em] uppercase mt-2 opacity-90">Chromatic Depth</p>
                </div>
              </Link>

              {/* Face - Bottom Right */}
              <Link
                href="/shop?category=Face"
                className="scroll-stagger-item relative flex-1 overflow-hidden rounded-[2rem] group w-full"
              >
                <Image
                  src="/images/categories/face.png"
                  alt="Face collection"
                  fill
                  className="hidden md:block object-cover object-[70%] md:object-center transition-transform duration-[1000ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-[1.03]"
                  sizes="(max-width: 768px) 100vw, 40vw"
                />
                <Image
                  src="/images/mobile images/face mobile.jpeg"
                  alt="Face collection mobile"
                  fill
                  className="md:hidden object-cover transition-transform duration-[1000ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-[1.03]"
                  sizes="100vw"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-[800ms]" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-80" />
                
                <div className="absolute bottom-8 left-8 right-8 text-white transform transition-transform duration-[800ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:-translate-y-2">
                  <h3 className="font-display text-[clamp(32px,3vw,42px)] tracking-tight leading-none drop-shadow-lg">Face</h3>
                  <p className="font-sans text-[12px] tracking-[0.2em] uppercase mt-2 opacity-90">The Canvas Essence</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Why Inoya Rouge */}
      <section className="relative bg-warm-pink overflow-hidden pt-6 pb-12 lg:pt-12 lg:pb-8 lg:py-0 lg:h-[650px]">
        {/* Background illustration */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Desktop Single Image */}
          <Image
            src="/images/why/bg-illustration.jpeg"
            alt=""
            fill
            className="hidden lg:block object-cover object-center blur-[0.6px]"
            sizes="100vw"
            quality={100}
          />
          {/* Mobile Image */}
          <div className="lg:hidden absolute inset-0">
            <Image
              src="/images/mobile images/why us bg mobile.jpeg"
              alt=""
              fill
              className="object-cover object-center blur-[0.6px]"
              sizes="100vw"
              quality={100}
            />
          </div>
        </div>

        <div className="relative z-10 max-w-[1440px] mx-auto px-4 md:px-12 xl:px-[100px] h-full flex flex-col lg:grid lg:grid-cols-[1.1fr_1fr] gap-0 items-center">

          {/* Mobile Header & Text */}
          <div className="lg:hidden flex flex-col items-center text-center w-full pt-6 pb-6 relative z-10">
            <h2 className="font-display text-[clamp(34px,10vw,50px)] whitespace-nowrap text-[#720B0B] leading-[1.05] m-0 font-normal">
              Why Inoya Rouge?
            </h2>
          </div>

          {/* Mobile Product image inline */}
          <div className="lg:hidden relative w-full max-w-[450px] mx-auto aspect-[4/4.5] mix-blend-multiply flex items-center justify-center mt-2 -mb-8 z-0 pointer-events-none">
            <Image
              src="/images/why/product-image.jpeg"
              alt="Inoya Rouge product"
              fill
              className="object-contain object-center"
              sizes="100vw"
              quality={100}
              priority
            />
          </div>

          {/* Desktop Product image */}
          <div className="hidden lg:flex order-2 lg:order-2 scroll-image-subtle relative w-full items-center justify-center mt-2 mb-2 lg:mt-0 lg:mb-0 lg:h-full">
            {/* Desktop Image with Radial Mask */}
            <div
              className="relative w-full h-[450px] lg:h-full mx-auto scale-90"
              style={{
                maskImage: 'radial-gradient(ellipse closest-side, black 85%, transparent 100%)',
                WebkitMaskImage: 'radial-gradient(ellipse closest-side, black 85%, transparent 100%)'
              }}
            >
              <Image
                src="/images/why/product-image.jpeg"
                alt="Inoya Rouge product"
                fill
                className="object-contain object-center"
                sizes="(max-width: 1024px) 100vw, 50vw"
                quality={100}
              />
            </div>
          </div>

          {/* Left: Heading + Bullets */}
          <div className="order-3 lg:order-1 scroll-stagger-group flex flex-col gap-3 lg:gap-[32px] justify-center w-full max-w-[650px] lg:ml-12 xl:ml-20 mt-0 lg:mt-0 relative z-10">
            {/* The heading is offset to align with the text of the bullets (Desktop Only) */}
            <div className="hidden lg:flex scroll-stagger-item gap-4 md:gap-[24px]">
              <div className="w-[44px] md:w-[50px] shrink-0" /> {/* Spacer for icon column */}
              <h2 className="font-display text-[clamp(36px,5vw,56px)] text-[#720B0B] leading-[1] m-0 font-normal">
                Why Inoya Rouge?
              </h2>
            </div>

            <div className="flex flex-col gap-[12px] lg:gap-[16px] w-full pb-4 lg:pb-0">
              {whyBullets.map(bullet => (
                <div key={bullet.heading} className="scroll-stagger-item flex gap-[16px] lg:gap-[24px] items-center lg:items-start group bg-[#FEF9F8]/95 lg:bg-transparent rounded-[20px] lg:rounded-none p-4 lg:p-0 shadow-[0_4px_20px_rgba(0,0,0,0.04)] lg:shadow-none backdrop-blur-md lg:backdrop-blur-none border border-white/80 lg:border-none">
                  {/* Icon Column */}
                  <div className="relative shrink-0 flex justify-center items-center w-[56px] h-[56px] lg:w-[50px] lg:h-auto bg-[#FDF0EE] lg:bg-transparent rounded-full lg:rounded-none border lg:border-none border-[#F8DFDA] lg:mt-1">
                    <div className="relative origin-center lg:origin-top transition-transform duration-300 group-hover:scale-110 flex items-center justify-center w-full h-full lg:w-auto lg:h-auto opacity-90 lg:opacity-100">
                      <div className="relative lg:hidden" style={{ width: bullet.iconSize.w * 0.7, height: bullet.iconSize.h * 0.7 }}>
                        <Image src={bullet.icon} alt="" fill className="object-contain" sizes="40px" />
                      </div>
                      <div className="relative hidden lg:block" style={{ width: bullet.iconSize.w, height: bullet.iconSize.h }}>
                        <Image src={bullet.icon} alt="" fill className="object-contain" sizes={`${Math.max(bullet.iconSize.w, bullet.iconSize.h)}px`} />
                      </div>
                    </div>
                  </div>
                  {/* Text Column */}
                  <div className="flex flex-col gap-1.5 lg:gap-[8px]">
                    <h3 className="font-display text-[17px] lg:text-[clamp(20px,2vw,24px)] text-[#720B0B] leading-[1.2] m-0 font-medium lg:font-normal tracking-[0.01em]">
                      {bullet.heading}
                    </h3>
                    <p className="font-sans text-[13px] lg:text-[clamp(14px,1.2vw,16px)] text-[#555555] lg:text-[#333333] leading-[1.4] lg:leading-[1.5] m-0 lg:max-w-[420px]">
                      {bullet.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* 6. Community Story — form with bg image */}
      <section className="relative py-16 md:py-24 px-4 overflow-hidden">
        <Image
          src="/images/Form/form bg.jpeg"
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="scroll-fade-up relative z-10 max-w-[700px] mx-auto bg-white/30 backdrop-blur-sm border border-white/40 rounded-2xl px-8 md:px-16 py-12 md:py-16 shadow-xl">
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

      {/* 7. Testimonials */}
      <section className="bg-cream pb-12 md:pb-20 px-4">
        <Suspense fallback={null}>
          <TestimonialList />
        </Suspense>
      </section>
    </div>
  )
}
