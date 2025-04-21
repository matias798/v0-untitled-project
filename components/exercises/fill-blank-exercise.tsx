"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import type { FillBlankQuestion } from "@/types/exercise"

interface FillBlankExerciseProps {
  question: FillBlankQuestion
  onCorrect: () => void
  onNext: () => void
}

export function FillBlankExercise({ question, onCorrect, onNext }: FillBlankExerciseProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)

  // Preparar la oración con el espacio en blanco
  const sentenceParts = question.sentence.split("___")

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
        <h3 className="text-lg font-medium">{question.text}</h3>

        <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg mb-4">
          <p className="text-lg">
            {sentenceParts[0]}
            <span className="px-2 py-1 mx-1 bg-blue-100 dark:bg-blue-900 rounded">
              {isAnswered ? selectedOption : "___"}
            </span>
            {sentenceParts[1]}
          </p>
        </div>

        {question.options && (
          <RadioGroup value={selectedOption || ""} onValueChange={setSelectedOption}>
            {question.options.map((option, index) => (
              <div
                key={index}
                className={`flex items-center space-x-2 p-3 rounded-lg border ${
                  isAnswered && option === question.correctAnswer
                    ? "bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700"
                    : isAnswered && option === selectedOption
                      ? "bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-700"
                      : "hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                <RadioGroupItem value={option} id={`option-${index}`} disabled={isAnswered} />
                <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        )}
      </div>

      {!isAnswered ? (
        <Button className="w-full" onClick={checkAnswer} disabled={!selectedOption}>
          Comprobar
        </Button>
      ) : (
        <div className="space-y-4">
          <div
            className={`p-3 rounded-lg ${
              isCorrect
                ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200"
                : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200"
            }`}
          >
            {isCorrect ? "¡Correcto! 🎉" : `Incorrecto. La respuesta correcta es: ${question.correctAnswer}`}
          </div>
          <Button className="w-full" onClick={handleNext}>
            Continuar
          </Button>
        </div>
      )}
    </div>
  )
}
