import { useState, useEffect } from 'react';
import { useSettings } from '@/context/SettingsContext';
import { playSound } from '@/lib/sound';
import type { GameState } from '@/types/game';
import { getImposter } from '@/lib/gameLogic';

interface RevealScreenProps {
  gameState: GameState;
  onRevealComplete: () => void;
}

type Phase = 'moment' | 'was' | 'reveal' | 'word';

export function RevealScreen({ gameState, onRevealComplete }: RevealScreenProps) {
  const { settings } = useSettings();
  const anim = settings.animationsEnabled;
  const [phase, setPhase] = useState<Phase>('moment');

  const imposter = getImposter(gameState);

  useEffect(() => {
    if (settings.soundEnabled) playSound('suspense');
    const timers: ReturnType<typeof setTimeout>[] = [];
    timers.push(setTimeout(() => setPhase('was'), 1500));
    timers.push(setTimeout(() => setPhase('reveal'), 3000));
    if (settings.soundEnabled) timers.push(setTimeout(() => playSound('finalReveal'), 3000));
    timers.push(setTimeout(() => setPhase('word'), 5000));
    timers.push(setTimeout(() => onRevealComplete(), 7000));
    return () => timers.forEach(clearTimeout);
  }, [onRevealComplete, settings.soundEnabled]);

  if (!imposter || !gameState.secretWord || !gameState.category) return null;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center gap-6">
      {phase === 'moment' && (
        <div className={anim ? 'animate-fade-in' : ''}>
          <p className="text-6xl mb-4">⏳</p>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-white/80">
            The moment of truth...
          </h2>
        </div>
      )}

      {phase === 'was' && (
        <div className={anim ? 'animate-fade-in' : ''}>
          <p className="text-5xl mb-4">🎭</p>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-white">
            The Imposter was...
          </h2>
        </div>
      )}

      {phase === 'reveal' && (
        <div className="flex flex-col items-center gap-4">
          <div className={`text-8xl ${anim ? 'animate-bounce-in' : ''} drop-shadow-[0_0_30px_rgba(239,68,68,0.6)]`}>
            😈
          </div>
          <h2 className={`font-display font-black text-5xl sm:text-6xl text-danger-400 glow-text ${anim ? 'animate-bounce-in' : ''}`}>
            {imposter.name}
          </h2>
        </div>
      )}

      {phase === 'word' && (
        <div className="flex flex-col items-center gap-6">
          <div className="flex flex-col items-center gap-3">
            <p className="text-white/50 text-sm font-display font-bold uppercase tracking-wider">
              The Secret Word Was
            </p>
            <div className={`text-7xl ${anim ? 'animate-bounce-in' : ''}`}>{gameState.category.icon}</div>
            <h2 className={`font-display font-black text-4xl sm:text-5xl text-white glow-text ${anim ? 'animate-bounce-in' : ''}`}>
              {gameState.secretWord}
            </h2>
            <p className="text-white/40 text-sm">{gameState.category.name}</p>
          </div>
        </div>
      )}
    </div>
  );
}
