"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Achievement } from "@/types/achievement"
import { CheckCircle, Lock } from "lucide-react"

interface AchievementCardProps {
  achievement: Achievement
  index: number
}

export function AchievementCard({ achievement, index }: AchievementCardProps) {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card className={`glassmorphic p-4 ${!achievement.unlocked ? "opacity-70" : ""}`}>
        <div className="flex items-center">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center mr-4 ${
              achievement.unlocked ? "bg-green-100 text-green-500" : "bg-gray-100 text-gray-400"
            }`}
          >
            {achievement.unlocked ? <CheckCircle size={24} /> : <Lock size={24} />}
          </div>

          <div>
            <h3 className="font-bold text-gray-800 dark:text-white">{achievement.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">{achievement.description}</p>

            {achievement.progress !== undefined && achievement.progress < 100 && (
              <div className="flex items-center mt-1">
                <div className="w-24 h-1 bg-gray-200 dark:bg-gray-700 rounded-full mr-2">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: `${achievement.progress}%` }} />
                </div>
                <span className="text-xs text-gray-500">{achievement.progress}%</span>
              </div>
            )}
          </div>

          {achievement.unlocked && (
            <Badge className="ml-auto bg-green-100 text-green-600 border-green-200">+{achievement.xp} XP</Badge>
          )}
        </div>
      </Card>
    </motion.div>
  )
}
