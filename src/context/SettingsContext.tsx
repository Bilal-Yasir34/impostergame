import { createContext, useContext, useReducer, useCallback, type ReactNode, type Dispatch } from 'react';
import type { GameSettings } from '@/types/game';
import { loadSettings, saveSettings, savePlayerNames } from '@/lib/storage';
import { setSoundEnabled } from '@/lib/sound';

interface SettingsContextValue {
  settings: GameSettings;
  dispatch: Dispatch<SettingsAction>;
  toggleSound: () => void;
  toggleAnimations: () => void;
  persistNames: (names: string[]) => void;
}

type SettingsAction =
  | { type: 'TOGGLE_SOUND' }
  | { type: 'TOGGLE_ANIMATIONS' }
  | { type: 'SET_SOUND'; value: boolean }
  | { type: 'SET_ANIMATIONS'; value: boolean };

function reducer(state: GameSettings, action: SettingsAction): GameSettings {
  switch (action.type) {
    case 'TOGGLE_SOUND':
      return { ...state, soundEnabled: !state.soundEnabled };
    case 'TOGGLE_ANIMATIONS':
      return { ...state, animationsEnabled: !state.animationsEnabled };
    case 'SET_SOUND':
      return { ...state, soundEnabled: action.value };
    case 'SET_ANIMATIONS':
      return { ...state, animationsEnabled: action.value };
    default:
      return state;
  }
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const initial = loadSettings();
  setSoundEnabled(initial.soundEnabled);

  const [settings, dispatch] = useReducer(reducer, {
    soundEnabled: initial.soundEnabled,
    animationsEnabled: initial.animationsEnabled,
  });

  const toggleSound = useCallback(() => {
    dispatch({ type: 'TOGGLE_SOUND' });
    const next = !settings.soundEnabled;
    setSoundEnabled(next);
    const cur = loadSettings();
    saveSettings({ ...cur, soundEnabled: next });
  }, [settings.soundEnabled]);

  const toggleAnimations = useCallback(() => {
    dispatch({ type: 'TOGGLE_ANIMATIONS' });
    const cur = loadSettings();
    saveSettings({ ...cur, animationsEnabled: !settings.animationsEnabled });
  }, [settings.animationsEnabled]);

  const persistNames = useCallback((names: string[]) => {
    savePlayerNames(names);
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, dispatch, toggleSound, toggleAnimations, persistNames }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
}
