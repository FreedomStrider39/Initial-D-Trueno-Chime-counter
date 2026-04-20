"use client";

class AE86Chime {
  private audio: HTMLAudioElement | null = null;
  private isPlaying: boolean = false;
  private isMuted: boolean = false;
  private intervalId: number | null = null;
  private readonly INTERVAL_MS = 1360; // 1.36 seconds (approx 44 BPM)

  constructor() {
    if (typeof window !== 'undefined') {
      this.audio = new Audio('./ae86_chime.mp3');
      this.audio.preload = 'auto';
    }
  }

  /**
   * Mobile browsers require a user interaction to "unlock" audio playback.
   * This should be called on the first button click.
   */
  public unlock() {
    if (!this.audio) return;
    
    // Play and immediately pause to satisfy browser security policies
    const promise = this.audio.play();
    if (promise !== undefined) {
      promise.then(() => {
        this.audio?.pause();
        if (this.audio) this.audio.currentTime = 0;
        console.log("Audio system unlocked");
      }).catch(err => {
        console.error("Audio unlock failed:", err);
      });
    }
  }

  private playChime() {
    if (!this.audio || this.isMuted) return;
    
    // Reset and play
    this.audio.currentTime = 0;
    this.audio.play().catch(err => {
      // This might happen if the user hasn't interacted yet
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