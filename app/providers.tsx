'use client'

import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createCronosConfig } from '@/lib/cronos'
import { useState, type ReactNode } from 'react'

export function Providers({ children }: { children: ReactNode }) {
  // Create wagmi config inside component to avoid SSR issues with indexedDB
  const [config] = useState(() => createCronosConfig())

  // Create QueryClient inside component to avoid SSR issues
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Prevent refetching on window focus for better UX
            refetchOnWindowFocus: false,
            // Retry failed requests once
            retry: 1,
            // Keep data fresh for 30 seconds
            staleTime: 30 * 1000,
          },
        },
      })
  )

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}