import { Sparkles, ChevronRight, Clock, Mic, Award } from 'lucide-react';
import type { JournalEntry, UserGoal } from '../types';


interface HomePageProps {
  goal: UserGoal;
  latestEntry?: JournalEntry;
  onStartVoice: () => void;
  onNavigateToDirection: () => void;
  onNavigateToJournal: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  goal,
  latestEntry,
  onStartVoice,
  onNavigateToDirection,
  onNavigateToJournal,
}) => {
  const today = new Date();
  const dayName = today.toLocaleDateString('fr-FR', { weekday: 'long' });
  const capitalizedDayName = dayName.charAt(0).toUpperCase() + dayName.slice(1);
  const dayNumber = today.getDate();
  const monthName = today.toLocaleDateString('fr-FR', { month: 'short' });
  const capitalizedMonth = monthName.charAt(0).toUpperCase() + monthName.slice(1);

  // 24 segments for the visual progress bar
  const totalSegments = 24;
  const filledSegments = Math.round((goal.alignmentScore / 100) * totalSegments);

  return (
    <div className="space-y-4 pb-28 animate-fadeIn select-none">
      
      {/* 1. Carte principale verte (Exacte Image 1) */}
      <div className="bg-gradient-to-br from-[#D9F7BD] via-[#D3F5B4] to-[#C9F0A5] rounded-[32px] p-5 shadow-[0_10px_25px_rgba(180,230,140,0.25)] border border-[#C5EE9E] relative overflow-hidden transition-all duration-300">
        <div className="flex items-start justify-between gap-3">
          
          {/* Left: Date */}
          <div className="space-y-0.5 pt-1">
            <h1 className="text-3xl font-extrabold text-[#193B0E] tracking-tight m-0 p-0 leading-tight">
              {capitalizedMonth} {dayNumber}
            </h1>
            <p className="text-sm font-semibold text-[#3C6928]">
              {capitalizedDayName}
            </p>
          </div>

          {/* Right: Stacked White Mini Cards */}
          <div className="flex-1 max-w-[210px] space-y-2">
            
            {/* Mini Card 1 */}
            <div
              onClick={onStartVoice}
              className="bg-white/95 backdrop-blur-sm rounded-2xl p-2.5 shadow-[0_4px_12px_rgba(0,0,0,0.04)] border border-white flex items-center gap-2.5 cursor-pointer active:scale-95 transition-all hover:bg-white"
            >
              <span className="w-1 h-7 rounded-full bg-pink-500 shrink-0" />
              <div className="overflow-hidden">
                <p className="text-[11px] font-bold text-neutral-900 truncate leading-tight">
                  Récit de la journée
                </p>
                <p className="text-[10px] text-neutral-500 font-medium leading-tight mt-0.5">
                  21:00 – 21:10
                </p>
              </div>
            </div>

            {/* Mini Card 2 */}
            <div
              onClick={onNavigateToDirection}
              className="bg-white/95 backdrop-blur-sm rounded-2xl p-2.5 shadow-[0_4px_12px_rgba(0,0,0,0.04)] border border-white flex items-center gap-2.5 cursor-pointer active:scale-95 transition-all hover:bg-white"
            >
              <span className="w-1 h-7 rounded-full bg-emerald-500 shrink-0" />
              <div className="overflow-hidden">
                <p className="text-[11px] font-bold text-neutral-900 truncate leading-tight">
                  Cap du jour
                </p>
                <p className="text-[10px] text-neutral-500 font-medium leading-tight mt-0.5">
                  1 action essentielle
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* 2. Deux cartes côte à côte : Rose & Bleue */}
      <div className="grid grid-cols-2 gap-3.5">
        
        {/* Carte Rose: "Raconte ta journée" */}
        <div className="bg-gradient-to-br from-[#FEE7F2] via-[#FDE0EE] to-[#FCD4E7] rounded-[30px] p-4 shadow-[0_8px_20px_rgba(253,224,238,0.35)] border border-[#FBCFE4] flex flex-col justify-between h-[190px] relative overflow-hidden transition-all duration-300">
          {/* 3D Glossy Chat Bubbles graphic */}
          <div className="flex justify-center pt-1">
            <div className="relative w-16 h-12 flex items-center justify-center">
              <div className="w-12 h-9 rounded-2xl bg-gradient-to-br from-pink-400 to-rose-500 shadow-md opacity-90 backdrop-blur-sm transform -rotate-6 flex items-center justify-center text-white">
                <Sparkles size={16} />
              </div>
              <div className="absolute right-1 top-0 w-9 h-7 rounded-xl bg-gradient-to-br from-sky-400 to-blue-500 shadow-md opacity-90 backdrop-blur-sm transform rotate-12 flex items-center justify-center text-white">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
              </div>
            </div>
          </div>

          <div className="text-center space-y-2">
            <p className="text-sm font-bold text-neutral-900 leading-tight">
              Raconte ta journée !
            </p>
            <button
              onClick={onStartVoice}
              className="w-full py-2.5 bg-neutral-900 hover:bg-black text-white text-xs font-semibold rounded-full shadow-md active:scale-95 transition-all flex items-center justify-center gap-1.5"
            >
              <Mic size={13} className="text-pink-300" />
              <span>Commencer</span>
            </button>
          </div>
        </div>

        {/* Carte Bleue: "21:00 – Rappel du soir" */}
        <div
          onClick={onNavigateToDirection}
          className="bg-gradient-to-br from-[#E1F1FE] via-[#D8ECFE] to-[#CCE6FD] rounded-[30px] p-4 shadow-[0_8px_20px_rgba(204,230,253,0.35)] border border-[#BDE0FC] flex flex-col justify-between h-[190px] cursor-pointer active:scale-[0.98] transition-all duration-300"
        >
          <div className="space-y-0.5">
            <h2 className="text-2xl font-extrabold text-[#0D3866] tracking-tight m-0 p-0 leading-tight">
              {goal.dailyReminderTime || '21:00'}
            </h2>
            <p className="text-xs font-semibold text-[#2563EB]">
              Rappel du soir
            </p>
          </div>

          {/* Stylized circular progress clock */}
          <div className="flex justify-end items-end pb-1 pr-1">
            <div className="relative w-16 h-16 flex items-center justify-center">
              {/* Outer soft ring */}
              <div className="absolute inset-0 rounded-full border-4 border-blue-200/80" />
              {/* Progress dynamic ring */}
              <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
                <circle
                  cx="32"
                  cy="32"
                  r="26"
                  stroke="#3B82F6"
                  strokeWidth="5"
                  fill="transparent"
                  strokeDasharray={163.3}
                  strokeDashoffset={163.3 * (1 - 0.75)}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-blue-600">
                <Clock size={16} strokeWidth={2.2} />
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* 3. Grande carte blanche de progression personnelle */}
      <div className="bg-white rounded-[32px] p-5 shadow-[0_8px_25px_rgba(0,0,0,0.04)] border border-neutral-100/90 space-y-4">
        
        {/* Header card */}
        <div className="flex items-center justify-between">
          <span className="text-base font-bold text-neutral-900">
            Ta progression
          </span>
          <button
            onClick={onNavigateToDirection}
            className="flex items-center gap-1 text-xs font-semibold text-neutral-500 hover:text-neutral-900 bg-neutral-100/80 hover:bg-neutral-100 px-3 py-1.5 rounded-full transition-colors"
          >
            <span>Voir le cap</span>
            <ChevronRight size={13} />
          </button>
        </div>

        {/* Goal Title & Badge Row */}
        <div className="flex items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-pink-500" />
              <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                Cap actuel
              </p>
            </div>
            <h3 className="text-base font-bold text-neutral-900 tracking-tight leading-snug">
              {goal.mainDirection}
            </h3>
            <p className="text-xs text-neutral-500 font-medium">
              {goal.streakDays} jours suivis • {goal.alignmentScore}% de régularité
            </p>
          </div>

          {/* 3D Glass Badge */}
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-0.5 shadow-md shrink-0 flex items-center justify-center text-white">
            <div className="w-full h-full rounded-[14px] bg-white/20 backdrop-blur-xs flex items-center justify-center">
              <Award size={26} className="text-amber-200" />
            </div>
          </div>
        </div>

        {/* Segmented Pill Progress Bar */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-[11px] font-semibold text-neutral-500">
            <span>Régularité du cycle</span>
            <span className="text-neutral-900 font-bold">{goal.alignmentScore}%</span>
          </div>

          {/* Segments pill row */}
          <div className="flex items-center gap-[3px] bg-neutral-100/80 p-1.5 rounded-full">
            {Array.from({ length: totalSegments }, (_, i) => {
              const isFilled = i < filledSegments;
              return (
                <div
                  key={i}
                  className={`flex-1 h-3.5 rounded-full transition-all duration-300 ${
                    isFilled
                      ? 'bg-gradient-to-t from-blue-600 to-sky-400 shadow-[0_1px_3px_rgba(59,130,246,0.4)]'
                      : 'bg-neutral-200/70'
                  }`}
                />
              );
            })}
          </div>
        </div>

        {/* Habits Quick Pills */}
        <div className="grid grid-cols-3 gap-2 pt-1 border-t border-neutral-100">
          {goal.pillars.map((pillar) => (
            <div
              key={pillar.id}
              className="bg-neutral-50 rounded-2xl p-2.5 text-center border border-neutral-100 space-y-0.5"
            >
              <p className="text-[10px] font-medium text-neutral-500 truncate">
                {pillar.title.split('&')[0]}
              </p>
              <p className="text-xs font-bold text-neutral-900">
                {pillar.currentCount}/{pillar.targetCount}
              </p>
            </div>
          ))}
        </div>

      </div>

      {/* 4. Carte "Ce que l'analyse retient" */}
      <div className="bg-gradient-to-br from-neutral-50 to-neutral-100/70 rounded-[30px] p-5 shadow-[0_4px_15px_rgba(0,0,0,0.02)] border border-neutral-200/60 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center">
              <Sparkles size={13} />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-700">
              Ce que l'analyse retient
            </span>
          </div>
          <span className="text-[10px] bg-white text-neutral-500 px-2 py-0.5 rounded-full border border-neutral-200 font-medium">
            Démo locale
          </span>
        </div>

        <p className="text-xs text-neutral-800 italic leading-relaxed font-normal">
          {latestEntry?.directionAlignment
            ? `« ${latestEntry.directionAlignment} »`
            : "« Tes actions d'aujourd'hui construisent directement ta régularité créative. Continue à ancrer tes journées chaque soir. »"}
        </p>

        {latestEntry && (
          <button
            onClick={onNavigateToJournal}
            className="text-[11px] font-semibold text-neutral-600 hover:text-neutral-900 flex items-center gap-1"
          >
            <span>Voir le dernier récit du journal</span>
            <ChevronRight size={12} />
          </button>
        )}
      </div>

    </div>
  );
};
