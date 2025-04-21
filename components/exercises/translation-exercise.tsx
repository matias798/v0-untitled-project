"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Volume2 } from "lucide-react"
import { motion } from "framer-motion"

interface TranslationQuestion {
  id: string
  text: string
  correctAnswer: string
  audio?: string
  feedback?: string
  example?: string
}

interface TranslationExerciseProps {
  question: TranslationQuestion
  onCorrect: () => void
  onNext: () => void
  onPlayAudio: () => void
}

export function TranslationExercise({ question, onCorrect, onNext, onPlayAudio }: TranslationExerciseProps) {
  const [userAnswer, setUserAnswer] = useState("")
  const [isAnswered, setIsAnswered] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)

  const playAudio = () => {
    setIsPlaying(true)
    onPlayAudio()
    setTimeout(() => setIsPlaying(false), 2000)
  }

  // Función para normalizar texto para comparación
  const normalizeText = (text: string): string => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[.,!?;:]/g, "") // Eliminar puntuación
      .replace(/\s+/g, " ") // Normalizar espacios
  }

  const checkAnswer = () => {
    if (!userAnswer.trim()) return

    // Normalizar respuesta del usuario y respuesta correcta
    const normalizedUserAnswer = normalizeText(userAnswer)
    const normalizedCorrectAnswer = normalizeText(question.correctAnswer)

    // Verificar si la respuesta es exactamente correcta
    const exactMatch = normalizedUserAnswer === normalizedCorrectAnswer

    if (exactMatch) {
      setIsCorrect(true)
      onCorrect()
    } else {
      // Si no es exacta, verificar si es aproximadamente correcta
      // Dividir en palabras y contar cuántas coinciden
      const userWords = normalizedUserAnswer.split(" ")
      const correctWords = normalizedCorrectAnswer.split(" ")

      const matchingWords = userWords.filter((word) => correctWords.includes(word))
      const matchPercentage = matchingWords.length / correctWords.length

      if (matchPercentage >= 0.7) {
        // Si coincide al menos el 70%, considerarla parcialmente correcta
        setIsCorrect(true)
        onCorrect()
      } else {
        setIsCorrect(false)
      }
    }

    setIsAnswered(true)
  }

  const handleNext = () => {
    setUserAnswer("")
    setIsAnswered(false)
    setIsCorrect(false)
    onNext()
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-medium">{question.text}</h3>

          {question.audio && (
            <Button variant="outline" size="sm" onClick={playAudio} className="ml-2">
              <Volume2 className={`h-4 w-4 mr-1 ${isPlaying ? "text-blue-500 animate-pulse" : ""}`} />
              Escuchar
            </Button>
          )}
        </div>

        <Textarea
          placeholder="Escribe tu traducción aquí..."
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          disabled={isAnswered}
          className="min-h-[100px] mt-4"
        />
      </div>

      {!isAnswered ? (
        <Button className="w-full" onClick={checkAnswer} disabled={!userAnswer.trim()}>
          Comprobar
        </Button>
      ) : (
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`p-4 rounded-lg ${
              isCorrect ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"
            }`}
          >
            <p className={isCorrect ? "text-green-700" : "text-red-700"}>
              {isCorrect ? question.feedback || "¡Correcto! 🎉" : "La respuesta no es correcta."}
            </p>

            <div className="mt-2 p-2 bg-white rounded border border-gray-100">
              <p className="text-sm text-gray-700">
                <strong>Respuesta correcta:</strong> {question.correctAnswer}
              </p>
            </div>

            {question.example && (
              <div className="mt-2 p-2 bg-white rounded border border-gray-100">
                <p className="text-sm text-gray-700">
                  <strong>Ejemplo:</strong> {question.example}
                </p>
              </div>
            )}
          </motion.div>

          <Button className="w-full" onClick={handleNext}>
            Continuar
          </Button>
        </div>
      )}
    </div>
  )
}
