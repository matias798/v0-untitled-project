/**
 * Service for managing Danish grammar topics
 */

// Types
interface GrammarExample {
  danish: string
  spanish: string
}

interface GrammarQuiz {
  type: "multipleChoice" | "fillBlank"
  question: string
  options?: string[]
  correctAnswer: string
}

interface GrammarSection {
  title: string
  explanation: string
  examples: GrammarExample[]
  quiz?: GrammarQuiz
}

interface GrammarTopic {
  id: string
  title: string
  description: string
  level: "A1" | "A2" | "B1" | "B2"
  sections: GrammarSection[]
}

// Grammar topics database
const grammarTopics: GrammarTopic[] = [
  {
    id: "pronouns",
    title: "Personal Pronouns",
    description: "Learn to use personal pronouns in Danish",
    level: "A1",
    sections: [
      {
        title: "Subject Pronouns",
        explanation: "Subject pronouns in Danish are similar to those in English, but with some important differences.",
        examples: [
          { danish: "Jeg taler dansk", spanish: "Yo hablo danés" },
          { danish: "Du er fra Spanien", spanish: "Tú eres de España" },
          { danish: "Han/hun læser en bog", spanish: "Él/ella lee un libro" },
          { danish: "Vi bor i København", spanish: "Nosotros vivimos en Copenhague" },
          { danish: "I taler engelsk", spanish: "Vosotros habláis inglés" },
          { danish: "De kommer i morgen", spanish: "Ellos/ellas vienen mañana" },
        ],
        quiz: {
          type: "multipleChoice",
          question: "What is the correct pronoun for 'we' in Danish?",
          options: ["Jeg", "Du", "Vi", "De"],
          correctAnswer: "Vi",
        },
      },
      {
        title: "Object Pronouns",
        explanation: "Object pronouns are used when the pronoun is the object of the action.",
        examples: [
          { danish: "Han ser mig", spanish: "Él me ve" },
          { danish: "Jeg hjælper dig", spanish: "Yo te ayudo" },
          { danish: "Vi kender ham/hende", spanish: "Nosotros lo/la conocemos" },
          { danish: "De inviterer os", spanish: "Ellos nos invitan" },
          { danish: "Hun ringer til jer", spanish: "Ella os llama" },
          { danish: "Jeg møder dem", spanish: "Yo los/las encuentro" },
        ],
        quiz: {
          type: "fillBlank",
          question: "Complete the sentence: 'Hun ser ___' (She sees me)",
          correctAnswer: "mig",
        },
      },
    ],
  },
  {
    id: "present-tense",
    title: "Present Simple",
    description: "Learn to form and use the present simple in Danish",
    level: "A1",
    sections: [
      {
        title: "Formation of the Present Tense",
        explanation:
          "In Danish, the present simple is formed with the infinitive without 'at' and doesn't change according to person.",
        examples: [
          { danish: "Jeg spiser brød", spanish: "Yo como pan" },
          { danish: "Du spiser brød", spanish: "Tú comes pan" },
          { danish: "Han spiser brød", spanish: "Él come pan" },
          { danish: "Vi spiser brød", spanish: "Nosotros comemos pan" },
        ],
        quiz: {
          type: "multipleChoice",
          question: "How do you say 'She speaks Danish' in present simple?",
          options: ["Hun taler dansk", "Hun tale dansk", "Hun at tale dansk", "Hun talte dansk"],
          correctAnswer: "Hun taler dansk",
        },
      },
      {
        title: "Irregular Verbs in Present Tense",
        explanation: "Some verbs have irregular forms in the present tense.",
        examples: [
          { danish: "Jeg er glad", spanish: "Yo estoy feliz" },
          { danish: "Du har en bil", spanish: "Tú tienes un coche" },
          { danish: "Vi går hjem", spanish: "Nosotros vamos a casa" },
          { danish: "De gør det", spanish: "Ellos lo hacen" },
        ],
        quiz: {
          type: "fillBlank",
          question: "Complete the sentence: 'Jeg ___ en hund' (I have a dog)",
          correctAnswer: "har",
        },
      },
    ],
  },
  {
    id: "word-order",
    title: "Word Order",
    description: "Learn the word order in Danish sentences",
    level: "A1",
    sections: [
      {
        title: "Affirmative Sentences",
        explanation: "In Danish, the verb always goes in second position in affirmative sentences.",
        examples: [
          { danish: "Jeg læser en bog", spanish: "Yo leo un libro" },
          { danish: "I dag læser jeg en bog", spanish: "Hoy leo un libro" },
          { danish: "Min ven kommer i morgen", spanish: "Mi amigo viene mañana" },
          { danish: "I morgen kommer min ven", spanish: "Mañana viene mi amigo" },
        ],
        quiz: {
          type: "multipleChoice",
          question: "What is the correct order for 'Today I go to the cinema'?",
          options: [
            "I dag jeg går i biografen",
            "I dag går jeg i biografen",
            "Jeg i dag går i biografen",
            "Jeg går i dag i biografen",
          ],
          correctAnswer: "I dag går jeg i biografen",
        },
      },
      {
        title: "Interrogative Sentences",
        explanation: "In questions, the verb comes first, followed by the subject.",
        examples: [
          { danish: "Taler du dansk?", spanish: "¿Hablas danés?" },
          { danish: "Kommer hun i morgen?", spanish: "¿Viene ella mañana?" },
          { danish: "Har du en bil?", spanish: "¿Tienes un coche?" },
          { danish: "Hvor bor du?", spanish: "¿Dónde vives?" },
        ],
        quiz: {
          type: "fillBlank",
          question: "Complete the question: '___ du kaffe?' (Do you drink coffee?)",
          correctAnswer: "Drikker",
        },
      },
    ],
  },
  {
    id: "articles",
    title: "Articles and Gender",
    description: "Learn to use articles and gender in Danish",
    level: "A2",
    sections: [
      {
        title: "Indefinite Articles",
        explanation: "In Danish there are two genders: common (en) and neuter (et).",
        examples: [
          { danish: "en mand", spanish: "un hombre" },
          { danish: "et hus", spanish: "una casa" },
          { danish: "en kvinde", spanish: "una mujer" },
          { danish: "et barn", spanish: "un niño/una niña" },
        ],
        quiz: {
          type: "multipleChoice",
          question: "What is the correct article for 'bil' (car)?",
          options: ["en", "et", "den", "det"],
          correctAnswer: "en",
        },
      },
      {
        title: "Definite Articles",
        explanation: "In Danish, the definite article is added to the end of the noun.",
        examples: [
          { danish: "manden", spanish: "el hombre" },
          { danish: "huset", spanish: "la casa" },
          { danish: "kvinden", spanish: "la mujer" },
          { danish: "barnet", spanish: "el niño/la niña" },
        ],
        quiz: {
          type: "fillBlank",
          question: "How do you say 'the book' in Danish? (bog = book)",
          correctAnswer: "bogen",
        },
      },
    ],
  },
]

/**
 * Gets all grammar topics
 */
export async function getAllGrammarTopics(): Promise<GrammarTopic[]> {
  // Simulate an asynchronous call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(grammarTopics)
    }, 500)
  })
}

/**
 * Gets a specific grammar topic by ID
 */
export async function getGrammarTopic(id: string): Promise<GrammarTopic | null> {
  // Simulate an asynchronous call
  return new Promise((resolve) => {
    setTimeout(() => {
      const topic = grammarTopics.find((topic) => topic.id === id) || null
      resolve(topic)
    }, 500)
  })
}

/**
 * Gets grammar topics by level
 */
export async function getGrammarTopicsByLevel(level: "A1" | "A2" | "B1" | "B2"): Promise<GrammarTopic[]> {
  // Simulate an asynchronous call
  return new Promise((resolve) => {
    setTimeout(() => {
      const topics = grammarTopics.filter((topic) => topic.level === level)
      resolve(topics)
    }, 500)
  })
}
