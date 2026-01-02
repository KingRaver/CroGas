'use client'
import { useState, useEffect, useRef } from 'react'
import { Bell, X, CheckCircle, AlertCircle, Clock, Trash2, Fuel } from 'lucide-react'

export type NotificationType = 'success' | 'error' | 'pending' | 'info'

export interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  timestamp: Date
  read: boolean
}

// Notification store - can be imported and used by other components
let notificationListeners: ((notifications: Notification[]) => void)[] = []
let notifications: Notification[] = []

export function addNotification(notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) {
  const newNotification: Notification = {
    ...notification,
    id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    timestamp: new Date(),
    read: false,
  }
  notifications = [newNotification, ...notifications].slice(0, 50) // Keep max 50
  notificationListeners.forEach(listener => listener([...notifications]))
  return newNotification.id
}

export function clearAllNotifications() {
  notifications = []
  notificationListeners.forEach(listener => listener([]))
}

export function markAsRead(id: string) {
  notifications = notifications.map(n => 
    n.id === id ? { ...n, read: true } : n
  )
  notificationListeners.forEach(listener => listener([...notifications]))
}

export function markAllAsRead() {
  notifications = notifications.map(n => ({ ...n, read: true }))
  notificationListeners.forEach(listener => listener([...notifications]))
}

const typeConfig: Record<NotificationType, { icon: typeof CheckCircle; color: string; bg: string }> = {
  success: { icon: CheckCircle, color: 'text-[#879c7d]', bg: 'bg-[#879c7d]/10' },
  error: { icon: AlertCircle, color: 'text-[#a52b36]', bg: 'bg-[#a52b36]/10' },
  pending: { icon: Clock, color: 'text-[#f6c25d]', bg: 'bg-[#f6c25d]/10' },
  info: { icon: Fuel, color: 'text-[#00b0b2]', bg: 'bg-[#00b0b2]/10' },
}

function formatTimestamp(date: Date): string {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  
  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  return date.toLocaleDateString()
}

export default function NotificationsDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const [items, setItems] = useState<Notification[]>([])
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Subscribe to notification updates
  useEffect(() => {
    setItems([...notifications])
    const listener = (updated: Notification[]) => setItems(updated)
    notificationListeners.push(listener)
    return () => {
      notificationListeners = notificationListeners.filter(l => l !== listener)
    }
  }, [])

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

  const unreadCount = items.filter(n => !n.read).length

  const handleOpen = () => {
    setIsOpen(!isOpen)
    if (!isOpen) {
      // Mark all as read when opening
      setTimeout(() => markAllAsRead(), 1000)
    }
  }

  const handleDismiss = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    notifications = notifications.filter(n => n.id !== id)
    notificationListeners.forEach(listener => listener([...notifications]))
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button with Badge */}
      <button
        onClick={handleOpen}
        className="relative w-10 h-10 flex items-center justify-center border-2 border-[#d9d9d9] hover:border-[#f6c25d] transition-all bg-white/50 hover:bg-white/80"
        aria-label="Notifications"
      >
        <Bell className={`w-4 h-4 text-[#688fad] transition-transform ${isOpen ? 'scale-110' : ''}`} />
        
        {/* Unread Badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center bg-[#a52b36] text-white text-xs font-bold rounded-full animate-pulse-soft">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 top-12 w-80 bg-[#f8f6f0] border-2 border-[#f6c25d] shadow-lg z-50 animate-fade-in">
          {/* Art Deco corner accents */}
          <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-[#f6c25d]" />
          <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-[#f6c25d]" />
          <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-[#f6c25d]" />
          <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-[#f6c25d]" />

          {/* Header */}
          <div className="p-4 border-b border-[#d9d9d9] flex items-center justify-between">
            <h3 className="font-display text-lg tracking-wider text-[#3f647e] uppercase">Notifications</h3>
            {items.length > 0 && (
              <button
                onClick={() => clearAllNotifications()}
                className="flex items-center gap-1 text-xs text-[#688fad] hover:text-[#a52b36] transition-colors uppercase tracking-wider"
              >
                <Trash2 className="w-3 h-3" />
                Clear All
              </button>
            )}
          </div>

          {/* Notification List */}
          <div className="max-h-80 overflow-y-auto">
            {items.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="w-10 h-10 mx-auto text-[#d9d9d9] mb-3" />
                <p className="text-[#688fad] text-sm">No notifications yet</p>
                <p className="text-[#d9d9d9] text-xs mt-1 italic">Transaction updates will appear here</p>
              </div>
            ) : (
              <div className="divide-y divide-[#d9d9d9]">
                {items.map((notification) => {
                  const config = typeConfig[notification.type]
                  const Icon = config.icon
                  
                  return (
                    <div
                      key={notification.id}
                      className={`
                        p-3 flex gap-3 transition-colors hover:bg-[#f6c25d]/5
                        ${!notification.read ? 'bg-[#f6c25d]/10' : ''}
                      `}
                    >
                      {/* Icon */}
                      <div className={`shrink-0 w-8 h-8 flex items-center justify-center ${config.bg} rounded`}>
                        <Icon className={`w-4 h-4 ${config.color}`} />
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-medium text-[#2a2a2a] truncate">
                            {notification.title}
                          </p>
                          <button
                            onClick={(e) => handleDismiss(notification.id, e)}
                            className="shrink-0 text-[#d9d9d9] hover:text-[#a52b36] transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                        <p className="text-xs text-[#688fad] truncate">{notification.message}</p>
                        <p className="text-xs text-[#d9d9d9] mt-1">{formatTimestamp(notification.timestamp)}</p>
                      </div>
                      
                      {/* Unread indicator */}
                      {!notification.read && (
                        <div className="shrink-0 w-2 h-2 bg-[#a52b36] rounded-full mt-2" />
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
