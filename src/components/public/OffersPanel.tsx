'use client'

import type { Offer } from '@/lib/types'
import { Tag, Check } from 'lucide-react'
import { formatINR } from '@/lib/pricing'

function formatEndDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function OffersPanel({
  offers,
  appliedOfferIds,
  onToggle,
  savings,
}: {
  offers: Offer[]
  appliedOfferIds: string[]
  onToggle: (offerId: string) => void
  savings: number
}) {
  if (offers.length === 0) {
    return (
      <div className="border border-gray-200 p-4 text-sm text-gray-500 text-center">
        No active offers at this time.
      </div>
    )
  }

  const appliedCount = appliedOfferIds.length

  return (
    <div className="border border-gray-200">
      {appliedCount > 0 && (
        <div className="flex items-center justify-between px-4 py-2 bg-burgundy/5 border-b border-gray-100 text-[12px] text-burgundy">
          <span className="uppercase tracking-[0.1em]">
            {appliedCount} offer{appliedCount > 1 ? 's' : ''} applied
          </span>
          <span className="font-medium">Save {formatINR(savings)}</span>
        </div>
      )}
      <div className="divide-y divide-gray-100">
        {offers.map((offer) => {
          const isApplied = appliedOfferIds.includes(offer.id)
          return (
            <div
              key={offer.id}
              className="flex items-start justify-between gap-3 p-4"
            >
              <div className="flex items-start gap-3 min-w-0">
                <Tag size={16} className="text-burgundy shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <div className="text-sm font-medium text-gray-900 break-words">
                    {offer.label}
                  </div>
                  {offer.endsAt && (
                    <div className="text-xs text-gray-500 mt-0.5">
                      Valid until {formatEndDate(offer.endsAt)}
                    </div>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={() => onToggle(offer.id)}
                aria-pressed={isApplied}
                title={isApplied ? 'Tap to remove this offer' : 'Apply this offer'}
                className={`group/btn shrink-0 text-[11px] uppercase tracking-[0.15em] px-3 py-2 border ${isApplied
                    ? 'border-burgundy bg-burgundy text-white'
                    : 'border-gray-300 text-burgundy hover:border-burgundy hover:bg-burgundy/5 transition-colors'
                  }`}
              >
                <span className="relative inline-block after:absolute after:-bottom-0.5 after:left-0 after:h-[1px] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-current after:transition-transform after:duration-500 group-hover/btn:after:origin-bottom-left group-hover/btn:after:scale-x-100">
                  {isApplied ? (
                    <span className="inline-flex items-center gap-1">
                      <Check size={12} /> Applied
                    </span>
                  ) : (
                    'Apply Offer'
                  )}
                </span>
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
