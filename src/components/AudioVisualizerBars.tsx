import React, { useEffect, useState } from 'react';
import { audioVisualizerService } from '../services/audioService';

interface AudioVisualizerBarsProps {
  isRecording: boolean;
  barCount?: number;
}

export const AudioVisualizerBars: React.FC<AudioVisualizerBarsProps> = ({
  isRecording,
  barCount = 20,
}) => {
  const [amplitudes, setAmplitudes] = useState<number[]>(() =>
    Array.from({ length: barCount }, () => 0.15)
  );

  useEffect(() => {
    let animationFrameId: number;

    const updateFrequencies = () => {
      if (isRecording) {
        const freqs = audioVisualizerService.getFrequencies(barCount);
        setAmplitudes(freqs);
        animationFrameId = requestAnimationFrame(updateFrequencies);
      } else {
        setAmplitudes(Array.from({ length: barCount }, () => 0.12));
      }
    };

    if (isRecording) {
      animationFrameId = requestAnimationFrame(updateFrequencies);
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isRecording, barCount]);

  return (
    <div className="flex items-center justify-center gap-[5px] h-20 px-4 py-2 w-full max-w-[320px] mx-auto">
      {amplitudes.map((amp, idx) => {
        // Compute bar height in px (min 8px, max 68px)
        const height = Math.max(8, Math.min(68, Math.round(amp * 70)));
        // Subtle color hue shift for visual delight
        const isCenter = idx >= 6 && idx <= 14;

        return (
          <div
            key={idx}
            className="w-[5px] rounded-full transition-all duration-75 ease-out"
            style={{
              height: `${height}px`,
              backgroundColor: isCenter ? '#111827' : '#4B5563',
              opacity: isRecording ? Math.max(0.4, amp * 1.2) : 0.25,
              transform: isRecording ? `scaleY(${Math.max(0.6, amp * 1.1)})` : 'scaleY(1)',
              transformOrigin: 'center',
            }}
          />
        );
      })}
    </div>
  );
};
