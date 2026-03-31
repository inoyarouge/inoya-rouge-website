import Link from 'next/link'
import MobileMenuToggle from './MobileMenuToggle'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/shop', label: 'Shop' },
  { href: '/our-story', label: 'Our Story' },
  { href: '/community', label: 'Community' },
  { href: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const links = navLinks.map(link => (
    <Link
      key={link.href}
      href={link.href}
      className="text-gray-600 hover:text-brand-rose text-sm font-medium uppercase tracking-wide min-h-[44px] flex items-center"
    >
      {link.label}
    </Link>
  ))

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="font-serif text-2xl text-brand-rose tracking-tight">
          Inoya Rouge
        </Link>

        <nav className="hidden md:flex gap-6">
          {links}
        </nav>

        <MobileMenuToggle>
          {links}
        </MobileMenuToggle>
      </div>
    </header>
  )
}
