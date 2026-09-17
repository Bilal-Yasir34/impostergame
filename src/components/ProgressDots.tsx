import { useSettings } from '@/context/SettingsContext';

interface ProgressDotsProps {
  current: number;
  total: number;
}

export function ProgressDots({ current, total }: ProgressDotsProps) {
  const { settings } = useSettings();
  const animClass = settings.animationsEnabled ? 'transition-all duration-300' : '';

  return (
    <div className="flex items-center justify-center gap-2 flex-wrap max-w-xs">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`rounded-full ${animClass} ${
            i === current
              ? 'w-8 h-2.5 bg-accent-500'
              : i < current
              ? 'w-2.5 h-2.5 bg-accent-500/40'
              : 'w-2.5 h-2.5 bg-white/15'
          }`}
        />
      ))}
    </div>
  );
}
