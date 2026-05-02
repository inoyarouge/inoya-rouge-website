'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Suspense } from 'react'
import { Phone, Mail } from 'lucide-react'
import { motion } from 'framer-motion'

const InstagramIcon = ({ className, strokeWidth = 1.5 }: { className?: string, strokeWidth?: number }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
    </svg>
)

const contacts = [
    {
        label: 'Phone',
        value: '9836048717',
        href: 'tel:+919836048717',
        note: 'Monday to Friday (10-6)',
        icon: <Phone className="w-6 h-6" strokeWidth={1.5} />,
    },
    {
        label: 'Email',
        value: 'inoyarouge@gmail.com',
        href: 'mailto:inoyarouge@gmail.com',
        note: 'We typically respond within 24 hours',
        icon: <Mail className="w-6 h-6" strokeWidth={1.5} />,
    },
    {
        label: 'Instagram',
        value: '@inoyarouge',
        href: 'https://www.instagram.com/inoyarouge/',
        note: 'Follow us for updates',
        icon: <InstagramIcon className="w-6 h-6" strokeWidth={1.5} />,
    },
]

export default function ContactClient({
    promotionBanner,
    communityStoryForm,
    testimonialList
}: {
    promotionBanner: React.ReactNode
    communityStoryForm: React.ReactNode
    testimonialList: React.ReactNode
}) {
    return (
        <div className="bg-[#fffcfb] min-h-screen w-full">
            {promotionBanner}

            {/* Hero Banner Section */}
            <div className="relative w-full overflow-hidden bg-[#faf2ef] py-20 lg:py-28 lg:min-h-[60vh] flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, ease: 'easeInOut' }}
                    className="absolute inset-0"
                >
                    <Image
                        src="/images/contact us/contct us.jpeg"
                        alt="Contact Us Background"
                        fill
                        className="object-cover"
                        sizes="100vw"
                        priority
                    />
                    <div className="absolute inset-0 pointer-events-none" style={{ backdropFilter: 'blur(1px)' }} />
                </motion.div>

                <motion.div
                    className="relative z-20 max-w-7xl mx-auto px-4 md:px-8 lg:px-12 flex flex-col items-center justify-center"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                >
                    <div className="w-full flex flex-col items-center text-center">
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            className="font-serif font-normal text-5xl md:text-6xl lg:text-7xl text-burgundy mb-2"
                        >
                            Contact Us
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                            className="text-xl md:text-2xl font-sans font-light text-slate-800"
                        >
                            We&apos;d love to hear from you.
                        </motion.p>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                            className="mt-8"
                        >
                            <Link
                                href="mailto:inoyarouge@gmail.com"
                                className="group/btn relative overflow-hidden inline-flex items-center justify-center bg-burgundy text-white font-sans text-[13px] uppercase tracking-wider px-12 py-[14px]"
                            >
                                <span className="absolute top-0 -left-[100%] w-[60%] h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-25deg] transition-all duration-[800ms] ease-in-out group-hover/btn:left-[200%]" />
                                <span className="relative z-10 flex items-center justify-center gap-2">
                                    WRITE TO US
                                </span>
                            </Link>
                        </motion.div>
                    </div>
                </motion.div>
            </div>

            {/* Main Content Layout */}
            <div className="max-w-5xl mx-auto px-4 md:px-8 lg:px-12 py-20">
                <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-200">
                    {contacts.map((c, idx) => (
                        <motion.div
                            key={c.label}
                            className="py-10 md:px-8 flex flex-col items-center text-center group"
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.6, delay: 0.1 * idx, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <div className="w-14 h-14 rounded-full border border-brand-rose/20 bg-brand-rose/5 flex items-center justify-center text-brand-rose mb-6 transition-transform duration-300 group-hover:scale-110">
                                {c.icon}
                            </div>
                            <h2 className="font-serif text-2xl text-burgundy mb-4">{c.label}</h2>
                            {c.href ? (
                                <Link
                                    href={c.href}
                                    className="text-brand-rose font-medium hover:underline text-lg min-h-[28px] inline-flex items-center"
                                    {...(c.label === 'Instagram' ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                                >
                                    {c.value}
                                </Link>
                            ) : (
                                <p className="text-gray-700 font-medium text-lg min-h-[28px] flex items-center">{c.value}</p>
                            )}
                            <p className="text-gray-500 text-sm mt-3">{c.note}</p>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Community Story — form with bg image */}
            <section className="relative py-16 md:py-24 px-4 overflow-hidden">
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
                            Your Shade,
                        </motion.h2>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                            className="font-accent italic text-[clamp(48px,6.5vw,78px)] text-accent-pink tracking-tight leading-[0.9]"
                        >
                            Your Story.
                        </motion.h2>
                    </div>
                    <div className="flex justify-center mt-8 md:mt-10">
                        {communityStoryForm}
                    </div>
                </motion.div>
            </section>

            {/* Testimonials */}
            <section className="bg-cream pb-12 md:pb-20 px-4 pt-16">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                >
                    <Suspense fallback={null}>
                        {testimonialList}
                    </Suspense>
                </motion.div>
            </section>
        </div>
    )
}
