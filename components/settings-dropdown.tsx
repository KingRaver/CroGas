'use client'
import { useState, useEffect, useRef } from 'react'
import { Settings, Volume2, VolumeX, Palette, Fuel, Check } from 'lucide-react'

type Theme = 'light' | 'dark' | 'midnight'
type GasTier = 'slow' | 'normal' | 'fast'

interface SettingsState {
  theme: Theme
  defaultGasTier: GasTier
  soundEnabled: boolean
}

const defaultSettings: SettingsState = {
  theme: 'light',
  defaultGasTier: 'normal',
  soundEnabled: true,
}

const themes: { value: Theme; label: string; colors: string }[] = [
  { value: 'light', label: 'Parisian Light', colors: 'bg-ivory border-gold' },
  { value: 'dark', label: 'Noir', colors: 'bg-charcoal border-slate' },
  { value: 'midnight', label: 'Midnight Teal', colors: 'bg-slate border-teal' },
]

const gasTiers: { value: GasTier; label: string; emoji: string }[] = [
  { value: 'slow', label: 'Slow', emoji: '🐢' },
  { value: 'normal', label: 'Normal', emoji: '🚗' },
  { value: 'fast', label: 'Fast', emoji: '🚀' },
]

export default function SettingsDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const [settings, setSettings] = useState<SettingsState>(defaultSettings)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Load settings from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('crogas-settings')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setSettings({ ...defaultSettings, ...parsed })
      } catch (e) {
        console.error('Failed to parse settings:', e)
      }
    }
  }, [])

  // Save settings to localStorage and apply theme
  useEffect(() => {
    localStorage.setItem('crogas-settings', JSON.stringify(settings))
    document.documentElement.setAttribute('data-theme', settings.theme)
  }, [settings])

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const updateSetting = <K extends keyof SettingsState>(key: K, value: SettingsState[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 flex items-center justify-center border-2 border-[#d9d9d9] hover:border-[#f6c25d] transition-all bg-white/50 hover:bg-white/80"
        aria-label="Settings"
      >
        <Settings className={`w-4 h-4 text-[#688fad] transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`} />
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 top-12 w-72 bg-[#f8f6f0] border-2 border-[#f6c25d] shadow-lg z-50 animate-fade-in">
          {/* Art Deco corner accents */}
          <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-[#f6c25d]" />
          <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-[#f6c25d]" />
          <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-[#f6c25d]" />
          <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-[#f6c25d]" />

          <div className="p-4 space-y-5">
            {/* Header */}
            <div className="text-center border-b border-[#d9d9d9] pb-3">
              <h3 className="font-display text-lg tracking-wider text-[#3f647e] uppercase">Settings</h3>
            </div>

            {/* Theme Selection */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-[#3f647e] uppercase tracking-wider">
                <Palette className="w-4 h-4 text-[#f6c25d]" />
                Theme
              </label>
              <div className="grid grid-cols-3 gap-2">
                {themes.map((theme) => (
                  <button
                    key={theme.value}
                    onClick={() => updateSetting('theme', theme.value)}
                    className={`
                      relative p-2 text-xs border-2 transition-all
                      ${settings.theme === theme.value 
                        ? 'border-[#a52b36] bg-[#a52b36]/10' 
                        : 'border-[#d9d9d9] hover:border-[#f6c25d]'
                      }
                    `}
                  >
                    {/* Theme preview dot */}
                    <div className={`w-4 h-4 mx-auto mb-1 border ${theme.colors}`} />
                    <span className="text-[#2a2a2a]">{theme.label.split(' ')[0]}</span>
                    {settings.theme === theme.value && (
                      <Check className="absolute top-1 right-1 w-3 h-3 text-[#a52b36]" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Default Gas Tier */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-[#3f647e] uppercase tracking-wider">
                <Fuel className="w-4 h-4 text-[#f6c25d]" />
                Default Gas Tier
              </label>
              <div className="grid grid-cols-3 gap-2">
                {gasTiers.map((tier) => (
                  <button
                    key={tier.value}
                    onClick={() => updateSetting('defaultGasTier', tier.value)}
                    className={`
                      relative p-2 text-xs border-2 transition-all
                      ${settings.defaultGasTier === tier.value 
                        ? 'border-[#a52b36] bg-[#a52b36]/10' 
                        : 'border-[#d9d9d9] hover:border-[#f6c25d]'
                      }
                    `}
                  >
                    <span className="text-base">{tier.emoji}</span>
                    <div className="text-[#2a2a2a] mt-1">{tier.label}</div>
                    {settings.defaultGasTier === tier.value && (
                      <Check className="absolute top-1 right-1 w-3 h-3 text-[#a52b36]" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Sound Effects Toggle */}
            <div className="space-y-2">
              <button
                onClick={() => updateSetting('soundEnabled', !settings.soundEnabled)}
                className={`
                  w-full flex items-center justify-between p-3 border-2 transition-all
                  ${settings.soundEnabled 
                    ? 'border-[#879c7d] bg-[#879c7d]/10' 
                    : 'border-[#d9d9d9] hover:border-[#f6c25d]'
                  }
                `}
              >
                <span className="flex items-center gap-2 text-sm font-medium text-[#3f647e] uppercase tracking-wider">
                  {settings.soundEnabled ? (
                    <Volume2 className="w-4 h-4 text-[#879c7d]" />
                  ) : (
                    <VolumeX className="w-4 h-4 text-[#688fad]" />
                  )}
                  Sound Effects
                </span>
                {/* Toggle indicator */}
                <div className={`
                  w-10 h-5 rounded-full relative transition-colors
                  ${settings.soundEnabled ? 'bg-[#879c7d]' : 'bg-[#d9d9d9]'}
                `}>
                  <div className={`
                    absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform
                    ${settings.soundEnabled ? 'translate-x-5' : 'translate-x-0.5'}
                  `} />
                </div>
              </button>
              <p className="text-xs text-[#688fad] italic text-center">Coming soon</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Export settings getter for use in other components
export function getSettings(): SettingsState {
  if (typeof window === 'undefined') return defaultSettings
  const saved = localStorage.getItem('crogas-settings')
  if (saved) {
    try {
      return { ...defaultSettings, ...JSON.parse(saved) }
    } catch {
      return defaultSettings
    }
  }
  return defaultSettings
}
