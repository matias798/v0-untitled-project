"use client"

import { useState, useEffect } from "react"
import { getUserProgress } from "@/lib/progress"
import { getRandomWord, translateText, pronounceText } from "@/lib/dictionary"
import { WordOfTheDay } from "@/components/word-of-the-day"
import { DailyGoal } from "@/components/daily-goal"
import { LearningStats } from "@/components/learning-stats"
import { RecommendedLessons } from "@/components/recommended-lessons"

export default function HomeScreen() {
  const [progress, setProgress] = useState({
    streak: 0,
    wordsLearned: 0,
    lessonsCompleted: 0,
    dailyGoalProgress: 0,
  })

  const [wordOfTheDay, setWordOfTheDay] = useState({
    word: "",
    translation: "",
    phonetic: "",
    loading: true,
  })

  useEffect(() => {
    // Cargar progreso del usuario
    const userProgress = getUserProgress()
    setProgress({
      streak: userProgress.streak,
      wordsLearned: userProgress.wordsLearned,
      lessonsCompleted: userProgress.lessonsCompleted,
      dailyGoalProgress: userProgress.dailyGoalProgress,
    })

    // Cargar palabra del día
    const loadWordOfTheDay = async () => {
      try {
        setWordOfTheDay((prev) => ({ ...prev, loading: true }))

        const word = await getRandomWord()
        let translation = word.translation

        // Solo intentar traducir si no tenemos ya una traducción
        if (!translation) {
          try {
            translation = await translateText(word.word, "da", "es")
          } catch (translationError) {
            console.error("Error translating word:", translationError)
            translation = "Traducción no disponible"
          }
        }

        setWordOfTheDay({
          word: word.word,
          translation: translation,
          phonetic: word.phonetic || "",
          loading: false,
        })
      } catch (error) {
        console.error("Error loading word of the day:", error)
        // Usar una palabra predeterminada en caso de error
        setWordOfTheDay({
          word: "hej",
          translation: "hola",
          phonetic: "/haj/",
          loading: false,
        })
      }
    }

    loadWordOfTheDay()
  }, [])

  const handlePronounce = () => {
    pronounceText(wordOfTheDay.word, "da")
  }

  return (
    <div className="container max-w-md mx-auto p-4 pt-8">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-1">
          Hej! <span className="text-blue-500">Velkommen</span>
        </h1>
        <p className="text-gray-600 dark:text-gray-300">Continúa tu viaje por el danés</p>
      </header>

      <WordOfTheDay
        word={wordOfTheDay.word}
        translation={wordOfTheDay.translation}
        phonetic={wordOfTheDay.phonetic}
        loading={wordOfTheDay.loading}
        onPronounce={handlePronounce}
      />

      <DailyGoal progress={progress.dailyGoalProgress} />

      <LearningStats
        streak={progress.streak}
        wordsLearned={progress.wordsLearned}
        lessonsCompleted={progress.lessonsCompleted}
      />

      <RecommendedLessons />
    </div>
  )
}
