"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getUserProgress } from "@/lib/progress"
import { getUserAchievements } from "@/lib/achievements"
import { useTheme } from "next-themes"
import type { Achievement } from "@/types/achievement"
import { AchievementCard } from "@/components/achievement-card"
import { Award, Calendar, BookOpen, Moon, Sun, Download, Trash2 } from "lucide-react"

export default function ProfileScreen() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [progress, setProgress] = useState({
    streak: 0,
    wordsLearned: 0,
    lessonsCompleted: 0,
    totalXP: 0,
  })

  useEffect(() => {
    setMounted(true)

    const userProgress = getUserProgress()
    setProgress({
      streak: userProgress.streak,
      wordsLearned: userProgress.wordsLearned,
      lessonsCompleted: userProgress.lessonsCompleted,
      totalXP: userProgress.totalXP,
    })

    setAchievements(getUserAchievements())
  }, [])

  // Evitar problemas de hidratación
  if (!mounted) return null

  return (
    <div className="container max-w-md mx-auto p-4 pt-8">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-1">
          Tu <span className="text-blue-500">perfil</span>
        </h1>
        <p className="text-gray-600 dark:text-gray-300">Estadísticas y logros</p>
      </header>

      <Card className="glassmorphic p-6 mb-6">
        <div className="flex items-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-2xl font-bold mr-4">
            {progress.totalXP}
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">Puntos XP</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">Nivel {Math.floor(progress.totalXP / 100) + 1}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="flex flex-col items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
            <Calendar size={20} className="text-blue-500 mb-1" />
            <span className="text-lg font-bold">{progress.streak}</span>
            <span className="text-xs text-gray-500">Días</span>
          </div>

          <div className="flex flex-col items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
            <Award size={20} className="text-green-500 mb-1" />
            <span className="text-lg font-bold">{progress.wordsLearned}</span>
            <span className="text-xs text-gray-500">Palabras</span>
          </div>

          <div className="flex flex-col items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
            <BookOpen size={20} className="text-rose-500 mb-1" />
            <span className="text-lg font-bold">{progress.lessonsCompleted}</span>
            <span className="text-xs text-gray-500">Lecciones</span>
          </div>
        </div>
      </Card>

      <Tabs defaultValue="achievements" className="w-full mb-6">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="achievements">Logros</TabsTrigger>
          <TabsTrigger value="settings">Ajustes</TabsTrigger>
        </TabsList>

        <TabsContent value="achievements" className="space-y-4">
          {achievements.map((achievement, index) => (
            <AchievementCard key={achievement.id} achievement={achievement} index={index} />
          ))}
        </TabsContent>

        <TabsContent value="settings">
          <Card className="glassmorphic p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {theme === "dark" ? <Moon size={18} /> : <Sun size={18} />}
                  <Label htmlFor="theme-mode">Modo oscuro</Label>
                </div>
                <Switch
                  id="theme-mode"
                  checked={theme === "dark"}
                  onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                />
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <Button variant="outline" className="w-full mb-2">
                  <Download size={16} className="mr-2" />
                  Exportar progreso
                </Button>

                <Button variant="destructive" className="w-full">
                  <Trash2 size={16} className="mr-2" />
                  Reiniciar progreso
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
