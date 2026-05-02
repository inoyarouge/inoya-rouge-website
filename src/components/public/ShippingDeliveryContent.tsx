'use client'

import React, { useEffect, useState, useRef } from 'react'
import { Calendar, Search, Truck, AlertCircle, CreditCard, Clock } from 'lucide-react'
import SmoothWavyCanvas from '@/components/SmoothWavyCanvas'

const sections = [
    {
        id: 'processing-time',
        number: '01',
        title: 'Processing Time',
        icon: <Clock className="w-6 h-6 text-brand-rose" strokeWidth={1.5} />,
        body: (
            <div className="space-y-4">
                <p>Orders are typically processed within 1–3 business days after payment confirmation. During peak periods or promotional campaigns, processing time may vary.</p>
            </div>
        )
    },
    {
        id: 'delivery-timeline',
        number: '02',
        title: 'Delivery Timeline',
        icon: <Calendar className="w-6 h-6 text-brand-rose" strokeWidth={1.5} />,
        body: (
            <div className="space-y-4">
                <p>Delivery timelines depend on the destination location and logistics partner. In most cases, orders are delivered within 3–7 business days across India.</p>
            </div>
        )
    },
    {
        id: 'shipping-charges',
        number: '03',
        title: 'Shipping Charges',
        icon: <CreditCard className="w-6 h-6 text-brand-rose" strokeWidth={1.5} />,
        body: (
            <div className="space-y-4">
                <p>Shipping charges, if applicable, will be displayed during the checkout process before completing the purchase.</p>
            </div>
        )
    },
    {
        id: 'delivery-partners',
        number: '04',
        title: 'Delivery Partners',
        icon: <Truck className="w-6 h-6 text-brand-rose" strokeWidth={1.5} />,
        body: (
            <div className="space-y-4">
                <p>Orders are shipped through trusted courier and logistics providers to ensure safe delivery.</p>
            </div>
        )
    },
    {
        id: 'order-tracking',
        number: '05',
        title: 'Order Tracking',
        icon: <Search className="w-6 h-6 text-brand-rose" strokeWidth={1.5} />,
        body: (
            <div className="space-y-4">
                <p>Once your order has been dispatched, you will receive a tracking number through email or SMS to monitor the shipment status.</p>
            </div>
        )
    },
    {
        id: 'delivery-issues',
        number: '06',
        title: 'Delivery Issues',
        icon: <AlertCircle className="w-6 h-6 text-brand-rose" strokeWidth={1.5} />,
        body: (
            <div className="space-y-4">
                <p>If a package is delayed, damaged, or lost during transit, please contact our support team so we can assist in resolving the issue.</p>
            </div>
        )
    }
]

export default function ShippingDeliveryContent() {
    const [activeSection, setActiveSection] = useState<string>('processing-time')
    const sectionRefs = useRef<(HTMLElement | null)[]>([])

    useEffect(() => {
        const handleScroll = () => {
            const offsets = sectionRefs.current.map((ref) => {
                if (!ref) return { id: '', offset: Infinity }
                const rect = ref.getBoundingClientRect()
                return {
                    id: ref.id,
                    offset: Math.abs(rect.top - 150),
                }
            })

            if (offsets.length > 0) {
                const closest = offsets.reduce((prev, curr) => (prev.offset < curr.offset ? prev : curr))
                if (closest.id) {
                    setActiveSection(closest.id)
                }
            }
        }

        handleScroll()
        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id)
        if (element) {
            const offset = 100
            const bodyRect = document.body.getBoundingClientRect().top
            const elementRect = element.getBoundingClientRect().top
            const elementPosition = elementRect - bodyRect
            const offsetPosition = elementPosition - offset

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            })
        }
    }

    return (
        <div className="w-full">
            {/* Hero Banner Section */}
            <div className="relative w-full overflow-hidden bg-[#faf2ef] py-20 lg:py-28">
                <SmoothWavyCanvas
                    backgroundColor="#faf2ef"
                    primaryColor="199, 54, 95"
                    secondaryColor="122, 0, 0"
                    accentColor="250, 235, 229"
                    lineOpacity={0.6}
                    animationSpeed={0.003}
                />
                <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-pink-200/50 to-transparent rounded-bl-full" />
                    <div className="absolute bottom-0 left-0 w-1/3 h-2/3 bg-gradient-to-t from-brand-rose/10 to-transparent rounded-tr-full" />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 lg:px-12 flex flex-col items-center justify-center">
                    <div className="w-full flex flex-col items-center text-center">
                        <h1 className="font-serif font-normal text-5xl md:text-6xl lg:text-7xl text-burgundy mb-4">
                            Shipping & Delivery
                        </h1>
                        <h2 className="text-xl md:text-2xl font-sans font-light text-gray-800">
                            Swiftly Delivered, Beautifully Packed.
                        </h2>
                    </div>
                </div>
            </div>

            {/* Main Content Layout */}
            <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-16 flex flex-col lg:flex-row gap-12 lg:gap-20">

                {/* Left Sidebar */}
                <div className="w-full lg:w-1/4 flex-shrink-0">
                    <div className="sticky top-28">
                        <h3 className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-6 font-sans">
                            In This Policy
                        </h3>

                        <nav className="flex flex-col space-y-1 mb-10">
                            {sections.map((section) => (
                                <button
                                    key={section.id}
                                    onClick={() => scrollToSection(section.id)}
                                    className={`text-left px-4 py-3 rounded-md transition-all duration-200 text-sm font-medium ${activeSection === section.id
                                        ? 'bg-brand-rose/10 border-l-2 border-brand-rose text-burgundy'
                                        : 'text-gray-500 hover:text-burgundy hover:bg-gray-50 border-l-2 border-transparent'
                                        }`}
                                >
                                    {section.number}. {section.title}
                                </button>
                            ))}
                        </nav>
                    </div>
                </div>

                {/* Right Content */}
                <div className="w-full lg:w-3/4">
                    <div className="mb-12 pb-8 border-b border-gray-200">
                        <h2 className="font-serif text-3xl text-burgundy mb-4">Introduction</h2>
                        <p className="text-gray-600 leading-relaxed mb-4">
                            At <span className="font-medium text-burgundy">Inoya Rouge</span>, we aim to deliver your orders safely and efficiently.
                        </p>
                        <p className="text-gray-600 leading-relaxed mb-4">
                            We value your trust and strive to ensure a smooth and satisfying shopping experience with us. Below you will find all the details regarding our shipping processes, timelines, and more.
                        </p>
                        <p className="text-burgundy font-medium">
                            This Shipping & Delivery Policy covers the following areas:
                        </p>
                    </div>

                    <div className="space-y-12">
                        {sections.map((section, idx) => (
                            <section
                                key={section.id}
                                id={section.id}
                                ref={(el) => {
                                    sectionRefs.current[idx] = el;
                                }}
                                className="scroll-mt-32"
                            >
                                <div className="flex bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                                    <div className="hidden sm:flex w-16 flex-shrink-0 flex-col items-center pt-1">
                                        <div className="w-12 h-12 rounded-full border border-brand-rose/20 bg-brand-rose/5 flex items-center justify-center mb-2 text-brand-rose">
                                            {section.icon}
                                        </div>
                                    </div>

                                    <div className="flex-grow sm:ml-4">
                                        <h3 className="font-serif text-2xl text-burgundy mb-4 flex items-center flex-wrap">
                                            <span className="text-brand-rose mr-2 font-sans font-medium text-lg">
                                                {section.number}.
                                            </span>
                                            {section.title}
                                        </h3>
                                        <div className="text-gray-600 text-[15px] leading-relaxed">
                                            {section.body}
                                        </div>
                                    </div>

                                </div>
                            </section>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
