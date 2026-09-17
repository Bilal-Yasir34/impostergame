import { Button } from '@/components/Button';
import { Toggle } from '@/components/Toggle';
import { useSettings } from '@/context/SettingsContext';
import type { GameScreen } from '@/types/game';

interface SettingsScreenProps {
  onNavigate: (screen: GameScreen) => void;
}

export function SettingsScreen({ onNavigate }: SettingsScreenProps) {
  const { settings, toggleSound, toggleAnimations } = useSettings();

  return (
    <div className="flex flex-col min-h-screen px-6 py-8 gap-6 max-w-lg mx-auto">
      <div className="flex items-center gap-3">
        <button onClick={() => onNavigate('HOME')} className="btn-ghost">
          ← Back
        </button>
      </div>

      <div className="text-center">
        <h2 className="font-display font-black text-3xl sm:text-4xl text-white">Settings</h2>
        <p className="text-white/50 mt-2">Customize your experience</p>
      </div>

      <div className="flex flex-col gap-4">
        <div>
          <h3 className="font-display font-bold text-white/70 text-sm uppercase tracking-wider mb-3 px-1">Audio</h3>
          <Toggle
            label="Sound Effects"
            description="Button clicks, card flips, reveals"
            checked={settings.soundEnabled}
            onChange={toggleSound}
          />
        </div>

        <div>
          <h3 className="font-display font-bold text-white/70 text-sm uppercase tracking-wider mb-3 px-1">Visuals</h3>
          <Toggle
            label="Animations"
            description="Screen transitions, card flips, particles"
            checked={settings.animationsEnabled}
            onChange={toggleAnimations}
          />
        </div>
      </div>

      <div className="mt-auto">
        <Button fullWidth onClick={() => onNavigate('HOME')}>
          Save & Back
        </Button>
      </div>
    </div>
  );
}
