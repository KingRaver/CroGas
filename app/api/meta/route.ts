import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'https://your-crogas-backend.vercel.app'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Proxy to CroGas backend
    const res = await fetch(`${BACKEND_URL}/meta/relay`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    const data = await res.json()

    // Handle x402 payment required
    if (res.status === 402) {
      return NextResponse.json(data, { status: 402 })
    }

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: 'Proxy failed', details: error },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'CroGas Meta-Tx API Proxy',
    endpoints: ['POST /api/meta/relay', 'GET /api/meta/nonce/:address']
  })
}