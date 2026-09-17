import { useEffect } from 'react';
import { Button } from '@/components/Button';
import { useSettings } from '@/context/SettingsContext';
import { playSound } from '@/lib/sound';
import type { GameState, GameScreen } from '@/types/game';
import { getImposter, getPlayerById } from '@/lib/gameLogic';

interface ResultsScreenProps {
  gameState: GameState;
  onPlayAgain: () => void;
  onNavigate: (screen: GameScreen) => void;
}

export function ResultsScreen({ gameState, onPlayAgain, onNavigate }: ResultsScreenProps) {
  const { settings } = useSettings();
  const anim = settings.animationsEnabled;
  const result = gameState.result;
  const imposter = getImposter(gameState);
  const guessed = getPlayerById(gameState, gameState.selectedGuessId);

  useEffect(() => {
    if (result && settings.soundEnabled) {
      playSound(result.correct ? 'correct' : 'incorrect');
    }
  }, [result, settings.soundEnabled]);

  if (!result || !imposter) return null;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 py-8 text-center gap-8">
      <div className={`flex flex-col items-center gap-4 ${anim ? 'animate-scale-in' : ''}`}>
        {result.correct ? (
          <>
            <div className={`text-8xl ${anim ? 'animate-bounce-in' : ''}`}>🎉</div>
            <h2 className="font-display font-black text-4xl sm:text-5xl text-success-400 glow-text">
              You Found the Imposter!
            </h2>
            <p className="text-white/60 text-lg max-w-sm">
              The group correctly identified{' '}
              <span className="font-bold text-danger-400">{imposter.name}</span>.
            </p>
          </>
        ) : (
          <>
            <div className={`text-8xl ${anim ? 'animate-bounce-in' : ''}`}>🏃</div>
            <h2 className="font-display font-black text-4xl sm:text-5xl text-danger-400 glow-text">
              The Imposter Got Away!
            </h2>
            <p className="text-white/60 text-lg max-w-sm">
              The group voted for{' '}
              <span className="font-bold text-white">{guessed?.name}</span>, but the actual Imposter was{' '}
              <span className="font-bold text-danger-400">{imposter.name}</span>.
            </p>
          </>
        )}
      </div>

      <div className={`card-surface px-6 py-5 flex flex-col items-center gap-2 ${anim ? 'animate-fade-in-up' : ''}`}>
        <p className="text-white/40 text-xs font-display font-bold uppercase tracking-wider">Secret Word</p>
        <div className="text-5xl">{gameState.category?.icon}</div>
        <p className="font-display font-black text-2xl text-white">{gameState.secretWord}</p>
        <p className="text-white/40 text-sm">{gameState.category?.name}</p>
      </div>

      <div className="flex flex-col gap-3 w-full max-w-xs">
        <Button fullWidth onClick={onPlayAgain}>
          Play Again
        </Button>
        <Button variant="secondary" fullWidth onClick={() => onNavigate('HOME')}>
          Back to Home
        </Button>
      </div>
    </div>
  );
}
