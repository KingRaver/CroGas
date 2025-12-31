import { cn } from '@/lib/utils'
import { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline'
  size?: 'sm' | 'lg'
}

export function Button({ 
  className, 
  variant = 'default', 
  size = 'sm',
  ...props 
}: ButtonProps) {
  return (
    <button
      className={cn(
        'px-4 py-2 rounded-xl font-bold transition-all duration-200 hover:scale-105 active:scale-95',
        variant === 'outline' && 'border-2 border-current bg-transparent hover:bg-white/10',
        size === 'lg' && 'px-8 py-4 text-lg',
        className
      )}
      {...props}
    />
  )
}