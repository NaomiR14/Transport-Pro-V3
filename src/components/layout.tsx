"use client"
// @NAO se movio al query-provider.tsx
//import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
//import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
//import { useState } from 'react'
import { MainHeader } from "./main-header"
import { SidebarNav } from "./sidebar-nav"
import { SidebarProvider } from "./sidebar-context"
import { ThemeProvider } from "./theme-provider"
import { QueryProvider } from "@/providers/query-provider"
import { Toaster } from "sonner"

interface LayoutProps {
  children: React.ReactNode
}

export default function LayoutProviders({ children }: LayoutProps) {
  // @NAO se movio al query-provider.tsx
  // const [queryClient] = useState(() => new QueryClient({
  //   defaultOptions: {
  //     queries: {
  //       staleTime: 5 * 60 * 1000, // 5 minutos
  //       retry: 1,
  //     },
  //   },
  // }))

  return (
    <QueryProvider>
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
          {/* Toast notifications */}
          <Toaster 
            position="top-right" 
            richColors 
            closeButton 
            duration={4000}
          />
        </SidebarProvider>
      </ThemeProvider>
    </QueryProvider>
  )
}