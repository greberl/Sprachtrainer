import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const LANGUAGES = {
  de: 'Deutsch',
  en: 'Englisch',
  ru: 'Russisch',
  es: 'Spanisch',
  fr: 'Französisch',
  it: 'Italienisch',
} as const

export type Language = keyof typeof LANGUAGES

export const CATEGORIES = {
  grammar: 'Grammatik',
  vocabulary: 'Vokabular',
  pronunciation: 'Aussprache',
  writing: 'Schreiben',
} as const

export type Category = keyof typeof CATEGORIES

export const EXERCISE_TYPES = {
  multiple_choice: 'Multiple Choice',
  fill_blank: 'Lückentext',
  translation: 'Übersetzung',
  sentence_construction: 'Satzbildung',
} as const

export type ExerciseType = keyof typeof EXERCISE_TYPES

export function calculateWeaknessSeverity(errorCount: number, totalAttempts: number): number {
  if (totalAttempts === 0) return 0.5
  return Math.min(errorCount / totalAttempts, 1)
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('de-DE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function getDifficultyLabel(difficulty: number): string {
  const labels = ['Sehr leicht', 'Leicht', 'Mittel', 'Schwer', 'Sehr schwer']
  return labels[difficulty - 1] || 'Unbekannt'
}

export function getDifficultyColor(difficulty: number): string {
  const colors = [
    'text-green-600',
    'text-lime-600',
    'text-yellow-600',
    'text-orange-600',
    'text-red-600',
  ]
  return colors[difficulty - 1] || 'text-gray-600'
}
