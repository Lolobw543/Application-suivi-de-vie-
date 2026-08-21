export const notificationService = {
  isSupported(): boolean {
    return 'Notification' in window;
  },

  getPermission(): NotificationPermission {
    if (!this.isSupported()) return 'denied';
    return Notification.permission;
  },

  async requestPermission(): Promise<boolean> {
    if (!this.isSupported()) {
      alert("Les notifications ne sont pas supportées par votre navigateur actuel.");
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    } catch (err) {
      console.warn('Error requesting notification permission:', err);
      return false;
    }
  },

  async scheduleEveningTestNotification(): Promise<void> {
    if (!this.isSupported() || Notification.permission !== 'granted') {
      const granted = await this.requestPermission();
      if (!granted) return;
    }

    // Trigger test feedback notification
    try {
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.ready.then((registration) => {
          registration.showNotification("Fil • Rappel du soir (21h00)", {
            body: "C'est l'heure de poser ta journée ! Prends 2 minutes pour raconter ton récit au micro.",
            icon: "/icon-192.png",
            badge: "/icon-192.png",
            tag: 'fil-evening-reminder',
          });
        });
      } else {
        new Notification("Fil • Rappel du soir (21h00)", {
          body: "C'est l'heure de poser ta journée ! Prends 2 minutes pour raconter ton récit au micro.",
          icon: "/icon-192.png",
        });
      }
    } catch (err) {
      console.warn('Notification trigger error:', err);
    }
  }
};
