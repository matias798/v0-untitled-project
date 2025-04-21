/**
 * Service for downloading and processing Danish language corpus data
 */
import { fetchWithCache } from "@/lib/api-utils"

// Types
export interface FrequencyWord {
  word: string
  frequency: number
  level: "A1" | "A2" | "B1" | "B2"
  type: string | null
  translation: string | null
  example: string | null
}

export interface TatoebaSentence {
  danish: string
  english: string
  level: "A1" | "A2" | "B1" | "B2"
}

// Constants
const FREQUENCY_URL = "https://raw.githubusercontent.com/hermitdave/FrequencyWords/master/content/2018/da/da_50k.txt"
const TATOEBA_API_URL = "https://tatoeba.org/en/api_v0/search?from=dan&to=eng&sort=random&limit=1000"

/**
 * Estimates CEFR level based on frequency rank
 */
function estimateLevel(rank: number): "A1" | "A2" | "B1" | "B2" {
  if (rank <= 500) return "A1"
  if (rank <= 1500) return "A2"
  if (rank <= 3000) return "B1"
  return "B2"
}

/**
 * Downloads and processes the frequency list
 */
export async function downloadFrequencyList(): Promise<FrequencyWord[]> {
  try {
    const response = await fetchWithCache(FREQUENCY_URL, {}, "danish-frequency-list")

    if (typeof response === "string") {
      // Parse the text file
      const lines = response.split("\n").filter((line) => line.trim().length > 0)

      // Process only the first 1000 words
      const words: FrequencyWord[] = lines.slice(0, 1000).map((line, index) => {
        const [word, frequencyStr] = line.split(" ")
        return {
          word,
          frequency: Number.parseInt(frequencyStr, 10),
          level: estimateLevel(index + 1),
          type: null,
          translation: null,
          example: null,
        }
      })

      // Save to data/frequency.json
      if (typeof window !== "undefined") {
        localStorage.setItem("danish-frequency-words", JSON.stringify(words))
      }

      return words
    }

    throw new Error("Invalid response format")
  } catch (error) {
    console.error("Error downloading frequency list:", error)

    // Return empty array or cached data if available
    if (typeof window !== "undefined") {
      const cached = localStorage.getItem("danish-frequency-words")
      if (cached) {
        return JSON.parse(cached)
      }
    }

    return []
  }
}

/**
 * Downloads bilingual sentences from Tatoeba
 */
export async function downloadTatoebaSentences(): Promise<TatoebaSentence[]> {
  try {
    const response = await fetchWithCache(TATOEBA_API_URL, {}, "danish-tatoeba-sentences")

    if (response && typeof response === "object") {
      // Extract sentences from the response
      const sentences: TatoebaSentence[] = []

      if (response.results && Array.isArray(response.results)) {
        for (const result of response.results) {
          if (result.text && result.translations && result.translations.length > 0) {
            const danishText = result.text
            const englishText = result.translations[0].text

            // Estimate level based on sentence length and complexity
            const wordCount = danishText.split(/\s+/).length
            let level: "A1" | "A2" | "B1" | "B2" = "A1"

            if (wordCount > 15) {
              level = "B2"
            } else if (wordCount > 10) {
              level = "B1"
            } else if (wordCount > 5) {
              level = "A2"
            }

            sentences.push({
              danish: danishText,
              english: englishText,
              level,
            })
          }
        }
      }

      // Limit to 1000 sentences
      const limitedSentences = sentences.slice(0, 1000)

      // Save to data/sentences.json
      if (typeof window !== "undefined") {
        localStorage.setItem("danish-tatoeba-sentences", JSON.stringify(limitedSentences))
      }

      return limitedSentences
    }

    throw new Error("Invalid response format")
  } catch (error) {
    console.error("Error downloading Tatoeba sentences:", error)

    // Return empty array or cached data if available
    if (typeof window !== "undefined") {
      const cached = localStorage.getItem("danish-tatoeba-sentences")
      if (cached) {
        return JSON.parse(cached)
      }
    }

    return []
  }
}

/**
 * Gets frequency words from local storage or downloads them
 */
export async function getFrequencyWords(): Promise<FrequencyWord[]> {
  if (typeof window !== "undefined") {
    const cached = localStorage.getItem("danish-frequency-words")
    if (cached) {
      return JSON.parse(cached)
    }
  }

  return downloadFrequencyList()
}

/**
 * Gets Tatoeba sentences from local storage or downloads them
 */
export async function getTatoebaSentences(): Promise<TatoebaSentence[]> {
  if (typeof window !== "undefined") {
    const cached = localStorage.getItem("danish-tatoeba-sentences")
    if (cached) {
      return JSON.parse(cached)
    }
  }

  return downloadTatoebaSentences()
}

/**
 * Gets sentences filtered by level
 */
export async function getSentencesByLevel(level: "A1" | "A2" | "B1" | "B2"): Promise<TatoebaSentence[]> {
  const sentences = await getTatoebaSentences()
  return sentences.filter((sentence) => sentence.level === level)
}

/**
 * Gets words filtered by level
 */
export async function getWordsByLevel(level: "A1" | "A2" | "B1" | "B2"): Promise<FrequencyWord[]> {
  const words = await getFrequencyWords()
  return words.filter((word) => word.level === level)
}

/**
 * Initializes the corpus by downloading data if not already cached
 */
export async function initializeCorpus(): Promise<void> {
  await Promise.all([getFrequencyWords(), getTatoebaSentences()])
}
