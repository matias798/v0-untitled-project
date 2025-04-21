"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Volume2 } from "lucide-react"
import { motion } from "framer-motion"

interface MultipleChoiceQuestion {
  id: string
  text: string
  options: string[]
  correctAnswer: string
  audio?: string
  feedback?: string
  example?: string
}

interface MultipleChoiceExerciseProps {
  question: MultipleChoiceQuestion
  onCorrect: () => void
  onNext: () => void
  onPlayAudio: () => void
}

export function MultipleChoiceExercise({ question, onCorrect, onNext, onPlayAudio }: MultipleChoiceExerciseProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)

  const playAudio = () => {
    setIsPlaying(true)
    onPlayAudio()
    setTimeout(() => setIsPlaying(false), 2000)
  }

  const checkAnswer = () => {
    if (!selectedOption) return

    const correct = selectedOption === question.correctAnswer
    setIsCorrect(correct)
    setIsAnswered(true)

    if (correct) {
      onCorrect()
    }
  }

  const handleNext = () => {
    setSelectedOption(null)
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

        <RadioGroup value={selectedOption || ""} onValueChange={setSelectedOption} className="mt-4">
          {question.options.map((option, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div
                className={`flex items-center space-x-2 p-3 rounded-lg border mb-2 ${
                  isAnswered && option === question.correctAnswer
                    ? "bg-green-50 border-green-300"
                    : isAnswered && option === selectedOption
                      ? "bg-red-50 border-red-300"
                      : "hover:bg-gray-50"
                }`}
              >
                <RadioGroupItem value={option} id={`option-${index}`} disabled={isAnswered} />
                <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                  {option}
                </Label>
              </div>
            </motion.div>
          ))}
        </RadioGroup>
      </div>

      {!isAnswered ? (
        <Button className="w-full" onClick={checkAnswer} disabled={!selectedOption}>
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
              {isCorrect
                ? question.feedback || "¡Correcto! 🎉"
                : `Incorrecto. La respuesta correcta es: ${question.correctAnswer}`}
            </p>

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
