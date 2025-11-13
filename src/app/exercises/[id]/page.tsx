'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Input } from '@/components/ui/Input'
import { CheckCircle, XCircle, BookOpen, Lightbulb, Loader2 } from 'lucide-react'
import { getDifficultyLabel, getDifficultyColor } from '@/lib/utils'

interface Exercise {
  id: string
  question: string
  options: string[]
  correctAnswer: string
  explanation: string
  type: string
  difficulty: number
  language: string
  topic: {
    name: string
    category: string
    rules: Array<{
      title: string
      content: string
      examples: string[]
      mnemonics: string[]
      tips: string[]
    }>
  }
}

export default function ExercisePage({ params }: { params: { id: string } }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [exercise, setExercise] = useState<Exercise | null>(null)
  const [userAnswer, setUserAnswer] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [showRules, setShowRules] = useState(false)
  const [startTime] = useState(Date.now())

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  useEffect(() => {
    if (session) {
      fetchExercise()
    }
  }, [session, params.id])

  const fetchExercise = async () => {
    try {
      const response = await fetch(`/api/exercises/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setExercise(data.exercise)
      } else {
        router.push('/dashboard')
      }
    } catch (error) {
      console.error('Error fetching exercise:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async () => {
    if (!userAnswer.trim()) return

    setSubmitting(true)
    const timeSpent = Math.floor((Date.now() - startTime) / 1000)
    const correct = userAnswer.toLowerCase().trim() === exercise?.correctAnswer.toLowerCase().trim()
    setIsCorrect(correct)

    try {
      await fetch('/api/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          exerciseId: params.id,
          userAnswer,
          isCorrect: correct,
          timeSpent,
        }),
      })
    } catch (error) {
      console.error('Error submitting progress:', error)
    } finally {
      setSubmitted(true)
      setSubmitting(false)
    }
  }

  const handleNext = () => {
    router.push('/exercises/new')
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    )
  }

  if (!exercise) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Exercise Info */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Badge variant="info">{exercise.language.toUpperCase()}</Badge>
            <Badge>{exercise.topic.category}</Badge>
            <Badge className={getDifficultyColor(exercise.difficulty)}>
              {getDifficultyLabel(exercise.difficulty)}
            </Badge>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowRules(!showRules)}
          >
            <BookOpen className="h-4 w-4 mr-2" />
            {showRules ? 'Regeln ausblenden' : 'Regeln anzeigen'}
          </Button>
        </div>

        {/* Rules Panel */}
        {showRules && exercise.topic.rules.length > 0 && (
          <Card className="mb-6 border-l-4 border-blue-500">
            <CardHeader>
              <CardTitle className="text-lg">
                Regeln: {exercise.topic.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {exercise.topic.rules.map((rule, index) => (
                <div key={index}>
                  <h4 className="font-semibold text-gray-900 mb-2">{rule.title}</h4>
                  <p className="text-gray-700 mb-3">{rule.content}</p>

                  {rule.examples.length > 0 && (
                    <div className="mb-3">
                      <p className="text-sm font-medium text-gray-700 mb-1">Beispiele:</p>
                      <ul className="list-disc list-inside space-y-1">
                        {rule.examples.map((example, i) => (
                          <li key={i} className="text-sm text-gray-600">{example}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {rule.mnemonics.length > 0 && (
                    <div className="mb-3">
                      <p className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                        <Lightbulb className="h-4 w-4 mr-1" />
                        Eselsbrücken:
                      </p>
                      <ul className="list-disc list-inside space-y-1">
                        {rule.mnemonics.map((mnemonic, i) => (
                          <li key={i} className="text-sm text-gray-600 italic">{mnemonic}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {rule.tips.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">Tipps:</p>
                      <ul className="list-disc list-inside space-y-1">
                        {rule.tips.map((tip, i) => (
                          <li key={i} className="text-sm text-gray-600">{tip}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Exercise Card */}
        <Card>
          <CardHeader>
            <CardTitle>{exercise.topic.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {exercise.question}
              </h3>

              {exercise.type === 'multiple_choice' && exercise.options.length > 0 ? (
                <div className="space-y-3">
                  {exercise.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => !submitted && setUserAnswer(option)}
                      disabled={submitted}
                      className={`w-full p-4 text-left rounded-lg border-2 transition-colors ${
                        userAnswer === option
                          ? submitted
                            ? isCorrect
                              ? 'border-green-500 bg-green-50'
                              : 'border-red-500 bg-red-50'
                            : 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'
                      } ${submitted ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              ) : (
                <Input
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  disabled={submitted}
                  placeholder="Deine Antwort..."
                  className="text-lg"
                />
              )}
            </div>

            {!submitted ? (
              <Button
                onClick={handleSubmit}
                disabled={!userAnswer.trim() || submitting}
                className="w-full"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Wird überprüft...
                  </>
                ) : (
                  'Antwort prüfen'
                )}
              </Button>
            ) : (
              <div className="space-y-4">
                {/* Result */}
                <div
                  className={`p-4 rounded-lg flex items-center ${
                    isCorrect
                      ? 'bg-green-50 border-2 border-green-500'
                      : 'bg-red-50 border-2 border-red-500'
                  }`}
                >
                  {isCorrect ? (
                    <>
                      <CheckCircle className="h-6 w-6 text-green-600 mr-3" />
                      <div>
                        <p className="font-semibold text-green-900">Richtig!</p>
                        <p className="text-sm text-green-700">Sehr gut gemacht!</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-6 w-6 text-red-600 mr-3" />
                      <div>
                        <p className="font-semibold text-red-900">Nicht ganz richtig</p>
                        <p className="text-sm text-red-700">
                          Richtige Antwort: <strong>{exercise.correctAnswer}</strong>
                        </p>
                      </div>
                    </>
                  )}
                </div>

                {/* Explanation */}
                <Card className="border-l-4 border-blue-500">
                  <CardHeader>
                    <CardTitle className="text-lg">Erklärung</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 whitespace-pre-wrap">{exercise.explanation}</p>
                  </CardContent>
                </Card>

                {/* Actions */}
                <div className="flex space-x-4">
                  <Button
                    variant="outline"
                    onClick={() => router.push('/dashboard')}
                    className="flex-1"
                  >
                    Zum Dashboard
                  </Button>
                  <Button onClick={handleNext} className="flex-1">
                    Nächste Übung
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
