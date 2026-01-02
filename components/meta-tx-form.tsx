'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { api } from '@/lib/api'
import { Flame, Send, Clock, Rocket, Car, ExternalLink } from 'lucide-react'
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
      label: 'Économique', 
      price: '$0.005', 
      time: '~30s',
      icon: Clock,
    },
    { 
      value: 'normal', 
      label: 'Standard', 
      price: '$0.01', 
      time: '~10s',
      icon: Car,
    },
    { 
      value: 'fast', 
      label: 'Prioritaire', 
      price: '$0.02', 
      time: '~3s',
      icon: Rocket,
    },
  ]

  const execute = async () => {
    setStatus('Executing meta-transaction...')
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
      
      setStatus(`Success: ${res.txHash.slice(0, 12)}...`)
      setRecentTxs(prev => [
        { hash: res.txHash.slice(0, 10) + '...', to: 'Contract', amount: '$0.01' },
        ...prev.slice(0, 4)
      ])
    } catch (e: any) {
      setStatus(`Error: ${e.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const getTestUSDC = async () => {
    setStatus('Requesting TestUSDC from faucet...')
    setTimeout(() => setStatus('100 TestUSDC received!'), 1500)
  }

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Execute Form */}
      <div className="card-framed animate-fade-in">
        {/* Section Header */}
        <div className="text-center mb-8">
          <h3 className="text-2xl display-font text-[#3f647e] tracking-wider mb-2">
            Execute Transaction
          </h3>
          <div className="divider-deco">
            <div className="divider-deco-icon" />
          </div>
        </div>
        
        <div className="space-y-6">
          {/* Target Contract Input */}
          <div>
            <label className="flex items-center gap-2 text-xs font-semibold mb-3 text-[#3f647e] uppercase tracking-[0.2em]">
              <Send className="w-4 h-4" />
              Target Contract
            </label>
            <input
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              placeholder="0x... Contract Address"
              className="input-deco w-full rounded-none"
            />
          </div>

          {/* Priority Tiers */}
          <div>
            <label className="flex items-center gap-2 text-xs font-semibold mb-3 text-[#3f647e] uppercase tracking-[0.2em]">
              Priority Tier
            </label>
            <div className="grid grid-cols-3 gap-3">
              {pricingTiers.map((tier) => (
                <button
                  key={tier.value}
                  onClick={() => setPriority(tier.value)}
                  className={cn(
                    'p-4 border-2 transition-all duration-300 text-center',
                    priority === tier.value 
                      ? 'border-[#f6c25d] bg-[#f6c25d]/10' 
                      : 'border-[#d9d9d9] hover:border-[#3f647e] bg-white/50'
                  )}
                >
                  <tier.icon className={cn(
                    'w-5 h-5 mx-auto mb-2',
                    priority === tier.value ? 'text-[#a52b36]' : 'text-[#688fad]'
                  )} />
                  <div className="text-xs font-semibold uppercase tracking-wider text-[#3f647e]">
                    {tier.label}
                  </div>
                  <div className={cn(
                    'text-lg display-font mt-1',
                    priority === tier.value ? 'text-[#a52b36]' : 'text-[#3f647e]'
                  )}>
                    {tier.price}
                  </div>
                  <div className="text-xs text-[#688fad] mt-1">{tier.time}</div>
                </button>
              ))}
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-4 pt-4">
            <button 
              className="btn-outline-elegant h-14 flex items-center justify-center gap-2"
              onClick={getTestUSDC}
              disabled={isLoading}
            >
              <Flame className="w-5 h-5" />
              Get TestUSDC
            </button>
            <button 
              className="btn-gold h-14 flex items-center justify-center gap-2"
              onClick={execute}
              disabled={isLoading}
            >
              <Send className="w-5 h-5" />
              Execute
            </button>
          </div>
        </div>
        
        {/* Status */}
        {status && (
          <div className={cn(
            'mt-6 p-4 border-2 text-center serif text-lg',
            status.includes('Success') || status.includes('received')
              ? 'border-[#879c7d] bg-[#879c7d]/10 text-[#6b7d62]' 
              : status.includes('Error')
              ? 'border-[#a52b36] bg-[#a52b36]/10 text-[#a52b36]'
              : 'border-[#f6c25d] bg-[#f6c25d]/10 text-[#3f647e]'
          )}>
            {status}
          </div>
        )}
      </div>

      {/* Recent Transactions */}
      <div className="card-deco p-8 animate-fade-in" style={{ animationDelay: '150ms' }}>
        {/* Section Header */}
        <div className="text-center mb-8">
          <h3 className="text-2xl display-font text-[#3f647e] tracking-wider mb-2">
            Recent Transactions
          </h3>
          <div className="divider-deco">
            <div className="divider-deco-icon" />
          </div>
        </div>
        
        <div className="space-y-3">
          {recentTxs.map((tx, i) => (
            <div 
              key={i}
              className="flex items-center justify-between p-4 bg-white/60 border border-[#d9d9d9] hover:border-[#f6c25d] transition-all group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <code className="text-[#00b0b2] text-sm font-medium">
                  {tx.hash}
                </code>
                <span className="text-[#688fad]">→</span>
                <span className="text-[#3f647e] font-medium">{tx.to}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#a52b36] font-semibold">
                  {tx.amount}
                </span>
                <ExternalLink className="w-4 h-4 text-[#d9d9d9] group-hover:text-[#f6c25d] transition-colors" />
              </div>
            </div>
          ))}
        </div>

        {/* Awaiting placeholder */}
        <div className="mt-6 p-4 border-2 border-dashed border-[#d9d9d9] text-center">
          <div className="flex items-center justify-center gap-2 text-[#688fad]">
            <div className="w-2 h-2 bg-[#879c7d] rounded-full animate-pulse" />
            <span className="text-sm uppercase tracking-wider">Awaiting new transactions</span>
          </div>
        </div>
        
        {/* Decorative footer */}
        <div className="mt-6 flex justify-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-px bg-[#f6c25d]" />
            <div className="w-2 h-2 rotate-45 bg-[#f6c25d]" />
            <div className="w-8 h-px bg-[#f6c25d]" />
          </div>
        </div>
      </div>
    </div>
  )
}