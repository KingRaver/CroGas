'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Link2, Zap, Fuel } from 'lucide-react'
import GasPump3D from '@/components/gas-pump-3d'
import StatsGrid from '@/components/stats-grid'

export default function HomePage() {
  const [isConnecting, setIsConnecting] = useState(false)

  const handleConnect = () => {
    setIsConnecting(true)
    // TODO: Implement wallet connection
    setTimeout(() => setIsConnecting(false), 2000)
  }

  return (
    <main className="relative min-h-screen">
      {/* 3D Gas Pump Background */}
      <GasPump3D />

      {/* Content */}
      <div className="relative z-10">
        {/* Network Status Badge */}
        <div className="flex justify-center pt-8">
          <div className="glass px-6 py-3 rounded-full border border-cyan-500/30 flex items-center gap-3 pulse-live">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
            <span className="text-cyan-400 font-bold text-sm tracking-wider">
              🛢️ LIVE - Cronos x402
            </span>
          </div>
        </div>

        {/* Hero Section */}
        <div className="container mx-auto px-4 pt-16 pb-32 text-center">
          <h1 className="text-6xl md:text-8xl font-black mb-6 display-font">
            <span className="gradient-text glow-text-pink">Agent</span>
            <span className="text-white mx-4">Gas</span>
            <span className="gradient-text-alt glow-text-cyan">Station</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto">
            Pay Cronos gas fees with{' '}
            <span className="text-pink-400 font-bold glow-text-pink">$USDC</span>.{' '}
            <span className="text-cyan-400 font-bold glow-text-cyan">Zero CRO required.</span>
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              onClick={handleConnect}
              disabled={isConnecting}
              className="btn-groovy h-16 px-10 text-xl font-black rounded-2xl min-w-[280px]"
            >
              <Link2 className="w-6 h-6 mr-3" />
              {isConnecting ? 'Connecting...' : 'Connect Agent Wallet'}
            </Button>
            
            <Button
              variant="outline"
              className="h-16 px-10 text-xl font-black rounded-2xl min-w-[280px] border-2 border-cyan-500/50 bg-transparent hover:bg-cyan-500/10 hover:border-cyan-400 transition-all hover:shadow-lg hover:shadow-cyan-500/20"
              onClick={() => window.location.href = '/dashboard'}
            >
              <Zap className="w-6 h-6 mr-3 text-cyan-400" />
              <span className="text-cyan-400">Open Dashboard</span>
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="container mx-auto px-4 pb-24">
          <StatsGrid />
        </div>

        {/* Features Section */}
        <div className="container mx-auto px-4 pb-24">
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                icon: '⛽',
                title: 'Gas Abstraction',
                description: 'Agents pay gas in USDC via EIP-712 meta-transactions',
                color: 'pink',
              },
              {
                icon: '🔄',
                title: 'x402 Protocol',
                description: 'HTTP 402 payment negotiation for seamless transactions',
                color: 'cyan',
              },
              {
                icon: '🚀',
                title: 'Priority Lanes',
                description: 'Choose your speed: Slow, Normal, or Fast execution',
                color: 'purple',
              },
            ].map((feature, i) => (
              <div
                key={i}
                className={`
                  glass p-8 rounded-3xl border card-hover
                  ${feature.color === 'pink' ? 'border-pink-500/30 hover:neon-pink' : 
                    feature.color === 'cyan' ? 'border-cyan-500/30 hover:neon-cyan' : 
                    'border-purple-500/30 hover:neon-purple'}
                `}
                style={{
                  animationDelay: `${i * 150}ms`,
                }}
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className={`
                  text-xl font-black mb-3 display-font
                  ${feature.color === 'pink' ? 'text-pink-400' : 
                    feature.color === 'cyan' ? 'text-cyan-400' : 'text-purple-400'}
                `}>
                  {feature.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <footer className="container mx-auto px-4 py-8 text-center">
          <div className="glass inline-block px-8 py-4 rounded-2xl border border-white/10">
            <p className="text-gray-500 text-sm">
              Built on{' '}
              <span className="text-pink-400 font-bold">Cronos</span>
              {' '}•{' '}
              Powered by{' '}
              <span className="text-cyan-400 font-bold">x402</span>
            </p>
          </div>
        </footer>
      </div>
    </main>
  )
}