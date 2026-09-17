export type Role = 'NORMAL' | 'IMPOSTER';

export type GameScreen =
  | 'HOME'
  | 'HOW_TO_PLAY'
  | 'SETTINGS'
  | 'PLAYER_SETUP'
  | 'GAME_INITIALIZATION'
  | 'CARD_REVEAL'
  | 'CARD_REVEAL_COMPLETE'
  | 'GAME_START'
  | 'TURN'
  | 'VOTING'
  | 'VOTE_CONFIRMATION'
  | 'REVEAL'
  | 'RESULTS';

export interface Player {
  id: string;
  name: string;
  role: Role;
  turnPosition: number;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  words: string[];
}

export interface GameSettings {
  soundEnabled: boolean;
  animationsEnabled: boolean;
}

export interface GameState {
  players: Player[];
  category: Category | null;
  secretWord: string | null;
  imposterId: string | null;
  turnOrder: string[];
  currentTurnIndex: number;
  selectedGuessId: string | null;
  result: GameResult | null;
}

export interface GameResult {
  imposterId: string;
  guessedId: string;
  correct: boolean;
}

export interface PersistedSettings {
  soundEnabled: boolean;
  animationsEnabled: boolean;
  recentPlayerNames: string[];
}
