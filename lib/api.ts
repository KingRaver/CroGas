const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api'

export const api = {
  getHealth: () => fetch(`${API_BASE}/health`).then(r => r.json()),
  getFaucet: (address: `0x${string}`) => fetch(`${API_BASE}/faucet/${address}`),
  executeMetaTx: (payload: any) =>
    fetch(`${API_BASE}/meta/relay`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).then(r => r.json())
}