"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Mic, MicOff, Volume2 } from "lucide-react"
import { useLocalStorage } from "@/hooks/useLocalStorage"
import { pronounceText } from "@/lib/dictionary"

interface UtteranceMeterProps {
  text: string
  language?: string
  onScoreChange?: (score: number) => void
  minScore?: number
  onSuccess?: () => void
}

interface PronunciationAttempt {
  word: string
  timestamp: number
  score: number
}

export function UtteranceMeter({
  text,
  language = "da",
  onScoreChange,
  minScore = 70,
  onSuccess,
}: UtteranceMeterProps) {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [similarityScore, setSimilarityScore] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [recognition, setRecognition] = useState<any>(null)
  const [isSpeechSupported, setIsSpeechSupported] = useState(true)
  const [attempts, setAttempts] = useLocalStorage<PronunciationAttempt[]>("pronunciation-attempts", [])

  useEffect(() => {
    // Initialize speech recognition if available in the browser
    if (typeof window !== "undefined") {
      try {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

        if (SpeechRecognition) {
          const recognitionInstance = new SpeechRecognition()

          recognitionInstance.lang = language === "da" ? "da-DK" : "es-ES"
          recognitionInstance.continuous = false
          recognitionInstance.interimResults = false

          recognitionInstance.onresult = (event: any) => {
            const result = event.results[0][0].transcript
            setTranscript(result.toLowerCase())
            setIsListening(false)

            // Calculate similarity
            const score = calculateSimilarity(text.toLowerCase(), result.toLowerCase())
            setSimilarityScore(score)

            if (onScoreChange) {
              onScoreChange(score)
            }

            // Save attempt
            const newAttempt: PronunciationAttempt = {
              word: text,
              timestamp: Date.now(),
              score,
            }
            setAttempts([...attempts, newAttempt])

            // If score is high enough, call onSuccess
            if (score >= minScore && onSuccess) {
              onSuccess()
            }
          }

          recognitionInstance.onerror = (event: any) => {
            console.error("Speech recognition error:", event.error)
            setIsListening(false)
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
  }, [text, language, minScore, onSuccess, onScoreChange])

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
        setSimilarityScore(0)
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
    pronounceText(text, language)
    setTimeout(() => setIsPlaying(false), 2000)
  }

  // Function to simulate voice recognition in environments where it's not available
  const simulateVoiceRecognition = () => {
    setIsListening(true)

    // Simulate "listening" time
    setTimeout(() => {
      // Simulate a response with a 70% chance of being correct
      const isSimulatedCorrect = Math.random() < 0.7

      if (isSimulatedCorrect) {
        setTranscript(text.toLowerCase())
        setSimilarityScore(95)

        if (onScoreChange) {
          onScoreChange(95)
        }

        if (onSuccess) {
          onSuccess()
        }
      } else {
        // Generate a slightly incorrect version
        const words = text.split(" ")
        if (words.length > 1) {
          // Omit a random word
          const randomIndex = Math.floor(Math.random() * words.length)
          words.splice(randomIndex, 1)
        }
        const modifiedText = words.join(" ").toLowerCase()
        setTranscript(modifiedText)

        const score = calculateSimilarity(text.toLowerCase(), modifiedText)
        setSimilarityScore(score)

        if (onScoreChange) {
          onScoreChange(score)
        }
      }

      setIsListening(false)

      // Save attempt
      const newAttempt: PronunciationAttempt = {
        word: text,
        timestamp: Date.now(),
        score: similarityScore,
      }
      setAttempts([...attempts, newAttempt])
    }, 2000)
  }

  // Function to calculate similarity between two strings (Levenshtein algorithm)
  const calculateSimilarity = (str1: string, str2: string): number => {
    const len1 = str1.length
    const len2 = str2.length

    // Matrix to store distances
    const matrix: number[][] = []

    // Initialize matrix
    for (let i = 0; i <= len1; i++) {
      matrix[i] = [i]
    }

    for (let j = 0; j <= len2; j++) {
      matrix[0][j] = j
    }

    // Calculate Levenshtein distance
    for (let i = 1; i <= len1; i++) {
      for (let j = 1; j <= len2; j++) {
        const cost = str1[i - 1] === str2[j - 1] ? 0 : 1
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1, // deletion
          matrix[i][j - 1] + 1, // insertion
          matrix[i - 1][j - 1] + cost, // substitution
        )
      }
    }

    // Calculate similarity as percentage
    const maxLen = Math.max(len1, len2)
    const distance = matrix[len1][len2]
    const similarity = ((maxLen - distance) / maxLen) * 100

    return Math.round(similarity)
  }

  // Determine meter color based on score
  const getMeterColor = () => {
    if (similarityScore >= 80) return "bg-green-500"
    if (similarityScore >= 60) return "bg-yellow-500"
    return "bg-red-500"
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">{text}</h3>
        <Button variant="outline" size="sm" onClick={playAudio} disabled={isListening}>
          <Volume2 className={`h-4 w-4 mr-1 ${isPlaying ? "text-blue-500 animate-pulse" : ""}`} />
          Listen
        </Button>
      </div>

      <div className="flex flex-col items-center gap-4 mb-4">
        <Button
          variant={isListening ? "destructive" : "default"}
          size="lg"
          className="rounded-full w-16 h-16 flex items-center justify-center"
          onClick={isSpeechSupported ? toggleListening : simulateVoiceRecognition}
        >
          {isListening ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
        </Button>

        <div className="text-center">
          {isListening ? (
            <p className="text-blue-500 animate-pulse">Listening...</p>
          ) : !isSpeechSupported ? (
            <p className="text-amber-500">Simulation mode (your browser doesn't support speech recognition)</p>
          ) : (
            <p>Press the microphone and pronounce the phrase</p>
          )}
        </div>

        {transcript && (
          <div className="w-full space-y-2">
            <div className="p-3 bg-white dark:bg-gray-700 rounded-lg w-full">
              <p className="font-medium">{transcript}</p>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>Accuracy</span>
                <span>{similarityScore}%</span>
              </div>
              <Progress value={similarityScore} className={`h-2 ${getMeterColor()}`} />
            </div>

            {similarityScore < minScore && (
              <p className="text-sm text-red-500">Pronunciation is not accurate enough. Try again.</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
