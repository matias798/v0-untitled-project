"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Error en la aplicación:", error)
  }, [error])

  return (
    <div className="container max-w-md mx-auto p-4 flex flex-col items-center justify-center min-h-screen">
      <Card className="w-full">
        <CardContent className="p-6 text-center">
          <h2 className="text-2xl font-bold mb-4">Algo salió mal</h2>
          <p className="text-gray-600 mb-6">Lo sentimos, ha ocurrido un error al cargar esta página.</p>
          <div className="flex flex-col gap-2">
            <Button onClick={() => reset()}>Intentar de nuevo</Button>
            <Button variant="outline" onClick={() => (window.location.href = "/")}>
              Volver al inicio
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
