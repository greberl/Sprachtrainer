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

    const weaknesses = await prisma.weakness.findMany({
      where: {
        userId: session.user.id,
        ...(language && { language }),
        severity: {
          gt: 0.3, // Nur signifikante Schwächen
        },
      },
      include: {
        topic: true,
      },
      orderBy: {
        severity: 'desc',
      },
    })

    return NextResponse.json({ weaknesses })
  } catch (error) {
    console.error('Error fetching weaknesses:', error)
    return NextResponse.json(
      { error: 'Fehler beim Laden der Schwächen' },
      { status: 500 }
    )
  }
}
