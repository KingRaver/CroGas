'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { api } from '@/lib/api'
import { Flame, Send, Zap, Clock, Rocket, Car } from 'lucide-react'
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
      color: 'cyan'
    },
    { 
      value: 'normal', 
      label: 'Normal', 
      price: '$0.01', 
      time: '~10s',
      icon: Car,
      color: 'pink'
    },
    { 
      value: 'fast', 
      label: 'Fast', 
      price: '$0.02', 
      time: '~3s',
      icon: Rocket,
      color: 'purple'
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
        signature: '0x...', // TODO: Sign with wagmi
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
    // TODO: Implement faucet call
    setTimeout(() => setStatus('✅ 100 TestUSDC received!'), 1500)
  }

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Execute Form */}
      <div className="glass p-8 rounded-3xl neon-border-animated">
        <h3 className="text-2xl font-black gradient-text mb-6 flex items-center gap-3 display-font">
          <Zap className="w-7 h-7 text-cyan-400" />
          Execute Meta-Tx
        </h3>
        
        <div className="space-y-6">
          {/* Target Contract Input */}
          <div>
            <label className="flex items-center gap-2 text-sm font-bold mb-3 text-pink-400 uppercase tracking-wider">
              <Send className="w-4 h-4" />
              Target Contract
            </label>
            <Input
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              placeholder="0x... VVS Router, etc"
              className="input-synthwave text-lg h-14 rounded-xl"
            />
          </div>

          {/* Priority Tiers */}
          <div>
            <label className="flex items-center gap-2 text-sm font-bold mb-3 text-pink-400 uppercase tracking-wider">
              <Zap className="w-4 h-4" />
              Priority Tier
            </label>
            <div className="grid grid-cols-3 gap-3">
              {pricingTiers.map((tier) => (
                <button
                  key={tier.value}
                  onClick={() => setPriority(tier.value)}
                  className={cn(
                    'glass p-4 rounded-xl border-2 transition-all duration-300',
                    'hover:scale-105 hover:border-opacity-100',
                    priority === tier.value 
                      ? tier.color === 'cyan' 
                        ? 'border-cyan-400 neon-cyan bg-cyan-500/10' 
                        : tier.color === 'pink'
                        ? 'border-pink-400 neon-pink bg-pink-500/10'
                        : 'border-purple-400 neon-purple bg-purple-500/10'
                      : 'border-white/20 hover:border-white/40'
                  )}
                >
                  <tier.icon className={cn(
                    'w-6 h-6 mx-auto mb-2',
                    tier.color === 'cyan' ? 'text-cyan-400' :
                    tier.color === 'pink' ? 'text-pink-400' : 'text-purple-400'
                  )} />
                  <div className="text-sm font-bold">{tier.label}</div>
                  <div className={cn(
                    'text-lg font-black',
                    tier.color === 'cyan' ? 'text-cyan-400' :
                    tier.color === 'pink' ? 'text-pink-400' : 'text-purple-400'
                  )}>{tier.price}</div>
                  <div className="text-xs text-gray-500">{tier.time}</div>
                </button>
              ))}
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-4 pt-4">
            <Button 
              className="h-14 bg-gradient-to-r from-orange-500 to-yellow-500 font-black text-lg hover:from-orange-600 hover:to-yellow-600 rounded-xl transition-all hover:scale-105 hover:shadow-lg hover:shadow-orange-500/30"
              onClick={getTestUSDC}
              disabled={isLoading}
            >
              <Flame className="w-5 h-5 mr-2" />
              Get TestUSDC
            </Button>
            <Button 
              className="h-14 btn-groovy font-black text-lg rounded-xl"
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
              ? 'border-cyan-500/50 bg-cyan-500/10 text-cyan-400' 
              : status.includes('❌')
              ? 'border-red-500/50 bg-red-500/10 text-red-400'
              : 'border-pink-500/50 bg-pink-500/10 text-pink-400'
          )}>
            {status}
          </div>
        )}
      </div>

      {/* Recent Transactions */}
      <div className="glass p-8 rounded-3xl border border-purple-500/30 neon-purple">
        <h3 className="text-2xl font-black gradient-text-alt mb-6 display-font">
          Recent Transactions
        </h3>
        
        <div className="space-y-3">
          {recentTxs.map((tx, i) => (
            <div 
              key={i}
              className="flex items-center justify-between p-4 rounded-xl bg-black/30 border border-white/10 hover:border-cyan-500/30 transition-all hover:bg-black/50"
            >
              <div className="flex items-center gap-3">
                <code className="text-cyan-400 text-sm">{tx.hash}</code>
                <span className="text-gray-500">→</span>
                <span className="text-white">{tx.to}</span>
              </div>
              <span className="text-pink-400 font-bold">{tx.amount}</span>
            </div>
          ))}
          
          {recentTxs.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No transactions yet...
            </div>
          )}
        </div>

        {/* Placeholder for more transactions */}
        <div className="mt-4 p-4 rounded-xl bg-black/50 border border-dashed border-white/10 text-center text-gray-600">
          Awaiting new transactions...
        </div>
      </div>
    </div>
  )
}