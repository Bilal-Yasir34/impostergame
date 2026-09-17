import { useState, useCallback } from 'react';
import { Button } from '@/components/Button';
import { useSettings } from '@/context/SettingsContext';
import { randomId } from '@/lib/random';
import { Plus, Trash2, Pencil, Check, X } from 'lucide-react';
import type { GameScreen } from '@/types/game';

interface PlayerSetupScreenProps {
  onNavigate: (screen: GameScreen) => void;
  onStartGame: (names: string[]) => void;
  initialNames?: string[];
}

const MIN_PLAYERS = 3;
const MAX_PLAYERS = 20;

interface NameEntry {
  id: string;
  name: string;
}

export function PlayerSetupScreen({ onNavigate, onStartGame, initialNames }: PlayerSetupScreenProps) {
  const { settings, persistNames } = useSettings();
  const anim = settings.animationsEnabled;

  const [entries, setEntries] = useState<NameEntry[]>(() => {
    const names = initialNames && initialNames.length > 0
      ? initialNames
      : ['Player 1', 'Player 2', 'Player 3'];
    return names.map((n) => ({ id: randomId(), name: n }));
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [error, setError] = useState<string | null>(null);

  const getNames = useCallback(() => entries.map((e) => e.name.trim()).filter(Boolean), [entries]);

  const validateAndStart = useCallback(() => {
    const names = getNames();
    if (names.length < MIN_PLAYERS) {
      setError(`You need at least ${MIN_PLAYERS} players.`);
      return;
    }
    if (names.length > MAX_PLAYERS) {
      setError(`Maximum ${MAX_PLAYERS} players.`);
      return;
    }
    const empties = entries.filter((e) => !e.name.trim());
    if (empties.length > 0) {
      setError('Every player needs a name.');
      return;
    }
    const lower = names.map((n) => n.toLowerCase());
    const dupes = new Set(lower.filter((n, i) => lower.indexOf(n) !== i));
    if (dupes.size > 0) {
      setError('Duplicate names are not allowed.');
      return;
    }
    setError(null);
    persistNames(names);
    onStartGame(names);
  }, [entries, getNames, persistNames, onStartGame]);

  const addPlayer = useCallback(() => {
    if (entries.length >= MAX_PLAYERS) {
      setError(`Maximum ${MAX_PLAYERS} players.`);
      return;
    }
    setError(null);
    setEntries((prev) => [...prev, { id: randomId(), name: `Player ${prev.length + 1}` }]);
  }, [entries.length]);

  const removePlayer = useCallback((id: string) => {
    if (entries.length <= MIN_PLAYERS) {
      setError(`You need at least ${MIN_PLAYERS} players.`);
      return;
    }
    setError(null);
    setEntries((prev) => prev.filter((e) => e.id !== id));
  }, [entries.length]);

  const startEdit = useCallback((entry: NameEntry) => {
    setEditingId(entry.id);
    setEditValue(entry.name);
  }, []);

  const confirmEdit = useCallback((id: string) => {
    const trimmed = editValue.trim();
    if (!trimmed) return;
    setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, name: trimmed } : e)));
    setEditingId(null);
    setError(null);
  }, [editValue]);

  return (
    <div className="flex flex-col min-h-screen px-6 py-8 gap-5 max-w-lg mx-auto">
      <div className="flex items-center gap-3">
        <button onClick={() => onNavigate('HOME')} className="btn-ghost">
          ← Back
        </button>
      </div>

      <div className="text-center">
        <h2 className="font-display font-black text-3xl sm:text-4xl text-white">Who's Playing?</h2>
        <p className="text-white/50 mt-2">
          {entries.length} of {MAX_PLAYERS} players · Min {MIN_PLAYERS}
        </p>
      </div>

      <div className="flex-1 flex flex-col gap-2.5 overflow-y-auto pb-2">
        {entries.map((entry, i) => (
          <div
            key={entry.id}
            className={`card-surface px-4 py-3 flex items-center gap-3 ${anim ? 'animate-fade-in-up' : ''}`}
            style={anim ? { animationDelay: `${i * 0.04}s` } : undefined}
          >
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent-500/20 flex items-center justify-center text-accent-400 font-display font-bold text-sm">
              {i + 1}
            </div>
            {editingId === entry.id ? (
              <>
                <input
                  autoFocus
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') confirmEdit(entry.id);
                    if (e.key === 'Escape') setEditingId(null);
                  }}
                  maxLength={20}
                  className="flex-1 bg-ink-900/60 border border-accent-500/40 rounded-xl px-3 py-2 text-white font-body font-medium focus:outline-none focus:border-accent-500"
                />
                <button onClick={() => confirmEdit(entry.id)} className="text-success-400 hover:text-success-500 p-1">
                  <Check size={20} />
                </button>
                <button onClick={() => setEditingId(null)} className="text-white/40 hover:text-white/60 p-1">
                  <X size={20} />
                </button>
              </>
            ) : (
              <>
                <span className="flex-1 text-white font-body font-medium text-lg truncate">{entry.name}</span>
                <button onClick={() => startEdit(entry)} className="text-white/40 hover:text-accent-400 p-1">
                  <Pencil size={18} />
                </button>
                <button
                  onClick={() => removePlayer(entry.id)}
                  className="text-white/40 hover:text-danger-400 p-1 disabled:opacity-30"
                  disabled={entries.length <= MIN_PLAYERS}
                >
                  <Trash2 size={18} />
                </button>
              </>
            )}
          </div>
        ))}
      </div>

      {entries.length < MAX_PLAYERS && (
        <button
          onClick={addPlayer}
          className="card-surface px-4 py-3 flex items-center justify-center gap-2 text-white/60 hover:text-white hover:border-accent-500/40 transition-colors"
        >
          <Plus size={20} />
          <span className="font-display font-bold">Add Player</span>
        </button>
      )}

      {error && (
        <div className={`text-danger-400 text-sm text-center font-medium ${anim ? 'animate-shake' : ''}`}>
          {error}
        </div>
      )}

      <Button fullWidth onClick={validateAndStart} disabled={entries.length < MIN_PLAYERS}>
        Start Game
      </Button>
    </div>
  );
}
