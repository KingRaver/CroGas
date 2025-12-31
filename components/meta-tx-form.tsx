'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { api } from '@/lib/api'
import { Flame, Send, Zap, Clock, Rocket, Car, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'

interface RecentTx {
  hash: string
  to: string
  amount: string
}

export default function MetaTxForm() {
  const [target, setTarget] = useState('0x145863Eb42Cf62847A6Ca784e6416C1682b1b2Ae')
  const [priority, setPriority] = useState('normal')
  const [status, setStatus] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [recentTxs, setRecentTxs] = useState<RecentTx[]>([
    { hash: '0xF40B9a...', to: 'TestUSDC', amount: '$0.01' },
    { hash: '0x7906Ab...', to: 'VVS Swap', amount: '$0.02' },
  ])

  const pricingTiers = [
    { 
      value: 'slow', 
      label: 'Slow', 
      price: '$0.005', 
      time: '~30s',
      icon: Clock,
      bgColor: 'bg-cyan-500/10',
      borderActive: 'border-cyan-400',
      textColor: 'text-cyan-300',
      glow: 'neon-cyan'
    },
    { 
      value: 'normal', 
      label: 'Normal', 
      price: '$0.01', 
      time: '~10s',
      icon: Car,
      bgColor: 'bg-pink-500/10',
      borderActive: 'border-pink-400',
      textColor: 'text-pink-300',
      glow: 'neon-pink'
    },
    { 
      value: 'fast', 
      label: 'Fast', 
      price: '$0.02', 
      time: '~3s',
      icon: Rocket,
      bgColor: 'bg-purple-500/10',
      borderActive: 'border-purple-400',
      textColor: 'text-purple-300',
      glow: 'neon-purple'
    },
  ]

  const execute = async () => {
    setStatus('⛽ Executing meta-tx...')
    setIsLoading(true)
    
    try {
      const res = await api.executeMetaTx({
        request: {
          from: '0xYourAgentWallet',
          to: target,
          value: '0',
          gas: '200000',
          nonce: '0',
          deadline: Math.floor(Date.now() / 1000 + 3600).toString(),
          data: '0x'
        },
        signature: '0x...',
        priority
      })
      
      setStatus(`✅ Success: ${res.txHash.slice(0, 12)}...`)
      setRecentTxs(prev => [
        { hash: res.txHash.slice(0, 10) + '...', to: 'Contract', amount: '$0.01' },
        ...prev.slice(0, 4)
      ])
    } catch (e: any) {
      setStatus(`❌ ${e.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const getTestUSDC = async () => {
    setStatus('🚰 Requesting TestUSDC from faucet...')
    setTimeout(() => setStatus('✅ 100 TestUSDC received!'), 1500)
  }

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Execute Form */}
      <div className="glass-light p-8 rounded-3xl neon-border-animated">
        <h3 className="text-2xl font-black gradient-text mb-6 flex items-center gap-3 display-font">
          <Zap className="w-7 h-7 text-cyan-400" style={{ filter: 'drop-shadow(0 0 10px #05ffa1)' }} />
          Execute Meta-Tx
        </h3>
        
        <div className="space-y-6">
          {/* Target Contract Input */}
          <div>
            <label className="flex items-center gap-2 text-sm font-bold mb-3 text-pink-300 uppercase tracking-wider">
              <Send className="w-4 h-4" />
              Target Contract
            </label>
            <Input
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              placeholder="0x... VVS Router, etc"
              className="input-synthwave text-lg h-14 rounded-xl text-white placeholder:text-white/30"
            />
          </div>

          {/* Priority Tiers */}
          <div>
            <label className="flex items-center gap-2 text-sm font-bold mb-3 text-pink-300 uppercase tracking-wider">
              <Zap className="w-4 h-4" />
              Priority Tier
            </label>
            <div className="grid grid-cols-3 gap-3">
              {pricingTiers.map((tier) => (
                <button
                  key={tier.value}
                  onClick={() => setPriority(tier.value)}
                  className={cn(
                    'glass-light p-4 rounded-xl border-2 transition-all duration-300',
                    'hover:scale-105',
                    priority === tier.value 
                      ? `${tier.borderActive} ${tier.bgColor} ${tier.glow}` 
                      : 'border-white/20 hover:border-white/40'
                  )}
                >
                  <tier.icon 
                    className={cn('w-6 h-6 mx-auto mb-2', tier.textColor)} 
                    style={{ filter: priority === tier.value ? 'drop-shadow(0 0 8px currentColor)' : 'none' }}
                  />
                  <div className="text-sm font-bold text-white/80">{tier.label}</div>
                  <div 
                    className={cn('text-lg font-black', tier.textColor)}
                    style={{ filter: 'drop-shadow(0 0 6px currentColor)' }}
                  >
                    {tier.price}
                  </div>
                  <div className="text-xs text-white/50">{tier.time}</div>
                </button>
              ))}
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-4 pt-4">
            <Button 
              className="h-14 bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-400 font-black text-lg text-black hover:from-orange-400 hover:to-yellow-400 rounded-xl transition-all hover:scale-105"
              style={{ boxShadow: '0 0 30px rgba(255, 159, 28, 0.5)' }}
              onClick={getTestUSDC}
              disabled={isLoading}
            >
              <Flame className="w-5 h-5 mr-2" />
              Get TestUSDC
            </Button>
            <Button 
              className="h-14 btn-groovy font-black text-lg rounded-xl text-white"
              onClick={execute}
              disabled={isLoading}
            >
              <Send className="w-5 h-5 mr-2" />
              Execute Tx
            </Button>
          </div>
        </div>
        
        {/* Status */}
        {status && (
          <div className={cn(
            'mt-6 p-4 rounded-xl border-2 text-center font-mono transition-all',
            status.includes('✅') 
              ? 'border-cyan-400/70 bg-cyan-500/20 text-cyan-300 neon-cyan' 
              : status.includes('❌')
              ? 'border-red-400/70 bg-red-500/20 text-red-300'
              : 'border-pink-400/70 bg-pink-500/20 text-pink-300'
          )}>
            {status}
          </div>
        )}
      </div>

      {/* Recent Transactions */}
      <div className="glass-light p-8 rounded-3xl border-2 border-purple-400/50 neon-purple">
        <h3 className="text-2xl font-black gradient-text-alt mb-6 display-font">
          Recent Transactions
        </h3>
        
        <div className="space-y-3">
          {recentTxs.map((tx, i) => (
            <div 
              key={i}
              className="flex items-center justify-between p-4 rounded-xl bg-black/30 border border-white/10 hover:border-cyan-400/50 transition-all hover:bg-black/40 group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <code className="text-cyan-300 text-sm" style={{ filter: 'drop-shadow(0 0 4px #05ffa1)' }}>
                  {tx.hash}
                </code>
                <span className="text-white/40">→</span>
                <span className="text-white/80">{tx.to}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-pink-300 font-bold" style={{ filter: 'drop-shadow(0 0 4px #ff2a6d)' }}>
                  {tx.amount}
                </span>
                <ExternalLink className="w-4 h-4 text-white/30 group-hover:text-cyan-400 transition-colors" />
              </div>
            </div>
          ))}
        </div>

        {/* Awaiting placeholder */}
        <div className="mt-4 p-4 rounded-xl bg-black/20 border border-dashed border-white/20 text-center text-white/40">
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
            Awaiting new transactions...
          </div>
        </div>
      </div>
    </div>
  )
}