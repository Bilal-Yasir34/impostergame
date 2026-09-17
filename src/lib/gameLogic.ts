import type { Player, Category, GameState } from '@/types/game';
import { CATEGORIES } from '@/data/categories';
import { shuffle, pickRandom, randomId } from '@/lib/random';

export interface NewRoundConfig {
  playerNames: string[];
}

export function createPlayers(names: string[]): Player[] {
  return names.map((name, i) => ({
    id: randomId(),
    name,
    role: 'NORMAL' as const,
    turnPosition: i,
  }));
}

export function generateRound(players: Player[]): GameState {
  const category: Category = pickRandom(CATEGORIES);
  const secretWord = pickRandom(category.words);
  const imposterIndex = Math.floor(Math.random() * players.length);
  const imposterId = players[imposterIndex].id;

  const playersWithRoles: Player[] = players.map((p) => ({
    ...p,
    role: p.id === imposterId ? 'IMPOSTER' : 'NORMAL',
  }));

  const turnOrder = shuffle(playersWithRoles.map((p) => p.id));

  return {
    players: playersWithRoles,
    category,
    secretWord,
    imposterId,
    turnOrder,
    currentTurnIndex: 0,
    selectedGuessId: null,
    result: null,
  };
}

export function regenerateRound(state: GameState): GameState {
  return generateRound(state.players.map((p) => ({ id: p.id, name: p.name, role: 'NORMAL' as const, turnPosition: p.turnPosition })));
}

export function getPlayerById(state: GameState, id: string | null): Player | undefined {
  if (!id) return undefined;
  return state.players.find((p) => p.id === id);
}

export function getImposter(state: GameState): Player | undefined {
  return getPlayerById(state, state.imposterId);
}

export function getCurrentTurnPlayer(state: GameState): Player | undefined {
  const id = state.turnOrder[state.currentTurnIndex];
  return getPlayerById(state, id);
}
