import { Button } from '@/components/Button';
import { useSettings } from '@/context/SettingsContext';
import type { GameScreen } from '@/types/game';

interface HomeScreenProps {
  onNavigate: (screen: GameScreen) => void;
}

export function HomeScreen({ onNavigate }: HomeScreenProps) {
  const { settings } = useSettings();
  const anim = settings.animationsEnabled;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center gap-8">
      <div className={`flex flex-col items-center gap-2 ${anim ? 'animate-fade-in-down' : ''}`}>
        <div className={`text-7xl mb-2 ${anim ? 'animate-float' : ''}`}>🕵️</div>
        <h1 className="font-display font-black text-4xl sm:text-5xl md:text-6xl leading-tight tracking-tight">
          <span className="bg-gradient-to-r from-accent-400 via-accent-500 to-accent-600 bg-clip-text text-transparent glow-text">
            WHO'S THE IMPOSTER?
          </span>
        </h1>
        <p className="text-white/60 text-lg sm:text-xl font-body font-medium mt-2">
          One word. One liar. Can you find them?
        </p>
      </div>

      <div className={`flex flex-col items-center gap-4 w-full max-w-xs ${anim ? 'animate-fade-in-up' : ''}`} style={{ animationDelay: '0.2s' }}>
        <Button fullWidth onClick={() => onNavigate('PLAYER_SETUP')}>
          Play Game
        </Button>
        <div className="flex gap-3 w-full">
          <Button variant="secondary" fullWidth onClick={() => onNavigate('HOW_TO_PLAY')}>
            How to Play
          </Button>
          <Button variant="secondary" fullWidth onClick={() => onNavigate('SETTINGS')}>
            Settings
          </Button>
        </div>
      </div>

      <p className="text-white/30 text-xs absolute bottom-6">
        3–20 players · Pass-and-play · One device
      </p>
    </div>
  );
}
