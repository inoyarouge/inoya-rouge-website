import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'brand-rose': '#C7365F',
        'burgundy': '#7a0000',
        'burgundy-dark': '#7d0000',
        'burgundy-red': '#7a001e',
        'accent-pink': '#b80049',
        'cream': '#fff8f6',
        'warm-pink': '#f7ece9',
        'peach': '#faebe5',
        'pink-accent': '#fbdae1',
        'charcoal': '#333333',
        'warm-tan': '#EBD9C8',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        sans: ['var(--font-satoshi)', 'system-ui', 'sans-serif'],
        accent: ['var(--font-newsreader)', 'Georgia', 'serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' }, // Assuming content is duplicated
        }
      },
      animation: {
        marquee: 'marquee 15s linear infinite',
      }
    },
  },
  plugins: [],
}

export default config
