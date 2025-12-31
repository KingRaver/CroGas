import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "glass rounded-3xl p-8 border border-green-500/30 backdrop-blur-xl",
        className
      )}
      {...props}
    />
  )
}

export function CardHeader({ className, ...props }: CardProps) {
  return <div className={cn("space-y-2 pb-4", className)} {...props} />
}

export function CardContent({ className, ...props }: CardProps) {
  return <div className={cn("space-y-4", className)} {...props} />
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn("text-2xl font-black", className)} {...props} />
  )
}