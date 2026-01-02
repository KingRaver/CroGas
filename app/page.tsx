'use client'
import { useState } from 'react'
import { Link2, Zap, ArrowRight, Fuel, Shield, Coins } from 'lucide-react'
import StatsGrid from '@/components/stats-grid'

function DecoDivider() {
  return (
    <div className="flex items-center justify-center gap-4 my-12">
      <div className="w-24 h-px bg-gradient-to-r from-transparent to-[#f6c25d]" />
      <div className="relative">
        <div className="w-4 h-4 rotate-45 bg-[#f6c25d]" />
        <div className="absolute inset-1 rotate-45 bg-[#f8f6f0]" />
      </div>
      <div className="w-24 h-px bg-gradient-to-l from-transparent to-[#f6c25d]" />
    </div>
  )
}

function SunburstHero() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Central sunburst */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-[0.03]"
        style={{
          background: 'repeating-conic-gradient(from 0deg, #f6c25d 0deg 2deg, transparent 2deg 10deg)',
        }}
      />
    </div>
  )
}

export default function HomePage() {
  const [isConnecting, setIsConnecting] = useState(false)

  const handleConnect = () => {
    setIsConnecting(true)
    setTimeout(() => setIsConnecting(false), 2000)
  }

  return (
    <main className="relative min-h-screen">
      <SunburstHero />
      
      {/* Content */}
      <div className="relative z-10">
        {/* Network Status Badge */}
        <div className="flex justify-center pt-12">
          <div className="status-live">
            <span>Live — Cronos Testnet x402</span>
          </div>
        </div>

        {/* Hero Section */}
        <div className="container mx-auto px-4 pt-16 pb-20 text-center">
          {/* Ornamental top piece */}
          <div className="flex justify-center mb-8">
            <svg width="120" height="40" viewBox="0 0 120 40" fill="none" className="opacity-60">
              <path d="M0 20 L30 20 L40 10 L50 20 L60 0 L70 20 L80 10 L90 20 L120 20" stroke="#f6c25d" strokeWidth="2" fill="none"/>
              <circle cx="60" cy="10" r="4" fill="#f6c25d"/>
            </svg>
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl display-font mb-6 tracking-wider">
            <span className="text-[#3f647e]">Agent</span>
            <span className="text-gold-gradient mx-3">Gas</span>
            <span className="text-[#3f647e]">Station</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-[#688fad] mb-4 serif italic max-w-2xl mx-auto">
            Elegant gas abstraction for the modern blockchain
          </p>
          
          <p className="text-lg text-[#3f647e] mb-12 max-w-xl mx-auto">
            Pay Cronos gas fees with{' '}
            <span className="font-semibold text-[#a52b36]">$USDC</span>.{' '}
            <span className="font-semibold text-[#00b0b2]">Zero CRO required.</span>
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <button
              onClick={handleConnect}
              disabled={isConnecting}
              className="btn-deco min-w-[280px] flex items-center justify-center gap-3"
            >
              <Link2 className="w-5 h-5" />
              {isConnecting ? 'Connecting...' : 'Connect Wallet'}
            </button>
            
            <button
              className="btn-outline-elegant min-w-[280px] flex items-center justify-center gap-3"
              onClick={() => window.location.href = '/dashboard'}
            >
              <Zap className="w-5 h-5" />
              Open Dashboard
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          
          {/* Ornamental bottom piece */}
          <div className="flex justify-center mt-8">
            <svg width="200" height="20" viewBox="0 0 200 20" fill="none" className="opacity-40">
              <path d="M0 10 L60 10 M80 10 L120 10 M140 10 L200 10" stroke="#3f647e" strokeWidth="1"/>
              <rect x="65" y="5" width="10" height="10" fill="none" stroke="#f6c25d" strokeWidth="1" transform="rotate(45 70 10)"/>
              <rect x="125" y="5" width="10" height="10" fill="none" stroke="#f6c25d" strokeWidth="1" transform="rotate(45 130 10)"/>
            </svg>
          </div>
        </div>

        <DecoDivider />

        {/* Stats Grid */}
        <div className="container mx-auto px-4 pb-16">
          <StatsGrid />
        </div>

        <DecoDivider />

        {/* Features Section */}
        <div className="container mx-auto px-4 pb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl display-font text-[#3f647e] tracking-wider mb-4">
              How It Works
            </h2>
            <p className="text-[#688fad] serif italic">
              Sophisticated technology, simplified experience
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                icon: Fuel,
                title: 'Gas Abstraction',
                description: 'Agents pay gas in USDC via EIP-712 meta-transactions. No native tokens required.',
                accent: '#00b0b2',
              },
              {
                icon: Coins,
                title: 'x402 Protocol',
                description: 'HTTP 402 payment negotiation for seamless, automatic transaction processing.',
                accent: '#f6c25d',
              },
              {
                icon: Shield,
                title: 'Priority Lanes',
                description: 'Choose your execution speed with dynamic pricing tiers for optimal control.',
                accent: '#a52b36',
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="card-glass p-8 hover-lift animate-fade-in text-center"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div 
                  className="w-16 h-16 mx-auto mb-6 flex items-center justify-center"
                  style={{ 
                    background: `${feature.accent}15`,
                    border: `2px solid ${feature.accent}40`
                  }}
                >
                  <feature.icon className="w-8 h-8" style={{ color: feature.accent }} />
                </div>
                
                <h3 className="text-xl display-font text-[#3f647e] tracking-wider mb-4">
                  {feature.title}
                </h3>
                
                <p className="text-[#688fad] leading-relaxed">
                  {feature.description}
                </p>
                
                {/* Bottom accent */}
                <div className="mt-6 flex justify-center">
                  <div className="w-12 h-0.5" style={{ backgroundColor: feature.accent, opacity: 0.5 }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Process Steps */}
        <div className="container mx-auto px-4 pb-20">
          <div className="card-framed max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl display-font text-[#3f647e] tracking-wider mb-2">
                Get Started
              </h2>
              <div className="divider-deco">
                <div className="divider-deco-icon" />
              </div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { step: '01', title: 'Connect', desc: 'Link your agent wallet to the gas station' },
                { step: '02', title: 'Fund', desc: 'Acquire testnet USDC from our faucet' },
                { step: '03', title: 'Execute', desc: 'Send meta-transactions, pay in USDC' },
              ].map((item, i) => (
                <div key={i} className="text-center">
                  <div className="text-5xl display-font text-[#f6c25d]/30 mb-2">
                    {item.step}
                  </div>
                  <h4 className="text-lg display-font text-[#3f647e] tracking-wider mb-2">
                    {item.title}
                  </h4>
                  <p className="text-[#688fad] text-sm">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="container mx-auto px-4 py-12 text-center">
          <div className="flex justify-center mb-6">
            <svg width="60" height="30" viewBox="0 0 60 30" fill="none" className="opacity-40">
              <path d="M0 15 L20 15 L30 5 L40 15 L60 15" stroke="#f6c25d" strokeWidth="1"/>
              <circle cx="30" cy="5" r="3" fill="#3f647e"/>
            </svg>
          </div>
          
          <p className="text-[#688fad] text-sm tracking-wider">
            Built on{' '}
            <span className="text-[#a52b36] font-semibold">Cronos</span>
            {' '}·{' '}
            Powered by{' '}
            <span className="text-[#00b0b2] font-semibold">x402</span>
            {' '}·{' '}
            <span className="text-[#3f647e]">MMXXIV</span>
          </p>
        </footer>
      </div>
    </main>
  )
}