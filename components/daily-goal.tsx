"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Target } from "lucide-react"

interface DailyGoalProps {
  progress: number
}

export function DailyGoal({ progress }: DailyGoalProps) {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <Card className="glassmorphic p-6 mb-6">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center mr-3">
            <Target size={20} className="text-green-500" />
          </div>
          <div>
            <h3 className="font-bold text-gray-800 dark:text-white">Meta diaria</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">Aprende 5 palabras nuevas</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Progreso</span>
            <span className="font-medium">{Math.round(progress * 5)} / 5 palabras</span>
          </div>
          <Progress value={progress * 100} className="h-2" />
        </div>
      </Card>
    </motion.div>
  )
}
