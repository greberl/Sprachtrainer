'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { LANGUAGES, CATEGORIES, EXERCISE_TYPES } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

interface Topic {
  id: string
  name: string
  language: string
  category: string
  difficulty: number
}

export default function NewExercisePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [topics, setTopics] = useState<Topic[]>([])
  const [formData, setFormData] = useState({
    language: 'de',
    topicId: '',
    difficulty: 3,
    type: 'multiple_choice' as keyof typeof EXERCISE_TYPES,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  useEffect(() => {
    if (formData.language) {
      fetchTopics()
    }
  }, [formData.language])

  const fetchTopics = async () => {
    try {
      const response = await fetch(`/api/topics?language=${formData.language}`)
      if (response.ok) {
        const data = await response.json()
        setTopics(data.topics)
        if (data.topics.length > 0 && !formData.topicId) {
          setFormData((prev) => ({ ...prev, topicId: data.topics[0].id }))
        }
      }
    } catch (error) {
      console.error('Error fetching topics:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/exercises/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Fehler beim Erstellen der Übung')
        return
      }

      router.push(`/exercises/${data.exercise.id}`)
    } catch (err) {
      setError('Ein Fehler ist aufgetreten')
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    )
  }

  const languageOptions = Object.entries(LANGUAGES).map(([code, name]) => ({
    value: code,
    label: name,
  }))

  const topicOptions = topics.map((topic) => ({
    value: topic.id,
    label: `${topic.name} (${CATEGORIES[topic.category as keyof typeof CATEGORIES]})`,
  }))

  const typeOptions = Object.entries(EXERCISE_TYPES).map(([code, name]) => ({
    value: code,
    label: name,
  }))

  const difficultyOptions = [
    { value: '1', label: 'Sehr leicht' },
    { value: '2', label: 'Leicht' },
    { value: '3', label: 'Mittel' },
    { value: '4', label: 'Schwer' },
    { value: '5', label: 'Sehr schwer' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card>
          <CardHeader>
            <CardTitle>Neue Übung erstellen</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              <Select
                label="Sprache"
                value={formData.language}
                onChange={(e) => setFormData({ ...formData, language: e.target.value, topicId: '' })}
                options={languageOptions}
              />

              {topicOptions.length > 0 ? (
                <Select
                  label="Thema"
                  value={formData.topicId}
                  onChange={(e) => setFormData({ ...formData, topicId: e.target.value })}
                  options={topicOptions}
                />
              ) : (
                <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg">
                  Keine Themen für diese Sprache verfügbar. Bitte wähle eine andere Sprache.
                </div>
              )}

              <Select
                label="Übungstyp"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                options={typeOptions}
              />

              <Select
                label="Schwierigkeitsgrad"
                value={formData.difficulty.toString()}
                onChange={(e) => setFormData({ ...formData, difficulty: parseInt(e.target.value) })}
                options={difficultyOptions}
              />

              <div className="flex space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  className="flex-1"
                >
                  Abbrechen
                </Button>
                <Button
                  type="submit"
                  disabled={loading || !formData.topicId}
                  className="flex-1"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Erstellt...
                    </>
                  ) : (
                    'Übung erstellen'
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
