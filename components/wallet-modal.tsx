'use client'

import { useState, useEffect } from 'react'
import { useConnect, useAccount, useDisconnect, useChainId, useSwitchChain, Connector } from 'wagmi'
import { X, Wallet, Link2, ExternalLink, Copy, Check, AlertCircle, AlertTriangle, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { cronosTestnet } from '@/lib/cronos'

interface WalletModalProps {
  isOpen: boolean
  onClose: () => void
}

// Wallet icon mapping
const WALLET_ICONS: Record<string, string> = {
  walletConnect: '🔗',
  metaMask: '🦊',
  'MetaMask': '🦊',
  coinbaseWallet: '🔵',
  'Coinbase Wallet': '🔵',
  injected: '👉',
}

const getWalletIcon = (connector: Connector) => {
  return WALLET_ICONS[connector.id] || WALLET_ICONS[connector.name] || '💛'
}

const getWalletDescription = (connectorId: string) => {
  switch (connectorId) {
    case 'walletConnect':
      return 'Scan with mobile wallet'
    case 'metaMask':
      return 'Browser extension'
    case 'coinbaseWallet':
      return 'Coinbase Wallet app'
    case 'injected':
      return 'Browser wallet'
    default:
      return 'Connect wallet'
  }
}

export function WalletModal({ isOpen, onClose }: WalletModalProps) {
  const { connectors, connect, status, error } = useConnect()
  const [pendingConnector, setPendingConnector] = useState<string | null>(null)

  const handleConnect = async (connector: Connector) => {
    setPendingConnector(connector.id)
    try {
      await connect({ connector })
      onClose()
    } catch (e) {
      console.error('Connection error:', e)
    } finally {
      setPendingConnector(null)
    }
  }

  // Filter out duplicate connectors with robust deduplication
  const uniqueConnectors = connectors.reduce((acc, connector) => {
    // Skip if we already have this connector by ID
    if (acc.find(c => c.id === connector.id)) return acc
    
    // Skip if we already have a connector with the same name (catches MetaMask duplicates)
    if (acc.find(c => c.name === connector.name)) return acc
    
    // Skip generic injected if we have a specific wallet that matches
    if (connector.id === 'injected' && acc.find(c => 
      c.id === 'metaMask' || c.name === 'MetaMask'
    )) return acc
    
    // Skip if this is MetaMask but we already have an injected connector named MetaMask
    if (connector.id === 'metaMask' && acc.find(c => 
      c.id === 'injected' && c.name === 'MetaMask'
    )) return acc
    
    return [...acc, connector]
  }, [] as Connector[])

  // Sort: WalletConnect first, then MetaMask, then others
  const sortedConnectors = uniqueConnectors.sort((a, b) => {
    const order = ['walletConnect', 'metaMask', 'coinbaseWallet', 'injected']
    const aIndex = order.indexOf(a.id)
    const bIndex = order.indexOf(b.id)
    // If not in order array, put at end
    return (aIndex === -1 ? 999 : aIndex) - (bIndex === -1 ? 999 : bIndex)
  })

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-[#f8f6f0] border-2 border-[#f6c25d] shadow-2xl w-full max-w-md mx-4 animate-fade-in z-[10000]">
        {/* Corner decorations */}
        <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-[#f6c25d]" />
        <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-[#f6c25d]" />
        <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-[#f6c25d]" />
        <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-[#f6c25d]" />

        {/* Header */}
        <div className="p-6 border-b border-[#d9d9d9]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#3f647e]/10 border border-[#3f647e]/30 flex items-center justify-center">
                <Wallet className="w-5 h-5 text-[#3f647e]" />
              </div>
              <div>
                <h2 className="text-xl display-font text-[#3f647e] tracking-wider">
                  Connect Wallet
                </h2>
                <p className="text-xs text-[#688fad] uppercase tracking-wider">
                  Cronos Testnet (Chain 338)
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-[#3f647e]/10 transition-colors"
            >
              <X className="w-5 h-5 text-[#688fad]" />
            </button>
          </div>
        </div>

        {/* Important Notice */}
        <div className="px-6 pt-4">
          <div className="p-3 border border-[#f6c25d] bg-[#f6c25d]/10 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-[#f6c25d] mt-0.5 flex-shrink-0" />
            <p className="text-xs text-[#3f647e]">
              <strong>Important:</strong> Make sure your wallet is set to <strong>Cronos Testnet</strong> before connecting. 
              If you're on Cronos Mainnet, you'll be prompted to switch.
            </p>
          </div>
        </div>

        {/* Wallet Options */}
        <div className="p-6 space-y-3">
          {sortedConnectors.map((connector) => {
            const isPending = pendingConnector === connector.id
            const isWalletConnect = connector.id === 'walletConnect'
            
            return (
              <button
                key={connector.id}
                onClick={() => handleConnect(connector)}
                disabled={status === 'pending'}
                className={cn(
                  'w-full p-4 border-2 transition-all duration-300 flex items-center gap-4',
                  'hover:border-[#f6c25d] hover:bg-[#f6c25d]/5',
                  isWalletConnect 
                    ? 'border-[#00b0b2] bg-[#00b0b2]/5' 
                    : 'border-[#d9d9d9] bg-white/50',
                  isPending && 'border-[#f6c25d] bg-[#f6c25d]/10'
                )}
              >
                <div className="text-3xl">{getWalletIcon(connector)}</div>
                <div className="flex-1 text-left">
                  <div className="font-semibold text-[#3f647e] flex items-center gap-2">
                    {connector.name}
                    {isWalletConnect && (
                      <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 bg-[#00b0b2]/20 text-[#00b0b2] font-semibold">
                        Recommended
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-[#688fad]">
                    {getWalletDescription(connector.id)}
                  </div>
                </div>
                <div className="flex items-center">
                  {isPending ? (
                    <div className="w-5 h-5 border-2 border-[#f6c25d] border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Link2 className="w-5 h-5 text-[#688fad]" />
                  )}
                </div>
              </button>
            )
          })}
        </div>

        {/* Error Display */}
        {error && (
          <div className="px-6 pb-4">
            <div className="p-3 border border-[#a52b36] bg-[#a52b36]/10 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-[#a52b36] mt-0.5 flex-shrink-0" />
              <p className="text-sm text-[#a52b36]">
                {error.message.includes('User rejected')
                  ? 'Connection cancelled by user'
                  : error.message.includes('Chain not configured')
                  ? 'Please switch your wallet to Cronos Testnet (Chain ID: 338)'
                  : error.message}
              </p>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="px-6 pb-6">
          <div className="pt-4 border-t border-[#d9d9d9] text-center">
            <p className="text-xs text-[#688fad]">
              New to crypto?{' '}
              <a 
                href="https://ethereum.org/wallets" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[#00b0b2] hover:underline"
              >
                Learn about wallets
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Connected wallet display component with chain switching
export function ConnectedWallet() {
  const { address, connector } = useAccount()
  const { disconnect } = useDisconnect()
  const chainId = useChainId()
  const { switchChain, isPending: isSwitching, error: switchError } = useSwitchChain()
  const [copied, setCopied] = useState(false)

  const isWrongChain = chainId !== cronosTestnet.id

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  const handleSwitchChain = () => {
    switchChain({ chainId: cronosTestnet.id })
  }

  if (!address) return null

  return (
    <div className="card-glass p-4 animate-fade-in">
      {/* Wrong Chain Warning */}
      {isWrongChain && (
        <div className="mb-4 p-3 border-2 border-[#a52b36] bg-[#a52b36]/10">
          <div className="flex items-start gap-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-[#a52b36] flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-[#a52b36]">Wrong Network</p>
              <p className="text-xs text-[#a52b36]/80">
                You're on Chain {chainId}. Please switch to Cronos Testnet (338).
              </p>
            </div>
          </div>
          <button
            onClick={handleSwitchChain}
            disabled={isSwitching}
            className="w-full py-2 bg-[#a52b36] text-white text-sm font-medium hover:bg-[#8a2430] transition-colors flex items-center justify-center gap-2"
          >
            {isSwitching ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Switching...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4" />
                Switch to Cronos Testnet
              </>
            )}
          </button>
          {switchError && (
            <p className="text-xs text-[#a52b36] mt-2">
              {switchError.message.includes('User rejected')
                ? 'Switch rejected. Please approve in your wallet.'
                : 'Failed to switch. Try adding Cronos Testnet manually.'}
            </p>
          )}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className={cn(
            'w-2 h-2 rounded-full animate-pulse',
            isWrongChain ? 'bg-[#a52b36]' : 'bg-[#879c7d]'
          )} />
          <span className={cn(
            'text-xs uppercase tracking-wider font-semibold',
            isWrongChain ? 'text-[#a52b36]' : 'text-[#879c7d]'
          )}>
            {isWrongChain ? 'Wrong Chain' : 'Connected'}
          </span>
        </div>
        <span className="text-xs text-[#688fad]">
          Chain: {chainId} {chainId === cronosTestnet.id && '✓'}
        </span>
      </div>

      {/* Address */}
      <div className="flex items-center gap-3 mb-4">
        <div className="text-2xl">
          {connector && getWalletIcon(connector)}
        </div>
        <div className="flex-1">
          <div className="font-mono text-lg text-[#3f647e]">
            {formatAddress(address)}
          </div>
          <div className="text-xs text-[#688fad]">
            {connector?.name || 'Unknown Wallet'}
          </div>
        </div>
        <button
          onClick={copyAddress}
          className="p-2 hover:bg-[#3f647e]/10 transition-colors"
          title="Copy address"
        >
          {copied ? (
            <Check className="w-4 h-4 text-[#879c7d]" />
          ) : (
            <Copy className="w-4 h-4 text-[#688fad]" />
          )}
        </button>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <a
          href={`https://explorer.cronos.org/testnet/address/${address}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 py-2 border border-[#d9d9d9] hover:border-[#00b0b2] hover:text-[#00b0b2] transition-colors text-sm text-[#688fad]"
        >
          <ExternalLink className="w-4 h-4" />
          Explorer
        </a>
        <button
          onClick={() => disconnect()}
          className="flex-1 py-2 border border-[#a52b36] text-[#a52b36] hover:bg-[#a52b36]/10 transition-colors text-sm font-medium"
        >
          Disconnect
        </button>
      </div>
    </div>
  )
}

// Simple connect button for use anywhere
export function ConnectButton({ 
  className,
  children 
}: { 
  className?: string
  children?: React.ReactNode 
}) {
  const { isConnected, address } = useAccount()
  const [isModalOpen, setIsModalOpen] = useState(false)

  if (isConnected && address) {
    return (
      <button
        className={cn(
          'flex items-center gap-2 px-4 py-2 bg-[#879c7d]/20 border border-[#879c7d] text-[#6b7d62]',
          className
        )}
      >
        <div className="w-2 h-2 rounded-full bg-[#879c7d] animate-pulse" />
        {`${address.slice(0, 6)}...${address.slice(-4)}`}
      </button>
    )
  }

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className={className}
      >
        {children || 'Connect Wallet'}
      </button>
      <WalletModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  )
}