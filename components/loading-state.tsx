"\"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"

interface LoadingStateProps {
  message?: string
}

export function LoadingState({ message = "Cargando..." }: LoadingStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container max-w-md mx-auto p-4 flex flex-col items-center justify-center min-h-[60vh]"
    >
      <Card className="w-full">
        <CardContent className="p-6 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-500">{message}</p>
        </CardContent>
      </Card>
    </motion.div>
  )
}
