"use client";
class AE86Chime {
  private audio: HTMLAudioElement | null = null;
  private isPlaying: boolean = false;
  private isMuted: boolean = false;
  private intervalId: number | null = null;
  private readonly INTERVAL_MS = 1360;

  private getAudio(): HTMLAudioElement | null {
    if (!this.audio && typeof window !== 'undefined') {
      this.audio = new Audio('./ae86_chime.mp3');
      this.audio.preload = 'auto';
    }
    return this.audio;
  }

  private playChime() {
    const audio = this.getAudio();
    if (!audio || this.isMuted) return;
    audio.currentTime = 0;
    audio.play().catch(err => {
      console.error("Audio playback failed:", err);
    });
  }

  public start() {
    if (this.isPlaying) return;
    const audio = this.getAudio();
    if (!audio) return;

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
