import { playSound } from '@/lib/sound';
import { useSettings } from '@/context/SettingsContext';

interface ToggleProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: () => void;
}

export function Toggle({ label, description, checked, onChange }: ToggleProps) {
  const { settings } = useSettings();

  return (
    <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-ink-800/60 border border-ink-600/40">
      <div className="flex-1 min-w-0">
        <p className="font-display font-bold text-white text-base">{label}</p>
        {description && <p className="text-white/50 text-sm mt-0.5">{description}</p>}
      </div>
      <button
        onClick={() => {
          if (settings.soundEnabled) playSound('click');
          onChange();
        }}
        className={`relative w-14 h-8 rounded-full transition-colors duration-300 flex-shrink-0 ${
          checked ? 'bg-accent-500' : 'bg-ink-600'
        }`}
        aria-pressed={checked}
        aria-label={label}
      >
        <span
          className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow-md transition-transform duration-300 ${
            checked ? 'translate-x-7' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
}
