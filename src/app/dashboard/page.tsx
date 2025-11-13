'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { BookOpen, TrendingUp, Target, Brain } from 'lucide-react'

interface Weakness {
  id: string
  topic: {
    name: string
    language: string
    category: string
  }
  severity: number
  errorCount: number
  totalAttempts: number
}

interface Suggestion {
  topic: string
  reason: string
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [weaknesses, setWeaknesses] = useState<Weakness[]>([])
  const [suggestion, setSuggestion] = useState<Suggestion | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  useEffect(() => {
    if (session) {
      fetchData()
    }
  }, [session])

  const fetchData = async () => {
    try {
      const [weaknessesRes, suggestionsRes] = await Promise.all([
        fetch('/api/weaknesses'),
        fetch('/api/suggestions'),
      ])

      if (weaknessesRes.ok) {
        const data = await weaknessesRes.json()
        setWeaknesses(data.weaknesses)
      }

      if (suggestionsRes.ok) {
        const data = await suggestionsRes.json()
        setSuggestion(data.suggestion)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Lädt...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Willkommen zurück, {session?.user?.name || 'Lernender'}!
          </h1>
          <p className="text-gray-600 mt-2">
            Hier ist deine persönliche Lernübersicht
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <QuickActionCard
            icon={<Brain className="h-8 w-8 text-blue-600" />}
            title="Neue Übung"
            description="KI-generiert"
            href="/exercises/new"
          />
          <QuickActionCard
            icon={<Target className="h-8 w-8 text-red-600" />}
            title="Schwächen üben"
            description={`${weaknesses.length} identifiziert`}
            href="/exercises?focus=weaknesses"
          />
          <QuickActionCard
            icon={<TrendingUp className="h-8 w-8 text-green-600" />}
            title="Fortschritt"
            description="Statistiken ansehen"
            href="/progress"
          />
          <QuickActionCard
            icon={<BookOpen className="h-8 w-8 text-purple-600" />}
            title="Themen"
            description="Durchstöbern"
            href="/topics"
          />
        </div>

        {/* AI Suggestion */}
        {suggestion && (
          <Card className="mb-8 border-l-4 border-primary-600">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Brain className="h-5 w-5 mr-2 text-primary-600" />
                KI-Empfehlung
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">{suggestion.reason}</p>
              <Link href={`/exercises/new?topic=${encodeURIComponent(suggestion.topic)}`}>
                <Button variant="primary">
                  Übung zu "{suggestion.topic}" starten
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Weaknesses */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center">
                <Target className="h-5 w-5 mr-2 text-red-600" />
                Deine Schwächen
              </span>
              <Link href="/weaknesses">
                <Button variant="ghost" size="sm">
                  Alle anzeigen
                </Button>
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {weaknesses.length === 0 ? (
              <p className="text-gray-600 text-center py-8">
                Noch keine Schwächen identifiziert. Starte deine erste Übung!
              </p>
            ) : (
              <div className="space-y-4">
                {weaknesses.slice(0, 5).map((weakness) => (
                  <div
                    key={weakness.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">
                        {weakness.topic.name}
                      </h4>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="info">{weakness.topic.language.toUpperCase()}</Badge>
                        <Badge>{weakness.topic.category}</Badge>
                        <span className="text-sm text-gray-600">
                          {weakness.errorCount} / {weakness.totalAttempts} Fehler
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="flex items-center">
                        <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
                          <div
                            className="bg-red-600 h-2 rounded-full"
                            style={{ width: `${weakness.severity * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-700">
                          {Math.round(weakness.severity * 100)}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function QuickActionCard({
  icon,
  title,
  description,
  href,
}: {
  icon: React.ReactNode
  title: string
  description: string
  href: string
}) {
  return (
    <Link href={href}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
        <CardContent className="pt-6">
          <div className="mb-4">{icon}</div>
          <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </CardContent>
      </Card>
    </Link>
  )
}
