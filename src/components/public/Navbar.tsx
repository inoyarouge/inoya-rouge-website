import Link from 'next/link'
import Image from 'next/image'
import MobileNav from './MobileNav'
import AnchorLink from './AnchorLink'

const navLinks = [
  { href: '/', label: 'HOME' },
  {
    href: '/shop',
    label: 'SHOP',
    dropdown: [
      { name: 'EYES', image: '/images/categories/eyes.png', href: '/shop/eyes' },
      { name: 'FACE', image: '/images/categories/face.png', href: '/shop/face' },
      { name: 'LIPS', image: '/images/categories/lips.jpeg', href: '/shop/lips' },
    ],
  },
  {
    href: '/about-us',
    label: 'ABOUT US',
    textDropdown: [
      { name: 'Our Promise', href: '/about-us#clean-beauty-promise' },
      { name: 'Our Products', href: '/about-us#our-products' },
      { name: 'Our Ingredients', href: '/about-us#our-ingredients' },
      { name: 'Why Us', href: '/about-us#what-makes-us-different' },
      { name: 'The Meaning', href: '/about-us#the-meaning' },
      { name: 'Our Story', href: '/about-us#our-story' },
      { name: 'Our Mission', href: '/about-us#our-mission' },
      { name: 'Our Team', href: '/our-team' },
    ],
  },
  { href: '/community', label: 'COMMUNITY' },
  { href: '/contact', label: 'CONTACT' },
]

export default function Navbar() {
  return (
    <header
      className="fixed top-0 left-0 w-full z-50 transition-all duration-300 h-[50px] md:h-[60px] flex items-center bg-cream/95 shadow-sm border-b border-black/5"
    >
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 w-full h-full flex items-center">
        {/* Desktop Layout */}
        <nav className="hidden md:flex items-center justify-between w-full h-full">
          <Link href="/" className="relative w-[20px] h-[28px] md:w-[22px] md:h-[32px] shrink-0 block">
            <Image
              src="/images/logo/inoya-rouge-logo.png"
              alt="Inoya Rouge"
              fill
              className="object-contain"
              sizes="22px"
            />
          </Link>
          {navLinks.map((link) => (
            <div key={link.href} className={`group/navitem h-full flex items-center${link.textDropdown ? ' relative' : ''}`}>
              <Link
                href={link.href}
                className="nav-underline-link text-[#211a17] hover:text-burgundy text-[10px] md:text-[14px] font-sans uppercase tracking-[0.0em] py-1 flex items-center transition-colors"
              >
                {link.label}
              </Link>

              {link.textDropdown && (
                <div className="absolute top-full left-0 min-w-[220px] bg-cream/95 backdrop-blur-md shadow-sm border-t border-black/5
                  opacity-0 invisible group-hover/navitem:opacity-100 group-hover/navitem:visible transition-all duration-300 transform -translate-y-1 group-hover/navitem:translate-y-0 rounded-b-sm">
                  <div className="py-4 flex flex-col gap-1.5">
                    {link.textDropdown.map((item) => (
                      <AnchorLink
                        key={item.name}
                        href={item.href}
                        className="group/sublink flex items-center justify-between px-6 py-1.5 font-sans text-[11px] uppercase tracking-widest text-[#211a17]/60 hover:text-[#211a17] transition-colors duration-300"
                      >
                        <span className="relative">
                          {item.name}
                          <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#211a17]/40 group-hover/sublink:w-full transition-all duration-300 ease-out"></span>
                        </span>
                        <svg className="w-[10px] h-[10px] opacity-0 -translate-x-2 group-hover/sublink:opacity-100 group-hover/sublink:translate-x-0 transition-all duration-300 ease-out" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </AnchorLink>
                    ))}
                  </div>
                </div>
              )}

              {link.dropdown && (
                <div className="hidden md:block absolute top-full left-0 w-full bg-[#fff8f6] shadow-xl border-t border-black/5
                  opacity-0 invisible group-hover/navitem:opacity-100 group-hover/navitem:visible mega-dropdown transform -translate-y-3 group-hover/navitem:translate-y-0">
                  <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-10 flex justify-center gap-6 md:gap-12">
                    {link.dropdown.map((item, i) => (
                      <Link href={item.href} key={item.name} style={{ animationDelay: `${i * 100}ms` }} className="mega-card group/dropitem relative w-[280px] aspect-square rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500">
                        <Image src={item.image} alt={item.name} fill quality={70} className="object-cover transform group-hover/dropitem:scale-105 transition-transform duration-700 ease-out" sizes="280px" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#211a17]/80 via-[#211a17]/20 to-transparent opacity-60 group-hover/dropitem:opacity-80 transition-opacity duration-500"></div>
                        <div className="absolute inset-0 flex items-end justify-center pb-8">
                          <span className="text-white font-sans font-medium tracking-widest text-xl drop-shadow-lg translate-y-2 group-hover/dropitem:translate-y-0 transition-transform duration-500">{item.name}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Mobile Layout */}
        <div className="md:hidden flex items-center justify-between w-full relative h-full">
          <Link href="/" className="relative w-[20px] h-[30px] shrink-0 block z-10">
            <Image
              src="/images/logo/inoya-rouge-logo.png"
              alt="Inoya Rouge"
              fill
              className="object-contain"
              sizes="20px"
            />
          </Link>
          <MobileNav navLinks={navLinks} />
        </div>
      </div>
    </header>
  )
}
