import type { Metadata } from 'next'
import Link from 'next/link'

export const revalidate = false

export const metadata: Metadata = {
  title: 'Our Story | Inoya Rouge',
  description: 'Discover the story behind Inoya Rouge — Indian luxury cosmetics inspired by nature, defined by color.',
}

const pillars = [
  { title: 'Cruelty-Free', text: 'Never tested on animals, ever.' },
  { title: 'Paraben Conscious', text: 'Formulated without harsh parabens.' },
  { title: 'Skin-Friendly', text: 'Gentle on all skin types, including sensitive skin.' },
  { title: 'Inspired by Nature', text: 'Ingredients sourced from India\u2019s rich botanical heritage.' },
]

const differentiators = [
  { title: 'Indian Heritage', text: 'Rooted in centuries-old beauty traditions of the subcontinent.' },
  { title: 'Clean Formulas', text: 'Thoughtfully formulated with ingredients you can trust.' },
  { title: 'Luxury Positioning', text: 'Premium quality at an accessible price point.' },
  { title: 'For Every Skin Tone', text: 'Shade ranges designed for the diversity of Indian skin.' },
]

export default function OurStoryPage() {
  return (
    <div>
      {/* 1. Hero */}
      <section className="bg-gray-900 text-white px-4 py-24 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-gray-400 mb-4">About Inoya Rouge</p>
        <h1 className="font-serif text-4xl md:text-6xl mb-4">Our Story</h1>
        <p className="text-gray-300 max-w-xl mx-auto">Beauty, redefined the natural way.</p>
      </section>

      {/* 2. Brand Story */}
      <section className="px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-serif text-3xl mb-6">Who We Are</h2>
          <p className="text-gray-600 leading-relaxed">
            Inoya Rouge is an Indian luxury cosmetics brand born from a deep love for nature&apos;s
            beauty and a desire to celebrate the richness of Indian skin tones. We believe that beauty
            should be conscious, inclusive, and inspired by the world around us. Every product we create
            is a tribute to the vibrant colors and timeless traditions of India.
          </p>
        </div>
      </section>

      {/* 3. Origin */}
      <section className="bg-gray-50 px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-serif text-3xl mb-6">How It Began</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            It started with a simple frustration: the gap between what Indian women deserved and what
            the beauty industry offered them. Too many brands overlooked our skin tones, our traditions,
            and our desire for clean, trustworthy ingredients.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Inoya Rouge was founded to change that — to build a brand that puts Indian women first,
            drawing inspiration from our heritage while meeting the highest modern standards of
            quality and safety.
          </p>
        </div>
      </section>

      {/* 4. Name Meaning */}
      <section className="px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-serif text-3xl mb-6">The Name</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            <span className="font-serif text-brand-rose text-lg">&ldquo;Inoya&rdquo;</span> speaks to
            purity, nature, and the innate beauty that lives within every woman.
          </p>
          <p className="text-gray-600 leading-relaxed">
            <span className="font-serif text-brand-rose text-lg">&ldquo;Rouge&rdquo;</span> is color,
            boldness, and the courage to stand out. Together, they are our promise: natural beauty,
            defined by color.
          </p>
        </div>
      </section>

      {/* 5. Clean Beauty Pillars */}
      <section className="bg-gray-50 px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-serif text-3xl text-center mb-10">Our Clean Beauty Promise</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {pillars.map((p) => (
              <div key={p.title} className="bg-white border border-gray-100 rounded-lg p-6 text-center">
                <h3 className="font-medium mb-2">{p.title}</h3>
                <p className="text-gray-500 text-sm">{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Ingredients */}
      <section className="px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-serif text-3xl mb-6">Ingredients — Inspired by India</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            India is home to some of the world&apos;s most treasured natural ingredients — from turmeric
            and saffron to rose and sandalwood. We draw on this botanical heritage to create formulas
            that nourish as they beautify.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Every ingredient is chosen with care, ensuring our products are as kind to your skin
            as they are vibrant in color.
          </p>
        </div>
      </section>

      {/* 7. Differentiators */}
      <section className="bg-gray-50 px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-serif text-3xl text-center mb-10">What Makes Us Different</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {differentiators.map((d) => (
              <div key={d.title} className="bg-white border border-gray-100 rounded-lg p-6">
                <h3 className="font-medium mb-2">{d.title}</h3>
                <p className="text-gray-500 text-sm">{d.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Team */}
      <section className="px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-serif text-3xl mb-6">The People Behind the Brand</h2>
          <p className="text-gray-600 leading-relaxed">
            Inoya Rouge is built by a small, passionate team united by a shared belief: that Indian
            women deserve beauty products made with integrity, crafted with love, and designed to
            celebrate who they are.
          </p>
        </div>
      </section>

      {/* 9. Vision */}
      <section className="bg-gray-50 px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <p className="font-serif text-2xl text-gray-700 leading-relaxed mb-8">
            &ldquo;We envision a world where every woman feels seen, celebrated, and confident
            in her own skin — naturally.&rdquo;
          </p>
          <Link
            href="/shop"
            className="inline-block bg-brand-rose text-white px-8 py-3 min-h-[44px] text-sm uppercase tracking-widest font-medium rounded hover:bg-brand-rose/90"
          >
            Explore the Collection
          </Link>
        </div>
      </section>
    </div>
  )
}
