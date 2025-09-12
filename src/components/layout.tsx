"use client"

import type React from "react"
import { MainHeader } from "./main-header"
import { SidebarNav } from "./sidebar-nav"
import { SidebarProvider } from "./sidebar-context"
import { ThemeProvider } from "./theme-provider"


interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <SidebarProvider>
        <div className="min-h-screen bg-background">
          <MainHeader />
          <div className="flex">
            <SidebarNav />
            <main className="flex-1 overflow-hidden">{children}</main>
          </div>
        </div>
      </SidebarProvider>
    </ThemeProvider>
  )
}
