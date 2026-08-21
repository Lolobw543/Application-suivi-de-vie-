import { Smile, Zap } from 'lucide-react';

import { MOOD_OPTIONS } from '../services/storageService';
import type { MoodType, MoodEnergyLog } from '../types';

interface MoodEnergyCardProps {
  currentLog: MoodEnergyLog;
  onUpdateLog: (updated: MoodEnergyLog) => void;
}

export const MoodEnergyCard: React.FC<MoodEnergyCardProps> = ({
  currentLog,
  onUpdateLog,
}) => {
  const handleMoodSelect = (mood: MoodType) => {
    onUpdateLog({
      ...currentLog,
      mood,
    });
  };

  const handleEnergySelect = (level: number) => {
    onUpdateLog({
      ...currentLog,
      energyLevel: level,
    });
  };

  return (
    <div className="bg-white rounded-[32px] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-neutral-100/90 space-y-4">
      
      {/* Mood Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
              État d'esprit & Énergie
            </span>
          </div>
          <h3 className="text-base font-bold text-neutral-900 tracking-tight">
            Comment te sens-tu aujourd'hui ?
          </h3>
        </div>

        <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
          <Smile size={18} />
        </div>
      </div>

      {/* Mood Selector Row */}
      <div className="grid grid-cols-5 gap-1.5">
        {MOOD_OPTIONS.map((item) => {
          const isSelected = currentLog.mood === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleMoodSelect(item.id)}
              className={`p-2 rounded-2xl flex flex-col items-center gap-1 transition-all duration-200 ${
                isSelected
                  ? 'bg-neutral-900 text-white shadow-md scale-105'
                  : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-700 border border-neutral-100'
              } active:scale-95`}
            >
              <span className="text-xl">{item.emoji}</span>
              <span className="text-[10px] font-semibold truncate w-full text-center">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Energy Level Bar */}
      <div className="pt-2 border-t border-neutral-100 space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold text-neutral-600">
          <span className="flex items-center gap-1.5">
            <Zap size={14} className="text-amber-500" />
            Niveau d'énergie vitale :
          </span>
          <span className="text-neutral-900 font-bold">
            {currentLog.energyLevel * 20}%
          </span>
        </div>

        <div className="grid grid-cols-5 gap-1.5">
          {[1, 2, 3, 4, 5].map((lvl) => {
            const isFilled = lvl <= currentLog.energyLevel;
            return (
              <button
                key={lvl}
                onClick={() => handleEnergySelect(lvl)}
                className={`h-7 rounded-xl transition-all duration-200 flex items-center justify-center font-bold text-[11px] ${
                  isFilled
                    ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-2xs'
                    : 'bg-neutral-100 text-neutral-400 hover:bg-neutral-200'
                }`}
              >
                {lvl}
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
};
