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
      glowClass: 'neon-cyan',
      iconBg: 'bg-cyan-400/20',
      textColor: 'text-cyan-300',
      borderColor: 'border-cyan-400/50',
      barColor: 'from-cyan-400 to-cyan-200',
    },
    {
      label: 'USDC Earned',
      value: `$${data?.usdcEarned?.toFixed(2) || '12.34'}`,
      unit: '',
      icon: DollarSign,
      glowClass: 'neon-pink',
      iconBg: 'bg-pink-400/20',
      textColor: 'text-pink-300',
      borderColor: 'border-pink-400/50',
      barColor: 'from-pink-400 to-orange-300',
    },
    {
      label: 'Gas Price',
      value: data?.gasPrice || '25',
      unit: 'gwei',
      icon: Zap,
      glowClass: 'neon-purple',
      iconBg: 'bg-purple-400/20',
      textColor: 'text-purple-300',
      borderColor: 'border-purple-400/50',
      barColor: 'from-purple-400 to-pink-300',
    },
    {
      label: 'Tx Processed',
      value: data?.txCount?.toString() || '127',
      unit: '',
      icon: Activity,
      glowClass: '',
      iconBg: 'bg-orange-400/20',
      textColor: 'text-orange-300',
      borderColor: 'border-orange-400/50',
      barColor: 'from-orange-400 to-yellow-300',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
      {stats.map((stat, index) => (
        <div
          key={stat.label}
          className={`
            glass-light p-6 rounded-2xl border-2 ${stat.borderColor} ${stat.glowClass}
            card-hover cursor-default
          `}
          style={{ 
            animationDelay: `${index * 100}ms`,
          }}
        >
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 ${stat.iconBg} rounded-xl flex items-center justify-center backdrop-blur-sm`}>
              <stat.icon className={`w-7 h-7 ${stat.textColor}`} style={{ filter: 'drop-shadow(0 0 8px currentColor)' }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-white/60 uppercase tracking-wider font-medium mb-1">
                {stat.label}
              </p>
              <div className="flex items-baseline gap-2">
                <span className={`text-2xl font-black ${stat.textColor} tracking-tight`} style={{ filter: 'drop-shadow(0 0 10px currentColor)' }}>
                  {stat.value}
                </span>
                {stat.unit && (
                  <span className="text-sm text-white/50 font-medium">
                    {stat.unit}
                  </span>
                )}
              </div>
            </div>
          </div>
          
          {/* Animated bottom bar */}
          <div className="mt-4 h-1.5 rounded-full bg-black/30 overflow-hidden">
            <div 
              className={`h-full rounded-full bg-gradient-to-r ${stat.barColor}`}
              style={{ 
                width: `${60 + (index * 10)}%`,
                boxShadow: '0 0 10px currentColor',
              }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}