import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    const level = searchParams.get("level")
    const type = searchParams.get("type")

    // Log para depuración
    console.log("API de ejercicios llamada con:", { id, level, type })

    // Si se solicita un ejercicio específico por ID
    if (id) {
      const exercise = allExercises.find((ex) => ex.id === id)
      if (exercise) {
        return NextResponse.json(exercise)
      } else {
        console.error(`Ejercicio con ID ${id} no encontrado`)
        return NextResponse.json({ error: `Ejercicio con ID ${id} no encontrado` }, { status: 404 })
      }
    }

    // Filtrar por nivel si se proporciona
    let filteredExercises = allExercises
    if (level) {
      filteredExercises = filteredExercises.filter((ex) => ex.level === level)
    }

    // Filtrar por tipo si se proporciona
    if (type) {
      filteredExercises = filteredExercises.filter((ex) => ex.type === type)
    }

    return NextResponse.json(filteredExercises)
  } catch (error: any) {
    console.error("Error en API de ejercicios:", error)
    return NextResponse.json({ error: `Error en el servidor: ${error.message}` }, { status: 500 })
  }
}

// Base de datos de ejercicios
const allExercises = [
  {
    id: "multiple-a1-1",
    title: "Vocabulario básico",
    description: "Practica palabras esenciales en danés",
    type: "multipleChoice",
    level: "A1",
    category: "vocabulary",
    questions: [
      {
        id: "q1",
        text: "¿Cómo se dice 'hola' en danés?",
        options: ["Hej", "Farvel", "Tak", "Godmorgen"],
        correctAnswer: "Hej",
      },
      {
        id: "q2",
        text: "¿Qué significa 'tak' en español?",
        options: ["Hola", "Adiós", "Gracias", "Por favor"],
        correctAnswer: "Gracias",
      },
      {
        id: "q3",
        text: "¿Cómo se dice 'buenos días' en danés?",
        options: ["God morgen", "God aften", "God nat", "God dag"],
        correctAnswer: "God morgen",
      },
      {
        id: "q4",
        text: "¿Qué significa 'ja' en español?",
        options: ["No", "Sí", "Tal vez", "Gracias"],
        correctAnswer: "Sí",
      },
      {
        id: "q5",
        text: "¿Cómo se dice 'adiós' en danés?",
        options: ["Hej", "Farvel", "Tak", "Undskyld"],
        correctAnswer: "Farvel",
      },
    ],
  },
  {
    id: "basic-greetings",
    title: "Saludos básicos",
    description: "Aprende a saludar en danés",
    type: "multipleChoice",
    level: "A1",
    questions: [
      {
        id: "q1",
        text: "¿Cómo se dice 'hola' en danés?",
        options: ["Hej", "Farvel", "Tak", "Undskyld"],
        correctAnswer: "Hej",
        audio: "/audio/hej.mp3",
        feedback: "¡Correcto! 'Hej' es la forma más común de decir hola en danés.",
        example: "Hej, hvordan går det? (Hola, ¿cómo estás?)",
      },
      {
        id: "q2",
        text: "¿Cómo se dice 'buenos días' en danés?",
        options: ["God morgen", "God aften", "God nat", "Hej hej"],
        correctAnswer: "God morgen",
        audio: "/audio/god-morgen.mp3",
        feedback: "¡Correcto! 'God morgen' significa buenos días en danés.",
        example: "God morgen! Har du sovet godt? (¡Buenos días! ¿Has dormido bien?)",
      },
      {
        id: "q3",
        text: "¿Cómo se dice 'adiós' en danés?",
        options: ["Farvel", "Hej", "Tak", "Ja"],
        correctAnswer: "Farvel",
        audio: "/audio/farvel.mp3",
        feedback: "¡Correcto! 'Farvel' es una forma formal de decir adiós.",
        example: "Farvel og tak for i dag. (Adiós y gracias por hoy.)",
      },
      {
        id: "q4",
        text: "¿Cómo se dice 'gracias' en danés?",
        options: ["Tak", "Undskyld", "Ja", "Nej"],
        correctAnswer: "Tak",
        audio: "/audio/tak.mp3",
        feedback: "¡Correcto! 'Tak' significa gracias en danés.",
        example: "Mange tak for hjælpen. (Muchas gracias por la ayuda.)",
      },
      {
        id: "q5",
        text: "¿Cómo se dice 'por favor' en danés?",
        options: ["Vær så venlig", "Undskyld", "Tak", "Ja tak"],
        correctAnswer: "Vær så venlig",
        audio: "/audio/vaer-saa-venlig.mp3",
        feedback: "¡Correcto! 'Vær så venlig' significa por favor en danés.",
        example: "Vær så venlig at lukke døren. (Por favor, cierra la puerta.)",
      },
    ],
    culturalNote:
      "En Dinamarca, la gente suele ser bastante informal en sus saludos. 'Hej' es muy común y se usa tanto para saludar como para despedirse informalmente.",
  },
  {
    id: "basic-numbers",
    title: "Números del 1 al 10",
    description: "Aprende los números básicos en danés",
    type: "multipleChoice",
    level: "A1",
    questions: [
      {
        id: "q1",
        text: "¿Cómo se dice '1' en danés?",
        options: ["En", "To", "Tre", "Fire"],
        correctAnswer: "En",
        audio: "/audio/en.mp3",
        feedback: "¡Correcto! 'En' es el número uno en danés.",
        example: "Jeg har en hund. (Tengo un perro.)",
      },
      {
        id: "q2",
        text: "¿Cómo se dice '2' en danés?",
        options: ["To", "Tre", "Fire", "Fem"],
        correctAnswer: "To",
        audio: "/audio/to.mp3",
        feedback: "¡Correcto! 'To' es el número dos en danés.",
        example: "Jeg har to katte. (Tengo dos gatos.)",
      },
      {
        id: "q3",
        text: "¿Cómo se dice '3' en danés?",
        options: ["Tre", "Fire", "Fem", "Seks"],
        correctAnswer: "Tre",
        audio: "/audio/tre.mp3",
        feedback: "¡Correcto! 'Tre' es el número tres en danés.",
        example: "Der er tre æbler. (Hay tres manzanas.)",
      },
      {
        id: "q4",
        text: "¿Cómo se dice '5' en danés?",
        options: ["Fem", "Fire", "Seks", "Syv"],
        correctAnswer: "Fem",
        audio: "/audio/fem.mp3",
        feedback: "¡Correcto! 'Fem' es el número cinco en danés.",
        example: "Jeg har fem fingre på hver hånd. (Tengo cinco dedos en cada mano.)",
      },
      {
        id: "q5",
        text: "¿Cómo se dice '10' en danés?",
        options: ["Ti", "Ni", "Otte", "Elleve"],
        correctAnswer: "Ti",
        audio: "/audio/ti.mp3",
        feedback: "¡Correcto! 'Ti' es el número diez en danés.",
        example: "Der er ti personer i rummet. (Hay diez personas en la habitación.)",
      },
    ],
    culturalNote:
      "El sistema numérico danés es bastante regular hasta el 20, pero después se vuelve más complejo. Por ejemplo, 50 se dice 'halvtreds', que literalmente significa 'dos y medio veces veinte'.",
  },
  {
    id: "basic-phrases",
    title: "Frases cotidianas",
    description: "Aprende frases útiles para el día a día",
    type: "orderWords",
    level: "A1",
    questions: [
      {
        id: "q1",
        text: "Ordena las palabras para formar: 'Me llamo Juan'",
        words: ["hedder", "Juan", "Jeg"],
        correctSentence: "Jeg hedder Juan",
        audio: "/audio/jeg-hedder.mp3",
        feedback: "¡Correcto! 'Jeg hedder Juan' significa 'Me llamo Juan'.",
        example: "Hej, jeg hedder Maria. Hvad hedder du? (Hola, me llamo María. ¿Cómo te llamas?)",
      },
      {
        id: "q2",
        text: "Ordena las palabras para formar: '¿Cómo estás?'",
        words: ["går", "det", "Hvordan"],
        correctSentence: "Hvordan går det",
        audio: "/audio/hvordan-gaar-det.mp3",
        feedback: "¡Correcto! 'Hvordan går det' significa '¿Cómo estás?'.",
        example: "Hej! Hvordan går det? Det går godt, tak. (¡Hola! ¿Cómo estás? Estoy bien, gracias.)",
      },
      {
        id: "q3",
        text: "Ordena las palabras para formar: 'Estoy bien, gracias'",
        words: ["godt", "tak", "Det", "går"],
        correctSentence: "Det går godt tak",
        audio: "/audio/det-gaar-godt-tak.mp3",
        feedback: "¡Correcto! 'Det går godt tak' significa 'Estoy bien, gracias'.",
        example: "Hvordan går det? Det går godt tak. (¿Cómo estás? Estoy bien, gracias.)",
      },
      {
        id: "q4",
        text: "Ordena las palabras para formar: '¿De dónde eres?'",
        words: ["kommer", "fra", "du", "Hvor"],
        correctSentence: "Hvor kommer du fra",
        audio: "/audio/hvor-kommer-du-fra.mp3",
        feedback: "¡Correcto! 'Hvor kommer du fra' significa '¿De dónde eres?'.",
        example: "Hvor kommer du fra? Jeg kommer fra Spanien. (¿De dónde eres? Soy de España.)",
      },
      {
        id: "q5",
        text: "Ordena las palabras para formar: 'No hablo danés'",
        words: ["ikke", "dansk", "taler", "Jeg"],
        correctSentence: "Jeg taler ikke dansk",
        audio: "/audio/jeg-taler-ikke-dansk.mp3",
        feedback: "¡Correcto! 'Jeg taler ikke dansk' significa 'No hablo danés'.",
        example: "Undskyld, jeg taler ikke dansk. Taler du engelsk? (Perdón, no hablo danés. ¿Hablas inglés?)",
      },
    ],
    culturalNote:
      "Los daneses aprecian mucho cuando los extranjeros intentan hablar su idioma, aunque sea con frases básicas. Incluso un simple 'hej' o 'tak' puede generar sonrisas.",
  },
  {
    id: "food-vocabulary",
    title: "Vocabulario de comida",
    description: "Aprende palabras relacionadas con la comida",
    type: "multipleChoice",
    level: "A1",
    questions: [
      {
        id: "q1",
        text: "¿Cómo se dice 'pan' en danés?",
        options: ["Brød", "Kage", "Ost", "Mælk"],
        correctAnswer: "Brød",
        audio: "/audio/broed.mp3",
        feedback: "¡Correcto! 'Brød' significa 'pan' en danés.",
        example: "Jeg kan godt lide frisk brød. (Me gusta el pan fresco.)",
      },
      {
        id: "q2",
        text: "¿Cómo se dice 'agua' en danés?",
        options: ["Vand", "Øl", "Kaffe", "Te"],
        correctAnswer: "Vand",
        audio: "/audio/vand.mp3",
        feedback: "¡Correcto! 'Vand' significa 'agua' en danés.",
        example: "Må jeg bede om et glas vand? (¿Puedo pedir un vaso de agua?)",
      },
      {
        id: "q3",
        text: "¿Cómo se dice 'carne' en danés?",
        options: ["Kød", "Fisk", "Grøntsager", "Frugt"],
        correctAnswer: "Kød",
        audio: "/audio/koed.mp3",
        feedback: "¡Correcto! 'Kød' significa 'carne' en danés.",
        example: "Jeg spiser ikke kød. (No como carne.)",
      },
      {
        id: "q4",
        text: "¿Cómo se dice 'queso' en danés?",
        options: ["Ost", "Smør", "Æg", "Mælk"],
        correctAnswer: "Ost",
        audio: "/audio/ost.mp3",
        feedback: "¡Correcto! 'Ost' significa 'queso' en danés.",
        example: "Dansk ost er meget god. (El queso danés es muy bueno.)",
      },
      {
        id: "q5",
        text: "¿Cómo se dice 'café' en danés?",
        options: ["Kaffe", "Te", "Øl", "Vin"],
        correctAnswer: "Kaffe",
        audio: "/audio/kaffe.mp3",
        feedback: "¡Correcto! 'Kaffe' significa 'café' en danés.",
        example: "Danskerne drikker meget kaffe. (Los daneses beben mucho café.)",
      },
    ],
    culturalNote:
      "La cocina danesa tradicional incluye muchos platos con carne de cerdo, pescado y patatas. El 'smørrebrød' (pan con mantequilla cubierto de diferentes ingredientes) es un almuerzo típico danés.",
  },
  {
    id: "daily-activities",
    title: "Actividades diarias",
    description: "Aprende a hablar sobre tu rutina diaria",
    type: "fillBlank",
    level: "A2",
    questions: [
      {
        id: "q1",
        text: "Completa la frase: 'Me levanto a las 7'",
        sentence: "Jeg ___ op klokken 7",
        options: ["står", "går", "sover", "spiser"],
        correctAnswer: "står",
        audio: "/audio/jeg-staar-op.mp3",
        feedback: "¡Correcto! 'Jeg står op klokken 7' significa 'Me levanto a las 7'.",
        example: "Jeg står op klokken 7 hver morgen. (Me levanto a las 7 cada mañana.)",
      },
      {
        id: "q2",
        text: "Completa la frase: 'Desayuno a las 8'",
        sentence: "Jeg ___ morgenmad klokken 8",
        options: ["spiser", "drikker", "laver", "køber"],
        correctAnswer: "spiser",
        audio: "/audio/jeg-spiser-morgenmad.mp3",
        feedback: "¡Correcto! 'Jeg spiser morgenmad klokken 8' significa 'Desayuno a las 8'.",
        example: "Jeg spiser altid morgenmad før arbejde. (Siempre desayuno antes del trabajo.)",
      },
      {
        id: "q3",
        text: "Completa la frase: 'Voy al trabajo'",
        sentence: "Jeg ___ på arbejde",
        options: ["går", "kommer", "tager", "laver"],
        correctAnswer: "går",
        audio: "/audio/jeg-gaar-paa-arbejde.mp3",
        feedback: "¡Correcto! 'Jeg går på arbejde' significa 'Voy al trabajo'.",
        example: "Jeg går på arbejde hver dag. (Voy al trabajo todos los días.)",
      },
      {
        id: "q4",
        text: "Completa la frase: 'Ceno a las 6'",
        sentence: "Jeg ___ aftensmad klokken 6",
        options: ["spiser", "laver", "køber", "har"],
        correctAnswer: "spiser",
        audio: "/audio/jeg-spiser-aftensmad.mp3",
        feedback: "¡Correcto! 'Jeg spiser aftensmad klokken 6' significa 'Ceno a las 6'.",
        example: "Vi spiser aftensmad sammen hver aften. (Cenamos juntos cada noche.)",
      },
      {
        id: "q5",
        text: "Completa la frase: 'Me voy a dormir'",
        sentence: "Jeg ___ i seng",
        options: ["går", "kommer", "sover", "ligger"],
        correctAnswer: "går",
        audio: "/audio/jeg-gaar-i-seng.mp3",
        feedback: "¡Correcto! 'Jeg går i seng' significa 'Me voy a dormir'.",
        example: "Jeg går i seng klokken 23. (Me voy a dormir a las 11.)",
      },
    ],
    culturalNote:
      "Los daneses valoran mucho el equilibrio entre la vida laboral y personal. La jornada laboral típica termina alrededor de las 4 o 5 de la tarde, lo que permite pasar más tiempo con la familia.",
  },
  {
    id: "weather-expressions",
    title: "Expresiones sobre el clima",
    description: "Aprende a hablar sobre el tiempo",
    type: "translation",
    level: "A2",
    questions: [
      {
        id: "q1",
        text: "Traduce al danés: 'Hace sol'",
        sourceText: "Hace sol",
        targetLanguage: "da",
        correctTranslation: "Det er solskin",
        audio: "/audio/det-er-solskin.mp3",
        feedback: "¡Correcto! 'Det er solskin' significa 'Hace sol'.",
        example: "Det er solskin i dag. Lad os gå ud! (Hace sol hoy. ¡Salgamos!)",
      },
      {
        id: "q2",
        text: "Traduce al danés: 'Está lloviendo'",
        sourceText: "Está lloviendo",
        targetLanguage: "da",
        correctTranslation: "Det regner",
        audio: "/audio/det-regner.mp3",
        feedback: "¡Correcto! 'Det regner' significa 'Está lloviendo'.",
        example: "Tag en paraply med, det regner udenfor. (Lleva un paraguas, está lloviendo afuera.)",
      },
      {
        id: "q3",
        text: "Traduce al danés: 'Hace frío'",
        sourceText: "Hace frío",
        targetLanguage: "da",
        correctTranslation: "Det er koldt",
        audio: "/audio/det-er-koldt.mp3",
        feedback: "¡Correcto! 'Det er koldt' significa 'Hace frío'.",
        example: "Tag en jakke på, det er koldt udenfor. (Ponte una chaqueta, hace frío afuera.)",
      },
      {
        id: "q4",
        text: "Traduce al danés: 'Está nevando'",
        sourceText: "Está nevando",
        targetLanguage: "da",
        correctTranslation: "Det sner",
        audio: "/audio/det-sner.mp3",
        feedback: "¡Correcto! 'Det sner' significa 'Está nevando'.",
        example: "Børnene er glade fordi det sner. (Los niños están felices porque está nevando.)",
      },
      {
        id: "q5",
        text: "Traduce al danés: 'Hace viento'",
        sourceText: "Hace viento",
        targetLanguage: "da",
        correctTranslation: "Det blæser",
        audio: "/audio/det-blaeser.mp3",
        feedback: "¡Correcto! 'Det blæser' significa 'Hace viento'.",
        example: "Det blæser meget i dag. (Hace mucho viento hoy.)",
      },
    ],
    culturalNote:
      "El clima es un tema de conversación muy común en Dinamarca, ya que puede cambiar rápidamente. Los daneses tienen un dicho: 'No hay mal tiempo, solo ropa inadecuada'.",
  },
]
