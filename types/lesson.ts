export interface DialogLine {
  speaker: "danish" | "spanish"
  text: string
  translation: string
}

export interface ExplanationExample {
  danish: string
  spanish: string
}

export interface DialogContent {
  type: "dialog"
  lines: DialogLine[]
}

export interface ExplanationContent {
  type: "explanation"
  title: string
  text: string
  examples?: ExplanationExample[]
}

export type LessonContent = DialogContent | ExplanationContent

export interface Lesson {
  id: string
  title: string
  description: string
  level: string
  duration: number
  icon?: string
  color?: {
    light: string
    dark: string
  }
  content?: LessonContent[]
}

export interface PathModule {
  id: string
  title: string
  description: string
  level: "A1" | "A2" | "B1" | "B2"
  completed: boolean
  locked: boolean
  progress: number
  lessons: string[]
}
