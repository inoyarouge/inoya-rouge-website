import Link from 'next/link'
import Image from 'next/image'
import FooterShareButton from './FooterShareButton'

const maisonLinks = [
  { href: '/about-us', label: 'About Us' },
  { href: '/about-us#our-mission', label: 'Our Mission' },
  { href: '/about-us#clean-beauty-promise', label: 'Our Promise' },
]

const conciergeLinks = [
  { href: '/shipping-and-delivery', label: 'Shipping & Delivery' },
  { href: '/returns-and-refunds', label: 'Returns & Refunds' },
  { href: '/orders-and-payments', label: 'Orders & Payments' },
  { href: '/contact', label: 'Contact Us' },
]

const legalLinks = [
  { href: '/privacy-policy', label: 'Privacy Policy' },
  { href: '/product-information', label: 'Product Information' },
]

function FooterColumn({ heading, links, className = '' }: { heading: string; links: { href: string; label: string }[], className?: string }) {
  return (
    <div className={className}>
      <h3 className="font-display text-[11px] sm:text-[12px] tracking-[3px] sm:tracking-[4px] text-white/50 uppercase mb-5 sm:mb-6">
        {heading}
      </h3>
      <ul className="space-y-3 sm:space-y-4">
        {links.map(link => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="font-sans text-[15px] sm:text-[16px] md:text-[17px] text-white/70 hover:text-white py-1 inline-flex items-center transition-colors duration-300 leading-snug"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function Footer() {
  return (
    <footer className="bg-burgundy-red">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 md:px-16 pt-16 sm:pt-20 md:pt-24 pb-10 sm:pb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-16 xl:gap-20">

          {/* Column 1: Brand */}
          <div className="sm:col-span-2 lg:col-span-2 lg:pr-10 xl:pr-16">
            <h2 className="font-display text-[36px] sm:text-[40px] lg:text-[44px] text-[#fff8f6] tracking-tight leading-none">
              INOYA ROUGE
            </h2>
            <p className="font-accent italic text-[18px] sm:text-[19px] md:text-[20px] text-white/60 tracking-tight mt-4 sm:mt-5 leading-snug">
              Inspired by nature, defined by colour
            </p>
            <div className="flex gap-6 items-center mt-8 sm:mt-10">
              <FooterShareButton />
              <a href="mailto:inoyarouge@gmail.com" aria-label="Email" className="relative w-[22px] h-[17px] block">
                <Image src="/images/icons/mail.svg" alt="Email" fill sizes="22px" className="object-contain opacity-60 hover:opacity-100 transition-opacity duration-300" />
              </a>
              <a href="https://www.instagram.com/inoyarouge/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="opacity-60 hover:opacity-100 transition-opacity duration-300 text-white flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-instagram"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
              </a>
            </div>
          </div>

          {/* Column 2: Concierge */}
          <FooterColumn heading="CONCIERGE" links={conciergeLinks} className="lg:col-span-1" />

          {/* Column 3: The Maison */}
          <FooterColumn heading="THE MAISON" links={maisonLinks} className="lg:col-span-1" />

          {/* Column 4: Fine Print */}
          <FooterColumn heading="FINE PRINT" links={legalLinks} className="lg:col-span-1" />
        </div>

        {/* Divider + Copyright */}
        <div className="border-t border-white/20 mt-16 sm:mt-20 pt-7 sm:pt-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-display text-[12px] sm:text-[13px] tracking-[3px] sm:tracking-[4px] text-white/50 text-center sm:text-left">
            &copy; {new Date().getFullYear()} INOYA ROUGE
          </p>
          <p className="font-display text-[12px] sm:text-[13px] tracking-[3px] text-white/40 text-center sm:text-right">
            REFINED BEAUTY
          </p>
        </div>
      </div>
    </footer>
  )
}
