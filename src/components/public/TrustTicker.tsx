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

const tickerItems = [...badges, ...badges, ...badges]

export default function TrustTicker() {
    return (
        <div className="relative w-full bg-cream overflow-hidden py-10 md:py-14">
            <div
                className="flex items-center gap-20 md:gap-28 w-max animate-ticker"
                style={{ ['--ticker-duration' as string]: '30s' }}
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

            <div
                className="pointer-events-none absolute inset-y-0 left-0 w-28 z-10"
                style={{ background: 'linear-gradient(to right, #fff8f6 0%, transparent 100%)' }}
            />
            <div
                className="pointer-events-none absolute inset-y-0 right-0 w-28 z-10"
                style={{ background: 'linear-gradient(to left, #fff8f6 0%, transparent 100%)' }}
            />
        </div>
    )
}
