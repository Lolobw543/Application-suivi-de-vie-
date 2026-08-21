import { useState } from 'react';
import { Compass, Edit3, Palette, Sun, BookOpen, Bell, Check, Smartphone, Clock } from 'lucide-react';
import type { UserGoal } from '../types';

import { notificationService } from '../services/notificationService';
import { storageService } from '../services/storageService';

interface DirectionPageProps {
  goal: UserGoal;
  onOpenEditModal: () => void;
  onUpdateGoal: (goal: UserGoal) => void;
}

export const DirectionPage: React.FC<DirectionPageProps> = ({
  goal,
  onOpenEditModal,
  onUpdateGoal,
}) => {
  const [notificationStatus, setNotificationStatus] = useState<boolean>(() =>
    notificationService.getPermission() === 'granted'
  );
  const [showTestAlert, setShowTestAlert] = useState(false);

  const getPillarIcon = (iconName: string) => {
    switch (iconName) {
      case 'Palette':
        return <Palette size={20} className="text-pink-600" />;
      case 'Sun':
        return <Sun size={20} className="text-blue-600" />;
      case 'BookOpen':
      default:
        return <BookOpen size={20} className="text-emerald-600" />;
    }
  };

  const handleToggleNotification = async () => {
    const granted = await notificationService.requestPermission();
    setNotificationStatus(granted);
    storageService.setNotificationGranted(granted);

    if (granted) {
      await notificationService.scheduleEveningTestNotification();
      setShowTestAlert(true);
      setTimeout(() => setShowTestAlert(false), 4000);
    }
  };

  const handleAdjustPillar = (pillarId: string, delta: number) => {
    const updatedPillars = goal.pillars.map((p) => {
      if (p.id === pillarId) {
        const nextCount = Math.max(0, Math.min(p.targetCount, p.currentCount + delta));
        const nextPercent = Math.round((nextCount / p.targetCount) * 100);
        return {
          ...p,
          currentCount: nextCount,
          progressPercent: nextPercent,
        };
      }
      return p;
    });

    const avg = Math.round(
      updatedPillars.reduce((acc, curr) => acc + curr.progressPercent, 0) / updatedPillars.length
    );

    onUpdateGoal({
      ...goal,
      pillars: updatedPillars,
      alignmentScore: avg,
    });
  };

  return (
    <div className="space-y-4 pb-28 animate-fadeIn select-none">
      
      {/* Title & Edit */}
      <div className="flex items-center justify-between px-1">
        <div>
          <h1 className="text-2xl font-extrabold text-neutral-900 tracking-tight m-0">
            Mon Cap de vie
          </h1>
          <p className="text-xs text-neutral-500 font-medium">
            La boussole qui guide tes bilans du soir
          </p>
        </div>

        <button
          onClick={onOpenEditModal}
          className="px-3.5 py-2 bg-neutral-900 hover:bg-black text-white text-xs font-semibold rounded-full shadow-sm flex items-center gap-1.5 active:scale-95 transition-all"
        >
          <Edit3 size={13} />
          <span>Modifier</span>
        </button>
      </div>

      {/* Main Cap Hero Card */}
      <div className="bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-950 text-white rounded-[32px] p-5 shadow-xl space-y-3 relative overflow-hidden">
        <div className="flex items-start justify-between">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[11px] font-semibold text-amber-300">
            <Compass size={13} />
            <span>Cap prioritaire</span>
          </div>
          <span className="text-xs font-semibold text-neutral-400">
            Jour {goal.activeSinceDays}
          </span>
        </div>

        <div className="space-y-1">
          <h2 className="text-xl font-bold tracking-tight text-white m-0">
            {goal.mainDirection}
          </h2>
          <p className="text-xs text-neutral-300 leading-relaxed font-light">
            « {goal.statement} »
          </p>
        </div>

        <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-neutral-300 font-medium">Alignement global</span>
          </div>
          <span className="font-bold text-white text-sm">{goal.alignmentScore}%</span>
        </div>
      </div>

      {/* 3 Life Pillars */}
      <div className="space-y-2.5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 px-1">
          Mes 3 piliers d'équilibre
        </h3>

        {goal.pillars.map((pillar) => (
          <div
            key={pillar.id}
            className="bg-white rounded-[26px] p-4 shadow-[0_4px_16px_rgba(0,0,0,0.03)] border border-neutral-100/90 space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-2xs"
                  style={{
                    backgroundColor: `${pillar.color}15`,
                  }}
                >
                  {getPillarIcon(pillar.iconName)}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-neutral-900 leading-tight">
                    {pillar.title}
                  </h4>
                  <p className="text-[11px] text-neutral-500 font-normal mt-0.5">
                    {pillar.description}
                  </p>
                </div>
              </div>

              <span className="text-xs font-extrabold text-neutral-900">
                {pillar.progressPercent}%
              </span>
            </div>

            {/* Progress bar */}
            <div className="space-y-1.5">
              <div className="w-full h-2.5 bg-neutral-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500 ease-out"
                  style={{
                    width: `${pillar.progressPercent}%`,
                    backgroundColor: pillar.color,
                  }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-neutral-500">
                <span>
                  {pillar.currentCount} / {pillar.targetCount} {pillar.unit}
                </span>

                {/* Quick adjustments buttons */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleAdjustPillar(pillar.id, -1)}
                    className="w-6 h-6 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold flex items-center justify-center active:scale-95"
                    title="Diminuer"
                  >
                    -
                  </button>
                  <button
                    onClick={() => handleAdjustPillar(pillar.id, 1)}
                    className="w-6 h-6 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold flex items-center justify-center active:scale-95"
                    title="Augmenter"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* Reminder & Notification Card */}
      <div className="bg-gradient-to-br from-[#E1F1FE] to-[#D5EBFF] rounded-[28px] p-5 border border-[#BDE0FC] shadow-sm space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center">
              <Clock size={15} />
            </div>
            <h4 className="text-xs font-bold text-[#0D3866]">
              Rappel du soir à 21h00
            </h4>
          </div>

          <span className="text-xs font-bold bg-white text-blue-700 px-2.5 py-0.5 rounded-full shadow-2xs">
            21:00
          </span>
        </div>

        <p className="text-xs text-[#1E40AF] leading-relaxed">
          Reçois une notification discrète chaque soir pour poser ton récit vocal et faire le point sur ta journée.
        </p>

        <button
          onClick={handleToggleNotification}
          className={`w-full py-3 rounded-full text-xs font-bold shadow-sm flex items-center justify-center gap-2 active:scale-95 transition-all ${
            notificationStatus
              ? 'bg-emerald-600 text-white'
              : 'bg-neutral-900 hover:bg-black text-white'
          }`}
        >
          {notificationStatus ? (
            <>
              <Check size={16} />
              <span>Rappel de 21h actif (Autorisé)</span>
            </>
          ) : (
            <>
              <Bell size={16} />
              <span>Activer le rappel de 21h</span>
            </>
          )}
        </button>

        {showTestAlert && (
          <p className="text-[11px] text-emerald-800 text-center font-medium animate-fadeIn">
            ✓ Notification de test déclenchée avec succès !
          </p>
        )}
      </div>

      {/* iOS PWA Installation Guide */}
      <div className="bg-white rounded-[26px] p-4 border border-neutral-200/80 shadow-2xs flex items-start gap-3">
        <Smartphone size={22} className="text-neutral-700 mt-0.5 shrink-0" />
        <div className="text-xs text-neutral-600 space-y-1">
          <p className="font-bold text-neutral-900">
            Installation iPhone (iOS) :
          </p>
          <p className="leading-relaxed text-[11px]">
            Sur Safari iOS, les notifications et le mode plein écran nécessitent d'ajouter l'application : appuie sur le bouton <strong>Partager</strong> <span className="inline-block px-1 bg-neutral-100 rounded text-neutral-700">⎋</span> puis <strong>« Sur l'écran d'accueil »</strong>.
          </p>
        </div>
      </div>

    </div>
  );
};
