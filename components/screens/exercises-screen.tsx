"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getExercises } from "@/lib/exercises"
import type { Exercise } from "@/types/exercise"
import { ExerciseCard } from "@/components/exercise-card"
import { LoadingState } from "@/components/loading-state"

export default function ExercisesScreen() {
  const [exercises, setExercises] = useState<{
    multipleChoice: Exercise[]
    orderWords: Exercise[]
    dictation: Exercise[]
    quickCorrection: Exercise[]
  }>({
    multipleChoice: [],
    orderWords: [],
    dictation: [],
    quickCorrection: [],
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadExercises() {
      try {
        setLoading(true)
        // Obtener ejercicios de forma asíncrona
        const allExercises = await getExercises()

        // Asegurarse de que allExercises es un array
        if (!Array.isArray(allExercises)) {
          throw new Error("Los ejercicios no están en el formato esperado")
        }

        setExercises({
          multipleChoice: allExercises.filter((ex) => ex.type === "multipleChoice"),
          orderWords: allExercises.filter((ex) => ex.type === "orderWords"),
          dictation: allExercises.filter((ex) => ex.type === "dictation"),
          quickCorrection: allExercises.filter((ex) => ex.type === "quickCorrection"),
        })
        setError(null)
      } catch (err: any) {
        console.error("Error al cargar ejercicios:", err)
        setError(`No se pudieron cargar los ejercicios: ${err.message}`)
      } finally {
        setLoading(false)
      }
    }

    loadExercises()
  }, [])

  if (loading) {
    return <LoadingState message="Cargando ejercicios..." />
  }

  if (error) {
    return (
      <div className="container max-w-md mx-auto p-4 pt-8 text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <button className="px-4 py-2 bg-blue-500 text-white rounded-md" onClick={() => window.location.reload()}>
          Reintentar
        </button>
      </div>
    )
  }

  return (
    <div className="container max-w-md mx-auto p-4 pt-8">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-1">
          <span className="text-blue-500">Ejercicios</span> activos
        </h1>
        <p className="text-gray-600 dark:text-gray-300">Practica y mejora tus habilidades</p>
      </header>

      <Tabs defaultValue="multipleChoice" className="w-full mb-6">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="multipleChoice">Opción múltiple</TabsTrigger>
          <TabsTrigger value="orderWords">Ordenar</TabsTrigger>
          <TabsTrigger value="dictation">Dictado</TabsTrigger>
          <TabsTrigger value="quickCorrection">Corrección</TabsTrigger>
        </TabsList>

        <TabsContent value="multipleChoice" className="space-y-4">
          {exercises.multipleChoice.map((exercise, index) => (
            <ExerciseCard key={exercise.id} exercise={exercise} index={index} />
          ))}
        </TabsContent>

        <TabsContent value="orderWords" className="space-y-4">
          {exercises.orderWords.map((exercise, index) => (
            <ExerciseCard key={exercise.id} exercise={exercise} index={index} />
          ))}
        </TabsContent>

        <TabsContent value="dictation" className="space-y-4">
          {exercises.dictation.map((exercise, index) => (
            <ExerciseCard key={exercise.id} exercise={exercise} index={index} />
          ))}
        </TabsContent>

        <TabsContent value="quickCorrection" className="space-y-4">
          {exercises.quickCorrection.map((exercise, index) => (
            <ExerciseCard key={exercise.id} exercise={exercise} index={index} />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
