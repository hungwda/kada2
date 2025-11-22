/**
 * GameView - Page component for playing games
 *
 * Features:
 * - Loads game configuration by ID
 * - Renders GameContainer with game
 * - Handles navigation after game completion
 * - Shows loading state
 */

import { h } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import { route } from 'preact-router';
import GameContainer from '../components/GameContainer';

// Import game configurations
import letterMatchConfig from '../../games/LetterMatch/config';
import aksharaCatcherConfig from '../../games/AksharaCatcher/config';

// Game registry
const GAME_CONFIGS = {
  'letter-match': letterMatchConfig,
  'akshara-catcher': aksharaCatcherConfig,
  // Add more games here as they're created
};

const GameView = ({ gameId }) => {
  const [gameConfig, setGameConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load game configuration
  useEffect(() => {
    console.log('Loading game:', gameId);

    // Get game config
    const config = GAME_CONFIGS[gameId];

    if (!config) {
      setError(`Game not found: ${gameId}`);
      setLoading(false);
      return;
    }

    setGameConfig(config);
    setLoading(false);
  }, [gameId]);

  // Handle game exit
  const handleExit = () => {
    console.log('Exiting game');
    route('/games');
  };

  // Handle game completion
  const handleComplete = (data) => {
    console.log('Game completed:', data);

    // Show completion screen or navigate
    // For now, just go back to game hub
    setTimeout(() => {
      route('/games');
    }, 2000);
  };

  // Loading state
  if (loading) {
    return (
      <div className="game-view-loading">
        <div className="loading-spinner" />
        <p>Loading game...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="game-view-error">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => route('/games')}>
          Back to Games
        </button>
      </div>
    );
  }

  // Render game
  return (
    <div className="game-view">
      <GameContainer
        gameConfig={gameConfig}
        onExit={handleExit}
        onComplete={handleComplete}
      />
    </div>
  );
};

export default GameView;
