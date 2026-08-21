import type { JournalEntry, UserGoal, MoodOption } from '../types';


export const MOOD_OPTIONS: MoodOption[] = [
  { id: 'radiant', label: 'Rayonnant', emoji: '🌟', color: '#F59E0B' },
  { id: 'serene', label: 'Serein', emoji: '😌', color: '#10B981' },
  { id: 'productive', label: 'Productif', emoji: '⚡', color: '#6366F1' },
  { id: 'tired', label: 'Fatigué', emoji: '😴', color: '#8B5CF6' },
  { id: 'thoughtful', label: 'Pensif', emoji: '🤔', color: '#0EA5E9' },
];

const INITIAL_GOAL: UserGoal = {
  mainDirection: 'Construire une vie plus créative',
  statement: 'Devenir plus créatif et plus régulier dans mes projets personnels et mon équilibre.',
  activeSinceDays: 12,
  alignmentScore: 87,
  streakDays: 12,
  dailyReminderTime: '21:00',
  reminderEnabled: true,
  pillars: [
    {
      id: 'p1',
      title: 'Créativité & Projets',
      description: 'Pratiquer le design, la vidéo et l’écriture chaque semaine',
      progressPercent: 82,
      color: '#EC4899', // rose
      iconName: 'Palette',
      targetCount: 5,
      currentCount: 4,
      unit: 'sessions / sem.',
    },
    {
      id: 'p2',
      title: 'Équilibre & Sérénité',
      description: 'Déconnexion après 21h et sommeil réparateur',
      progressPercent: 75,
      color: '#3B82F6', // bleu
      iconName: 'Sun',
      targetCount: 7,
      currentCount: 5,
      unit: 'soirs / sem.',
    },
    {
      id: 'p3',
      title: 'Apprentissage continu',
      description: 'Découvrir de nouveaux outils (DaVinci, code, audio)',
      progressPercent: 90,
      color: '#10B981', // vert
      iconName: 'BookOpen',
      targetCount: 15,
      currentCount: 14,
      unit: 'jours suivis',
    },
  ],
};

const INITIAL_ENTRIES: JournalEntry[] = [
  {
    id: 'entry-yesterday',
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    time: '21:05',
    rawTranscript: "J'ai avancé sur mon portfolio de design, fait 30 minutes de marche rapide en fin de journée et lu deux chapitres sur la colorimétrie.",
    summary: "Tu as dédié une belle énergie à la création de ton portfolio et enrichi ton œil graphique par la lecture, tout en préservant ton bien-être avec une marche en plein air.",
    activities: ['Design Portfolio', 'Marche rapide', 'Lecture colorimétrie'],
    learnings: 'Principes de contraste et harmonie des teintes pastel.',
    tags: ['Créativité', 'Sport', 'Apprentissage'],
    mood: 'productive',
    directionAlignment: 'Ton rythme de création reste solide et en parfaite synergie avec ton objectif.',
    audioDurationSeconds: 42,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'entry-2days-ago',
    date: new Date(Date.now() - 172800000).toISOString().split('T')[0],
    time: '21:12',
    rawTranscript: "Grosse journée de travail en équipe, puis j'ai rangé mon atelier et préparé le planning de la semaine prochaine.",
    summary: "Une journée cadrée et organisée : tu as structuré ton espace physique et clarifié tes priorités pour aborder la suite avec sérénité.",
    activities: ['Travail collectif', 'Rangement atelier', 'Organisation hebdo'],
    learnings: 'Priorisation par blocs de temps de 45 minutes.',
    tags: ['Travail', 'Maison', 'Organisation'],
    mood: 'serene',
    directionAlignment: 'La clarté de ton espace soutient directement ta future créativité.',
    audioDurationSeconds: 38,
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  }
];

const STORAGE_KEYS = {
  ENTRIES: 'fil_journal_entries_v1',
  GOAL: 'fil_user_goal_v1',
  NOTIFICATION_GRANTED: 'fil_notification_granted_v1',
};

export const storageService = {
  getEntries(): JournalEntry[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ENTRIES);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.ENTRIES, JSON.stringify(INITIAL_ENTRIES));
        return INITIAL_ENTRIES;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_ENTRIES;
    }
  },

  saveEntry(entry: JournalEntry): JournalEntry[] {
    const entries = this.getEntries();
    // Prepend new entry
    const updated = [entry, ...entries.filter(e => e.id !== entry.id)];
    localStorage.setItem(STORAGE_KEYS.ENTRIES, JSON.stringify(updated));

    // Update streak and alignment in goal
    const goal = this.getGoal();
    goal.streakDays = (goal.streakDays || 12) + 1;
    goal.alignmentScore = Math.min(100, Math.round((goal.alignmentScore || 85) * 0.9 + 10));
    this.saveGoal(goal);

    return updated;
  },

  deleteEntry(id: string): JournalEntry[] {
    const entries = this.getEntries();
    const updated = entries.filter(e => e.id !== id);
    localStorage.setItem(STORAGE_KEYS.ENTRIES, JSON.stringify(updated));
    return updated;
  },

  getGoal(): UserGoal {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.GOAL);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.GOAL, JSON.stringify(INITIAL_GOAL));
        return INITIAL_GOAL;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_GOAL;
    }
  },

  saveGoal(goal: UserGoal): void {
    localStorage.setItem(STORAGE_KEYS.GOAL, JSON.stringify(goal));
  },

  isNotificationGranted(): boolean {
    return localStorage.getItem(STORAGE_KEYS.NOTIFICATION_GRANTED) === 'true';
  },

  setNotificationGranted(granted: boolean): void {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATION_GRANTED, granted ? 'true' : 'false');
  }
};
