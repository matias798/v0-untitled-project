"use client"

import { useState, useEffect } from "react"
import { useLocalStorage } from "@/hooks/useLocalStorage"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

interface WordDisplayProps {
  word: string
  translation?: string
  example?: string
  className?: string
}

export function WordDisplay({ word, translation, example, className = "" }: WordDisplayProps) {
  const [learnedWords, setLearnedWords] = useLocalStorage<string[]>("learnedWords", [])
  const [isLearned, setIsLearned] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    setIsLearned(learnedWords.includes(word))
  }, [word, learnedWords])

  const toggleLearned = () => {
    if (isLearned) {
      // Unmark as learned
      const newLearnedWords = learnedWords.filter((w) => w !== word)
      setLearnedWords(newLearnedWords)

      toast({
        title: "Word unmarked",
        description: `"${word}" has been unmarked as learned.`,
        action: (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setLearnedWords([...newLearnedWords, word])
            }}
          >
            Undo
          </Button>
        ),
        duration: 3000,
      })
    } else {
      // Mark as learned
      const newLearnedWords = [...learnedWords, word]
      setLearnedWords(newLearnedWords)

      toast({
        title: "Word learned!",
        description: `"${word}" has been marked as learned.`,
        action: (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setLearnedWords(learnedWords)
            }}
          >
            Undo
          </Button>
        ),
        duration: 3000,
      })
    }
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span
            className={`cursor-pointer ${isLearned ? "text-green-600 dark:text-green-400 opacity-70" : ""} ${className}`}
            onClick={toggleLearned}
          >
            {word}
          </span>
        </TooltipTrigger>
        <TooltipContent>
          <div className="space-y-2 p-1">
            <p>
              <strong>Translation:</strong> {translation || "Not available"}
            </p>
            {example && (
              <p>
                <strong>Example:</strong> {example}
              </p>
            )}
            <Button variant="outline" size="sm" className="w-full" onClick={toggleLearned}>
              {isLearned ? "Unmark as learned" : "Mark as learned"}
            </Button>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
