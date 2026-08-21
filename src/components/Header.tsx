import { Search, Bell } from 'lucide-react';


interface HeaderProps {
  onOpenSearch: () => void;
  onOpenNotifications: () => void;
  onOpenProfile: () => void;
  unreadCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSearch,
  onOpenNotifications,
  onOpenProfile,
  unreadCount = 1,
}) => {
  const today = new Date();
  const dateFormatted = today.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
  const capitalizedDate = dateFormatted.charAt(0).toUpperCase() + dateFormatted.slice(1);

  return (
    <header className="flex items-center justify-between px-5 pt-3 pb-2 max-w-[440px] mx-auto w-full select-none">
      
      {/* User Avatar + Title Info */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenProfile}
          className="relative group active:scale-95 transition-transform"
          aria-label="Profil et réglages"
        >
          <div className="w-11 h-11 rounded-full overflow-hidden ring-2 ring-white shadow-sm bg-gradient-to-tr from-amber-400 via-rose-400 to-indigo-500 p-[2px]">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
              alt="Profil"
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white" />
        </button>

        <div className="space-y-0.5">
          <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 leading-none">
            {capitalizedDate}
          </p>
          <h2 className="text-base font-bold text-neutral-900 tracking-tight leading-tight m-0">
            Fil de vie
          </h2>
        </div>
      </div>

      {/* Action Buttons: Search and Bell */}
      <div className="flex items-center gap-2">
        <button
          onClick={onOpenSearch}
          className="w-10 h-10 rounded-full bg-white/90 hover:bg-white shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-neutral-100/90 flex items-center justify-center text-neutral-700 hover:text-neutral-900 transition-all active:scale-95"
          aria-label="Rechercher"
          title="Rechercher dans le journal"
        >
          <Search size={18} strokeWidth={2} />
        </button>

        <button
          onClick={onOpenNotifications}
          className="relative w-10 h-10 rounded-full bg-white/90 hover:bg-white shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-neutral-100/90 flex items-center justify-center text-neutral-700 hover:text-neutral-900 transition-all active:scale-95"
          aria-label="Notifications et Rappels"
          title="Rappels du soir"
        >
          <Bell size={18} strokeWidth={2} />
          {unreadCount > 0 && (
            <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
          )}
        </button>
      </div>

    </header>
  );
};
