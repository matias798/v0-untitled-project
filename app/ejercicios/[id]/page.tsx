"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft } from "lucide-react"
import { motion } from "framer-motion"
import { Confetti } from "@/components/confetti"

// Componentes de ejercicios
import { MultipleChoiceExercise } from "@/components/exercises/multiple-choice"
import { OrderWordsExercise } from "@/components/exercises/order-words"
import { TranslationExercise } from "@/components/exercises/translation-exercise"
import { FillBlankExercise } from "@/components/exercises/fill-blank-exercise"
import { MatchingExercise } from "@/components/exercises/matching-exercise"
import { getExerciseById } from "@/lib/exercises"

export default function ExercisePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [exercise, setExercise] = useState<any>(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [score, setScore] = useState(0)
  const [showConfetti, setShowConfetti] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showCulturalNote, setShowCulturalNote] = useState(false)

  useEffect(() => {
    async function fetchExercise() {
      try {
        console.log(`Obteniendo ejercicio con ID: ${params.id}`)
        setLoading(true)

        const exerciseData = await getExerciseById(params.id)

        if (!exerciseData) {
          throw new Error(`Ejercicio con ID ${params.id} no encontrado`)
        }

        console.log("Ejercicio obtenido:", exerciseData)
        setExercise(exerciseData)
        setError(null)
      } catch (err: any) {
        console.error("Error al cargar ejercicio:", err)
        setError(`No se pudo cargar el ejercicio: ${err.message}`)

        // Proporcionar un ejercicio de respaldo para evitar errores de renderizado
        setExercise({
          id: "fallback-exercise",
          title: "Ejercicio de respaldo",
          description: "Este es un ejercicio de respaldo cuando no se puede cargar el original",
          type: "multipleChoice",
          level: "A1",
          questions: [
            {
              id: "q1",
              text: "¿Cómo se dice 'hola' en danés?",
              options: ["Hej", "Farvel", "Tak", "Godmorgen"],
              correctAnswer: "Hej",
            },
          ],
        })
      } finally {
        setLoading(false)
      }
    }

    fetchExercise()
  }, [params.id])

  const handleCorrectAnswer = () => {
    setScore((prev) => prev + 1)
    setShowConfetti(true)
    setTimeout(() => setShowConfetti(false), 2000)
  }

  const handleNext = () => {
    if (!exercise) return

    if (currentStep < exercise.questions.length - 1) {
      setCurrentStep((prev) => prev + 1)
    } else {
      // Ejercicio completado
      setIsComplete(true)

      // Si hay nota cultural, mostrarla
      if (exercise.culturalNote) {
        setShowCulturalNote(true)
      }
    }
  }

  const finishExercise = () => {
    router.push("/ejercicios")
  }

  // Función para reproducir audio
  const playAudio = (audioSrc: string) => {
    if (!audioSrc) return

    console.log("Reproduciendo audio:", audioSrc)
    // En una implementación real, aquí se reproduciría el audio
    // const audio = new Audio(audioSrc)
    // audio.play().catch(err => {
    //   console.error('Error al reproducir audio:', err)
    // })
  }

  if (loading) {
    return (
      <div className="container max-w-md mx-auto p-4 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-gray-500">Cargando ejercicio...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container max-w-md mx-auto p-4">
        <Card className="mb-6">
          <CardContent className="p-6 text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <div className="flex flex-col gap-2">
              <Button onClick={() => router.push("/ejercicios")}>Volver a ejercicios</Button>
              <Button variant="outline" onClick={() => window.location.reload()}>
                Intentar de nuevo
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!exercise) {
    return (
      <div className="container max-w-md mx-auto p-4">
        <Card className="mb-6">
          <CardContent className="p-6 text-center">
            <p className="text-red-500 mb-4">{"No se encontró el ejercicio"}</p>
            <Button onClick={() => router.push("/ejercicios")}>Volver a ejercicios</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const progress = ((currentStep + 1) / exercise.questions.length) * 100
  const currentQuestion = exercise.questions[currentStep]

  return (
    <div className="container max-w-md mx-auto p-4 pb-20">
      {showConfetti && <Confetti />}

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="flex items-center mb-4">
          <Button variant="ghost" size="icon" onClick={finishExercise} className="mr-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold">{exercise.title}</h1>
            <p className="text-sm text-gray-500">
              {exercise.level} • {exercise.type}
            </p>
          </div>
        </div>

        <Progress value={progress} className="h-2 mb-6" />

        {!isComplete ? (
          <Card className="mb-6">
            <CardContent className="p-6">
              {exercise.type === "multipleChoice" && (
                <MultipleChoiceExercise
                  question={currentQuestion}
                  onCorrect={handleCorrectAnswer}
                  onNext={handleNext}
                  onPlayAudio={() => playAudio(currentQuestion.audio)}
                />
              )}

              {exercise.type === "orderWords" && (
                <OrderWordsExercise
                  question={currentQuestion}
                  onCorrect={handleCorrectAnswer}
                  onNext={handleNext}
                  onPlayAudio={() => playAudio(currentQuestion.audio)}
                />
              )}

              {exercise.type === "translation" && (
                <TranslationExercise
                  question={currentQuestion}
                  onCorrect={handleCorrectAnswer}
                  onNext={handleNext}
                  onPlayAudio={() => playAudio(currentQuestion.audio)}
                />
              )}

              {exercise.type === "fillBlank" && (
                <FillBlankExercise
                  question={currentQuestion}
                  onCorrect={handleCorrectAnswer}
                  onNext={handleNext}
                  onPlayAudio={() => playAudio(currentQuestion.audio)}
                />
              )}

              {exercise.type === "matchingPairs" && (
                <MatchingExercise
                  question={currentQuestion}
                  onCorrect={handleCorrectAnswer}
                  onNext={handleNext}
                  onPlayAudio={() => playAudio(currentQuestion.audio)}
                />
              )}
            </CardContent>
          </Card>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="mb-6">
              <CardContent className="p-6 text-center">
                <h2 className="text-xl font-bold mb-4">¡Ejercicio completado!</h2>
                <p className="mb-6">
                  Has obtenido <span className="font-bold text-green-500">{score}</span> de {exercise.questions.length}{" "}
                  puntos
                </p>
                <Button onClick={finishExercise}>Volver a ejercicios</Button>
              </CardContent>
            </Card>

            {showCulturalNote && exercise.culturalNote && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-bold text-lg mb-2">Nota cultural</h3>
                    <p>{exercise.culturalNote}</p>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
