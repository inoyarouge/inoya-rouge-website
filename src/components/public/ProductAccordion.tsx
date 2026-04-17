'use client'

import { useState } from 'react'

interface AccordionItem {
  title: string
  content: string
}

export default function ProductAccordion({ items }: { items: AccordionItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  if (items.length === 0) return null

  return (
    <div className="divide-y divide-gray-200 border-t border-b border-gray-200">
      {items.map((item, i) => (
        <div key={item.title}>
          <button
            type="button"
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className="w-full flex items-center justify-between py-5 min-h-[44px] text-left group"
          >
            <span className="text-xs uppercase tracking-[0.15em] font-medium text-gray-800">
              {item.title}
            </span>
            <span className="text-xl leading-none text-gray-400 group-hover:text-gray-600 transition-colors ml-4 flex-shrink-0">
              {openIndex === i ? '\u2212' : '+'}
            </span>
          </button>
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              openIndex === i ? 'max-h-96 pb-5' : 'max-h-0'
            }`}
          >
            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
              {item.content}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
