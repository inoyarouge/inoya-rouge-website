'use client'

import Image from 'next/image'

const badges = [
  { name: 'Cruelty Free', image: '/images/badges/cruelty-free.svg', width: 80, height: 80 },
  { name: 'FDA Approved', image: '/images/badges/fda-approved.svg', width: 80, height: 80 },
  { name: 'Made in India', image: '/images/badges/made-in-india.svg', width: 110, height: 64 },
  { name: 'Chemical Free', image: '/images/badges/chemical-free.svg', width: 80, height: 80 },
  { name: 'Vitamin E', image: '/images/badges/vitamin-e.svg', width: 80, height: 80 },
  { name: 'Paraben Free', image: '/images/badges/paraben-free.svg', width: 80, height: 80 },
  { name: 'Vegan', image: '/images/badges/vegan.svg', width: 95, height: 80 },
]

// Triple repetition for seamless loop on mobile
const tickerItems = [...badges, ...badges, ...badges]

export default function TrustBadges() {
  return (
    <section className="bg-[#FFF3EE] border-t border-burgundy/10 py-16 md:py-24 w-full overflow-hidden">
      <div className="max-w-[1440px] mx-auto flex flex-col items-center justify-center">
        <h2 className="px-6 text-[#720B0B] font-sans text-[clamp(24px,3vw,32px)] text-center max-w-[600px] leading-[1.3] mb-12 md:mb-16 font-medium tracking-wide">
          Beauty should never come <br className="md:hidden" />at the cost of your skin.
        </h2>

        {/* Unified Ticker */}
        <div className="relative w-full overflow-hidden">
          <div
            className="flex items-center gap-12 md:gap-24 w-max animate-ticker"
            aria-hidden="true"
          >
            {tickerItems.map((badge, i) => (
              <div
                key={`${badge.name}-${i}`}
                className="relative shrink-0"
                style={{ width: badge.width, height: badge.height }}
              >
                <Image
                  src={badge.image}
                  alt={badge.name}
                  fill
                  className="object-contain"
                  sizes={`${Math.max(badge.width, badge.height)}px`}
                />
              </div>
            ))}
          </div>

          {/* Left fade */}
          <div
            className="pointer-events-none absolute inset-y-0 left-0 w-16 md:w-32 z-10"
            style={{ background: 'linear-gradient(to right, #FFF3EE 0%, transparent 100%)' }}
          />
          {/* Right fade */}
          <div
            className="pointer-events-none absolute inset-y-0 right-0 w-16 md:w-32 z-10"
            style={{ background: 'linear-gradient(to left, #FFF3EE 0%, transparent 100%)' }}
          />

          <style jsx>{`
            @keyframes ticker {
              0%   { transform: translateX(0); }
              100% { transform: translateX(-33.333%); }
            }
            .animate-ticker {
              animation: ticker 25s linear infinite;
            }
            .animate-ticker:hover {
              animation-play-state: paused;
            }
            @media (min-width: 768px) {
              .animate-ticker {
                animation: ticker 35s linear infinite;
              }
            }
          `}</style>
        </div>
      </div>
    </section>
  )
}
