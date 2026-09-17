import { useState, useCallback } from 'react';
import { RevealCard } from '@/components/RevealCard';
import { ProgressDots } from '@/components/ProgressDots';
import { useSettings } from '@/context/SettingsContext';
import { playSound } from '@/lib/sound';
import type { GameState, GameScreen } from '@/types/game';
import { getPlayerById } from '@/lib/gameLogic';

interface CardRevealScreenProps {
  gameState: GameState;
  onComplete: () => void;
  onNavigate: (screen: GameScreen) => void;
}

export function CardRevealScreen({ gameState, onComplete, onNavigate }: CardRevealScreenProps) {
  const { settings } = useSettings();
  const anim = settings.animationsEnabled;
  const [currentIndex, setCurrentIndex] = useState(0);

  const player = getPlayerById(gameState, gameState.turnOrder[currentIndex]);
  const total = gameState.turnOrder.length;

  const handleHide = useCallback(() => {
    if (settings.soundEnabled) playSound('reveal');
    if (currentIndex < total - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      onComplete();
    }
  }, [currentIndex, total, onComplete, settings.soundEnabled]);

  if (!player || !gameState.category || !gameState.secretWord) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-white/60">Something went wrong. Let's go back.</p>
        <button onClick={() => onNavigate('HOME')} className="btn-primary">Back to Home</button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 py-8 gap-6">
      <div className={`flex flex-col items-center gap-2 ${anim ? 'animate-fade-in-down' : ''}`}>
        <p className="text-white/40 text-sm font-display font-bold uppercase tracking-wider">
          Player {currentIndex + 1} of {total}
        </p>
        <h2 className="font-display font-black text-3xl sm:text-4xl text-white text-center">
          {player.name}
        </h2>
      </div>

      <ProgressDots current={currentIndex} total={total} />

      <div className={`flex-1 flex items-center justify-center w-full ${anim ? 'animate-scale-in' : ''}`}>
        <RevealCard
          key={player.id}
          isImposter={player.role === 'IMPOSTER'}
          secretWord={gameState.secretWord}
          categoryName={gameState.category.name}
          categoryIcon={gameState.category.icon}
          onReveal={() => {}}
          onHide={handleHide}
        />
      </div>

      <p className="text-white/30 text-xs text-center max-w-xs">
        Make sure no one else can see your screen before tapping.
      </p>
    </div>
  );
}
