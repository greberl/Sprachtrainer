import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { generateExercise } from '@/lib/ai'
import { z } from 'zod'

const generateSchema = z.object({
  language: z.enum(['de', 'en', 'ru', 'es', 'fr', 'it']),
  topicId: z.string(),
  difficulty: z.number().min(1).max(5),
  type: z.enum(['multiple_choice', 'fill_blank', 'translation', 'sentence_construction']),
})

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Nicht authentifiziert' }, { status: 401 })
    }

    const body = await req.json()
    const validatedData = generateSchema.parse(body)

    const topic = await prisma.topic.findUnique({
      where: { id: validatedData.topicId },
    })

    if (!topic) {
      return NextResponse.json({ error: 'Thema nicht gefunden' }, { status: 404 })
    }

    const generatedExercise = await generateExercise({
      language: validatedData.language,
      topic: topic.name,
      difficulty: validatedData.difficulty,
      type: validatedData.type,
    })

    const exercise = await prisma.exercise.create({
      data: {
        userId: session.user.id,
        topicId: validatedData.topicId,
        language: validatedData.language,
        type: validatedData.type,
        difficulty: validatedData.difficulty,
        question: generatedExercise.question,
        options: generatedExercise.options || [],
        correctAnswer: generatedExercise.correctAnswer,
        explanation: generatedExercise.explanation,
        generatedByAI: true,
      },
      include: {
        topic: true,
      },
    })

    return NextResponse.json({ exercise }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validierungsfehler', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Exercise generation error:', error)
    return NextResponse.json(
      { error: 'Fehler bei der Übungserstellung' },
      { status: 500 }
    )
  }
}
