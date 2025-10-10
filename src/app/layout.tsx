import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import LayoutProviders from '@/components/layout'


const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Sistema de Gestión de Transporte",
  description: "Sistema integral para la gestión de operaciones de transporte",
    
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}
      suppressHydrationWarning={true} // ← Esto soluciona el problema
      >
        <LayoutProviders>
          {children}
        </LayoutProviders>
      </body>
    </html>
  )
}
