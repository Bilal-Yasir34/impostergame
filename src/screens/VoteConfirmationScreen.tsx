import { Button } from '@/components/Button';
import { useSettings } from '@/context/SettingsContext';
import type { GameState } from '@/types/game';
import { getPlayerById } from '@/lib/gameLogic';

interface VoteConfirmationScreenProps {
  gameState: GameState;
  onConfirm: () => void;
  onChange: () => void;
}

export function VoteConfirmationScreen({ gameState, onConfirm, onChange }: VoteConfirmationScreenProps) {
  const { settings } = useSettings();
  const anim = settings.animationsEnabled;
  const guessedPlayer = getPlayerById(gameState, gameState.selectedGuessId);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center gap-8">
      <div className={`flex flex-col items-center gap-4 ${anim ? 'animate-scale-in' : ''}`}>
        <div className="text-6xl">🤔</div>
        <h2 className="font-display font-black text-3xl sm:text-4xl text-white">Are you sure?</h2>
        <p className="text-white/60 text-lg">
          You're voting for <span className="font-display font-bold text-accent-400">{guessedPlayer?.name}</span>
        </p>
        <p className="text-white/40 text-sm">Once locked in, the vote cannot be changed.</p>
      </div>

      <div className="flex flex-col gap-3 w-full max-w-xs">
        <Button fullWidth onClick={onConfirm}>
          Yes, Lock It In
        </Button>
        <Button variant="secondary" fullWidth onClick={onChange}>
          Change Guess
        </Button>
      </div>
    </div>
  );
}
