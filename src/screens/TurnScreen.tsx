import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/Button';
import { ProgressDots } from '@/components/ProgressDots';
import { useSettings } from '@/context/SettingsContext';
import { playSound } from '@/lib/sound';
import type { GameState } from '@/types/game';
import { getPlayerById } from '@/lib/gameLogic';

interface TurnScreenProps {
  gameState: GameState;
  onNextTurn: () => void;
  onAllTurnsComplete: () => void;
}

export function TurnScreen({ gameState, onNextTurn, onAllTurnsComplete }: TurnScreenProps) {
  const { settings } = useSettings();
  const anim = settings.animationsEnabled;
  const [announcing, setAnnouncing] = useState(true);

  const player = getPlayerById(gameState, gameState.turnOrder[gameState.currentTurnIndex]);
  const total = gameState.turnOrder.length;

  useEffect(() => {
    setAnnouncing(true);
    if (settings.soundEnabled) playSound('turnTransition');
    const t = setTimeout(() => setAnnouncing(false), 1500);
    return () => clearTimeout(t);
  }, [gameState.currentTurnIndex, settings.soundEnabled]);

  const handleNext = useCallback(() => {
    if (gameState.currentTurnIndex < total - 1) {
      onNextTurn();
    } else {
      onAllTurnsComplete();
    }
  }, [gameState.currentTurnIndex, total, onNextTurn, onAllTurnsComplete]);

  if (!player) return null;

  if (announcing) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center gap-6">
        <p className={`text-white/40 text-lg font-display font-bold uppercase tracking-wider ${anim ? 'animate-fade-in' : ''}`}>
          {gameState.currentTurnIndex === 0 ? 'First up...' : 'Next up...'}
        </p>
        <h2 className={`font-display font-black text-5xl sm:text-6xl text-white glow-text ${anim ? 'animate-bounce-in' : ''}`}>
          {player.name}
        </h2>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center gap-8">
      <div className="flex flex-col items-center gap-2">
        <p className="text-white/40 text-sm font-display font-bold uppercase tracking-wider">
          Turn {gameState.currentTurnIndex + 1} of {total}
        </p>
        <ProgressDots current={gameState.currentTurnIndex} total={total} />
      </div>

      <div className={`flex flex-col items-center gap-4 ${anim ? 'animate-scale-in' : ''}`}>
        <div className="text-6xl">🗣️</div>
        <h2 className="font-display font-black text-4xl sm:text-5xl text-white">
          {player.name}'s Turn
        </h2>
        <p className="text-white/60 text-lg max-w-sm">
          Give one clue about the secret word.
        </p>
      </div>

      <div className="w-full max-w-xs flex flex-col gap-3">
        <Button fullWidth onClick={handleNext}>
          {gameState.currentTurnIndex < total - 1 ? 'Next Player' : 'Move to Voting'}
        </Button>
      </div>
    </div>
  );
}
