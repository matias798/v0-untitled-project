import type { Achievement } from "@/types/achievement"
import { getUserProgress } from "./progress"

// Obtener los logros del usuario
export function getUserAchievements(): Achievement[] {
  const progress = getUserProgress()

  const achievements: Achievement[] = [
    {
      id: "streak-3",
      title: "Constancia inicial",
      description: "Completa 3 días seguidos de aprendizaje",
      xp: 10,
      unlocked: progress.streak >= 3,
      progress: progress.streak >= 3 ? 100 : Math.round((progress.streak / 3) * 100),
    },
    {
      id: "streak-7",
      title: "Semana completa",
      description: "Completa 7 días seguidos de aprendizaje",
      xp: 25,
      unlocked: progress.streak >= 7,
      progress: progress.streak >= 7 ? 100 : Math.round((progress.streak / 7) * 100),
    },
    {
      id: "words-10",
      title: "Vocabulario básico",
      description: "Aprende 10 palabras nuevas",
      xp: 15,
      unlocked: progress.wordsLearned >= 10,
      progress: progress.wordsLearned >= 10 ? 100 : Math.round((progress.wordsLearned / 10) * 100),
    },
    {
      id: "words-50",
      title: "Vocabulario intermedio",
      description: "Aprende 50 palabras nuevas",
      xp: 30,
      unlocked: progress.wordsLearned >= 50,
      progress: progress.wordsLearned >= 50 ? 100 : Math.round((progress.wordsLearned / 50) * 100),
    },
    {
      id: "lessons-5",
      title: "Estudiante principiante",
      description: "Completa 5 lecciones",
      xp: 20,
      unlocked: progress.lessonsCompleted >= 5,
      progress: progress.lessonsCompleted >= 5 ? 100 : Math.round((progress.lessonsCompleted / 5) * 100),
    },
    {
      id: "exercises-10",
      title: "Practicante dedicado",
      description: "Completa 10 ejercicios",
      xp: 25,
      unlocked: progress.exercisesCompleted >= 10,
      progress: progress.exercisesCompleted >= 10 ? 100 : Math.round((progress.exercisesCompleted / 10) * 100),
    },
    {
      id: "xp-100",
      title: "Primer nivel",
      description: "Consigue 100 puntos XP",
      xp: 30,
      unlocked: progress.totalXP >= 100,
      progress: progress.totalXP >= 100 ? 100 : Math.round((progress.totalXP / 100) * 100),
    },
  ]

  return achievements
}
