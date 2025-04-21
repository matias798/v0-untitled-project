"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Mic, MicOff, Volume2 } from "lucide-react"
import type { SpeechQuestion } from "@/types/exercise"
import { pronounceText } from "@/lib/dictionary"
import { useToast } from "@/hooks/use-toast"

interface SpeechRecognitionExerciseProps {
  question: SpeechQuestion
  onCorrect: () => void
  onNext: () => void
}

// Declare SpeechRecognition interface
declare global {
  interface Window {
    SpeechRecognition: any
    webkitSpeechRecognition: any
  }
}

export function SpeechRecognitionExercise({ question, onCorrect, onNext }: SpeechRecognitionExerciseProps) {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [isAnswered, setIsAnswered] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [recognition, setRecognition] = useState<any>(null)
  const [isSpeechSupported, setIsSpeechSupported] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    // Inicializar reconocimiento de voz si está disponible en el navegador
    if (typeof window !== "undefined") {
      try {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

        if (SpeechRecognition) {
          const recognitionInstance = new SpeechRecognition()

          recognitionInstance.lang = "da-DK" // Danés
          recognitionInstance.continuous = false
          recognitionInstance.interimResults = false

          recognitionInstance.onresult = (event: any) => {
            const result = event.results[0][0].transcript
            setTranscript(result.toLowerCase())
            setIsListening(false)
          }

          recognitionInstance.onerror = (event: any) => {
            console.error("Speech recognition error:", event.error)
            setIsListening(false)

            // Mostrar mensaje de error
            toast({
              title: "Error de reconocimiento de voz",
              description: `No se pudo reconocer tu voz: ${event.error}`,
              variant: "destructive",
            })

            // Cambiar a modo de simulación si hay errores persistentes
            if (event.error === "not-allowed" || event.error === "service-not-allowed") {
              setIsSpeechSupported(false)
            }
          }

          recognitionInstance.onend = () => {
            setIsListening(false)
          }

          setRecognition(recognitionInstance)
        } else {
          setIsSpeechSupported(false)
        }
      } catch (error) {
        console.error("Error initializing speech recognition:", error)
        setIsSpeechSupported(false)
      }
    }

    return () => {
      if (recognition) {
        try {
          recognition.abort()
        } catch (error) {
          console.error("Error aborting speech recognition:", error)
        }
      }
    }
  }, [])

  const toggleListening = () => {
    if (!recognition) {
      simulateVoiceRecognition()
      return
    }

    try {
      if (isListening) {
        recognition.abort()
        setIsListening(false)
      } else {
        setTranscript("")
        recognition.start()
        setIsListening(true)
      }
    } catch (error) {
      console.error("Error toggling speech recognition:", error)
      simulateVoiceRecognition()
    }
  }

  const playAudio = () => {
    setIsPlaying(true)
    pronounceText(question.phrase, "da")
    setTimeout(() => setIsPlaying(false), 2000)
  }

  const checkAnswer = () => {
    // Comparación simple - en una app real, usaríamos una comparación más sofisticada
    const normalizedTranscript = transcript.toLowerCase().trim()
    const normalizedCorrect = question.correctPronunciation.toLowerCase().trim()

    // Permitimos cierta flexibilidad en la comparación
    const isClose =
      normalizedTranscript.includes(normalizedCorrect) ||
      normalizedCorrect.includes(normalizedTranscript) ||
      levenshteinDistance(normalizedTranscript, normalizedCorrect) <= 3

    setIsCorrect(isClose)
    setIsAnswered(true)

    if (isClose) {
      onCorrect()
    }
  }

  const handleNext = () => {
    setTranscript("")
    setIsAnswered(false)
    setIsCorrect(false)
    onNext()
  }

  // Función para calcular la distancia de Levenshtein (similitud entre cadenas)
  const levenshteinDistance = (a: string, b: string) => {
    if (a.length === 0) return b.length
    if (b.length === 0) return a.length

    const matrix = []

    for (let i = 0; i <= b.length; i++) matrix[i] = [i]

    for (let j = 0; j <= a.length; j++) matrix[0][j] = j

    for (let i = 1; i <= b.length; i++)
      for (let j = 1; j <= a.length; j++) {
        const cost = a[j - 1] === b[i - 1] ? 0 : 1
        matrix[i][j] = Math.min(matrix[i - 1][j] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j - 1] + cost)
      }

    return matrix[b.length][a.length]
  }

  // Función para simular reconocimiento de voz en entornos donde no está disponible
  const simulateVoiceRecognition = () => {
    setIsListening(true)

    // Simular un tiempo de "escucha"
    setTimeout(() => {
      // Simular una respuesta con un 70% de probabilidad de ser correcta
      const isSimulatedCorrect = Math.random() < 0.7

      if (isSimulatedCorrect) {
        setTranscript(question.correctPronunciation.toLowerCase())
      } else {
        // Generar una versión ligeramente incorrecta
        const words = question.correctPronunciation.split(" ")
        if (words.length > 1) {
          // Omitir una palabra aleatoria
          const randomIndex = Math.floor(Math.random() * words.length)
          words.splice(randomIndex, 1)
        }
        setTranscript(words.join(" ").toLowerCase())
      }

      setIsListening(false)
    }, 2000)
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">{question.text}</h3>

        <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg mb-4">
          <p className="text-lg font-medium mb-2">{question.phrase}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{question.translation}</p>

          <Button variant="outline" size="sm" onClick={playAudio} disabled={isListening}>
            <Volume2 className={`h-4 w-4 mr-1 ${isPlaying ? "text-blue-500 animate-pulse" : ""}`} />
            Escuchar pronunciación
          </Button>
        </div>

        <div className="flex flex-col items-center gap-4 mb-4">
          <Button
            variant={isListening ? "destructive" : "default"}
            size="lg"
            className="rounded-full w-16 h-16 flex items-center justify-center"
            onClick={isSpeechSupported ? toggleListening : simulateVoiceRecognition}
            disabled={isAnswered}
          >
            {isListening ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
          </Button>

          <div className="text-center">
            {isListening ? (
              <p className="text-blue-500 animate-pulse">Escuchando...</p>
            ) : !isSpeechSupported ? (
              <p className="text-amber-500">Modo de simulación (tu navegador no soporta reconocimiento de voz)</p>
            ) : (
              <p>Pulsa el micrófono y pronuncia la frase</p>
            )}
          </div>

          {transcript && (
            <div className="p-3 bg-white dark:bg-gray-700 rounded-lg w-full">
              <p className="font-medium">{transcript}</p>
            </div>
          )}
        </div>
      </div>

      {!isAnswered ? (
        <Button className="w-full" onClick={checkAnswer} disabled={!transcript || isListening}>
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
            {isCorrect ? (
              <p>¡Correcto! Tu pronunciación es buena.</p>
            ) : (
              <div>
                <p>Intenta de nuevo. La pronunciación correcta es:</p>
                <p className="font-medium mt-1">{question.correctPronunciation}</p>
              </div>
            )}
          </div>
          <Button className="w-full" onClick={handleNext}>
            Continuar
          </Button>
        </div>
      )}
    </div>
  )
}
