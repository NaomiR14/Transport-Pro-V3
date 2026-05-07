"use client"

import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const createQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      // No reintentar errores 4xx (auth, permisos) — solo errores de red
      retry: (failureCount, error: any) => {
        const status = error?.status ?? error?.code
        if (status >= 400 && status < 500) return false
        return failureCount < 2
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 15000),
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 0,
    },
  },
})

let queryClient: QueryClient | undefined = undefined

function getQueryClient() {
  if (typeof window === 'undefined') {
    return createQueryClient()
  }
  if (!queryClient) queryClient = createQueryClient()
  return queryClient
}

interface QueryProviderProps {
  children: React.ReactNode
}

export function QueryProvider({ children }: QueryProviderProps) {
  const client = getQueryClient()

  return (
    <QueryClientProvider client={client}>
      {children}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools 
          initialIsOpen={false} 
          position="left"
        />
      )}
    </QueryClientProvider>
  )
}

// Hook para usar el query client en componentes
export const useQueryClientInstance = () => {
  return getQueryClient()
}