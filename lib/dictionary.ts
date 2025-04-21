// Servicio de diccionario y traducción con APIs compatibles y manejo de errores

import { fetchWithCache, isOnline, saveToCache, getFromCache } from "./api-utils"

// Interfaces para las respuestas de API
interface DictionaryApiResponse {
  word: string
  phonetic?: string
  phonetics: Array<{
    text?: string
    audio?: string
  }>
  meanings: Array<{
    partOfSpeech: string
    definitions: Array<{
      definition: string
      example?: string
    }>
  }>
}

interface MyMemoryTranslationResponse {
  responseData: {
    translatedText: string
    match?: number
  }
  responseStatus: number
  responseDetails?: string
}

interface WordReference {
  word: string
  phonetic: string
  translation: string
  examples?: Array<{
    danish: string
    spanish: string
  }>
}

// Base de datos local de palabras danesas para uso offline y fallback
const danishWords: WordReference[] = [
  {
    word: "hej",
    phonetic: "/haj/",
    translation: "hola",
    examples: [
      { danish: "Hej, hvordan går det?", spanish: "Hola, ¿cómo estás?" },
      { danish: "Hej med dig!", spanish: "¡Hola a ti!" },
    ],
  },
  {
    word: "tak",
    phonetic: "/tak/",
    translation: "gracias",
    examples: [
      { danish: "Mange tak for hjælpen", spanish: "Muchas gracias por la ayuda" },
      { danish: "Tak for i dag", spanish: "Gracias por hoy" },
    ],
  },
  {
    word: "ja",
    phonetic: "/ja/",
    translation: "sí",
    examples: [
      { danish: "Ja, det er rigtigt", spanish: "Sí, es correcto" },
      { danish: "Ja, selvfølgelig", spanish: "Sí, por supuesto" },
    ],
  },
  {
    word: "nej",
    phonetic: "/naj/",
    translation: "no",
    examples: [
      { danish: "Nej, det tror jeg ikke", spanish: "No, no lo creo" },
      { danish: "Nej tak", spanish: "No, gracias" },
    ],
  },
  { word: "god", phonetic: "/goð/", translation: "bueno" },
  { word: "dag", phonetic: "/daj/", translation: "día" },
  { word: "morgen", phonetic: "/mɔːn/", translation: "mañana" },
  { word: "aften", phonetic: "/aftən/", translation: "tarde/noche" },
  { word: "mad", phonetic: "/mað/", translation: "comida" },
  { word: "vand", phonetic: "/van/", translation: "agua" },
  { word: "hus", phonetic: "/huːs/", translation: "casa" },
  { word: "bil", phonetic: "/biːl/", translation: "coche" },
  { word: "rød", phonetic: "/røð/", translation: "rojo" },
  { word: "blå", phonetic: "/blɔː/", translation: "azul" },
  { word: "grøn", phonetic: "/grøn/", translation: "verde" },
  { word: "gul", phonetic: "/gul/", translation: "amarillo" },
  { word: "sort", phonetic: "/soɐ̯t/", translation: "negro" },
  { word: "hvid", phonetic: "/viːð/", translation: "blanco" },
  { word: "stor", phonetic: "/sdoɐ̯/", translation: "grande" },
  { word: "lille", phonetic: "/lilə/", translation: "pequeño" },
  { word: "god", phonetic: "/goːð/", translation: "bueno" },
  { word: "dårlig", phonetic: "/dɔːli/", translation: "malo" },
  { word: "ny", phonetic: "/nyː/", translation: "nuevo" },
  { word: "gammel", phonetic: "/gaml/", translation: "viejo" },
  { word: "mand", phonetic: "/man/", translation: "hombre" },
  { word: "kvinde", phonetic: "/kvenə/", translation: "mujer" },
  { word: "barn", phonetic: "/bɑːn/", translation: "niño" },
  { word: "familie", phonetic: "/familjə/", translation: "familia" },
  { word: "ven", phonetic: "/veːn/", translation: "amigo" },
  { word: "kærlighed", phonetic: "/kɛɐ̯liheð/", translation: "amor" },
  { word: "tid", phonetic: "/tiːð/", translation: "tiempo" },
  { word: "år", phonetic: "/ɔːɐ̯/", translation: "año" },
  { word: "måned", phonetic: "/mɔːnəð/", translation: "mes" },
  { word: "uge", phonetic: "/uːə/", translation: "semana" },
  { word: "dag", phonetic: "/dæː/", translation: "día" },
  { word: "nat", phonetic: "/nat/", translation: "noche" },
  { word: "i dag", phonetic: "/i dæː/", translation: "hoy" },
  { word: "i morgen", phonetic: "/i mɔːn/", translation: "mañana" },
  { word: "i går", phonetic: "/i gɔːɐ̯/", translation: "ayer" },
  { word: "nu", phonetic: "/nu/", translation: "ahora" },
  { word: "senere", phonetic: "/seːnəɐ̯ə/", translation: "más tarde" },
  { word: "før", phonetic: "/føɐ̯/", translation: "antes" },
  { word: "efter", phonetic: "/ɛftɐ/", translation: "después" },
  { word: "mad", phonetic: "/mað/", translation: "comida" },
  { word: "drikke", phonetic: "/dregə/", translation: "bebida" },
  { word: "vand", phonetic: "/van/", translation: "agua" },
  { word: "brød", phonetic: "/brøð/", translation: "pan" },
  { word: "ost", phonetic: "/ɔsd/", translation: "queso" },
  { word: "kød", phonetic: "/køð/", translation: "carne" },
  { word: "fisk", phonetic: "/fesg/", translation: "pescado" },
  { word: "frugt", phonetic: "/frɔgt/", translation: "fruta" },
  { word: "grøntsag", phonetic: "/grønsaːg/", translation: "verdura" },
  { word: "kaffe", phonetic: "/kafə/", translation: "café" },
  { word: "te", phonetic: "/teː/", translation: "té" },
  { word: "øl", phonetic: "/øl/", translation: "cerveza" },
  { word: "vin", phonetic: "/viːn/", translation: "vino" },
]

// Base de datos local de frases para traducción español-danés
const spanishToDanishPhrases: Record<string, string> = {
  hola: "hej",
  "buenos días": "god morgen",
  "buenas tardes": "god eftermiddag",
  "buenas noches": "god aften",
  adiós: "farvel",
  gracias: "tak",
  "por favor": "vær så venlig",
  "de nada": "det var så lidt",
  sí: "ja",
  no: "nej",
  disculpa: "undskyld",
  "lo siento": "jeg beklager",
  "¿cómo estás?": "hvordan går det?",
  "estoy bien": "jeg har det godt",
  "¿cómo te llamas?": "hvad hedder du?",
  "me llamo": "jeg hedder",
  "encantado de conocerte": "dejligt at møde dig",
  "¿hablas español?": "taler du spansk?",
  "no hablo danés": "jeg taler ikke dansk",
  "hablo un poco de danés": "jeg taler lidt dansk",
  "¿dónde está el baño?": "hvor er toilettet?",
  "¿cuánto cuesta?": "hvor meget koster det?",
  "¿qué hora es?": "hvad er klokken?",
  "tengo hambre": "jeg er sulten",
  "tengo sed": "jeg er tørstig",
  "me gusta": "jeg kan lide",
  "no me gusta": "jeg kan ikke lide",
  ayuda: "hjælp",
  "necesito ayuda": "jeg har brug for hjælp",
  "estoy perdido": "jeg er faret vild",
  "¿dónde está la estación?": "hvor er stationen?",
  "¿puedes hablar más despacio?": "kan du tale langsommere?",
  "no entiendo": "jeg forstår ikke",
  entiendo: "jeg forstår",
  "¿puedes repetir?": "kan du gentage?",
  "¿cómo se dice en danés?": "hvordan siger man på dansk?",
  "¿qué significa?": "hvad betyder det?",
  "feliz cumpleaños": "tillykke med fødselsdagen",
  felicidades: "tillykke",
  salud: "skål",
  "buen provecho": "velbekomme",
  "buen viaje": "god rejse",
  "buena suerte": "held og lykke",
  "te quiero": "jeg elsker dig",
  "te extraño": "jeg savner dig",
  "estoy cansado": "jeg er træt",
  "estoy ocupado": "jeg er optaget",
  "estoy libre": "jeg er ledig",
  "¿estás libre?": "er du ledig?",
  "¿quieres?": "vil du?",
  quiero: "jeg vil",
  "no quiero": "jeg vil ikke",
  "¿puedo?": "må jeg?",
  puedes: "du kan",
  "no puedes": "du kan ikke",
  debo: "jeg skal",
  "no debo": "jeg skal ikke",
  "¿dónde vives?": "hvor bor du?",
  "vivo en": "jeg bor i",
  "¿de dónde eres?": "hvor kommer du fra?",
  "soy de": "jeg kommer fra",
  "¿a qué te dedicas?": "hvad laver du?",
  "trabajo como": "jeg arbejder som",
  estudio: "jeg studerer",
  "¿cuántos años tienes?": "hvor gammel er du?",
  "tengo años": "jeg er år",
  "¿cuándo es tu cumpleaños?": "hvornår har du fødselsdag?",
  "mi cumpleaños es": "min fødselsdag er",
  "¿tienes hermanos?": "har du søskende?",
  "tengo un hermano": "jeg har en bror",
  "tengo una hermana": "jeg har en søster",
  "estoy casado": "jeg er gift",
  "estoy soltero": "jeg er single",
  "tengo hijos": "jeg har børn",
  "no tengo hijos": "jeg har ikke børn",
  "me gusta la música": "jeg kan lide musik",
  "me gusta leer": "jeg kan lide at læse",
  "me gusta viajar": "jeg kan lide at rejse",
  "me gusta cocinar": "jeg kan lide at lave mad",
  "me gusta bailar": "jeg kan lide at danse",
  "me gusta cantar": "jeg kan lide at synge",
  "me gusta nadar": "jeg kan lide at svømme",
  "me gusta correr": "jeg kan lide at løbe",
  "me gusta caminar": "jeg kan lide at gå",
  "me gusta dormir": "jeg kan lide at sove",
  "me gusta comer": "jeg kan lide at spise",
  "me gusta beber": "jeg kan lide at drikke",
  "me gusta hablar": "jeg kan lide at tale",
  "me gusta escuchar": "jeg kan lide at lytte",
  "me gusta ver": "jeg kan lide at se",
  "me gusta jugar": "jeg kan lide at spille",
  "me gusta trabajar": "jeg kan lide at arbejde",
  "me gusta estudiar": "jeg kan lide at studere",
  "me gusta aprender": "jeg kan lide at lære",
  "me gusta enseñar": "jeg kan lide at undervise",
}

// Clave para almacenar la palabra del día en caché
const WORD_OF_DAY_CACHE_KEY = "danish-word-of-day"

/**
 * Obtiene una palabra aleatoria en danés
 */
export async function getRandomWord() {
  try {
    // Intentar obtener la palabra del día de la caché
    const cachedWord = await getFromCache<WordReference>(WORD_OF_DAY_CACHE_KEY)

    // Si hay una palabra en caché y es del día actual, usarla
    if (cachedWord) {
      const today = new Date().toISOString().split("T")[0]
      const cachedDate = await getFromCache<string>(`${WORD_OF_DAY_CACHE_KEY}-date`)

      if (cachedDate === today) {
        console.log("[Dictionary] Usando palabra del día desde caché")
        return cachedWord
      }
    }

    // Seleccionar una palabra aleatoria de nuestra lista local
    const randomIndex = Math.floor(Math.random() * danishWords.length)
    const randomWord = danishWords[randomIndex]

    // Guardar la palabra del día en caché con la fecha actual
    const today = new Date().toISOString().split("T")[0]
    await saveToCache(WORD_OF_DAY_CACHE_KEY, randomWord)
    await saveToCache(`${WORD_OF_DAY_CACHE_KEY}-date`, today)

    return randomWord
  } catch (error) {
    console.error("[Dictionary] Error general en getRandomWord:", error)
    // Devolver una palabra predeterminada en caso de error
    return danishWords[0]
  }
}

/**
 * Traduce una palabra o frase
 * @param text Texto a traducir
 * @param from Idioma de origen (código ISO)
 * @param to Idioma de destino (código ISO)
 */
export async function translateText(text: string, from: string, to: string): Promise<string> {
  // Normalizar el texto para búsqueda
  const normalizedText = text.toLowerCase().trim()

  // Si es español a danés, buscar en nuestro diccionario local primero
  if (from === "es" && to === "da" && spanishToDanishPhrases[normalizedText]) {
    return spanishToDanishPhrases[normalizedText]
  }

  // Si es danés a español, buscar en nuestro diccionario local primero
  if (from === "da" && to === "es") {
    const wordObj = danishWords.find((w) => w.word.toLowerCase() === normalizedText)
    if (wordObj) {
      return wordObj.translation
    }
  }

  // Si estamos online, intentar usar la API de MyMemory
  if (isOnline()) {
    try {
      const apiUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${from}|${to}`

      const data = await fetchWithCache<MyMemoryTranslationResponse>(
        apiUrl,
        undefined,
        `translate-${text}-${from}-${to}`,
        {
          responseData: { translatedText: text },
          responseStatus: 999,
        },
      )

      if (data.responseStatus === 200 && data.responseData?.translatedText) {
        return data.responseData.translatedText
      }
    } catch (error) {
      console.error("[Dictionary] Error al traducir con API:", error)
    }
  }

  // Si no se pudo traducir, devolver el texto original
  return text
}

/**
 * Pronuncia un texto usando la API Web Speech
 * @param text Texto a pronunciar
 * @param lang Código de idioma (da-DK, es-ES)
 */
export function pronounceText(text: string, lang: string): boolean {
  if (typeof window === "undefined") return false

  try {
    // Verificar si la API de síntesis de voz está disponible
    if (!("speechSynthesis" in window)) {
      console.warn("[Dictionary] La API de síntesis de voz no está disponible en este navegador")
      return false
    }

    // Crear un nuevo objeto de síntesis de voz
    const utterance = new SpeechSynthesisUtterance(text)

    // Establecer el idioma
    utterance.lang = lang === "da" ? "da-DK" : "es-ES"

    // Intentar encontrar una voz adecuada
    // Nota: getVoices() puede devolver un array vacío si las voces aún no se han cargado
    const voices = window.speechSynthesis.getVoices()

    if (voices.length > 0) {
      const voice = voices.find((v) => v.lang === utterance.lang)
      if (voice) {
        utterance.voice = voice
      }
    } else {
      // Si las voces no están disponibles inmediatamente, intentar cargarlas
      window.speechSynthesis.onvoiceschanged = () => {
        const updatedVoices = window.speechSynthesis.getVoices()
        const voice = updatedVoices.find((v) => v.lang === utterance.lang)
        if (voice) {
          utterance.voice = voice
        }
      }
    }

    // Reproducir el audio
    window.speechSynthesis.speak(utterance)

    return true
  } catch (error) {
    console.error("[Dictionary] Error al pronunciar texto:", error)
    return false
  }
}

// Mantener compatibilidad con el nombre anterior de la función
export function pronounceWord(text: string, lang: string): boolean {
  return pronounceText(text, lang)
}

// Alias para mantener compatibilidad con código existente
export const translateWord = translateText

/**
 * Obtiene ejemplos de uso para una palabra
 * @param word Palabra para la que se buscan ejemplos
 * @param from Idioma de origen
 */
export async function getExamples(word: string, from = "da"): Promise<Array<{ danish: string; spanish: string }>> {
  // Buscar en nuestros ejemplos locales primero
  const wordObj = danishWords.find((w) => w.word.toLowerCase() === word.toLowerCase())
  if (wordObj && wordObj.examples && wordObj.examples.length > 0) {
    return wordObj.examples
  }

  // Si no hay ejemplos locales, crear algunos genéricos
  const examples = []

  if (from === "da") {
    // Ejemplos genéricos para palabras danesas
    examples.push({
      danish: `Jeg kan lide ${word}.`,
      spanish: `Me gusta ${await translateText(word, "da", "es")}.`,
    })

    examples.push({
      danish: `${word.charAt(0).toUpperCase() + word.slice(1)} er vigtigt.`,
      spanish: `${(await translateText(word, "da", "es")).charAt(0).toUpperCase() + (await translateText(word, "da", "es")).slice(1)} es importante.`,
    })
  } else {
    // Ejemplos genéricos para palabras españolas
    const danishWord = await translateText(word, "es", "da")

    examples.push({
      danish: `Jeg kan lide ${danishWord}.`,
      spanish: `Me gusta ${word}.`,
    })

    examples.push({
      danish: `${danishWord.charAt(0).toUpperCase() + danishWord.slice(1)} er vigtigt.`,
      spanish: `${word.charAt(0).toUpperCase() + word.slice(1)} es importante.`,
    })
  }

  return examples
}

/**
 * Busca palabras en danés que coincidan con un término
 * @param term Término de búsqueda
 */
export function searchDanishWords(term: string): WordReference[] {
  const normalizedTerm = term.toLowerCase().trim()

  // Buscar coincidencias en palabras danesas
  const danishMatches = danishWords.filter(
    (word) =>
      word.word.toLowerCase().includes(normalizedTerm) || word.translation.toLowerCase().includes(normalizedTerm),
  )

  return danishMatches.slice(0, 10) // Limitar a 10 resultados
}

/**
 * Obtiene información cultural sobre Dinamarca
 */
export async function getDanishCulture() {
  try {
    if (isOnline()) {
      const response = await fetchWithCache<any>("https://restcountries.com/v3.1/alpha/dk", undefined, "denmark-info", [
        {
          name: { common: "Denmark" },
          capital: ["Copenhagen"],
          population: 5831000,
          languages: { dan: "Danish" },
          flags: { svg: "/denmark-flag.svg" },
          area: 43094,
          region: "Europe",
        },
      ])

      if (response && response[0]) {
        return {
          name: response[0].name.common,
          capital: response[0].capital[0],
          population: response[0].population,
          languages: response[0].languages,
          flag: response[0].flags.svg,
          area: response[0].area,
          region: response[0].region,
        }
      }
    }
  } catch (error) {
    console.error("[Dictionary] Error al obtener información cultural:", error)
  }

  // Datos de respaldo
  return {
    name: "Denmark",
    capital: "Copenhagen",
    population: 5831000,
    languages: { dan: "Danish" },
    flag: "/denmark-flag.svg",
    area: 43094,
    region: "Europe",
  }
}

/**
 * Obtiene todas las palabras disponibles en el diccionario local
 */
export function getAllDanishWords(): WordReference[] {
  return [...danishWords]
}

/**
 * Obtiene todas las frases español-danés disponibles
 */
export function getAllSpanishToDanishPhrases(): Record<string, string> {
  return { ...spanishToDanishPhrases }
}
