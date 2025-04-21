"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Volume2 } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

interface WordOfTheDayProps {
  word: string
  translation: string
  phonetic: string
  loading: boolean
  onPronounce: () => void
}

export function WordOfTheDay({ word, translation, phonetic, loading, onPronounce }: WordOfTheDayProps) {
  if (loading) {
    return (
      <Card className="glassmorphic p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <Badge variant="outline" className="bg-blue-50 text-blue-500 border-blue-200 mb-2">
              <Sparkles size={14} className="mr-1" />
              Palabra del día
            </Badge>
            <Skeleton className="h-8 w-32 mb-1" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
        <Skeleton className="h-6 w-full" />
      </Card>
    )
  }

  return (
    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
      <Card className="glassmorphic p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <Badge variant="outline" className="bg-blue-50 text-blue-500 border-blue-200 mb-2">
              <Sparkles size={14} className="mr-1" />
              Palabra del día
            </Badge>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">{word}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">{phonetic}</p>
          </div>
          <Button size="icon" variant="outline" className="rounded-full neumorphic-sm" onClick={onPronounce}>
            <Volume2 size={18} />
          </Button>
        </div>
        <p className="text-gray-700 dark:text-gray-300">{translation}</p>
      </Card>
    </motion.div>
  )
}
