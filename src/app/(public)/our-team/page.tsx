import type { Metadata } from 'next'
import TeamSection from './TeamSection'

export const metadata: Metadata = {
  title: 'Our Team | Inoya Rouge',
  description: 'Meet the team behind Inoya Rouge.',
}

export default function OurTeamPage() {
  return (
    <div className="bg-cream min-h-screen pt-[50px] md:pt-[60px]">
      <TeamSection />
    </div>
  )
}
