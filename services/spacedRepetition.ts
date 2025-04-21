/**
 * Implementation of the SM-2 algorithm for spaced repetition
 * Based on: https://www.supermemo.com/en/archives1990-2015/english/ol/sm2
 */

// Types
export interface FlashcardData {
  id: string
  front: string
  back: string
  example?: string
  tags?: string[]
  imageUrl?: string
  audioUrl?: string
}

export interface FlashcardProgress {
  id: string
  interval: number // Interval in days
  repetition: number // Number of consecutive correct repetitions
  easeFactor: number // Ease factor (1.3 - 2.5)
  nextReview: number // Timestamp for next review
}

export interface ReviewResult {
  quality: number // Quality of response (0-5)
  timestamp: number // Timestamp of review
}

// Constants
const MIN_EASE_FACTOR = 1.3
const DEFAULT_EASE_FACTOR = 2.5

/**
 * Initializes progress for a new card
 */
export function initializeCard(cardId: string): FlashcardProgress {
  return {
    id: cardId,
    interval: 0,
    repetition: 0,
    easeFactor: DEFAULT_EASE_FACTOR,
    nextReview: Date.now(), // Review immediately
  }
}

/**
 * Processes a card review according to the SM-2 algorithm
 * @param card Current card progress
 * @param quality Quality of response (0-5)
 * @returns Updated card progress
 */
export function processReview(card: FlashcardProgress, quality: number): FlashcardProgress {
  // Ensure quality is in the correct range
  quality = Math.max(0, Math.min(5, quality))

  // Calculate new ease factor
  let newEaseFactor = card.easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))

  // Ensure ease factor is not less than minimum
  newEaseFactor = Math.max(MIN_EASE_FACTOR, newEaseFactor)

  let newInterval: number
  let newRepetition: number

  if (quality < 3) {
    // If response was incorrect, reset the process
    newInterval = 0
    newRepetition = 0
  } else {
    // If response was correct, calculate new interval
    newRepetition = card.repetition + 1

    if (newRepetition === 1) {
      newInterval = 1 // 1 day
    } else if (newRepetition === 2) {
      newInterval = 6 // 6 days
    } else {
      // For subsequent repetitions, multiply by ease factor
      newInterval = Math.round(card.interval * newEaseFactor)
    }
  }

  // Calculate next review date
  const now = Date.now()
  const nextReview = now + newInterval * 24 * 60 * 60 * 1000 // Convert days to milliseconds

  return {
    id: card.id,
    interval: newInterval,
    repetition: newRepetition,
    easeFactor: newEaseFactor,
    nextReview,
  }
}

/**
 * Saves card progress to localStorage
 */
export function saveCardProgress(card: FlashcardProgress): void {
  if (typeof window === "undefined") return

  try {
    // Get current progress
    const progressKey = "flashcards-progress"
    const progressJson = localStorage.getItem(progressKey)
    const progress: Record<string, FlashcardProgress> = progressJson ? JSON.parse(progressJson) : {}

    // Update progress for this card
    progress[card.id] = card

    // Save back to localStorage
    localStorage.setItem(progressKey, JSON.stringify(progress))
  } catch (error) {
    console.error("Error saving card progress:", error)
  }
}

/**
 * Gets all card progress from localStorage
 */
export function getAllCardProgress(): Record<string, FlashcardProgress> {
  if (typeof window === "undefined") return {}

  try {
    const progressKey = "flashcards-progress"
    const progressJson = localStorage.getItem(progressKey)
    return progressJson ? JSON.parse(progressJson) : {}
  } catch (error) {
    console.error("Error getting card progress:", error)
    return {}
  }
}

/**
 * Gets cards that are due for review today
 */
export function getDueCards(cards: FlashcardData[]): FlashcardData[] {
  const now = Date.now()
  const progress = getAllCardProgress()

  return cards.filter((card) => {
    const cardProgress = progress[card.id] || initializeCard(card.id)
    return cardProgress.nextReview <= now
  })
}

/**
 * Sorts cards by their due date
 */
export function sortCardsByDueDate(cards: FlashcardData[]): FlashcardData[] {
  const progress = getAllCardProgress()

  return [...cards].sort((a, b) => {
    const progressA = progress[a.id] || initializeCard(a.id)
    const progressB = progress[b.id] || initializeCard(b.id)

    return progressA.nextReview - progressB.nextReview
  })
}
