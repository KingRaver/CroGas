'use client'
import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { cn } from '@/lib/utils'
import { Fuel, Zap, Send, ExternalLink, ArrowLeft, AlertCircle, Wallet } from 'lucide-react'
import Link from 'next/link'
import { useMetaTx, getStatusMessage } from '@/hooks/useMetaTx'
import { WalletModal } from '@/components/wallet-modal'
import { addNotification } from '@/components/notifications-dropdown'

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
  const { isConnected, address } = useAccount()
  const { signAndRelay, status, error, result, isLoading, reset } = useMetaTx()
  
  const [target, setTarget] = useState('0x145863Eb42Cf62847A6Ca784e6416C1682b1b2Ae')
  const [calldata, setCalldata] = useState('0x')
  const [priority, setPriority] = useState<'slow' | 'normal' | 'fast'>('normal')
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false)

  const executeMetaTx = async () => {
    if (!isConnected) {
      setIsWalletModalOpen(true)
      return
    }

    if (!target || !target.startsWith('0x')) {
      addNotification({
        type: 'error',
        title: 'Validation Error',
        message: 'Please enter a valid target address',
      })
      return
    }
    
    addNotification({
      type: 'pending',
      title: 'Building Transaction',
      message: 'Preparing meta-transaction...',
    })
    
    const txResult = await signAndRelay(
      target as `0x${string}`,
      (calldata || '0x') as `0x${string}`,
      '0',
      '250000',
      priority
    )
    
    if (txResult.success) {
      addNotification({
        type: 'success',
        title: 'Transaction Confirmed',
        message: `Tx: ${txResult.txHash?.slice(0, 10)}...${txResult.txHash?.slice(-8)}`,
      })
    } else if (txResult.quote) {
      addNotification({
        type: 'info',
        title: 'Payment Required',
        message: `Pay ${txResult.quote.priceUSDC} USDC to proceed`,
      })
    } else if (txResult.error) {
      addNotification({
        type: 'error',
        title: 'Transaction Failed',
        message: txResult.error,
      })
    }
  }

  const pricingTiers: Array<{
    value: 'slow' | 'normal' | 'fast'
    label: string
    price: string
    time: string
    icon: string
  }> = [
    { value: 'slow', label: 'Économique', price: '$0.005', time: '~30s', icon: '◇' },
    { value: 'normal', label: 'Standard', price: '$0.01', time: '~10s', icon: '◆' },
    { value: 'fast', label: 'Prioritaire', price: '$0.02', time: '~3s', icon: '▣' }
  ]

  const statusMessage = getStatusMessage(status)

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
          
          {/* Wallet Status */}
          {isConnected && address ? (
            <div className="flex items-center gap-2 px-4 py-2 bg-[#879c7d]/10 border border-[#879c7d]">
              <div className="w-2 h-2 rounded-full bg-[#879c7d] animate-pulse" />
              <span className="text-sm font-mono text-[#6b7d62]">
                {address.slice(0, 6)}...{address.slice(-4)}
              </span>
            </div>
          ) : (
            <button
              onClick={() => setIsWalletModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 border-2 border-[#f6c25d] text-[#3f647e] hover:bg-[#f6c25d]/10 transition-colors"
            >
              <Wallet className="w-4 h-4" />
              <span className="text-sm font-medium">Connect Wallet</span>
            </button>
          )}
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

        {/* Connection Warning */}
        {!isConnected && (
          <div className="mb-8 p-4 border-2 border-[#f6c25d] bg-[#f6c25d]/10 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-[#f6c25d] flex-shrink-0" />
            <div className="flex-1">
              <p className="text-[#3f647e] font-medium">Wallet not connected</p>
              <p className="text-sm text-[#688fad]">Connect your wallet to execute meta-transactions</p>
            </div>
            <button
              onClick={() => setIsWalletModalOpen(true)}
              className="px-4 py-2 bg-[#f6c25d] text-white font-medium hover:bg-[#e5b34c] transition-colors"
            >
              Connect
            </button>
          </div>
        )}

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
            {/* From Address (read-only, shows connected wallet) */}
            <div>
              <label className="flex items-center gap-2 text-xs font-semibold mb-3 text-[#3f647e] uppercase tracking-[0.2em]">
                <Wallet className="w-4 h-4 text-[#879c7d]" />
                From Address
              </label>
              <div className="input-deco w-full rounded-none text-lg h-14 flex items-center px-4 bg-[#f8f6f0] text-[#688fad] font-mono">
                {address || 'Connect wallet to see address'}
              </div>
            </div>

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
                    disabled={isLoading}
                    className={cn(
                      'p-5 border-2 transition-all duration-300 text-center relative',
                      priority === tier.value 
                        ? 'border-[#f6c25d] bg-[#f6c25d]/10' 
                        : 'border-[#d9d9d9] hover:border-[#3f647e] bg-white/50',
                      isLoading && 'opacity-50 cursor-not-allowed'
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
                disabled={isLoading}
                className={cn(
                  'btn-deco w-full h-16 flex items-center justify-center gap-3 text-xl',
                  isLoading && 'opacity-70 cursor-wait'
                )}
              >
                {isLoading ? (
                  <>
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {statusMessage}
                  </>
                ) : (
                  <>
                    <Fuel className="w-6 h-6" />
                    {isConnected ? 'Execute Transaction' : 'Connect Wallet to Execute'}
                  </>
                )}
              </button>
            </div>

            {/* Status Display */}
            {(status !== 'idle' || error) && (
              <div className={cn(
                'p-6 border-2 text-center transition-all',
                status === 'success'
                  ? 'border-[#879c7d] bg-[#879c7d]/10' 
                  : status === 'error'
                  ? 'border-[#a52b36] bg-[#a52b36]/10'
                  : status === 'payment-required'
                  ? 'border-[#00b0b2] bg-[#00b0b2]/10'
                  : 'border-[#f6c25d] bg-[#f6c25d]/10'
              )}>
                <p className={cn(
                  'serif text-lg italic mb-4',
                  status === 'success' ? 'text-[#6b7d62]' :
                  status === 'error' ? 'text-[#a52b36]' :
                  status === 'payment-required' ? 'text-[#00b0b2]' :
                  'text-[#3f647e]'
                )}>
                  {error || statusMessage}
                  {result?.quote && ` - ${result.quote.priceUSDC} USDC`}
                </p>
                
                {result?.txHash && (
                  <a
                    href={`https://explorer.cronos.org/testnet/tx/${result.txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 border-2 border-[#00b0b2] text-[#00b0b2] hover:bg-[#00b0b2]/10 transition-all font-medium uppercase tracking-wider text-sm"
                  >
                    View on Cronoscan
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}

                {(status === 'error' || status === 'success') && (
                  <button
                    onClick={reset}
                    className="mt-4 block mx-auto text-sm text-[#688fad] hover:text-[#3f647e] underline"
                  >
                    Reset
                  </button>
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

      {/* Wallet Modal */}
      <WalletModal 
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
      />
    </main>
  )
}