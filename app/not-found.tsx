import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function NotFound() {
  return (
    <div className="container max-w-md mx-auto p-4 flex flex-col items-center justify-center min-h-screen">
      <Card className="w-full">
        <CardContent className="p-6 text-center">
          <h2 className="text-2xl font-bold mb-4">Página no encontrada</h2>
          <p className="text-gray-600 mb-6">Lo sentimos, la página que estás buscando no existe o ha sido movida.</p>
          <div className="flex flex-col gap-2">
            <Button asChild>
              <Link href="/">Volver al inicio</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/ejercicios">Ver ejercicios</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
