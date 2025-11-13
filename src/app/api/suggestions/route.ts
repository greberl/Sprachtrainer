import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { suggestNextExercise } from '@/lib/ai'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Nicht authentifiziert' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const language = searchParams.get('language')

    // Schwächen abrufen
    const weaknesses = await prisma.weakness.findMany({
      where: {
        userId: session.user.id,
        ...(language && { language }),
        severity: {
          gt: 0.2,
        },
      },
      include: {
        topic: true,
      },
      orderBy: {
        severity: 'desc',
      },
      take: 10,
    })

    // Kürzlich bearbeitete Themen
    const recentProgress = await prisma.userProgress.findMany({
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
      take: 20,
    })

    const recentTopics = Array.from(
      new Set(recentProgress.map((p) => p.exercise.topic.name))
    )

    // KI-basierte Empfehlung
    const suggestion = await suggestNextExercise(
      weaknesses.map((w) => ({
        topic: w.topic.name,
        severity: w.severity,
      })),
      recentTopics
    )

    // Passende Topics finden
    const suggestedTopics = await prisma.topic.findMany({
      where: {
        name: {
          contains: suggestion.topic,
          mode: 'insensitive',
        },
        ...(language && { language }),
      },
      include: {
        rules: true,
      },
      take: 3,
    })

    return NextResponse.json({
      suggestion,
      topics: suggestedTopics,
      weaknesses: weaknesses.slice(0, 5),
    })
  } catch (error) {
    console.error('Error fetching suggestions:', error)
    return NextResponse.json(
      { error: 'Fehler beim Laden der Vorschläge' },
      { status: 500 }
    )
  }
}
