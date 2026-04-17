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

export default function TrustBadges() {
  return (
    <section className="bg-[#FFF3EE] border-t border-burgundy/10 py-16 md:py-24 w-full overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-6 flex flex-col items-center justify-center">
        <h2 className="text-burgundy font-sans text-[22px] md:text-[28px] text-center max-w-[500px] leading-tight mb-12 font-medium tracking-wide">
          Beauty should never come at<br />the cost of your skin.
        </h2>

        {/* Badges Container */}
        <div className="flex flex-wrap w-full items-center justify-center gap-8 md:gap-14">
          {badges.map((badge, index) => (
            <div 
              key={`${badge.name}-${index}`} 
              className="flex items-center justify-center shrink-0"
            >
              <div className="relative" style={{ width: badge.width, height: badge.height }}>
                <Image
                  src={badge.image}
                  alt={badge.name}
                  fill
                  className="object-contain"
                  sizes={`${Math.max(badge.width, badge.height)}px`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
