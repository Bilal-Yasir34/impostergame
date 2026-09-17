import { useState, useCallback } from 'react';
import { SettingsProvider } from '@/context/SettingsContext';
import { ParticleBackground } from '@/components/ParticleBackground';
import { HomeScreen } from '@/screens/HomeScreen';
import { HowToPlayScreen } from '@/screens/HowToPlayScreen';
import { SettingsScreen } from '@/screens/SettingsScreen';
import { PlayerSetupScreen } from '@/screens/PlayerSetupScreen';
import { GameInitializationScreen } from '@/screens/GameInitializationScreen';
import { CardRevealScreen } from '@/screens/CardRevealScreen';
import { GameStartScreen } from '@/screens/GameStartScreen';
import { TurnScreen } from '@/screens/TurnScreen';
import { VotingScreen } from '@/screens/VotingScreen';
import { VoteConfirmationScreen } from '@/screens/VoteConfirmationScreen';
import { RevealScreen } from '@/screens/RevealScreen';
import { ResultsScreen } from '@/screens/ResultsScreen';
import { createPlayers, generateRound } from '@/lib/gameLogic';
import type { GameScreen, GameState, GameResult } from '@/types/game';

function GameApp() {
  const [screen, setScreen] = useState<GameScreen>('HOME');
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [playerNames, setPlayerNames] = useState<string[]>([]);

  const navigate = useCallback((s: GameScreen) => {
    setScreen(s);
  }, []);

  const handleStartGame = useCallback((names: string[]) => {
    setPlayerNames(names);
    const players = createPlayers(names);
    const newRound = generateRound(players);
    setGameState(newRound);
    setScreen('GAME_INITIALIZATION');
  }, []);

  const handlePlayAgain = useCallback(() => {
    if (gameState) {
      const players = gameState.players.map((p) => ({
        id: p.id,
        name: p.name,
        role: 'NORMAL' as const,
        turnPosition: p.turnPosition,
      }));
      const newRound = generateRound(players);
      setGameState(newRound);
      setScreen('GAME_INITIALIZATION');
    }
  }, [gameState]);

  const handleNextTurn = useCallback(() => {
    setGameState((prev) => {
      if (!prev) return prev;
      return { ...prev, currentTurnIndex: prev.currentTurnIndex + 1 };
    });
  }, []);

  const handleAllTurnsComplete = useCallback(() => {
    setScreen('VOTING');
  }, []);

  const handleVoteSelected = useCallback((playerId: string) => {
    setGameState((prev) => {
      if (!prev) return prev;
      return { ...prev, selectedGuessId: playerId };
    });
    setScreen('VOTE_CONFIRMATION');
  }, []);

  const handleVoteConfirm = useCallback(() => {
    setGameState((prev) => {
      if (!prev || !prev.selectedGuessId || !prev.imposterId) return prev;
      const result: GameResult = {
        imposterId: prev.imposterId,
        guessedId: prev.selectedGuessId,
        correct: prev.selectedGuessId === prev.imposterId,
      };
      return { ...prev, result };
    });
    setScreen('REVEAL');
  }, []);

  const handleRevealComplete = useCallback(() => {
    setScreen('RESULTS');
  }, []);

  const handleBackHome = useCallback(() => {
    setGameState(null);
    setPlayerNames([]);
    setScreen('HOME');
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-ink-950">
      {/* Ambient gradient background */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-accent-500/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-accent-600/5 rounded-full blur-[100px]" />
        <div className="absolute top-1/3 left-0 w-[300px] h-[300px] bg-indigo-500/3 rounded-full blur-[80px]" />
      </div>

      <ParticleBackground />

      <div className="relative z-10 min-h-screen">
        {screen === 'HOME' && <HomeScreen onNavigate={navigate} />}
        {screen === 'HOW_TO_PLAY' && <HowToPlayScreen onNavigate={navigate} />}
        {screen === 'SETTINGS' && <SettingsScreen onNavigate={navigate} />}
        {screen === 'PLAYER_SETUP' && (
          <PlayerSetupScreen
            onNavigate={navigate}
            onStartGame={handleStartGame}
            initialNames={playerNames}
          />
        )}
        {screen === 'GAME_INITIALIZATION' && (
          <GameInitializationScreen onComplete={() => setScreen('CARD_REVEAL')} />
        )}
        {screen === 'CARD_REVEAL' && gameState && (
          <CardRevealScreen
            gameState={gameState}
            onComplete={() => setScreen('CARD_REVEAL_COMPLETE')}
            onNavigate={navigate}
          />
        )}
        {screen === 'CARD_REVEAL_COMPLETE' && (
          <GameStartScreen onStart={() => setScreen('TURN')} />
        )}
        {screen === 'TURN' && gameState && (
          <TurnScreen
            gameState={gameState}
            onNextTurn={handleNextTurn}
            onAllTurnsComplete={handleAllTurnsComplete}
          />
        )}
        {screen === 'VOTING' && gameState && (
          <VotingScreen gameState={gameState} onVoteSelected={handleVoteSelected} />
        )}
        {screen === 'VOTE_CONFIRMATION' && gameState && (
          <VoteConfirmationScreen
            gameState={gameState}
            onConfirm={handleVoteConfirm}
            onChange={() => setScreen('VOTING')}
          />
        )}
        {screen === 'REVEAL' && gameState && (
          <RevealScreen gameState={gameState} onRevealComplete={handleRevealComplete} />
        )}
        {screen === 'RESULTS' && gameState && (
          <ResultsScreen
            gameState={gameState}
            onPlayAgain={handlePlayAgain}
            onNavigate={handleBackHome}
          />
        )}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <SettingsProvider>
      <GameApp />
    </SettingsProvider>
  );
}
