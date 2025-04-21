"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { GrammarCard } from "@/components/grammar-card"
import { getGrammarTopic } from "@/services/grammar"

// Define an interface for the grammar topic type
interface GrammarTopicData {
  id: string
  title: string
  description: string
  level: string
  sections: Array<{
    title: string
    explanation: string
    examples: Array<{
      danish: string
      spanish: string
    }>
    quiz?: {
      type: string
      question: string
      options?: string[]
      correctAnswer: string
    }
  }>
}

export default function GrammarTopicPage({ params }: { params: { topic: string } }) {
  const router = useRouter()
  const [topic, setTopic] = useState<GrammarTopicData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadTopic() {
      try {
        setLoading(true)
        const topicData = await getGrammarTopic(params.topic)

        if (!topicData) {
          throw new Error(`Grammar topic not found: ${params.topic}`)
        }

        setTopic(topicData)
        setError(null)
      } catch (err: any) {
        console.error("Error loading grammar topic:", err)
        setError(`Could not load grammar topic: ${err.message}`)
      } finally {
        setLoading(false)
      }
    }

    loadTopic()
  }, [params.topic])

  if (loading) {
    return (
      <div className="container max-w-md mx-auto p-4 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-gray-500">Loading grammar topic...</p>
      </div>
    )
  }

  if (error || !topic) {
    return (
      <div className="container max-w-md mx-auto p-4">
        <Card className="mb-6">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-bold mb-4">Error</h2>
            <p className="text-red-500 mb-4">{error || "Topic not found"}</p>
            <Button onClick={() => router.push("/grammar")}>Back to grammar</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container max-w-md mx-auto p-4 pb-20">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="icon" onClick={() => router.push("/grammar")} className="mr-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{topic.title}</h1>
          <p className="text-sm text-gray-500">{topic.level} • Grammar</p>
        </div>
      </div>

      <div className="space-y-6">
        {topic.sections.map((section, index) => (
          <GrammarCard
            key={index}
            title={section.title}
            explanation={section.explanation}
            examples={section.examples}
            quiz={section.quiz}
          />
        ))}
      </div>
    </div>
  )
}
