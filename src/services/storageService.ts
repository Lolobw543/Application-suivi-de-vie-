import type { JournalEntry, UserGoal, MoodOption, DailyHabit, MoodEnergyLog } from '../types';

export const MOOD_OPTIONS: MoodOption[] = [
  { id: 'radiant', label: 'Rayonnant', emoji: '🌟', color: '#D97706', bgPastel: '#FEF3C7' },
  { id: 'serene', label: 'Serein', emoji: '😌', color: '#059669', bgPastel: '#D1FAE5' },
  { id: 'productive', label: 'Productif', emoji: '⚡', color: '#4F46E5', bgPastel: '#E0E7FF' },
  { id: 'tired', label: 'Fatigué', emoji: '😴', color: '#7C3AED', bgPastel: '#EDE9FE' },
  { id: 'thoughtful', label: 'Pensif', emoji: '🤔', color: '#0284C7', bgPastel: '#E0F2FE' },
];

const INITIAL_HABITS: DailyHabit[] = [
  {
    id: 'h1',
    title: 'Hydratation & réveil calme',
    category: 'health',
    timeOfDay: 'morning',
    completed: true,
    streak: 8,
    iconName: 'Droplets',
  },
  {
    id: 'h2',
    title: 'Session création / écriture (30m)',
    category: 'creation',
    timeOfDay: 'day',
    completed: true,
    streak: 12,
    iconName: 'Sparkles',
  },
  {
    id: 'h3',
    title: 'Marche & oxygénation',
    category: 'health',
    timeOfDay: 'day',
    completed: false,
    streak: 5,
    iconName: 'Footprints',
  },
  {
    id: 'h4',
    title: 'Veille & apprentissage technique',
    category: 'learning',
    timeOfDay: 'day',
    completed: false,
    streak: 9,
    iconName: 'BookOpen',
  },
  {
    id: 'h5',
    title: 'Récit du soir au micro à 21h',
    category: 'mindfulness',
    timeOfDay: 'evening',
    completed: false,
    streak: 12,
    iconName: 'Mic',
  },
];

const INITIAL_GOAL: UserGoal = {
  mainDirection: 'Construire une vie plus créative et régulière',
  statement: 'Développer mes projets créatifs avec constance tout en préservant un équilibre mental et physique sain.',
  activeSinceDays: 14,
  alignmentScore: 88,
  streakDays: 12,
  dailyReminderTime: '21:00',
  reminderEnabled: true,
  pillars: [
    {
      id: 'p1',
      title: 'Créativité & Projets',
      category: 'Design, Vidéo & Écriture',
      description: 'Pratiquer 4 sessions de création libre par semaine',
      progressPercent: 85,
      color: '#EC4899', // rose pastel vibrant
      iconName: 'Palette',
      targetCount: 5,
      currentCount: 4,
      unit: 'sessions / sem.',
    },
    {
      id: 'p2',
      title: 'Santé & Énergie',
      category: 'Sport, Marche & Sommeil',
      description: 'Bouger 45 min chaque jour et dormir 8h',
      progressPercent: 78,
      color: '#10B981', // vert émeraude
      iconName: 'Activity',
      targetCount: 7,
      currentCount: 5,
      unit: 'jours / sem.',
    },
    {
      id: 'p3',
      title: 'Équilibre & Sérénité',
      category: 'Déconnexion & Moments précieux',
      description: 'Déconnecter des écrans après le bilan de 21h',
      progressPercent: 90,
      color: '#3B82F6', // bleu azur
      iconName: 'Sun',
      targetCount: 7,
      currentCount: 6,
      unit: 'soirs / sem.',
    },
    {
      id: 'p4',
      title: 'Apprentissage Continu',
      category: 'Outils & Compétences',
      description: 'Maîtriser de nouveaux logiciels (DaVinci, IA, code)',
      progressPercent: 92,
      color: '#8B5CF6', // violet
      iconName: 'BookOpen',
      targetCount: 15,
      currentCount: 14,
      unit: 'jours de pratique',
    },
  ],
};

const INITIAL_ENTRIES: JournalEntry[] = [
  {
    id: 'entry-yesterday',
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    time: '21:05',
    rawTranscript: "J'ai tondu la pelouse, regardé une vidéo sur la composition graphique et appris DaVinci Resolve pendant une heure.",
    summary: "Tu as pris soin de ton cadre de vie et investi un temps précieux dans l'apprentissage de DaVinci Resolve et des fondamentaux du design. Un équilibre parfait entre concret et créativité.",
    activities: ['Entretien maison', 'Formation DaVinci Resolve', 'Veille graphique'],
    learnings: 'Principes de découpage et raccourcis de montage vidéo.',
    tags: ['Créativité', 'Maison', 'Apprentissage'],
    mood: 'productive',
    directionAlignment: 'Ton apprentissage créatif avance dans la bonne direction. Chaque minute investie consolide ton cap.',
    audioDurationSeconds: 46,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'entry-2days-ago',
    date: new Date(Date.now() - 172800000).toISOString().split('T')[0],
    time: '21:12',
    rawTranscript: "Bonne séance de sport ce matin, avancement sur le projet d'équipe, et soirée lecture au calme sans notification.",
    summary: "Une journée complète rythmée par l'énergie du sport, l'efficacité professionnelle et une douce transition vers le repos du soir.",
    activities: ['Séance de sport', 'Projets pros', 'Lecture du soir'],
    learnings: 'Mise en place de blocs de concentration sans interruption.',
    tags: ['Sport', 'Travail', 'Sérénité'],
    mood: 'serene',
    directionAlignment: 'Ce respect de tes temps de déconnexion préserve ta clarté mentale pour tes projets de fond.',
    audioDurationSeconds: 38,
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: 'entry-3days-ago',
    date: new Date(Date.now() - 259200000).toISOString().split('T')[0],
    time: '20:58',
    rawTranscript: "J'ai finalisé la structure de mon portfolio, échangé avec un ami sur nos projets respectifs et marché en forêt.",
    summary: "Une journée inspirante où la créativité a rencontré la nature et les connexions authentiques. Tu as ancré un jalon clé pour ton portfolio.",
    activities: ['Portfolio', 'Marche en forêt', 'Échange créatif'],
    learnings: 'Simplifier la présentation pour mettre en valeur les récits de projets.',
    tags: ['Créativité', 'Nature', 'Inspiration'],
    mood: 'radiant',
    directionAlignment: 'Partager tes réflexions et nourrir ton regard te permet de garder une dynamique vibrante.',
    audioDurationSeconds: 52,
    createdAt: new Date(Date.now() - 259200000).toISOString(),
  }
];

const STORAGE_KEYS = {
  ENTRIES: 'fil_journal_entries_v2',
  GOAL: 'fil_user_goal_v2',
  HABITS: 'fil_habits_v2',
  MOOD_TODAY: 'fil_mood_today_v2',
  NOTIFICATION_GRANTED: 'fil_notification_granted_v2',
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
    const updated = [entry, ...entries.filter((e) => e.id !== entry.id)];
    localStorage.setItem(STORAGE_KEYS.ENTRIES, JSON.stringify(updated));

    // Also mark evening habit as completed
    const habits = this.getHabits();
    const eveningHabit = habits.find((h) => h.timeOfDay === 'evening');
    if (eveningHabit) {
      eveningHabit.completed = true;
      eveningHabit.streak += 1;
      this.saveHabits(habits);
    }

    // Update streak and alignment
    const goal = this.getGoal();
    goal.streakDays = (goal.streakDays || 12) + 1;
    goal.alignmentScore = Math.min(100, Math.round((goal.alignmentScore || 85) * 0.95 + 5));
    this.saveGoal(goal);

    return updated;
  },

  deleteEntry(id: string): JournalEntry[] {
    const entries = this.getEntries();
    const updated = entries.filter((e) => e.id !== id);
    localStorage.setItem(STORAGE_KEYS.ENTRIES, JSON.stringify(updated));
    return updated;
  },

  getHabits(): DailyHabit[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.HABITS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(INITIAL_HABITS));
        return INITIAL_HABITS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_HABITS;
    }
  },

  saveHabits(habits: DailyHabit[]): void {
    localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(habits));
  },

  toggleHabit(id: string): DailyHabit[] {
    const habits = this.getHabits();
    const updated = habits.map((h) => {
      if (h.id === id) {
        const nextState = !h.completed;
        return {
          ...h,
          completed: nextState,
          streak: nextState ? h.streak + 1 : Math.max(0, h.streak - 1),
        };
      }
      return h;
    });
    this.saveHabits(updated);
    return updated;
  },

  getDailyMood(): MoodEnergyLog {
    try {
      const today = new Date().toISOString().split('T')[0];
      const data = localStorage.getItem(`${STORAGE_KEYS.MOOD_TODAY}_${today}`);
      if (data) {
        return JSON.parse(data);
      }
      return {
        date: today,
        mood: 'serene',
        energyLevel: 4,
      };
    } catch {
      return {
        date: new Date().toISOString().split('T')[0],
        mood: 'serene',
        energyLevel: 4,
      };
    }
  },

  saveDailyMood(log: MoodEnergyLog): void {
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem(`${STORAGE_KEYS.MOOD_TODAY}_${today}`, JSON.stringify(log));
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
  },
};
