"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { getRecommendedLessons } from "@/lib/lessons"
import { useState, useEffect } from "react"
import type { Lesson } from "@/types/lesson"

export function RecommendedLessons() {
  const [lessons, setLessons] = useState<Lesson[]>([])

  useEffect(() => {
    setLessons(getRecommendedLessons())
  }, [])

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-bold text-gray-800 dark:text-white">Continúa aprendiendo</h2>
        <Button variant="ghost" size="sm" className="text-blue-500">
          Ver todo <ArrowRight size={16} className="ml-1" />
        </Button>
      </div>

      <div className="space-y-3">
        {lessons.map((lesson) => (
          <Card key={lesson.id} className="glassmorphic overflow-hidden">
            <div className="p-4 flex items-center">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center mr-4"
                style={{
                  backgroundColor: lesson.color.light,
                  color: lesson.color.dark,
                }}
              >
                {lesson.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-800 dark:text-white">{lesson.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">{lesson.description}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </motion.div>
  )
}
