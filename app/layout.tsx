import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import Script from "next/script"
import "./globals.css"
import { UserProvider } from "@/contexts/user-context"

const geistSans = GeistSans.variable
const geistMono = GeistMono.variable

export const metadata: Metadata = {
  title: "MovixFlow - Conecte sua carga ao motorista certo",
  description: "Plataforma inteligente para gestão de fretes e logística",
  generator: "v0.app",
}

import { Toaster } from "sonner"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <head>
        <Script src="https://js.stripe.com/v3/" strategy="beforeInteractive" />
      </head>
      <body className={`${geistSans} ${geistMono} antialiased`}>
        <UserProvider>
          {children}
          <Toaster position="top-right" richColors />
        </UserProvider>
        <Analytics />
      </body>
    </html>
  )
}
