"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Volume2 } from "lucide-react"
import { motion } from "framer-motion"

interface MatchingPair {
  left: string
  right: string
}

interface MatchingQuestion {
  id: string
  pairs: MatchingPair[]
  audio?: string
  feedback?: string
  example?: string
}

interface MatchingExerciseProps {
  question: MatchingQuestion
  onCorrect: () => void
  onNext: () => void
  onPlayAudio: () => void
}

export function MatchingExercise({ question, onCorrect, onNext, onPlayAudio }: MatchingExerciseProps) {
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null)
  const [selectedRight, setSelectedRight] = useState<string | null>(null)
  const [matches, setMatches] = useState<MatchingPair[]>([])
  const [isAnswered, setIsAnswered] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)

  // Mezclar las opciones de la derecha
  const [shuffledRightOptions] = useState(() => {
    return [...question.pairs].sort(() => Math.random() - 0.5).map((pair) => pair.right)
  })

  // Opciones disponibles (las que aún no se han emparejado)
  const availableLeftOptions = question.pairs
    .filter((pair) => !matches.some((match) => match.left === pair.left))
    .map((pair) => pair.left)

  const availableRightOptions = shuffledRightOptions.filter((right) => !matches.some((match) => match.right === right))

  const playAudio = () => {
    setIsPlaying(true)
    onPlayAudio()
    setTimeout(() => setIsPlaying(false), 2000)
  }

  const handleLeftClick = (left: string) => {
    if (isAnswered) return
    setSelectedLeft(selectedLeft === left ? null : left)
  }

  const handleRightClick = (right: string) => {
    if (isAnswered) return
    setSelectedRight(selectedRight === right ? null : right)
  }

  // Cuando se selecciona una opción de cada lado
  const tryMatch = () => {
    if (selectedLeft && selectedRight) {
      // Añadir el emparejamiento
      setMatches([...matches, { left: selectedLeft, right: selectedRight }])

      // Limpiar selecciones
      setSelectedLeft(null)
      setSelectedRight(null)

      // Verificar si se han emparejado todas
      if (matches.length + 1 === question.pairs.length) {
        checkAllMatches()
      }
    }
  }

  // Verificar si todos los emparejamientos son correctos
  const checkAllMatches = () => {
    const allMatches = [...matches]
    if (selectedLeft && selectedRight) {
      allMatches.push({ left: selectedLeft, right: selectedRight })
    }

    // Verificar cada emparejamiento
    const allCorrect = allMatches.every((match) => {
      const correctPair = question.pairs.find((pair) => pair.left === match.left)
      return correctPair && correctPair.right === match.right
    })

    setIsCorrect(allCorrect)
    setIsAnswered(true)

    if (allCorrect) {
      onCorrect()
    }
  }

  const handleNext = () => {
    setSelectedLeft(null)
    setSelectedRight(null)
    setMatches([])
    setIsAnswered(false)
    setIsCorrect(false)
    onNext()
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-medium">Empareja cada elemento con su correspondiente</h3>

          {question.audio && (
            <Button variant="outline" size="sm" onClick={playAudio} className="ml-2">
              <Volume2 className={`h-4 w-4 mr-1 ${isPlaying ? "text-blue-500 animate-pulse" : ""}`} />
              Escuchar
            </Button>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          {/* Columna izquierda */}
          <div className="space-y-2">
            {question.pairs.map((pair) => {
              const isMatched = matches.some((match) => match.left === pair.left)
              const isSelected = selectedLeft === pair.left

              return (
                <motion.div
                  key={`left-${pair.left}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div
                    className={`p-3 rounded-lg cursor-pointer transition-colors border ${
                      isMatched
                        ? "bg-green-50 border-green-200 opacity-50"
                        : isSelected
                          ? "bg-blue-50 border-blue-300"
                          : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                    }`}
                    onClick={() => !isMatched && handleLeftClick(pair.left)}
                  >
                    {pair.left}
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Columna derecha */}
          <div className="space-y-2">
            {shuffledRightOptions.map((right) => {
              const isMatched = matches.some((match) => match.right === right)
              const isSelected = selectedRight === right

              return (
                <motion.div
                  key={`right-${right}`}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div
                    className={`p-3 rounded-lg cursor-pointer transition-colors border ${
                      isMatched
                        ? "bg-green-50 border-green-200 opacity-50"
                        : isSelected
                          ? "bg-blue-50 border-blue-300"
                          : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                    }`}
                    onClick={() => !isMatched && handleRightClick(right)}
                  >
                    {right}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Botón para emparejar */}
        {selectedLeft && selectedRight && !isAnswered && (
          <Button className="w-full" onClick={tryMatch}>
            Emparejar seleccionados
          </Button>
        )}

        {/* Emparejamientos realizados */}
        {matches.length > 0 && !isAnswered && (
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">Emparejamientos:</h4>
            <div className="space-y-2">
              {matches.map((match, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center justify-between p-2 bg-green-50 rounded-lg border border-green-200">
                    <span>{match.left}</span>
                    <span>→</span>
                    <span>{match.right}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>

      {isAnswered && (
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
              {isCorrect
                ? question.feedback || "¡Todos los emparejamientos son correctos! 🎉"
                : "Algunos emparejamientos son incorrectos."}
            </p>

            {!isCorrect && (
              <div className="mt-2">
                <p className="font-medium">Emparejamientos correctos:</p>
                <div className="mt-1 space-y-1 p-2 bg-white rounded border border-gray-100">
                  {question.pairs.map((pair, index) => (
                    <div key={index} className="flex items-center justify-between p-1">
                      <span>{pair.left}</span>
                      <span>→</span>
                      <span>{pair.right}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

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
