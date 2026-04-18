"use client";

class AE86Chime {
  private audio: HTMLAudioElement | null = null;
  private isPlaying: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      this.audio = new Audio('/ae86_chime.mp3');
      this.audio.loop = true;
    }
  }

  public start() {
    if (this.isPlaying || !this.audio) return;
    
    this.isPlaying = true;
    this.audio.play().catch(err => {
      console.error("Audio playback failed:", err);
      this.isPlaying = false;
    });
  }

  public stop() {
    if (!this.isPlaying || !this.audio) return;
    
    this.isPlaying = false;
    this.audio.pause();
    this.audio.currentTime = 0;
  }
}

export const chime = new AE86Chime();