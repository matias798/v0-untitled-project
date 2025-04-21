"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { ChevronDown, ChevronUp, Check, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { WordDisplay } from "@/components/word-display"

interface Example {
  danish: string
  spanish: string
}

interface QuizQuestion {
  type: "multipleChoice" | "fillBlank"
  question: string
  options?: string[]
  correctAnswer: string
}

interface GrammarCardProps {
  title: string
  explanation: string
  examples: Example[]
  quiz?: QuizQuestion
}

export function GrammarCard({ title, explanation, examples, quiz }: GrammarCardProps) {
  const [expanded, setExpanded] = useState(false)
  const [showQuiz, setShowQuiz] = useState(false)
  const [selectedOption, setSelectedOption] = useState<string>("")
  const [textAnswer, setTextAnswer] = useState("")
  const [isAnswered, setIsAnswered] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)

  const toggleExpanded = () => {
    setExpanded(!expanded)
    if (!expanded) {
      setShowQuiz(false)
      resetQuiz()
    }
  }

  const resetQuiz = () => {
    setSelectedOption("")
    setTextAnswer("")
    setIsAnswered(false)
    setIsCorrect(false)
  }

  const checkAnswer = () => {
    if (!quiz) return

    const userAnswer = quiz.type === "multipleChoice" ? selectedOption : textAnswer
    const correct = userAnswer.toLowerCase() === quiz.correctAnswer.toLowerCase()

    setIsCorrect(correct)
    setIsAnswered(true)
  }

  return (
    <Card>
      <CardHeader className="cursor-pointer flex flex-row items-center justify-between" onClick={toggleExpanded}>
        <CardTitle className="text-lg">{title}</CardTitle>
        {expanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
      </CardHeader>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <CardContent className="pt-0">
              <p className="mb-4">{explanation}</p>

              <div className="space-y-2 mb-4">
                <h3 className="font-medium">Examples:</h3>
                {examples.map((example, index) => (
                  <div key={index} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="font-medium">
                      {example.danish.split(" ").map((word, i) => (
                        <span key={i}>
                          <WordDisplay
                            word={word}
                            translation={word} // In a real implementation, you would look up the translation
                          />{" "}
                        </span>
                      ))}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{example.spanish}</p>
                  </div>
                ))}
              </div>

              {quiz && (
                <div className="mt-6">
                  {!showQuiz ? (
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={(e) => {
                        e.stopPropagation()
                        setShowQuiz(true)
                        resetQuiz()
                      }}
                    >
                      Practice with an exercise
                    </Button>
                  ) : (
                    <div className="space-y-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <h3 className="font-medium">{quiz.question}</h3>

                      {quiz.type === "multipleChoice" && quiz.options && (
                        <RadioGroup value={selectedOption} onValueChange={setSelectedOption} className="space-y-2">
                          {quiz.options.map((option, index) => (
                            <div
                              key={index}
                              className={`flex items-center space-x-2 p-2 rounded-lg border ${
                                isAnswered && option === quiz.correctAnswer
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
                          ))}
                        </RadioGroup>
                      )}

                      {quiz.type === "fillBlank" && (
                        <Input
                          value={textAnswer}
                          onChange={(e) => setTextAnswer(e.target.value)}
                          placeholder="Type your answer"
                          disabled={isAnswered}
                        />
                      )}

                      {isAnswered ? (
                        <div className={`p-3 rounded-lg ${isCorrect ? "bg-green-100" : "bg-red-100"}`}>
                          <div className="flex items-center">
                            {isCorrect ? (
                              <Check className="h-5 w-5 text-green-600 mr-2" />
                            ) : (
                              <X className="h-5 w-5 text-red-600 mr-2" />
                            )}
                            <p className={isCorrect ? "text-green-700" : "text-red-700"}>
                              {isCorrect ? "Correct!" : `Incorrect. The correct answer is: ${quiz.correctAnswer}`}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <Button
                          className="w-full"
                          onClick={(e) => {
                            e.stopPropagation()
                            checkAnswer()
                          }}
                          disabled={quiz.type === "multipleChoice" ? !selectedOption : !textAnswer}
                        >
                          Check
                        </Button>
                      )}

                      {isAnswered && (
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={(e) => {
                            e.stopPropagation()
                            resetQuiz()
                          }}
                        >
                          Try again
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  )
}
