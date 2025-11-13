import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Nicht authentifiziert' }, { status: 401 })
    }

    const exercise = await prisma.exercise.findUnique({
      where: { id: params.id },
      include: {
        topic: {
          include: {
            rules: true,
          },
        },
      },
    })

    if (!exercise) {
      return NextResponse.json({ error: 'Übung nicht gefunden' }, { status: 404 })
    }

    return NextResponse.json({ exercise })
  } catch (error) {
    console.error('Error fetching exercise:', error)
    return NextResponse.json(
      { error: 'Fehler beim Laden der Übung' },
      { status: 500 }
    )
  }
}
