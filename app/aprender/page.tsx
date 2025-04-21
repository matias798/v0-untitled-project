"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LessonCard } from "@/components/lesson-card"
import { getLessons } from "@/lib/lessons"
import type { Lesson } from "@/types/lesson"

export default function AprenderPage() {
  const [lessons, setLessons] = useState<{
    basic: Lesson[]
    intermediate: Lesson[]
  }>({ basic: [], intermediate: [] })

  useEffect(() => {
    const allLessons = getLessons()
    setLessons({
      basic: allLessons.filter((lesson) => lesson.level === "basic"),
      intermediate: allLessons.filter((lesson) => lesson.level === "intermediate"),
    })
  }, [])

  return (
    <div className="container max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Aprender Danés</h1>

      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="basic">Básico</TabsTrigger>
          <TabsTrigger value="intermediate">Intermedio</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          {lessons.basic.map((lesson) => (
            <LessonCard key={lesson.id} lesson={lesson} />
          ))}
        </TabsContent>

        <TabsContent value="intermediate" className="space-y-4">
          {lessons.intermediate.length > 0 ? (
            lessons.intermediate.map((lesson) => <LessonCard key={lesson.id} lesson={lesson} />)
          ) : (
            <div className="text-center p-8 border rounded-lg">
              <p className="text-gray-500 dark:text-gray-400">
                Completa las lecciones básicas para desbloquear el nivel intermedio.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
