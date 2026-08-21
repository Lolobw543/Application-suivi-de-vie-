import { X, User, Bell, Flame, Download, ShieldCheck } from 'lucide-react';
import type { UserGoal } from '../types';


interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  goal: UserGoal;
  totalEntriesCount: number;
  onOpenNotifications: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  goal,
  totalEntriesCount,
  onOpenNotifications,
}) => {
  if (!isOpen) return null;

  const handleExport = () => {
    const data = {
      goal,
      entriesCount: totalEntriesCount,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fil-suivi-de-vie-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-[420px] bg-white rounded-t-[36px] sm:rounded-[36px] p-6 pb-9 shadow-2xl border border-neutral-100 space-y-5 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <User size={18} />
            </div>
            <h3 className="font-bold text-neutral-900 text-base">
              Profil & Réglages
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-500 hover:text-neutral-800"
          >
            <X size={16} />
          </button>
        </div>

        {/* User Card */}
        <div className="bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-950 text-white rounded-3xl p-5 space-y-4">
          <div className="flex items-center gap-3.5">
            <div className="w-13 h-13 rounded-full overflow-hidden ring-2 ring-amber-300/60 p-0.5">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                alt="Avatar"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div>
              <h4 className="font-bold text-base text-white leading-tight">
                Membre Fil
              </h4>
              <p className="text-xs text-neutral-400">
                Suivi actif depuis {goal.activeSinceDays} jours
              </p>
            </div>
          </div>

          {/* Stats Badges */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/10 text-center">
            <div className="bg-white/10 rounded-2xl p-2.5 space-y-0.5">
              <p className="text-[10px] text-neutral-300 font-medium">Série active</p>
              <p className="text-sm font-extrabold text-amber-300 flex items-center justify-center gap-1">
                <Flame size={14} className="fill-amber-300" />
                {goal.streakDays}j
              </p>
            </div>
            <div className="bg-white/10 rounded-2xl p-2.5 space-y-0.5">
              <p className="text-[10px] text-neutral-300 font-medium">Récits vocaux</p>
              <p className="text-sm font-extrabold text-white">
                {totalEntriesCount}
              </p>
            </div>
            <div className="bg-white/10 rounded-2xl p-2.5 space-y-0.5">
              <p className="text-[10px] text-neutral-300 font-medium">Alignement</p>
              <p className="text-sm font-extrabold text-emerald-400">
                {goal.alignmentScore}%
              </p>
            </div>
          </div>
        </div>

        {/* Apple-style settings list group */}
        <div className="bg-neutral-50 rounded-3xl p-1.5 border border-neutral-200/60 divide-y divide-neutral-200/60">
          
          {/* Notifications */}
          <div
            onClick={() => {
              onClose();
              onOpenNotifications();
            }}
            className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-neutral-100/70 rounded-2xl transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-blue-500 text-white flex items-center justify-center">
                <Bell size={16} />
              </div>
              <div>
                <p className="text-xs font-bold text-neutral-900">Rappels du soir</p>
                <p className="text-[11px] text-neutral-500">Chaque jour à 21h00</p>
              </div>
            </div>
            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
              Configurer &gt;
            </span>
          </div>

          {/* Export */}
          <div
            onClick={handleExport}
            className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-neutral-100/70 rounded-2xl transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center">
                <Download size={16} />
              </div>
              <div>
                <p className="text-xs font-bold text-neutral-900">Sauvegarder mes données</p>
                <p className="text-[11px] text-neutral-500">Exporter mon journal au format JSON</p>
              </div>
            </div>
            <span className="text-xs text-neutral-400">&gt;</span>
          </div>

          {/* Privacy note */}
          <div className="p-3.5 flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-neutral-800 text-white flex items-center justify-center shrink-0">
              <ShieldCheck size={16} />
            </div>
            <div>
              <p className="text-xs font-bold text-neutral-900">Confidentialité totale</p>
              <p className="text-[11px] text-neutral-500 leading-snug">
                Vos enregistrements et analyses restent 100% locaux dans votre navigateur.
              </p>
            </div>
          </div>

        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full py-3.5 bg-neutral-900 hover:bg-black text-white rounded-full font-semibold text-xs transition-colors"
        >
          Fermer
        </button>

      </div>
    </div>
  );
};
