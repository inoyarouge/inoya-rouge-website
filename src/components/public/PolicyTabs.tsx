'use client'

import { useState } from 'react'

const allTabs = [
  { key: 'privacy', label: 'Privacy Policy' },
  { key: 'terms', label: 'Terms & Conditions' },
  { key: 'shipping', label: 'Shipping Policy' },
  { key: 'returns', label: 'Returns & Refunds' },
] as const

type TabKey = (typeof allTabs)[number]['key']

const content: Record<TabKey, { heading: string; sections: { title: string; body: string }[] }> = {
  privacy: {
    heading: 'Privacy Policy',
    sections: [
      {
        title: 'Information We Collect',
        body: 'We collect personal information that you voluntarily provide when submitting a testimonial (name, email) or contacting us. We also collect standard web analytics data such as browser type, device information, and pages visited.',
      },
      {
        title: 'How We Use Your Information',
        body: 'Your information is used to respond to inquiries, display approved testimonials (name only — email is never shown publicly), and improve our website experience. We do not sell or share your personal data with third parties for marketing purposes.',
      },
      {
        title: 'Data Security',
        body: 'We use industry-standard security measures to protect your personal information. All data is stored securely through our database provider with row-level security policies in place.',
      },
      {
        title: 'Contact',
        body: 'For any privacy-related concerns, please contact us at inoyarouge@gmail.com.',
      },
    ],
  },
  terms: {
    heading: 'Terms & Conditions',
    sections: [
      {
        title: 'Acceptance of Terms',
        body: 'By accessing and using the Inoya Rouge website (inoyarouge.com), you agree to be bound by these terms and conditions. If you do not agree, please do not use our website.',
      },
      {
        title: 'Product Information',
        body: 'We make every effort to display product colors and details accurately. However, actual colors may vary slightly depending on your device screen. Product descriptions are for informational purposes.',
      },
      {
        title: 'User Content',
        body: 'By submitting a testimonial or story, you grant Inoya Rouge permission to display your name and content on our website. We reserve the right to moderate, approve, or reject submissions at our discretion.',
      },
      {
        title: 'Intellectual Property',
        body: 'All content on this website — including text, images, logos, and design — is the property of Inoya Rouge and is protected by applicable intellectual property laws.',
      },
    ],
  },
  shipping: {
    heading: 'Shipping Policy',
    sections: [
      {
        title: 'Shipping Coverage',
        body: 'We currently ship across India. International shipping is not available at this time.',
      },
      {
        title: 'Processing Time',
        body: 'Orders are processed within 1–2 business days. You will receive a confirmation email once your order has been dispatched.',
      },
      {
        title: 'Delivery Time',
        body: 'Standard delivery takes 5–7 business days depending on your location. Metro cities may receive orders sooner. Remote areas may take up to 10 business days.',
      },
      {
        title: 'Shipping Charges',
        body: 'Shipping charges are calculated at checkout based on your location and order value. Orders above a certain value may qualify for free shipping — check the checkout page for current offers.',
      },
    ],
  },
  returns: {
    heading: 'Returns & Refunds',
    sections: [
      {
        title: 'Return Eligibility',
        body: 'Due to the nature of cosmetic products, we accept returns only for damaged or defective items. The product must be unused, in its original packaging, and reported within 7 days of delivery.',
      },
      {
        title: 'How to Request a Return',
        body: 'Contact us at inoyarouge@gmail.com with your order number and photos of the damaged/defective product. Our team will review your request within 48 hours.',
      },
      {
        title: 'Refund Process',
        body: 'Approved refunds will be processed within 5–7 business days to your original payment method. Shipping charges are non-refundable.',
      },
      {
        title: 'Exchanges',
        body: 'We currently do not offer direct exchanges. If your item is eligible for return, you may place a new order for the desired product.',
      },
    ],
  },
}

export default function PolicyTabs({ defaultTab, exclude = [] }: { defaultTab?: string; exclude?: TabKey[] }) {
  const tabs = allTabs.filter((t) => !exclude.includes(t.key))
  const initial = tabs.find((t) => t.key === defaultTab) ? (defaultTab as TabKey) : tabs[0].key
  const [activeTab, setActiveTab] = useState<TabKey>(initial)
  const active = content[activeTab]

  return (
    <div>
      <div className="flex gap-1 border-b border-gray-200 mb-8 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`min-h-[44px] px-4 py-3 text-sm font-medium whitespace-nowrap ${activeTab === tab.key
                ? 'border-b-2 border-brand-rose text-brand-rose'
                : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="max-w-3xl">
        <h2 className="font-serif text-2xl mb-6">{active.heading}</h2>
        <div className="space-y-6">
          {active.sections.map((s) => (
            <div key={s.title}>
              <h3 className="font-medium mb-2">{s.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
