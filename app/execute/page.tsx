'use client'
import { useState, useEffect } from 'react'
import { api } from '@/lib/api'
import { cn } from '@/lib/utils'
import { Fuel, Zap, Send, ExternalLink, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import SettingsDropdown, { getSettings } from '@/components/settings-dropdown'
import NotificationsDropdown, { addNotification } from '@/components/notifications-dropdown'

function DecoDivider() {
  return (
    <div className="flex items-center justify-center gap-4 my-8">
      <div className="w-16 h-px bg-gradient-to-r from-transparent to-[#f6c25d]" />
      <div className="relative">
        <div className="w-3 h-3 rotate-45 bg-[#f6c25d]" />
        <div className="absolute inset-[3px] rotate-45 bg-[#f8f6f0]" />
      </div>
      <div className="w-16 h-px bg-gradient-to-l from-transparent to-[#f6c25d]" />
    </div>
  )
}

export default function ExecutePage() {
  const [target, setTarget] = useState('0x145863Eb42Cf62847A6Ca784e6416C1682b1b2Ae')
  const [calldata, setCalldata] = useState('0x')
  const [priority, setPriority] = useState('normal')
  const [status, setStatus] = useState('')
  const [txHash, setTxHash] = useState('')

  // Load default gas tier from settings on mount
  useEffect(() => {
    const settings = getSettings()
    setPriority(settings.defaultGasTier)
  }, [])

  const executeMetaTx = async () => {
    if (!target) {
      setStatus('Please enter target address')
      addNotification({
        type: 'error',
        title: 'Validation Error',
        message: 'Please enter a target address',
      })
      return
    }
    
    setStatus('Building meta-transaction...')
    addNotification({
      type: 'pending',
      title: 'Building Transaction',
      message: 'Preparing meta-transaction...',
    })
    
    try {
      const nonceRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/meta/nonce/${'0xYourAgentWallet'}`)
      const { nonce } = await nonceRes.json()
      
      const request = {
        from: '0xYourAgentWallet',
        to: target,
        value: '0',
        gas: '250000',
        nonce: nonce.toString(),
        deadline: Math.floor(Date.now() / 1000 + 3600).toString(),
        data: calldata
      }
      
      setStatus('Signing EIP-712 message...')
      addNotification({
        type: 'pending',
        title: 'Awaiting Signature',
        message: 'Please sign the EIP-712 message...',
      })
      
      const signature = '0x...'
      
      setStatus('Relaying to gas station...')
      addNotification({
        type: 'pending',
        title: 'Relaying Transaction',
        message: 'Submitting to gas station relayer...',
      })
      
      const res = await api.executeMetaTx({ 
        request, 
        signature, 
        priority 
      })
      
      if (res.success) {
        setStatus('Transaction successful!')
        setTxHash(res.txHash)
        addNotification({
          type: 'success',
          title: 'Transaction Confirmed',
          message: `Tx hash: ${res.txHash.slice(0, 10)}...${res.txHash.slice(-8)}`,
        })
      } else {
        setStatus(`Payment required: ${res.quote?.priceUSDC || '0.01'} USDC`)
        addNotification({
          type: 'info',
          title: 'Payment Required',
          message: `Pay ${res.quote?.priceUSDC || '0.01'} USDC to proceed`,
        })
      }
      
    } catch (error: any) {
      setStatus(`Error: ${error.message}`)
      addNotification({
        type: 'error',
        title: 'Transaction Failed',
        message: error.message,
      })
    }
  }

  const pricingTiers = [
    { value: 'slow', label: 'Économique', price: '$0.005', time: '~30s', icon: '◇' },
    { value: 'normal', label: 'Standard', price: '$0.01', time: '~10s', icon: '◆' },
    { value: 'fast', label: 'Prioritaire', price: '$0.02', time: '~3s', icon: '❖' }
  ]

  return (
    <main className="min-h-screen">
      {/* Header */}
      <div className="container mx-auto px-4 pt-8">
        <div className="flex items-center justify-between mb-8">
          <Link 
            href="/dashboard"
            className="inline-flex items-center gap-2 text-[#3f647e] hover:text-[#a52b36] transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium uppercase tracking-wider text-sm">Back to Dashboard</span>
          </Link>
          
          <div className="flex items-center gap-3">
            <NotificationsDropdown />
            <SettingsDropdown />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Page Header */}
        <div className="text-center mb-12">
          {/* Ornamental top piece */}
          <div className="flex justify-center mb-6">
            <svg width="100" height="30" viewBox="0 0 100 30" fill="none" className="opacity-50">
              <path d="M0 15 L25 15 L35 5 L50 15 L65 5 L75 15 L100 15" stroke="#f6c25d" strokeWidth="2" fill="none"/>
              <circle cx="50" cy="15" r="3" fill="#3f647e"/>
            </svg>
          </div>
          
          <h1 className="text-4xl md:text-5xl display-font tracking-wider mb-4">
            <span className="text-[#3f647e]">Execute</span>
            <span className="text-gold-gradient ml-3">Meta-Tx</span>
          </h1>
          <p className="text-lg text-[#688fad] serif italic">
            Pay gas with USDC. No CRO required.
          </p>
        </div>

        {/* Main Card */}
        <div className="card-framed animate-fade-in">
          {/* Card Header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-[#00b0b2]/10 border-2 border-[#00b0b2]/30 flex items-center justify-center">
              <Fuel className="w-7 h-7 text-[#00b0b2]" />
            </div>
            <div>
              <h2 className="text-2xl display-font text-[#3f647e] tracking-wider">
                Gas Station Pump
              </h2>
              <p className="text-sm text-[#688fad] uppercase tracking-[0.15em]">
                Transaction Builder
              </p>
            </div>
          </div>

          <DecoDivider />

          <div className="space-y-8">
            {/* Target Contract */}
            <div>
              <label className="flex items-center gap-2 text-xs font-semibold mb-3 text-[#3f647e] uppercase tracking-[0.2em]">
                <Send className="w-4 h-4 text-[#a52b36]" />
                Target Contract
              </label>
              <input
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                placeholder="0x145863Eb42Cf62847A6Ca784e6416C1682b1b2Ae"
                className="input-deco w-full rounded-none text-lg h-14"
              />
            </div>

            {/* Calldata */}
            <div>
              <label className="flex items-center gap-2 text-xs font-semibold mb-3 text-[#3f647e] uppercase tracking-[0.2em]">
                <Zap className="w-4 h-4 text-[#f6c25d]" />
                Calldata
              </label>
              <textarea
                value={calldata}
                onChange={(e) => setCalldata(e.target.value)}
                placeholder="0x095ea7b3000000000000000000000000..."
                className="input-deco w-full rounded-none text-base h-24 resize-none font-mono"
              />
            </div>

            {/* Priority Tiers */}
            <div>
              <label className="flex items-center gap-2 text-xs font-semibold mb-4 text-[#3f647e] uppercase tracking-[0.2em]">
                Priority Tier
              </label>
              <div className="grid grid-cols-3 gap-4">
                {pricingTiers.map((tier) => (
                  <button
                    key={tier.value}
                    onClick={() => setPriority(tier.value)}
                    className={cn(
                      'p-5 border-2 transition-all duration-300 text-center relative',
                      priority === tier.value 
                        ? 'border-[#f6c25d] bg-[#f6c25d]/10' 
                        : 'border-[#d9d9d9] hover:border-[#3f647e] bg-white/50'
                    )}
                  >
                    {/* Corner accents when selected */}
                    {priority === tier.value && (
                      <>
                        <div className="absolute top-1 left-1 w-3 h-3 border-l-2 border-t-2 border-[#f6c25d]" />
                        <div className="absolute bottom-1 right-1 w-3 h-3 border-r-2 border-b-2 border-[#f6c25d]" />
                      </>
                    )}
                    
                    <div className={cn(
                      'text-2xl mb-2',
                      priority === tier.value ? 'text-[#a52b36]' : 'text-[#d9d9d9]'
                    )}>
                      {tier.icon}
                    </div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-[#3f647e] mb-1">
                      {tier.label}
                    </div>
                    <div className={cn(
                      'text-xl display-font',
                      priority === tier.value ? 'text-[#a52b36]' : 'text-[#3f647e]'
                    )}>
                      {tier.price}
                    </div>
                    <div className="text-xs text-[#688fad] mt-1">{tier.time}</div>
                  </button>
                ))}
              </div>
            </div>

            <DecoDivider />

            {/* Execute Button */}
            <div className="pt-4">
              <button
                onClick={executeMetaTx}
                className="btn-deco w-full h-16 flex items-center justify-center gap-3 text-xl"
              >
                <Fuel className="w-6 h-6" />
                Execute Transaction
              </button>
            </div>

            {/* Status */}
            {status && (
              <div className={cn(
                'p-6 border-2 text-center transition-all',
                status.includes('successful') || status.includes('received')
                  ? 'border-[#879c7d] bg-[#879c7d]/10' 
                  : status.includes('Error')
                  ? 'border-[#a52b36] bg-[#a52b36]/10'
                  : 'border-[#f6c25d] bg-[#f6c25d]/10'
              )}>
                <p className={cn(
                  'serif text-lg italic mb-4',
                  status.includes('successful') ? 'text-[#6b7d62]' :
                  status.includes('Error') ? 'text-[#a52b36]' : 'text-[#3f647e]'
                )}>
                  {status}
                </p>
                
                {txHash && (
                  <a
                    href={`https://explorer.cronos.org/testnet/tx/${txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 border-2 border-[#00b0b2] text-[#00b0b2] hover:bg-[#00b0b2]/10 transition-all font-medium uppercase tracking-wider text-sm"
                  >
                    View on Cronoscan
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer ornament */}
        <div className="flex justify-center mt-12">
          <svg width="150" height="30" viewBox="0 0 150 30" fill="none" className="opacity-30">
            <path d="M0 15 L50 15" stroke="#3f647e" strokeWidth="1"/>
            <rect x="55" y="10" width="10" height="10" fill="none" stroke="#f6c25d" strokeWidth="1" transform="rotate(45 60 15)"/>
            <rect x="70" y="12" width="6" height="6" fill="#f6c25d" transform="rotate(45 73 15)"/>
            <rect x="85" y="10" width="10" height="10" fill="none" stroke="#f6c25d" strokeWidth="1" transform="rotate(45 90 15)"/>
            <path d="M100 15 L150 15" stroke="#3f647e" strokeWidth="1"/>
          </svg>
        </div>
      </div>
    </main>
  )
}