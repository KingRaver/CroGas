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
        // Vibrant Synthwave Palette
        'hot-pink': '#ff2a6d',
        'neon-pink': '#ff6b9d',
        'neon-cyan': '#05ffa1',
        'electric-cyan': '#00fff5',
        'electric-purple': '#d147ff',
        'sunset-orange': '#ff9f1c',
        'sunset-yellow': '#ffe66d',
        'sky-purple': '#1a0533',
        'mid-purple': '#4a1259',
        'horizon-pink': '#ff3864',
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'gradient-shift': 'gradient-shift 3s ease infinite',
        'float-up': 'float-up 10s ease-in-out infinite',
        'border-rotate': 'border-rotate 3s linear infinite',
        'grid-scroll': 'grid-scroll 15s linear infinite',
        'sun-pulse': 'sun-pulse 4s ease-in-out infinite',
        'twinkle': 'twinkle 4s ease-in-out infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': {
            boxShadow: '0 0 10px rgba(5,255,161,0.5), 0 0 20px rgba(5,255,161,0.5)',
          },
          '50%': {
            boxShadow: '0 0 30px rgba(5,255,161,0.8), 0 0 60px rgba(5,255,161,0.8)',
          },
        },
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'float-up': {
          '0%': { opacity: '0', transform: 'translateY(100vh) scale(0)' },
          '10%': { opacity: '0.8' },
          '90%': { opacity: '0.8' },
          '100%': { opacity: '0', transform: 'translateY(-100vh) scale(1.5)' },
        },
        'sun-pulse': {
          '0%, 100%': { transform: 'translateX(-50%) scale(1)', filter: 'brightness(1)' },
          '50%': { transform: 'translateX(-50%) scale(1.02)', filter: 'brightness(1.1)' },
        },
        'twinkle': {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
        'grid-scroll': {
          '0%': { backgroundPosition: '0 0' },
          '100%': { backgroundPosition: '0 -600px' },
        },
      },
      backgroundImage: {
        'synthwave-sky': 'linear-gradient(180deg, #0f0525 0%, #1a0a3e 15%, #3d1259 30%, #6b2372 45%, #b73e6e 60%, #ff6b6b 75%, #ffaa5c 90%, #ffe66d 100%)',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
  ],
}

export default config