import { useEffect, useState } from 'react';
import { Button } from '@/components/Button';
import { useSettings } from '@/context/SettingsContext';
import { playSound } from '@/lib/sound';

interface GameStartScreenProps {
  onStart: () => void;
}

export function GameStartScreen({ onStart }: GameStartScreenProps) {
  const { settings } = useSettings();
  const anim = settings.animationsEnabled;
  const [phase, setPhase] = useState<'know' | 'begin'>('know');

  useEffect(() => {
    if (settings.soundEnabled) playSound('suspense');
    const t = setTimeout(() => setPhase('begin'), 1800);
    return () => clearTimeout(t);
  }, [settings.soundEnabled]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center gap-8">
      <div className="flex flex-col items-center gap-4">
        {phase === 'know' ? (
          <div className={anim ? 'animate-fade-in-up' : ''}>
            <p className="text-6xl mb-4">🤫</p>
            <h2 className="font-display font-black text-3xl sm:text-4xl text-white">
              Everyone knows their role.
            </h2>
          </div>
        ) : (
          <div className={anim ? 'animate-scale-in' : ''}>
            <p className="text-6xl mb-4">🎮</p>
            <h2 className="font-display font-black text-3xl sm:text-4xl text-white">
              Now the game begins.
            </h2>
          </div>
        )}
      </div>

      {phase === 'begin' && (
        <div className={anim ? 'animate-fade-in-up' : ''} style={{ animationDelay: '0.3s' }}>
          <Button onClick={onStart}>
            Start
          </Button>
        </div>
      )}
    </div>
  );
}
