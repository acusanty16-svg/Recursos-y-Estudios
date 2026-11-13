// Sintetizador ligero con Web Audio API para feedback táctil y de videojuegos sin archivos externos

class SoundManager {
  constructor() {
    this.ctx = null;
    this.muted = false;
    try {
      const saved = localStorage.getItem('icaf_sound_muted');
      if (saved !== null) this.muted = JSON.parse(saved);
    } catch {
      // ignore
    }
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setMuted(muteState) {
    this.muted = muteState;
    try {
      localStorage.setItem('icaf_sound_muted', JSON.stringify(muteState));
    } catch {
      // ignore
    }
  }

  playTone(freq, type = 'sine', duration = 0.12, volume = 0.12, delay = 0) {
    if (this.muted) return;
    try {
      this.init();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const startTime = this.ctx.currentTime + delay;

      osc.type = type;
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(volume, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration);
    } catch {
      // ignore audio context restrictions
    }
  }

  playClick() {
    this.playTone(520, 'sine', 0.05, 0.06, 0);
  }

  playCorrect(combo = 1) {
    const base = 440 + Math.min(combo, 6) * 45;
    this.playTone(base, 'triangle', 0.11, 0.12, 0);
    this.playTone(base * 1.25, 'triangle', 0.16, 0.12, 0.06);
  }

  playWrong() {
    this.playTone(190, 'sawtooth', 0.14, 0.09, 0);
    this.playTone(155, 'sawtooth', 0.18, 0.09, 0.08);
  }

  playWin() {
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((n, idx) => {
      this.playTone(n, 'triangle', 0.22, 0.14, idx * 0.08);
    });
  }
}

export const soundFX = new SoundManager();
