"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import SplashScreen from "@/components/splash-screen"
import TabNavigation from "@/components/tab-navigation"
import HomeScreen from "@/components/screens/home-screen"
import PathScreen from "@/components/screens/path-screen"
import ExercisesScreen from "@/components/screens/exercises-screen"
import ProfileScreen from "@/components/screens/profile-screen"
import { registerServiceWorker } from "@/lib/service-worker"

export default function MainApp() {
  const [showSplash, setShowSplash] = useState(true)
  const [activeTab, setActiveTab] = useState("home")

  useEffect(() => {
    // Registrar el Service Worker para funcionalidad offline
    registerServiceWorker()

    // Mostrar splash screen por 2.5 segundos
    const timer = setTimeout(() => {
      setShowSplash(false)
    }, 2500)

    return () => clearTimeout(timer)
  }, [])

  if (showSplash) {
    return <SplashScreen />
  }

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="pb-20"
        >
          {activeTab === "home" && <HomeScreen />}
          {activeTab === "path" && <PathScreen />}
          {activeTab === "exercises" && <ExercisesScreen />}
          {activeTab === "profile" && <ProfileScreen />}
        </motion.div>
      </AnimatePresence>

      <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
    </>
  )
}
