import { useSyncExternalStore } from 'react';

export type TimeSignatureOption = '4/4' | '3/4' | '6/8' | '2/4';

export interface MetronomeState {
  readonly running: boolean;
  readonly bpm: number;
  readonly timeSignature: TimeSignatureOption;
  readonly beatsPerBar: number;
  readonly currentBeat: number;
  readonly accentFirstBeat: boolean;
}

const BEATS_MAP: Record<TimeSignatureOption, number> = {
  '2/4': 2,
  '3/4': 3,
  '4/4': 4,
  '6/8': 6,
};

let state: MetronomeState = {
  running: false,
  bpm: 72,
  timeSignature: '4/4',
  beatsPerBar: 4,
  currentBeat: 0,
  accentFirstBeat: true,
};

const listeners = new Set<() => void>();
let audioCtx: AudioContext | null = null;
let schedulerTimer: number | null = null;
let nextNoteTime = 0;
let scheduledBeatIndex = 0;
let tapTimestamps: number[] = [];

function emit(): void {
  for (const listener of listeners) listener();
}

function setState(updater: (prev: MetronomeState) => MetronomeState): void {
  state = updater(state);
  emit();
}

function getContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (audioCtx) {
    if (audioCtx.state === 'suspended') {
      void audioCtx.resume();
    }
    return audioCtx;
  }
  const Ctor =
    window.AudioContext ??
    (window as unknown as { readonly webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  audioCtx = new Ctor();
  return audioCtx;
}

function scheduleClick(time: number, beatIndex: number, isAccented: boolean): void {
  const ctx = getContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = isAccented ? 'triangle' : 'sine';
  osc.frequency.setValueAtTime(isAccented ? 1280 : 880, time);

  gain.gain.setValueAtTime(0.0001, time);
  gain.gain.linearRampToValueAtTime(isAccented ? 0.34 : 0.2, time + 0.002);
  gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.055);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(time);
  osc.stop(time + 0.06);

  // Actualiza el pulso visual sincronizado con el tiempo exacto de AudioContext.
  const delayMs = Math.max(0, (time - ctx.currentTime) * 1000);
  window.setTimeout(() => {
    if (!state.running) return;
    setState((prev) => ({ ...prev, currentBeat: beatIndex }));
  }, delayMs);
}

function schedulerLoop(): void {
  const ctx = getContext();
  if (!ctx || !state.running) return;

  const secondsPerBeat =
    state.timeSignature === '6/8' ? 60 / state.bpm / 2 : 60 / state.bpm;
  const lookaheadHorizon = 0.1;

  while (nextNoteTime < ctx.currentTime + lookaheadHorizon) {
    const beat = scheduledBeatIndex % state.beatsPerBar;
    const isAccented = state.accentFirstBeat && beat === 0;
    scheduleClick(nextNoteTime, beat, isAccented);
    nextNoteTime += secondsPerBeat;
    scheduledBeatIndex += 1;
  }
}

export function startMetronome(): void {
  const ctx = getContext();
  if (!ctx) return;
  if (schedulerTimer !== null) {
    window.clearInterval(schedulerTimer);
    schedulerTimer = null;
  }
  scheduledBeatIndex = 0;
  nextNoteTime = ctx.currentTime + 0.04;
  setState((prev) => ({ ...prev, running: true, currentBeat: 0 }));
  schedulerLoop();
  schedulerTimer = window.setInterval(schedulerLoop, 25);
}

export function stopMetronome(): void {
  if (schedulerTimer !== null) {
    window.clearInterval(schedulerTimer);
    schedulerTimer = null;
  }
  setState((prev) => ({ ...prev, running: false, currentBeat: 0 }));
}

export function toggleMetronome(): void {
  if (state.running) stopMetronome();
  else startMetronome();
}

export function setMetronomeBpm(bpm: number): void {
  const clamped = Math.min(220, Math.max(40, Math.round(bpm)));
  setState((prev) => ({ ...prev, bpm: clamped }));
}

export function setMetronomeSignature(sig: TimeSignatureOption): void {
  scheduledBeatIndex = 0;
  setState((prev) => ({
    ...prev,
    timeSignature: sig,
    beatsPerBar: BEATS_MAP[sig],
    currentBeat: 0,
  }));
}

export function toggleMetronomeAccent(): void {
  setState((prev) => ({ ...prev, accentFirstBeat: !prev.accentFirstBeat }));
}

export function tapMetronomeTempo(): number {
  const now = performance.now();
  const last = tapTimestamps[tapTimestamps.length - 1];
  if (last !== undefined && now - last > 2200) {
    tapTimestamps = [];
  }
  tapTimestamps.push(now);
  if (tapTimestamps.length > 6) {
    tapTimestamps = tapTimestamps.slice(-6);
  }
  if (tapTimestamps.length < 2) return state.bpm;

  let sum = 0;
  for (let i = 1; i < tapTimestamps.length; i += 1) {
    sum += (tapTimestamps[i] ?? 0) - (tapTimestamps[i - 1] ?? 0);
  }
  const avgMs = sum / (tapTimestamps.length - 1);
  const nextBpm = Math.min(220, Math.max(40, Math.round(60000 / avgMs)));
  setMetronomeBpm(nextBpm);
  return nextBpm;
}

export function syncMetronomeToSong(bpm?: number, timeSig?: string): void {
  if (bpm && bpm >= 40 && bpm <= 220) {
    setMetronomeBpm(bpm);
  }
  if (timeSig === '2/4' || timeSig === '3/4' || timeSig === '4/4' || timeSig === '6/8') {
    setMetronomeSignature(timeSig);
  }
}

export function useMetronomeState(): MetronomeState {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    () => state,
  );
}
