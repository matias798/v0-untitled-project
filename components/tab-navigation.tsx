"use client"

import { motion } from "framer-motion"
import { Home, Map, BookOpen, User } from "lucide-react"

interface TabNavigationProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

export default function TabNavigation({ activeTab, setActiveTab }: TabNavigationProps) {
  const tabs = [
    { id: "home", label: "Inicio", icon: Home },
    { id: "path", label: "Camino", icon: Map },
    { id: "exercises", label: "Ejercicios", icon: BookOpen },
    { id: "profile", label: "Perfil", icon: User },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      {/* Glassmorphism effect */}
      <div className="backdrop-blur-lg bg-white/70 dark:bg-gray-900/70 border-t border-gray-200 dark:border-gray-800 shadow-lg">
        <div className="max-w-md mx-auto flex justify-around items-center h-20">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id
            const Icon = tab.icon

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="relative flex flex-col items-center justify-center w-full h-full"
              >
                <div
                  className={`
                  flex items-center justify-center w-12 h-12 rounded-2xl
                  ${
                    isActive
                      ? "bg-blue-500 text-white shadow-lg"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
                  }
                  transition-all duration-300 ease-in-out
                  ${isActive ? "neumorphic-active" : "neumorphic"}
                `}
                >
                  <Icon size={22} />

                  {isActive && (
                    <motion.div
                      layoutId="tab-indicator"
                      className="absolute -top-1 right-0 w-3 h-3 bg-rose-400 rounded-full"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </div>

                <span
                  className={`text-xs mt-1 ${isActive ? "text-blue-500 font-medium" : "text-gray-500 dark:text-gray-400"}`}
                >
                  {tab.label}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
