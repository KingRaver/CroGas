'use client'
import StatsGrid from '@/components/stats-grid'
import MetaTxForm from '@/components/meta-tx-form'
import { ArrowLeft, Settings, Bell } from 'lucide-react'
import Link from 'next/link'

function DecoDivider() {
  return (
    <div className="flex items-center justify-center gap-4 my-10">
      <div className="w-16 h-px bg-gradient-to-r from-transparent to-[#f6c25d]" />
      <div className="relative">
        <div className="w-3 h-3 rotate-45 bg-[#f6c25d]" />
        <div className="absolute inset-[3px] rotate-45 bg-[#f8f6f0]" />
      </div>
      <div className="w-16 h-px bg-gradient-to-l from-transparent to-[#f6c25d]" />
    </div>
  )
}

export default function DashboardPage() {
  return (
    <main className="min-h-screen">
      {/* Header */}
      <div className="container mx-auto px-4 pt-8">
        <div className="flex items-center justify-between mb-8">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-[#3f647e] hover:text-[#a52b36] transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium uppercase tracking-wider text-sm">Return Home</span>
          </Link>
          
          <div className="flex items-center gap-3">
            <button className="w-10 h-10 flex items-center justify-center border-2 border-[#d9d9d9] hover:border-[#f6c25d] transition-all bg-white/50">
              <Bell className="w-4 h-4 text-[#688fad]" />
            </button>
            <button className="w-10 h-10 flex items-center justify-center border-2 border-[#d9d9d9] hover:border-[#f6c25d] transition-all bg-white/50">
              <Settings className="w-4 h-4 text-[#688fad]" />
            </button>
          </div>
        </div>
      </div>

      {/* Title */}
      <div className="container mx-auto px-4 text-center mb-8">
        {/* Ornamental header */}
        <div className="flex justify-center mb-6">
          <svg width="100" height="30" viewBox="0 0 100 30" fill="none" className="opacity-50">
            <path d="M0 15 L25 15 L35 5 L50 15 L65 5 L75 15 L100 15" stroke="#f6c25d" strokeWidth="2" fill="none"/>
            <circle cx="50" cy="15" r="3" fill="#3f647e"/>
          </svg>
        </div>
        
        <h1 className="text-4xl md:text-6xl display-font tracking-wider mb-4">
          <span className="text-gold-gradient">Control</span>
          <span className="text-[#3f647e] ml-3">Panel</span>
        </h1>
        
        <p className="text-[#688fad] flex items-center justify-center gap-4 text-sm uppercase tracking-[0.2em]">
          <span className="text-[#a52b36]">Relayer Status</span>
          <span className="text-[#d9d9d9]">·</span>
          <span className="text-[#00b0b2]">Execute Transactions</span>
          <span className="text-[#d9d9d9]">·</span>
          <span className="text-[#3f647e]">Live Metrics</span>
        </p>
      </div>

      <DecoDivider />

      {/* Stats Grid */}
      <div className="container mx-auto px-4 mb-8">
        <StatsGrid />
      </div>

      <DecoDivider />

      {/* Meta-Tx Form and Recent Transactions */}
      <div className="container mx-auto px-4 pb-24">
        <MetaTxForm />
      </div>
      
      {/* Footer ornament */}
      <div className="flex justify-center pb-12">
        <svg width="150" height="30" viewBox="0 0 150 30" fill="none" className="opacity-30">
          <path d="M0 15 L50 15" stroke="#3f647e" strokeWidth="1"/>
          <rect x="55" y="10" width="10" height="10" fill="none" stroke="#f6c25d" strokeWidth="1" transform="rotate(45 60 15)"/>
          <rect x="70" y="12" width="6" height="6" fill="#f6c25d" transform="rotate(45 73 15)"/>
          <rect x="85" y="10" width="10" height="10" fill="none" stroke="#f6c25d" strokeWidth="1" transform="rotate(45 90 15)"/>
          <path d="M100 15 L150 15" stroke="#3f647e" strokeWidth="1"/>
        </svg>
      </div>
    </main>
  )
}