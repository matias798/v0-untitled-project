import type { Lesson, PathModule } from "@/types/lesson"
import { getUserProgress } from "@/lib/progress"

// Obtener todas las lecciones disponibles (función requerida)
export function getLessons(): Lesson[] {
  // Lecciones de ejemplo
  return [
    {
      id: "basic-1",
      title: "Saludos y presentaciones",
      description: "Aprende a saludar y presentarte en danés",
      level: "A1",
      duration: 10,
      icon: "👋",
      color: {
        light: "#DBEAFE",
        dark: "#3B82F6",
      },
      content: [
        {
          type: "dialog",
          lines: [
            {
              speaker: "danish",
              text: "Hej! Jeg hedder Lars.",
              translation: "¡Hola! Me llamo Lars.",
            },
            {
              speaker: "spanish",
              text: "Hola, me llamo María.",
              translation: "Hej, jeg hedder María.",
            },
          ],
        },
        {
          type: "explanation",
          title: "Saludos en danés",
          text: "En danés, 'Hej' significa 'Hola' y es la forma más común de saludar.",
          examples: [
            {
              danish: "Hej, jeg hedder Peter.",
              spanish: "Hola, me llamo Peter.",
            },
          ],
        },
      ],
    },
    {
      id: "basic-2",
      title: "Números del 1 al 10",
      description: "Aprende los números básicos en danés",
      level: "A1",
      duration: 8,
      icon: "🔢",
      color: {
        light: "#D1FAE5",
        dark: "#10B981",
      },
      content: [
        {
          type: "explanation",
          title: "Números del 1 al 10",
          text: "Aquí están los números del 1 al 10 en danés:",
          examples: [
            { danish: "1 - en/et", spanish: "1 - uno" },
            { danish: "2 - to", spanish: "2 - dos" },
            { danish: "3 - tre", spanish: "3 - tres" },
            { danish: "4 - fire", spanish: "4 - cuatro" },
            { danish: "5 - fem", spanish: "5 - cinco" },
            { danish: "6 - seks", spanish: "6 - seis" },
            { danish: "7 - syv", spanish: "7 - siete" },
            { danish: "8 - otte", spanish: "8 - ocho" },
            { danish: "9 - ni", spanish: "9 - nueve" },
            { danish: "10 - ti", spanish: "10 - diez" },
          ],
        },
      ],
    },
    {
      id: "basic-3",
      title: "Frases cotidianas",
      description: "Expresiones útiles para el día a día",
      level: "A1",
      duration: 12,
      icon: "💬",
      color: {
        light: "#FEE2E2",
        dark: "#EF4444",
      },
      content: [
        {
          type: "dialog",
          lines: [
            {
              speaker: "danish",
              text: "Undskyld, hvor er toilettet?",
              translation: "Disculpa, ¿dónde está el baño?",
            },
            {
              speaker: "spanish",
              text: "El baño está a la derecha.",
              translation: "Toilettet er til højre.",
            },
          ],
        },
      ],
    },
    {
      id: "intermediate-1",
      title: "En el restaurante",
      description: "Pedir comida y bebida en danés",
      level: "A2",
      duration: 15,
      icon: "🍽️",
      color: {
        light: "#E0E7FF",
        dark: "#6366F1",
      },
      content: [
        {
          type: "dialog",
          lines: [
            {
              speaker: "danish",
              text: "Jeg vil gerne bestille.",
              translation: "Me gustaría pedir.",
            },
            {
              speaker: "spanish",
              text: "¿Qué desea tomar?",
              translation: "Hvad vil du drikke?",
            },
          ],
        },
      ],
    },
    {
      id: "intermediate-2",
      title: "Gramática básica",
      description: "Estructura de oraciones en danés",
      level: "A2",
      duration: 20,
      icon: "📝",
      color: {
        light: "#FEF3C7",
        dark: "#F59E0B",
      },
      content: [
        {
          type: "explanation",
          title: "Orden de las palabras",
          text: "En danés, el verbo siempre va en segunda posición en oraciones afirmativas.",
          examples: [
            {
              danish: "Jeg spiser et æble.",
              spanish: "Yo como una manzana.",
            },
            {
              danish: "I dag spiser jeg et æble.",
              spanish: "Hoy como una manzana.",
            },
          ],
        },
      ],
    },
    {
      id: "advanced-1",
      title: "Conversación avanzada",
      description: "Expresiones idiomáticas danesas",
      level: "B1",
      duration: 25,
      icon: "🗣️",
      color: {
        light: "#DDD6FE",
        dark: "#8B5CF6",
      },
      content: [
        {
          type: "explanation",
          title: "Expresiones idiomáticas",
          text: "Las expresiones idiomáticas son importantes para sonar más natural.",
          examples: [
            {
              danish: "Det regner skomagerdrenge.",
              spanish: "Llueve a cántaros. (Lit: Llueven aprendices de zapatero)",
            },
          ],
        },
      ],
    },
    {
      id: "advanced-2",
      title: "Cultura danesa",
      description: "Tradiciones y costumbres",
      level: "B2",
      duration: 30,
      icon: "🇩🇰",
      color: {
        light: "#FBCFE8",
        dark: "#EC4899",
      },
      content: [
        {
          type: "explanation",
          title: "Hygge",
          text: "Hygge es un concepto danés que se refiere a la sensación de comodidad, bienestar y satisfacción.",
          examples: [
            {
              danish: "Vi hygger os med en kop kaffe.",
              spanish: "Disfrutamos de un momento agradable con una taza de café.",
            },
          ],
        },
      ],
    },
  ]
}

// Obtener una lección por ID (función requerida)
export function getLessonById(id: string): Lesson | null {
  const lessons = getLessons()
  return lessons.find((lesson) => lesson.id === id) || null
}

// Lecciones recomendadas para la pantalla de inicio
export function getRecommendedLessons(): Lesson[] {
  const progress = getUserProgress()

  // Filtrar lecciones completadas y tomar las primeras 3 no completadas
  const incompleteLessons = getLessons()
    .filter((lesson) => !progress.completedLessons.includes(lesson.id))
    .slice(0, 3)

  // Si todas las lecciones están completadas, mostrar las 3 primeras
  if (incompleteLessons.length === 0) {
    return getLessons().slice(0, 3)
  }

  return incompleteLessons
}

// Obtener el camino de aprendizaje completo
export function getLearningPath(): PathModule[] {
  const progress = getUserProgress()
  const lessons = getLessons()

  // Agrupar lecciones por nivel
  const a1Lessons = lessons.filter((lesson) => lesson.level === "A1")
  const a2Lessons = lessons.filter((lesson) => lesson.level === "A2")
  const b1Lessons = lessons.filter((lesson) => lesson.level === "B1")
  const b2Lessons = lessons.filter((lesson) => lesson.level === "B2")

  // Crear módulos para cada nivel
  const modules: PathModule[] = [
    {
      id: "module-a1",
      title: "Nivel principiante",
      description: "Conceptos básicos del danés",
      level: "A1",
      completed: a1Lessons.every((lesson) => progress.completedLessons.includes(lesson.id)),
      locked: false, // Ningún módulo está bloqueado
      progress: calculateModuleProgress(
        a1Lessons.map((l) => l.id),
        progress.completedLessons,
      ),
      lessons: a1Lessons.map((l) => l.id),
    },
    {
      id: "module-a2",
      title: "Nivel elemental",
      description: "Conversaciones simples y gramática básica",
      level: "A2",
      completed: a2Lessons.every((lesson) => progress.completedLessons.includes(lesson.id)),
      locked: false, // Ningún módulo está bloqueado
      progress: calculateModuleProgress(
        a2Lessons.map((l) => l.id),
        progress.completedLessons,
      ),
      lessons: a2Lessons.map((l) => l.id),
    },
    {
      id: "module-b1",
      title: "Nivel intermedio",
      description: "Conversaciones más complejas",
      level: "B1",
      completed: b1Lessons.every((lesson) => progress.completedLessons.includes(lesson.id)),
      locked: false, // Ningún módulo está bloqueado
      progress: calculateModuleProgress(
        b1Lessons.map((l) => l.id),
        progress.completedLessons,
      ),
      lessons: b1Lessons.map((l) => l.id),
    },
    {
      id: "module-b2",
      title: "Nivel avanzado",
      description: "Fluidez y cultura danesa",
      level: "B2",
      completed: b2Lessons.every((lesson) => progress.completedLessons.includes(lesson.id)),
      locked: false, // Ningún módulo está bloqueado
      progress: calculateModuleProgress(
        b2Lessons.map((l) => l.id),
        progress.completedLessons,
      ),
      lessons: b2Lessons.map((l) => l.id),
    },
  ]

  return modules
}

// Función auxiliar para calcular el progreso de un módulo
function calculateModuleProgress(lessonIds: string[], completedLessons: string[]): number {
  if (lessonIds.length === 0) return 0

  const completedCount = lessonIds.filter((id) => completedLessons.includes(id)).length
  return Math.round((completedCount / lessonIds.length) * 100)
}
