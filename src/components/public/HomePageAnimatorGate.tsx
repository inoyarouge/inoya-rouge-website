'use client'

import dynamic from 'next/dynamic'

// Client-side boundary whose only job is to load HomePageAnimator lazily.
//
// HomePageAnimator pulls in gsap + ScrollTrigger. Imported statically from the homepage
// it lands in the (public) route group's page chunk — which Next also ships on sibling
// routes — so gsap was downloaded on every public page, including the policy pages that
// have no animation at all.
//
// `ssr: false` is what actually keeps the module out of the server payload, and it is
// only allowed inside a Client Component, hence this wrapper. The animator renders null
// and does all its work in effects, so skipping SSR changes no markup.
const HomePageAnimator = dynamic(() => import('./HomePageAnimator'), { ssr: false })

export default function HomePageAnimatorGate() {
  return <HomePageAnimator />
}
