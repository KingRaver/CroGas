'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { api } from '@/lib/api'
import { cn } from '@/lib/utils'
import { Fuel, Zap, Send } from 'lucide-react'

export default function ExecutePage() {
  const [target, setTarget] = useState('0x145863Eb42Cf62847A6Ca784e6416C1682b1b2Ae')
  const [calldata, setCalldata] = useState('0x')
  const [priority, setPriority] = useState('normal')
  const [status, setStatus] = useState('')
  const [txHash, setTxHash] = useState('')

  const executeMetaTx = async () => {
    if (!target) return setStatus('❌ Enter target address')
    
    setStatus('⛽ Building meta-tx...')
    
    try {
      // Get nonce
      const nonceRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/meta/nonce/${'0xYourAgentWallet'}`)
      const { nonce } = await nonceRes.json()
      
      const request = {
        from: '0xYourAgentWallet', // TODO: wagmi account
        to: target,
        value: '0',
        gas: '250000',
        nonce: nonce.toString(),
        deadline: Math.floor(Date.now() / 1000 + 3600).toString(),
        data: calldata
      }
      
      setStatus('✍️ Signing EIP-712...')
      
      // TODO: Real wagmi signing
      const signature = '0x...' // wagmi.signTypedData
      
      setStatus('🚀 Relaying to gas station...')
      
      const res = await api.executeMetaTx({ 
        request, 
        signature, 
        priority 
      })
      
      if (res.success) {
        setStatus('✅ SUCCESS')
        setTxHash(res.txHash)
      } else {
        setStatus(`💳 x402: Pay ${res.quote?.priceUSDC || '0.01'} USDC`)
      }
      
    } catch (error: any) {
      setStatus(`❌ ${error.message}`)
    }
  }

  const pricingTiers = [
    { value: 'slow', label: '🐢 Slow', price: '$0.005', time: '~30s' },
    { value: 'normal', label: '🚗 Normal', price: '$0.01', time: '~10s' },
    { value: 'fast', label: '🚀 Fast', price: '$0.02', time: '~3s' }
  ]

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-black gradient-text mb-4">Execute Meta-Tx</h1>
        <p className="text-xl text-gray-300">Pay gas with USDC. No CRO required.</p>
      </div>

      <Card className="glass p-8 rounded-3xl border border-green-500/30 neon-green">
        <CardHeader>
          <CardTitle className="text-3xl gradient-text flex items-center gap-3">
            <Fuel className="w-10 h-10" />
            Gas Station Pump
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* Target */}
          <div>
            <label className="text-lg font-bold mb-3 text-green-400 flex items-center gap-2">
              <Send className="w-5 h-5" />
              Target Contract
            </label>
            <Input
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              placeholder="0x145863Eb42Cf62847A6Ca784e6416C1682b1b2Ae"
              className="text-xl bg-black/50 border-2 border-green-500/50 h-14"
            />
          </div>

          {/* Calldata */}
          <div>
            <label className="text-lg font-bold mb-3 text-green-400 flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Calldata
            </label>
            <Input
              value={calldata}
              onChange={(e) => setCalldata(e.target.value)}
              placeholder="0x095ea7b3000000000000000000000000..."
              className="text-lg bg-black/50 border-2 border-green-500/50 h-20"
            />
          </div>

          {/* Priority Tiers */}
          <div>
            <label className="text-lg font-bold mb-3 text-green-400 flex items-center gap-2">
              Priority Tier
            </label>
            <div className="grid grid-cols-3 gap-4">
              {pricingTiers.map((tier) => (
                <button
                  key={tier.value}
                  onClick={() => setPriority(tier.value)}
                  className={cn(
                    'glass p-4 rounded-2xl border-2 font-black text-xl transition-all hover:scale-105',
                    priority === tier.value 
                      ? 'border-green-400 bg-green-500/20 neon-green scale-105' 
                      : 'border-white/30 hover:border-green-500/50'
                  )}
                >
                  <div>{tier.label}</div>
                  <div className="text-sm opacity-75">{tier.price}</div>
                  <div className="text-xs opacity-50">{tier.time}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Execute */}
          <div className="pt-8 border-t border-white/20">
            <Button
              onClick={executeMetaTx}
              className="w-full h-16 bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 text-2xl font-black hover:from-green-600 hover:to-purple-600 neon-green px-12 py-6"
              size="lg"
            >
              ⛽ PUMP GAS (Execute Tx)
            </Button>
          </div>

          {/* Status */}
          {status && (
            <div className="p-8 rounded-3xl bg-black/50 border-2 transition-all">
              <div className="text-center font-mono text-xl mb-4">
                {status}
              </div>
              {txHash && (
                <div className="text-center">
                  <a
                    href={`https://explorer.cronos.org/testnet/tx/${txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500/20 border border-blue-500/50 rounded-xl hover:bg-blue-500/30 transition-all font-mono"
                  >
                    View on Cronoscan
                    <span className="text-xs opacity-75">→</span>
                  </a>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}