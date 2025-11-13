# 🎓 Sprachtrainer - KI-basierte Sprachlern-App

Eine moderne, KI-gestützte Web-Anwendung zum gezielten Üben von Sprachkenntnissen. Die App identifiziert automatisch Schwächen und generiert personalisierte Übungen mit detaillierten Erklärungen, Regeln und Eselsbrücken.

## ✨ Features

### 🤖 KI-Generierung
- **Intelligente Übungserstellung**: Google Gemini Pro generiert maßgeschneiderte Übungen basierend auf Thema, Schwierigkeit und Übungstyp
- **Adaptive Vorschläge**: KI analysiert deine Leistung und schlägt die besten nächsten Übungen vor
- **Kontextuelle Erklärungen**: Detaillierte Erläuterungen mit Regeln, Beispielen und Tipps

### 📊 Schwächen-Analyse
- **Automatische Erkennung**: Das System identifiziert Bereiche mit hoher Fehlerquote
- **Severity-Tracking**: Gewichtung der Schwächen basierend auf Fehlerrate
- **Gezielte Empfehlungen**: Vorschläge für Übungen, die deine Schwächen adressieren

### 📈 Fortschritts-Tracking
- **Detaillierte Statistiken**: Genauigkeit, durchschnittliche Zeit, Erfolgsquote
- **Visualisierungen**: Fortschritt nach Sprache und Kategorie
- **Aktivitäts-Historie**: Vollständige Übersicht aller absolvierten Übungen
- **Streak-Tracking**: Motivierende Serien richtiger Antworten

### 🌍 Mehrsprachig
Unterstützt 6 Sprachen:
- 🇩🇪 Deutsch
- 🇬🇧 Englisch
- 🇷🇺 Russisch
- 🇪🇸 Spanisch
- 🇫🇷 Französisch
- 🇮🇹 Italienisch

### 📝 Übungstypen
- **Multiple Choice**: Auswahl aus mehreren Optionen
- **Lückentext**: Fülle fehlende Wörter ein
- **Übersetzung**: Übersetze Sätze oder Phrasen
- **Satzbildung**: Konstruiere grammatikalisch korrekte Sätze

### 🎯 Kategorien
- **Grammatik**: Zeitformen, Fälle, Syntax
- **Vokabular**: Wortschatz, Redewendungen
- **Aussprache**: Phonetik, Betonung
- **Schreiben**: Komposition, Stil

## 🏗️ Technologie-Stack

### Frontend
- **Next.js 14**: React Framework mit App Router
- **TypeScript**: Typsicherer Code
- **Tailwind CSS**: Utility-First CSS Framework
- **NextAuth.js**: Authentifizierung

### Backend
- **Next.js API Routes**: Serverless API
- **Prisma ORM**: Datenbankzugriff
- **PostgreSQL**: Relationale Datenbank

### KI & Services
- **Google Gemini Pro**: Übungsgenerierung und Analyse
- **Lucide React**: Icon-Bibliothek

## 📁 Projektstruktur

```
sprachtrainer/
├── prisma/
│   └── schema.prisma          # Datenbank-Schema
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/         # Login-Seite
│   │   │   └── register/      # Registrierungs-Seite
│   │   ├── api/
│   │   │   ├── auth/          # Authentifizierungs-API
│   │   │   ├── exercises/     # Übungs-API
│   │   │   ├── progress/      # Fortschritts-API
│   │   │   ├── weaknesses/    # Schwächen-API
│   │   │   ├── topics/        # Themen-API
│   │   │   └── suggestions/   # KI-Vorschläge-API
│   │   ├── dashboard/         # Dashboard
│   │   ├── exercises/         # Übungs-Seiten
│   │   ├── progress/          # Fortschritts-Seite
│   │   ├── layout.tsx         # Root Layout
│   │   ├── page.tsx           # Landing Page
│   │   └── providers.tsx      # Context Providers
│   ├── components/
│   │   ├── ui/                # UI-Komponenten
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Select.tsx
│   │   │   └── Badge.tsx
│   │   └── layout/
│   │       └── Navbar.tsx     # Navigation
│   ├── lib/
│   │   ├── prisma.ts          # Prisma Client
│   │   ├── auth.ts            # Auth-Konfiguration
│   │   ├── ai.ts              # Google Gemini Integration
│   │   └── utils.ts           # Utility-Funktionen
│   ├── types/
│   │   └── next-auth.d.ts     # Type Definitions
│   └── styles/
│       └── globals.css        # Globale Styles
├── public/                    # Statische Assets
├── .env.example              # Umgebungsvariablen-Vorlage
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── README.md
```

## 🚀 Installation & Setup

### Voraussetzungen
- Node.js 18+ und npm
- PostgreSQL Datenbank
- Google Gemini API Key

### Schritt 1: Repository klonen
```bash
git clone <repository-url>
cd sprachtrainer
```

### Schritt 2: Abhängigkeiten installieren
```bash
npm install
```

### Schritt 3: Umgebungsvariablen konfigurieren
Erstelle eine `.env` Datei im Root-Verzeichnis:

```env
# Datenbank
DATABASE_URL="postgresql://user:password@localhost:5432/sprachtrainer?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="dein-geheimer-schlüssel-hier"

# Google Gemini API
GEMINI_API_KEY="dein-gemini-api-key"
```

**Wichtig:**
- Generiere einen sicheren NEXTAUTH_SECRET mit: `openssl rand -base64 32`
- Erhalte deinen Gemini API Key von: https://makersuite.google.com/app/apikey

### Schritt 4: Datenbank einrichten
```bash
# Datenbank-Migrationen ausführen
npx prisma migrate dev --name init

# Prisma Client generieren
npx prisma generate

# (Optional) Prisma Studio öffnen
npx prisma studio
```

### Schritt 5: Entwicklungsserver starten
```bash
npm run dev
```

Die App ist nun unter `http://localhost:3000` erreichbar.

## 📊 Datenbank-Schema

### User
Benutzer-Accounts mit Authentifizierung
- Email, Passwort (bcrypt)
- Muttersprache
- Beziehungen: Exercises, Progress, Weaknesses

### Topic
Lernthemen und Kategorien
- Name, Sprache, Kategorie
- Schwierigkeitsgrad (1-5)
- Beziehungen: Rules, Exercises

### Rule
Regeln, Tipps und Eselsbrücken
- Titel, Inhalt
- Beispiele (Array)
- Eselsbrücken (Array)
- Tipps (Array)

### Exercise
Generierte Übungen
- Frage, Optionen, richtige Antwort
- Erklärung
- Typ, Schwierigkeit
- KI-generiert Flag

### UserProgress
Benutzer-Fortschritt
- User-Antwort
- Korrektheit
- Anzahl Versuche
- Zeitaufwand

### Weakness
Identifizierte Schwächen
- Topic-Referenz
- Severity (0-1)
- Fehleranzahl, Gesamtversuche
- Letztes Üben

## 🔌 API-Endpunkte

### Authentifizierung
- `POST /api/auth/register` - Benutzer registrieren
- `POST /api/auth/[...nextauth]` - NextAuth Endpunkte

### Übungen
- `POST /api/exercises/generate` - Neue Übung generieren
- `GET /api/exercises` - Übungen abrufen (mit Filtern)
- `GET /api/exercises/[id]` - Einzelne Übung abrufen

### Fortschritt
- `POST /api/progress` - Fortschritt speichern
- `GET /api/progress` - Fortschritt abrufen

### Schwächen & Vorschläge
- `GET /api/weaknesses` - Schwächen abrufen
- `GET /api/suggestions` - KI-Vorschläge abrufen

### Themen
- `GET /api/topics` - Themen abrufen (mit Filtern)

## 🎨 UI-Komponenten

Die App verwendet wiederverwendbare UI-Komponenten:

### Button
```tsx
<Button variant="primary" size="md">Klick mich</Button>
```
Varianten: primary, secondary, outline, ghost, danger

### Card
```tsx
<Card>
  <CardHeader>
    <CardTitle>Titel</CardTitle>
  </CardHeader>
  <CardContent>Inhalt</CardContent>
</Card>
```

### Input & Select
```tsx
<Input label="Name" type="text" error="Fehler" />
<Select label="Sprache" options={options} />
```

### Badge
```tsx
<Badge variant="success">Status</Badge>
```
Varianten: default, success, warning, danger, info

## 🤖 KI-Integration

### Übungsgenerierung
```typescript
const exercise = await generateExercise({
  language: 'de',
  topic: 'Present Perfect',
  difficulty: 3,
  type: 'multiple_choice',
})
```

### Schwächen-Analyse
```typescript
const weaknesses = await analyzeWeaknesses(userAnswers)
```

### Adaptive Vorschläge
```typescript
const suggestion = await suggestNextExercise(weaknesses, recentTopics)
```

## 🔒 Sicherheit

- **Passwort-Hashing**: bcrypt mit Salting
- **JWT-basierte Sessions**: Sichere Token-Verwaltung
- **Input-Validierung**: Zod-Schema-Validierung
- **SQL-Injection-Schutz**: Prisma ORM
- **CSRF-Schutz**: NextAuth integriert

## 🎯 Workflow

1. **Registrierung**: Benutzer erstellt Account mit Muttersprache
2. **Login**: Authentifizierung mit Email/Passwort
3. **Dashboard**: Übersicht über Schwächen und Empfehlungen
4. **Übung erstellen**: Sprache, Thema, Typ und Schwierigkeit wählen
5. **KI-Generierung**: Google Gemini erstellt personalisierte Übung
6. **Übung lösen**: Benutzer beantwortet Frage
7. **Feedback**: Sofortige Rückmeldung mit Erklärung
8. **Fortschritt**: Automatische Aktualisierung von Stats und Schwächen
9. **Analyse**: System identifiziert Schwächen und gibt Empfehlungen

## 🚀 Deployment

### Vercel (Empfohlen)
```bash
# Vercel CLI installieren
npm i -g vercel

# Deployen
vercel
```

### Umgebungsvariablen setzen:
1. Gehe zu Vercel Dashboard
2. Project Settings → Environment Variables
3. Füge alle Variablen aus `.env` hinzu

### Datenbank
- **Option 1**: Railway PostgreSQL
- **Option 2**: Supabase PostgreSQL
- **Option 3**: AWS RDS

## 📝 Entwicklung

### Code-Stil
- TypeScript strict mode
- ESLint für Code-Qualität
- Prettier für Formatierung (empfohlen)

### Datenbank-Änderungen
```bash
# Schema ändern in prisma/schema.prisma
# Migration erstellen
npx prisma migrate dev --name beschreibung

# Bei Problemen: Reset
npx prisma migrate reset
```

### Neue Seiten hinzufügen
Erstelle Dateien in `src/app/`:
- `page.tsx` - Seite
- `layout.tsx` - Layout (optional)
- `loading.tsx` - Loading State (optional)

## 🐛 Troubleshooting

### Prisma-Fehler
```bash
# Client neu generieren
npx prisma generate

# Datenbank zurücksetzen
npx prisma migrate reset
```

### Gemini API-Fehler
- Überprüfe GEMINI_API_KEY in `.env`
- Stelle sicher, dass der API Key gültig ist
- Rate Limits beachten (Gemini Pro: 60 requests/min)

### NextAuth-Fehler
- `NEXTAUTH_SECRET` muss gesetzt sein
- `NEXTAUTH_URL` muss korrekt sein (inkl. Port)

## 🤝 Beitragen

Contributions sind willkommen! Bitte:
1. Fork das Repository
2. Erstelle einen Feature-Branch
3. Committe deine Änderungen
4. Push zum Branch
5. Öffne einen Pull Request

## 📄 Lizenz

MIT License - siehe LICENSE Datei

## 🙏 Danksagungen

- Next.js Team für das großartige Framework
- Google für die Gemini API
- Prisma Team für das elegante ORM
- Vercel für Hosting und Deployment

## 📞 Support

Bei Fragen oder Problemen:
- Issue erstellen auf GitHub
- Email: support@sprachtrainer.app (Beispiel)

---

**Viel Erfolg beim Sprachenlernen! 🚀**
