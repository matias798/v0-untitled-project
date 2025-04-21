"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTheme } from "next-themes"
import { useToast } from "@/hooks/use-toast"
import { useSettings } from "@/hooks/use-settings"
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
import { Moon, Sun, Languages, Volume2, Download, Trash2, Wifi, WifiOff } from "lucide-react"

export default function SettingsScreen() {
  const { theme, setTheme } = useTheme()
  const { toast } = useToast()
  const { language, setLanguage, autoTTS, setAutoTTS, offlineMode, setOfflineMode } = useSettings()

  const [mounted, setMounted] = useState(false)
  const [learnedWordsCount, setLearnedWordsCount] = useState(0)
  const [flashcardsCount, setFlashcardsCount] = useState(0)

  // Avoid hydration issues
  useEffect(() => {
    setMounted(true)

    // Load statistics
    if (typeof window !== "undefined") {
      try {
        const learnedWords = JSON.parse(localStorage.getItem("learnedWords") || "[]")
        setLearnedWordsCount(learnedWords.length)

        const flashcardsProgress = JSON.parse(localStorage.getItem("flashcards-progress") || "{}")
        setFlashcardsCount(Object.keys(flashcardsProgress).length)
      } catch (error) {
        console.error("Error loading stats:", error)
      }
    }
  }, [])

  const resetProgress = () => {
    if (typeof window !== "undefined") {
      // Save backups
      const backup = {
        learnedWords: localStorage.getItem("learnedWords"),
        flashcardsProgress: localStorage.getItem("flashcards-progress"),
        userProgress: localStorage.getItem("userProgress"),
      }

      // Remove data
      localStorage.removeItem("learnedWords")
      localStorage.removeItem("flashcards-progress")
      localStorage.removeItem("userProgress")
      localStorage.removeItem("reviews-today")
      localStorage.removeItem("last-review-date")

      // Update counters
      setLearnedWordsCount(0)
      setFlashcardsCount(0)

      // Show toast
      toast({
        title: "Progress reset",
        description: "All your progress has been deleted.",
        action: (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              // Restore backups
              if (backup.learnedWords) {
                localStorage.setItem("learnedWords", backup.learnedWords)
              }
              if (backup.flashcardsProgress) {
                localStorage.setItem("flashcards-progress", backup.flashcardsProgress)
              }
              if (backup.userProgress) {
                localStorage.setItem("userProgress", backup.userProgress)
              }

              // Update counters
              try {
                const learnedWords = JSON.parse(backup.learnedWords || "[]")
                setLearnedWordsCount(learnedWords.length)

                const flashcardsProgress = JSON.parse(backup.flashcardsProgress || "{}")
                setFlashcardsCount(Object.keys(flashcardsProgress).length)
              } catch (error) {
                console.error("Error restoring backup:", error)
              }

              toast({
                title: "Progress restored",
                description: "Your progress has been successfully restored.",
              })
            }}
          >
            Undo
          </Button>
        ),
        duration: 5000,
      })
    }
  }

  const exportProgress = () => {
    if (typeof window !== "undefined") {
      try {
        const data = {
          learnedWords: JSON.parse(localStorage.getItem("learnedWords") || "[]"),
          flashcardsProgress: JSON.parse(localStorage.getItem("flashcards-progress") || "{}"),
          userProgress: JSON.parse(localStorage.getItem("userProgress") || "{}"),
        }

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
        const url = URL.createObjectURL(blob)

        const a = document.createElement("a")
        a.href = url
        a.download = `danish-learner-progress-${new Date().toISOString().split("T")[0]}.json`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)

        toast({
          title: "Progress exported",
          description: "Your progress has been successfully exported.",
        })
      } catch (error) {
        console.error("Error exporting progress:", error)
        toast({
          title: "Error",
          description: "Could not export progress.",
          variant: "destructive",
        })
      }
    }
  }

  // Avoid hydration issues
  if (!mounted) return null

  return (
    <div className="container max-w-md mx-auto p-4 pt-8 pb-24">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-1">
          <span className="text-blue-500">Settings</span>
        </h1>
        <p className="text-gray-600 dark:text-gray-300">Customize your learning experience</p>
      </header>

      <div className="space-y-6">
        {/* Appearance */}
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {theme === "dark" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                <Label htmlFor="theme-mode">Dark mode</Label>
              </div>
              <Switch
                id="theme-mode"
                checked={theme === "dark"}
                onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
              />
            </div>
          </CardContent>
        </Card>

        {/* Language and accessibility */}
        <Card>
          <CardHeader>
            <CardTitle>Language and accessibility</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Languages className="h-5 w-5" />
                <Label>Interface language</Label>
              </div>
              <Select value={language} onValueChange={(value) => setLanguage(value as "es" | "en" | "da")}>
                <SelectTrigger className="w-[100px]">
                  <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="da">Dansk</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Volume2 className="h-5 w-5" />
                <Label htmlFor="auto-tts">Automatic pronunciation</Label>
              </div>
              <Switch id="auto-tts" checked={autoTTS} onCheckedChange={setAutoTTS} />
            </div>
          </CardContent>
        </Card>

        {/* Offline mode */}
        <Card>
          <CardHeader>
            <CardTitle>Offline mode</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {offlineMode ? <WifiOff className="h-5 w-5" /> : <Wifi className="h-5 w-5" />}
                <Label htmlFor="offline-mode">Offline mode</Label>
              </div>
              <Switch id="offline-mode" checked={offlineMode} onCheckedChange={setOfflineMode} />
            </div>
            <p className="text-sm text-gray-500">
              Offline mode uses locally stored data. Some features may be limited.
            </p>
          </CardContent>
        </Card>

        {/* Data and progress */}
        <Card>
          <CardHeader>
            <CardTitle>Data and progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
                <p className="text-2xl font-bold">{learnedWordsCount}</p>
                <p className="text-sm text-gray-500">Words learned</p>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
                <p className="text-2xl font-bold">{flashcardsCount}</p>
                <p className="text-sm text-gray-500">Cards studied</p>
              </div>
            </div>

            <Button variant="outline" className="w-full flex items-center justify-center" onClick={exportProgress}>
              <Download className="h-4 w-4 mr-2" />
              Export progress
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full flex items-center justify-center">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Reset progress
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. It will delete all your progress and statistics.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={resetProgress}>Continue</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
