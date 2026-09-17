import { useState, useCallback } from 'react';
import { Button } from '@/components/Button';
import { useSettings } from '@/context/SettingsContext';
import { playSound } from '@/lib/sound';
import type { GameState } from '@/types/game';
import { getPlayerById } from '@/lib/gameLogic';

interface VotingScreenProps {
  gameState: GameState;
  onVoteSelected: (playerId: string) => void;
}

export function VotingScreen({ gameState, onVoteSelected }: VotingScreenProps) {
  const { settings } = useSettings();
  const anim = settings.animationsEnabled;
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleSelect = useCallback((id: string) => {
    setSelectedId(id);
    if (settings.soundEnabled) playSound('click');
  }, [settings.soundEnabled]);

  const handleLockIn = useCallback(() => {
    if (selectedId) {
      onVoteSelected(selectedId);
    }
  }, [selectedId, onVoteSelected]);

  return (
    <div className="flex flex-col min-h-screen px-6 py-8 gap-6 max-w-lg mx-auto">
      <div className={`text-center ${anim ? 'animate-fade-in-down' : ''}`}>
        <p className="text-6xl mb-3">🗳️</p>
        <h2 className="font-display font-black text-3xl sm:text-4xl text-white">
          Who's the Imposter?
        </h2>
        <p className="text-white/50 mt-2">Time to make your guess.</p>
      </div>

      <div className="flex-1 flex flex-col gap-2.5 overflow-y-auto">
        {gameState.players.map((player, i) => (
          <button
            key={player.id}
            onClick={() => handleSelect(player.id)}
            className={`card-surface px-5 py-4 flex items-center gap-4 transition-all duration-200 text-left ${
              selectedId === player.id
                ? 'border-accent-500 bg-accent-500/10 scale-[1.02]'
                : 'hover:border-white/20'
            } ${anim ? 'animate-fade-in-up' : ''}`}
            style={anim ? { animationDelay: `${i * 0.05}s` } : undefined}
          >
            <div
              className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                selectedId === player.id ? 'border-accent-500 bg-accent-500' : 'border-white/30'
              }`}
            >
              {selectedId === player.id && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
            </div>
            <span className="font-display font-bold text-lg text-white">{player.name}</span>
          </button>
        ))}
      </div>

      {selectedId && (
        <div className={`flex flex-col items-center gap-3 ${anim ? 'animate-fade-in-up' : ''}`}>
          <p className="text-white/60 text-sm">
            You think the Imposter is...
          </p>
          <p className="font-display font-black text-2xl text-accent-400 glow-text">
            {getPlayerById(gameState, selectedId)?.name}
          </p>
          <Button fullWidth onClick={handleLockIn}>
            Lock In Guess
          </Button>
        </div>
      )}
    </div>
  );
}
