"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import SplashScreen from "@/components/splash-screen"
import TabNavigation from "@/components/tab-navigation"
import HomeScreen from "@/components/screens/home-screen"
import PathScreen from "@/components/screens/path-screen"
import ExercisesScreen from "@/components/screens/exercises-screen"
import ProfileScreen from "@/components/screens/profile-screen"
import { registerServiceWorker } from "@/lib/service-worker"
import { initializeUserProgress } from "@/lib/progress"

export default function Home() {
  const [showSplash, setShowSplash] = useState(true)
  const [activeTab, setActiveTab] = useState("home")

  useEffect(() => {
    // Inicializar service worker
    if (typeof window !== "undefined") {
      try {
        registerServiceWorker()
      } catch (error) {
        console.error("Error initializing service worker:", error)
      }
    }

    // Inicializar progreso del usuario si es necesario
    initializeUserProgress()

    // Mostrar splash screen por 2 segundos
    const timer = setTimeout(() => {
      setShowSplash(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  if (showSplash) {
    return <SplashScreen />
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-white to-blue-50 dark:from-gray-900 dark:to-gray-800 pb-20">
      {activeTab === "home" && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.3 }}
        >
          <HomeScreen />
        </motion.div>
      )}

      {activeTab === "path" && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.3 }}
        >
          <PathScreen />
        </motion.div>
      )}

      {activeTab === "exercises" && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.3 }}
        >
          <ExercisesScreen />
        </motion.div>
      )}

      {activeTab === "profile" && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.3 }}
        >
          <ProfileScreen />
        </motion.div>
      )}

      <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
    </main>
  )
}
