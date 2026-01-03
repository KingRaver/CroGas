const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export interface MetaTxPayload {
  request: {
    from: string
    to: string
    value: string
    gas: string
    nonce: string
    deadline: string
    data: string
  }
  signature: string
  priority: 'slow' | 'normal' | 'fast'
}

export interface MetaTxResponse {
  success?: boolean
  txHash?: string
  paymentTxHash?: string
  error?: string
  x402?: {
    version: string
    accepts: Array<{
      scheme: string
      network: string
      asset: string
      payTo: string
      maxAmountRequired: string
    }>
  }
  quote?: {
    gasEstimate: string
    priceUSDC: string
    priority: string
    priorityEmoji: string
    estimatedTime: string
  }
}

export interface NonceResponse {
  nonce: number | string
}

export interface HealthResponse {
  status: string
  relayer?: string
  croBalance?: string
  usdcBalance?: string
}

export interface EstimateResponse {
  gasEstimate: string
  croPrice: number
  recommended: string
  pricing: {
    slow: { emoji: string; label: string; priceUSDC: string; estimatedTime: string }
    normal: { emoji: string; label: string; priceUSDC: string; estimatedTime: string }
    fast: { emoji: string; label: string; priceUSDC: string; estimatedTime: string }
  }
}

export interface FaucetResponse {
  hash: string
  amount: number
  message: string
}

export interface StoredTransaction {
  txHash: string
  from: string
  to: string
  value: string
  gasUsed: string
  priceUSDC: string
  priority: string
  timestamp: number
}

export interface HistoryResponse {
  transactions: StoredTransaction[]
  total: number
}

export const api = {
  // Health check
  getHealth: (): Promise<HealthResponse> => 
    fetch(`${API_BASE}/health`).then(r => r.json()),

  // Request TestUSDC from faucet (POST /faucet/usdc with address in body)
  requestFaucet: async (address: `0x${string}`): Promise<FaucetResponse> => {
    const response = await fetch(`${API_BASE}/faucet/usdc`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address })
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Failed to get TestUSDC')
    }

    return data
  },

  // Get faucet balance
  getFaucetBalance: (address: `0x${string}`): Promise<{ balance: string }> =>
    fetch(`${API_BASE}/faucet/balance/${address}`).then(r => r.json()),

  // Get nonce for address
  getNonce: (address: `0x${string}`): Promise<NonceResponse> =>
    fetch(`${API_BASE}/meta/nonce/${address}`).then(r => r.json()),

  // Get EIP-712 domain
  getDomain: (): Promise<{ domain: any }> =>
    fetch(`${API_BASE}/meta/domain`).then(r => r.json()),

  // Get gas estimate
  getEstimate: (): Promise<EstimateResponse> =>
    fetch(`${API_BASE}/estimate`).then(r => r.json()),

  // Get transaction history for address
  getHistory: async (address: `0x${string}`, limit: number = 10): Promise<HistoryResponse> => {
    try {
      const response = await fetch(`${API_BASE}/meta/history/${address}?limit=${limit}`)
      if (!response.ok) {
        throw new Error('Failed to fetch history')
      }
      return response.json()
    } catch (error) {
      // Return empty history on error (backend may not have history yet)
      console.warn('History fetch failed, returning empty:', error)
      return { transactions: [], total: 0 }
    }
  },

  // Execute meta-transaction
  executeMetaTx: (payload: MetaTxPayload): Promise<MetaTxResponse> =>
    fetch(`${API_BASE}/meta/relay`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).then(async r => {
      const data = await r.json()
      if (r.status === 402) {
        return { ...data, error: 'Payment Required' }
      }
      return data
    }),

  // Execute batch meta-transactions (10% discount)
  executeBatch: (payload: { 
    requests: Array<{ request: MetaTxPayload['request']; signature: string }>
    priority: 'slow' | 'normal' | 'fast'
  }): Promise<MetaTxResponse> =>
    fetch(`${API_BASE}/meta/batch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).then(async r => {
      const data = await r.json()
      if (r.status === 402) {
        return { ...data, error: 'Payment Required' }
      }
      return data
    }),
}