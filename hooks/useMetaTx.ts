'use client'

import { useAccount, useSignTypedData, useChainId } from 'wagmi'
import { useState, useCallback } from 'react'
import { FORWARDER_DOMAIN, FORWARD_REQUEST_TYPES, CONTRACTS } from '@/lib/cronos'
import { api } from '@/lib/api'

export interface ForwardRequest {
  from: `0x${string}`
  to: `0x${string}`
  value: string
  gas: string
  nonce: string
  deadline: string
  data: `0x${string}`
}

export interface MetaTxResult {
  success: boolean
  txHash?: string
  paymentTxHash?: string
  error?: string
  quote?: {
    priceUSDC: string
    priority: string
  }
}

export type MetaTxStatus = 
  | 'idle'
  | 'fetching-nonce'
  | 'awaiting-signature'
  | 'relaying'
  | 'success'
  | 'error'
  | 'payment-required'

export function useMetaTx() {
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const { signTypedDataAsync } = useSignTypedData()
  
  const [status, setStatus] = useState<MetaTxStatus>('idle')
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<MetaTxResult | null>(null)

  const fetchNonce = useCallback(async (userAddress: `0x${string}`): Promise<string> => {
    try {
      const data = await api.getNonce(userAddress)
      return data.nonce.toString()
    } catch (e) {
      // If nonce fetch fails, start at 0 (common for new users)
      console.warn('Nonce fetch failed, using 0:', e)
      return '0'
    }
  }, [])

  const signAndRelay = useCallback(async (
    to: `0x${string}`,
    data: `0x${string}` = '0x',
    value: string = '0',
    gas: string = '250000',
    priority: 'slow' | 'normal' | 'fast' = 'normal'
  ): Promise<MetaTxResult> => {
    if (!isConnected || !address) {
      const err = 'Wallet not connected'
      setError(err)
      setStatus('error')
      return { success: false, error: err }
    }

    setError(null)
    setResult(null)

    try {
      // Step 1: Fetch nonce
      setStatus('fetching-nonce')
      const nonce = await fetchNonce(address)
      
      // Step 2: Build the forward request
      const deadline = Math.floor(Date.now() / 1000 + 3600).toString() // 1 hour from now
      
      const forwardRequest: ForwardRequest = {
        from: address,
        to,
        value,
        gas,
        nonce,
        deadline,
        data,
      }

      // Step 3: Sign with EIP-712
      setStatus('awaiting-signature')
      
      const signature = await signTypedDataAsync({
        domain: {
          name: FORWARDER_DOMAIN.name,
          version: FORWARDER_DOMAIN.version,
          chainId: FORWARDER_DOMAIN.chainId,
          verifyingContract: FORWARDER_DOMAIN.verifyingContract,
        },
        types: FORWARD_REQUEST_TYPES,
        primaryType: 'ForwardRequest',
        message: {
          from: forwardRequest.from,
          to: forwardRequest.to,
          value: BigInt(forwardRequest.value),
          gas: BigInt(forwardRequest.gas),
          nonce: BigInt(forwardRequest.nonce),
          deadline: Number(forwardRequest.deadline),
          data: forwardRequest.data,
        },
      })

      // Step 4: Relay to gas station
      setStatus('relaying')
      
      const relayResult = await api.executeMetaTx({
        request: forwardRequest,
        signature,
        priority,
      })

      // Handle x402 payment required
      if (relayResult.error === 'Payment Required' || relayResult.x402) {
        setStatus('payment-required')
        const paymentResult: MetaTxResult = {
          success: false,
          quote: relayResult.quote,
        }
        setResult(paymentResult)
        return paymentResult
      }

      // Success!
      if (relayResult.success) {
        setStatus('success')
        const successResult: MetaTxResult = {
          success: true,
          txHash: relayResult.txHash,
          paymentTxHash: relayResult.paymentTxHash,
        }
        setResult(successResult)
        return successResult
      }

      // Unknown error
      throw new Error(relayResult.error || 'Unknown error from relay')

    } catch (e: any) {
      const errorMessage = e.message || 'Transaction failed'
      
      // Handle user rejection
      if (errorMessage.includes('User rejected') || errorMessage.includes('user rejected')) {
        setError('Signature rejected by user')
        setStatus('error')
        return { success: false, error: 'Signature rejected by user' }
      }
      
      setError(errorMessage)
      setStatus('error')
      return { success: false, error: errorMessage }
    }
  }, [address, isConnected, fetchNonce, signTypedDataAsync])

  const reset = useCallback(() => {
    setStatus('idle')
    setError(null)
    setResult(null)
  }, [])

  return {
    // State
    status,
    error,
    result,
    isConnected,
    address,
    
    // Actions
    signAndRelay,
    reset,
    
    // Derived state
    isLoading: ['fetching-nonce', 'awaiting-signature', 'relaying'].includes(status),
    isSuccess: status === 'success',
    isError: status === 'error',
    isPaymentRequired: status === 'payment-required',
  }
}

// Helper to get status message
export function getStatusMessage(status: MetaTxStatus): string {
  switch (status) {
    case 'idle':
      return 'Ready to execute'
    case 'fetching-nonce':
      return 'Fetching nonce...'
    case 'awaiting-signature':
      return 'Please sign the message in your wallet...'
    case 'relaying':
      return 'Relaying to gas station...'
    case 'success':
      return 'Transaction successful!'
    case 'error':
      return 'Transaction failed'
    case 'payment-required':
      return 'Payment required'
    default:
      return ''
  }
}