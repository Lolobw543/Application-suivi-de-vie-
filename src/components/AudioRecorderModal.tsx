import { useState, useEffect, useRef } from 'react';
import { X, Sparkles, Check, AlertCircle } from 'lucide-react';
import { AudioVisualizerBars } from './AudioVisualizerBars';
import { audioVisualizerService } from '../services/audioService';
import { speechService } from '../services/speechService';
import { analyzeJournalVoiceText } from '../services/localAnalysisEngine';
import type { AnalysisResult } from '../services/localAnalysisEngine';


interface AudioRecorderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAnalysisComplete: (result: AnalysisResult, rawTranscript: string, durationSeconds: number) => void;
  userDirection?: string;
}

export const AudioRecorderModal: React.FC<AudioRecorderModalProps> = ({
  isOpen,
  onClose,
  onAnalysisComplete,
  userDirection = 'Construire une vie plus créative',
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [transcript, setTranscript] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isManualEdit, setIsManualEdit] = useState(false);
  const timerRef = useRef<number | null>(null);

  const samplePhrases = [
    "J'ai tondu la pelouse, regardé une vidéo et appris DaVinci Resolve.",
    "Belle avancée sur le projet de design, 40 min de marche et lecture d'un chapitre.",
    "Journée intense au travail, mais j'ai pris le temps de cuisiner et de déconnecter ce soir.",
  ];

  // Start recording on open
  useEffect(() => {
    if (isOpen) {
      startRecording();
    } else {
      cleanup();
    }

    return () => {
      cleanup();
    };
  }, [isOpen]);

  // Timer loop
  useEffect(() => {
    if (isRecording) {
      timerRef.current = window.setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording]);

  const startRecording = async () => {
    setSeconds(0);
    setTranscript('');
    setErrorMessage(null);
    setIsAnalyzing(false);
    setIsRecording(true);

    // 1. Start audio visualizer
    await audioVisualizerService.startMicrophone();

    // 2. Start speech recognition
    const speechStarted = speechService.start({
      onTranscriptChange: (text) => {
        setTranscript(text);
      },
      onError: (err) => {
        setErrorMessage(err);
      },
      onEnd: () => {
        // Recognition ended
      },
    });

    if (!speechStarted && !speechService.isSupported()) {
      setErrorMessage("La transcription vocale directe n'est pas supportée sur ce navigateur. Tu peux taper ou utiliser les exemples ci-dessous !");
    }
  };

  const cleanup = () => {
    setIsRecording(false);
    audioVisualizerService.stop();
    speechService.stop();
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const handleStopAndAnalyze = async () => {
    cleanup();
    setIsAnalyzing(true);

    const finalRaw = (transcript || speechService.getTranscript()).trim() ||
      "J'ai tondu la pelouse, regardé une vidéo et appris DaVinci Resolve.";

    try {
      const result = await analyzeJournalVoiceText(finalRaw, userDirection);
      setIsAnalyzing(false);
      onAnalysisComplete(result, finalRaw, seconds || 35);
    } catch (err) {
      console.error('Analysis error:', err);
      setIsAnalyzing(false);
    }
  };

  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const applySamplePhrase = (phrase: string) => {
    setTranscript(phrase);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-md transition-all duration-300 animate-fadeIn">
      <div className="w-full max-w-[420px] bg-white rounded-t-[36px] sm:rounded-[36px] p-6 pb-9 shadow-2xl flex flex-col justify-between max-h-[92vh] overflow-y-auto border border-neutral-100">
        
        {/* Header modal */}
        <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
              Fil • Récit du soir
            </span>
          </div>
          <button
            onClick={() => {
              cleanup();
              onClose();
            }}
            className="w-9 h-9 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-600 hover:bg-neutral-200 transition-colors"
            aria-label="Fermer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Analyzing state */}
        {isAnalyzing ? (
          <div className="py-14 flex flex-col items-center justify-center text-center space-y-5">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-neutral-900 flex items-center justify-center text-white shadow-xl animate-pulse">
                <Sparkles size={32} className="text-amber-300 animate-spin" style={{ animationDuration: '4s' }} />
              </div>
              <div className="absolute -inset-2 rounded-full border-2 border-dashed border-neutral-300 animate-spin" style={{ animationDuration: '8s' }} />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-xl font-bold text-neutral-900 tracking-tight">
                Analyse de ta journée…
              </h3>
              <p className="text-sm text-neutral-500 max-w-[280px] mx-auto">
                Extraction des activités, apprentissages et alignement avec ton cap de vie.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-neutral-100 rounded-full text-xs text-neutral-600 font-medium">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              Analyse locale de démonstration
            </div>
          </div>
        ) : (
          /* Active Recording State */
          <div className="space-y-6 pt-4">
            
            {/* Title & subtitle */}
            <div className="text-center space-y-1">
              <h2 className="text-2xl font-bold text-neutral-900 tracking-tight">
                Je t’écoute.
              </h2>
              <p className="text-sm text-neutral-500">
                Raconte-moi simplement ta journée.
              </p>
            </div>

            {/* Audio Visualizer & Timer */}
            <div className="bg-neutral-50 rounded-3xl p-5 border border-neutral-100/80 flex flex-col items-center justify-center space-y-2">
              <div className="flex items-center gap-2 px-3 py-1 bg-red-50 text-red-600 rounded-full text-xs font-semibold border border-red-100">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span>Enregistrement • {formatTime(seconds)}</span>
              </div>

              <AudioVisualizerBars isRecording={isRecording} barCount={22} />

              <p className="text-[11px] text-neutral-400">
                Volume audio en direct (Web Audio API)
              </p>
            </div>

            {/* Live Transcript / Speech bubble */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-neutral-600">
                  Transcription en direct :
                </label>
                <button
                  onClick={() => setIsManualEdit(!isManualEdit)}
                  className="text-xs text-neutral-500 hover:text-neutral-900 underline"
                >
                  {isManualEdit ? 'Mode écoute' : 'Écrire au clavier'}
                </button>
              </div>

              {isManualEdit ? (
                <textarea
                  value={transcript}
                  onChange={(e) => setTranscript(e.target.value)}
                  placeholder="Tu peux taper ton récit ici..."
                  className="w-full h-24 p-3.5 bg-white rounded-2xl border border-neutral-200 text-sm text-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-900 resize-none shadow-sm"
                />
              ) : (
                <div className="min-h-[76px] p-3.5 bg-white rounded-2xl border border-neutral-200 text-sm text-neutral-800 shadow-sm flex items-center">
                  {transcript ? (
                    <p className="text-neutral-800 leading-relaxed font-normal">
                      « {transcript} »
                    </p>
                  ) : (
                    <p className="text-neutral-400 italic text-xs">
                      Parle naturellement… Ton texte apparaîtra ici au fur et à mesure.
                    </p>
                  )}
                </div>
              )}

              {errorMessage && (
                <div className="flex items-start gap-2 p-2.5 bg-amber-50 rounded-xl text-amber-800 text-xs border border-amber-200">
                  <AlertCircle size={15} className="mt-0.5 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}
            </div>

            {/* Quick sample chips */}
            <div className="space-y-1.5">
              <p className="text-[11px] font-medium text-neutral-400">
                💡 Exemples rapides à tester :
              </p>
              <div className="flex flex-col gap-1.5">
                {samplePhrases.map((phrase, idx) => (
                  <button
                    key={idx}
                    onClick={() => applySamplePhrase(phrase)}
                    className="text-left text-xs bg-neutral-100 hover:bg-neutral-200 text-neutral-700 px-3 py-1.5 rounded-xl transition-colors truncate border border-neutral-200/50"
                  >
                    « {phrase} »
                  </button>
                ))}
              </div>
            </div>

            {/* Actions bottom */}
            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={handleStopAndAnalyze}
                className="flex-1 py-4 bg-neutral-900 hover:bg-black text-white rounded-full font-semibold text-base shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <Check size={20} className="text-emerald-400" />
                <span>Terminer le récit</span>
              </button>

              <button
                onClick={() => {
                  if (isRecording) {
                    handleStopAndAnalyze();
                  } else {
                    startRecording();
                  }
                }}
                className="w-14 h-14 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-lg active:scale-95 transition-all shrink-0"
                title="Arrêter et analyser"
              >
                <div className="w-5 h-5 bg-white rounded-sm" />
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
