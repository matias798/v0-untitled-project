"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useLocalStorage } from "./useLocalStorage"

interface SettingsContextType {
  language: "es" | "en" | "da"
  setLanguage: (lang: "es" | "en" | "da") => void
  autoTTS: boolean
  setAutoTTS: (enabled: boolean) => void
  offlineMode: boolean
  setOfflineMode: (enabled: boolean) => void
  theme: "light" | "dark" | "system"
  setTheme: (theme: "light" | "dark" | "system") => void
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useLocalStorage<"es" | "en" | "da">("app-language", "es")
  const [autoTTS, setAutoTTS] = useLocalStorage<boolean>("auto-tts", true)
  const [offlineMode, setOfflineMode] = useLocalStorage<boolean>("offline-mode", false)
  const [theme, setTheme] = useLocalStorage<"light" | "dark" | "system">("app-theme", "light")
  const [mounted, setMounted] = useState(false)

  // Avoid hydration issues
  useEffect(() => {
    setMounted(true)
  }, [])

  // Don't render anything until component is mounted
  if (!mounted) {
    return <>{children}</>
  }

  return (
    <SettingsContext.Provider
      value={{
        language,
        setLanguage,
        autoTTS,
        setAutoTTS,
        offlineMode,
        setOfflineMode,
        theme,
        setTheme,
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider")
  }
  return context
}
