"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Volume2 } from "lucide-react"
import { motion } from "framer-motion"

interface OrderWordsQuestion {
  id: string
  text: string
  words: string[]
  correctSentence: string
  audio?: string
  feedback?: string
  example?: string
}

interface OrderWordsExerciseProps {
  question: OrderWordsQuestion
  onCorrect: () => void
  onNext: () => void
  onPlayAudio: () => void
}

export function OrderWordsExercise({ question, onCorrect, onNext, onPlayAudio }: OrderWordsExerciseProps) {
  const [availableWords, setAvailableWords] = useState<string[]>([])
  const [selectedWords, setSelectedWords] = useState<string[]>([])
  const [isAnswered, setIsAnswered] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    // Mezclar las palabras al inicio
    setAvailableWords([...question.words].sort(() => Math.random() - 0.5))
    setSelectedWords([])
  }, [question])

  const playAudio = () => {
    setIsPlaying(true)
    onPlayAudio()
    setTimeout(() => setIsPlaying(false), 2000)
  }

  const selectWord = (word: string, index: number) => {
    if (isAnswered) return

    const newAvailable = [...availableWords]
    newAvailable.splice(index, 1)
    setAvailableWords(newAvailable)
    setSelectedWords([...selectedWords, word])
  }

  const removeWord = (index: number) => {
    if (isAnswered) return

    const newSelected = [...selectedWords]
    const word = newSelected.splice(index, 1)[0]
    setSelectedWords(newSelected)
    setAvailableWords([...availableWords, word])
  }

  const checkAnswer = () => {
    const userSentence = selectedWords.join(" ")
    const correct = userSentence === question.correctSentence
    setIsCorrect(correct)
    setIsAnswered(true)

    if (correct) {
      onCorrect()
    }
  }

  const handleNext = () => {
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

        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg min-h-16 mb-4 border border-gray-200">
          <div className="flex flex-wrap gap-2">
            {selectedWords.map((word, index) => (
              <Button
                key={index}
                variant="secondary"
                size="sm"
                className="h-8"
                onClick={() => removeWord(index)}
                disabled={isAnswered}
              >
                {word}
              </Button>
            ))}
            {selectedWords.length === 0 && (
              <span className="text-gray-500 dark:text-gray-400">Selecciona palabras para formar la frase</span>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {availableWords.map((word, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Button
                variant="outline"
                size="sm"
                className="h-8"
                onClick={() => selectWord(word, index)}
                disabled={isAnswered}
              >
                {word}
              </Button>
            </motion.div>
          ))}
        </div>
      </div>

      {!isAnswered ? (
        <Button
          className="w-full"
          onClick={checkAnswer}
          disabled={selectedWords.length === 0 || selectedWords.length !== question.words.length}
        >
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
            {isCorrect ? (
              <div>
                <p className="text-green-700">{question.feedback || "¡Correcto! 🎉"}</p>
                {question.example && (
                  <div className="mt-2 p-2 bg-white rounded border border-gray-100">
                    <p className="text-sm text-gray-700">
                      <strong>Ejemplo:</strong> {question.example}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <p className="text-red-700">Incorrecto.</p>
                <p className="mt-2 font-medium">La frase correcta es:</p>
                <p className="mt-1 p-2 bg-white rounded border border-gray-100">{question.correctSentence}</p>
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
