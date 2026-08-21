import { useState } from 'react';
import { Mic, Trash2, ChevronDown, ChevronUp, Compass, Play, Pause, Search, Award } from 'lucide-react';

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
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Generate calendar days for the past 7 days
  const today = new Date();
  const pastDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (6 - i));
    const iso = d.toISOString().split('T')[0];
    const hasEntry = entries.some((e) => e.date === iso);
    return {
      date: d,
      iso,
      dayNumber: d.getDate(),
      dayShort: d.toLocaleDateString('fr-FR', { weekday: 'short' }).slice(0, 3),
      hasEntry,
      isToday: i === 6,
    };
  });

  const [selectedCalendarDate, setSelectedCalendarDate] = useState<string | null>(null);

  // Extract all unique tags
  const allTags = ['Tous', ...Array.from(new Set(entries.flatMap((e) => e.tags)))];

  const filteredEntries = entries.filter((entry) => {
    const matchesTag = selectedTag === 'Tous' || entry.tags.includes(selectedTag);
    const matchesDate = !selectedCalendarDate || entry.date === selectedCalendarDate;
    const matchesSearch =
      !searchQuery ||
      entry.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.rawTranscript.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesTag && matchesDate && matchesSearch;
  });

  const getMoodData = (moodId: string) => {
    return MOOD_OPTIONS.find((m) => m.id === moodId) || MOOD_OPTIONS[1];
  };

  const toggleAudioPlay = (id: string) => {
    if (playingId === id) {
      setPlayingId(null);
    } else {
      setPlayingId(id);
      // Auto pause after 5 seconds simulation
      setTimeout(() => {
        setPlayingId((curr) => (curr === id ? null : curr));
      }, 5000);
    }
  };

  return (
    <div className="space-y-4 pb-28 animate-fadeIn select-none">
      
      {/* Title & Action */}
      <div className="flex items-center justify-between px-1">
        <div>
          <h1 className="text-2xl font-extrabold text-neutral-900 tracking-tight m-0">
            Journal de bord
          </h1>
          <p className="text-xs text-neutral-500 font-medium">
            {entries.length} récit{entries.length > 1 ? 's' : ''} et synthèses vocales
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

      {/* iOS Horizontal Calendar Strip */}
      <div className="bg-white rounded-3xl p-3 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-neutral-100/90 flex items-center justify-between gap-1">
        {pastDays.map((item) => {
          const isSelected = selectedCalendarDate === item.iso;
          return (
            <button
              key={item.iso}
              onClick={() => setSelectedCalendarDate(isSelected ? null : item.iso)}
              className={`flex-1 py-2 rounded-2xl flex flex-col items-center gap-1 transition-all ${
                isSelected
                  ? 'bg-neutral-900 text-white shadow-sm scale-105'
                  : item.isToday
                  ? 'bg-neutral-100 text-neutral-900 font-bold'
                  : 'hover:bg-neutral-50 text-neutral-600'
              }`}
            >
              <span className="text-[10px] uppercase font-bold text-neutral-400">
                {item.dayShort}
              </span>
              <span className="text-xs font-extrabold">{item.dayNumber}</span>
              {/* Dot indicator if entry exists */}
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  item.hasEntry
                    ? isSelected
                      ? 'bg-emerald-300'
                      : 'bg-emerald-500'
                    : 'bg-transparent'
                }`}
              />
            </button>
          );
        })}
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Rechercher dans mes bilans du soir…"
          className="w-full pl-9 pr-4 py-2.5 bg-white rounded-2xl border border-neutral-200/80 text-xs text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 shadow-2xs"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-neutral-700"
          >
            &times;
          </button>
        )}
      </div>

      {/* Tags Filter Strip */}
      {allTags.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto py-0.5 px-0.5 no-scrollbar">
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

      {/* Selected Date Reset Banner */}
      {selectedCalendarDate && (
        <div className="flex items-center justify-between px-3 py-1.5 bg-blue-50 text-blue-900 rounded-xl text-xs">
          <span>Filtré par date : {new Date(selectedCalendarDate).toLocaleDateString('fr-FR')}</span>
          <button
            onClick={() => setSelectedCalendarDate(null)}
            className="font-bold underline"
          >
            Réinitialiser
          </button>
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
              Aucun récit pour cette sélection
            </h3>
            <p className="text-xs text-neutral-500 max-w-[260px] mx-auto leading-relaxed">
              Prends deux minutes ce soir pour raconter ta journée. L'analyse locale résumera tes réussites.
            </p>
          </div>
          <button
            onClick={onStartVoice}
            className="py-3 px-6 bg-neutral-900 hover:bg-black text-white text-xs font-semibold rounded-full shadow-md active:scale-95 transition-all inline-flex items-center gap-2"
          >
            <Mic size={14} className="text-pink-300" />
            <span>Enregistrer un récit au micro</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3.5">
          {filteredEntries.map((entry) => {
            const mood = getMoodData(entry.mood);
            const isExpanded = expandedId === entry.id;
            const isPlaying = playingId === entry.id;
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
                {/* Entry Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-9 h-9 rounded-2xl flex items-center justify-center text-lg shadow-2xs"
                      style={{ backgroundColor: mood.bgPastel }}
                      title={mood.label}
                    >
                      {mood.emoji}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-neutral-900 leading-tight">
                        {capitalizedDate}
                      </h4>
                      <p className="text-[10px] text-neutral-400 font-medium">
                        {entry.time} • Récit de {entry.audioDurationSeconds || 42}s
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

                {/* Simulated Audio Player Waveform Strip */}
                <div className="bg-neutral-50 rounded-2xl p-2.5 flex items-center gap-3 border border-neutral-100">
                  <button
                    onClick={() => toggleAudioPlay(entry.id)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                      isPlaying
                        ? 'bg-neutral-900 text-white animate-pulse'
                        : 'bg-white text-neutral-800 shadow-2xs hover:scale-105'
                    }`}
                  >
                    {isPlaying ? <Pause size={13} /> : <Play size={13} className="ml-0.5" />}
                  </button>

                  {/* Waveform visual bars */}
                  <div className="flex-1 flex items-center gap-1 h-6">
                    {Array.from({ length: 28 }, (_, i) => {
                      const pseudoHeights = [30, 60, 45, 80, 100, 70, 40, 65, 85, 50, 90, 45, 60, 75, 95, 40, 55, 80, 65, 90, 50, 70, 85, 45, 60, 40, 55, 30];
                      const h = pseudoHeights[i % pseudoHeights.length];
                      return (
                        <div
                          key={i}
                          className={`flex-1 rounded-full transition-all duration-150 ${
                            isPlaying
                              ? 'bg-neutral-900 opacity-90'
                              : 'bg-neutral-300/80 opacity-60'
                          }`}
                          style={{
                            height: isPlaying ? `${Math.max(20, Math.sin(Date.now() / 150 + i) * 40 + 50)}%` : `${h}%`,
                          }}
                        />
                      );
                    })}
                  </div>

                  <span className="text-[10px] font-bold text-neutral-400 shrink-0">
                    {isPlaying ? '0:03' : `0:${entry.audioDurationSeconds || 42}`}
                  </span>
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
                        className="text-[11px] bg-neutral-100 text-neutral-700 font-medium px-2.5 py-0.5 rounded-full border border-neutral-200/60"
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
                      className="text-[10px] bg-neutral-50 text-neutral-600 px-2 py-0.5 rounded-full font-semibold border border-neutral-200/50"
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
                    <span>{isExpanded ? 'Masquer les détails' : 'Voir le récit brut & alignement de cap'}</span>
                    {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>

                  {isExpanded && (
                    <div className="mt-3 space-y-2.5 animate-fadeIn">
                      {/* Learnings */}
                      {entry.learnings && (
                        <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100 text-xs text-emerald-950 flex items-start gap-2">
                          <Award size={15} className="text-emerald-600 shrink-0 mt-0.5" />
                          <div>
                            <p className="font-bold text-emerald-900 text-[11px]">Apprentissage du jour :</p>
                            <p className="mt-0.5 leading-snug">{entry.learnings}</p>
                          </div>
                        </div>
                      )}

                      {/* Raw transcript */}
                      <div className="p-3 bg-neutral-50 rounded-2xl border border-neutral-200/60 text-xs text-neutral-700 italic leading-relaxed">
                        <p className="font-semibold text-neutral-500 not-italic text-[10px] mb-1 uppercase tracking-wider">
                          Récit vocal brut :
                        </p>
                        « {entry.rawTranscript} »
                      </div>

                      {/* Direction alignment note */}
                      {entry.directionAlignment && (
                        <div className="p-3 bg-blue-50/80 rounded-2xl border border-blue-100 text-xs text-blue-950 flex items-start gap-2">
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
