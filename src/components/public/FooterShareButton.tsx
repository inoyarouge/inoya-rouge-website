'use client'

import Image from 'next/image'

export default function FooterShareButton() {
  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault()
    try {
      if (typeof navigator !== 'undefined' && navigator.share) {
        await navigator.share({
          title: 'Inoya Rouge',
          url: window.location.origin,
        })
      } else {
        await navigator.clipboard.writeText(window.location.origin)
        alert('Link copied to clipboard!')
      }
    } catch (err) {
      console.log('Error sharing:', err)
    }
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      aria-label="Share"
      className="relative w-[20px] h-[21px] block tap-highlight-transparent"
    >
      <Image
        src="/images/icons/share.svg"
        alt="Share"
        fill
        sizes="20px"
        className="object-contain opacity-60 hover:opacity-100 transition-opacity duration-300"
      />
    </button>
  )
}
