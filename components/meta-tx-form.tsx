'use client'
import { useState, useEffect, useCallback } from 'react'
import { useAccount } from 'wagmi'
import { api, StoredTransaction } from '@/lib/api'
import { Flame, Send, Clock, Rocket, Car, ExternalLink, Wallet, AlertCircle, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useMetaTx, getStatusMessage } from '@/hooks/useMetaTx'
import { WalletModal } from '@/components/wallet-modal'
import { addNotification } from '@/components/notifications-dropdown'
import { getSettings } from '@/components/settings-dropdown'
import { CONTRACTS } from '@/lib/cronos'

// localStorage key for transaction history
const TX_HISTORY_KEY = 'crogas-tx-history'
const MAX_TRANSACTIONS = 10

interface RecentTx {
  txHash: string
  from: string
  to: string
  priceUSDC: string
  priority: string
  timestamp: number
  explorerUrl: string
}

// Helper to format address for display
function formatAddress(address: string): string {
  if (!address || address.length < 10) return address
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

// Helper to format timestamp
function formatTimestamp(timestamp: number): string {
  const now = Date.now()
  const diff = now - timestamp
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  
  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  return new Date(timestamp).toLocaleDateString()
}

// Load transactions from localStorage
function loadLocalHistory(): RecentTx[] {
  if (typeof window === 'undefined') return []
  try {
    const stored = localStorage.getItem(TX_HISTORY_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (e) {
    console.warn('Failed to load tx history from localStorage:', e)
  }
  return []
}

// Save transactions to localStorage
function saveLocalHistory(txs: RecentTx[]) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(TX_HISTORY_KEY, JSON.stringify(txs.slice(0, MAX_TRANSACTIONS)))
  } catch (e) {
    console.warn('Failed to save tx history to localStorage:', e)
  }
}

// Convert backend StoredTransaction to our RecentTx format
function convertToRecentTx(tx: StoredTransaction): RecentTx {
  return {
    txHash: tx.txHash,
    from: tx.from,
    to: tx.to,
    priceUSDC: tx.priceUSDC,
    priority: tx.priority,
    timestamp: tx.timestamp,
    explorerUrl: `https://explorer.cronos.org/testnet/tx/${tx.txHash}`
  }
}

export default function MetaTxForm() {
  const { isConnected, address } = useAccount()
  const { signAndRelay, status, error, result, isLoading, reset } = useMetaTx()
  
  const [target, setTarget] = useState('0x145863Eb42Cf62847A6Ca784e6416C1682b1b2Ae')
  const [priority, setPriority] = useState<'slow' | 'normal' | 'fast'>('normal')
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false)
  const [recentTxs, setRecentTxs] = useState<RecentTx[]>([])
  const [isLoadingHistory, setIsLoadingHistory] = useState(false)

  // Load default gas tier from settings on mount
  useEffect(() => {
    const settings = getSettings()
    setPriority(settings.defaultGasTier)
  }, [])

  // Load transaction history on mount and when address changes
  const loadHistory = useCallback(async () => {
    // First, load from localStorage for instant display
    const localTxs = loadLocalHistory()
    if (localTxs.length > 0) {
      setRecentTxs(localTxs)
    }

    // Then try to fetch from backend if connected
    if (isConnected && address) {
      setIsLoadingHistory(true)
      try {
        const { transactions } = await api.getHistory(address, MAX_TRANSACTIONS)
        if (transactions.length > 0) {
          const converted = transactions.map(convertToRecentTx)
          setRecentTxs(converted)
          saveLocalHistory(converted)
        }
      } catch (e) {
        console.warn('Failed to fetch history from backend:', e)
        // Keep localStorage data as fallback
      } finally {
        setIsLoadingHistory(false)
      }
    }
  }, [isConnected, address])

  useEffect(() => {
    loadHistory()
  }, [loadHistory])

  const pricingTiers: Array<{
    value: 'slow' | 'normal' | 'fast'
    label: string
    price: string
    time: string
    icon: typeof Clock
  }> = [
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
    if (!isConnected || !address) {
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
      '0x' as `0x${string}`,
      '0',
      '200000',
      priority
    )

    if (txResult.success && txResult.txHash) {
      addNotification({
        type: 'success',
        title: 'Transaction Confirmed',
        message: `Tx: ${txResult.txHash.slice(0, 10)}...${txResult.txHash.slice(-8)}`,
      })
      
      // Add to recent transactions with actual target address
      const newTx: RecentTx = {
        txHash: txResult.txHash,
        from: address,
        to: target,
        priceUSDC: txResult.quote?.priceUSDC || pricingTiers.find(t => t.value === priority)?.price.replace('$', '') || '0.01',
        priority,
        timestamp: Date.now(),
        explorerUrl: `https://explorer.cronos.org/testnet/tx/${txResult.txHash}`
      }
      
      setRecentTxs(prev => {
        const updated = [newTx, ...prev].slice(0, MAX_TRANSACTIONS)
        saveLocalHistory(updated)
        return updated
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

  const getTestUSDC = async () => {
    if (!isConnected || !address) {
      setIsWalletModalOpen(true)
      return
    }

    addNotification({
      type: 'pending',
      title: 'Requesting TestUSDC',
      message: 'Contacting faucet...',
    })

    try {
      const data = await api.requestFaucet(address)
      addNotification({
        type: 'success',
        title: 'Faucet Success',
        message: data.message || '100 TestUSDC received!',
      })
    } catch (e: any) {
      addNotification({
        type: 'error',
        title: 'Faucet Error',
        message: e.message || 'Failed to contact faucet',
      })
    }
  }

  const statusMessage = getStatusMessage(status)

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

        {/* Wallet Connection Status */}
        {!isConnected ? (
          <div className="mb-6 p-4 border-2 border-[#f6c25d] bg-[#f6c25d]/10 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-[#f6c25d] flex-shrink-0" />
            <div className="flex-1">
              <p className="text-[#3f647e] font-medium text-sm">Wallet not connected</p>
              <p className="text-xs text-[#688fad]">Connect to execute transactions</p>
            </div>
            <button
              onClick={() => setIsWalletModalOpen(true)}
              className="px-3 py-1.5 bg-[#f6c25d] text-white text-sm font-medium hover:bg-[#e5b34c] transition-colors"
            >
              Connect
            </button>
          </div>
        ) : (
          <div className="mb-6 p-3 border border-[#879c7d] bg-[#879c7d]/10 flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-[#879c7d] animate-pulse" />
            <div className="flex-1">
              <p className="text-xs text-[#688fad] uppercase tracking-wider">Connected</p>
              <p className="text-sm font-mono text-[#3f647e]">
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </p>
            </div>
            <Wallet className="w-4 h-4 text-[#879c7d]" />
          </div>
        )}
        
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
              disabled={isLoading}
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
                  disabled={isLoading}
                  className={cn(
                    'p-4 border-2 transition-all duration-300 text-center',
                    priority === tier.value 
                      ? 'border-[#f6c25d] bg-[#f6c25d]/10' 
                      : 'border-[#d9d9d9] hover:border-[#3f647e] bg-white/50',
                    isLoading && 'opacity-50 cursor-not-allowed'
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
              className={cn(
                "btn-outline-elegant h-14 flex items-center justify-center gap-2",
                isLoading && 'opacity-50 cursor-not-allowed'
              )}
              onClick={getTestUSDC}
              disabled={isLoading}
            >
              <Flame className="w-5 h-5" />
              Get TestUSDC
            </button>
            <button 
              className={cn(
                "btn-gold h-14 flex items-center justify-center gap-2",
                isLoading && 'opacity-70 cursor-wait'
              )}
              onClick={execute}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span className="text-sm">Signing...</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Execute
                </>
              )}
            </button>
          </div>
        </div>
        
        {/* Status */}
        {(status !== 'idle' || error) && (
          <div className={cn(
            'mt-6 p-4 border-2 text-center serif text-lg',
            status === 'success'
              ? 'border-[#879c7d] bg-[#879c7d]/10 text-[#6b7d62]' 
              : status === 'error'
              ? 'border-[#a52b36] bg-[#a52b36]/10 text-[#a52b36]'
              : status === 'payment-required'
              ? 'border-[#00b0b2] bg-[#00b0b2]/10 text-[#00b0b2]'
              : 'border-[#f6c25d] bg-[#f6c25d]/10 text-[#3f647e]'
          )}>
            {error || statusMessage}
            {result?.quote && ` - ${result.quote.priceUSDC} USDC`}
            
            {result?.txHash && (
              <a
                href={`https://explorer.cronos.org/testnet/tx/${result.txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block mt-3 text-sm text-[#00b0b2] hover:underline"
              >
                View on Explorer →
              </a>
            )}

            {(status === 'error' || status === 'success') && (
              <button
                onClick={reset}
                className="block mx-auto mt-3 text-xs text-[#688fad] hover:text-[#3f647e] underline"
              >
                Reset
              </button>
            )}
          </div>
        )}
      </div>

      {/* Recent Transactions */}
      <div className="card-deco p-8 animate-fade-in" style={{ animationDelay: '150ms' }}>
        {/* Section Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3">
            <h3 className="text-2xl display-font text-[#3f647e] tracking-wider mb-2">
              Recent Transactions
            </h3>
            {isConnected && (
              <button
                onClick={loadHistory}
                disabled={isLoadingHistory}
                className="p-1.5 text-[#688fad] hover:text-[#3f647e] transition-colors"
                title="Refresh history"
              >
                <RefreshCw className={cn('w-4 h-4', isLoadingHistory && 'animate-spin')} />
              </button>
            )}
          </div>
          <div className="divider-deco">
            <div className="divider-deco-icon" />
          </div>
        </div>
        
        <div className="space-y-3">
          {isLoadingHistory && recentTxs.length === 0 ? (
            <div className="text-center py-8 text-[#688fad]">
              <div className="w-6 h-6 border-2 border-[#688fad]/30 border-t-[#688fad] rounded-full animate-spin mx-auto mb-3" />
              <p className="text-sm italic">Loading history...</p>
            </div>
          ) : recentTxs.length === 0 ? (
            <div className="text-center py-8 text-[#688fad]">
              <p className="text-sm italic">No transactions yet</p>
              <p className="text-xs mt-1">Execute a meta-transaction to see it here</p>
            </div>
          ) : (
            recentTxs.map((tx, i) => (
              <a 
                key={`${tx.txHash}-${i}`}
                href={tx.explorerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-4 bg-white/60 border border-[#d9d9d9] hover:border-[#f6c25d] transition-all group cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <code className="text-[#00b0b2] text-sm font-medium">
                    {formatAddress(tx.txHash)}
                  </code>
                  <div className="flex items-center gap-2">
                    <span className="text-[#a52b36] font-semibold text-sm">
                      ${tx.priceUSDC}
                    </span>
                    <ExternalLink className="w-4 h-4 text-[#d9d9d9] group-hover:text-[#f6c25d] transition-colors" />
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-[#688fad]">
                    <span>To:</span>
                    <code className="text-[#3f647e] font-medium">{formatAddress(tx.to)}</code>
                  </div>
                  <span className="text-[#688fad]">{formatTimestamp(tx.timestamp)}</span>
                </div>
              </a>
            ))
          )}
        </div>

        {/* Awaiting placeholder */}
        <div className="mt-6 p-4 border-2 border-dashed border-[#d9d9d9] text-center">
          <div className="flex items-center justify-center gap-2 text-[#688fad]">
            <div className="w-2 h-2 bg-[#879c7d] rounded-full animate-pulse" />
            <span className="text-sm uppercase tracking-wider">Awaiting new transactions</span>
          </div>
        </div>
        
        {/* Transaction count */}
        {recentTxs.length > 0 && (
          <p className="text-center text-xs text-[#688fad] mt-4">
            Showing {recentTxs.length} of {MAX_TRANSACTIONS} max
          </p>
        )}
        
        {/* Decorative footer */}
        <div className="mt-6 flex justify-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-px bg-[#f6c25d]" />
            <div className="w-2 h-2 rotate-45 bg-[#f6c25d]" />
            <div className="w-8 h-px bg-[#f6c25d]" />
          </div>
        </div>
      </div>

      {/* Wallet Modal */}
      <WalletModal 
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
      />
    </div>
  )
}