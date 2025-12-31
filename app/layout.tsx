import type { Metadata } from 'next'
import './globals.css'
import { Providers } from './providers'

export const metadata: Metadata = {
  title: 'CroGas - Agent Gas Station',
  description: 'Pay Cronos gas with USDC. x402 protocol.',
}

function Particles() {
  // Generate 20 particles with random positions and delays
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 8}s`,
    duration: `${6 + Math.random() * 4}s`,
    size: `${2 + Math.random() * 4}px`,
    color: i % 3 === 0 ? '#ff2d95' : i % 3 === 1 ? '#00f5d4' : '#b14aed',
  }))

  return (
    <div className="particles">
      {particles.map((p) => (
        <div
          key={p.id}
          className="particle"
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            animationDelay: p.delay,
            animationDuration: p.duration,
          }}
        />
      ))}
    </div>
  )
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen text-white font-mono overflow-x-hidden">
        {/* Synthwave background layers */}
        <div 
          className="fixed inset-0 -z-30"
          style={{
            background: 'linear-gradient(180deg, #0d0221 0%, #1a0a2e 40%, #150a25 70%, #0f1b2e 100%)',
          }}
        />
        
        {/* Sun glow effect */}
        <div className="sun-glow" />
        
        {/* Floating particles */}
        <Particles />
        
        {/* Synthwave grid floor */}
        <div className="synthwave-grid" />
        
        {/* Subtle scanlines overlay */}
        <div 
          className="fixed inset-0 -z-10 pointer-events-none opacity-20"
          style={{
            background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)',
          }}
        />
        
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}