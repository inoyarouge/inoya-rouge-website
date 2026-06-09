"use client"

import { motion } from "framer-motion"

const team = [
  {
    name: "Mrs. Anju Bajaj",
    role: "Founder",
  },
  {
    name: "Ms. Urvi Kanodia",
    role: "Founder",
  },
  {
    name: "Mrs. Komal Bajaj Bhotika",
    role: "Financial Consultant",
  },
  {
    name: "Ms. Shreshtha Ganguly",
    role: "Digital Media Head",
  },
]

export default function TeamSection() {
  return (
    <section className="bg-cream py-20 md:py-32 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 sm:px-10">
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
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
                className="group bg-white rounded-3xl p-6 md:p-8 flex items-center shadow-sm border border-burgundy/5 hover:shadow-xl hover:shadow-burgundy/5 hover:border-burgundy/20 hover:-translate-y-2 transition-all duration-500 ease-out"
              >
                <div className="w-20 h-20 md:w-24 md:h-24 shrink-0 rounded-full bg-cream flex items-center justify-center font-display text-2xl md:text-3xl text-burgundy font-medium group-hover:scale-110 group-hover:bg-burgundy group-hover:text-cream transition-all duration-500 ease-out shadow-inner">
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
    </section>
  )
}

