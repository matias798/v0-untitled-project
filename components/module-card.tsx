"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Lock, CheckCircle, MapPin } from "lucide-react"
import type { PathModule } from "@/types/lesson"

interface ModuleCardProps {
  module: PathModule
  isActive: boolean
  onClick: () => void
  index: number
}

export function ModuleCard({ module, isActive, onClick, index }: ModuleCardProps) {
  return (
    <motion.div
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card
        className={`glassmorphic p-4 pl-12 relative cursor-pointer transition-all ${
          isActive ? "border-blue-300 dark:border-blue-700 shadow-lg" : ""
        }`}
        onClick={onClick}
      >
        {/* Indicador de estado */}
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
          {module.completed ? (
            <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
              <CheckCircle size={14} className="text-white" />
            </div>
          ) : module.locked ? (
            <div className="w-6 h-6 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center">
              <Lock size={14} className="text-gray-600 dark:text-gray-400" />
            </div>
          ) : (
            <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
              <MapPin size={14} className="text-white" />
            </div>
          )}
        </div>

        <div className="flex justify-between items-start">
          <div>
            <Badge
              variant="outline"
              className={`mb-2 ${
                module.level === "A1"
                  ? "bg-green-50 text-green-600 border-green-200"
                  : module.level === "A2"
                    ? "bg-blue-50 text-blue-600 border-blue-200"
                    : module.level === "B1"
                      ? "bg-purple-50 text-purple-600 border-purple-200"
                      : "bg-rose-50 text-rose-600 border-rose-200"
              }`}
            >
              Nivel {module.level}
            </Badge>
            <h3 className="font-bold text-gray-800 dark:text-white">{module.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">{module.description}</p>
          </div>

          {module.progress > 0 && !module.completed && (
            <div className="flex items-center">
              <span className="text-sm font-medium text-blue-500">{module.progress}%</span>
            </div>
          )}
        </div>

        {isActive && (
          <motion.div
            layoutId="active-module-indicator"
            className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-2 h-12 bg-blue-500 rounded-l-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </Card>
    </motion.div>
  )
}
