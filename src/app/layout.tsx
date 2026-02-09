import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "sonner"
import { QueryProvider } from "@/providers/query-provider"
import { ThemeProvider } from "@/providers/theme-provider"
import { AuthInitializer, AuthLoading } from "@/features/auth"
import ProtectedLayout from '@/components/layout/ProtectedLayout'

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
      <body className={inter.className} suppressHydrationWarning>
        <QueryProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {/* Inicializador de Auth */}
            <AuthInitializer />
            
            
            {/* Loading mientras verifica auth */}
            <AuthLoading />
            
            {/* Layout condicional protegido */}
            <ProtectedLayout>
              {children}
            </ProtectedLayout>
            
            <Toaster position="top-right" richColors closeButton duration={4000} />
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  )
}