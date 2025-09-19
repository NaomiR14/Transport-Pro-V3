// src/providers/query-provider.tsx
"use client"

import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

// Configuración del QueryClient
const createQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      // Configuración por defecto para todas las queries
      staleTime: 5 * 60 * 1000, // 5 minutos
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      // Configuración por defecto para todas las mutaciones
      retry: 1,
      retryDelay: 1000,
    },
  },
})

let queryClient: QueryClient | undefined = undefined

function getQueryClient() {
  if (typeof window === 'undefined') {
    // Server: siempre crear un nuevo query client
    return createQueryClient()
  } else {
    // Browser: crear el query client si no existe
    if (!queryClient) {
      queryClient = createQueryClient()
    }
    return queryClient
  }
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