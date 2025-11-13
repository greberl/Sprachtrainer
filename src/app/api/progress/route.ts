import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { calculateWeaknessSeverity } from '@/lib/utils'
import { z } from 'zod'

const submitSchema = z.object({
  exerciseId: z.string(),
  userAnswer: z.string(),
  isCorrect: z.boolean(),
  timeSpent: z.number().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Nicht authentifiziert' }, { status: 401 })
    }

    const body = await req.json()
    const validatedData = submitSchema.parse(body)

    const exercise = await prisma.exercise.findUnique({
      where: { id: validatedData.exerciseId },
      include: { topic: true },
    })

    if (!exercise) {
      return NextResponse.json({ error: 'Übung nicht gefunden' }, { status: 404 })
    }

    // Fortschritt speichern
    const progress = await prisma.userProgress.create({
      data: {
        userId: session.user.id,
        exerciseId: validatedData.exerciseId,
        userAnswer: validatedData.userAnswer,
        isCorrect: validatedData.isCorrect,
        timeSpent: validatedData.timeSpent,
      },
    })

    // Schwäche aktualisieren
    const existingWeakness = await prisma.weakness.findUnique({
      where: {
        userId_topicId: {
          userId: session.user.id,
          topicId: exercise.topicId,
        },
      },
    })

    if (existingWeakness) {
      const newErrorCount = validatedData.isCorrect
        ? existingWeakness.errorCount
        : existingWeakness.errorCount + 1
      const newTotalAttempts = existingWeakness.totalAttempts + 1
      const newSeverity = calculateWeaknessSeverity(newErrorCount, newTotalAttempts)

      await prisma.weakness.update({
        where: {
          userId_topicId: {
            userId: session.user.id,
            topicId: exercise.topicId,
          },
        },
        data: {
          errorCount: newErrorCount,
          totalAttempts: newTotalAttempts,
          severity: newSeverity,
          lastPracticed: new Date(),
        },
      })
    } else {
      await prisma.weakness.create({
        data: {
          userId: session.user.id,
          topicId: exercise.topicId,
          language: exercise.language,
          errorCount: validatedData.isCorrect ? 0 : 1,
          totalAttempts: 1,
          severity: validatedData.isCorrect ? 0 : 1,
          lastPracticed: new Date(),
        },
      })
    }

    return NextResponse.json({ progress }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validierungsfehler', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Progress submission error:', error)
    return NextResponse.json(
      { error: 'Fehler beim Speichern des Fortschritts' },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Nicht authentifiziert' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const limit = parseInt(searchParams.get('limit') || '50')

    const progress = await prisma.userProgress.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        exercise: {
          include: {
            topic: true,
          },
        },
      },
      orderBy: {
        completedAt: 'desc',
      },
      take: limit,
    })

    return NextResponse.json({ progress })
  } catch (error) {
    console.error('Error fetching progress:', error)
    return NextResponse.json(
      { error: 'Fehler beim Laden des Fortschritts' },
      { status: 500 }
    )
  }
}
