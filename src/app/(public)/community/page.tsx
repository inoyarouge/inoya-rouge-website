import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import type { Testimonial } from '@/lib/types'
import TestimonialForm from '@/components/public/TestimonialForm'

export const revalidate = 0

export const metadata: Metadata = {
  title: 'Community | Inoya Rouge',
  description: 'Read stories from Inoya Rouge customers. Share your own story with our community.',
}

export default async function CommunityPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('testimonials')
    .select('id, author_name, title, content, created_at')
    .eq('status', 'approved')
    .order('created_at', { ascending: false })

  const testimonials = (data ?? []) as Pick<Testimonial, 'id' | 'author_name' | 'title' | 'content' | 'created_at'>[]

  return (
    <div>
      {/* Header */}
      <section className="bg-gray-900 text-white px-4 py-20 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-gray-400 mb-4">Real Stories, Real People</p>
        <h1 className="font-serif text-4xl md:text-5xl mb-4">Your Stories</h1>
        <p className="text-gray-300 max-w-xl mx-auto">
          Hear from women who have made Inoya Rouge part of their beauty journey.
        </p>
      </section>

      {/* Stories Grid */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        {testimonials.length === 0 ? (
          <p className="text-gray-500 text-center py-12">
            Be the first to share your Inoya Rouge story.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {testimonials.map((t) => (
              <article key={t.id} className="bg-white border border-gray-100 rounded-lg p-6">
                <div className="text-brand-rose text-2xl font-serif mb-2">&ldquo;</div>
                <h3 className="font-medium mb-2">{t.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{t.content}</p>
                <footer className="mt-4 flex items-center justify-between text-xs text-gray-400">
                  <span className="font-medium uppercase tracking-wide">— {t.author_name}</span>
                  <time dateTime={t.created_at}>
                    {new Date(t.created_at).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </time>
                </footer>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Submission Form */}
      <section className="bg-gray-50 px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-serif text-3xl text-center mb-2">Share Your Story</h2>
          <p className="text-gray-500 text-sm text-center mb-8">
            Tell us about your experience with Inoya Rouge. Approved stories appear above.
          </p>
          <TestimonialForm />
        </div>
      </section>
    </div>
  )
}
