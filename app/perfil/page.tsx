"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Award, Calendar, CheckCircle2, Moon, Sun, Trash2 } from "lucide-react"
import { getUserProgress, resetProgress } from "@/lib/progress"
import { useTheme } from "next-themes"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function PerfilPage() {
  const { theme, setTheme } = useTheme()
  const [progress, setProgress] = useState({
    streak: 0,
    wordsLearned: 0,
    lessonsCompleted: 0,
    exercisesCompleted: 0,
    totalXP: 0,
    lastActive: "",
  })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setProgress(getUserProgress())
  }, [])

  const handleResetProgress = () => {
    resetProgress()
    setProgress(getUserProgress())
  }

  // Evitar problemas de hidratación
  if (!mounted) return null

  return (
    <div className="container max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Tu perfil</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Estadísticas</CardTitle>
          <CardDescription>Tu progreso aprendiendo danés</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col items-center justify-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <Calendar className="h-8 w-8 text-blue-500 mb-2" />
              <span className="text-2xl font-bold">{progress.streak}</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">Días seguidos</span>
            </div>

            <div className="flex flex-col items-center justify-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <CheckCircle2 className="h-8 w-8 text-green-500 mb-2" />
              <span className="text-2xl font-bold">{progress.wordsLearned}</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">Palabras aprendidas</span>
            </div>

            <div className="flex flex-col items-center justify-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <Award className="h-8 w-8 text-purple-500 mb-2" />
              <span className="text-2xl font-bold">{progress.totalXP}</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">Puntos XP</span>
            </div>

            <div className="flex flex-col items-center justify-center p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
              <CheckCircle2 className="h-8 w-8 text-amber-500 mb-2" />
              <span className="text-2xl font-bold">{progress.lessonsCompleted}</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">Lecciones completadas</span>
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-500 dark:text-gray-400 text-center">
            Última actividad: {progress.lastActive || "Hoy"}
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Preferencias</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {theme === "dark" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
              <Label htmlFor="theme-mode">Modo oscuro</Label>
            </div>
            <Switch
              id="theme-mode"
              checked={theme === "dark"}
              onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
            />
          </div>
        </CardContent>
      </Card>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" className="w-full flex items-center justify-center">
            <Trash2 className="h-4 w-4 mr-2" />
            Reiniciar progreso
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará todo tu progreso y estadísticas.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleResetProgress}>Continuar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
