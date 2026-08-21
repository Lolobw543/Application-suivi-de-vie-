// Web Speech API interface definitions
interface IWindowWithSpeech extends Window {
  SpeechRecognition?: any;
  webkitSpeechRecognition?: any;
}

export interface SpeechRecognitionHandlers {
  onTranscriptChange: (transcript: string, isFinal: boolean) => void;
  onError: (error: string) => void;
  onEnd: () => void;
}

export class SpeechService {
  private recognition: any = null;
  private isListening: boolean = false;
  private fullTranscript: string = '';

  public isSupported(): boolean {
    const win = window as IWindowWithSpeech;
    return !!(win.SpeechRecognition || win.webkitSpeechRecognition);
  }

  public start(handlers: SpeechRecognitionHandlers): boolean {
    const win = window as IWindowWithSpeech;
    const SpeechRecognitionClass = win.SpeechRecognition || win.webkitSpeechRecognition;

    if (!SpeechRecognitionClass) {
      handlers.onError("La reconnaissance vocale n'est pas supportée par ce navigateur.");
      return false;
    }

    try {
      this.recognition = new SpeechRecognitionClass();
      this.recognition.lang = 'fr-FR';
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.maxAlternatives = 1;

      this.fullTranscript = '';
      this.isListening = true;

      this.recognition.onresult = (event: any) => {
        let interim = '';
        let finalSegment = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const text = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalSegment += text + ' ';
          } else {
            interim += text;
          }
        }

        if (finalSegment) {
          this.fullTranscript += finalSegment;
        }

        const currentDisplay = (this.fullTranscript + (interim ? ' ' + interim : '')).trim();
        handlers.onTranscriptChange(currentDisplay, !!finalSegment && !interim);
      };

      this.recognition.onerror = (event: any) => {
        console.warn('Speech recognition event error:', event.error);
        if (event.error === 'not-allowed') {
          handlers.onError("Accès au microphone refusé. Autorisez l'accès pour dicter votre récit.");
        } else if (event.error === 'no-speech') {
          // Ignore silence error
        } else {
          handlers.onError(`Erreur audio : ${event.error}`);
        }
      };

      this.recognition.onend = () => {
        if (this.isListening) {
          // Restart if still in listening mode (e.g. mobile auto-pause)
          try {
            this.recognition?.start();
          } catch {
            this.isListening = false;
            handlers.onEnd();
          }
        } else {
          handlers.onEnd();
        }
      };

      this.recognition.start();
      return true;
    } catch (err: any) {
      console.error('Failed to start speech recognition:', err);
      handlers.onError("Impossible d'initialiser la reconnaissance vocale.");
      return false;
    }
  }

  public stop(): string {
    this.isListening = false;
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (err) {
        console.warn('Error stopping recognition:', err);
      }
      this.recognition = null;
    }
    return this.fullTranscript.trim();
  }

  public getTranscript(): string {
    return this.fullTranscript.trim();
  }
}

export const speechService = new SpeechService();
