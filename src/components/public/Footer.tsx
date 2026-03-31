import Link from 'next/link'

const quickLinks = [
  { href: '/', label: 'Home' },
  { href: '/shop', label: 'Shop' },
  { href: '/our-story', label: 'Our Story' },
  { href: '/community', label: 'Community' },
  { href: '/contact', label: 'Contact' },
]

const policyLinks = [
  { href: '/policies?tab=privacy', label: 'Privacy Policy' },
  { href: '/policies?tab=terms', label: 'Terms & Conditions' },
  { href: '/policies?tab=shipping', label: 'Shipping Policy' },
  { href: '/policies?tab=returns', label: 'Returns & Refunds' },
]

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <span className="font-serif text-2xl text-white">Inoya Rouge</span>
          <p className="mt-3 text-sm text-gray-400 leading-relaxed">
            Indian luxury cosmetics — inspired by nature, defined by color.
          </p>
        </div>

        <div>
          <h3 className="font-medium text-white mb-4 uppercase text-sm tracking-wide">Quick Links</h3>
          <ul className="space-y-2">
            {quickLinks.map(link => (
              <li key={link.href}>
                <Link href={link.href} className="text-sm text-gray-400 hover:text-white min-h-[44px] inline-flex items-center">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-medium text-white mb-4 uppercase text-sm tracking-wide">Policies</h3>
          <ul className="space-y-2">
            {policyLinks.map(link => (
              <li key={link.href}>
                <Link href={link.href} className="text-sm text-gray-400 hover:text-white min-h-[44px] inline-flex items-center">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-6 text-center text-xs text-gray-500">
          &copy; {new Date().getFullYear()} Inoya Rouge. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
