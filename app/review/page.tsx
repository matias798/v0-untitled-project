"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, Volume2, ThumbsUp, ThumbsDown } from "lucide-react"
import { useRouter } from "next/navigation"
import { getAllDanishWords } from "@/lib/dictionary"
import {
  type FlashcardData,
  type FlashcardProgress,
  initializeCard,
  processReview,
  sortCardsByDueDate,
} from "@/services/spacedRepetition"
import { useLocalStorage } from "@/hooks/useLocalStorage"
import { pronounceText } from "@/lib/dictionary"

export default function ReviewPage() {
  const router = useRouter()
  const [cards, setCards] = useState<FlashcardData[]>([])
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [loading, setLoading] = useState(true)
  const [cardProgress, setCardProgress] = useLocalStorage<Record<string, FlashcardProgress>>("flashcards-progress", {})
  const [reviewsToday, setReviewsToday] = useLocalStorage<number>("reviews-today", 0)
  const [lastReviewDate, setLastReviewDate] = useLocalStorage<string>("last-review-date", "")

  // Check if it's a new day to reset the review counter
  useEffect(() => {
    const today = new Date().toDateString()
    if (lastReviewDate !== today) {
      setReviewsToday(0)
      setLastReviewDate(today)
    }
  }, [lastReviewDate, setLastReviewDate, setReviewsToday])

  // Load cards
  useEffect(() => {
    async function loadCards() {
      try {
        setLoading(true)

        // Get words from dictionary
        const danishWords = getAllDanishWords()

        // Convert words to flashcards
        const flashcards: FlashcardData[] = danishWords.map((word) => ({
          id: `word-${word.word}`,
          front: word.word,
          back: word.translation,
          example: word.examples?.[0]?.danish,
          tags: ["vocabulary"],
        }))

        // Sort cards by due date
        const sortedCards = sortCardsByDueDate(flashcards)

        setCards(sortedCards)
      } catch (error) {
        console.error("Error loading flashcards:", error)
      } finally {
        setLoading(false)
      }
    }

    loadCards()
  }, [])

  // Handle card review
  const handleReview = (quality: number) => {
    if (cards.length === 0) return

    const currentCard = cards[currentCardIndex]

    // Get or initialize card progress
    const currentProgress = cardProgress[currentCard.id] || initializeCard(currentCard.id)

    // Process the review
    const newProgress = processReview(currentProgress, quality)

    // Update progress in localStorage
    const newCardProgress = { ...cardProgress, [currentCard.id]: newProgress }
    setCardProgress(newCardProgress)

    // Increment review counter
    setReviewsToday((prev) => prev + 1)

    // Move to next card or back to beginning if it's the last one
    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1)
    } else {
      setCurrentCardIndex(0)
    }

    // Hide answer for next card
    setShowAnswer(false)
  }

  // Play audio of the word
  const playAudio = () => {
    if (cards.length === 0) return

    const currentCard = cards[currentCardIndex]
    pronounceText(currentCard.front, "da")
  }

  if (loading) {
    return (
      <div className="container max-w-md mx-auto p-4 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-gray-500">Loading cards...</p>
      </div>
    )
  }

  if (cards.length === 0) {
    return (
      <div className="container max-w-md mx-auto p-4">
        <Card className="mb-6">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-bold mb-4">No cards available</h2>
            <p className="mb-6">No cards were found for review.</p>
            <Button onClick={() => router.push("/")}>Back to home</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const currentCard = cards[currentCardIndex]

  return (
    <div className="container max-w-md mx-auto p-4 pb-20">
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" size="icon" onClick={() => router.push("/")} className="mr-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-xl font-bold">Vocabulary Review</h1>
          <p className="text-sm text-gray-500">
            Card {currentCardIndex + 1} of {cards.length} • Reviews today: {reviewsToday}
          </p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentCard.id + (showAnswer ? "-answer" : "-question")}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold">{currentCard.front}</h2>
                <Button variant="outline" size="icon" onClick={playAudio}>
                  <Volume2 className="h-5 w-5" />
                </Button>
              </div>

              {showAnswer ? (
                <div className="mt-6 space-y-4">
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-1">Translation:</h3>
                    <p className="text-xl font-bold">{currentCard.back}</p>
                  </div>

                  {currentCard.example && (
                    <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                      <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-1">Example:</h3>
                      <p>{currentCard.example}</p>
                    </div>
                  )}

                  <div className="flex justify-center space-x-4 mt-6">
                    <Button
                      variant="outline"
                      className="flex-1 border-red-300 hover:bg-red-50"
                      onClick={() => handleReview(1)}
                    >
                      <ThumbsDown className="h-5 w-5 mr-2 text-red-500" />
                      Hard
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 border-yellow-300 hover:bg-yellow-50"
                      onClick={() => handleReview(3)}
                    >
                      Medium
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 border-green-300 hover:bg-green-50"
                      onClick={() => handleReview(5)}
                    >
                      <ThumbsUp className="h-5 w-5 mr-2 text-green-500" />
                      Easy
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-center mt-8">
                  <Button className="w-full" onClick={() => setShowAnswer(true)}>
                    Show answer
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      <div className="text-center text-sm text-gray-500">
        <p>Use the spaced repetition system to learn more efficiently.</p>
        <p>Cards you find difficult will appear more frequently.</p>
      </div>
    </div>
  )
}
