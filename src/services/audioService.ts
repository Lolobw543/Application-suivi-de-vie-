export class AudioVisualizerService {
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private mediaStream: MediaStream | null = null;
  private sourceNode: MediaStreamAudioSourceNode | null = null;
  private isRunning: boolean = false;

  public async startMicrophone(): Promise<boolean> {
    try {
      if (this.isRunning) return true;

      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) {
        return false;
      }

      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      this.audioContext = new AudioContextClass();
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }

      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 64;
      this.analyser.smoothingTimeConstant = 0.8;

      this.sourceNode = this.audioContext.createMediaStreamSource(this.mediaStream);
      this.sourceNode.connect(this.analyser);
      this.isRunning = true;
      return true;
    } catch (err) {
      console.warn('Audio Visualizer mic access not available, fallback will be used:', err);
      this.isRunning = false;
      return false;
    }
  }

  public getFrequencies(barCount: number = 24): number[] {
    if (!this.isRunning || !this.analyser) {
      // Fallback synthetic wave generator if mic stream is not active
      const now = Date.now() / 200;
      return Array.from({ length: barCount }, (_, i) => {
        const val = Math.sin(now + i * 0.4) * 0.4 + Math.cos(now * 1.5 + i * 0.2) * 0.3 + 0.3;
        return Math.max(0.1, Math.min(0.95, val));
      });
    }

    const bufferLength = this.analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    this.analyser.getByteFrequencyData(dataArray);

    // Downsample/interpolate to barCount
    const result: number[] = [];
    const step = Math.max(1, Math.floor(bufferLength / barCount));

    for (let i = 0; i < barCount; i++) {
      const idx = Math.min(bufferLength - 1, i * step);
      const rawVal = dataArray[idx] / 255;
      // Boost low-mids for better visual sensitivity
      const normalized = Math.min(1, Math.pow(rawVal, 0.85) * 1.25);
      result.push(Math.max(0.08, normalized));
    }

    return result;
  }

  public stop(): void {
    this.isRunning = false;
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => track.stop());
      this.mediaStream = null;
    }
    if (this.sourceNode) {
      this.sourceNode.disconnect();
      this.sourceNode = null;
    }
    if (this.audioContext) {
      try {
        this.audioContext.close();
      } catch (err) {
        console.warn('Error closing audioContext:', err);
      }
      this.audioContext = null;
    }
  }
}

export const audioVisualizerService = new AudioVisualizerService();
