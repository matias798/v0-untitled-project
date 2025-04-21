"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Bot, Send, X, Minimize2, Maximize2, Volume2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { pronounceText } from "@/lib/dictionary"

interface Message {
  role: "user" | "assistant"
  content: string
}

// Simple local responses for common Danish learning questions
const localResponses: Record<string, string> = {
  hola: "¡Hej! (Hola en danés)",
  gracias: "En danés se dice 'tak' para agradecer.",
  "buenos días": "God morgen (buenos días), God dag (buen día)",
  "buenas tardes": "God eftermiddag (buenas tardes)",
  "buenas noches": "God aften (buenas noches para saludar), God nat (buenas noches para despedirse)",
  adiós: "Farvel (adiós formal), Hej hej (adiós informal)",
  "cómo estás": "Hvordan går det? (¿Cómo estás?)",
  "me llamo": "Jeg hedder... (Me llamo...)",
  pronunciación:
    "La pronunciación danesa es desafiante. Las vocales son muy importantes y hay sonidos que no existen en español.",
  alfabeto: "El alfabeto danés tiene 29 letras, incluyendo Æ, Ø y Å que son letras específicas del danés.",
  números:
    "Los números del 1 al 10 en danés son: en/et (1), to (2), tre (3), fire (4), fem (5), seks (6), syv (7), otte (8), ni (9), ti (10).",
  ayuda: "Estoy aquí para ayudarte con el danés. Puedes preguntarme sobre vocabulario, gramática o frases útiles.",
  gramática:
    "La gramática danesa tiene algunas particularidades como los artículos definidos que se añaden al final de los sustantivos (en/et) y el orden de las palabras donde el verbo siempre va en segunda posición.",
  cultura:
    "Dinamarca es conocida por el concepto de 'hygge' (comodidad y bienestar), su diseño, la monarquía, y ser uno de los países más felices del mundo.",
  comida:
    "Platos típicos daneses incluyen smørrebrød (sándwich abierto), frikadeller (albóndigas), y stegt flæsk (panceta frita con patatas y perejil).",
}

export function AiAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "¡Hej! Soy tu asistente de danés. ¿En qué puedo ayudarte hoy? Puedes preguntarme sobre gramática, vocabulario o cultura danesa.",
    },
  ])
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  const handleSendMessage = async () => {
    if (!input.trim()) return

    const userMessage = input.trim()
    setInput("")

    // Add user message to chat
    setMessages((prev) => [...prev, { role: "user", content: userMessage }])
    setIsLoading(true)

    // Simulate processing delay
    setTimeout(() => {
      // Generate a response based on the user's message
      const response = generateResponse(userMessage)

      // Add assistant response to chat
      setMessages((prev) => [...prev, { role: "assistant", content: response }])
      setIsLoading(false)
    }, 1000)
  }

  // Simple response generation based on user input
  const generateResponse = (userMessage: string): string => {
    const normalizedMessage = userMessage.toLowerCase()

    // Check for exact matches in our local responses
    for (const [key, response] of Object.entries(localResponses)) {
      if (normalizedMessage.includes(key)) {
        return response
      }
    }

    // Check for question types
    if (normalizedMessage.includes("cómo se dice")) {
      return "Para traducir palabras específicas, te recomiendo usar los ejercicios de vocabulario en la aplicación. Allí encontrarás muchas palabras útiles en danés con su pronunciación."
    }

    if (normalizedMessage.includes("qué significa")) {
      return "Para entender el significado de palabras en danés, puedes usar la sección de vocabulario o los ejercicios de traducción en la aplicación."
    }

    // Default responses
    const defaultResponses = [
      "Interesante pregunta. Te recomiendo revisar las lecciones de la aplicación donde encontrarás información detallada sobre este tema.",
      "Para aprender más sobre esto, prueba los ejercicios interactivos en la sección de Ejercicios.",
      "El danés es un idioma fascinante. Sigue practicando con las lecciones y ejercicios de la aplicación para mejorar.",
      "¡Buen intento! Recuerda que la práctica constante es clave para aprender danés. Explora las diferentes secciones de la aplicación para seguir aprendiendo.",
      "Te sugiero revisar la sección de lecciones donde encontrarás explicaciones detalladas sobre este tema.",
    ]

    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)]
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized)
  }

  const pronounceTextFunc = (text: string) => {
    pronounceText(text, "da")
  }

  return (
    <>
      {/* Floating button to open assistant */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="fixed bottom-24 right-4 z-50 w-14 h-14 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-lg"
          onClick={() => setIsOpen(true)}
        >
          <Bot size={24} />
        </motion.button>
      )}

      {/* Assistant dialog */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              height: isMinimized ? "auto" : "70vh",
              width: isMinimized ? "300px" : "350px",
            }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: "spring", damping: 20 }}
            className="fixed bottom-24 right-4 z-50 shadow-xl"
          >
            <Card className="flex flex-col h-full glassmorphic overflow-hidden">
              {/* Header */}
              <div className="p-3 bg-blue-500 text-white flex items-center justify-between">
                <div className="flex items-center">
                  <Bot size={18} className="mr-2" />
                  <span className="font-medium">Asistente de Danés</span>
                </div>
                <div className="flex items-center space-x-2">
                  <button onClick={toggleMinimize} className="hover:bg-blue-600 p-1 rounded">
                    {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
                  </button>
                  <button onClick={() => setIsOpen(false)} className="hover:bg-blue-600 p-1 rounded">
                    <X size={16} />
                  </button>
                </div>
              </div>

              {/* Messages area */}
              {!isMinimized && (
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message, index) => (
                    <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[80%] p-3 rounded-lg ${
                          message.role === "user"
                            ? "bg-blue-100 dark:bg-blue-900 text-gray-800 dark:text-gray-100"
                            : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100"
                        }`}
                      >
                        <div className="whitespace-pre-wrap">{message.content}</div>
                        {message.role === "assistant" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="mt-1 h-6 px-2 text-xs"
                            onClick={() => pronounceTextFunc(message.content)}
                          >
                            <Volume2 className="h-3 w-3 mr-1" />
                            Pronunciar
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="max-w-[80%] p-3 rounded-lg bg-gray-100 dark:bg-gray-800">
                        <div className="flex space-x-2">
                          <div
                            className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                            style={{ animationDelay: "0ms" }}
                          ></div>
                          <div
                            className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                            style={{ animationDelay: "150ms" }}
                          ></div>
                          <div
                            className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                            style={{ animationDelay: "300ms" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              )}

              {/* Input area */}
              <div className="p-3 border-t border-gray-200 dark:border-gray-700">
                <div className="flex space-x-2">
                  <Textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Escribe tu pregunta sobre danés..."
                    className="flex-1 resize-none"
                    rows={1}
                    disabled={isLoading}
                  />
                  <Button onClick={handleSendMessage} disabled={!input.trim() || isLoading} size="icon">
                    <Send size={18} />
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
