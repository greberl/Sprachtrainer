# 🚀 Quick Setup Guide

Dieser Leitfaden führt dich Schritt für Schritt durch die Einrichtung der Sprachtrainer-App.

## Voraussetzungen prüfen

```bash
# Node.js Version prüfen (benötigt: v18+)
node --version

# npm Version prüfen
npm --version

# PostgreSQL prüfen
psql --version
```

## 1. Installation

```bash
# Abhängigkeiten installieren
npm install
```

## 2. Datenbank einrichten

### Option A: Lokale PostgreSQL

```bash
# PostgreSQL Datenbank erstellen
createdb sprachtrainer

# Connection String in .env
DATABASE_URL="postgresql://username:password@localhost:5432/sprachtrainer?schema=public"
```

### Option B: Railway (Cloud)

1. Gehe zu [railway.app](https://railway.app)
2. Erstelle neues PostgreSQL-Plugin
3. Kopiere Connection String in `.env`

### Option C: Supabase (Cloud)

1. Gehe zu [supabase.com](https://supabase.com)
2. Erstelle neues Projekt
3. Kopiere Connection String (Postgres Connection) in `.env`

## 3. Umgebungsvariablen

Erstelle `.env` Datei im Root:

```env
# Datenbank
DATABASE_URL="postgresql://user:password@localhost:5432/sprachtrainer?schema=public"

# NextAuth (generiere mit: openssl rand -base64 32)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="dein-sehr-langer-geheimer-schlüssel"

# Google Gemini API (von: https://makersuite.google.com/app/apikey)
GEMINI_API_KEY="dein-gemini-api-key"
```

### NEXTAUTH_SECRET generieren

```bash
# macOS/Linux
openssl rand -base64 32

# Windows (PowerShell)
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

### Gemini API Key erhalten

1. Gehe zu [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Klicke auf "Get API Key" oder "Create API Key"
3. Wähle ein Google Cloud Projekt aus (oder erstelle ein neues)
4. Kopiere den generierten API Key

## 4. Datenbank migrieren und seeden

```bash
# Prisma Client generieren
npx prisma generate

# Datenbank-Schema erstellen
npx prisma db push

# Initiale Daten (Topics, Rules) einfügen
npm run db:seed
```

## 5. App starten

```bash
# Entwicklungsserver starten
npm run dev
```

Öffne Browser: `http://localhost:3000`

## 6. Ersten Account erstellen

1. Gehe zu `/register`
2. Fülle Formular aus:
   - Name
   - E-Mail
   - Passwort (min. 6 Zeichen)
   - Muttersprache
3. Klicke "Registrieren"
4. Gehe zu `/login` und melde dich an

## 7. Erste Übung erstellen

1. Im Dashboard: Klicke "Neue Übung"
2. Wähle:
   - Sprache (z.B. Deutsch)
   - Thema (z.B. Perfekt)
   - Übungstyp (z.B. Multiple Choice)
   - Schwierigkeit (1-5)
3. Klicke "Übung erstellen"
4. Warte ~5-10 Sekunden (KI generiert Übung)
5. Löse die Übung!

## Troubleshooting

### Problem: "prisma generate" Fehler

```bash
# Lösung: Node modules neu installieren
rm -rf node_modules package-lock.json
npm install
npx prisma generate
```

### Problem: Datenbank-Verbindungsfehler

```bash
# Prüfe ob PostgreSQL läuft
# macOS
brew services list | grep postgresql

# Linux
sudo systemctl status postgresql

# Connection String Format prüfen
# postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public
```

### Problem: Gemini API Fehler

Häufige Ursachen:
- API Key falsch kopiert (Leerzeichen?)
- API Key nicht aktiviert
- Rate Limit erreicht (60 requests/min bei Free Tier)

Lösung:
1. Gehe zu [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Überprüfe ob der API Key aktiv ist
3. Erstelle ggf. einen neuen API Key
4. Bei Rate Limits: Warte kurz oder upgrade auf höheres Tier

### Problem: NextAuth "no secret" Fehler

```bash
# NEXTAUTH_SECRET muss gesetzt sein!
# Prüfe .env Datei
cat .env | grep NEXTAUTH_SECRET

# Generiere neuen Secret
openssl rand -base64 32
```

### Problem: App startet aber zeigt Fehler

```bash
# Logs im Terminal prüfen
# Browser Developer Console öffnen (F12)
# Network Tab prüfen für API-Fehler
```

## Prisma Studio (Datenbank GUI)

Datenbank visuell bearbeiten:

```bash
npx prisma studio
```

Öffnet Browser auf `http://localhost:5555`

## Nützliche Commands

```bash
# Datenbank zurücksetzen (löscht ALLE Daten!)
npx prisma migrate reset

# Neue Migration erstellen
npx prisma migrate dev --name deine_aenderung

# Datenbank ohne Migration aktualisieren (nur Dev!)
npx prisma db push

# TypeScript Type-Check
npm run build

# Linting
npm run lint
```

## Produktions-Deployment

### Vercel (Empfohlen)

```bash
# Vercel CLI installieren
npm i -g vercel

# Login
vercel login

# Projekt deployen
vercel

# Environment Variables setzen in Vercel Dashboard!
```

### Docker (Alternative)

```dockerfile
# Dockerfile erstellen und bauen
docker build -t sprachtrainer .
docker run -p 3000:3000 sprachtrainer
```

## Kosten-Übersicht

### Google Gemini API
- **Free Tier**: 60 requests/minute - völlig kostenlos!
- Gemini Pro: Aktuell kostenlos in Public Preview
- Perfekt für Development und kleine bis mittlere Apps
- Keine Kreditkarte erforderlich

### Hosting
- Vercel: Free Tier (Hobby) ausreichend
- Railway: $5/Monat für PostgreSQL
- Supabase: Free Tier (500MB DB) oder $25/Monat

**Gesamt-Kosten für Hobby-Projekt**: $0 - $5/Monat

## Support

Bei Problemen:
- Prüfe [README.md](README.md) für Details
- Öffne Issue auf GitHub
- Prüfe Logs in Terminal und Browser Console

## Nächste Schritte

Nach erfolgreichem Setup:

1. ✅ Teste alle Features (Registrierung, Login, Übungen)
2. ✅ Passe Tailwind-Farben an (tailwind.config.ts)
3. ✅ Füge eigene Topics hinzu (prisma/seed.ts)
4. ✅ Implementiere zusätzliche Sprachen
5. ✅ Erweitere Übungstypen
6. ✅ Füge Gamification hinzu (Achievements, Levels)

Viel Erfolg! 🎉
