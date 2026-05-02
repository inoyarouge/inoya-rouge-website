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
    <section className="bg-cream py-20 md:py-32 border-t border-burgundy/10">
      <div className="max-w-5xl mx-auto px-6 sm:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-12 md:mb-16 text-center"
        >
          <h2 className="font-display text-burgundy text-4xl md:text-5xl lg:text-6xl">
            Our Team
          </h2>
        </motion.div>

        <div className="border-t-2 border-burgundy/20">
          {team.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col sm:flex-row sm:items-center justify-between py-8 md:py-12 border-b border-burgundy/20 hover:bg-burgundy/[0.02] transition-colors duration-300 px-4 -mx-4 sm:mx-0 sm:px-6"
            >
              <div className="mb-2 sm:mb-0 sm:w-1/3">
                <p className="font-sans text-sm md:text-base text-burgundy/60 uppercase tracking-[0.2em] font-semibold">
                  {member.role}
                </p>
              </div>
              <div className="sm:w-2/3 sm:text-right">
                <h3 className="font-display text-burgundy text-2xl md:text-4xl">
                  {member.name}
                </h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
