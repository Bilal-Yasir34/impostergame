import { useEffect } from 'react';
import { useSettings } from '@/context/SettingsContext';

interface GameInitializationScreenProps {
  onComplete: () => void;
}

export function GameInitializationScreen({ onComplete }: GameInitializationScreenProps) {
  const { settings } = useSettings();
  const anim = settings.animationsEnabled;

  useEffect(() => {
    const t = setTimeout(onComplete, 2000);
    return () => clearTimeout(t);
  }, [onComplete]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center gap-6">
      <div className={`flex flex-col items-center gap-4 ${anim ? 'animate-fade-in' : ''}`}>
        <div className={`text-7xl ${anim ? 'animate-float' : ''}`}>🎲</div>
        <h2 className="font-display font-black text-3xl sm:text-4xl text-white">
          The Game is Ready
        </h2>
        <div className="flex gap-2">
          <span className={`w-2.5 h-2.5 rounded-full bg-accent-500 ${anim ? 'animate-pulse' : ''}`} style={{ animationDelay: '0s' }} />
          <span className={`w-2.5 h-2.5 rounded-full bg-accent-500 ${anim ? 'animate-pulse' : ''}`} style={{ animationDelay: '0.2s' }} />
          <span className={`w-2.5 h-2.5 rounded-full bg-accent-500 ${anim ? 'animate-pulse' : ''}`} style={{ animationDelay: '0.4s' }} />
        </div>
      </div>
    </div>
  );
}
