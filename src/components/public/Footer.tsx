import Link from 'next/link'
import Image from 'next/image'

const maisonLinks = [
  { href: '/our-story', label: 'Our Philosophy' },
  { href: '/our-story', label: 'Sustainability' },
  { href: '/our-story', label: 'The Atelier' },
]

const conciergeLinks = [
  { href: '/policies?tab=shipping', label: 'Shipping' },
  { href: '/policies?tab=returns', label: 'Returns' },
  { href: '/contact', label: 'Contact Us' },
]

const legalLinks = [
  { href: '/policies?tab=privacy', label: 'Privacy Policy' },
  { href: '/policies?tab=terms', label: 'Terms of Service' },
]

function FooterColumn({ heading, links, className = '' }: { heading: string; links: { href: string; label: string }[], className?: string }) {
  return (
    <div className={className}>
      <h3 className="font-display text-[12px] tracking-[3px] text-white/60 uppercase mb-4">
        {heading}
      </h3>
      <ul className="space-y-2">
        {links.map(link => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="font-sans text-[15px] text-white/60 hover:text-white py-1 inline-flex items-center transition-colors duration-300"
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
      <div className="max-w-[1440px] mx-auto px-8 md:px-12 pt-20 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-16">
          {/* Column 1: Brand */}
          <div className="lg:col-span-2 lg:pr-12">
            <h2 className="font-display text-[32px] lg:text-[36px] text-[#fff8f6] tracking-tight leading-tight">
              INOYA ROUGE
            </h2>
            <p className="font-accent italic text-[18px] text-white/60 tracking-tight mt-4 leading-snug">
              Inspired by nature, defined by colour
            </p>
            <div className="flex gap-5 items-center mt-8">
              <Link href="#" aria-label="Share" className="relative w-[13px] h-[14px] block">
                <Image src="/images/icons/share.svg" alt="" fill sizes="13px" className="object-contain opacity-60 hover:opacity-100 transition-opacity duration-300" />
              </Link>
              <Link href="mailto:hello@inoyarouge.com" aria-label="Email" className="relative w-[14px] h-[11px] block">
                <Image src="/images/icons/mail.svg" alt="" fill sizes="14px" className="object-contain opacity-60 hover:opacity-100 transition-opacity duration-300" />
              </Link>
            </div>
          </div>

          {/* Column 2: The Maison */}
          <FooterColumn heading="THE MAISON" links={maisonLinks} className="lg:col-span-1" />

          {/* Column 3: Concierge */}
          <FooterColumn heading="CONCIERGE" links={conciergeLinks} className="lg:col-span-1" />

          {/* Column 4: Legal */}
          <FooterColumn heading="LEGAL" links={legalLinks} className="lg:col-span-1" />
        </div>

        {/* Divider */}
        <div className="border-t border-white/20 mt-20 pt-6">
          <p className="font-display text-[11px] tracking-[3px] text-white/60 text-center">
            &copy; {new Date().getFullYear()} INOYA ROUGE &mdash; REFINED BEAUTY
          </p>
        </div>
      </div>
    </footer>
  )
}
