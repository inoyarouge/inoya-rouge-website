'use client'

import React, { useEffect, useState, useRef } from 'react'
import { Calendar, Shield, User, ShoppingBag, Users, Cookie, Lock, Eye, CheckCircle, Link as LinkIcon, Edit3, Mail } from 'lucide-react'
import SmoothWavyCanvas from '@/components/SmoothWavyCanvas'

const sections = [
    {
        id: 'information-we-collect',
        number: '01',
        title: 'Information We Collect',
        icon: <User className="w-6 h-6 text-brand-rose" strokeWidth={1.5} />,
        body: (
            <div className="space-y-4">
                <p>When you interact with our Website or purchase products from us, we may collect certain personal and technical information. Personal information may include details such as:</p>
                <ul className="list-disc pl-5 space-y-1">
                    <li>Name</li>
                    <li>Email address</li>
                    <li>Phone number</li>
                    <li>Billing and shipping address</li>
                    <li>Payment information required to process orders</li>
                </ul>
                <p>This information is typically provided when you create an account, subscribe to newsletters or promotional communications, place an order, contact our customer service team, or participate in promotions or surveys.</p>
                <p>We may also automatically collect technical information about your device and browsing activity, including your IP address, browser type, device type, operating system, and pages visited on the Website.</p>
            </div>
        )
    },
    {
        id: 'cookies-tracking',
        number: '02',
        title: 'Cookies & Tracking Technologies',
        icon: <Cookie className="w-6 h-6 text-brand-rose" strokeWidth={1.5} />,
        body: (
            <div className="space-y-4">
                <p>We use a small number of strictly necessary cookies provided by our authentication and hosting platform (Supabase) to keep the site functioning and to secure admin sessions. These cookies do not track your activity across other websites and are not used for advertising.</p>
                <p>We do not use analytics, advertising, or third-party tracking cookies on this Website. We do not share visitor data with third parties for marketing purposes.</p>
                <p>You may also notice a one-time notice at the bottom of the page on your first visit, and a temporary flag if you dismiss our promotional banner — these are stored in your browser only and clear when you close your tab or clear your browser data.</p>
                <p>You may adjust your browser settings to refuse cookies. Doing so will not affect your ability to browse our products, but the admin login area will not function without them.</p>
            </div>
        )
    },
    {
        id: 'use-of-information',
        number: '03',
        title: 'Use of Collected Information',
        icon: <ShoppingBag className="w-6 h-6 text-brand-rose" strokeWidth={1.5} />,
        body: (
            <div className="space-y-4">
                <p>The information we collect may be used for various purposes, including:</p>
                <ul className="list-disc pl-5 space-y-1">
                    <li>Processing and delivering orders</li>
                    <li>Responding to customer inquiries or requests</li>
                    <li>Managing user accounts</li>
                    <li>Improving our Website, services, and product offerings</li>
                    <li>Sending updates, promotional materials, or marketing communications</li>
                    <li>Conducting internal analysis and research</li>
                </ul>
                <p>Information collected may also be used to understand user preferences and enhance the overall customer experience.</p>
            </div>
        )
    },
    {
        id: 'third-party',
        number: '04',
        title: 'Third-Party Service Providers',
        icon: <Users className="w-6 h-6 text-brand-rose" strokeWidth={1.5} />,
        body: (
            <div className="space-y-4">
                <p>Inoya Rouge may engage trusted third-party service providers to assist with functions such as payment processing, logistics, marketing services, website hosting, analytics, or customer support.</p>
                <p>These service providers may have access to certain information necessary to perform their services but are required to handle such data in accordance with applicable privacy and confidentiality obligations.</p>
                <p>In some cases, these providers may use analytical tools to measure website performance or understand visitor behavior.</p>
            </div>
        )
    },
    {
        id: 'disclosure',
        number: '05',
        title: 'Disclosure of Information',
        icon: <Eye className="w-6 h-6 text-brand-rose" strokeWidth={1.5} />,
        body: (
            <div className="space-y-4">
                <p>We do <span className="font-medium text-burgundy">not sell or trade personal information</span> to external parties.</p>
                <p>However, information may be disclosed in limited situations, including:</p>
                <ul className="list-disc pl-5 space-y-1">
                    <li>To service providers assisting in business operations</li>
                    <li>To comply with legal obligations or regulatory requirements</li>
                    <li>To protect the rights, safety, or property of Inoya Rouge, its customers, or the public</li>
                    <li>In connection with a corporate transaction such as merger, restructuring, or acquisition</li>
                </ul>
                <p>Any sharing of information will occur only to the extent necessary and in accordance with applicable laws.</p>
            </div>
        )
    },
    {
        id: 'minors',
        number: '06',
        title: 'Information Relating to Minors',
        icon: <CheckCircle className="w-6 h-6 text-brand-rose" strokeWidth={1.5} />,
        body: (
            <div className="space-y-4">
                <p>Our Website and products are intended for use by individuals aged <span className="font-medium text-burgundy">18 years or older</span>.</p>
                <p>We do not knowingly collect personal information from children. If it is discovered that information from a minor has been submitted to us without appropriate consent, we will take steps to remove such information from our records.</p>
            </div>
        )
    },
    {
        id: 'managing-information',
        number: '07',
        title: 'Managing Your Information',
        icon: <Edit3 className="w-6 h-6 text-brand-rose" strokeWidth={1.5} />,
        body: (
            <div className="space-y-4">
                <p>Users may review, update, or correct certain personal information associated with their account at any time through their account settings or by contacting us.</p>
                <p>Users may also choose to unsubscribe from marketing communications by following the instructions provided in the communication or by contacting our support team.</p>
                <p>Certain communications related to transactions or account activity may still be sent as they are necessary for service delivery.</p>
            </div>
        )
    },
    {
        id: 'data-protection',
        number: '08',
        title: 'Data Protection and Security',
        icon: <Lock className="w-6 h-6 text-brand-rose" strokeWidth={1.5} />,
        body: (
            <div className="space-y-4">
                <p>We take reasonable administrative, technical, and physical measures to protect personal information against unauthorized access, misuse, or disclosure.</p>
                <p>Secure technologies and encryption protocols may be used where appropriate to protect sensitive information transmitted through our Website.</p>
                <p>Despite these precautions, no method of electronic storage or transmission can be guaranteed to be completely secure.</p>
            </div>
        )
    },
    {
        id: 'external-websites',
        number: '09',
        title: 'External Websites',
        icon: <LinkIcon className="w-6 h-6 text-brand-rose" strokeWidth={1.5} />,
        body: (
            <div className="space-y-4">
                <p>Our Website may contain links to third-party websites that are not operated or controlled by Inoya Rouge.</p>
                <p>We are not responsible for the privacy practices or content of such external websites. Users are encouraged to review the privacy policies of those websites before providing any personal information.</p>
            </div>
        )
    },
    {
        id: 'rights',
        number: '10',
        title: 'Your Rights and Choices',
        icon: <Shield className="w-6 h-6 text-brand-rose" strokeWidth={1.5} />,
        body: (
            <div className="space-y-4">
                <p>Depending on applicable laws, you may have the right to:</p>
                <ul className="list-disc pl-5 space-y-1">
                    <li>Request access to the personal information we hold about you</li>
                    <li>Request correction or updating of inaccurate information</li>
                    <li>Request deletion of certain personal information</li>
                    <li>Withdraw consent for specific uses of your data</li>
                </ul>
                <p>Requests regarding personal information may be submitted through the contact details provided below.</p>
            </div>
        )
    },
    {
        id: 'changes',
        number: '11',
        title: 'Changes to this Policy',
        icon: <Edit3 className="w-6 h-6 text-brand-rose" strokeWidth={1.5} />,
        body: (
            <div className="space-y-4">
                <p>Inoya Rouge may update this Privacy Policy periodically to reflect changes in business practices, legal requirements, or technological developments.</p>
                <p>Any revisions will be posted on this page, and the updated policy will take effect from the date it is published.</p>
            </div>
        )
    },
    {
        id: 'contact',
        number: '12',
        title: 'Contact Information',
        icon: <Mail className="w-6 h-6 text-brand-rose" strokeWidth={1.5} />,
        body: (
            <div className="space-y-4">
                <p>If you have any questions about this Privacy Policy, please contact us at:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <p className="font-medium text-burgundy">Email</p>
                        <a href="mailto:inoyarouge@gmail.com" className="text-brand-rose hover:underline">inoyarouge@gmail.com</a>
                    </div>
                    <div>
                        <p className="font-medium text-burgundy">Phone</p>
                        <a href="tel:9836048717" className="hover:text-brand-rose transition-colors duration-200">9836048717</a>
                    </div>
                    <div>
                        <p className="font-medium text-burgundy">Instagram</p>
                        <a href="https://www.instagram.com/inoyarouge/" target="_blank" rel="noopener noreferrer" className="text-brand-rose hover:underline">@inoyarouge</a>
                    </div>
                    <div>
                        <p className="font-medium text-burgundy">Operating Hours</p>
                        <p>Monday to Friday (10 AM - 6 PM)</p>
                    </div>
                </div>
            </div>
        )
    }
]

export default function PrivacyPolicyContent() {
    const [activeSection, setActiveSection] = useState<string>('information-we-collect')
    const sectionRefs = useRef<(HTMLElement | null)[]>([])

    useEffect(() => {
        const handleScroll = () => {
            // Find the first section that is visible enough
            const offsets = sectionRefs.current.map((ref) => {
                if (!ref) return { id: '', offset: Infinity }
                const rect = ref.getBoundingClientRect()
                // consider a section active if its top is near the top of the viewport
                return {
                    id: ref.id,
                    offset: Math.abs(rect.top - 150),
                }
            })

            const closest = offsets.reduce((prev, curr) => (prev.offset < curr.offset ? prev : curr))
            if (closest.id) {
                setActiveSection(closest.id)
            }
        }

        // Run once on mount to set initial
        handleScroll()

        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id)
        if (element) {
            // Offset for header/padding
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
                            Privacy Policy
                        </h1>
                        <h2 className="text-xl md:text-2xl font-sans font-light text-gray-800">
                            Your privacy matters to us.
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
                            At <span className="font-medium text-burgundy">Inoya Rouge Cosmetics Limited</span> <span className="font-medium text-burgundy">(&ldquo;Inoya Rouge&rdquo;, &ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;)</span>, we respect the privacy of individuals who visit our website (&ldquo;Website&rdquo;). This Privacy Policy explains how we collect, store, use, and protect information provided by users <span className="font-medium text-burgundy">(&ldquo;Users&rdquo;, &ldquo;you&rdquo;, or &ldquo;your&rdquo;)</span> when interacting with our Website, products, and services.
                        </p>
                        <p className="text-gray-600 leading-relaxed mb-4">
                            This policy outlines the types of information we collect, the reasons for collecting such information, the circumstances under which it may be shared, and the measures we take to safeguard it. It also explains your rights in relation to the personal information you provide to us and how you can contact us regarding privacy-related matters.
                        </p>
                        <p className="text-burgundy font-medium">
                            This Privacy Policy covers the following areas:
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
