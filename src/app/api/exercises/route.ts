import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Nicht authentifiziert' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const language = searchParams.get('language')
    const topicId = searchParams.get('topicId')
    const difficulty = searchParams.get('difficulty')
    const limit = parseInt(searchParams.get('limit') || '10')

    const exercises = await prisma.exercise.findMany({
      where: {
        ...(language && { language }),
        ...(topicId && { topicId }),
        ...(difficulty && { difficulty: parseInt(difficulty) }),
      },
      include: {
        topic: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    })

    return NextResponse.json({ exercises })
  } catch (error) {
    console.error('Error fetching exercises:', error)
    return NextResponse.json(
      { error: 'Fehler beim Laden der Übungen' },
      { status: 500 }
    )
  }
}
