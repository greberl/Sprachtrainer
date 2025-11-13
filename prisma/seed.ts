import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Deutsche Topics
  const deTopic1 = await prisma.topic.create({
    data: {
      name: 'Perfekt (Present Perfect)',
      language: 'de',
      category: 'grammar',
      difficulty: 3,
      description: 'Bildung und Verwendung des Perfekts',
      rules: {
        create: [
          {
            title: 'Perfekt-Bildung',
            content: 'Das Perfekt wird mit haben/sein + Partizip II gebildet. Meistens verwendet man "haben", aber bei Bewegungsverben und Zustandsänderungen nimmt man "sein".',
            examples: [
              'Ich habe gegessen. (haben + Partizip)',
              'Ich bin gelaufen. (sein + Partizip bei Bewegung)',
              'Er ist geworden. (sein + Zustandsänderung)',
            ],
            mnemonics: [
              'HABENSEIN: Haben ist Standard, Sein für Bewegung und Änderung',
              'Merke: "sein" bei gehen, kommen, bleiben, werden, sein',
            ],
            tips: [
              'Lerne die wichtigsten sein-Verben auswendig',
              'Übe regelmäßige und unregelmäßige Partizipien getrennt',
              'Achte auf die Verbstellung: Partizip am Satzende',
            ],
            language: 'de',
          },
        ],
      },
    },
  })

  const deTopic2 = await prisma.topic.create({
    data: {
      name: 'Dativ und Akkusativ',
      language: 'de',
      category: 'grammar',
      difficulty: 4,
      description: 'Unterscheidung und richtige Verwendung der Fälle',
      rules: {
        create: [
          {
            title: 'Dativ vs. Akkusativ',
            content: 'Dativ antwortet auf "wem?", Akkusativ auf "wen oder was?". Bei Wechselpräpositionen: Wohin? → Akkusativ, Wo? → Dativ.',
            examples: [
              'Ich gebe dem Mann das Buch. (wem? → Dativ)',
              'Ich sehe den Mann. (wen? → Akkusativ)',
              'Ich gehe in die Stadt. (wohin? → Akkusativ)',
              'Ich bin in der Stadt. (wo? → Dativ)',
            ],
            mnemonics: [
              'Wohin bewegt sich = Akkusativ, Wo bleibt es = Dativ',
              'Der die das → den die das (Akkusativ maskulin ändert sich!)',
            ],
            tips: [
              'Lerne Wechselpräpositionen: an, auf, hinter, in, neben, über, unter, vor, zwischen',
              'Übe mit Bewegungs- und Positionsverben',
              'Merke: nach, mit, von, zu, bei → immer Dativ',
            ],
            language: 'de',
          },
        ],
      },
    },
  })

  // Englische Topics
  const enTopic1 = await prisma.topic.create({
    data: {
      name: 'Present Perfect vs. Simple Past',
      language: 'en',
      category: 'grammar',
      difficulty: 3,
      description: 'Unterscheidung zwischen Present Perfect und Simple Past',
      rules: {
        create: [
          {
            title: 'Present Perfect vs. Simple Past',
            content: 'Present Perfect (have/has + past participle) für Handlungen mit Bezug zur Gegenwart. Simple Past für abgeschlossene Handlungen in der Vergangenheit.',
            examples: [
              'I have lived here for 5 years. (still living here)',
              'I lived there for 5 years. (not anymore)',
              'Have you ever been to Paris? (life experience)',
              'Did you go to Paris last year? (specific time)',
            ],
            mnemonics: [
              'Present Perfect = Past + Present connection',
              'Simple Past = finished, no connection to now',
            ],
            tips: [
              'Zeitangaben wie "yesterday", "last week" → Simple Past',
              'Zeitangaben wie "ever", "never", "already", "yet" → Present Perfect',
              'Achte auf Signal-Wörter!',
            ],
            language: 'en',
          },
        ],
      },
    },
  })

  const enTopic2 = await prisma.topic.create({
    data: {
      name: 'Conditional Sentences (If-Clauses)',
      language: 'en',
      category: 'grammar',
      difficulty: 4,
      description: 'Die drei Typen von Konditionalsätzen',
      rules: {
        create: [
          {
            title: 'If-Clauses Types',
            content: 'Type 1 (real): If + present, will + infinitive. Type 2 (unreal): If + past, would + infinitive. Type 3 (impossible): If + past perfect, would have + past participle.',
            examples: [
              'If it rains, I will stay home. (Type 1 - wahrscheinlich)',
              'If I won the lottery, I would buy a house. (Type 2 - unwahrscheinlich)',
              'If I had studied, I would have passed. (Type 3 - unmöglich, Vergangenheit)',
            ],
            mnemonics: [
              'Type 1: Real = Present + Will',
              'Type 2: Unreal = Past + Would',
              'Type 3: Impossible = Past Perfect + Would Have',
            ],
            tips: [
              'Type 1: realistisch, wahrscheinlich',
              'Type 2: theoretisch, hypothetisch',
              'Type 3: nachträglich, Vergangenheit',
              'Komma nach if-Clause, wenn sie am Anfang steht',
            ],
            language: 'en',
          },
        ],
      },
    },
  })

  // Spanische Topics
  const esTopic1 = await prisma.topic.create({
    data: {
      name: 'Pretérito Indefinido vs. Imperfecto',
      language: 'es',
      category: 'grammar',
      difficulty: 4,
      description: 'Unterscheidung der spanischen Vergangenheitsformen',
      rules: {
        create: [
          {
            title: 'Indefinido vs. Imperfecto',
            content: 'Indefinido für abgeschlossene, einmalige Handlungen. Imperfecto für wiederholte, andauernde Handlungen oder Beschreibungen.',
            examples: [
              'Ayer comí pizza. (einmalig, gestern)',
              'Cuando era niño, comía pizza todos los días. (wiederholte Handlung)',
              'Eran las tres. (Beschreibung)',
            ],
            mnemonics: [
              'Indefinido = Einmal = Punkt in der Zeit',
              'Imperfecto = Immer wieder = Zeitraum',
            ],
            tips: [
              'Signal: ayer, una vez → Indefinido',
              'Signal: siempre, todos los días → Imperfecto',
              'Imperfecto für Hintergrund, Indefinido für Handlung',
            ],
            language: 'es',
          },
        ],
      },
    },
  })

  // Französische Topics
  const frTopic1 = await prisma.topic.create({
    data: {
      name: 'Passé Composé vs. Imparfait',
      language: 'fr',
      category: 'grammar',
      difficulty: 4,
      description: 'Die französischen Vergangenheitsformen',
      rules: {
        create: [
          {
            title: 'Passé Composé vs. Imparfait',
            content: 'Passé Composé (avoir/être + participe passé) für abgeschlossene Handlungen. Imparfait für Gewohnheiten, Beschreibungen und andauernde Handlungen.',
            examples: [
              "J'ai mangé une pomme. (einmalig, fertig)",
              'Je mangeais une pomme quand il est arrivé. (im Verlauf)',
              "Quand j'étais petit, je jouais au football. (Gewohnheit)",
            ],
            mnemonics: [
              'Passé Composé = Completed = Fertig',
              'Imparfait = Imperfect = Nicht abgeschlossen',
            ],
            tips: [
              'Imparfait: Hintergrund, Beschreibung, Gewohnheit',
              'Passé Composé: Haupthandlung, einmalig',
              'Être-Verben: Bewegung und Zustandsänderung',
            ],
            language: 'fr',
          },
        ],
      },
    },
  })

  // Russische Topics
  const ruTopic1 = await prisma.topic.create({
    data: {
      name: 'Aspekt: Vollendete und unvollendete Verben',
      language: 'ru',
      category: 'grammar',
      difficulty: 5,
      description: 'Der russische Verbalaspekt',
      rules: {
        create: [
          {
            title: 'Perfektiv vs. Imperfektiv',
            content: 'Perfektive Verben (совершенный вид) drücken abgeschlossene Handlungen aus. Imperfektive Verben (несовершенный вид) drücken andauernde oder wiederholte Handlungen aus.',
            examples: [
              'Я читал книгу. (imperfektiv - ich las, Prozess)',
              'Я прочитал книгу. (perfektiv - ich habe zu Ende gelesen)',
              'Он писал письмо. (imperfektiv - er schrieb)',
              'Он написал письмо. (perfektiv - er hat fertig geschrieben)',
            ],
            mnemonics: [
              'Perfektiv = Punkt, Resultat',
              'Imperfektiv = Prozess, Wiederholung',
            ],
            tips: [
              'Meist durch Präfixe unterschieden: делать → сделать',
              'Imperfektiv für Fragen mit "wie lange?"',
              'Perfektiv für Resultate und einmalige Handlungen',
            ],
            language: 'ru',
          },
        ],
      },
    },
  })

  // Italienische Topics
  const itTopic1 = await prisma.topic.create({
    data: {
      name: 'Passato Prossimo vs. Imperfetto',
      language: 'it',
      category: 'grammar',
      difficulty: 4,
      description: 'Italienische Vergangenheitsformen',
      rules: {
        create: [
          {
            title: 'Passato Prossimo vs. Imperfetto',
            content: 'Passato Prossimo (avere/essere + participio) für abgeschlossene Handlungen. Imperfetto für Gewohnheiten, Beschreibungen, parallele Handlungen.',
            examples: [
              'Ho mangiato la pizza. (ich habe gegessen - fertig)',
              'Mangiavo la pizza quando è arrivato. (ich aß - im Verlauf)',
              'Da bambino, giocavo a calcio. (als Kind spielte ich - Gewohnheit)',
            ],
            mnemonics: [
              'Passato Prossimo = Punkt in der Zeit',
              'Imperfetto = Zeitraum, Hintergrund',
            ],
            tips: [
              'Essere-Verben: Bewegung und Reflexivverben',
              'Imperfetto: Wetter, Alter, Zeit in der Vergangenheit',
              'Kombination: Hintergrund (Imperfetto) + Handlung (Passato Prossimo)',
            ],
            language: 'it',
          },
        ],
      },
    },
  })

  // Vokabular-Topics
  await prisma.topic.create({
    data: {
      name: 'Alltagsvokabular',
      language: 'de',
      category: 'vocabulary',
      difficulty: 2,
      description: 'Häufig verwendete deutsche Wörter und Phrasen',
    },
  })

  await prisma.topic.create({
    data: {
      name: 'Business English',
      language: 'en',
      category: 'vocabulary',
      difficulty: 3,
      description: 'Vokabular für geschäftliche Kommunikation',
    },
  })

  await prisma.topic.create({
    data: {
      name: 'Phrasal Verbs',
      language: 'en',
      category: 'vocabulary',
      difficulty: 4,
      description: 'Mehrteilige Verben im Englischen',
    },
  })

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
