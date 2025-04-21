import type React from "react"
import type { Metadata } from "next"
import { Fredoka } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { AiAssistant } from "@/components/ai-assistant"
import ErrorBoundary from "@/components/error-boundary"
import { SettingsProvider } from "@/hooks/use-settings"

const fredoka = Fredoka({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-fredoka",
})

export const metadata: Metadata = {
  title: "DanishLearner - Aprende danés de 0 a B2",
  description: "Aplicación para aprender danés de forma interactiva y divertida",
  manifest: "/manifest.json",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body className={`${fredoka.variable} font-fredoka`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} storageKey="danish-learner-theme">
          <SettingsProvider>
            <ErrorBoundary>
              {children}
              <AiAssistant />
              <Toaster />
            </ErrorBoundary>
          </SettingsProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
