'use client'

import { useEffect, useState } from 'react'
import type { Promotion } from '@/lib/types'
import { X } from 'lucide-react'
import SmoothWavyCanvas from '@/components/SmoothWavyCanvas'

type TimeLeft = { days: number; hours: number; minutes: number; seconds: number }

function useCountdown(endsAt: string | null): TimeLeft | null {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null)

  useEffect(() => {
    if (!endsAt) return
    function tick() {
      const diff = new Date(endsAt!).getTime() - Date.now()
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        return
      }
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      })
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [endsAt])

  return timeLeft
}

function CountdownLabel({ timeLeft }: { timeLeft: TimeLeft }) {
  const hh = String(timeLeft.hours).padStart(2, '0')
  const mm = String(timeLeft.minutes).padStart(2, '0')
  const ss = String(timeLeft.seconds).padStart(2, '0')
  return (
    <>
      <span className="hidden sm:inline opacity-60">·</span>
      <span className="opacity-90 tabular-nums font-medium">
        {timeLeft.days > 0 && `${timeLeft.days}d `}{hh}h {mm}m {ss}s
      </span>
    </>
  )
}

export default function PromotionBanner({ promotion }: { promotion: Promotion }) {
  const [dismissed, setDismissed] = useState(true)
  const timeLeft = useCountdown(promotion.ends_at)

  useEffect(() => {
    const key = `promo_dismissed:${promotion.id}`
    const isDismissed = sessionStorage.getItem(key) === '1'
    setDismissed(isDismissed)
  }, [promotion.id])

  if (dismissed) return null

  const amount =
    promotion.discount_type === 'percent'
      ? `${promotion.discount_value}% off`
      : `₹${promotion.discount_value} off`
  const customMessage = promotion.description?.trim() || null

  function handleDismiss() {
    sessionStorage.setItem(`promo_dismissed:${promotion.id}`, '1')
    setDismissed(true)
  }

  return (
    <div className="relative z-40 mt-[50px] md:mt-[60px] text-white min-h-[36px] flex items-center py-2 transition-all duration-300 overflow-hidden bg-burgundy">
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        <SmoothWavyCanvas
          backgroundColor="#7a0000"
          primaryColor="199, 54, 95"
          secondaryColor="255, 248, 246"
          accentColor="122, 0, 0"
          lineOpacity={0.65}
        />
      </div>
      <div className="relative z-10 max-w-[1440px] mx-auto px-10 w-full text-center text-[12px] md:text-[13px] tracking-wide flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2">
        {customMessage ? (
          <>
            <span className="uppercase text-[10px] tracking-[0.12em] bg-white/15 px-2 py-0.5 rounded-sm">
              {promotion.name}
            </span>
            <span className="font-medium">{customMessage}</span>
            {timeLeft && <CountdownLabel timeLeft={timeLeft} />}
          </>
        ) : (
          <>
            <div className="flex items-center gap-2">
              <span className="font-medium">{promotion.name}</span>
              <span className="hidden sm:inline opacity-60">·</span>
            </div>
            <div className="flex items-center gap-2">
              <span>{amount} everything</span>
              {timeLeft && <CountdownLabel timeLeft={timeLeft} />}
            </div>
          </>
        )}
      </div>
      <button
        type="button"
        onClick={handleDismiss}
        aria-label="Dismiss"
        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-white/70 hover:text-white"
      >
        <X size={16} />
      </button>
    </div>
  )
}
