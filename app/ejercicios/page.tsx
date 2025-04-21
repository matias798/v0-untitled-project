"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { BookText, SortAsc, Languages, Edit, Grid3X3 } from "lucide-react"
import { motion } from "framer-motion"

export default function EjerciciosPage() {
  const [exercises, setExercises] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    async function fetchExercises() {
      try {
        console.log("Obteniendo ejercicios...")
        setLoading(true)

        const response = await fetch("/api/exercises")

        if (!response.ok) {
          throw new Error(`Error al obtener ejercicios: ${response.status}`)
        }

        const data = await response.json()
        console.log("Ejercicios obtenidos:", data)

        setExercises(data)
        setError(null)
      } catch (err: any) {
        console.error("Error al cargar ejercicios:", err)
        setError(`No se pudieron cargar los ejercicios: ${err.message}`)
      } finally {
        setLoading(false)
      }
    }

    fetchExercises()
  }, [])

  // Filtrar ejercicios por tipo
  const getFilteredExercises = (type: string) => {
    if (type === "all") {
      return exercises
    }
    return exercises.filter((ex) => ex.type === type)
  }

  // Obtener el icono según el tipo de ejercicio
  const getExerciseIcon = (type: string) => {
    switch (type) {
      case "multipleChoice":
        return <BookText className="h-5 w-5 text-blue-500" />
      case "orderWords":
        return <SortAsc className="h-5 w-5 text-green-500" />
      case "translation":
        return <Languages className="h-5 w-5 text-purple-500" />
      case "fillBlank":
        return <Edit className="h-5 w-5 text-amber-500" />
      case "matchingPairs":
        return <Grid3X3 className="h-5 w-5 text-rose-500" />
      default:
        return <BookText className="h-5 w-5 text-gray-500" />
    }
  }

  return (
    <div className="container max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Ejercicios</h1>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-500">Cargando ejercicios...</p>
        </div>
      ) : error ? (
        <Card className="p-6 text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Reintentar</Button>
        </Card>
      ) : (
        <>
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="all">Todos</TabsTrigger>
              <TabsTrigger value="multipleChoice">Opción múltiple</TabsTrigger>
              <TabsTrigger value="orderWords">Ordenar</TabsTrigger>
              <TabsTrigger value="translation">Traducción</TabsTrigger>
              <TabsTrigger value="fillBlank">Completar</TabsTrigger>
              <TabsTrigger value="matchingPairs">Emparejar</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-4">
              {getFilteredExercises(activeTab).length > 0 ? (
                getFilteredExercises(activeTab).map((exercise, index) => (
                  <motion.div
                    key={exercise.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center">
                          {getExerciseIcon(exercise.type)}
                          <span className="ml-2">{exercise.title}</span>
                        </CardTitle>
                        <CardDescription>{exercise.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex justify-between items-center">
                          <div className="text-sm text-gray-500">
                            Nivel {exercise.level} • {exercise.questions?.length || 0} preguntas
                          </div>
                          <Link href={`/ejercicios/${exercise.id}`}>
                            <Button>Comenzar</Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              ) : (
                <Card className="p-6 text-center">
                  <p className="text-gray-500">No hay ejercicios disponibles para este tipo.</p>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  )
}
