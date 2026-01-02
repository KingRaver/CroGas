'use client'
import { Fuel, DollarSign, Zap, Activity } from 'lucide-react'

interface StatsGridProps {
  data?: {
    croBalance?: number
    usdcEarned?: number
    gasPrice?: string
    txCount?: number
  }
}

export default function StatsGrid({ data }: StatsGridProps) {
  const stats = [
    {
      label: 'Relayer CRO',
      value: `${data?.croBalance?.toFixed(2) || '49.10'}`,
      unit: 'CRO',
      icon: Fuel,
      accentColor: '#00b0b2', // teal
      bgAccent: 'bg-[#00b0b2]/10',
    },
    {
      label: 'USDC Earned',
      value: `$${data?.usdcEarned?.toFixed(2) || '12.34'}`,
      unit: '',
      icon: DollarSign,
      accentColor: '#f6c25d', // gold
      bgAccent: 'bg-[#f6c25d]/10',
    },
    {
      label: 'Gas Price',
      value: data?.gasPrice || '25',
      unit: 'gwei',
      icon: Zap,
      accentColor: '#a52b36', // burgundy
      bgAccent: 'bg-[#a52b36]/10',
    },
    {
      label: 'Tx Processed',
      value: data?.txCount?.toString() || '127',
      unit: '',
      icon: Activity,
      accentColor: '#3f647e', // slate
      bgAccent: 'bg-[#3f647e]/10',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
      {stats.map((stat, index) => (
        <div
          key={stat.label}
          className="card-deco p-6 hover-lift animate-fade-in"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="flex items-start justify-between mb-4">
            <div className={`w-12 h-12 ${stat.bgAccent} rounded-sm flex items-center justify-center`}>
              <stat.icon 
                className="w-6 h-6" 
                style={{ color: stat.accentColor }}
              />
            </div>
            
            {/* Decorative element */}
            <div className="flex gap-1">
              <div className="w-2 h-2 rotate-45" style={{ backgroundColor: stat.accentColor, opacity: 0.3 }} />
              <div className="w-2 h-2 rotate-45" style={{ backgroundColor: stat.accentColor, opacity: 0.5 }} />
              <div className="w-2 h-2 rotate-45" style={{ backgroundColor: stat.accentColor }} />
            </div>
          </div>
          
          <p className="text-xs text-[#3f647e] uppercase tracking-[0.2em] font-medium mb-2">
            {stat.label}
          </p>
          
          <div className="flex items-baseline gap-2">
            <span 
              className="text-3xl font-light display-font"
              style={{ color: stat.accentColor }}
            >
              {stat.value}
            </span>
            {stat.unit && (
              <span className="text-sm text-[#688fad] font-medium">
                {stat.unit}
              </span>
            )}
          </div>
          
          {/* Bottom decorative line */}
          <div className="mt-4 h-0.5 bg-gradient-to-r from-transparent via-[#f6c25d]/50 to-transparent" />
        </div>
      ))}
    </div>
  )
}