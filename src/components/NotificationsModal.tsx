import { useState, useEffect } from 'react';
import { X, Bell, Check, Smartphone, Clock } from 'lucide-react';
import { notificationService } from '../services/notificationService';
import { storageService } from '../services/storageService';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [hasPermission, setHasPermission] = useState(false);
  const [testSent, setTestSent] = useState(false);


  useEffect(() => {
    if (isOpen) {
      setHasPermission(notificationService.getPermission() === 'granted');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleRequestPermission = async () => {
    const granted = await notificationService.requestPermission();
    setHasPermission(granted);
    storageService.setNotificationGranted(granted);
    if (granted) {
      await notificationService.scheduleEveningTestNotification();
      setTestSent(true);
      setTimeout(() => setTestSent(false), 4000);
    }
  };

  const handleSendTestNotification = async () => {
    await notificationService.scheduleEveningTestNotification();
    setTestSent(true);
    setTimeout(() => setTestSent(false), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-[420px] bg-white rounded-3xl p-6 shadow-2xl border border-neutral-100 space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
              <Bell size={16} />
            </div>
            <h3 className="font-bold text-neutral-900 text-base">
              Rappels du soir (21:00)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-500 hover:text-neutral-800"
          >
            <X size={16} />
          </button>
        </div>

        {/* Status */}
        <div className="space-y-4">
          <div className="bg-[#EBF5FF] p-4 rounded-2xl border border-[#D0E7FF] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-blue-900 flex items-center gap-1.5">
                <Clock size={14} className="text-blue-600" />
                Heure du rappel quotidien
              </span>
              <span className="text-xs font-bold bg-white text-blue-800 px-2.5 py-0.5 rounded-full shadow-2xs">
                21:00
              </span>
            </div>
            <p className="text-xs text-blue-950/80 leading-relaxed">
              Recevez une notification chaque soir pour enregistrer votre journée au micro en 2 minutes.
            </p>
          </div>

          {/* Action button */}
          {!hasPermission ? (
            <button
              onClick={handleRequestPermission}
              className="w-full py-3.5 bg-neutral-900 hover:bg-black text-white rounded-2xl font-semibold text-sm shadow-md active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Bell size={16} />
              <span>Activer les notifications du navigateur</span>
            </button>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2 p-2.5 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-medium border border-emerald-200">
                <Check size={16} className="text-emerald-600" />
                <span>Notifications actives sur ce navigateur</span>
              </div>

              <button
                onClick={handleSendTestNotification}
                className="w-full py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-xl text-xs font-semibold transition-colors"
              >
                {testSent ? '✓ Notification de test envoyée !' : 'Tester la notification maintenant'}
              </button>
            </div>
          )}

          {/* iOS explanation callout */}
          <div className="p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200/80 flex items-start gap-3">
            <Smartphone size={20} className="text-neutral-600 mt-0.5 shrink-0" />
            <div className="text-xs text-neutral-600 space-y-1">
              <p className="font-semibold text-neutral-900">
                Installation sur iPhone (iOS PWA) :
              </p>
              <p className="leading-relaxed">
                Sur Safari iOS, les notifications push nécessitent d’ajouter l’application à l’écran d’accueil via le bouton <strong>Partager</strong> &gt; <strong>Sur l’écran d’accueil</strong>.
              </p>
            </div>
          </div>
        </div>

        {/* Close */}
        <button
          onClick={onClose}
          className="w-full py-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-2xl font-semibold text-xs transition-colors"
        >
          Fermer
        </button>

      </div>
    </div>
  );
};
