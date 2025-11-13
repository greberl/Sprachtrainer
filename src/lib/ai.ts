import OpenAI from 'openai'
import { ExerciseType, Language } from './utils'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export interface GenerateExerciseParams {
  language: Language
  topic: string
  difficulty: number
  type: ExerciseType
  context?: string
}

export interface GeneratedExercise {
  question: string
  options?: string[]
  correctAnswer: string
  explanation: string
}

export async function generateExercise(
  params: GenerateExerciseParams
): Promise<GeneratedExercise> {
  const { language, topic, difficulty, type, context } = params

  const prompt = buildExercisePrompt(language, topic, difficulty, type, context)

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: 'Du bist ein erfahrener Sprachlehrer, der hochwertige Übungen erstellt.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' },
    })

    const result = JSON.parse(completion.choices[0].message.content || '{}')
    return result as GeneratedExercise
  } catch (error) {
    console.error('Error generating exercise:', error)
    throw new Error('Failed to generate exercise')
  }
}

function buildExercisePrompt(
  language: string,
  topic: string,
  difficulty: number,
  type: ExerciseType,
  context?: string
): string {
  const typeInstructions = {
    multiple_choice: 'Erstelle eine Multiple-Choice-Frage mit 4 Optionen.',
    fill_blank: 'Erstelle einen Lückentext mit einer zu füllenden Lücke (markiert mit ___).',
    translation: 'Erstelle eine Übersetzungsaufgabe.',
    sentence_construction: 'Erstelle eine Satzbildungsaufgabe.',
  }

  return `
Erstelle eine ${typeInstructions[type]} für das Thema "${topic}" in ${language}.
Schwierigkeitsgrad: ${difficulty}/5
${context ? `Kontext: ${context}` : ''}

Antworte im folgenden JSON-Format:
{
  "question": "Die Aufgabenstellung",
  "options": ["Option 1", "Option 2", "Option 3", "Option 4"], // nur für multiple_choice
  "correctAnswer": "Die korrekte Antwort",
  "explanation": "Eine detaillierte Erklärung der Lösung mit Regeln und Tipps"
}

Stelle sicher, dass:
1. Die Frage klar und eindeutig ist
2. Die Erklärung Regeln, Beispiele und hilfreiche Tipps enthält
3. Die Schwierigkeit dem angegebenen Level entspricht
4. Bei Multiple Choice nur eine Antwort korrekt ist
`
}

export interface GenerateRuleParams {
  language: Language
  topic: string
}

export interface GeneratedRule {
  title: string
  content: string
  examples: string[]
  mnemonics: string[]
  tips: string[]
}

export async function generateRule(params: GenerateRuleParams): Promise<GeneratedRule> {
  const { language, topic } = params

  const prompt = `
Erstelle eine umfassende Regel-Erklärung für das Thema "${topic}" in ${language}.

Antworte im folgenden JSON-Format:
{
  "title": "Titel der Regel",
  "content": "Detaillierte Erklärung der Regel",
  "examples": ["Beispiel 1", "Beispiel 2", "Beispiel 3"],
  "mnemonics": ["Eselsbrücke 1", "Eselsbrücke 2"],
  "tips": ["Tipp 1", "Tipp 2", "Tipp 3"]
}

Stelle sicher, dass:
1. Die Erklärung klar und verständlich ist
2. Mindestens 3 praktische Beispiele enthalten sind
3. Mindestens 2 einprägsame Eselsbrücken dabei sind
4. Die Tipps konkret und umsetzbar sind
`

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: 'Du bist ein erfahrener Sprachlehrer mit didaktischem Geschick.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' },
    })

    const result = JSON.parse(completion.choices[0].message.content || '{}')
    return result as GeneratedRule
  } catch (error) {
    console.error('Error generating rule:', error)
    throw new Error('Failed to generate rule')
  }
}

export async function analyzeWeaknesses(
  userAnswers: Array<{
    topic: string
    isCorrect: boolean
  }>
): Promise<string[]> {
  const prompt = `
Analysiere die folgenden Antworten eines Sprachlernenden und identifiziere Schwächen:

${JSON.stringify(userAnswers, null, 2)}

Gib eine Liste von Themen zurück, die der Lernende üben sollte, sortiert nach Priorität.
Antworte im JSON-Format: { "weaknesses": ["Thema 1", "Thema 2", ...] }
`

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: 'Du bist ein Sprachlehrer, der Lernschwächen analysiert.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.5,
      response_format: { type: 'json_object' },
    })

    const result = JSON.parse(completion.choices[0].message.content || '{}')
    return result.weaknesses || []
  } catch (error) {
    console.error('Error analyzing weaknesses:', error)
    return []
  }
}

export async function suggestNextExercise(
  weaknesses: Array<{
    topic: string
    severity: number
  }>,
  recentTopics: string[]
): Promise<{
  topic: string
  reason: string
}> {
  const prompt = `
Basierend auf den folgenden Schwächen und kürzlich bearbeiteten Themen, schlage das nächste Thema vor:

Schwächen: ${JSON.stringify(weaknesses, null, 2)}
Kürzlich bearbeitet: ${JSON.stringify(recentTopics, null, 2)}

Antworte im JSON-Format:
{
  "topic": "Empfohlenes Thema",
  "reason": "Begründung für diese Empfehlung"
}
`

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: 'Du bist ein Sprachlehrer, der personalisierte Lernpläne erstellt.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' },
    })

    const result = JSON.parse(completion.choices[0].message.content || '{}')
    return result
  } catch (error) {
    console.error('Error suggesting exercise:', error)
    return {
      topic: weaknesses[0]?.topic || 'Allgemeine Übungen',
      reason: 'Basierend auf deinen Schwächen',
    }
  }
}
