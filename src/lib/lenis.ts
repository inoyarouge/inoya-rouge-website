import type Lenis from 'lenis'

// Module singleton holding the live Lenis instance created in SmoothScrollProvider.
// Lets components (e.g. AnchorLink) drive scrolls through Lenis instead of the native
// scroll API, which Lenis would otherwise override on its next animation frame.
let instance: Lenis | null = null

export const setLenis = (l: Lenis | null) => {
  instance = l
}

export const getLenis = () => instance
