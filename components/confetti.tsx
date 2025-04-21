"use client"

import { useEffect } from "react"
import confetti from "canvas-confetti"

export function Confetti() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      const duration = 2000
      const end = Date.now() + duration

      const colors = ["#3B82F6", "#10B981", "#F59E0B"]

      const frame = () => {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: colors,
        })

        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: colors,
        })

        if (Date.now() < end) {
          requestAnimationFrame(frame)
        }
      }

      frame()
    }
  }, [])

  // No renderizamos nada, solo ejecutamos el efecto
  return null
}
