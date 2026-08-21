import { useState } from 'react';
import { X, Search } from 'lucide-react';
import type { JournalEntry } from '../types';


interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  entries: JournalEntry[];
  onSelectEntry: (entry: JournalEntry) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  entries,
  onSelectEntry,
}) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const filtered = entries.filter((entry) => {
    const q = query.toLowerCase();
    return (
      entry.summary.toLowerCase().includes(q) ||
      entry.rawTranscript.toLowerCase().includes(q) ||
      entry.tags.some((t) => t.toLowerCase().includes(q)) ||
      entry.activities.some((a) => a.toLowerCase().includes(q))
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-14 bg-black/40 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-[420px] bg-white rounded-3xl p-5 shadow-2xl border border-neutral-100 max-h-[80vh] flex flex-col space-y-4">
        
        {/* Search header */}
        <div className="flex items-center gap-2 border-b border-neutral-100 pb-3">
          <Search size={20} className="text-neutral-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher un mot, un tag, une activité…"
            className="flex-1 text-sm bg-transparent focus:outline-none text-neutral-800 placeholder-neutral-400"
            autoFocus
          />
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-500 hover:text-neutral-800"
          >
            <X size={16} />
          </button>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
          {filtered.length === 0 ? (
            <div className="text-center py-8 text-neutral-400 text-xs">
              Aucun récit ne correspond à votre recherche.
            </div>
          ) : (
            filtered.map((entry) => (
              <div
                key={entry.id}
                onClick={() => {
                  onSelectEntry(entry);
                  onClose();
                }}
                className="p-3 bg-neutral-50 hover:bg-neutral-100/80 rounded-2xl cursor-pointer transition-colors border border-neutral-200/50 space-y-1.5"
              >
                <div className="flex items-center justify-between text-[11px] text-neutral-500">
                  <span className="font-semibold text-neutral-700">
                    {new Date(entry.date).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                    })}
                  </span>
                  <span>{entry.time}</span>
                </div>
                <p className="text-xs text-neutral-800 line-clamp-2 leading-relaxed">
                  {entry.summary}
                </p>
                <div className="flex flex-wrap gap-1 pt-1">
                  {entry.tags.map((t) => (
                    <span
                      key={t}
                      className="text-[10px] bg-white px-2 py-0.5 rounded-full text-neutral-600 border border-neutral-200"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};
