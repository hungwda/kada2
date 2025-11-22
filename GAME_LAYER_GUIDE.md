# Game Layer Guide

Complete guide for building games using the BaseGame, BaseScene, PhaserBridge, and GameContainer components.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Creating a New Game](#creating-a-new-game)
3. [BaseScene Reference](#basescene-reference)
4. [BaseGame Reference](#basegame-reference)
5. [PhaserBridge Reference](#phaserbridge-reference)
6. [GameContainer Reference](#gamecontainer-reference)
7. [Complete Example](#complete-example)
8. [Best Practices](#best-practices)

---

## Architecture Overview

The game layer consists of 4 main components:

```
┌─────────────────────────────────────────┐
│          Preact UI Layer                │
│  ┌───────────────────────────────────┐  │
│  │     GameContainer.jsx             │  │
│  │  (HUD, Overlays, Controls)        │  │
│  └───────────┬───────────────────────┘  │
│              │                           │
│  ┌───────────▼───────────────────────┐  │
│  │     PhaserBridge.js               │  │
│  │  (Phaser ↔ Preact Communication)  │  │
│  └───────────┬───────────────────────┘  │
└──────────────┼───────────────────────────┘
               │
┌──────────────▼───────────────────────────┐
│          Phaser Game Layer               │
│  ┌───────────────────────────────────┐  │
│  │     BaseScene.js                  │  │
│  │  (Responsive Phaser Scene)        │  │
│  └───────────┬───────────────────────┘  │
│              │                           │
│  ┌───────────▼───────────────────────┐  │
│  │     BaseGame.js                   │  │
│  │  (Game Logic & Lifecycle)         │  │
│  └───────────────────────────────────┘  │
└──────────────────────────────────────────┘
```

### Component Responsibilities

**BaseGame.js**
- Game lifecycle (init, start, pause, resume, end)
- Score tracking and lives management
- Timer functionality
- Star calculation
- Progress saving
- Service integration

**BaseScene.js**
- Responsive Phaser scene setup
- Camera and layer management
- Input handling (touch + keyboard)
- Resize handling
- UI helpers (buttons, text, backgrounds)
- Scene transitions

**PhaserBridge.js**
- Creates and manages Phaser game instances
- Provides API for Preact to control games
- Emits events for state changes
- Handles DOM integration and cleanup

**GameContainer.jsx**
- Renders Phaser game canvas
- Displays game HUD (score, lives, level)
- Shows overlays (pause, game over, complete)
- Provides pause/resume controls
- Handles game lifecycle from UI

---

## Creating a New Game

### Step 1: Create Game Directory

```bash
src/games/YourGame/
├── YourGameScene.js     # Phaser scene
├── config.js            # Game configuration
└── assets/              # Game-specific assets
```

### Step 2: Create Game Scene

```javascript
// src/games/YourGame/YourGameScene.js

import BaseScene from '../../phaser/BaseScene';
import BaseGame from '../../phaser/BaseGame';

class YourGameScene extends BaseScene {
  constructor() {
    super({ key: 'YourGameScene' });
    this.gameLogic = null;
  }

  init(data) {
    super.init(data);

    // Create game logic
    this.gameLogic = new BaseGame(this, {
      id: 'your-game',
      lives: 3,
      level: data.level || 1,
      targetScore: 100
    });
  }

  preload() {
    // Load assets
  }

  create() {
    super.create(); // IMPORTANT: Call parent create()

    // Create background
    this.createBackground('#F5F5F5');

    // Initialize game
    this.gameLogic.init();

    // Create your game UI
    this.createGameUI();

    // Start game
    this.gameLogic.start();
  }

  createGameUI() {
    const center = this.getCenter();

    // Create your game elements
    const title = this.createText(
      center.x,
      100,
      'Your Game Title',
      { variant: 'h1', color: '#000' }
    );
    title.setOrigin(0.5);
    this.uiLayer.add(title);

    // Add buttons, game objects, etc.
  }

  update(time, delta) {
    // Game update logic
  }

  shutdown() {
    super.shutdown();
    if (this.gameLogic) {
      this.gameLogic.destroy();
    }
  }
}

export default YourGameScene;
```

### Step 3: Create Game Configuration

```javascript
// src/games/YourGame/config.js

import YourGameScene from './YourGameScene';

const yourGameConfig = {
  // Metadata
  id: 'your-game',
  name: 'Your Game Name',
  nameKannada: 'ನಿಮ್ಮ ಆಟದ ಹೆಸರು',
  description: 'Game description',
  category: 'vowels', // vowels, consonants, words, etc.
  difficulty: 'beginner', // beginner, intermediate, advanced

  // Mechanics
  lives: 3,
  targetScore: 100,
  timeLimit: null, // or number in seconds

  // Learning
  skills: ['skill-1', 'skill-2'],

  // Phaser config
  scenes: [YourGameScene],
  startScene: 'YourGameScene',
  backgroundColor: '#FFFFFF',

  // Assets
  assets: {
    audio: {
      // 'sound-key': '/path/to/sound.mp3'
    },
    images: {
      // 'image-key': '/path/to/image.png'
    }
  },

  // Scene data
  sceneData: {
    level: 1
  }
};

export default yourGameConfig;
```

### Step 4: Register Game

```javascript
// src/app/pages/GameView.jsx

import yourGameConfig from '../../games/YourGame/config';

const GAME_CONFIGS = {
  'letter-match': letterMatchConfig,
  'your-game': yourGameConfig, // Add your game here
};
```

---

## BaseScene Reference

### Properties

```javascript
// Viewport & dimensions
this.viewport          // ViewportManager instance
this.gameWidth         // Current game width
this.gameHeight        // Current game height

// Services
this.audio             // AudioManager instance
this.i18n              // I18nService instance

// Layers (containers)
this.backgroundLayer   // z-index: 0
this.gameLayer         // z-index: 10
this.uiLayer           // z-index: 100

// Input
this.isTouchDevice     // Boolean
this.cursors           // Keyboard cursors (desktop only)
```

### Methods

#### Scene Setup

```javascript
init(data)              // Initialize scene with data
create()                // Create scene (call super.create()!)
setupCamera()           // Set up camera bounds
createLayers()          // Create rendering layers
setupInput()            // Set up input handling
setupResize()           // Set up resize handling
handleResize(state)     // Handle viewport resize
```

#### UI Helpers

```javascript
// Create responsive background
createBackground(color)
// Returns: Phaser.GameObjects.Rectangle

// Create responsive text
createText(x, y, text, style)
// style: { variant, kannada, color, align }
// Returns: Phaser.GameObjects.Text

// Create responsive button
createButton(x, y, text, callback, style)
// style: { width, height, color }
// Returns: Phaser.GameObjects.Container
```

#### Utilities

```javascript
// Get center position
getCenter()
// Returns: { x, y }

// Get safe area bounds
getSafeArea()
// Returns: { top, bottom, left, right }

// Transition to another scene
transitionTo(sceneKey, data)

// Show loading indicator
showLoading()
// Returns: Phaser.GameObjects.Container

// Translate text
t(key, vars)
// Returns: string

// Play sound effect
playSfx(key, options)
```

### Example Usage

```javascript
create() {
  super.create();

  // Get center and safe area
  const center = this.getCenter();
  const safeArea = this.getSafeArea();

  // Create background
  this.createBackground('#E3F2FD');

  // Create text
  const title = this.createText(
    center.x,
    safeArea.top + 60,
    this.t('game.title'),
    {
      variant: 'h1',
      color: '#1976D2',
      kannada: true
    }
  );
  title.setOrigin(0.5);
  this.uiLayer.add(title);

  // Create button
  const playButton = this.createButton(
    center.x,
    center.y,
    'Play',
    () => this.startGame(),
    { width: 200 }
  );
  this.uiLayer.add(playButton);
}
```

---

## BaseGame Reference

### Properties

```javascript
// State
this.isInitialized     // Boolean
this.isPlaying         // Boolean
this.isPaused          // Boolean
this.isComplete        // Boolean

// Data
this.score             // Number
this.lives             // Number
this.level             // Number
this.stars             // Number (0-3)
this.startTime         // Timestamp
this.playTime          // Duration in ms

// Services
this.viewport          // ViewportManager
this.audio             // AudioManager
this.progress          // ProgressManager
this.i18n              // I18nService
this.store             // StateStore
```

### Methods

#### Lifecycle

```javascript
init()                  // Initialize game
start()                 // Start gameplay
pause()                 // Pause game
resume()                // Resume game
end(completed)          // End game (true if completed)
destroy()               // Cleanup
```

#### Scoring & Lives

```javascript
addScore(points)        // Add points
setScore(score)         // Set score
loseLife()              // Lose a life (returns true if game over)
gainLife()              // Gain a life
```

#### Timer

```javascript
startTimer(seconds)     // Start countdown timer
```

#### State

```javascript
getState()              // Get current game state
// Returns: { score, lives, level, stars, isPlaying, isPaused, isComplete, playTime }

calculateStars()        // Calculate stars (1-3)
// Returns: number

saveProgress()          // Save to ProgressManager (async)
```

#### Utilities

```javascript
getResponsiveValue(config)
// Returns responsive value based on breakpoint

isMobile()
// Returns: boolean
```

### Event Callbacks

Set these properties to handle events:

```javascript
this.gameLogic.onScoreChange = (score) => {
  console.log('Score:', score);
};

this.gameLogic.onLivesChange = (lives) => {
  console.log('Lives:', lives);
};

this.gameLogic.onGameOver = (data) => {
  console.log('Game Over:', data);
};

this.gameLogic.onGameComplete = (data) => {
  console.log('Complete:', data);
};

this.gameLogic.onPause = () => {
  console.log('Paused');
};

this.gameLogic.onResume = () => {
  console.log('Resumed');
};
```

### Example Usage

```javascript
init(data) {
  super.init(data);

  this.gameLogic = new BaseGame(this, {
    id: 'my-game',
    lives: 3,
    level: 1,
    targetScore: 100,
    timeLimit: 60 // 60 seconds
  });

  // Set callbacks
  this.gameLogic.onScoreChange = (score) => {
    this.scoreText.setText(`Score: ${score}`);
  };

  this.gameLogic.onGameComplete = (data) => {
    console.log('Stars:', data.stars);
  };
}

create() {
  super.create();

  this.gameLogic.init();
  this.gameLogic.start();
}

handleCorrectAnswer() {
  this.gameLogic.addScore(10);
}

handleWrongAnswer() {
  const gameOver = this.gameLogic.loseLife();
  if (gameOver) {
    // Game ended automatically
  }
}
```

---

## PhaserBridge Reference

### Creating a Bridge

```javascript
import PhaserBridge from './phaser/PhaserBridge';

const bridge = new PhaserBridge(gameConfig);
```

### Methods

```javascript
// Initialize Phaser game
init(container, gameConfig)
// Returns: Phaser.Game

// Start scene
startScene(sceneKey, data)

// Set game instance
setGameInstance(baseGameInstance)

// Control game
pause()
resume()

// Get state
getGameState()
getGame()
getActiveScene()

// Events
on(event, callback)
off(event, callback)

// Performance
takeScreenshot()
getPerformance()

// Cleanup
destroy()
```

### Events

```javascript
bridge.on('init', (data) => {});
bridge.on('ready', () => {});
bridge.on('resize', (dims) => {});
bridge.on('pause', () => {});
bridge.on('resume', () => {});
bridge.on('score-change', ({ score }) => {});
bridge.on('lives-change', ({ lives }) => {});
bridge.on('game-over', (data) => {});
bridge.on('game-complete', (data) => {});
```

---

## GameContainer Reference

### Props

```javascript
<GameContainer
  gameConfig={config}     // Game configuration object
  onExit={handleExit}     // Called when user exits game
  onComplete={handleComplete}  // Called when game completes
/>
```

### Features

- Automatically mounts and manages Phaser game
- Displays HUD with score, lives, level
- Provides pause/resume controls
- Shows overlays:
  - Pause menu (Resume, Restart, Exit)
  - Game over screen (Try Again, Exit)
  - Game complete screen (Continue, Play Again)
- Fully responsive and touch-friendly
- Handles cleanup on unmount

### Example Usage

```javascript
import GameContainer from '../components/GameContainer';
import letterMatchConfig from '../../games/LetterMatch/config';

const GamePage = () => {
  const handleExit = () => {
    route('/games');
  };

  const handleComplete = (data) => {
    console.log('Completed with', data.stars, 'stars');
    route('/dashboard');
  };

  return (
    <GameContainer
      gameConfig={letterMatchConfig}
      onExit={handleExit}
      onComplete={handleComplete}
    />
  );
};
```

---

## Complete Example

See `src/games/LetterMatch/` for a complete working example that demonstrates:

- ✅ BaseScene usage with responsive UI
- ✅ BaseGame integration with scoring and lives
- ✅ Service integration (viewport, audio, i18n)
- ✅ Touch-friendly buttons
- ✅ Game completion flow
- ✅ PhaserBridge integration
- ✅ GameContainer usage

---

## Best Practices

### 1. Always Call Parent Methods

```javascript
init(data) {
  super.init(data); // REQUIRED
  // Your init code
}

create() {
  super.create(); // REQUIRED
  // Your create code
}

shutdown() {
  super.shutdown(); // REQUIRED
  if (this.gameLogic) {
    this.gameLogic.destroy();
  }
}
```

### 2. Use Layers for Z-Index Management

```javascript
// Background elements
this.backgroundLayer.add(bgImage);

// Game objects
this.gameLayer.add(player);
this.gameLayer.add(enemy);

// UI elements
this.uiLayer.add(button);
this.uiLayer.add(scoreText);
```

### 3. Responsive Design

```javascript
// Use viewport helpers
const buttonWidth = this.viewport.getResponsiveValue({
  mobile: 150,
  tablet: 200,
  desktop: 250
});

const fontSize = this.viewport.getResponsiveFontSize('h1');
const spacing = this.viewport.getResponsiveSpacing(2);
const touchSize = this.viewport.getTouchTargetSize(); // 44px mobile, 32px desktop
```

### 4. Handle Resize

```javascript
// Responsive positioning
handleResize(viewportState) {
  super.handleResize(viewportState);

  // Reposition your game elements
  const center = this.getCenter();
  this.title.setPosition(center.x, 100);
}
```

### 5. Clean Up Resources

```javascript
shutdown() {
  super.shutdown();

  // Destroy game logic
  if (this.gameLogic) {
    this.gameLogic.destroy();
  }

  // Clear timers
  if (this.myTimer) {
    this.myTimer.destroy();
  }

  // Remove event listeners
  // etc.
}
```

### 6. Use Event Callbacks

```javascript
// Connect BaseGame to UI
this.gameLogic.onScoreChange = (score) => {
  this.scoreText.setText(`Score: ${score}`);
};

this.gameLogic.onLivesChange = (lives) => {
  this.livesText.setText('❤️'.repeat(lives));
};
```

### 7. Service Integration

```javascript
// Audio
this.playSfx('button-click');
this.audio.playMusic('background', { loop: true });

// Translation
const text = this.t('game.instructions');

// Viewport
const isMobile = this.viewport.isMobileDevice();

// Progress (via BaseGame)
await this.gameLogic.saveProgress();
```

### 8. Touch-Friendly UI

```javascript
// Use createButton for touch-friendly buttons
const button = this.createButton(
  x,
  y,
  'Play',
  () => this.handlePlay(),
  {
    width: 200,
    // height automatically uses touch target size (44px)
  }
);

// Manual interactive objects
gameObject.setInteractive({ useHandCursor: true });
gameObject.on('pointerdown', () => {
  // Handle tap/click
});
```

### 9. Safe Areas

```javascript
// Account for notches and safe areas
const safeArea = this.getSafeArea();

// Position UI within safe area
const title = this.createText(
  this.gameWidth / 2,
  safeArea.top + 60, // 60px below safe area top
  'Title'
);
```

### 10. Kannada Font Support

```javascript
// Use kannada flag for Kannada text
const kannadaText = this.createText(
  x,
  y,
  'ಕನ್ನಡ',
  {
    variant: 'h1',
    kannada: true, // Uses Nudi font
    color: '#000'
  }
);
```

---

## Next Steps

1. **Create more games** using this template
2. **Add assets** (audio, images) to game configs
3. **Implement preload logic** in scenes for assets
4. **Add game-specific mechanics** (physics, animations, etc.)
5. **Test on mobile devices** for responsiveness
6. **Integrate with progress tracking** and achievements

---

For questions or issues, refer to:
- `src/phaser/BaseScene.js` - Scene implementation
- `src/phaser/BaseGame.js` - Game logic implementation
- `src/phaser/PhaserBridge.js` - Bridge implementation
- `src/app/components/GameContainer.jsx` - Container component
- `src/games/LetterMatch/` - Complete working example
