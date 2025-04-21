"use client"

import { Component, type ErrorInfo, type ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("Error capturado por ErrorBoundary:", error, errorInfo)
  }

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <Card className="w-full">
          <CardContent className="p-6 text-center">
            <h2 className="text-2xl font-bold mb-4">Algo salió mal</h2>
            <p className="text-gray-600 mb-6">Lo sentimos, ha ocurrido un error al cargar este componente.</p>
            <Button onClick={() => this.setState({ hasError: false })}>Intentar de nuevo</Button>
          </CardContent>
        </Card>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
