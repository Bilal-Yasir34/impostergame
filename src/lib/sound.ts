let soundEnabled = true;

export function setSoundEnabled(enabled: boolean): void {
  soundEnabled = enabled;
}

type SoundType =
  | 'click'
  | 'cardFlip'
  | 'reveal'
  | 'suspense'
  | 'turnTransition'
  | 'finalReveal'
  | 'correct'
  | 'incorrect';

// Web Audio API based sound generator — no external assets needed
let audioCtx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    try {
      audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    } catch {
      return null;
    }
  }
  return audioCtx;
}

function playTone(freq: number, duration: number, type: OscillatorType = 'sine', volume = 0.15, delay = 0): void {
  if (!soundEnabled) return;
  const ctx = getCtx();
  if (!ctx) return;
  if (ctx.state === 'suspended') ctx.resume();

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0, ctx.currentTime + delay);
  gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + delay + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(ctx.currentTime + delay);
  osc.stop(ctx.currentTime + delay + duration);
}

function playSequence(notes: { freq: number; dur: number; type?: OscillatorType; vol?: number; delay: number }[]): void {
  notes.forEach(n => playTone(n.freq, n.dur, n.type, n.vol, n.delay));
}

export function playSound(type: SoundType): void {
  if (!soundEnabled) return;
  switch (type) {
    case 'click':
      playTone(600, 0.08, 'sine', 0.1);
      break;
    case 'cardFlip':
      playSequence([
        { freq: 400, dur: 0.1, type: 'sine', vol: 0.12, delay: 0 },
        { freq: 800, dur: 0.1, type: 'sine', vol: 0.1, delay: 0.05 },
      ]);
      break;
    case 'reveal':
      playSequence([
        { freq: 523, dur: 0.15, type: 'triangle', vol: 0.12, delay: 0 },
        { freq: 659, dur: 0.15, type: 'triangle', vol: 0.12, delay: 0.1 },
        { freq: 784, dur: 0.2, type: 'triangle', vol: 0.12, delay: 0.2 },
      ]);
      break;
    case 'suspense':
      playSequence([
        { freq: 200, dur: 0.5, type: 'sawtooth', vol: 0.06, delay: 0 },
        { freq: 250, dur: 0.5, type: 'sawtooth', vol: 0.06, delay: 0.3 },
        { freq: 300, dur: 0.5, type: 'sawtooth', vol: 0.06, delay: 0.6 },
      ]);
      break;
    case 'turnTransition':
      playSequence([
        { freq: 440, dur: 0.12, type: 'triangle', vol: 0.1, delay: 0 },
        { freq: 660, dur: 0.15, type: 'triangle', vol: 0.1, delay: 0.08 },
      ]);
      break;
    case 'finalReveal':
      playSequence([
        { freq: 150, dur: 0.6, type: 'sawtooth', vol: 0.08, delay: 0 },
        { freq: 200, dur: 0.6, type: 'sawtooth', vol: 0.08, delay: 0.4 },
        { freq: 300, dur: 0.8, type: 'sawtooth', vol: 0.1, delay: 0.8 },
        { freq: 523, dur: 0.4, type: 'triangle', vol: 0.15, delay: 1.2 },
        { freq: 784, dur: 0.6, type: 'triangle', vol: 0.15, delay: 1.4 },
      ]);
      break;
    case 'correct':
      playSequence([
        { freq: 523, dur: 0.15, type: 'triangle', vol: 0.12, delay: 0 },
        { freq: 659, dur: 0.15, type: 'triangle', vol: 0.12, delay: 0.12 },
        { freq: 784, dur: 0.15, type: 'triangle', vol: 0.12, delay: 0.24 },
        { freq: 1047, dur: 0.3, type: 'triangle', vol: 0.15, delay: 0.36 },
      ]);
      break;
    case 'incorrect':
      playSequence([
        { freq: 300, dur: 0.2, type: 'sawtooth', vol: 0.12, delay: 0 },
        { freq: 250, dur: 0.2, type: 'sawtooth', vol: 0.12, delay: 0.15 },
        { freq: 200, dur: 0.4, type: 'sawtooth', vol: 0.12, delay: 0.3 },
      ]);
      break;
  }
}
