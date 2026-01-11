import type { Metadata } from 'next'
import './globals.css'
import { Providers } from './providers'

export const metadata: Metadata = {
  title: 'AutoDrip - Gas Station',
  description: 'Pay Cronos gas with USDC. x402 protocol.',
}

function GeometricOverlay() {
  return (
    <>
      {/* Art Deco fan/sunburst pattern */}
      <div className="pattern-sunburst" />
      
      {/* Chevron pattern layer */}
      <div className="pattern-chevron" />
      
      {/* Diamond lattice */}
      <div className="pattern-lattice" />
    </>
  )
}

function DecoCorners() {
  return (
    <>
      {/* Top left ornament */}
      <div className="fixed top-4 left-4 z-20 opacity-30">
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
          <path d="M0 0 L40 0 L40 8 L8 8 L8 40 L0 40 Z" fill="#f6c25d"/>
          <path d="M12 12 L36 12 L36 16 L16 16 L16 36 L12 36 Z" fill="#3f647e"/>
          <circle cx="24" cy="24" r="4" fill="#f6c25d"/>
        </svg>
      </div>
      
      {/* Top right ornament */}
      <div className="fixed top-4 right-4 z-20 opacity-30">
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none" style={{ transform: 'scaleX(-1)' }}>
          <path d="M0 0 L40 0 L40 8 L8 8 L8 40 L0 40 Z" fill="#f6c25d"/>
          <path d="M12 12 L36 12 L36 16 L16 16 L16 36 L12 36 Z" fill="#3f647e"/>
          <circle cx="24" cy="24" r="4" fill="#f6c25d"/>
        </svg>
      </div>
      
      {/* Bottom left ornament */}
      <div className="fixed bottom-4 left-4 z-20 opacity-30">
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none" style={{ transform: 'scaleY(-1)' }}>
          <path d="M0 0 L40 0 L40 8 L8 8 L8 40 L0 40 Z" fill="#f6c25d"/>
          <path d="M12 12 L36 12 L36 16 L16 16 L16 36 L12 36 Z" fill="#3f647e"/>
          <circle cx="24" cy="24" r="4" fill="#f6c25d"/>
        </svg>
      </div>
      
      {/* Bottom right ornament */}
      <div className="fixed bottom-4 right-4 z-20 opacity-30">
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none" style={{ transform: 'scale(-1, -1)' }}>
          <path d="M0 0 L40 0 L40 8 L8 8 L8 40 L0 40 Z" fill="#f6c25d"/>
          <path d="M12 12 L36 12 L36 16 L16 16 L16 36 L12 36 Z" fill="#3f647e"/>
          <circle cx="24" cy="24" r="4" fill="#f6c25d"/>
        </svg>
      </div>
    </>
  )
}

function DecoBorder() {
  return (
    <div className="fixed inset-4 pointer-events-none z-10 border-2 border-[#f6c25d]/20" />
  )
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-parisian text-[#2a2a2a] overflow-x-hidden">
        {/* Geometric pattern overlays */}
        <GeometricOverlay />
        
        {/* Corner ornaments */}
        <DecoCorners />
        
        {/* Subtle border frame */}
        <DecoBorder />
        
        <Providers>
          <div className="relative z-10">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  )
}