import { useState } from 'react';
import { Mic, Trash2, ChevronDown, ChevronUp, Compass } from 'lucide-react';
import type { JournalEntry } from '../types';

import { MOOD_OPTIONS } from '../services/storageService';

interface JournalPageProps {
  entries: JournalEntry[];
  onStartVoice: () => void;
  onDeleteEntry: (id: string) => void;
}

export const JournalPage: React.FC<JournalPageProps> = ({
  entries,
  onStartVoice,
  onDeleteEntry,
}) => {
  const [selectedTag, setSelectedTag] = useState<string>('Tous');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Extract all unique tags
  const allTags = ['Tous', ...Array.from(new Set(entries.flatMap((e) => e.tags)))];

  const filteredEntries = selectedTag === 'Tous'
    ? entries
    : entries.filter((e) => e.tags.includes(selectedTag));

  const getMoodData = (moodId: string) => {
    return MOOD_OPTIONS.find((m) => m.id === moodId) || MOOD_OPTIONS[1];
  };

  return (
    <div className="space-y-4 pb-28 animate-fadeIn select-none">
      
      {/* Title section */}
      <div className="flex items-center justify-between px-1">
        <div>
          <h1 className="text-2xl font-extrabold text-neutral-900 tracking-tight m-0">
            Journal de bord
          </h1>
          <p className="text-xs text-neutral-500 font-medium">
            {entries.length} récit{entries.length > 1 ? 's' : ''} enregistré{entries.length > 1 ? 's' : ''}
          </p>
        </div>

        <button
          onClick={onStartVoice}
          className="px-3.5 py-2 bg-neutral-900 hover:bg-black text-white text-xs font-semibold rounded-full shadow-sm flex items-center gap-1.5 active:scale-95 transition-all"
        >
          <Mic size={13} className="text-pink-300" />
          <span>Nouveau récit</span>
        </button>
      </div>

      {/* Tags Filter Strip */}
      {allTags.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto py-1 px-0.5 no-scrollbar">
          {allTags.map((tag) => {
            const isSelected = selectedTag === tag;
            return (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-neutral-900 text-white shadow-sm'
                    : 'bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200/80'
                }`}
              >
                {tag === 'Tous' ? 'Tout voir' : `#${tag}`}
              </button>
            );
          })}
        </div>
      )}

      {/* Entries List */}
      {filteredEntries.length === 0 ? (
        <div className="bg-white rounded-[32px] p-8 text-center border border-neutral-100 shadow-sm space-y-4 my-6">
          <div className="w-16 h-16 rounded-full bg-pink-50 text-pink-500 mx-auto flex items-center justify-center">
            <Mic size={28} />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-neutral-900">
              Aucun récit pour l'instant
            </h3>
            <p className="text-xs text-neutral-500 max-w-[260px] mx-auto leading-relaxed">
              Prends deux minutes ce soir pour raconter ta journée. L'application résumera tes réussites.
            </p>
          </div>
          <button
            onClick={onStartVoice}
            className="py-3 px-6 bg-neutral-900 hover:bg-black text-white text-xs font-semibold rounded-full shadow-md active:scale-95 transition-all inline-flex items-center gap-2"
          >
            <Mic size={14} className="text-pink-300" />
            <span>Enregistrer mon premier récit</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3.5">
          {filteredEntries.map((entry) => {
            const mood = getMoodData(entry.mood);
            const isExpanded = expandedId === entry.id;
            const entryDate = new Date(entry.date);
            const formattedDate = entryDate.toLocaleDateString('fr-FR', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
            });
            const capitalizedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

            return (
              <div
                key={entry.id}
                className="bg-white rounded-[28px] p-5 shadow-[0_4px_16px_rgba(0,0,0,0.03)] border border-neutral-100/90 space-y-3 transition-all hover:shadow-[0_6px_20px_rgba(0,0,0,0.05)]"
              >
                {/* Entry Top info */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg" title={mood.label}>
                      {mood.emoji}
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-neutral-900 leading-tight">
                        {capitalizedDate}
                      </h4>
                      <p className="text-[10px] text-neutral-400 font-medium">
                        {entry.time} {entry.audioDurationSeconds ? `• ${entry.audioDurationSeconds}s de récit` : ''}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => onDeleteEntry(entry.id)}
                    className="w-7 h-7 rounded-full text-neutral-300 hover:text-red-500 hover:bg-red-50 flex items-center justify-center transition-colors"
                    title="Supprimer cette entrée"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>

                {/* Summary */}
                <p className="text-xs text-neutral-800 leading-relaxed font-normal">
                  {entry.summary}
                </p>

                {/* Activities pills */}
                {entry.activities?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    {entry.activities.map((act, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] bg-neutral-50 text-neutral-700 font-medium px-2.5 py-0.5 rounded-full border border-neutral-200/60"
                      >
                        {act}
                      </span>
                    ))}
                  </div>
                )}

                {/* Tags pills */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  {entry.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded-full font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Expand / Collapse for Raw Transcript & Alignment */}
                <div className="pt-2 border-t border-neutral-100">
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : entry.id)}
                    className="flex items-center justify-between w-full text-[11px] font-semibold text-neutral-500 hover:text-neutral-900 transition-colors"
                  >
                    <span>{isExpanded ? 'Masquer la transcription brute' : 'Voir la transcription vocale & cap'}</span>
                    {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>

                  {isExpanded && (
                    <div className="mt-3 space-y-2.5 animate-fadeIn">
                      {/* Raw transcript */}
                      <div className="p-3 bg-neutral-50 rounded-2xl border border-neutral-200/60 text-xs text-neutral-700 italic leading-relaxed">
                        <p className="font-semibold text-neutral-500 not-italic text-[10px] mb-1 uppercase tracking-wider">
                          Récit vocal brut :
                        </p>
                        « {entry.rawTranscript} »
                      </div>

                      {/* Direction alignment note */}
                      {entry.directionAlignment && (
                        <div className="p-3 bg-blue-50/70 rounded-2xl border border-blue-100 text-xs text-blue-950 flex items-start gap-2">
                          <Compass size={15} className="text-blue-600 shrink-0 mt-0.5" />
                          <div>
                            <p className="font-bold text-blue-900 text-[11px]">En lien avec ton cap :</p>
                            <p className="mt-0.5 leading-snug">{entry.directionAlignment}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
