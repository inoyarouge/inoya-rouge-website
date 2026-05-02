'use client'

import { motion } from 'framer-motion'

export default function OurStoryBanner() {
  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-10"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="font-display text-burgundy text-4xl sm:text-5xl md:text-[54px] leading-none tracking-tight"
      >
        About Us
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        className="font-sans text-xl sm:text-2xl md:text-3xl text-black mt-4 max-w-2xl leading-snug"
      >
        Beauty should never come <br />
        at the cost of your skin
      </motion.p>
      <motion.button
        onClick={() => {
          document.getElementById('our-story')?.scrollIntoView({ behavior: 'smooth' });
        }}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="group/btn relative overflow-hidden inline-flex items-center justify-center bg-burgundy text-white font-sans text-[12px] uppercase tracking-widest px-10 min-h-[46px] mt-6 cursor-pointer"
      >
        <span className="absolute top-0 -left-[100%] w-[60%] h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-25deg] transition-all duration-[800ms] ease-in-out group-hover/btn:left-[200%]" />
        <span className="relative z-10">OUR STORY</span>
      </motion.button>
    </motion.div>
  )
}
