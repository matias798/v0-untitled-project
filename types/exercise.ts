export interface MultipleChoiceQuestion {
  text: string
  options: string[]
  correctAnswer: string
  audioPrompt?: boolean
}

export interface OrderWordsQuestion {
  text: string
  words: string[]
  correctSentence: string
}

export interface SpeechQuestion {
  text: string
  phrase: string
  translation: string
  correctPronunciation: string
}

export interface TranslationQuestion {
  text: string
  sourceText: string
  targetLanguage: "da" | "es"
  correctTranslation: string
}

export interface FillBlankQuestion {
  text: string
  sentence: string
  options?: string[]
  correctAnswer: string
}

export interface MatchingQuestion {
  text: string
  pairs: Array<{
    left: string
    right: string
  }>
}

export type ExerciseQuestion =
  | MultipleChoiceQuestion
  | OrderWordsQuestion
  | SpeechQuestion
  | TranslationQuestion
  | FillBlankQuestion
  | MatchingQuestion

export interface Exercise {
  id: string
  title: string
  description: string
  type: "multipleChoice" | "orderWords" | "speechRecognition" | "translation" | "fillBlank" | "matching"
  level: "A1" | "A2" | "B1" | "B2"
  category?: string
  questions: ExerciseQuestion[]
}

export interface ExerciseProgress {
  id: string
  completed: boolean
  score: number
  total: number
  lastAttempt: string
  attempts: number
}
