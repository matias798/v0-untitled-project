"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Exercise } from "@/types/exercise"
import { CheckCircle2, ListChecks, ArrowUpDown, Mic, Languages, Edit, Grid3X3 } from "lucide-react"
import { useRouter } from "next/navigation"

interface ExerciseCardProps {
  exercise: Exercise
  index: number
}

export function ExerciseCard({ exercise, index }: ExerciseCardProps) {
  const router = useRouter()

  const getIcon = () => {
    switch (exercise.type) {
      case "multipleChoice":
        return <ListChecks size={20} className="text-blue-500" />
      case "orderWords":
        return <ArrowUpDown size={20} className="text-green-500" />
      case "speechRecognition":
        return <Mic size={20} className="text-purple-500" />
      case "translation":
        return <Languages size={20} className="text-blue-500" />
      case "fillBlank":
        return <Edit size={20} className="text-amber-500" />
      case "matching":
        return <Grid3X3 size={20} className="text-green-500" />
      default:
        return <CheckCircle2 size={20} className="text-blue-500" />
    }
  }

  const getColorClass = () => {
    switch (exercise.type) {
      case "multipleChoice":
        return "bg-blue-100"
      case "orderWords":
        return "bg-green-100"
      case "speechRecognition":
        return "bg-purple-100"
      case "translation":
        return "bg-blue-100"
      case "fillBlank":
        return "bg-amber-100"
      case "matching":
        return "bg-green-100"
      default:
        return "bg-gray-100"
    }
  }

  const handleStartExercise = () => {
    router.push(`/ejercicios/${exercise.id}`)
  }

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card className="glassmorphic overflow-hidden">
        <div className="p-4">
          <div className="flex items-center mb-3">
            <div className={`w-10 h-10 rounded-xl ${getColorClass()} flex items-center justify-center mr-3`}>
              {getIcon()}
            </div>
            <div>
              <h3 className="font-bold text-gray-800 dark:text-white">{exercise.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">{exercise.description}</p>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200">
              {exercise.questions.length} preguntas
            </Badge>
            <Button size="sm" className="neumorphic-sm" onClick={handleStartExercise}>
              Comenzar
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
