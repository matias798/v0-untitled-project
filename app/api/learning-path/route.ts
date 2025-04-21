import { NextResponse } from "next/server"

export async function GET() {
  // Log para depuración
  console.log("API de camino de aprendizaje llamada")

  return NextResponse.json(learningPath)
}

// Datos del camino de aprendizaje
const learningPath = [
  {
    id: "module-a1-basic",
    title: "Nivel A1 - Básico",
    description: "Primeros pasos en danés: saludos, números y frases básicas",
    level: "A1",
    completed: false,
    locked: false,
    progress: 0,
    exercises: [
      "multiple-a1-1",
      "basic-greetings",
      "basic-numbers",
      "basic-phrases",
      "food-vocabulary",
      "colors-vocabulary",
    ],
    culturalNote:
      "Dinamarca es conocida por su concepto de 'hygge', que se refiere a un sentimiento de comodidad, bienestar y satisfacción.",
  },
  {
    id: "module-a2-elementary",
    title: "Nivel A2 - Elemental",
    description: "Conversaciones simples y gramática básica",
    level: "A2",
    completed: false,
    locked: false,
    progress: 0,
    exercises: ["daily-activities", "weather-expressions", "basic-grammar", "telling-time"],
    culturalNote:
      "Los daneses son conocidos por su diseño minimalista y funcional, que se refleja en su arquitectura, muebles y estilo de vida.",
  },
  {
    id: "module-b1-intermediate",
    title: "Nivel B1 - Intermedio",
    description: "Conversaciones más complejas y temas cotidianos",
    level: "B1",
    completed: false,
    locked: false,
    progress: 0,
    exercises: ["hobbies-interests", "travel-vocabulary", "past-tense", "future-plans"],
    culturalNote:
      "El 'Janteloven' (Ley de Jante) es un código social danés que promueve la humildad y desalienta destacar individualmente por encima del grupo.",
  },
  {
    id: "module-b2-advanced",
    title: "Nivel B2 - Avanzado",
    description: "Fluidez y temas complejos",
    level: "B2",
    completed: false,
    locked: false,
    progress: 0,
    exercises: ["abstract-concepts", "cultural-expressions", "hypothetical-situations", "danish-literature"],
    culturalNote:
      "Dinamarca tiene una rica tradición literaria, con autores como Hans Christian Andersen, famoso por sus cuentos de hadas, y filósofos como Søren Kierkegaard.",
  },
]
