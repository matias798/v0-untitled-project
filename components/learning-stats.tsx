"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Calendar, Award, BookOpen } from "lucide-react"

interface LearningStatsProps {
  streak: number
  wordsLearned: number
  lessonsCompleted: number
}

export function LearningStats({ streak, wordsLearned, lessonsCompleted }: LearningStatsProps) {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="mb-6"
    >
      <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-3">Tu progreso</h2>

      <div className="grid grid-cols-3 gap-3">
        <Card className="glassmorphic p-4 flex flex-col items-center justify-center">
          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center mb-2">
            <Calendar size={20} className="text-blue-500" />
          </div>
          <span className="text-xl font-bold text-gray-800 dark:text-white">{streak}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">Días</span>
        </Card>

        <Card className="glassmorphic p-4 flex flex-col items-center justify-center">
          <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center mb-2">
            <Award size={20} className="text-rose-500" />
          </div>
          <span className="text-xl font-bold text-gray-800 dark:text-white">{wordsLearned}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">Palabras</span>
        </Card>

        <Card className="glassmorphic p-4 flex flex-col items-center justify-center">
          <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center mb-2">
            <BookOpen size={20} className="text-green-500" />
          </div>
          <span className="text-xl font-bold text-gray-800 dark:text-white">{lessonsCompleted}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">Lecciones</span>
        </Card>
      </div>
    </motion.div>
  )
}
