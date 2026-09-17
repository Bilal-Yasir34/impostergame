import { useState, useCallback } from 'react';
import { playSound } from '@/lib/sound';
import { useSettings } from '@/context/SettingsContext';

interface RevealCardProps {
  isImposter: boolean;
  secretWord: string;
  categoryName: string;
  categoryIcon: string;
  onReveal: () => void;
  onHide: () => void;
}

export function RevealCard({ isImposter, secretWord, categoryName, categoryIcon, onReveal, onHide }: RevealCardProps) {
  const [flipped, setFlipped] = useState(false);
  const { settings } = useSettings();
  const animEnabled = settings.animationsEnabled;

  const handleTap = useCallback(() => {
    if (!flipped) {
      setFlipped(true);
      if (settings.soundEnabled) playSound('cardFlip');
      onReveal();
    }
  }, [flipped, onReveal, settings.soundEnabled]);

  const handleHide = useCallback(() => {
    if (settings.soundEnabled) playSound('click');
    onHide();
  }, [onHide, settings.soundEnabled]);

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-sm">
      <div className="perspective w-full" style={{ aspectRatio: '3/4' }}>
        <div
          className={`relative w-full h-full preserve-3d ${animEnabled ? 'transition-transform duration-700' : ''} ${
            flipped ? 'rotate-y-180' : ''
          }`}
        >
          {/* Back of card */}
          <div
            className="absolute inset-0 backface-hidden card-surface flex flex-col items-center justify-center cursor-pointer gap-4 overflow-hidden"
            onClick={handleTap}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-ink-700/50 to-ink-900/50" />
            <div className="relative z-10 flex flex-col items-center gap-6">
              <div className={`text-6xl ${animEnabled ? 'animate-float' : ''}`}>🃏</div>
              <p className="font-display font-bold text-xl text-white/80">Tap to reveal</p>
              <p className="text-white/40 text-sm">Your card is ready</p>
            </div>
            {/* Decorative border */}
            <div className="absolute inset-3 rounded-2xl border-2 border-dashed border-white/10" />
          </div>

          {/* Front of card */}
          <div
            className={`absolute inset-0 backface-hidden rotate-y-180 card-surface flex flex-col items-center justify-center gap-6 overflow-hidden ${
              isImposter ? 'border-danger-500/30' : 'border-accent-500/30'
            }`}
          >
            <div
              className={`absolute inset-0 ${
                isImposter
                  ? 'bg-gradient-to-br from-danger-500/10 to-ink-900/60'
                  : 'bg-gradient-to-br from-accent-500/10 to-ink-900/60'
              }`}
            />
            <div className="relative z-10 flex flex-col items-center gap-4 px-6 text-center">
              <div
                className={`text-7xl ${animEnabled ? 'animate-bounce-in' : ''} ${
                  isImposter ? 'drop-shadow-[0_0_20px_rgba(239,68,68,0.5)]' : 'drop-shadow-[0_0_20px_rgba(249,115,22,0.5)]'
                }`}
              >
                {isImposter ? '😈' : categoryIcon}
              </div>
              {isImposter ? (
                <>
                  <p className="font-display font-black text-3xl text-danger-400 glow-text">IMPOSTER</p>
                  <p className="text-white/60 text-sm max-w-[16rem]">
                    You don't know the secret word. Blend in by giving vague clues!
                  </p>
                </>
              ) : (
                <>
                  <p className="font-display font-black text-3xl text-white glow-text break-words">{secretWord}</p>
                  <p className="text-white/50 text-sm">
                    Category: {categoryIcon} {categoryName}
                  </p>
                </>
              )}
            </div>
            <div className="absolute inset-3 rounded-2xl border-2 border-dashed border-white/10" />
          </div>
        </div>
      </div>

      {flipped && (
        <div
          className={`flex flex-col items-center gap-3 w-full ${animEnabled ? 'animate-fade-in-up' : ''}`}
        >
          <p className="text-white/60 text-sm font-medium">Remember your role.</p>
          <button
            onClick={handleHide}
            className="btn-secondary w-full"
          >
            Hide &amp; Pass Device
          </button>
        </div>
      )}
    </div>
  );
}
