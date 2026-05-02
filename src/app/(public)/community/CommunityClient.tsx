'use client'

import { motion } from 'framer-motion'
import CommunityStoryForm from '@/components/public/CommunityStoryForm'
import type { Testimonial } from '@/lib/types'
import Image from 'next/image'
import React from 'react'

export default function CommunityClient({
    testimonials,
    promotionBanner
}: {
    testimonials: Pick<Testimonial, 'id' | 'author_name' | 'title' | 'content' | 'created_at'>[]
    promotionBanner?: React.ReactNode
}) {
    return (
        <div className="bg-[#fffcfb] min-h-screen w-full">
            {promotionBanner}

            {/* Hero Banner Section */}
            <div className="relative w-full overflow-hidden mb-12 lg:mb-16 h-[400px] md:h-[442px] flex flex-col justify-center">
                <Image
                    src="/images/community/community desktop banner.jpeg"
                    alt=""
                    fill
                    className="object-cover object-center"
                    sizes="100vw"
                    priority
                />


                <motion.div
                    className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 lg:px-12 flex flex-col items-center justify-center text-center mt-10 md:mt-0"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                >
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="font-serif font-normal text-5xl md:text-6xl lg:text-7xl text-burgundy mb-4"
                    >
                        Your Stories
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                        className="text-lg md:text-xl font-sans font-light text-gray-700 max-w-xl mx-auto"
                    >
                        Hear from women who have made Inoya Rouge part of their beauty journey.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
                        className="mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center"
                    >
                        <button
                            onClick={() => document.getElementById('story-form')?.scrollIntoView({ behavior: 'smooth' })}
                            className="bg-burgundy text-white px-8 py-3.5 font-sans text-[13px] tracking-[0.1em] uppercase hover:bg-[#5a0d0d] hover:scale-105 transition-all duration-300 w-full sm:w-auto"
                        >
                            Share Your Story
                        </button>
                        <button
                            onClick={() => document.getElementById('stories-grid')?.scrollIntoView({ behavior: 'smooth' })}
                            className="bg-transparent border border-burgundy text-burgundy px-8 py-3.5 font-sans text-[13px] tracking-[0.1em] uppercase hover:bg-burgundy/5 hover:scale-105 transition-all duration-300 w-full sm:w-auto"
                        >
                            Read Stories
                        </button>
                    </motion.div>
                </motion.div>
            </div>

            {/* Stories Grid */}
            <section id="stories-grid" className="max-w-6xl mx-auto px-4 md:px-8 lg:px-12 py-10 md:py-16">
                {testimonials.length === 0 ? (
                    <p className="text-gray-500 text-center py-12 font-sans text-lg">
                        Be the first to share your Inoya Rouge story.
                    </p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
                        {testimonials.map((t, idx) => (
                            <motion.article
                                key={t.id}
                                className="relative bg-gradient-to-br from-[#FFFBF9] to-[#FFF0EB] border border-burgundy/15 p-8 md:p-10 flex flex-col hover:-translate-y-2 transition-all duration-500 shadow-[0_8px_40px_-4px_rgba(114,11,11,0.08)] hover:shadow-[0_16px_50px_-4px_rgba(114,11,11,0.12)] group"
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ duration: 0.6, delay: 0.1 * (idx % 2), ease: [0.16, 1, 0.3, 1] }}
                            >
                                {/* Decorative background quote mark */}
                                <div className="absolute top-6 right-8 opacity-[0.03] text-burgundy font-serif text-[120px] leading-none select-none pointer-events-none group-hover:opacity-[0.08] transition-opacity duration-500 mix-blend-multiply">
                                    &rdquo;
                                </div>

                                {t.title && (
                                    <h3 className="relative z-10 font-display text-[20px] md:text-[22px] text-burgundy mb-3 leading-tight pr-12 tracking-wide">
                                        {t.title}
                                    </h3>
                                )}
                                <p className="relative z-10 font-sans text-[15px] md:text-[16px] text-[#2c2c2c] leading-[1.7] font-light mb-8 italic">
                                    "{t.content}"
                                </p>
                                <footer className="relative z-10 flex items-center justify-between mt-auto pt-6 border-t border-burgundy/5">
                                    <div className="flex items-center gap-4">
                                        <div className="h-[1px] w-6 bg-burgundy/30" />
                                        <span className="font-sans text-[11px] md:text-[12px] text-burgundy uppercase tracking-[0.2em] font-medium">
                                            {t.author_name}
                                        </span>
                                    </div>
                                    <time dateTime={t.created_at} className="font-sans text-xs text-gray-400">
                                        {new Date(t.created_at).toLocaleDateString('en-IN', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric',
                                        })}
                                    </time>
                                </footer>
                            </motion.article>
                        ))}
                    </div>
                )}
            </section>

            {/* Submission Form */}
            <section id="story-form" className="relative py-16 md:py-24 px-4 overflow-hidden mt-8 md:mt-16">
                <Image
                    src="/images/Form/form bg.jpeg"
                    alt=""
                    fill
                    className="object-cover"
                    sizes="100vw"
                />
                <motion.div
                    className="relative z-10 max-w-[700px] mx-auto bg-white/30 backdrop-blur-sm border border-white/40 rounded-2xl px-8 md:px-16 py-12 md:py-16 shadow-xl"
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                >
                    <div className="text-center">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                            className="font-accent text-[clamp(40px,5.5vw,66px)] text-burgundy-dark tracking-tight leading-[0.9]"
                        >
                            Share Your
                        </motion.h2>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                            className="font-accent italic text-[clamp(48px,6.5vw,78px)] text-accent-pink tracking-tight leading-[0.9]"
                        >
                            Story.
                        </motion.h2>
                    </div>
                    <div className="flex justify-center mt-6">
                        <CommunityStoryForm />
                    </div>
                </motion.div>
            </section>
        </div>
    )
}
