import { Button } from '@/components/Button';
import { useSettings } from '@/context/SettingsContext';
import type { GameScreen } from '@/types/game';

interface HowToPlayScreenProps {
  onNavigate: (screen: GameScreen) => void;
}

const STEPS = [
  { icon: '✍️', title: 'Enter Names', text: 'Gather your friends and enter everyone\'s names into the app.' },
  { icon: '🎭', title: 'Secret Roles', text: 'The game secretly chooses one Imposter. Everyone else gets the same secret word.' },
  { icon: '🃏', title: 'Check Your Card', text: 'Pass the device around. Each player taps to privately reveal their role.' },
  { icon: '🗣️', title: 'Give Clues', text: 'Take turns giving one clue about the secret word. The Imposter must bluff!' },
  { icon: '🗳️', title: 'Vote', text: 'After everyone gives a clue, vote on who you think the Imposter is.' },
  { icon: ' reveal', title: 'The Reveal', text: 'The game reveals the Imposter and the secret word. Did you catch them?' },
];

export function HowToPlayScreen({ onNavigate }: HowToPlayScreenProps) {
  const { settings } = useSettings();
  const anim = settings.animationsEnabled;

  return (
    <div className="flex flex-col min-h-screen px-6 py-8 gap-6 max-w-2xl mx-auto">
      <div className={`flex items-center gap-3 ${anim ? 'animate-fade-in-down' : ''}`}>
        <button onClick={() => onNavigate('HOME')} className="btn-ghost">
          ← Back
        </button>
      </div>

      <div className="text-center">
        <h2 className="font-display font-black text-3xl sm:text-4xl text-white">How to Play</h2>
        <p className="text-white/50 mt-2">A quick guide to the game</p>
      </div>

      <div className="flex flex-col gap-3">
        {STEPS.map((step, i) => (
          <div
            key={i}
            className={`card-surface p-5 flex items-start gap-4 ${anim ? 'animate-fade-in-up' : ''}`}
            style={anim ? { animationDelay: `${i * 0.08}s` } : undefined}
          >
            <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-accent-500/15 flex items-center justify-center text-2xl">
              {step.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-accent-400 font-display font-bold text-sm">STEP {i + 1}</span>
              </div>
              <h3 className="font-display font-bold text-lg text-white mt-0.5">{step.title}</h3>
              <p className="text-white/55 text-sm mt-1">{step.text}</p>
            </div>
          </div>
        ))}
      </div>

      <Button fullWidth onClick={() => onNavigate('HOME')}>
        Got it!
      </Button>
    </div>
  );
}
