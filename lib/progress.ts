// Gestión del progreso del usuario

// Interfaz para el progreso del usuario
interface UserProgress {
  streak: number
  wordsLearned: number
  lessonsCompleted: number
  exercisesCompleted: number
  dailyGoalProgress: number
  totalXP: number
  completedLessons: string[]
  completedExercises: Record<string, { score: number; total: number }>
  lastActive: string
}

// Progreso por defecto
const defaultProgress: UserProgress = {
  streak: 0,
  wordsLearned: 0,
  lessonsCompleted: 0,
  exercisesCompleted: 0,
  dailyGoalProgress: 0,
  totalXP: 0,
  completedLessons: [],
  completedExercises: {},
  lastActive: "",
}

// Inicializar el progreso del usuario si no existe
export function initializeUserProgress(): void {
  if (typeof window === "undefined") return

  const storedProgress = localStorage.getItem("userProgress")
  if (!storedProgress) {
    localStorage.setItem("userProgress", JSON.stringify(defaultProgress))
  } else {
    // Actualizar la racha diaria si es necesario
    const progress = JSON.parse(storedProgress) as UserProgress
    const today = new Date().toISOString().split("T")[0]

    if (progress.lastActive !== today) {
      // Comprobar si el último acceso fue ayer
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayStr = yesterday.toISOString().split("T")[0]

      if (progress.lastActive === yesterdayStr) {
        // Incrementar la racha
        progress.streak += 1
      } else {
        // Reiniciar la racha
        progress.streak = 1
      }

      progress.lastActive = today
      localStorage.setItem("userProgress", JSON.stringify(progress))
    }
  }
}

// Obtener el progreso del usuario
export function getUserProgress(): UserProgress {
  if (typeof window === "undefined") return defaultProgress

  const storedProgress = localStorage.getItem("userProgress")
  if (!storedProgress) return defaultProgress

  try {
    return JSON.parse(storedProgress) as UserProgress
  } catch (error) {
    console.error("Error parsing user progress:", error)
    return defaultProgress
  }
}

// Actualizar el progreso del usuario
export function updateUserProgress(updates: Partial<UserProgress>): void {
  if (typeof window === "undefined") return

  const currentProgress = getUserProgress()
  const updatedProgress = { ...currentProgress, ...updates }

  localStorage.setItem("userProgress", JSON.stringify(updatedProgress))
}

// Comprobar si una lección está completada (función requerida)
export function isLessonCompleted(lessonId: string): boolean {
  const progress = getUserProgress()
  return progress.completedLessons.includes(lessonId)
}

// Actualizar el progreso de una lección completada (función requerida)
export function updateLessonProgress(lessonId: string): void {
  const progress = getUserProgress()

  // Si la lección ya está completada, no hacemos nada
  if (progress.completedLessons.includes(lessonId)) return

  // Actualizamos el progreso
  progress.completedLessons.push(lessonId)
  progress.lessonsCompleted += 1
  progress.wordsLearned += 5 // Asumimos que cada lección enseña 5 palabras
  progress.totalXP += 10 // Asumimos que cada lección da 10 XP
  progress.dailyGoalProgress = Math.min(1, progress.dailyGoalProgress + 0.2)

  // Guardamos el progreso
  updateUserProgress(progress)
}

// Actualizar el progreso de un ejercicio completado (función requerida)
export function updateExerciseProgress(exerciseId: string, score: number, total: number): void {
  const progress = getUserProgress()

  // Actualizamos el progreso
  progress.completedExercises[exerciseId] = { score, total }
  progress.exercisesCompleted = Object.keys(progress.completedExercises).length
  progress.wordsLearned += 2 // Asumimos que cada ejercicio refuerza 2 palabras
  progress.totalXP += score // Cada respuesta correcta da 1 XP
  progress.dailyGoalProgress = Math.min(1, progress.dailyGoalProgress + 0.1)

  // Guardamos el progreso
  updateUserProgress(progress)
}

// Actualizar el progreso de un ejercicio completado (función nueva)
export function completeExercise(exerciseId: string, score: number, total: number): void {
  // Redirigir a la función requerida para mantener compatibilidad
  updateExerciseProgress(exerciseId, score, total)
}

// Actualizar el progreso de una lección completada (función nueva)
export function completeLesson(lessonId: string): void {
  // Redirigir a la función requerida para mantener compatibilidad
  updateLessonProgress(lessonId)
}

// Reiniciar el progreso
export function resetProgress(): void {
  if (typeof window === "undefined") return
  localStorage.setItem("userProgress", JSON.stringify(defaultProgress))
}
