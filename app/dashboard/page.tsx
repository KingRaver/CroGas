'use client'
import StatsGrid from '@/components/stats-grid'
import MetaTxForm from '@/components/meta-tx-form'
import { ArrowLeft, Settings, Bell } from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  return (
    <main className="min-h-screen">
      {/* Header */}
      <div className="container mx-auto px-4 pt-8">
        <div className="flex items-center justify-between mb-8">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-cyan-300 hover:text-cyan-200 transition-colors group"
            style={{ filter: 'drop-shadow(0 0 8px #05ffa1)' }}
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to Home</span>
          </Link>
          
          <div className="flex items-center gap-3">
            <button className="glass-light p-3 rounded-xl border border-white/20 hover:border-cyan-400/50 transition-all hover:neon-cyan">
              <Bell className="w-5 h-5 text-white/60 hover:text-cyan-300" />
            </button>
            <button className="glass-light p-3 rounded-xl border border-white/20 hover:border-pink-400/50 transition-all hover:neon-pink">
              <Settings className="w-5 h-5 text-white/60 hover:text-pink-300" />
            </button>
          </div>
        </div>
      </div>

      {/* Title */}
      <div className="container mx-auto px-4 text-center mb-12">
        <h1 className="text-5xl md:text-7xl font-black mb-4 display-font">
          <span className="gradient-text">Gas Station</span>
          <span className="text-white ml-4" style={{ textShadow: '0 0 20px rgba(255,255,255,0.4)' }}>Control</span>
        </h1>
        <p className="text-white/60 text-lg flex items-center justify-center gap-3">
          <span className="text-pink-300">Relayer Status</span>
          <span className="text-white/30">•</span>
          <span className="text-cyan-300">Execute Meta-Txs</span>
          <span className="text-white/30">•</span>
          <span className="text-purple-300">Live Metrics</span>
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