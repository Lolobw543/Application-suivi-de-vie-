export type MoodType = 'radiant' | 'serene' | 'productive' | 'tired' | 'thoughtful';

export interface MoodOption {
  id: MoodType;
  label: string;
  emoji: string;
  color: string;
}

export interface JournalEntry {
  id: string;
  date: string; // ISO date string (YYYY-MM-DD)
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
