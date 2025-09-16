"use client"

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState } from 'react'
import { MainHeader } from "./main-header"
import { SidebarNav } from "./sidebar-nav"
import { SidebarProvider } from "./sidebar-context"
import { ThemeProvider } from "./theme-provider"

interface LayoutProps {
  children: React.ReactNode
}

export default function Providers({ children }: LayoutProps) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 minutos
        retry: 1,
      },
    },
  }))

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <SidebarProvider>
          <div className="min-h-screen bg-background">
            <MainHeader />
            <div className="flex">
              <SidebarNav />
              <main className="flex-1 overflow-hidden">
                {children}
              </main>
            </div>
          </div>
        </SidebarProvider>
      </ThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}