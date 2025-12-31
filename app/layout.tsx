import type { Metadata } from 'next'
import './globals.css'
import { Providers } from './providers'

export const metadata: Metadata = {
  title: 'CroGas - Agent Gas Station',
  description: 'Pay Cronos gas with USDC. x402 protocol.',
}

function Particles() {
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 10}s`,
    duration: `${8 + Math.random() * 6}s`,
    size: `${4 + Math.random() * 6}px`,
    color: i % 4 === 0 ? '#ff2a6d' : i % 4 === 1 ? '#05ffa1' : i % 4 === 2 ? '#d147ff' : '#ff9f1c',
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
            boxShadow: `0 0 10px ${p.color}, 0 0 20px ${p.color}`,
          }}
        />
      ))}
    </div>
  )
}

function WireframeMountains() {
  return (
    <div className="synthwave-mountains">
      <div className="mountain-left" />
      <div className="mountain-center" />
      <div className="mountain-right" />
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
        {/* Layer 1: Vibrant sky gradient */}
        <div className="synthwave-sky" />
        
        {/* Layer 2: Twinkling stars (only visible at top) */}
        <div className="stars" />
        
        {/* Layer 3: Large glowing sun */}
        <div className="synthwave-sun" />
        
        {/* Layer 4: Horizon glow line */}
        <div className="horizon-glow" />
        
        {/* Layer 5: Wireframe mountains */}
        <WireframeMountains />
        
        {/* Layer 6: Perspective grid floor */}
        <div className="synthwave-grid" />
        
        {/* Layer 7: Floating particles */}
        <Particles />
        
        <Providers>
          <div className="relative z-10">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  )
}