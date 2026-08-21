import { useState } from 'react';
import { Check, Droplets, Sparkles, Footprints, BookOpen, Mic, Flame } from 'lucide-react';
import type { DailyHabit } from '../types';

interface DailyHabitsCardProps {
  habits: DailyHabit[];
  onToggleHabit: (id: string) => void;
  onAddHabit?: (title: string, category: DailyHabit['category'], timeOfDay: DailyHabit['timeOfDay']) => void;
}

export const DailyHabitsCard: React.FC<DailyHabitsCardProps> = ({
  habits,
  onToggleHabit,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'morning' | 'day' | 'evening'>('all');

  const completedCount = habits.filter((h) => h.completed).length;
  const totalCount = habits.length;
  const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const filteredHabits = selectedFilter === 'all'
    ? habits
    : habits.filter((h) => h.timeOfDay === selectedFilter);

  const getHabitIcon = (iconName: string) => {

    switch (iconName) {
      case 'Droplets':
        return <Droplets size={16} className="text-cyan-500" />;
      case 'Sparkles':
        return <Sparkles size={16} className="text-pink-500" />;
      case 'Footprints':
        return <Footprints size={16} className="text-emerald-500" />;
      case 'BookOpen':
        return <BookOpen size={16} className="text-indigo-500" />;
      case 'Mic':
      default:
        return <Mic size={16} className="text-rose-500" />;
    }
  };

  // SVG Ring Calculation
  const radius = 24;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (completionPercentage / 100) * circumference;

  return (
    <div className="bg-white rounded-[32px] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-neutral-100/90 space-y-4 transition-all">
      
      {/* Header with Ring & Stats */}
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
              Rituels & Habitudes
            </span>
          </div>
          <h3 className="text-base font-bold text-neutral-900 tracking-tight">
            {completedCount} sur {totalCount} complétés aujourd'hui
          </h3>
        </div>

        {/* Circular Progress Ring */}
        <div className="relative w-14 h-14 flex items-center justify-center shrink-0">
          <svg className="w-14 h-14 transform -rotate-90" viewBox="0 0 60 60">
            {/* Background track */}
            <circle
              cx="30"
              cy="30"
              r={radius}
              stroke="#F3F4F6"
              strokeWidth="5"
              fill="transparent"
            />
            {/* Animated progress ring */}
            <circle
              cx="30"
              cy="30"
              r={radius}
              stroke="url(#habitGrad)"
              strokeWidth="5"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-500 ease-out"
            />
            <defs>
              <linearGradient id="habitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#10B981" />
                <stop offset="100%" stop-color="#3B82F6" />
              </linearGradient>
            </defs>
          </svg>

          <span className="absolute text-xs font-extrabold text-neutral-900">
            {completionPercentage}%
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 bg-neutral-100/70 p-1 rounded-2xl">
        {(
          [
            { id: 'all', label: 'Toutes' },
            { id: 'morning', label: 'Matin' },
            { id: 'day', label: 'Journée' },
            { id: 'evening', label: 'Soir (21h)' },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedFilter(tab.id)}
            className={`flex-1 py-1.5 text-[11px] font-semibold rounded-xl transition-all ${
              selectedFilter === tab.id
                ? 'bg-white text-neutral-900 shadow-2xs'
                : 'text-neutral-500 hover:text-neutral-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Habits List */}
      <div className="space-y-2 pt-0.5">
        {filteredHabits.map((habit) => {
          return (
            <div
              key={habit.id}
              onClick={() => onToggleHabit(habit.id)}
              className={`p-3 rounded-2xl flex items-center justify-between gap-3 cursor-pointer transition-all duration-200 border ${
                habit.completed
                  ? 'bg-[#F0FDF4] border-[#DCFCE7] text-neutral-900'
                  : 'bg-neutral-50/80 hover:bg-neutral-100/70 border-neutral-100 text-neutral-700'
              } active:scale-[0.98]`}
            >
              <div className="flex items-center gap-3 overflow-hidden">
                {/* Checkbox button */}
                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center transition-all ${
                    habit.completed
                      ? 'bg-emerald-500 text-white shadow-sm scale-105'
                      : 'bg-white border-2 border-neutral-300 text-transparent'
                  }`}
                >
                  <Check size={15} strokeWidth={3} />
                </div>

                <div className="truncate">
                  <p
                    className={`text-xs font-semibold truncate leading-tight ${
                      habit.completed ? 'line-through text-neutral-400' : 'text-neutral-800'
                    }`}
                  >
                    {habit.title}
                  </p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    {getHabitIcon(habit.iconName)}
                    <span className="text-[10px] text-neutral-400 capitalize">

                      {habit.timeOfDay === 'morning' ? 'Matin' : habit.timeOfDay === 'day' ? 'Journée' : 'Soir 21h'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Streak Badge */}
              <div className="flex items-center gap-1 px-2 py-0.5 bg-white rounded-full text-[10px] font-bold text-amber-600 border border-neutral-200/60 shrink-0">
                <Flame size={12} className="text-amber-500 fill-amber-500" />
                <span>{habit.streak}j</span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
