'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Link2, Zap, Fuel, ArrowRight, Shield, Coins } from 'lucide-react'
import StatsGrid from '@/components/stats-grid'

export default function HomePage() {
  const [isConnecting, setIsConnecting] = useState(false)

  const handleConnect = () => {
    setIsConnecting(true)
    setTimeout(() => setIsConnecting(false), 2000)
  }

  return (
    <main className="relative min-h-screen">
      {/* Content */}
      <div className="relative z-10">
        {/* Network Status Badge */}
        <div className="flex justify-center pt-8">
          <div className="glass-light px-6 py-3 rounded-full border-2 border-cyan-400/50 flex items-center gap-3 pulse-live">
            <div className="w-2.5 h-2.5 bg-cyan-400 rounded-full animate-pulse" style={{ boxShadow: '0 0 10px #05ffa1' }} />
            <span className="text-cyan-300 font-bold text-sm tracking-wider" style={{ filter: 'drop-shadow(0 0 8px #05ffa1)' }}>
              🛢️ LIVE - Cronos x402
            </span>
          </div>
        </div>

        {/* Hero Section */}
        <div className="container mx-auto px-4 pt-20 pb-32 text-center">
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black mb-8 display-font leading-tight">
            <span className="gradient-text">Agent</span>
            <br className="md:hidden" />
            <span className="text-white mx-2 md:mx-4" style={{ textShadow: '0 0 30px rgba(255,255,255,0.5)' }}>Gas</span>
            <br className="md:hidden" />
            <span className="gradient-text-alt">Station</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/80 mb-12 max-w-2xl mx-auto leading-relaxed">
            Pay Cronos gas fees with{' '}
            <span className="text-pink-300 font-bold" style={{ filter: 'drop-shadow(0 0 10px #ff2a6d)' }}>$USDC</span>.{' '}
            <span className="text-cyan-300 font-bold" style={{ filter: 'drop-shadow(0 0 10px #05ffa1)' }}>Zero CRO required.</span>
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Button
              onClick={handleConnect}
              disabled={isConnecting}
              className="btn-groovy h-16 px-10 text-xl font-black rounded-2xl min-w-[300px] text-white"
            >
              <Link2 className="w-6 h-6 mr-3" />
              {isConnecting ? 'Connecting...' : 'Connect Agent Wallet'}
            </Button>
            
            <Button
              variant="outline"
              className="h-16 px-10 text-xl font-black rounded-2xl min-w-[300px] border-2 border-cyan-400/70 bg-black/30 backdrop-blur-sm hover:bg-cyan-500/20 hover:border-cyan-300 transition-all group"
              style={{ boxShadow: '0 0 30px rgba(5, 255, 161, 0.3)' }}
              onClick={() => window.location.href = '/dashboard'}
            >
              <Zap className="w-6 h-6 mr-3 text-cyan-400 group-hover:text-cyan-300" />
              <span className="text-cyan-300 group-hover:text-cyan-200">Open Dashboard</span>
              <ArrowRight className="w-5 h-5 ml-2 text-cyan-400 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="container mx-auto px-4 pb-24">
          <StatsGrid />
        </div>

        {/* Features Section */}
        <div className="container mx-auto px-4 pb-24">
          <h2 className="text-3xl md:text-4xl font-black text-center mb-12 display-font">
            <span className="gradient-text">How It</span>
            <span className="text-white ml-3">Works</span>
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                icon: Fuel,
                emoji: '⛽',
                title: 'Gas Abstraction',
                description: 'Agents pay gas in USDC via EIP-712 meta-transactions. No native tokens needed.',
                borderColor: 'border-pink-400/50',
                glowColor: 'neon-pink',
                textColor: 'text-pink-300',
              },
              {
                icon: Coins,
                emoji: '🔄',
                title: 'x402 Protocol',
                description: 'HTTP 402 payment negotiation for seamless, automatic transactions.',
                borderColor: 'border-cyan-400/50',
                glowColor: 'neon-cyan',
                textColor: 'text-cyan-300',
              },
              {
                icon: Shield,
                emoji: '🚀',
                title: 'Priority Lanes',
                description: 'Choose your speed: Slow, Normal, or Fast execution with dynamic pricing.',
                borderColor: 'border-purple-400/50',
                glowColor: 'neon-purple',
                textColor: 'text-purple-300',
              },
            ].map((feature, i) => (
              <div
                key={i}
                className={`
                  glass-light p-8 rounded-3xl border-2 ${feature.borderColor}
                  card-hover transition-all duration-300
                  hover:${feature.glowColor}
                `}
              >
                <div className="text-5xl mb-4" style={{ filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.3))' }}>
                  {feature.emoji}
                </div>
                <h3 className={`text-xl font-black mb-3 display-font ${feature.textColor}`} style={{ filter: 'drop-shadow(0 0 8px currentColor)' }}>
                  {feature.title}
                </h3>
                <p className="text-white/70 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* How it works steps */}
        <div className="container mx-auto px-4 pb-24">
          <div className="glass-light p-8 md:p-12 rounded-3xl border-2 border-white/20 max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-black text-center mb-8 display-font gradient-text-alt">
              Get Started in 3 Steps
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { step: '01', title: 'Connect Wallet', desc: 'Link your agent wallet to the gas station' },
                { step: '02', title: 'Fund with USDC', desc: 'Get testnet USDC from our faucet' },
                { step: '03', title: 'Execute Txs', desc: 'Send meta-transactions, pay in USDC' },
              ].map((item, i) => (
                <div key={i} className="text-center">
                  <div 
                    className="text-5xl font-black text-pink-400/30 mb-2"
                    style={{ fontFamily: 'Orbitron' }}
                  >
                    {item.step}
                  </div>
                  <h4 className="text-lg font-bold text-white mb-2">{item.title}</h4>
                  <p className="text-white/60 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="container mx-auto px-4 py-8 text-center">
          <div className="glass-light inline-block px-8 py-4 rounded-2xl border border-white/20">
            <p className="text-white/60 text-sm">
              Built on{' '}
              <span className="text-pink-300 font-bold">Cronos</span>
              {' '}•{' '}
              Powered by{' '}
              <span className="text-cyan-300 font-bold">x402</span>
              {' '}•{' '}
              <span className="text-purple-300 font-bold">2024</span>
            </p>
          </div>
        </footer>
      </div>
    </main>
  )
}