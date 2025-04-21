"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { CheckCircle, Lock, MapPin, ArrowRight } from "lucide-react"
import Link from "next/link"
import { getLearningPath } from "@/lib/lessons"
import type { PathModule } from "@/types/lesson"
import { ErrorBoundary } from "@/components/error-boundary"
import { LoadingState } from "@/components/loading-state"

export default function PathScreen() {
  const [modules, setModules] = useState<PathModule[]>([])
  const [activeModule, setActiveModule] = useState<PathModule | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    try {
      // Obtener el camino de aprendizaje
      const learningPath = getLearningPath()
      setModules(learningPath)

      // Encontrar el primer módulo no completado
      const firstIncomplete = learningPath.find((module) => !module.completed && !module.locked)
      if (firstIncomplete) {
        setActiveModule(firstIncomplete)
      } else if (learningPath.length > 0) {
        setActiveModule(learningPath[0])
      }
    } catch (err: any) {
      console.error("Error al cargar camino de aprendizaje:", err)
      setError(`No se pudo cargar el camino de aprendizaje: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }, [])

  if (loading) {
    return <LoadingState message="Cargando camino de aprendizaje..." />
  }

  if (error) {
    return (
      <Card className="p-6 text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>Reintentar</Button>
      </Card>
    )
  }

  return (
    <div className="container max-w-md mx-auto p-4 pt-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <header className="mb-6">
          <h1 className="text-3xl font-bold mb-1">
            Tu camino de <span className="text-blue-500">aprendizaje</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-300">De principiante a nivel B2</p>
        </header>

        <ErrorBoundary fallback={<p>Error al cargar los módulos</p>}>
          <div className="relative mb-6">
            {/* Línea de progreso */}
            <div className="absolute left-6 top-8 bottom-8 w-1 bg-gray-200 dark:bg-gray-700 rounded-full"></div>

            {/* Módulos */}
            <div className="space-y-4">
              {modules.map((module, index) => (
                <ModuleCard
                  key={module.id}
                  module={module}
                  isActive={activeModule?.id === module.id}
                  onClick={() => !module.locked && setActiveModule(module)}
                  index={index}
                />
              ))}
            </div>

            {/* Detalles del módulo activo */}
            {activeModule && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mt-8"
              >
                <Card className="p-6">
                  <h2 className="text-xl font-bold mb-2">{activeModule.title}</h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">{activeModule.description}</p>

                  <h3 className="text-lg font-medium mb-2">Lecciones disponibles:</h3>
                  <div className="space-y-2 mb-4">
                    {activeModule.lessons.map((lessonId, idx) => (
                      <Link key={lessonId} href={`/aprender/${lessonId}`}>
                        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex justify-between items-center">
                          <span>Lección {idx + 1}</span>
                          <ArrowRight className="h-4 w-4" />
                        </div>
                      </Link>
                    ))}
                  </div>
                </Card>
              </motion.div>
            )}
          </div>
        </ErrorBoundary>
      </motion.div>
    </div>
  )
}

// Componente de tarjeta de módulo
function ModuleCard({
  module,
  isActive,
  onClick,
  index,
}: {
  module: PathModule
  isActive: boolean
  onClick: () => void
  index: number
}) {
  return (
    <motion.div
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card
        className={`p-4 pl-12 relative cursor-pointer transition-all ${module.locked ? "opacity-60" : ""} ${
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
            <div className="w-6 h-6 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
              <Lock size={14} className="text-gray-600 dark:text-gray-300" />
            </div>
          ) : (
            <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
              <MapPin size={14} className="text-white" />
            </div>
          )}
        </div>

        <div className="flex justify-between items-start">
          <div>
            <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 mb-2">
              Nivel {module.level}
            </div>
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
