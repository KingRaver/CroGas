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
      color: 'cyan',
      glowClass: 'neon-cyan',
      iconBg: 'bg-cyan-500/20',
      textColor: 'text-cyan-400',
      borderColor: 'border-cyan-500/30',
    },
    {
      label: 'USDC Earned',
      value: `$${data?.usdcEarned?.toFixed(2) || '12.34'}`,
      unit: '',
      icon: DollarSign,
      color: 'pink',
      glowClass: 'neon-pink',
      iconBg: 'bg-pink-500/20',
      textColor: 'text-pink-400',
      borderColor: 'border-pink-500/30',
    },
    {
      label: 'Gas Price',
      value: data?.gasPrice || '25',
      unit: 'gwei',
      icon: Zap,
      color: 'purple',
      glowClass: 'neon-purple',
      iconBg: 'bg-purple-500/20',
      textColor: 'text-purple-400',
      borderColor: 'border-purple-500/30',
    },
    {
      label: 'Tx Processed',
      value: data?.txCount?.toString() || '127',
      unit: '',
      icon: Activity,
      color: 'orange',
      glowClass: '',
      iconBg: 'bg-orange-500/20',
      textColor: 'text-orange-400',
      borderColor: 'border-orange-500/30',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
      {stats.map((stat, index) => (
        <div
          key={stat.label}
          className={`
            glass p-6 rounded-2xl border ${stat.borderColor} ${stat.glowClass}
            card-hover cursor-default
            animate-in fade-in slide-in-from-bottom-4
          `}
          style={{ 
            animationDelay: `${index * 100}ms`,
            animationFillMode: 'backwards'
          }}
        >
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 ${stat.iconBg} rounded-xl flex items-center justify-center`}>
              <stat.icon className={`w-7 h-7 ${stat.textColor}`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-1">
                {stat.label}
              </p>
              <div className="flex items-baseline gap-2">
                <span className={`text-2xl font-black ${stat.textColor} tracking-tight`}>
                  {stat.value}
                </span>
                {stat.unit && (
                  <span className="text-sm text-gray-500 font-medium">
                    {stat.unit}
                  </span>
                )}
              </div>
            </div>
          </div>
          
          {/* Animated bottom bar */}
          <div className="mt-4 h-1 rounded-full bg-black/50 overflow-hidden">
            <div 
              className={`h-full rounded-full ${
                stat.color === 'cyan' ? 'bg-gradient-to-r from-cyan-500 to-cyan-300' :
                stat.color === 'pink' ? 'bg-gradient-to-r from-pink-500 to-pink-300' :
                stat.color === 'purple' ? 'bg-gradient-to-r from-purple-500 to-purple-300' :
                'bg-gradient-to-r from-orange-500 to-orange-300'
              }`}
              style={{ 
                width: `${Math.min(100, (index + 1) * 25)}%`,
                animation: 'pulse 2s ease-in-out infinite'
              }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}