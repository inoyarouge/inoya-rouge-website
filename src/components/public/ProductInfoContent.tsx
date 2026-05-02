'use client'

import React from 'react'
import { FileText, Info } from 'lucide-react'
import SmoothWavyCanvas from '@/components/SmoothWavyCanvas'

export default function ProductInfoContent() {
    return (
        <div className="w-full flex-grow pb-16">
            {/* Hero Banner Section */}
            <div className="relative w-full overflow-hidden bg-[#faf2ef] py-20 lg:py-28 mb-12 lg:mb-16">
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
                        <h1 className="font-serif font-normal text-4xl md:text-5xl lg:text-6xl text-burgundy mb-4">
                            Product Information
                        </h1>
                        <h2 className="text-xl md:text-2xl font-sans font-light text-gray-800 mt-2">
                            Transparent in every detail.
                        </h2>
                    </div>
                </div>
            </div>

            {/* Main Content Card */}
            <div className="max-w-4xl mx-auto px-4 md:px-8">
                <div className="bg-white rounded-[2rem] p-10 md:p-16 shadow-sm border border-[#f5ece9] flex flex-col items-center text-center">

                    {/* Icon Circle */}
                    <div className="w-24 h-24 rounded-full bg-[#fcf5f3] flex items-center justify-center mb-10 relative">
                        <FileText className="w-10 h-10 text-burgundy" strokeWidth={1.5} />
                        <div className="absolute bottom-4 right-4 bg-white rounded-full">
                            <Info className="w-5 h-5 text-burgundy" strokeWidth={2} />
                        </div>
                    </div>

                    {/* Paragraph 1 */}
                    <p className="text-gray-600 leading-relaxed md:text-lg max-w-2xl font-sans mb-8 text-justify">
                        We strive to ensure that product descriptions, images, and pricing displayed on the website are accurate. However, minor variations may occur, particularly in color or packaging due to display settings or manufacturing updates.
                    </p>

                    {/* Diamond Divider */}
                    <div className="flex items-center justify-center w-full my-4">
                        <div className="w-16 border-t border-[#dfc3be]"></div>
                        <div className="w-2 h-2 rounded-sm border border-[#dfc3be] mx-3 rotate-45 flex-shrink-0"></div>
                        <div className="w-16 border-t border-[#dfc3be]"></div>
                    </div>

                    {/* Paragraph 2 */}
                    <p className="text-gray-600 leading-relaxed md:text-lg max-w-2xl font-sans mt-8 text-justify">
                        Inoya Rouge reserves the right to modify product details, pricing, or availability without prior notice.
                    </p>
                </div>
            </div>
        </div>
    )
}
