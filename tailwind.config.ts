import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ['JetBrains Mono', 'monospace'],
        display: ['Orbitron', 'sans-serif'],
      },
      colors: {
        'hot-pink': '#ff2d95',
        'neon-cyan': '#00f5d4',
        'electric-purple': '#b14aed',
        'sunset-orange': '#ff6b35',
        'deep-purple': '#0d0221',
        'dark-teal': '#0f1b2e',
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'gradient-shift': 'gradient-shift 3s ease infinite',
        'float-up': 'float-up 8s ease-in-out infinite',
        'border-rotate': 'border-rotate 4s linear infinite',
        'grid-scroll': 'grid-scroll 20s linear infinite',
        'sun-pulse': 'sun-pulse 4s ease-in-out infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': {
            boxShadow: '0 0 5px rgba(0,245,212,0.5), 0 0 10px rgba(0,245,212,0.5)',
          },
          '50%': {
            boxShadow: '0 0 20px rgba(0,245,212,0.8), 0 0 40px rgba(0,245,212,0.8)',
          },
        },
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'float-up': {
          '0%': { opacity: '0', transform: 'translateY(100vh) scale(0)' },
          '10%': { opacity: '1' },
          '90%': { opacity: '1' },
          '100%': { opacity: '0', transform: 'translateY(-100vh) scale(1)' },
        },
      },
      backgroundImage: {
        'synthwave-gradient': 'linear-gradient(180deg, #0d0221 0%, #1a0a2e 40%, #150a25 70%, #0f1b2e 100%)',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
  ],
}

export default config