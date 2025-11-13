'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { CheckCircle, XCircle, TrendingUp, Target, Clock } from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface ProgressEntry {
  id: string
  isCorrect: boolean
  timeSpent: number
  completedAt: string
  exercise: {
    question: string
    type: string
    difficulty: number
    language: string
    topic: {
      name: string
      category: string
    }
  }
}

interface Stats {
  totalExercises: number
  correctAnswers: number
  accuracy: number
  averageTime: number
  byLanguage: Record<string, { total: number; correct: number }>
  byCategory: Record<string, { total: number; correct: number }>
  recentStreak: number
}

export default function ProgressPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [progress, setProgress] = useState<ProgressEntry[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  useEffect(() => {
    if (session) {
      fetchProgress()
    }
  }, [session])

  const fetchProgress = async () => {
    try {
      const response = await fetch('/api/progress?limit=100')
      if (response.ok) {
        const data = await response.json()
        setProgress(data.progress)
        calculateStats(data.progress)
      }
    } catch (error) {
      console.error('Error fetching progress:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (progressData: ProgressEntry[]) => {
    const total = progressData.length
    const correct = progressData.filter((p) => p.isCorrect).length
    const totalTime = progressData.reduce((sum, p) => sum + (p.timeSpent || 0), 0)

    const byLanguage: Record<string, { total: number; correct: number }> = {}
    const byCategory: Record<string, { total: number; correct: number }> = {}

    progressData.forEach((entry) => {
      const lang = entry.exercise.language
      const cat = entry.exercise.topic.category

      if (!byLanguage[lang]) byLanguage[lang] = { total: 0, correct: 0 }
      if (!byCategory[cat]) byCategory[cat] = { total: 0, correct: 0 }

      byLanguage[lang].total++
      byCategory[cat].total++

      if (entry.isCorrect) {
        byLanguage[lang].correct++
        byCategory[cat].correct++
      }
    })

    // Calculate recent streak
    let streak = 0
    for (const entry of progressData) {
      if (entry.isCorrect) {
        streak++
      } else {
        break
      }
    }

    setStats({
      totalExercises: total,
      correctAnswers: correct,
      accuracy: total > 0 ? (correct / total) * 100 : 0,
      averageTime: total > 0 ? totalTime / total : 0,
      byLanguage,
      byCategory,
      recentStreak: streak,
    })
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Dein Fortschritt</h1>

        {stats && (
          <>
            {/* Stats Overview */}
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <StatCard
                icon={<TrendingUp className="h-8 w-8 text-blue-600" />}
                title="Übungen gesamt"
                value={stats.totalExercises.toString()}
                subtitle={`${stats.correctAnswers} richtig`}
              />
              <StatCard
                icon={<Target className="h-8 w-8 text-green-600" />}
                title="Genauigkeit"
                value={`${Math.round(stats.accuracy)}%`}
                subtitle="Erfolgsquote"
              />
              <StatCard
                icon={<Clock className="h-8 w-8 text-purple-600" />}
                title="Ø Zeit pro Übung"
                value={`${Math.round(stats.averageTime)}s`}
                subtitle="Durchschnitt"
              />
              <StatCard
                icon={<CheckCircle className="h-8 w-8 text-orange-600" />}
                title="Aktuelle Serie"
                value={stats.recentStreak.toString()}
                subtitle="richtige Antworten"
              />
            </div>

            {/* Language Breakdown */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle>Nach Sprache</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(stats.byLanguage).map(([lang, data]) => (
                      <div key={lang}>
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium text-gray-900">
                            {lang.toUpperCase()}
                          </span>
                          <span className="text-sm text-gray-600">
                            {data.correct} / {data.total} ({Math.round((data.correct / data.total) * 100)}%)
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-primary-600 h-2 rounded-full"
                            style={{ width: `${(data.correct / data.total) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Nach Kategorie</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(stats.byCategory).map(([cat, data]) => (
                      <div key={cat}>
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium text-gray-900 capitalize">{cat}</span>
                          <span className="text-sm text-gray-600">
                            {data.correct} / {data.total} ({Math.round((data.correct / data.total) * 100)}%)
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-600 h-2 rounded-full"
                            style={{ width: `${(data.correct / data.total) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Letzte Aktivitäten</CardTitle>
          </CardHeader>
          <CardContent>
            {progress.length === 0 ? (
              <p className="text-center text-gray-600 py-8">
                Noch keine Übungen absolviert. Starte jetzt!
              </p>
            ) : (
              <div className="space-y-4">
                {progress.slice(0, 20).map((entry) => (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-4 flex-1">
                      <div>
                        {entry.isCorrect ? (
                          <CheckCircle className="h-6 w-6 text-green-600" />
                        ) : (
                          <XCircle className="h-6 w-6 text-red-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">
                          {entry.exercise.topic.name}
                        </h4>
                        <p className="text-sm text-gray-600 line-clamp-1">
                          {entry.exercise.question}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="info" className="text-xs">
                            {entry.exercise.language.toUpperCase()}
                          </Badge>
                          <Badge className="text-xs">
                            {entry.exercise.topic.category}
                          </Badge>
                          {entry.timeSpent && (
                            <span className="text-xs text-gray-500">
                              {entry.timeSpent}s
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">
                        {formatDate(entry.completedAt)}
                      </p>
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

function StatCard({
  icon,
  title,
  value,
  subtitle,
}: {
  icon: React.ReactNode
  title: string
  value: string
  subtitle: string
}) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
          </div>
          <div>{icon}</div>
        </div>
      </CardContent>
    </Card>
  )
}
