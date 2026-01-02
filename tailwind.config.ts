import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        display: ['Poiret One', 'cursive'],
        serif: ['Cormorant Garamond', 'serif'],
      },
      colors: {
        // Warm Palette (Art Nouveau)
        burgundy: {
          DEFAULT: '#a52b36',
          light: '#c44d58',
        },
        gold: {
          DEFAULT: '#f6c25d',
          light: '#fbd499',
          muted: '#cbc385',
        },
        cream: '#edf3af',
        sage: {
          DEFAULT: '#879c7d',
          dark: '#6b7d62',
        },
        // Cool Palette (Art Deco)
        slate: {
          DEFAULT: '#3f647e',
          light: '#688fad',
        },
        teal: '#00b0b2',
        ivory: '#f8f6f0',
        charcoal: '#2a2a2a',
      },
      animation: {
        'shimmer-gold': 'shimmer-gold 3s ease infinite',
        'pulse-soft': 'pulse-soft 2s ease-in-out infinite',
        'fade-in': 'fade-in-up 0.6s ease forwards',
      },
      keyframes: {
        'shimmer-gold': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.6', transform: 'scale(1.2)' },
        },
        'fade-in-up': {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
  ],
}

export default config