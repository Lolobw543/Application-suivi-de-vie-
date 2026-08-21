import { useState } from 'react';
import { X, Check, Compass } from 'lucide-react';
import type { UserGoal } from '../types';


interface EditDirectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  goal: UserGoal;
  onSaveGoal: (updated: UserGoal) => void;
}

export const EditDirectionModal: React.FC<EditDirectionModalProps> = ({
  isOpen,
  onClose,
  goal,
  onSaveGoal,
}) => {
  const [mainDirection, setMainDirection] = useState(goal.mainDirection);
  const [statement, setStatement] = useState(goal.statement);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveGoal({
      ...goal,
      mainDirection: mainDirection.trim() || 'Construire une vie plus créative',
      statement: statement.trim() || 'Devenir plus créatif et plus régulier.',
    });
    onClose();
  };

  const suggestions = [
    {
      title: 'Construire une vie plus créative',
      desc: 'Devenir plus régulier dans mes projets de design, vidéo et écriture.',
    },
    {
      title: 'Cultiver équilibre et sérénité',
      desc: 'Déconnecter chaque soir à 21h et préserver du temps pour soi et ses proches.',
    },
    {
      title: 'Apprentissage et dépassement',
      desc: 'Acquérir chaque semaine de nouveaux savoirs techniques et pratiques.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-[420px] bg-white rounded-t-[36px] sm:rounded-[36px] p-6 pb-9 shadow-2xl border border-neutral-100 space-y-5 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Compass size={18} />
            </div>
            <h3 className="font-bold text-neutral-900 text-base">
              Modifier mon cap de vie
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-500 hover:text-neutral-800"
          >
            <X size={16} />
          </button>
        </div>

        {/* Form */}
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-700">
              Titre du cap personnel :
            </label>
            <input
              type="text"
              value={mainDirection}
              onChange={(e) => setMainDirection(e.target.value)}
              className="w-full p-3 bg-neutral-50 rounded-2xl border border-neutral-200 text-sm text-neutral-900 font-medium focus:outline-none focus:ring-2 focus:ring-neutral-900"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-700">
              Description / Intention profonde :
            </label>
            <textarea
              value={statement}
              onChange={(e) => setStatement(e.target.value)}
              className="w-full h-24 p-3 bg-neutral-50 rounded-2xl border border-neutral-200 text-xs text-neutral-800 leading-relaxed focus:outline-none focus:ring-2 focus:ring-neutral-900 resize-none"
            />
          </div>

          {/* Suggestions */}
          <div className="space-y-2 pt-1">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
              Exemples d'inspirations :
            </label>
            <div className="space-y-1.5">
              {suggestions.map((s, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    setMainDirection(s.title);
                    setStatement(s.desc);
                  }}
                  className="p-2.5 bg-neutral-50 hover:bg-neutral-100 rounded-xl cursor-pointer transition-colors border border-neutral-200/60"
                >
                  <p className="text-xs font-bold text-neutral-800">{s.title}</p>
                  <p className="text-[11px] text-neutral-500 line-clamp-1">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="pt-2 flex items-center gap-3">
          <button
            onClick={handleSave}
            className="flex-1 py-3.5 bg-neutral-900 hover:bg-black text-white rounded-full font-semibold text-sm shadow-md active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Check size={18} className="text-emerald-400" />
            <span>Enregistrer mon cap</span>
          </button>
        </div>

      </div>
    </div>
  );
};
