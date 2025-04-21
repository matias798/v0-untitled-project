import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, CheckCircle } from "lucide-react"
import Link from "next/link"
import type { Lesson } from "@/types/lesson"
import { isLessonCompleted } from "@/lib/progress"

interface LessonCardProps {
  lesson: Lesson
}

export function LessonCard({ lesson }: LessonCardProps) {
  const completed = isLessonCompleted(lesson.id)

  return (
    <Link href={`/aprender/${lesson.id}`}>
      <Card
        className={`cursor-pointer transition-all hover:shadow-md ${completed ? "border-green-200 dark:border-green-900" : ""}`}
      >
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg">{lesson.title}</CardTitle>
            {completed && <CheckCircle className="h-5 w-5 text-green-500" />}
          </div>
          <CardDescription>{lesson.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <div className="flex items-center text-sm text-muted-foreground">
              <BookOpen className="h-4 w-4 mr-1" />
              {lesson.duration} min
            </div>
            <Badge variant={lesson.level === "basic" ? "default" : "secondary"}>
              {lesson.level === "basic" ? "Básico" : "Intermedio"}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
