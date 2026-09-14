import type { Metadata } from 'next'
import TeamSection from './TeamSection'

export const metadata: Metadata = {
  title: 'Our Team | Inoya Rouge',
  description: 'Meet the team behind Inoya Rouge.',
  openGraph: {
    title: 'Our Team | Inoya Rouge',
    description: 'Meet the team behind Inoya Rouge.',
    url: '/our-team',
  },
}

export default function OurTeamPage() {
  return (
    <div className="bg-cream min-h-screen">
      <TeamSection />
    </div>
  )
}
