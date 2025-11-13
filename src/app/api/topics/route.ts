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
    const category = searchParams.get('category')

    const topics = await prisma.topic.findMany({
      where: {
        ...(language && { language }),
        ...(category && { category }),
      },
      include: {
        rules: true,
        _count: {
          select: {
            exercises: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    })

    return NextResponse.json({ topics })
  } catch (error) {
    console.error('Error fetching topics:', error)
    return NextResponse.json(
      { error: 'Fehler beim Laden der Themen' },
      { status: 500 }
    )
  }
}
