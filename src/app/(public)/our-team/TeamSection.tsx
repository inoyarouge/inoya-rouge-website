"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import SmoothWavyCanvas from "@/components/SmoothWavyCanvas"

const team = [
  {
    name: "Mrs. Anju Bajaj",
    role: "Founder",
    bio: "Anju Bajaj is a passionate entrepreneur with a natural flair for business and a warm, people-centric approach. Her belief in simplicity, authenticity, and skin-friendly care inspired her to co-found Inoya Rouge — a brand that bridges traditional and modern beauty through the richness of Indian botanicals and thoughtfully crafted products, embracing a more effortless and authentic approach to beauty.",
  },
  {
    name: "Ms. Urvi Kanodia",
    role: "Founder",
    bio: "Urvi Kanodia is a Company Secretary with years of experience in corporate compliance, legal frameworks and strategic advisory. Driven by precision in her professional life and her personal journey with sensitive skin and preference for simple, gentle beauty, she was inspired to create a beauty brand rooted in simplicity, care, and authenticity. That desire, together with the shared passion and dedication of her best friend and partner in this journey, co-created Inoya Rouge, a brand that bridges traditional and modern beauty by reintroducing the richness of Indian botanicals into thoughtfully crafted products that represent not just cosmetics, but a more thoughtful, effortless and authentic approach to beauty.",
  },
  {
    name: "Mrs. Komal Bajaj Bhotika",
    role: "Financial Consultant",
    bio: "Komal Bajaj Bhotika is a Chartered Accountant and Company Secretary serving as the Marketing Lead and Chief Financial Advisor for Inoya Rouge. Bringing over a decade of financial expertise, she manages capital allocation, pricing structures, and financial forecasting to drive profitable growth. Simultaneously, she leads market expansion, digital strategy, and customer acquisition to build brand equity. Her balance of strict financial discipline and market-driven strategy ensures every creative initiative scales sustainably.",
  },
  {
    name: "Ms. Shreshtha Ganguly",
    role: "Digital Media Head",
    bio: "",
  },
]

export default function TeamSection() {
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 })
  const [isHoveringCard, setIsHoveringCard] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  useEffect(() => {
    if (selectedIndex === null) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedIndex(null)
    }
    window.addEventListener("keydown", handler)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      window.removeEventListener("keydown", handler)
      document.body.style.overflow = prevOverflow
    }
  }, [selectedIndex])

  const selectedMember = selectedIndex !== null ? team[selectedIndex] : null

  return (
    <section className="relative bg-cream py-20 md:py-32 overflow-hidden">
      <SmoothWavyCanvas
        backgroundColor="#fff8f6"
        primaryColor="199, 54, 95"
        secondaryColor="122, 0, 0"
        accentColor="250, 235, 229"
        lineOpacity={0.6}
        animationSpeed={0.003}
      />
      <div className="relative z-10 max-w-6xl 2xl:max-w-[1400px] mx-auto px-6 sm:px-10">
        <div className="text-center mb-16 md:mb-24 flex flex-col items-center">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-burgundy text-4xl sm:text-5xl md:text-[54px] leading-none tracking-tight"
          >
            Our Team
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="font-sans text-xl sm:text-2xl md:text-3xl text-black mt-4 max-w-2xl leading-snug"
          >
            The people behind it all
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6 lg:gap-8">
          {team.map((member, index) => {
            const initials = member.name
              .split(" ")
              .filter(n => n !== "Mrs." && n !== "Ms.")
              .map((n) => n[0])
              .join("")
              .slice(0, 2);

            return (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{
                  duration: 0.8,
                  delay: index * 0.15,
                  ease: [0.16, 1, 0.3, 1]
                }}
                onMouseEnter={() => setIsHoveringCard(true)}
                onMouseLeave={() => setIsHoveringCard(false)}
                onMouseMove={(e) => setCursorPos({ x: e.clientX, y: e.clientY })}
                onClick={() => setSelectedIndex(index)}
                className="group bg-gradient-to-br from-[#FFFBF9] to-[#FFF0EB] rounded-none p-6 md:p-8 flex items-center shadow-[0_8px_40px_-4px_rgba(114,11,11,0.08)] border border-burgundy/15 hover:shadow-[0_16px_50px_-4px_rgba(114,11,11,0.12)] hover:-translate-y-2 transition-all duration-500 ease-out cursor-pointer"
              >
                <div className="w-20 h-20 md:w-24 md:h-24 shrink-0 rounded-full bg-[#7a0000] flex items-center justify-center font-display text-2xl md:text-3xl text-cream font-medium group-hover:scale-110 transition-all duration-500 ease-out shadow-inner">
                  {initials}
                </div>
                
                <div className="ml-6 flex flex-col">
                  <h3 className="font-display text-burgundy text-xl md:text-2xl font-semibold group-hover:translate-x-1 transition-transform duration-500 ease-out">
                    {member.name}
                  </h3>
                  <p className="font-sans text-burgundy/70 text-sm md:text-base mt-1 group-hover:translate-x-1 transition-transform duration-500 ease-out delay-75">
                    {member.role}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {isHoveringCard && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="pointer-events-none fixed z-50 w-12 h-12 rounded-full bg-[#7a0000]/90 flex items-center justify-center"
            style={{
              left: cursorPos.x,
              top: cursorPos.y,
              transform: "translate(-50%, -50%)",
            }}
          >
            <span className="font-sans text-[10px] tracking-wide uppercase text-cream">
              Click
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedMember && (
          <motion.div
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setSelectedIndex(null)}
            role="presentation"
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="team-member-name"
              initial={{ opacity: 0, scale: 0.94, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 12 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto bg-gradient-to-br from-[#FFFBF9] to-[#FFF0EB] border border-burgundy/15 shadow-[0_16px_60px_-4px_rgba(114,11,11,0.2)] p-8 md:p-10"
            >
              <button
                type="button"
                onClick={() => setSelectedIndex(null)}
                aria-label="Close"
                className="absolute top-4 right-4 text-burgundy/60 hover:text-burgundy text-2xl leading-none w-8 h-8 flex items-center justify-center"
              >
                ×
              </button>

              <div className="flex items-center mb-6">
                <div className="w-20 h-20 md:w-24 md:h-24 shrink-0 rounded-full bg-[#7a0000] flex items-center justify-center font-display text-2xl md:text-3xl text-cream font-medium shadow-inner">
                  {selectedMember.name
                    .split(" ")
                    .filter((n) => n !== "Mrs." && n !== "Ms.")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)}
                </div>
                <div className="ml-6 flex flex-col">
                  <h3
                    id="team-member-name"
                    className="font-display text-burgundy text-xl md:text-2xl font-semibold"
                  >
                    {selectedMember.name}
                  </h3>
                  <p className="font-sans text-burgundy/70 text-sm md:text-base mt-1">
                    {selectedMember.role}
                  </p>
                </div>
              </div>

              <p className="font-sans text-[15px] md:text-base text-gray-700 leading-relaxed">
                {selectedMember.bio || "Bio coming soon."}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

