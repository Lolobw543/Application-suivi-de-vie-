import React, { useState } from 'react';
import { X, Check, Edit3, Sparkles, Tag, Compass, Award, Smile } from 'lucide-react';
import type { AnalysisResult } from '../services/localAnalysisEngine';
import type { JournalEntry, MoodType } from '../types';
import { MOOD_OPTIONS } from '../services/storageService';

import confetti from 'canvas-confetti';

interface AnalysisConfirmationModalProps {
  isOpen: boolean;
  analysisResult: AnalysisResult | null;
  rawTranscript: string;
  durationSeconds: number;
  onClose: () => void;
  onConfirmSave: (entry: JournalEntry) => void;
}

export const AnalysisConfirmationModal: React.FC<AnalysisConfirmationModalProps> = ({
  isOpen,
  analysisResult,
  rawTranscript,
  durationSeconds,
  onClose,
  onConfirmSave,
}) => {
  if (!isOpen || !analysisResult) return null;

  const [isEditing, setIsEditing] = useState(false);
  const [summary, setSummary] = useState(analysisResult.summary);
  const [transcript, setTranscript] = useState(rawTranscript);
  const [selectedMood, setSelectedMood] = useState<MoodType>(analysisResult.detectedMood);
  const [tags, setTags] = useState<string[]>(analysisResult.tags);
  const [newTagInput, setNewTagInput] = useState('');

  const handleSave = () => {
    // Trigger celebratory confetti
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#D6F5B4', '#FDE7F2', '#E1F1FE', '#111827', '#F59E0B'],
      });
    } catch {
      // Ignore if confetti fails
    }

    const now = new Date();
    const newEntry: JournalEntry = {
      id: `entry-${Date.now()}`,
      date: now.toISOString().split('T')[0],
      time: `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`,
      rawTranscript: transcript,
      summary: summary,
      activities: analysisResult.activities,
      learnings: analysisResult.learnings,
      tags: tags,
      mood: selectedMood,
      directionAlignment: analysisResult.directionAlignment,
      audioDurationSeconds: durationSeconds,
      createdAt: now.toISOString(),
    };

    onConfirmSave(newEntry);
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newTagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(newTagInput.trim())) {
        setTags([...tags, newTagInput.trim()]);
      }
      setNewTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-md transition-all duration-300 animate-fadeIn">
      <div className="w-full max-w-[440px] bg-white rounded-t-[36px] sm:rounded-[36px] p-6 pb-9 shadow-2xl flex flex-col justify-between max-h-[92vh] overflow-y-auto border border-neutral-100">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-neutral-100 rounded-full text-xs font-semibold text-neutral-700">
            <Sparkles size={13} className="text-amber-500" />
            <span>Analyse locale de démonstration</span>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-600 hover:bg-neutral-200 transition-colors"
            aria-label="Fermer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-5 pt-3">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-neutral-900 tracking-tight">
              Voilà ce que je retiens de ta journée.
            </h2>
            <p className="text-xs text-neutral-500">
              Vérifie ou ajuste cette synthèse avant de l'enregistrer dans ton journal.
            </p>
          </div>

          {/* Main summary card */}
          <div className="bg-gradient-to-br from-neutral-50 to-neutral-100/60 p-4 rounded-3xl border border-neutral-200/70 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-600 flex items-center gap-1.5">
                <Sparkles size={14} className="text-amber-500" />
                Résumé de ta soirée
              </span>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="text-xs text-neutral-600 hover:text-neutral-900 flex items-center gap-1 font-medium bg-white px-2.5 py-1 rounded-full border border-neutral-200 shadow-2xs"
              >
                <Edit3 size={12} />
                <span>{isEditing ? 'Valider' : 'Modifier'}</span>
              </button>
            </div>

            {isEditing ? (
              <textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                className="w-full h-24 p-3 bg-white rounded-2xl border border-neutral-300 text-sm text-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-900 resize-none"
              />
            ) : (
              <p className="text-neutral-800 text-sm leading-relaxed font-normal">
                {summary}
              </p>
            )}

            {/* Activities detected */}
            {analysisResult.activities?.length > 0 && (
              <div className="pt-2 border-t border-neutral-200/60 flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] font-semibold text-neutral-500 mr-1">
                  Activités :
                </span>
                {analysisResult.activities.map((act, i) => (
                  <span
                    key={i}
                    className="text-xs bg-white text-neutral-700 px-2.5 py-0.5 rounded-full border border-neutral-200/80 font-medium"
                  >
                    {act}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Learnings if detected */}
          {analysisResult.learnings && (
            <div className="bg-[#EBF7EE] p-3.5 rounded-2xl border border-[#D1F0D7] flex items-start gap-2.5">
              <Award size={18} className="text-emerald-700 mt-0.5 shrink-0" />
              <div className="text-xs text-emerald-950">
                <p className="font-semibold text-emerald-900">Apprentissage clé :</p>
                <p className="mt-0.5 leading-snug">{analysisResult.learnings}</p>
              </div>
            </div>
          )}

          {/* Alignment with life direction */}
          <div className="bg-[#EBF5FF] p-3.5 rounded-2xl border border-[#D0E7FF] flex items-start gap-2.5">
            <Compass size={18} className="text-blue-600 mt-0.5 shrink-0" />
            <div className="text-xs text-blue-950">
              <p className="font-semibold text-blue-900">En lien avec ton cap :</p>
              <p className="mt-0.5 leading-snug">{analysisResult.directionAlignment}</p>
            </div>
          </div>

          {/* Mood selection */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-neutral-700 flex items-center gap-1.5">
              <Smile size={14} className="text-neutral-500" />
              Ton ressenti global ce soir :
            </label>
            <div className="grid grid-cols-5 gap-2">
              {MOOD_OPTIONS.map((mood) => {
                const isSelected = selectedMood === mood.id;
                return (
                  <button
                    key={mood.id}
                    onClick={() => setSelectedMood(mood.id)}
                    className={`py-2 px-1 rounded-2xl border flex flex-col items-center gap-1 transition-all ${
                      isSelected
                        ? 'bg-neutral-900 text-white border-neutral-900 shadow-sm scale-105'
                        : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-700 border-neutral-200'
                    }`}
                  >
                    <span className="text-xl">{mood.emoji}</span>
                    <span className="text-[10px] font-medium truncate w-full text-center">
                      {mood.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-neutral-700 flex items-center gap-1.5">
              <Tag size={14} className="text-neutral-500" />
              Tags associés :
            </label>
            <div className="flex flex-wrap gap-1.5 items-center">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 bg-neutral-100 text-neutral-800 text-xs px-2.5 py-1 rounded-full font-medium border border-neutral-200"
                >
                  #{tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-red-500 text-neutral-400 ml-0.5"
                  >
                    &times;
                  </button>
                </span>
              ))}
              <input
                type="text"
                value={newTagInput}
                onChange={(e) => setNewTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder="+ tag"
                className="text-xs px-2.5 py-1 bg-white border border-dashed border-neutral-300 rounded-full w-16 focus:w-24 focus:outline-none focus:border-neutral-900 transition-all"
              />
            </div>
          </div>

          {/* Optional raw transcript view if editing */}
          {isEditing && (
            <div className="space-y-1 pt-1">
              <label className="text-xs font-semibold text-neutral-600">
                Transcription brute dictée :
              </label>
              <textarea
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                className="w-full h-20 p-2.5 bg-neutral-50 rounded-xl border border-neutral-200 text-xs text-neutral-700 resize-none"
              />
            </div>
          )}

          {/* Bottom Actions */}
          <div className="pt-3 space-y-2">
            <button
              onClick={handleSave}
              className="w-full py-4 bg-neutral-900 hover:bg-black text-white rounded-full font-semibold text-base shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <Check size={20} className="text-emerald-400" />
              <span>Oui, enregistrer ma journée</span>
            </button>

            <button
              onClick={() => setIsEditing(!isEditing)}
              className="w-full py-2.5 text-center text-xs font-semibold text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              {isEditing ? 'Masquer la modification' : 'Modifier mon récit ou les détails'}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
