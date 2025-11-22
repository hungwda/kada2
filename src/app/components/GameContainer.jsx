/**
 * GameContainer - Preact component for hosting Phaser games
 *
 * Features:
 * - Mounts and manages Phaser game instances
 * - Displays game HUD (score, lives, level)
 * - Provides pause/resume controls
 * - Shows game over and game complete screens
 * - Responsive layout with safe areas
 * - Integration with PhaserBridge
 */

import { h } from 'preact';
import { useState, useEffect, useRef } from 'preact/hooks';
import PhaserBridge from '../../phaser/PhaserBridge';
import './GameContainer.css';

const GameContainer = ({ gameConfig, onExit, onComplete }) => {
  const gameContainerRef = useRef(null);
  const bridgeRef = useRef(null);

  // Game state
  const [gameState, setGameState] = useState({
    score: 0,
    lives: 3,
    level: 1,
    isPlaying: false,
    isPaused: false,
    isComplete: false
  });

  const [showPauseMenu, setShowPauseMenu] = useState(false);
  const [showGameOver, setShowGameOver] = useState(false);
  const [showComplete, setShowComplete] = useState(false);
  const [completeData, setCompleteData] = useState(null);

  // Initialize Phaser game
  useEffect(() => {
    if (!gameContainerRef.current) return;

    console.log('Initializing game:', gameConfig.id);

    // Create bridge
    const bridge = new PhaserBridge(gameConfig);
    bridgeRef.current = bridge;

    // Initialize Phaser game
    bridge.init(gameContainerRef.current, gameConfig);

    // Set up event listeners
    bridge.on('score-change', ({ score }) => {
      setGameState(prev => ({ ...prev, score }));
    });

    bridge.on('lives-change', ({ lives }) => {
      setGameState(prev => ({ ...prev, lives }));
    });

    bridge.on('game-pause', () => {
      setGameState(prev => ({ ...prev, isPaused: true }));
    });

    bridge.on('game-resume', () => {
      setGameState(prev => ({ ...prev, isPaused: false }));
    });

    bridge.on('game-over', (data) => {
      console.log('Game over:', data);
      setShowGameOver(true);
      setGameState(prev => ({ ...prev, isPlaying: false }));
    });

    bridge.on('game-complete', (data) => {
      console.log('Game complete:', data);
      setCompleteData(data);
      setShowComplete(true);
      setGameState(prev => ({ ...prev, isComplete: true, isPlaying: false }));
    });

    // Start the game
    if (gameConfig.startScene) {
      bridge.startScene(gameConfig.startScene, gameConfig.sceneData || {});
    }

    // Cleanup on unmount
    return () => {
      console.log('Cleaning up game');
      if (bridgeRef.current) {
        bridgeRef.current.destroy();
        bridgeRef.current = null;
      }
    };
  }, [gameConfig.id]);

  // Handle pause button
  const handlePause = () => {
    if (!bridgeRef.current) return;

    bridgeRef.current.pause();
    setShowPauseMenu(true);
  };

  // Handle resume
  const handleResume = () => {
    if (!bridgeRef.current) return;

    bridgeRef.current.resume();
    setShowPauseMenu(false);
  };

  // Handle restart
  const handleRestart = () => {
    if (!bridgeRef.current) return;

    // Destroy and recreate game
    bridgeRef.current.destroy();

    // Small delay before recreating
    setTimeout(() => {
      const bridge = new PhaserBridge(gameConfig);
      bridgeRef.current = bridge;
      bridge.init(gameContainerRef.current, gameConfig);

      if (gameConfig.startScene) {
        bridge.startScene(gameConfig.startScene, gameConfig.sceneData || {});
      }

      setShowGameOver(false);
      setShowComplete(false);
      setShowPauseMenu(false);
      setGameState({
        score: 0,
        lives: gameConfig.lives || 3,
        level: 1,
        isPlaying: true,
        isPaused: false,
        isComplete: false
      });
    }, 100);
  };

  // Handle exit
  const handleExit = () => {
    if (bridgeRef.current) {
      bridgeRef.current.destroy();
    }

    if (onExit) {
      onExit();
    }
  };

  // Handle complete continue
  const handleComplete = () => {
    if (onComplete) {
      onComplete(completeData);
    } else {
      handleExit();
    }
  };

  return (
    <div className="game-container">
      {/* Game HUD */}
      <div className="game-hud">
        <div className="hud-left">
          <div className="hud-item">
            <span className="hud-label">Score:</span>
            <span className="hud-value">{gameState.score}</span>
          </div>
          <div className="hud-item">
            <span className="hud-label">Lives:</span>
            <span className="hud-value">{'❤️'.repeat(gameState.lives)}</span>
          </div>
          <div className="hud-item">
            <span className="hud-label">Level:</span>
            <span className="hud-value">{gameState.level}</span>
          </div>
        </div>

        <div className="hud-right">
          <button
            className="hud-button pause-button"
            onClick={handlePause}
            disabled={!gameState.isPlaying || gameState.isPaused}
          >
            ⏸️ Pause
          </button>
          <button className="hud-button exit-button" onClick={handleExit}>
            ✕ Exit
          </button>
        </div>
      </div>

      {/* Phaser game canvas container */}
      <div
        ref={gameContainerRef}
        className="phaser-container"
        id="phaser-game"
      />

      {/* Pause Menu Overlay */}
      {showPauseMenu && (
        <div className="game-overlay">
          <div className="overlay-content">
            <h2>Game Paused</h2>
            <div className="overlay-buttons">
              <button className="overlay-button primary" onClick={handleResume}>
                Resume
              </button>
              <button className="overlay-button" onClick={handleRestart}>
                Restart
              </button>
              <button className="overlay-button danger" onClick={handleExit}>
                Exit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Game Over Overlay */}
      {showGameOver && (
        <div className="game-overlay game-over">
          <div className="overlay-content">
            <h2>Game Over</h2>
            <div className="game-stats">
              <div className="stat-item">
                <span className="stat-label">Final Score:</span>
                <span className="stat-value">{gameState.score}</span>
              </div>
            </div>
            <div className="overlay-buttons">
              <button className="overlay-button primary" onClick={handleRestart}>
                Try Again
              </button>
              <button className="overlay-button" onClick={handleExit}>
                Exit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Game Complete Overlay */}
      {showComplete && completeData && (
        <div className="game-overlay game-complete">
          <div className="overlay-content">
            <h2>🎉 Congratulations!</h2>
            <div className="stars">
              {'⭐'.repeat(completeData.stars)}
            </div>
            <div className="game-stats">
              <div className="stat-item">
                <span className="stat-label">Score:</span>
                <span className="stat-value">{completeData.score}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Time:</span>
                <span className="stat-value">
                  {Math.floor(completeData.playTime / 1000)}s
                </span>
              </div>
            </div>
            <div className="overlay-buttons">
              <button className="overlay-button primary" onClick={handleComplete}>
                Continue
              </button>
              <button className="overlay-button" onClick={handleRestart}>
                Play Again
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameContainer;
