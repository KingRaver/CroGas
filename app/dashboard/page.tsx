'use client'
import StatsGrid from '@/components/stats-grid'
import MetaTxForm from '@/components/meta-tx-form'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  return (
    <main className="min-h-screen">
      {/* Header */}
      <div className="container mx-auto px-4 pt-8">
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors mb-8 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Home</span>
        </Link>
      </div>

      {/* Title */}
      <div className="container mx-auto px-4 text-center mb-12">
        <h1 className="text-5xl md:text-6xl font-black mb-4 display-font">
          <span className="gradient-text">Gas Station</span>
          <span className="text-white ml-4">Control</span>
        </h1>
        <p className="text-gray-400 text-lg">
          Relayer Status • Execute Meta-Txs • Live Metrics
        </p>
      </div>

      {/* Stats Grid */}
      <div className="container mx-auto px-4 mb-12">
        <StatsGrid />
      </div>

      {/* Meta-Tx Form and Recent Transactions */}
      <div className="container mx-auto px-4 pb-24">
        <MetaTxForm />
      </div>
    </main>
  )
}