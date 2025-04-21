/**
 * Dynamic exercise generator for the Danish learning app
 */

import { getWordsByLevel, getSentencesByLevel } from "./corpus"
import type { Exercise } from "@/types/exercise"

// Helper function to shuffle an array
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array]
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
  }
  return newArray
}

/**
 * Generates word order exercises
 */
export async function generateOrderExercises(level: "A1" | "A2" | "B1" | "B2", count: number): Promise<Exercise> {
  try {
    // Load sentences for the specified level
    const sentences = await getSentencesByLevel(level)

    // If not enough sentences, use a default set
    if (sentences.length < count) {
      console.warn(`Not enough sentences for level ${level}. Using default set.`)
    }

    // Select random sentences up to the desired count
    const selectedSentences = shuffleArray(sentences).slice(0, count)

    // Create questions for the exercise
    const questions = selectedSentences.map((sentence, index) => {
      // Split sentence into words and shuffle them
      const words = sentence.danish.split(/\s+/).filter((word) => word.length > 0)
      const shuffledWords = shuffleArray(words)

      return {
        id: `order-${level}-${index + 1}`,
        text: `Order the words to form: '${sentence.english}'`,
        words: shuffledWords,
        correctSentence: sentence.danish,
        audio: "", // In a real implementation, this would be the audio URL
        feedback: `Correct! '${sentence.danish}' means '${sentence.english}'.`,
        example: sentence.english,
      }
    })

    // Create the complete exercise
    return {
      id: `order-words-${level}-${Date.now()}`,
      title: `Form Danish Sentences (${level})`,
      description: "Order the words to create correct Danish sentences",
      type: "orderWords",
      level,
      category: "grammar",
      questions,
    }
  } catch (error) {
    console.error(`Error generating order exercises for level ${level}:`, error)

    // Return a fallback exercise in case of error
    return {
      id: `order-words-${level}-fallback`,
      title: `Form Danish Sentences (${level})`,
      description: "Order the words to create correct Danish sentences",
      type: "orderWords",
      level,
      category: "grammar",
      questions: [
        {
          id: "fallback-q1",
          text: "Order the words to form: 'My name is Juan'",
          words: ["hedder", "Juan", "Jeg"],
          correctSentence: "Jeg hedder Juan",
          feedback: "Correct! 'Jeg hedder Juan' means 'My name is Juan'.",
        },
      ],
    }
  }
}

/**
 * Generates cloze (fill-in-the-blank) exercises
 */
export async function generateClozeExercises(level: "A1" | "A2" | "B1" | "B2", count: number): Promise<Exercise> {
  try {
    // Load sentences for the specified level
    const sentences = await getSentencesByLevel(level)
    const selectedSentences = shuffleArray(sentences).slice(0, count)

    // Create questions for the exercise
    const questions = await Promise.all(
      selectedSentences.map(async (sentence, index) => {
        try {
          // Split sentence into words
          const words = sentence.danish.split(/\s+/).filter((word) => word.length > 2)

          if (words.length === 0) {
            throw new Error(`No suitable words found in sentence: ${sentence.danish}`)
          }

          // Select a random word to remove
          const wordToRemove = words[Math.floor(Math.random() * words.length)]
          const sentenceWithBlank = sentence.danish.replace(wordToRemove, "___")

          // Create options (correct and some incorrect)
          // Get frequency word list
          const frequencyWords = await getWordsByLevel(level)

          // Check that frequencyWords is an array and has elements
          if (!Array.isArray(frequencyWords) || frequencyWords.length === 0) {
            throw new Error("Frequency list is not valid or empty")
          }

          // Get random words as incorrect options
          const otherOptions = shuffleArray(
            frequencyWords.slice(0, Math.min(1000, frequencyWords.length)).map((w) => w.word),
          )
            .filter((w) => w !== wordToRemove && w.length > 2)
            .slice(0, 3)

          // If not enough options, use some predefined ones
          const fallbackOptions = ["er", "har", "går", "kommer", "taler", "spiser", "drikker", "læser"]
          const finalOtherOptions =
            otherOptions.length >= 3 ? otherOptions : [...otherOptions, ...fallbackOptions].slice(0, 3)

          const options = shuffleArray([wordToRemove, ...finalOtherOptions])

          return {
            id: `cloze-${level}-${index + 1}`,
            text: `Complete the sentence: '${sentence.english}'`,
            sentence: sentenceWithBlank,
            options,
            correctAnswer: wordToRemove,
            feedback: `Correct! The missing word is '${wordToRemove}'.`,
            example: sentence.english,
          }
        } catch (questionError) {
          console.error(`Error generating question for sentence: ${sentence.danish}`, questionError)

          // Return a fallback question in case of error
          return {
            id: `cloze-${level}-${index + 1}-fallback`,
            text: "Complete the sentence: 'My name is Juan'",
            sentence: "Jeg ___ Juan",
            options: ["hedder", "er", "har", "går"],
            correctAnswer: "hedder",
            feedback: "Correct! 'Jeg hedder Juan' means 'My name is Juan'.",
            example: "My name is Juan",
          }
        }
      }),
    )

    // Create the complete exercise
    return {
      id: `fill-blank-${level}-${Date.now()}`,
      title: `Complete Danish Sentences (${level})`,
      description: "Fill in the blanks with the correct word",
      type: "fillBlank",
      level,
      category: "vocabulary",
      questions,
    }
  } catch (error) {
    console.error(`Error generating cloze exercises for level ${level}:`, error)

    // Return a fallback exercise in case of error
    return {
      id: `fill-blank-${level}-fallback`,
      title: `Complete Danish Sentences (${level})`,
      description: "Fill in the blanks with the correct word",
      type: "fillBlank",
      level,
      category: "vocabulary",
      questions: [
        {
          id: "fallback-q1",
          text: "Complete the sentence: 'I get up at 7'",
          sentence: "Jeg ___ op klokken 7",
          options: ["står", "går", "sover", "spiser"],
          correctAnswer: "står",
          feedback: "Correct! 'Jeg står op klokken 7' means 'I get up at 7'.",
        },
      ],
    }
  }
}

/**
 * Generates image matching exercises
 */
export async function generateImageMatchExercises(level: "A1" | "A2" | "B1" | "B2", count: number): Promise<Exercise> {
  try {
    // Load frequency list and filter by level
    const frequencyWords = await getWordsByLevel(level)

    // Select random words
    const selectedWords = shuffleArray(frequencyWords).slice(0, count * 5) // 5 words per question

    // Create questions for the exercise
    const questions = []

    for (let i = 0; i < count; i++) {
      const wordsForQuestion = selectedWords.slice(i * 5, (i + 1) * 5)
      const pairs = wordsForQuestion.map((wordObj) => {
        // In a real implementation, you would get real images
        // For now, we use placeholders
        return {
          left: wordObj.word,
          right: wordObj.translation || wordObj.word, // In a real implementation, this would be the translation
        }
      })

      questions.push({
        id: `image-match-${level}-${i + 1}`,
        text: "Match each word with its corresponding image",
        pairs,
        feedback: "Correct! You've matched all words correctly.",
      })
    }

    // Create the complete exercise
    return {
      id: `image-match-${level}-${Date.now()}`,
      title: `Match Words with Images (${level})`,
      description: "Match each Danish word with its corresponding image",
      type: "matching",
      level,
      category: "vocabulary",
      questions,
    }
  } catch (error) {
    console.error(`Error generating image match exercises for level ${level}:`, error)

    // Return a fallback exercise in case of error
    return {
      id: `image-match-${level}-fallback`,
      title: `Match Words with Images (${level})`,
      description: "Match each Danish word with its corresponding image",
      type: "matching",
      level,
      category: "vocabulary",
      questions: [
        {
          id: "fallback-q1",
          text: "Match each word with its corresponding image",
          pairs: [
            { left: "hus", right: "house" },
            { left: "bil", right: "car" },
            { left: "bog", right: "book" },
          ],
          feedback: "Correct! You've matched all words correctly.",
        },
      ],
    }
  }
}

/**
 * Generates synonym exercises
 */
export async function generateSynonymExercises(level: "A1" | "A2" | "B1" | "B2", count: number): Promise<Exercise> {
  try {
    // Load frequency list and filter by level
    const frequencyWords = await getWordsByLevel(level)

    // Select random words
    const selectedWords = shuffleArray(frequencyWords).slice(0, count)

    // Create questions for the exercise
    const questions = selectedWords.map((word, index) => {
      // In a real implementation, you would get real synonyms
      // For now, we create fake synonyms
      const fakeSynonyms = shuffleArray(frequencyWords.filter((w) => w.word !== word.word).map((w) => w.word)).slice(
        0,
        3,
      )

      const options = shuffleArray([word.word, ...fakeSynonyms])

      return {
        id: `synonym-${level}-${index + 1}`,
        text: `Which word is a synonym of '${word.word}'?`,
        options,
        correctAnswer: word.word,
        feedback: `Correct! '${word.word}' is the correct answer.`,
      }
    })

    // Create the complete exercise
    return {
      id: `synonym-${level}-${Date.now()}`,
      title: `Find Synonyms (${level})`,
      description: "Find synonyms for Danish words",
      type: "multipleChoice",
      level,
      category: "vocabulary",
      questions,
    }
  } catch (error) {
    console.error(`Error generating synonym exercises for level ${level}:`, error)

    // Return a fallback exercise in case of error
    return {
      id: `synonym-${level}-fallback`,
      title: `Find Synonyms (${level})`,
      description: "Find synonyms for Danish words",
      type: "multipleChoice",
      level,
      category: "vocabulary",
      questions: [
        {
          id: "fallback-q1",
          text: "Which word is a synonym of 'glad'?",
          options: ["lykkelig", "sur", "træt", "vred"],
          correctAnswer: "lykkelig",
          feedback: "Correct! 'lykkelig' is a synonym of 'glad' (happy).",
        },
      ],
    }
  }
}

/**
 * Generates dictation exercises
 */
export async function generateDictationExercises(level: "A1" | "A2" | "B1" | "B2", count: number): Promise<Exercise> {
  try {
    // Load sentences for the specified level
    const sentences = await getSentencesByLevel(level)

    // Select random sentences
    const selectedSentences = shuffleArray(sentences).slice(0, count)

    // Create questions for the exercise
    const questions = selectedSentences.map((sentence, index) => {
      return {
        id: `dictation-${level}-${index + 1}`,
        text: "Listen and type what you hear",
        phrase: sentence.danish,
        translation: sentence.english,
        correctPronunciation: sentence.danish,
        audio: "", // In a real implementation, this would be the audio URL
      }
    })

    // Create the complete exercise
    return {
      id: `dictation-${level}-${Date.now()}`,
      title: `Dictation Exercise (${level})`,
      description: "Listen to the audio and type what you hear",
      type: "speechRecognition",
      level,
      category: "listening",
      questions,
    }
  } catch (error) {
    console.error(`Error generating dictation exercises for level ${level}:`, error)

    // Return a fallback exercise in case of error
    return {
      id: `dictation-${level}-fallback`,
      title: `Dictation Exercise (${level})`,
      description: "Listen to the audio and type what you hear",
      type: "speechRecognition",
      level,
      category: "listening",
      questions: [
        {
          id: "fallback-q1",
          text: "Listen and type what you hear",
          phrase: "Jeg hedder Juan",
          translation: "My name is Juan",
          correctPronunciation: "Jeg hedder Juan",
        },
      ],
    }
  }
}

/**
 * Generates all exercises for a specific level
 */
export async function generateAllExercisesForLevel(level: "A1" | "A2" | "B1" | "B2"): Promise<Exercise[]> {
  try {
    const orderExercise = await generateOrderExercises(level, 10)
    const clozeExercise = await generateClozeExercises(level, 10)
    const imageMatchExercise = await generateImageMatchExercises(level, 5)
    const synonymExercise = await generateSynonymExercises(level, 10)
    const dictationExercise = await generateDictationExercises(level, 5)

    return [orderExercise, clozeExercise, imageMatchExercise, synonymExercise, dictationExercise]
  } catch (error) {
    console.error(`Error generating all exercises for level ${level}:`, error)
    return []
  }
}
