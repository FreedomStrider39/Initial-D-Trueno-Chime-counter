"use client";

class AE86Chime {
  private audio: HTMLAudioElement | null = null;
  private isPlaying: boolean = false;
  private isMuted: boolean = false;
  private intervalId: number | null = null;
  private readonly INTERVAL_MS = 1360; // 1.36 seconds (approx 44 BPM)

  constructor() {
    if (typeof window !== 'undefined') {
      this.audio = new Audio('/ae86_chime.mp3');
      // Set to ambient-like behavior for web
      this.audio.preload = 'auto';
    }
  }

  private playChime() {
    if (!this.audio || this.isMuted) return;
    this.audio.currentTime = 0;
    this.audio.play().catch(err => {
      console.error("Audio playback failed:", err);
    });
  }

  public start() {
    if (this.isPlaying || !this.audio) return;
    
    this.isPlaying = true;
    this.playChime();
    this.intervalId = window.setInterval(() => {
      this.playChime();
    }, this.INTERVAL_MS);
  }

  public stop() {
    if (!this.isPlaying) return;
    
    this.isPlaying = false;
    if (this.intervalId) {
      window.clearInterval(this.intervalId);
      this.intervalId = null;
    }
    
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
    }
  }

  public toggleMute() {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  public getMuteStatus() {
    return this.isMuted;
  }
}

export const chime = new AE86Chime();