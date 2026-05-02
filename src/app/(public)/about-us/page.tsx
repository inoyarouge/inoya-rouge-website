import type { Metadata } from 'next'
import Image from 'next/image'
import PromotionBannerResolver from '@/components/public/PromotionBannerResolver'
import AnchorScroller from '@/components/public/AnchorScroller'
import OurStoryBanner from './OurStoryBanner'
import ScrollRevealText from '@/components/public/ScrollRevealText'
import TeamSection from './TeamSection'

export const revalidate = false

export const metadata: Metadata = {
  title: 'About Us | Inoya Rouge',
  description:
    'Discover Inoya Rouge — an Indian luxury cosmetics brand blending heritage, nature, and modern innovation. Crafted with precision, made for every shade of you.',
}

// TODO: replace with section-specific imagery once brand finals are supplied.
const SECTION_IMAGE = '/images/about/about-image.jpeg'

const productPillars = [
  {
    icon: '/images/why/skin-friendly.svg',
    label: 'Skin-Friendly: gentle formulations suitable for daily wear',
    width: 32,
    height: 32,
  },
  {
    icon: '/images/badges/cruelty-free.svg',
    label: 'Cruelty-Free: never tested on animals',
    width: 32,
    height: 32,
  },
  {
    icon: '/images/badges/fda-approved.svg',
    label: 'Dermatologically Considered: created with care for skin health',
    width: 32,
    height: 32,
  },
  {
    icon: '/images/badges/paraben-free.svg',
    label: 'Paraben Conscious: avoiding harsh chemicals wherever possible',
    width: 32,
    height: 32,
  },
  {
    icon: '/images/why/indian-elegance.svg',
    label: 'Inspired By Nature: enriched with essential enriched oils',
    width: 32,
    height: 32,
  },
]

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-display text-burgundy text-2xl md:text-[27px] mb-5 md:mb-6">
      {children}
    </h2>
  )
}

function ColImage({ alt, priority = false, disconnected = false, src, mobileSrc }: { alt: string; priority?: boolean; disconnected?: boolean; src?: string; mobileSrc?: string }) {
  const finalSrc = src || SECTION_IMAGE;

  const renderImage = () => {
    if (mobileSrc) {
      return (
        <>
          <Image
            src={finalSrc}
            alt={alt}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="hidden md:block object-cover"
            priority={priority}
          />
          <Image
            src={mobileSrc}
            alt={alt}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="block md:hidden object-cover"
            priority={priority}
          />
        </>
      )
    }
    return (
      <Image
        src={finalSrc}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className="object-cover"
        priority={priority}
      />
    )
  }

  if (disconnected) {
    return (
      <div className="relative w-full aspect-[4/3] md:aspect-auto md:h-full md:min-h-[345px] bg-cream p-6 sm:p-10 md:p-12 lg:p-16">
        <div className="relative w-full h-full min-h-[300px] overflow-hidden">
          {renderImage()}
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full aspect-[472/345] overflow-hidden bg-cream">
      {renderImage()}
    </div>
  )
}

// Each row is a full-width 2-column split. Image fills its half edge-to-edge;
// text sits in a padded half. Pass `imageRight` to flip the orientation.
function Row({
  imageRight = false,
  imageAlt,
  disconnectedImage = false,
  src,
  mobileSrc,
  heading,
  mobileHeadingTop = true,
  children,
}: {
  imageRight?: boolean
  imageAlt: string
  disconnectedImage?: boolean
  src?: string
  mobileSrc?: string
  heading?: React.ReactNode
  mobileHeadingTop?: boolean
  children: React.ReactNode
}) {
  const imagePadding = !disconnectedImage
    ? (imageRight
      ? 'px-6 sm:px-10 md:pl-0 md:pr-12 lg:pr-16 py-4 md:py-0'
      : 'px-6 sm:px-10 md:pr-0 md:pl-12 lg:pl-16 py-4 md:py-0')
    : '';

  return (
    <section className="bg-cream">
      {heading && mobileHeadingTop && (
        <div className="md:hidden px-6 pt-10 sm:px-10 pb-0">
          {heading}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className={`h-full ${!disconnectedImage ? `flex flex-col justify-center ${imagePadding}` : ''} ${imageRight ? (mobileHeadingTop ? 'order-1 md:order-2' : 'order-2 md:order-2') : 'order-1 md:order-1'}`}>
          <ColImage alt={imageAlt} disconnected={disconnectedImage} src={src} mobileSrc={mobileSrc} />
        </div>
        <div className={`flex flex-col justify-center px-6 sm:px-10 md:px-12 lg:px-16 ${heading && mobileHeadingTop ? 'pt-6 pb-10 md:py-12' : 'py-10 md:py-12'} ${imageRight ? (mobileHeadingTop ? 'order-2 md:order-1' : 'order-1 md:order-1') : 'order-2 md:order-2'}`}>
          {heading && (
            <div className={mobileHeadingTop ? "hidden md:block" : ""}>
              {heading}
            </div>
          )}
          {children}
        </div>
      </div>
    </section>
  )
}

export default function OurStoryPage() {
  return (
    <div className="bg-cream">
      <AnchorScroller />
      <PromotionBannerResolver />

      {/* Hero band — image background with overlaid pill + display heading + tagline */}
      <section className="relative bg-cream">
        <div className="relative h-[400px] md:h-[442px] w-full overflow-hidden">
          {/* Desktop banner */}
          <Image
            src="/images/about us/about us banner.jpeg"
            alt="Inoya Rouge — About Us"
            fill
            sizes="100vw"
            className="hidden md:block object-cover object-center"
            priority
          />
          {/* Mobile banner */}
          <Image
            src="/images/mobile images/about us banner mobile.jpeg"
            alt="Inoya Rouge — About Us"
            fill
            sizes="100vw"
            className="block md:hidden object-cover object-center"
            priority
          />
          <OurStoryBanner />
        </div>
      </section>

      {/* About Us — full essay + portrait (using the same Row pattern) */}
      <Row
        imageRight
        imageAlt="Inoya Rouge brand imagery"
        disconnectedImage
        src="/images/about us/about us start.jpeg"
        mobileSrc="/images/mobile images/about us image mobile.jpeg"
        heading={<Eyebrow>About Us</Eyebrow>}
        mobileHeadingTop
      >
        <div className="font-sans text-base md:text-lg text-black space-y-4 leading-relaxed">
          <p className="font-medium">Inoya Rouge — The Power of Nature in Every Rouge</p>
          <p>
            At Inoya Rouge, beauty is more than just color—it&apos;s confidence, creativity,
            and the art of self-expression.
          </p>
          <p>
            Born in India, our philosophy merges luxury and nature to create cosmetics that
            nurture the skin as beautifully as they enhance it. Each formula is infused with
            botanical ingredients and Indian essential oils, celebrated for their skin-loving
            benefits, ensuring that indulgence and care go hand in hand.
          </p>
          <p>
            Our vision is to empower every individual to embrace their essence—to feel bold,
            radiant, and unapologetically themselves every day. Every Inoya Rouge creation is
            crafted with precision and purpose: rich pigments, skin-friendly textures, and a
            touch of nature&apos;s purity that brings modern elegance to life.
          </p>
          <p>
            We believe beauty should feel as good as it looks. Our formulations balance
            innovation and artistry, blending trend-forward shades with timeless
            sophistication. From serene neutrals to audacious hues, every tone is designed to
            enhance natural beauty while delivering comfort, color, and confidence.
          </p>
          <p>
            Rooted in India and designed for the modern woman, our cosmetics celebrate
            radiance that feels as good as it looks.
          </p>
          <p>
            More than makeup, Inoya Rouge is a celebration—of self-expression, individuality,
            and the quiet confidence of knowing your beauty begins with care.
          </p>
        </div>

        <div className="mt-10 relative">
          <p className="relative z-10 font-sans text-base md:text-lg text-black">
            Thank You for being a part of our journey
          </p>
          <div className="relative z-0 mt-2 md:mt-4 -ml-4 w-[336px] h-[113px] md:w-[413px] md:h-[150px]">
            <Image
              src="/images/about us/signature.jpeg"
              alt="Inoya Rouge Founders Signature"
              fill
              className="object-contain object-left mix-blend-multiply"
            />
          </div>
        </div>
      </Row>

      {/* Vision Statement */}
      <section className="bg-cream relative py-20 md:py-28 lg:py-32 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 flex flex-col items-center">
          <ScrollRevealText
            text="“To build a beauty brand that blends Indian heritage with modern innovation, creating cosmetics that celebrate individuality, confidence, and authentic beauty.”"
            className="font-display font-medium text-burgundy text-3xl sm:text-4xl md:text-5xl lg:text-[50px] leading-[1.2] md:leading-[1.25]"
          />
        </div>
      </section>

      {/* Our Clean Beauty Promise — image L / text R */}
      <div id="clean-beauty-promise" className="scroll-mt-20">
        <Row
          imageAlt="Inoya Rouge clean beauty promise"
          heading={<Eyebrow>Our Clean Beauty Promise</Eyebrow>}
          src="/images/about us/clean beauty promise.jpeg"
          mobileSrc="/images/mobile images/clean beauty promise mobile.jpeg"
        >
          <p className="font-sans text-base md:text-lg text-black leading-relaxed">
            Our Clean Beauty Promise stands at the heart of who we are: creating products that are
            ethical, conscious, and safe for everyday use. With Inoya Rouge, you don&apos;t just wear
            makeup. You experience the luxury of nature refined through artistry.
          </p>
        </Row>
      </div>

      {/* Our Products — text L / image R */}
      <Row
        imageRight
        imageAlt="Inoya Rouge product collection"
        heading={<Eyebrow>Our Products</Eyebrow>}
        src="/images/about us/our products.jpeg"
        mobileSrc="/images/mobile images/our products mobile.jpeg"
      >
        <ul className="space-y-5 md:space-y-6">
          {productPillars.map(({ icon, label }) => (
            <li key={label} className="flex items-center gap-4 md:gap-5">
              <div className="relative w-9 h-9 md:w-10 md:h-10 shrink-0">
                <Image src={icon} alt="" fill className="object-contain" />
              </div>
              <span className="font-sans text-base md:text-lg text-black leading-relaxed">
                {label}
              </span>
            </li>
          ))}
        </ul>
      </Row>

      {/* Our Ingredients — row 1: image L / text R */}
      <Row
        imageAlt="Indian botanicals and essential oils"
        heading={<Eyebrow>Our Ingredients</Eyebrow>}
        src="/images/about us/ingredients 1.jpeg"
        mobileSrc="/images/mobile images/ingredients 1 mobile.jpeg"
      >
        <div className="font-sans text-base md:text-lg text-black space-y-4 leading-relaxed">
          <p className="font-medium">A Tribute to Indian Excellence</p>
          <p>
            There&apos;s something timeless about the way beauty has always been nurtured in
            India—through simple rituals, trusted ingredients, and a deep connection to nature.
          </p>
          <p>
            At Inoya Rouge, we carry that feeling forward, bringing together the essence of Indian
            oils and nourishing botanicals in everything we create.
          </p>
          <p>
            Guided by nature and refined through modern cosmetic science, our creations are
            meticulously
          </p>
        </div>
      </Row>

      {/* Our Ingredients — row 2: text L / image R */}
      <Row
        imageRight
        imageAlt="Inoya Rouge ingredient detail"
        src="/images/about us/ingredients 2.jpeg"
        mobileSrc="/images/mobile images/ingredients 2 mobile.jpeg"
      >
        <div className="font-sans text-base md:text-lg text-black space-y-4 leading-relaxed">
          <p>
            crafted to deliver a sensorial experience that is lightweight, hydrating, and
            effortlessly comfortable.
          </p>
          <p>
            From replenishing oils that cocoon the lips in moisture to finely curated pigments
            that complement Indian skin tones, each ingredient is chosen with intention—striking a
            harmonious balance between performance, care, and sophistication.
          </p>
          <p>
            Because to us, beauty should feel real. It should feel easy. And most importantly, it
            should feel like you.
          </p>
          <p>The result is beauty reimagined—authentic, indulgent, and unmistakably Indian.</p>
        </div>
      </Row>

      {/* What Makes Us Different — row 1: image L / text R */}
      <Row
        imageAlt="What makes Inoya Rouge different"
        heading={<Eyebrow>What Makes Us Different</Eyebrow>}
        src="/images/about us/difference 1.jpeg"
        mobileSrc="/images/mobile images/difference 1 mobile.jpeg"
      >
        <div className="font-sans text-base md:text-lg text-black space-y-4 leading-relaxed">
          <p>
            At Inoya Rouge, we believe beauty should be more than just colour—it should be a
            thoughtful blend of care, creativity, and confidence.
          </p>
          <p>
            <span className="block font-medium">Precision Meets Passion</span>
            Founded by professionals from the world of finance and corporate advisory, our brand
            combines structured precision with creative expression, ensuring that every product is
            thoughtfully developed and carefully crafted.
          </p>
          <p>
            <span className="block font-medium">Skin-Friendly Formulations</span>
            Our cosmetics are designed to enhance beauty while remaining gentle on the skin. We
            focus on comfortable textures, nourishing ingredients, and formulas suitable for
            everyday wear.
          </p>
        </div>
      </Row>

      {/* What Makes Us Different — row 2: text L / image R */}
      <Row
        imageRight
        imageAlt="Indian beauty traditions"
        src="/images/about us/difference 2.jpeg"
        mobileSrc="/images/mobile images/difference 2 mobile.jpeg"
      >
        <div className="font-sans text-base md:text-lg text-black space-y-4 leading-relaxed">
          <p>
            <span className="block font-medium">Inspired by Indian Beauty Traditions</span>
            India&apos;s heritage of natural beauty rituals inspires our formulations. Ingredients
            such as Indian essential oils reflect our commitment to combining tradition with modern
            cosmetic science.
          </p>
          <p>
            <span className="block font-medium">Made for Indian Skin Tones</span>
            We celebrate the diversity of Indian beauty by creating shades that complement a wide
            range of skin tones, ensuring everyone can find their perfect colour.
          </p>
        </div>
      </Row>

      {/* About Us — 4 alternating rows */}
      <div id="our-story">
        <Row
          imageAlt="Two friends, the founders of Inoya Rouge"
          heading={<Eyebrow>Our Story</Eyebrow>}
          src="/images/about us/story 1.jpeg"
          mobileSrc="/images/mobile images/story 1 mobile.jpeg"
        >
          <div className="font-sans text-base md:text-lg text-black space-y-4 leading-relaxed">
            <p className="font-medium">Inoya Rouge — A Story Woven with Heart</p>
            <p>
              Inoya Rouge began as something beautifully unexpected—a quiet dream that stood in
              contrast to the structured paths we had chosen. Two Childhood Friends who were together
              since they were in pigtails, having similar ideologies, similar thoughts, always
              wanting to challenging themselves, their worlds were defined by precision, numbers, and
              discipline.
            </p>
          </div>
        </Row>
      </div>

      <Row
        imageRight
        imageAlt="Indian botanicals"
        src="/images/about us/story 2.jpeg"
        mobileSrc="/images/mobile images/story 2 mobile.jpeg"
      >
        <div className="font-sans text-base md:text-lg text-black space-y-4 leading-relaxed">
          <p>
            Yet, beneath it all blossomed a shared passion for beauty, creativity, and
            self-expression—something that felt just as real, just as important. Something that
            they wanted to create while worshipping and flaunting their proud careers.
          </p>
          <p>What started as a contrast soon became a calling.</p>
          <p>
            Drawn to the richness of Indian botanicals and the timeless beauty rituals, we grew up
            with, we desired to create a Beauty Brand that felt closer to the heart.
          </p>
        </div>
      </Row>

      <Row
        imageAlt="Mother and daughters"
        src="/images/about us/story 3.jpeg"
        mobileSrc="/images/mobile images/story 3 mobile.jpeg"
      >
        <div className="font-sans text-base md:text-lg text-black space-y-4 leading-relaxed">
          <p>
            A Brand that blended nature&apos;s goodness with modern care and elegance—where beauty
            didn&apos;t just enhanced, but nurtured.
          </p>
          <p>
            With the gentle strength and unwavering belief of a mother who always encouraged us to
            create with honesty and love, that small dream began to take shape.
          </p>
        </div>
      </Row>

      <Row
        imageRight
        imageAlt="Inoya Rouge — structure and soul"
        src="/images/about us/story 4.jpeg"
        mobileSrc="/images/mobile images/story 4 mobile.jpeg"
      >
        <div className="font-sans text-base md:text-lg text-black space-y-4 leading-relaxed">
          <p>
            Her faith gave us the courage to explore a new expression of ourselves—one that exists
            alongside our professions, yet reaches beyond them—an addition of excitement where we
            can use our professional skills alongwith our staggered creativity, bringing to life a
            meaningful, deeply personal vision that truly reflects who we are. With her
            encouragement, wisdom, and quiet strength, what started as an idea grew into a journey
            rooted in authenticity, purpose, and love.
          </p>
          <p className="font-accent italic text-burgundy text-xl md:text-2xl">
            &ldquo;Inoya Rouge&rdquo; — A meeting point of logic and passion. Of structure and
            soul.
          </p>
        </div>
      </Row>

      {/* Our Mission — 3 alternating rows */}
      <div id="our-mission" className="scroll-mt-20">
        <Row
          imageAlt="Inoya Rouge mission"
          heading={<Eyebrow>Our Mission</Eyebrow>}
          src="/images/about us/mission 1.jpeg"
          mobileSrc="/images/mobile images/mission 1 mobile.jpeg"
        >
          <p className="font-sans text-base md:text-lg text-black leading-relaxed">
            We set out to create cosmetics that combine professional precision with thoughtful
            formulations, where every product we create is infused with thoughtfully chosen Botanical
            Ingredients, inspired by India&apos;s rich heritage and the goodness of natural
            ingredients like Indian essential oils, we carefully crafted products designed to care
            for your skin while celebrating your individuality.
          </p>
        </Row>

        <Row
          imageRight
          imageAlt="Inoya Rouge philosophy"
          src="/images/about us/mission 2.jpeg"
          mobileSrc="/images/mobile images/mission 2 mobile.jpeg"
        >
          <div className="font-sans text-base md:text-lg text-black space-y-4 leading-relaxed">
            <p>
              Because we believe beauty should never feel heavy or forced—it should feel natural,
              effortless, and entirely your own.
            </p>
            <p>
              This is more than a brand to us. It&apos;s a reminder that you can honour where you
              come from, while still following what moves you.
            </p>
            <p>
              And in doing so, create something that resonates—not just with you, but with every
              woman who has ever felt the pull between what she does and what she truly loves.
            </p>
          </div>
        </Row>

        <Row
          imageAlt="Inoya Rouge — for every shade of you"
          src="/images/about us/mission 3.jpeg"
          mobileSrc="/images/mobile images/mission 3 mobile.jpeg"
        >
          <div className="font-sans text-base md:text-lg text-black space-y-5 leading-relaxed">
            <p>
              Through our journey, a journey that has just begun, we hope to create more than a
              brand—we hope to build a space where every shade, every story, and every woman feels
              seen, celebrated, and empowered to express herself in her own unique way.
            </p>
            <p className="font-accent italic text-burgundy text-xl md:text-2xl">
              &ldquo;INOYA ROUGE — Born from friendship, strengthened by family, crafted with India,
              made for every shade of you.&rdquo;
            </p>
          </div>
        </Row>
      </div>

      {/* Our Team Section */}
      <TeamSection />
    </div>
  )
}
