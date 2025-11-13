import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { BookOpen, Brain, Target, TrendingUp } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Lerne Sprachen intelligenter
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              KI-basierte Sprachübungen, die sich deinen Schwächen anpassen.
              Gezielt üben, schneller lernen.
            </p>
            <div className="flex justify-center space-x-4">
              <Link href="/register">
                <Button size="lg" variant="primary">
                  Jetzt starten
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline">
                  Anmelden
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Funktionen
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<Brain className="h-12 w-12 text-primary-600" />}
              title="KI-Generierte Übungen"
              description="Maßgeschneiderte Übungen, die von KI basierend auf deinen Bedürfnissen erstellt werden"
            />
            <FeatureCard
              icon={<Target className="h-12 w-12 text-primary-600" />}
              title="Schwächen-Analyse"
              description="Automatische Erkennung deiner Schwachstellen und gezielte Übungsvorschläge"
            />
            <FeatureCard
              icon={<TrendingUp className="h-12 w-12 text-primary-600" />}
              title="Fortschritts-Tracking"
              description="Verfolge deine Verbesserung mit detaillierten Statistiken und Analysen"
            />
            <FeatureCard
              icon={<BookOpen className="h-12 w-12 text-primary-600" />}
              title="6 Sprachen"
              description="Deutsch, Englisch, Russisch, Spanisch, Französisch und Italienisch"
            />
          </div>
        </div>
      </section>

      {/* Languages Section */}
      <section className="bg-gray-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Unterstützte Sprachen
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {['Deutsch', 'Englisch', 'Russisch', 'Spanisch', 'Französisch', 'Italienisch'].map((lang) => (
              <div
                key={lang}
                className="bg-white p-6 rounded-lg shadow-sm text-center hover:shadow-md transition-shadow"
              >
                <p className="font-semibold text-gray-900">{lang}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Bereit, deine Sprachkenntnisse zu verbessern?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Starte jetzt kostenlos und erlebe intelligentes Sprachenlernen
          </p>
          <Link href="/register">
            <Button size="lg" variant="secondary">
              Kostenlos registrieren
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}
