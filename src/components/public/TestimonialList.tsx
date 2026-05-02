import { createClient } from '@/lib/supabase/server'
import type { Testimonial } from '@/lib/types'

export default async function TestimonialList() {
    const supabase = await createClient()
    const { data } = await supabase
        .from('testimonials')
        .select('*')
        .eq('status', 'approved')
        .order('sort_order', { ascending: true })

    const testimonials = (data as Testimonial[]) ?? []

    if (testimonials.length === 0) return null

    // Ensure we have enough items to loop seamlessly by repeating the array
    const repeatCount = Math.max(3, Math.ceil(12 / (testimonials.length || 1)))
    const tickerItems = Array(repeatCount).fill(testimonials).flat()

    return (
        <div className="w-full pt-16 md:pt-24 pb-12 overflow-hidden scroll-fade-up border-t border-burgundy/5 relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-[1px] bg-gradient-to-r from-transparent via-burgundy/20 to-transparent" />

            <h3 className="font-accent italic text-[clamp(24px,3vw,32px)] text-accent-pink text-center leading-tight tracking-tight mb-10">
                Loved By Our Community
            </h3>

            <div className="relative w-full">
                {/* Scrolling track */}
                <div
                    className="flex items-stretch gap-4 md:gap-8 w-full md:w-max overflow-x-auto md:overflow-visible snap-x snap-mandatory md:snap-none animate-testimonial-ticker px-4 md:px-6 pb-6 md:pb-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                    aria-hidden="true"
                >
                    {tickerItems.map((t, i) => (
                        <div
                            key={`${t.id}-${i}`}
                            className={`relative shrink-0 snap-center md:snap-align-none w-[85vw] md:w-[400px] lg:w-[460px] bg-gradient-to-br from-[#FFFBF9] to-[#FFF0EB] border border-burgundy/15 p-8 md:p-10 flex-col hover:-translate-y-2 transition-all duration-500 shadow-[0_8px_40px_-4px_rgba(114,11,11,0.08)] hover:shadow-[0_16px_50px_-4px_rgba(114,11,11,0.12)] group ${i >= testimonials.length ? 'hidden md:flex' : 'flex'}`}
                        >
                            {/* Decorative background quote mark */}
                            <div className="absolute top-6 right-8 opacity-[0.03] text-burgundy font-serif text-[120px] leading-none select-none pointer-events-none group-hover:opacity-[0.08] transition-opacity duration-500 mix-blend-multiply">
                                &rdquo;
                            </div>
                            {t.title && (
                                <h4 className="relative z-10 font-display text-[18px] md:text-[20px] text-burgundy mb-3 leading-tight pr-12 tracking-wide">
                                    {t.title}
                                </h4>
                            )}
                            <p className="relative z-10 font-sans text-[15px] md:text-[16px] text-[#2c2c2c] leading-[1.7] font-light mb-8 italic">
                                "{t.content}"
                            </p>
                            <div className="relative z-10 flex items-center gap-4 mt-auto pt-6 border-t border-burgundy/5">
                                <div className="h-[1px] w-6 bg-burgundy/30" />
                                <p className="font-sans text-[11px] md:text-[12px] text-burgundy uppercase tracking-[0.2em] font-medium">
                                    {t.author_name}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Left fade covering the edges */}
                <div
                    className="pointer-events-none absolute inset-y-0 left-0 w-16 md:w-32 z-10 hidden md:block"
                    style={{ background: 'linear-gradient(to right, var(--tw-prose-body, #FEF6F4) 0%, transparent 100%)' }}
                />
                {/* Right fade */}
                <div
                    className="pointer-events-none absolute inset-y-0 right-0 w-16 md:w-32 z-10 hidden md:block"
                    style={{ background: 'linear-gradient(to left, var(--tw-prose-body, #FEF6F4) 0%, transparent 100%)' }}
                />
            </div>

            <style>{`
        @keyframes testimonial-ticker {
          0%   { transform: translateX(0); }
          100% { transform: translateX(calc(-100% / ${repeatCount})); }
        }
        @media (min-width: 768px) {
          .animate-testimonial-ticker {
            /* Adjust speed based on number of unique items */
            animation: testimonial-ticker ${Math.max(20, testimonials.length * 8)}s linear infinite;
          }
          .animate-testimonial-ticker:hover {
            animation-play-state: paused;
          }
        }
      `}</style>
        </div>
    )
}
