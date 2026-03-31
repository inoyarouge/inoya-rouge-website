import type { Metadata } from 'next'
import Link from 'next/link'

export const revalidate = false

export const metadata: Metadata = {
  title: 'Contact Us | Inoya Rouge',
  description: 'Get in touch with Inoya Rouge. Phone, email, and social media contact information.',
}

const contacts = [
  {
    label: 'Phone',
    value: '9836048717',
    href: 'tel:+919836048717',
    note: 'Mon–Sat, 10 AM – 8 PM IST',
  },
  {
    label: 'Email',
    value: 'InoyaRouge@gmail.com',
    href: 'mailto:InoyaRouge@gmail.com',
    note: 'We typically respond within 24 hours',
  },
  {
    label: 'Instagram',
    value: '@inoyarouge',
    href: null,
    note: 'Coming soon',
  },
]

export default function ContactPage() {
  return (
    <div>
      <section className="bg-gray-900 text-white px-4 py-20 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-gray-400 mb-4">We&apos;d Love to Hear From You</p>
        <h1 className="font-serif text-4xl md:text-5xl">Get in Touch</h1>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {contacts.map((c) => (
            <div key={c.label} className="bg-white border border-gray-100 rounded-lg p-8 text-center">
              <h2 className="font-serif text-xl mb-3">{c.label}</h2>
              {c.href ? (
                <Link
                  href={c.href}
                  className="text-brand-rose font-medium min-h-[44px] inline-flex items-center hover:underline"
                >
                  {c.value}
                </Link>
              ) : (
                <p className="text-gray-700 font-medium">{c.value}</p>
              )}
              <p className="text-gray-400 text-sm mt-2">{c.note}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-gray-50 px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-serif text-3xl mb-4">Visit Our Collection</h2>
          <p className="text-gray-600 mb-6">
            Explore our range of luxury cosmetics inspired by nature and crafted for the modern woman.
          </p>
          <Link
            href="/shop"
            className="inline-block bg-brand-rose text-white px-8 py-3 min-h-[44px] text-sm uppercase tracking-widest font-medium rounded hover:bg-brand-rose/90"
          >
            Shop Now
          </Link>
        </div>
      </section>
    </div>
  )
}
