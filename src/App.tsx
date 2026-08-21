import { useState } from 'react';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { AudioRecorderModal } from './components/AudioRecorderModal';
import { AnalysisConfirmationModal } from './components/AnalysisConfirmationModal';
import { SearchModal } from './components/SearchModal';
import { NotificationsModal } from './components/NotificationsModal';
import { EditDirectionModal } from './components/EditDirectionModal';
import { HomePage } from './pages/HomePage';
import { JournalPage } from './pages/JournalPage';
import { DirectionPage } from './pages/DirectionPage';
import { storageService } from './services/storageService';
import type { JournalEntry, UserGoal, TabType } from './types';
import type { AnalysisResult } from './services/localAnalysisEngine';
import { CheckCircle2 } from 'lucide-react';


export function App() {
  const [currentTab, setCurrentTab] = useState<TabType>('home');
  const [entries, setEntries] = useState<JournalEntry[]>(() => storageService.getEntries());
  const [goal, setGoal] = useState<UserGoal>(() => storageService.getGoal());

  // Modal states
  const [isRecorderOpen, setIsRecorderOpen] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState<AnalysisResult | null>(null);
  const [currentRawTranscript, setCurrentRawTranscript] = useState('');
  const [currentAudioDuration, setCurrentAudioDuration] = useState(30);

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isEditDirectionOpen, setIsEditDirectionOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleOpenRecorder = () => {
    setIsRecorderOpen(true);
  };

  const handleAnalysisComplete = (
    result: AnalysisResult,
    rawTranscript: string,
    durationSeconds: number
  ) => {
    setCurrentAnalysis(result);
    setCurrentRawTranscript(rawTranscript);
    setCurrentAudioDuration(durationSeconds);
    setIsRecorderOpen(false);
    setIsConfirmationOpen(true);
  };

  const handleConfirmSaveEntry = (newEntry: JournalEntry) => {
    const updatedEntries = storageService.saveEntry(newEntry);
    setEntries(updatedEntries);
    setGoal(storageService.getGoal());
    setIsConfirmationOpen(false);
    showToast('Journée enregistrée. À demain.');
    // Switch to journal or home
    setCurrentTab('journal');
  };

  const handleDeleteEntry = (id: string) => {
    const updated = storageService.deleteEntry(id);
    setEntries(updated);
    showToast('Entrée supprimée du journal.');
  };

  const handleUpdateGoal = (updatedGoal: UserGoal) => {
    storageService.saveGoal(updatedGoal);
    setGoal(updatedGoal);
    showToast('Cap de vie mis à jour.');
  };

  return (
    <div className="min-h-screen bg-[#ECEEF2] sm:py-6 flex items-center justify-center font-sans antialiased text-neutral-900">
      
      {/* Mobile Frame Container (Max 420px for iPhone realism) */}
      <div className="w-full max-w-[420px] min-h-screen sm:min-h-[844px] sm:h-[880px] bg-[#F4F5F8] sm:rounded-[44px] sm:shadow-[0_25px_60px_rgba(0,0,0,0.15)] sm:border-[8px] sm:border-neutral-800/10 flex flex-col relative overflow-hidden">
        
        {/* Top Header */}
        <Header
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenNotifications={() => setIsNotificationsOpen(true)}
          onOpenProfile={() => setIsEditDirectionOpen(true)}
          unreadCount={goal.reminderEnabled ? 1 : 0}
        />

        {/* Scrollable Main View Content */}
        <main className="flex-1 overflow-y-auto px-4 pt-1 no-scrollbar">
          {currentTab === 'home' && (
            <HomePage
              goal={goal}
              latestEntry={entries[0]}
              onStartVoice={handleOpenRecorder}
              onNavigateToDirection={() => setCurrentTab('direction')}
              onNavigateToJournal={() => setCurrentTab('journal')}
            />
          )}

          {currentTab === 'journal' && (
            <JournalPage
              entries={entries}
              onStartVoice={handleOpenRecorder}
              onDeleteEntry={handleDeleteEntry}
            />
          )}

          {currentTab === 'direction' && (
            <DirectionPage
              goal={goal}
              onOpenEditModal={() => setIsEditDirectionOpen(true)}
              onUpdateGoal={handleUpdateGoal}
            />
          )}
        </main>

        {/* Floating Bottom Nav (Exact Image 2) */}
        <BottomNav
          currentTab={currentTab}
          onTabChange={(tab) => setCurrentTab(tab)}
          onOpenMic={handleOpenRecorder}
          isRecording={isRecorderOpen}
        />

        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-neutral-900 text-white px-4 py-2.5 rounded-full shadow-xl flex items-center gap-2 text-xs font-semibold animate-fadeIn max-w-[90vw]">
            <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Modals */}
        <AudioRecorderModal
          isOpen={isRecorderOpen}
          onClose={() => setIsRecorderOpen(false)}
          onAnalysisComplete={handleAnalysisComplete}
          userDirection={goal.mainDirection}
        />

        <AnalysisConfirmationModal
          isOpen={isConfirmationOpen}
          analysisResult={currentAnalysis}
          rawTranscript={currentRawTranscript}
          durationSeconds={currentAudioDuration}
          onClose={() => setIsConfirmationOpen(false)}
          onConfirmSave={handleConfirmSaveEntry}
        />

        <SearchModal
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
          entries={entries}
          onSelectEntry={() => setCurrentTab('journal')}
        />

        <NotificationsModal
          isOpen={isNotificationsOpen}
          onClose={() => setIsNotificationsOpen(false)}
        />

        <EditDirectionModal
          isOpen={isEditDirectionOpen}
          onClose={() => setIsEditDirectionOpen(false)}
          goal={goal}
          onSaveGoal={handleUpdateGoal}
        />

      </div>

    </div>
  );
}

export default App;
