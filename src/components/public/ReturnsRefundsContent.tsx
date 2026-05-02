'use client'

import React, { useEffect, useState, useRef } from 'react'
import { RefreshCw, CheckCircle, XCircle, CreditCard, FileText } from 'lucide-react'
import SmoothWavyCanvas from '@/components/SmoothWavyCanvas'
import Link from 'next/link'

const sections = [
    {
        id: 'returns-exchange',
        number: '01',
        title: 'Returns & Exchange',
        icon: <RefreshCw className="w-6 h-6 text-brand-rose" strokeWidth={1.5} />,
        body: (
            <div className="space-y-4">
                <p>We follow a no return / no exchange policy once the product has been opened or used.</p>
                <p>Returns or exchanges are accepted only if:</p>
                <ul className="list-disc pl-5 space-y-2">
                    <li>The product is unused, and</li>
                    <li>If you have received missing/wrong/expired/damaged condition, or</li>
                    <li>There is a packaging defect/damage.</li>
                </ul>
                <p>Any such concern must be reported within 24 hours of receiving the order by contacting our customer care team with supporting details/images.</p>
                <p>Please allow us upto 2 Working days to address the issue. However, we will try to address the issue on the same day.</p>
                <p>Please note that the exchanges will depend upon the Stock availability.</p>
            </div>
        )
    },
    {
        id: 'conditions-return-replacement',
        number: '02',
        title: 'Eligibility for Return/Replacement',
        icon: <CheckCircle className="w-6 h-6 text-brand-rose" strokeWidth={1.5} />,
        body: (
            <div className="space-y-4">
                <p>Under what conditions can I return/ replace my product?</p>
                <ul className="list-disc pl-5 space-y-2">
                    <li>Wrong product delivered</li>
                    <li>Expired product delivered</li>
                    <li>Damaged product delivered – Physical damage/ tampered product or packaging</li>
                    <li>Incomplete order – missing products</li>
                </ul>
            </div>
        )
    },
    {
        id: 'non-returnable',
        number: '03',
        title: 'Non-Returnable Conditions',
        icon: <XCircle className="w-6 h-6 text-brand-rose" strokeWidth={1.5} />,
        body: (
            <div className="space-y-4">
                <p>Under what conditions return/ replacement requests will not be accepted?</p>
                <ul className="list-disc pl-5 space-y-2">
                    <li>Opened/ used/ altered products.</li>
                    <li>Original packaging (mono cartons, labels, original invoice, etc.) missing.</li>
                    <li>The wrong/damaged/missing/expired product is reported after 48 hours from the date of delivery.</li>
                </ul>
            </div>
        )
    },
    {
        id: 'refunds',
        number: '04',
        title: 'Refunds',
        icon: <CreditCard className="w-6 h-6 text-brand-rose" strokeWidth={1.5} />,
        body: (
            <div className="space-y-4">
                <p>Once approved, refunds will be processed to the original mode of payment.</p>
                <p>Refunds may take 7–10 working days to reflect in your account, depending on your bank/payment provider.</p>
                <p>Please note that the Shipping Cost will not be refunded.</p>
                <p className="text-sm italic text-gray-500">*Refund based on the total amount originally paid for the product, including any reductions in price due to the use of discounts or credits.</p>
            </div>
        )
    },
    {
        id: 'terms-and-conditions',
        number: '05',
        title: 'Terms and Conditions',
        icon: <FileText className="w-6 h-6 text-brand-rose" strokeWidth={1.5} />,
        body: (
            <div className="space-y-4">
                <ol className="list-decimal pl-5 space-y-2">
                    <li>All returned items must be accompanied by a copy of the original invoice.</li>
                    <li>Each item can only be exchanged once.</li>
                    <li>Shipping costs will not be refunded.</li>
                    <li>All gifts or promotional items received with your purchase must be returned with your order.</li>
                    <li>If the return complies with our return and exchange policy, we will give you a case basis refund of the purchase price paid or you can exchange the product for a product of the same or lesser value.</li>
                    <li>Please note: Although we have tried to accurately show the actual color of the products, there may be a slight variation based on the operating system you are using.</li>
                    <li>Inoya Rouge will not accept the return of products without a relevant customer invoice and Product Return Form.</li>
                </ol>
                <p className="font-medium mt-4">This policy does not apply to products that have been intentionally damaged or misused.</p>

                <div className="mt-8 pt-6 border-t border-brand-rose/20">
                    <p className="mb-4">If you would like to initiate a hassle-free return please click on the link below:</p>
                    <Link
                        href="mailto:inoyarouge@gmail.com"
                        className="group/btn relative overflow-hidden inline-flex items-center justify-center bg-burgundy text-[15px] tracking-wide text-[#fff8f6] py-3 px-8 rounded-none"
                    >
                        <span className="absolute top-0 -left-[100%] w-[60%] h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-25deg] transition-all duration-[800ms] ease-in-out group-hover/btn:left-[200%]" />
                        <span className="relative z-10">
                            Initiate Return
                        </span>
                    </Link>
                </div>
            </div>
        )
    }
]

export default function ReturnsRefundsContent() {
    const [activeSection, setActiveSection] = useState<string>('returns-exchange')
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
                            Returns & Refunds
                        </h1>
                        <h2 className="text-xl md:text-2xl font-sans font-light text-gray-800">
                            Hassle-Free and Customer Centric
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
                            At <span className="font-medium text-burgundy">Inoya Rouge</span>, we believe in Customer Satisfaction by bringing carefully chosen high quality products manufactured with utmost purity and natural ingredients. We take utmost care in ensuring that every product reaches you in perfect condition.
                        </p>
                        <p className="text-burgundy font-medium mt-6">
                            This Returns & Refunds Policy covers the following areas:
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
