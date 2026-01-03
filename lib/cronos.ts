import { createConfig, http } from 'wagmi'
import { cronosTestnet } from 'viem/chains'
import { injected, walletConnect, coinbaseWallet } from 'wagmi/connectors'

// WalletConnect Project ID - get yours at https://cloud.walletconnect.com
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID

if (!projectId) {
  console.warn(
    '⚠️ NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is not set. WalletConnect will not work.'
  )
}

// App metadata for WalletConnect
const metadata = {
  name: 'CroGas - Agent Gas Station',
  description: 'Pay Cronos gas fees with USDC. No CRO required.',
  url: typeof window !== 'undefined' ? window.location.origin : 'https://crogas.xyz',
  icons: ['https://crogas.xyz/icon.png'],
}

export const cronosConfig = createConfig({
  chains: [cronosTestnet],
  connectors: [
    // WalletConnect v2 - Primary focus for mobile + desktop
    walletConnect({
      projectId: projectId || '',
      metadata,
      showQrModal: true, // Shows the WalletConnect QR modal
    }),
    // MetaMask - Browser extension
    injected({
      target: 'metaMask',
    }),
    // Coinbase Wallet
    coinbaseWallet({
      appName: metadata.name,
      appLogoUrl: metadata.icons[0],
    }),
    // NOTE: Removed generic injected() connector - it was causing duplicate MetaMask entries
    // because it also detects MetaMask and registers it with a different connector ID
  ],
  transports: {
    [cronosTestnet.id]: http('https://evm-t3.cronos.org'),
  },
})

// Contract addresses on Cronos Testnet
export const CONTRACTS = {
  MINIMAL_FORWARDER: '0x523D5F604788a9cFC74CcF81F0DE5B3b5623635F' as const,
  TEST_USDC: '0x38Bf87D7281A2F84c8ed5aF1410295f7BD4E20a1' as const,
  RELAYER_WALLET: '0xF40B9a42cD26166051455c23508C2EbA997da7e2' as const,
}

// EIP-712 Domain for MinimalForwarder
export const FORWARDER_DOMAIN = {
  name: 'MinimalForwarder',
  version: '0.0.1',
  chainId: cronosTestnet.id,
  verifyingContract: CONTRACTS.MINIMAL_FORWARDER,
} as const

// EIP-712 Types for ForwardRequest
export const FORWARD_REQUEST_TYPES = {
  ForwardRequest: [
    { name: 'from', type: 'address' },
    { name: 'to', type: 'address' },
    { name: 'value', type: 'uint256' },
    { name: 'gas', type: 'uint256' },
    { name: 'nonce', type: 'uint256' },
    { name: 'deadline', type: 'uint48' },
    { name: 'data', type: 'bytes' },
  ],
} as const

// Export chain for convenience
export { cronosTestnet }