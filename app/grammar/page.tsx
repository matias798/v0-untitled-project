"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { motion } from "framer-motion"
import { getAllGrammarTopics } from "@/services/grammar"

export default function GrammarPage() {
  const [topics, setTopics] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadTopics() {
      try {
        setLoading(true)
        const allTopics = await getAllGrammarTopics()
        setTopics(allTopics)
        setError(null)
      } catch (err: any) {
        console.error("Error loading grammar topics:", err)
        setError(`Could not load grammar topics: ${err.message}`)
      } finally {
        setLoading(false)
      }
    }

    loadTopics()
  }, [])

  if (loading) {
    return (
      <div className="container max-w-md mx-auto p-4 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-gray-500">Loading grammar topics...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container max-w-md mx-auto p-4">
        <Card className="p-6 text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="container max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Danish Grammar</h1>

      <div className="space-y-4">
        {topics.map((topic, index) => (
          <motion.div
            key={topic.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Link href={`/grammar/${topic.id}`}>
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{topic.title}</CardTitle>
                  <CardDescription>{topic.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-500">
                      Level {topic.level} • {topic.sections.length} sections
                    </div>
                    <Button variant="outline" size="sm">
                      View topic
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
