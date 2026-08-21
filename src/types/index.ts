export type MoodType = 'radiant' | 'serene' | 'productive' | 'tired' | 'thoughtful';

export interface MoodOption {
  id: MoodType;
  label: string;
  emoji: string;
  color: string;
  bgPastel: string;
}

export interface DailyHabit {
  id: string;
  title: string;
  category: 'health' | 'creation' | 'learning' | 'mindfulness';
  timeOfDay: 'morning' | 'day' | 'evening';
  completed: boolean;
  streak: number;
  iconName: string;
}

export interface MoodEnergyLog {
  date: string; // YYYY-MM-DD
  mood: MoodType;
  energyLevel: number; // 1 to 5
}

export interface JournalEntry {
  id: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  rawTranscript: string;
  summary: string;
  activities: string[];
  learnings?: string;
  tags: string[];
  mood: MoodType;
  directionAlignment: string;
  audioDurationSeconds?: number;
  createdAt: string;
}

export interface LifePillar {
  id: string;
  title: string;
  category: string;
  description: string;
  progressPercent: number; // 0-100
  color: string;
  iconName: string;
  targetCount: number;
  currentCount: number;
  unit: string;
}

export interface UserGoal {
  mainDirection: string;
  statement: string;
  activeSinceDays: number;
  alignmentScore: number;
  streakDays: number;
  dailyReminderTime: string; // "21:00"
  reminderEnabled: boolean;
  pillars: LifePillar[];
}

export type TabType = 'home' | 'journal' | 'direction';
