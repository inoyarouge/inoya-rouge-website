"use client"

import { useScroll, useTransform, motion } from "framer-motion"
import React, { useRef } from "react"

export default function ScrollRevealText({ text, className }: { text: string; className?: string }) {
  const container = useRef(null)
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start 0.55", "start 0.15"]
  })

  const words = text.split(" ")

  return (
    <p 
      ref={container}
      className={className || "font-display font-bold text-burgundy text-2xl sm:text-3xl md:text-4xl lg:text-[40px] leading-snug"}
    >
      {words.map((word, i) => {
        const start = i / words.length
        const end = start + (1 / words.length)
        return (
          <React.Fragment key={i}>
            <Word progress={scrollYProgress} range={[start, end]}>
              {word}
            </Word>
            {i < words.length - 1 && " "}
          </React.Fragment>
        )
      })}
    </p>
  )
}

const Word = ({ children, progress, range }: { children: string, progress: any, range: [number, number] }) => {
  const opacity = useTransform(progress, range, [0.15, 1])
  return (
    <motion.span style={{ opacity }}>
      {children}
    </motion.span>
  )
}
