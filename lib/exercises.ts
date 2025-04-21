import type { Exercise, ExerciseProgress } from "@/types/exercise"
import { getAllDanishWords, getAllSpanishToDanishPhrases } from "./dictionary"
import { getFromCache, saveToCache } from "./api-utils"
import { generateAllExercisesForLevel } from "@/services/exerciseGenerator"

// Cache for dynamically generated exercises
let dynamicExercisesCache: Exercise[] | null = null

// Get all available exercises
export async function getExercises(): Promise<Exercise[]> {
  try {
    // If we already have exercises in cache, return them
    if (dynamicExercisesCache) {
      return [...getBasicExercises(), ...dynamicExercisesCache]
    }

    // Generate dynamic exercises
    const dynamicExercises = await generateDynamicExercises()
    dynamicExercisesCache = dynamicExercises

    // Combine static exercises with dynamically generated ones
    return [...getBasicExercises(), ...dynamicExercises]
  } catch (error) {
    console.error("Error getting exercises:", error)
    // In case of error, return only static exercises
    return getBasicExercises()
  }
}

// Generate exercises dynamically
async function generateDynamicExercises(): Promise<Exercise[]> {
  const exercises: Exercise[] = []

  // Generate at least 300 items per type and level
  const levels: Array<"A1" | "A2" | "B1" | "B2"> = ["A1", "A2", "B1", "B2"]

  for (const level of levels) {
    try {
      // Generate exercises for each level and type
      const levelExercises = await generateAllExercisesForLevel(level)
      exercises.push(...levelExercises)
    } catch (error) {
      console.error(`Error generating exercises for level ${level}:`, error)
    }
  }

  return exercises
}

// Basic level exercises (A1)
function getBasicExercises(): Exercise[] {
  return [
    {
      id: "multiple-a1-1",
      title: "Basic Vocabulary",
      description: "Practice essential Danish words",
      type: "multipleChoice",
      level: "A1",
      category: "vocabulary",
      questions: [
        {
          text: "How do you say 'hello' in Danish?",
          options: ["Hej", "Farvel", "Tak", "Godmorgen"],
          correctAnswer: "Hej",
        },
        {
          text: "What does 'tak' mean in English?",
          options: ["Hello", "Goodbye", "Thank you", "Please"],
          correctAnswer: "Thank you",
        },
        {
          text: "How do you say 'good morning' in Danish?",
          options: ["God morgen", "God aften", "God nat", "God dag"],
          correctAnswer: "God morgen",
        },
        {
          text: "What does 'ja' mean in English?",
          options: ["No", "Yes", "Maybe", "Thank you"],
          correctAnswer: "Yes",
        },
        {
          text: "How do you say 'goodbye' in Danish?",
          options: ["Hej", "Farvel", "Tak", "Undskyld"],
          correctAnswer: "Farvel",
        },
      ],
    },
    // More basic exercises would be here
  ]
}

// Ejercicios de nivel intermedio (A2-B1)
function getIntermediateExercises(): Exercise[] {
  return [
    {
      id: "multiple-a2-1",
      title: "Vocabulario intermedio",
      description: "Amplía tu vocabulario danés",
      type: "multipleChoice",
      level: "A2",
      category: "vocabulary",
      questions: [
        {
          text: "¿Qué significa 'arbejde' en español?",
          options: ["Comer", "Dormir", "Trabajar", "Estudiar"],
          correctAnswer: "Trabajar",
        },
        {
          text: "¿Cómo se dice 'familia' en danés?",
          options: ["Ven", "Familie", "Hus", "Skole"],
          correctAnswer: "Familie",
        },
        {
          text: "¿Qué significa 'glad' en español?",
          options: ["Triste", "Enojado", "Cansado", "Feliz"],
          correctAnswer: "Feliz",
        },
        {
          text: "¿Cómo se dice 'tiempo' (meteorológico) en danés?",
          options: ["Tid", "Vejr", "Ur", "Klokke"],
          correctAnswer: "Vejr",
        },
        {
          text: "¿Qué significa 'at købe' en español?",
          options: ["Vender", "Comprar", "Alquilar", "Prestar"],
          correctAnswer: "Comprar",
        },
      ],
    },
    {
      id: "order-a2-1",
      title: "Frases complejas",
      description: "Ordena palabras para crear frases más elaboradas",
      type: "orderWords",
      level: "A2",
      category: "grammar",
      questions: [
        {
          text: "Forma la frase: 'Me gustaría un café'",
          words: ["gerne", "have", "en", "kaffe", "Jeg", "vil"],
          correctSentence: "Jeg vil gerne have en kaffe",
        },
        {
          text: "Forma la frase: '¿Dónde está la estación?'",
          words: ["er", "stationen", "Hvor"],
          correctSentence: "Hvor er stationen",
        },
        {
          text: "Forma la frase: 'No hablo danés muy bien'",
          words: ["ikke", "dansk", "godt", "Jeg", "taler", "meget"],
          correctSentence: "Jeg taler ikke dansk meget godt",
        },
        {
          text: "Forma la frase: '¿Cuánto cuesta esto?'",
          words: ["koster", "det", "Hvor", "meget"],
          correctSentence: "Hvor meget koster det",
        },
        {
          text: "Forma la frase: 'Necesito ayuda'",
          words: ["brug", "hjælp", "Jeg", "har", "for"],
          correctSentence: "Jeg har brug for hjælp",
        },
      ],
    },
    {
      id: "translation-b1-1",
      title: "Traducción intermedia",
      description: "Traduce frases más complejas del español al danés",
      type: "translation",
      level: "B1",
      category: "translation",
      questions: [
        {
          text: "Traduce al danés:",
          sourceText: "Me gustaría reservar una mesa para dos personas",
          targetLanguage: "da",
          correctTranslation: "Jeg vil gerne bestille et bord til to personer",
        },
        {
          text: "Traduce al danés:",
          sourceText: "¿Cuánto tiempo has vivido en Dinamarca?",
          targetLanguage: "da",
          correctTranslation: "Hvor længe har du boet i Danmark?",
        },
        {
          text: "Traduce al danés:",
          sourceText: "Estoy aprendiendo danés porque me gusta la cultura",
          targetLanguage: "da",
          correctTranslation: "Jeg lærer dansk fordi jeg kan lide kulturen",
        },
        {
          text: "Traduce al danés:",
          sourceText: "¿Podrías hablar más despacio, por favor?",
          targetLanguage: "da",
          correctTranslation: "Kan du tale langsommere, tak?",
        },
        {
          text: "Traduce al danés:",
          sourceText: "Mañana voy a visitar el museo",
          targetLanguage: "da",
          correctTranslation: "I morgen skal jeg besøge museet",
        },
      ],
    },
    {
      id: "matching-a2-1",
      title: "Emparejar palabras",
      description: "Relaciona palabras danesas con su traducción",
      type: "matching",
      level: "A2",
      category: "vocabulary",
      questions: [
        {
          text: "Empareja cada palabra danesa con su traducción al español:",
          pairs: [
            { left: "hus", right: "casa" },
            { left: "bil", right: "coche" },
            { left: "bog", right: "libro" },
            { left: "mad", right: "comida" },
            { left: "vand", right: "agua" },
          ],
        },
        {
          text: "Empareja cada palabra danesa con su traducción al español:",
          pairs: [
            { left: "rød", right: "rojo" },
            { left: "blå", right: "azul" },
            { left: "grøn", right: "verde" },
            { left: "gul", right: "amarillo" },
            { left: "sort", right: "negro" },
          ],
        },
        {
          text: "Empareja cada palabra danesa con su traducción al español:",
          pairs: [
            { left: "stor", right: "grande" },
            { left: "lille", right: "pequeño" },
            { left: "god", right: "bueno" },
            { left: "dårlig", right: "malo" },
            { left: "ny", right: "nuevo" },
          ],
        },
      ],
    },
  ]
}

// Ejercicios de nivel avanzado (B1-B2)
function getAdvancedExercises(): Exercise[] {
  return [
    {
      id: "multiple-b2-1",
      title: "Vocabulario avanzado",
      description: "Domina vocabulario danés más complejo",
      type: "multipleChoice",
      level: "B2",
      category: "vocabulary",
      questions: [
        {
          text: "¿Qué significa 'bæredygtighed' en español?",
          options: ["Sostenibilidad", "Responsabilidad", "Biodiversidad", "Ecología"],
          correctAnswer: "Sostenibilidad",
        },
        {
          text: "¿Cómo se dice 'globalización' en danés?",
          options: ["Globalisering", "Verdensomspændende", "Internationalisering", "Verdensudvikling"],
          correctAnswer: "Globalisering",
        },
        {
          text: "¿Qué significa 'retfærdighed' en español?",
          options: ["Rectitud", "Justicia", "Honestidad", "Legalidad"],
          correctAnswer: "Justicia",
        },
        {
          text: "¿Cómo se dice 'democracia' en danés?",
          options: ["Folkestyre", "Demokrati", "Folkevalg", "Valgfrihed"],
          correctAnswer: "Demokrati",
        },
        {
          text: "¿Qué significa 'ligestilling' en español?",
          options: ["Libertad", "Igualdad", "Equidad de género", "Paridad"],
          correctAnswer: "Igualdad",
        },
      ],
    },
    {
      id: "translation-b2-1",
      title: "Traducción avanzada",
      description: "Traduce frases complejas del español al danés",
      type: "translation",
      level: "B2",
      category: "translation",
      questions: [
        {
          text: "Traduce al danés:",
          sourceText: "La sostenibilidad es uno de los mayores desafíos de nuestro tiempo",
          targetLanguage: "da",
          correctTranslation: "Bæredygtighed er en af de største udfordringer i vores tid",
        },
        {
          text: "Traduce al danés:",
          sourceText: "Me encantaría discutir las diferencias culturales entre nuestros países",
          targetLanguage: "da",
          correctTranslation: "Jeg ville elske at diskutere de kulturelle forskelle mellem vores lande",
        },
        {
          text: "Traduce al danés:",
          sourceText: "La igualdad de género es fundamental para una sociedad justa",
          targetLanguage: "da",
          correctTranslation: "Ligestilling mellem kønnene er grundlæggende for et retfærdigt samfund",
        },
        {
          text: "Traduce al danés:",
          sourceText: "¿Cuáles son los principales desafíos políticos en Dinamarca actualmente?",
          targetLanguage: "da",
          correctTranslation: "Hvad er de vigtigste politiske udfordringer i Danmark i øjeblikket?",
        },
        {
          text: "Traduce al danés:",
          sourceText: "El cambio climático requiere soluciones globales",
          targetLanguage: "da",
          correctTranslation: "Klimaforandringer kræver globale løsninger",
        },
      ],
    },
    {
      id: "fillblank-b2-1",
      title: "Gramática avanzada",
      description: "Completa frases con estructuras gramaticales complejas",
      type: "fillBlank",
      level: "B2",
      category: "grammar",
      questions: [
        {
          text: "Completa la frase con la forma correcta del verbo:",
          sentence: "Hvis jeg ___ tid, ville jeg rejse mere",
          options: ["har", "havde", "have", "haft"],
          correctAnswer: "havde",
        },
        {
          text: "Completa la frase con la preposición correcta:",
          sentence: "Hun er interesseret ___ politik",
          options: ["i", "på", "med", "om"],
          correctAnswer: "i",
        },
        {
          text: "Completa la frase con el pronombre correcto:",
          sentence: "Bogen, ___ jeg læste i går, var spændende",
          options: ["som", "der", "hvad", "hvis"],
          correctAnswer: "som",
        },
        {
          text: "Completa la frase con la forma correcta del adjetivo:",
          sentence: "Det er den ___ bog, jeg nogensinde har læst",
          options: ["god", "bedre", "bedste", "godt"],
          correctAnswer: "bedste",
        },
        {
          text: "Completa la frase con la conjunción correcta:",
          sentence: "Jeg tager en paraply med, ___ det begynder at regne",
          options: ["hvis", "når", "fordi", "selvom"],
          correctAnswer: "hvis",
        },
      ],
    },
  ]
}

// Generar ejercicios dinámicamente basados en el diccionario
export function generateExercises(): Exercise[] {
  const exercises: Exercise[] = []

  try {
    // Obtener palabras y frases del diccionario
    const danishWords = getAllDanishWords()
    const spanishToDanishPhrases = getAllSpanishToDanishPhrases()

    // Generar ejercicio de opción múltiple con palabras aleatorias
    if (danishWords.length >= 20) {
      const randomWords = shuffleArray(danishWords).slice(0, 10)

      const multipleChoiceExercise: Exercise = {
        id: `generated-multiple-${Date.now()}`,
        title: "Vocabulario generado",
        description: "Ejercicio generado automáticamente",
        type: "multipleChoice",
        level: "A1",
        category: "vocabulary",
        questions: randomWords.map((word) => {
          // Crear opciones incorrectas
          const incorrectOptions = shuffleArray(
            danishWords.filter((w) => w.word !== word.word).map((w) => w.translation),
          ).slice(0, 3)

          return {
            text: `¿Qué significa '${word.word}' en español?`,
            options: shuffleArray([...incorrectOptions, word.translation]),
            correctAnswer: word.translation,
          }
        }),
      }

      exercises.push(multipleChoiceExercise)
    }

    // Generar ejercicio de traducción español-danés
    const phrasePairs = Object.entries(spanishToDanishPhrases).slice(0, 10)
    if (phrasePairs.length >= 5) {
      const translationExercise: Exercise = {
        id: `generated-translation-${Date.now()}`,
        title: "Traducción español-danés",
        description: "Traduce frases del español al danés",
        type: "translation",
        level: "A2",
        category: "translation",
        questions: phrasePairs.map(([spanish, danish]) => ({
          text: "Traduce al danés:",
          sourceText: spanish,
          targetLanguage: "da",
          correctTranslation: danish,
        })),
      }

      exercises.push(translationExercise)
    }
  } catch (error) {
    console.error("[Exercises] Error al generar ejercicios dinámicos:", error)
  }

  return exercises
}

// Obtener un ejercicio por ID
export async function getExerciseById(id: string): Promise<Exercise | null> {
  const exercises = await getExercises()
  return exercises.find((exercise) => exercise.id === id) || null
}

// Obtener ejercicios por nivel
export async function getExercisesByLevel(level: string): Promise<Exercise[]> {
  const exercises = await getExercises()
  return exercises.filter((exercise) => exercise.level === level)
}

// Obtener ejercicios por tipo
export async function getExercisesByType(type: string): Promise<Exercise[]> {
  const exercises = await getExercises()
  return exercises.filter((exercise) => exercise.type === type)
}

// Obtener ejercicios recomendados basados en el progreso del usuario
export async function getRecommendedExercises(userId: string): Promise<Exercise[]> {
  // Obtener progreso del usuario
  const progress = await getUserExerciseProgress(userId)
  const completedIds = progress.map((p) => p.id)

  // Obtener todos los ejercicios
  const allExercises = await getExercises()

  // Filtrar ejercicios no completados
  const notCompletedExercises = allExercises.filter((ex) => !completedIds.includes(ex.id))

  // Si hay ejercicios no completados, devolver los primeros 3
  if (notCompletedExercises.length > 0) {
    return notCompletedExercises.slice(0, 3)
  }

  // Si todos están completados, devolver los 3 con peor puntuación
  const exercisesWithProgress = allExercises.map((ex) => {
    const exProgress = progress.find((p) => p.id === ex.id)
    return {
      ...ex,
      score: exProgress ? exProgress.score / exProgress.total : 1,
    }
  })

  return exercisesWithProgress.sort((a, b) => a.score - b.score).slice(0, 3)
}

// Guardar progreso de ejercicio
export async function saveExerciseProgress(
  userId: string,
  exerciseId: string,
  score: number,
  total: number,
): Promise<void> {
  try {
    // Get current progress
    const progress = await getUserExerciseProgress(userId)

    // Check if progress already exists for this exercise
    const existingIndex = progress.findIndex((p) => p.id === exerciseId)
    const now = new Date().toISOString()

    if (existingIndex >= 0) {
      // Update existing progress
      progress[existingIndex] = {
        ...progress[existingIndex],
        score: Math.max(progress[existingIndex].score, score), // Save best score
        completed: score >= total * 0.7, // Completed if at least 70% correct
        lastAttempt: now,
        attempts: progress[existingIndex].attempts + 1,
      }
    } else {
      // Create new progress
      progress.push({
        id: exerciseId,
        score,
        total,
        completed: score >= total * 0.7,
        lastAttempt: now,
        attempts: 1,
      })
    }

    // Save updated progress
    await saveToCache(`exercise-progress-${userId}`, progress)
  } catch (error) {
    console.error("[Exercises] Error saving progress:", error)
  }
}

// Get user's exercise progress
export async function getUserExerciseProgress(userId: string): Promise<ExerciseProgress[]> {
  try {
    const progress = await getFromCache<ExerciseProgress[]>(`exercise-progress-${userId}`)
    return progress || []
  } catch (error) {
    console.error("[Exercises] Error getting progress:", error)
    return []
  }
}

// Helper function to shuffle an array
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array]
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
  }
  return newArray
}
