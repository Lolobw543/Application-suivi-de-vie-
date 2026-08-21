import React from 'react';
import { Search, Bell } from 'lucide-react';

interface HeaderProps {
  onOpenSearch: () => void;
  onOpenNotifications: () => void;
  onOpenProfile?: () => void;
  unreadCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSearch,
  onOpenNotifications,
  onOpenProfile,
  unreadCount = 1,
}) => {
  return (
    <header className="flex items-center justify-between px-5 pt-4 pb-3 max-w-[440px] mx-auto w-full select-none">
      
      {/* User Avatar */}
      <button
        onClick={onOpenProfile}
        className="flex items-center gap-3 group text-left active:scale-95 transition-transform"
        aria-label="Mon profil"
      >
        <div className="relative">
          <div className="w-11 h-11 rounded-full overflow-hidden ring-2 ring-white shadow-sm bg-gradient-to-tr from-amber-400 via-rose-400 to-indigo-500 p-[2px]">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
              alt="Profil utilisateur"
              className="w-full h-full object-cover rounded-full"
              onError={(e) => {
                // Fallback elegant avatar
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
          <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white" />
        </div>
      </button>

      {/* Action Buttons: Search and Bell */}
      <div className="flex items-center gap-2.5">
        <button
          onClick={onOpenSearch}
          className="w-10 h-10 rounded-full bg-white/90 hover:bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-neutral-100/80 flex items-center justify-center text-neutral-700 hover:text-neutral-900 transition-all active:scale-95"
          aria-label="Rechercher dans le journal"
          title="Rechercher"
        >
          <Search size={19} strokeWidth={1.9} />
        </button>

        <button
          onClick={onOpenNotifications}
          className="relative w-10 h-10 rounded-full bg-white/90 hover:bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-neutral-100/80 flex items-center justify-center text-neutral-700 hover:text-neutral-900 transition-all active:scale-95"
          aria-label="Notifications et Rappels"
          title="Rappels"
        >
          <Bell size={19} strokeWidth={1.9} />
          {unreadCount > 0 && (
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
          )}
        </button>
      </div>

    </header>
  );
};
