"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getExercisesByLevel } from "@/lib/exercises"
import type { Exercise } from "@/types/exercise"
import { useRouter } from "next/navigation"
import { ArrowRight } from "lucide-react"

interface LessonExercisesProps {
  level: string
  lessonId: string
}

export function LessonExercises({ level, lessonId }: LessonExercisesProps) {
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Get exercises for this level
    async function loadExercises() {
      try {
        setLoading(true)
        const levelExercises = await getExercisesByLevel(level)
        setExercises(levelExercises.slice(0, 3)) // Show up to 3 exercises
      } catch (error) {
        console.error("Error loading exercises:", error)
      } finally {
        setLoading(false)
      }
    }

    loadExercises()
  }, [level])

  const handleStartExercise = (exerciseId: string) => {
    router.push(`/ejercicios/${exerciseId}?from=${lessonId}`)
  }

  if (loading) {
    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg">Cargando ejercicios...</CardTitle>
        </CardHeader>
      </Card>
    )
  }

  if (exercises.length === 0) {
    return null
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="text-lg">Ejercicios recomendados</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {exercises.map((exercise) => (
          <div
            key={exercise.id}
            className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
          >
            <div>
              <h4 className="font-medium">{exercise.title}</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">{exercise.description}</p>
            </div>
            <Button size="sm" variant="outline" onClick={() => handleStartExercise(exercise.id)}>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
