"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Volume2 } from "lucide-react"
import { getLessonById } from "@/lib/lessons"
import { updateLessonProgress } from "@/lib/progress"
import type { Lesson, DialogLine } from "@/types/lesson"
import { Confetti } from "@/components/confetti"
import { LessonExercises } from "@/components/lesson-exercises"
import { pronounceText } from "@/lib/dictionary"

export default function LessonPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [showConfetti, setShowConfetti] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [lessonCompleted, setLessonCompleted] = useState(false)

  useEffect(() => {
    const lessonData = getLessonById(params.id)
    if (lessonData) {
      setLesson(lessonData)
    } else {
      router.push("/aprender")
    }
  }, [params.id, router])

  const playAudio = (text: string) => {
    setIsPlaying(true)
    pronounceText(text, "da")
    setTimeout(() => setIsPlaying(false), 2000)
  }

  const handleNext = () => {
    if (!lesson || !lesson.content) return

    if (currentStep < lesson.content.length - 1) {
      setCurrentStep((prev) => prev + 1)
    } else {
      // Lección completada
      updateLessonProgress(lesson.id)
      setShowConfetti(true)
      setLessonCompleted(true)
    }
  }

  const handleBackToLessons = () => {
    router.push("/aprender")
  }

  if (!lesson) {
    return <div className="p-4 text-center">Cargando lección...</div>
  }

  const progress = lesson.content ? ((currentStep + 1) / lesson.content.length) * 100 : 0
  const currentContent = lesson.content ? lesson.content[currentStep] : null

  return (
    <div className="container max-w-md mx-auto p-4 pb-20">
      {showConfetti && <Confetti />}

      <div className="flex items-center mb-4">
        <Button variant="ghost" size="icon" onClick={handleBackToLessons} className="mr-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold flex-1">{lesson.title}</h1>
      </div>

      {!lessonCompleted ? (
        <>
          <Progress value={progress} className="h-2 mb-6" />

          <Card className="mb-6">
            <CardContent className="p-6">
              {currentContent?.type === "dialog" && (
                <div className="space-y-4">
                  {(currentContent.lines as DialogLine[]).map((line, idx) => (
                    <div key={idx} className={`flex ${line.speaker === "danish" ? "justify-start" : "justify-end"}`}>
                      <div
                        className={`max-w-[80%] p-3 rounded-lg ${
                          line.speaker === "danish" ? "bg-blue-100 dark:bg-blue-900" : "bg-green-100 dark:bg-green-900"
                        }`}
                      >
                        <p className="font-medium">{line.text}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{line.translation}</p>
                        {line.speaker === "danish" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="mt-2 h-8 px-2"
                            onClick={() => playAudio(line.text)}
                          >
                            <Volume2 className={`h-4 w-4 mr-1 ${isPlaying ? "text-blue-500 animate-pulse" : ""}`} />
                            Escuchar
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {currentContent?.type === "explanation" && (
                <div className="prose dark:prose-invert max-w-none">
                  <h3 className="text-lg font-medium mb-2">{currentContent.title}</h3>
                  <p>{currentContent.text}</p>
                  {currentContent.examples && (
                    <div className="mt-4 space-y-2">
                      <h4 className="font-medium">Ejemplos:</h4>
                      <ul className="space-y-2">
                        {currentContent.examples.map((example, idx) => (
                          <li key={idx} className="bg-gray-100 dark:bg-gray-800 p-2 rounded">
                            <div className="flex justify-between items-center">
                              <div>
                                <p>{example.danish}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{example.spanish}</p>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 px-2"
                                onClick={() => playAudio(example.danish)}
                              >
                                <Volume2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Button className="w-full" onClick={handleNext}>
            {currentStep < (lesson.content?.length || 0) - 1 ? "Continuar" : "Completar lección"}
          </Button>
        </>
      ) : (
        <div className="space-y-6">
          <Card className="mb-6">
            <CardContent className="p-6 text-center">
              <h2 className="text-xl font-bold mb-4">¡Lección completada! 🎉</h2>
              <p className="mb-6">
                Has completado la lección <span className="font-bold text-blue-500">{lesson.title}</span>
              </p>
              <Button onClick={handleBackToLessons}>Volver a lecciones</Button>
            </CardContent>
          </Card>

          {/* Show recommended exercises for this lesson */}
          <LessonExercises level={lesson.level} lessonId={lesson.id} />
        </div>
      )}
    </div>
  )
}
