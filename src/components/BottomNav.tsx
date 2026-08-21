import React from 'react';
import { Home, Calendar, BookOpen, Mic } from 'lucide-react';
import type { TabType } from '../types';


interface BottomNavProps {
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
  onOpenMic: () => void;
  isRecording?: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onTabChange,
  onOpenMic,
  isRecording = false,
}) => {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3 w-auto max-w-[94vw] pointer-events-none select-none">
      
      {/* Translucent Glass Capsule with 3 tabs */}
      <nav
        aria-label="Navigation principale"
        className="pointer-events-auto flex items-center gap-1 bg-[#EBEBED]/75 backdrop-blur-2xl border border-white/80 shadow-[0_14px_35px_rgba(0,0,0,0.08),0_2px_10px_rgba(0,0,0,0.04)] rounded-full p-1.5 transition-all"
      >
        {/* Tab 1: Accueil */}
        <button
          onClick={() => onTabChange('home')}
          className={`flex items-center justify-center transition-all duration-200 ${
            currentTab === 'home'
              ? 'bg-white text-neutral-900 shadow-[0_3px_10px_rgba(0,0,0,0.06)] rounded-full px-5 py-3'
              : 'text-neutral-500 hover:text-neutral-900 px-4 py-3 rounded-full hover:bg-white/40'
          }`}
          aria-label="Accueil"
          title="Accueil"
        >
          <Home size={22} strokeWidth={currentTab === 'home' ? 2.2 : 1.8} />
        </button>

        {/* Tab 2: Journal */}
        <button
          onClick={() => onTabChange('journal')}
          className={`flex items-center justify-center transition-all duration-200 ${
            currentTab === 'journal'
              ? 'bg-white text-neutral-900 shadow-[0_3px_10px_rgba(0,0,0,0.06)] rounded-full px-5 py-3'
              : 'text-neutral-500 hover:text-neutral-900 px-4 py-3 rounded-full hover:bg-white/40'
          }`}
          aria-label="Journal de bord"
          title="Journal"
        >
          <Calendar size={22} strokeWidth={currentTab === 'journal' ? 2.2 : 1.8} />
        </button>

        {/* Tab 3: Direction / Cap */}
        <button
          onClick={() => onTabChange('direction')}
          className={`flex items-center justify-center transition-all duration-200 ${
            currentTab === 'direction'
              ? 'bg-white text-neutral-900 shadow-[0_3px_10px_rgba(0,0,0,0.06)] rounded-full px-5 py-3'
              : 'text-neutral-500 hover:text-neutral-900 px-4 py-3 rounded-full hover:bg-white/40'
          }`}
          aria-label="Direction & Cap de vie"
          title="Direction"
        >
          <BookOpen size={22} strokeWidth={currentTab === 'direction' ? 2.2 : 1.8} />
        </button>
      </nav>

      {/* Separate Circular Mic Button (Exactly matching Image 2) */}
      <button
        onClick={onOpenMic}
        className={`pointer-events-auto w-[58px] h-[58px] rounded-full flex items-center justify-center shadow-[0_14px_35px_rgba(0,0,0,0.1),0_2px_10px_rgba(0,0,0,0.04)] border border-white/90 active:scale-95 transition-all duration-200 ${
          isRecording
            ? 'bg-red-500 text-white animate-pulse ring-4 ring-red-200'
            : 'bg-[#F2F2F4]/90 hover:bg-white text-neutral-900 backdrop-blur-xl'
        }`}
        aria-label="Raconter ma journée (Micro)"
        title="Raconter ma journée"
      >
        <Mic size={24} strokeWidth={2} />
      </button>

    </div>
  );
};
