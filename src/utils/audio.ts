"use client";

class AE86Chime {
  private audioCtx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private intervalId: number | null = null;

  private init() {
    if (!this.audioCtx) {
      this.audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  private playTone(freq: number, startTime: number, duration: number) {
    if (!this.audioCtx) return;
    
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, startTime);
    
    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(0.2, startTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);

    osc.start(startTime);
    osc.stop(startTime + duration);
  }

  private playDingDong() {
    this.init();
    if (!this.audioCtx) return;
    
    const now = this.audioCtx.currentTime;
    // The classic AE86 chime is roughly two tones
    this.playTone(1100, now, 0.4); // Ding
    this.playTone(880, now + 0.5, 0.4); // Dong
  }

  public start() {
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.playDingDong();
    this.intervalId = window.setInterval(() => {
      this.playDingDong();
    }, 1200);
  }

  public stop() {
    this.isPlaying = false;
    if (this.intervalId) {
      window.clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}

export const chime = new AE86Chime();