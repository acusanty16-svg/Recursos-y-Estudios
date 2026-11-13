/**
 * Síntesis acústica ligera mediante Web Audio API para escuchar notas del diapasón
 * y rasgueos de acordes sin archivos MP3 ni dependencias externas.
 */

import { midiToFrequency } from '../model/music';

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctx) return null;
  if (!audioCtx) {
    audioCtx = new Ctx();
  }
  if (audioCtx.state === 'suspended') {
    void audioCtx.resume();
  }
  return audioCtx;
}

export function playGuitarFrequency(frequency: number, duration = 1.35, startOffset = 0, gainPeak = 0.22): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime + startOffset;

  const oscMain = ctx.createOscillator();
  const oscHarmonic = ctx.createOscillator();
  const filter = ctx.createBiquadFilter();
  const gain = ctx.createGain();

  oscMain.type = 'triangle';
  oscMain.frequency.setValueAtTime(frequency, now);

  oscHarmonic.type = 'sawtooth';
  oscHarmonic.frequency.setValueAtTime(frequency * 2, now);

  const harmonicGain = ctx.createGain();
  harmonicGain.gain.setValueAtTime(0.2, now);
  harmonicGain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);

  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(Math.min(4200, frequency * 7), now);
  filter.frequency.exponentialRampToValueAtTime(Math.max(450, frequency * 1.8), now + duration * 0.85);
  filter.Q.setValueAtTime(1.2, now);

  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.linearRampToValueAtTime(gainPeak, now + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0008, now + duration);

  oscMain.connect(filter);
  oscHarmonic.connect(harmonicGain);
  harmonicGain.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  oscMain.start(now);
  oscHarmonic.start(now);
  oscMain.stop(now + duration + 0.05);
  oscHarmonic.stop(now + duration + 0.05);
}

export function playGuitarMidi(midi: number, duration = 1.35): void {
  playGuitarFrequency(midiToFrequency(midi), duration, 0, 0.24);
}

export function strumGuitarChord(midiNotes: readonly number[]): void {
  if (midiNotes.length === 0) return;
  midiNotes.forEach((midi, index) => {
    playGuitarFrequency(midiToFrequency(midi), 1.75, index * 0.042, 0.14);
  });
}
