import type { PersistedSettings } from '@/types/game';

const STORAGE_KEY = 'whos-the-imposter-settings';

const DEFAULT_SETTINGS: PersistedSettings = {
  soundEnabled: true,
  animationsEnabled: true,
  recentPlayerNames: [],
};

export function loadSettings(): PersistedSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw) as Partial<PersistedSettings>;
    return {
      soundEnabled: parsed.soundEnabled ?? DEFAULT_SETTINGS.soundEnabled,
      animationsEnabled: parsed.animationsEnabled ?? DEFAULT_SETTINGS.animationsEnabled,
      recentPlayerNames: parsed.recentPlayerNames ?? [],
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: PersistedSettings): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // ignore quota errors
  }
}

export function savePlayerNames(names: string[]): void {
  const current = loadSettings();
  const unique = Array.from(new Set([...names, ...current.recentPlayerNames])).slice(0, 50);
  saveSettings({ ...current, recentPlayerNames: unique });
}
