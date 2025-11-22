# Kannada Learning Games - Consolidated Architecture

**Version**: 1.0
**Last Updated**: 2025-11-22
**Status**: Core Implementation Complete ✅

---

## Table of Contents

1. [Overview](#overview)
2. [Architecture Principles](#architecture-principles)
3. [Technology Stack](#technology-stack)
4. [Architectural Layers](#architectural-layers)
5. [Core Systems](#core-systems)
6. [Service Layer](#service-layer)
7. [Middleware System](#middleware-system)
8. [Preact Application Shell](#preact-application-shell)
9. [Phaser Game Engine](#phaser-game-engine)
10. [State Management](#state-management)
11. [Responsive Design System](#responsive-design-system)
12. [Application Bootstrap](#application-bootstrap)
13. [Folder Structure](#folder-structure)
14. [Architecture Benefits](#architecture-benefits)

---

## Overview

This architecture powers **25+ Phaser.js educational games** for learning Kannada language, designed with:

- **Modern Architecture**: Redux-like state management, dependency injection, service-oriented design
- **Mobile-First**: 6 responsive breakpoints covering all devices (320px to 1920px+)
- **Lightweight**: Preact shell (3KB) + Phaser games
- **PWA-Ready**: Offline support, installable, update notifications
- **Educational Focus**: Built-in analytics, progress tracking, adaptive difficulty

### Key Features

✅ **Component-Based**: Reusable UI components across 25+ games
✅ **Service-Oriented**: Clean separation via dependency injection
✅ **State Management**: Redux pattern with middleware support
✅ **Responsive**: 6 breakpoints with design tokens
✅ **PWA**: Install prompts, offline caching, service workers
✅ **Accessible**: WCAG-compliant 44px touch targets
✅ **Bilingual**: Kannada/English support
✅ **Analytics**: Learning progress tracking built-in

---

## Architecture Principles

### 1. Component-Based Architecture
- Self-contained games
- Shared base classes (BaseGame, BaseScene, BaseService)
- Reusable UI components
- Plugin system for cross-cutting concerns

### 2. Responsive Design
- Mobile-first approach (320px minimum)
- 6 breakpoints covering phones, tablets, desktops
- Adaptive layouts (portrait/landscape)
- Touch and keyboard input support
- Dynamic scaling based on viewport

### 3. Configuration-Driven
- JSON-based game configurations
- Centralized language data
- Easy content updates without code changes
- Game registry for metadata

### 4. Performance Optimization
- Asset preloading and caching
- Code splitting (Phaser separate bundle)
- Lazy service initialization
- Object pooling for frequent objects

### 5. Separation of Concerns
- **Preact**: Application UI (profiles, onboarding, dashboard)
- **Phaser**: Game engine and gameplay
- **Services**: Shared business logic
- **Middleware**: Cross-cutting concerns

---

## Technology Stack

### Frontend Frameworks
- **Preact 10.19+**: UI framework (3KB gzipped vs React's 45KB)
- **Preact Router 4.1+**: Client-side routing
- **Phaser 3.70+**: 2D game engine

### Build Tools
- **Webpack 5**: Module bundling, code splitting
- **Babel 7**: ES6+ and JSX transpilation
- **Workbox 7**: Service worker generation

### PWA & Storage
- **Service Workers**: Offline support and caching
- **LocalStorage**: User preferences and progress
- **IndexedDB**: Asset caching (planned)

### Architecture Patterns
- **Redux Pattern**: Predictable state management
- **Dependency Injection**: Service registry pattern
- **Middleware**: Cross-cutting concerns
- **Component-Based**: UI composition

---

## Architectural Layers

```
┌─────────────────────────────────────────────────────┐
│            Preact Application Shell                 │
│     (User Profile, Onboarding, PWA, Settings)       │
│                                                     │
│  ┌───────────────────────────────────────────────┐ │
│  │         Phaser Game Container                 │ │
│  │    (25+ Kannada Learning Games)               │ │
│  │                                               │ │
│  │  ┌─────────────────────────────────────────┐ │ │
│  │  │    Individual Game Instance             │ │ │
│  │  │  (BaseGame + BaseScene)                 │ │ │
│  │  └─────────────────────────────────────────┘ │ │
│  └───────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘
           │                          │
           ▼                          ▼
    ┌─────────────┐          ┌─────────────┐
    │  StateStore │          │   Service   │
    │ (Redux-like)│          │  Registry   │
    └─────────────┘          └─────────────┘
           │                          │
           └──────────┬───────────────┘
                      ▼
              ┌───────────────┐
              │  GameManager  │
              │ (Coordinator) │
              └───────────────┘
```

### Layer Responsibilities

**1. Preact Application Shell**
- User authentication and profiles
- Multi-step onboarding flows
- PWA installation and updates
- Progress dashboard with analytics
- Settings and preferences
- Client-side routing

**2. Phaser Game Container**
- Mounts Phaser game instances
- Game HUD (score, lives, level)
- Overlays (pause, game over, complete)
- Touch-friendly controls
- Phaser ↔ Preact communication

**3. Individual Game Instance**
- Game logic via BaseGame
- Scene rendering via BaseScene
- Service integration (audio, viewport, etc.)
- Lifecycle management
- Progress saving

**4. Core Systems**
- StateStore: Centralized state with middleware
- ServiceRegistry: Dependency injection container
- GameManager: Application coordinator
- Middleware: Logger, persistence, analytics

---

## Core Systems

### 1. StateStore (Redux-like State Management)

**Purpose**: Centralized, predictable state management with middleware support

**Features**:
- Single source of truth for application state
- Immutable state updates via reducers
- Middleware support (logging, persistence, analytics)
- Time-travel debugging (undo/redo)
- State history tracking
- Subscribe to state changes

**Implementation**:
```javascript
import { StateStore, createInitialState, rootReducer } from './core/StateStore.js';

const store = new StateStore(
  createInitialState(),
  rootReducer,
  [loggerMiddleware, persistenceMiddleware, analyticsMiddleware]
);

// Subscribe to state changes
store.subscribe((state) => {
  console.log('State updated:', state);
});

// Dispatch actions
store.dispatch({
  type: 'GAME_SET_SCORE',
  payload: { score: 100 }
});

// Time-travel debugging (optional)
store.undo();
store.redo();
```

**Why Redux Pattern**:
- ✅ Predictable state updates for 25+ games
- ✅ Time-travel debugging valuable for educational context
- ✅ Middleware enables analytics and auto-save
- ✅ Single source of truth prevents bugs

### 2. ServiceRegistry (Dependency Injection)

**Purpose**: Manage service dependencies and lifecycle

**Features**:
- Service registration and retrieval
- Lazy initialization (on-demand loading)
- Singleton support
- Circular dependency detection
- Easy mocking for tests

**Implementation**:
```javascript
import ServiceRegistry from './core/ServiceRegistry.js';

const registry = new ServiceRegistry();

// Register instance
registry.register('viewport', new ViewportManager());

// Register factory (lazy loading)
registry.registerFactory('analytics', (registry) => {
  return new AnalyticsService(registry.get('viewport'));
});

// Register singleton
registry.registerSingleton('audio', () => new AudioManager());

// Get service
const viewport = registry.get('viewport');

// Initialize all services
await registry.initializeAll();
```

**Why Dependency Injection**:
- ✅ Easier testing (service mocking)
- ✅ Better service lifecycle management
- ✅ Lazy initialization saves memory
- ✅ Clean dependency management across 25+ games

### 3. GameManager (Application Coordinator)

**Purpose**: Coordinate all services and manage application lifecycle

**Features**:
- Service registration via ServiceRegistry
- Global event handling
- State management via StateStore
- Error handling and recovery
- Application lifecycle (init, pause, resume, destroy)

**Implementation**:
```javascript
import GameManager from './core/GameManager.js';

const gameManager = GameManager.getInstance();

// Register services
gameManager.registerService('viewport', viewportManager);
gameManager.registerService('audio', audioManager);

// Set state store
gameManager.setStateStore(store);

// Initialize
await gameManager.initialize();

// Global events
gameManager.on('viewport:resize', (state) => {
  console.log('Viewport resized:', state);
});

// Control application
gameManager.pause();
gameManager.resume();
```

### 4. BaseService

**Purpose**: Foundation for all services with common lifecycle

**Features**:
- Standard initialization pattern
- Cleanup/destroy hooks
- Dependency injection via registry
- Event emitter pattern (on/emit/off)
- Error handling

**Implementation**:
```javascript
import { BaseService } from './core/BaseService.js';

class AudioManager extends BaseService {
  async initialize() {
    await super.initialize();
    // Load audio system
    // Set up audio context
  }

  async destroy() {
    // Clean up audio resources
    await super.destroy();
  }
}
```

---

## Service Layer

All services extend `BaseService` and are registered in the ServiceRegistry.

### 1. ViewportManager (Responsive Design Hub)

**Purpose**: Handle all responsive behavior and viewport state

**Features**:
- 6 breakpoints: mobile, mobileLandscape, tablet, tabletLandscape, desktop, desktopWide
- Orientation detection (portrait/landscape)
- Responsive value calculation
- Design token access
- Touch target sizing (44px WCAG compliant)
- Font size calculation
- Spacing calculation

**API**:
```javascript
const viewport = new ViewportManager();

// Get current breakpoint
const breakpoint = viewport.getCurrentBreakpoint();
// Returns: 'mobile' | 'mobileLandscape' | 'tablet' | ...

// Get optimal game dimensions for current viewport
const dims = viewport.getOptimalGameDimensions();
// Returns: { width: 800, height: 600 }

// Get responsive value based on breakpoint
const padding = viewport.getResponsiveValue({
  mobile: 10,
  tablet: 20,
  desktop: 30
});

// Get responsive font size
const fontSize = viewport.getResponsiveFontSize('h1');
// Returns: 28px (mobile), 36px (tablet), 48px (desktop)

// Get responsive spacing
const spacing = viewport.getResponsiveSpacing(2);
// Returns: 16px (mobile), 24px (tablet), 32px (desktop)

// Get touch target size
const targetSize = viewport.getTouchTargetSize();
// Returns: 44px (mobile/tablet), 32px (desktop)

// Listen to viewport changes
viewport.onResize((state) => {
  console.log('Viewport changed:', state);
});

// Check device type
if (viewport.isMobile()) {
  // Mobile-specific code
}
```

**Breakpoints**:
```javascript
{
  mobile: 320,           // Phones (portrait)
  mobileLandscape: 568,  // Phones (landscape)
  tablet: 768,           // Tablets (portrait)
  tabletLandscape: 1024, // Tablets (landscape)
  desktop: 1280,         // Desktop
  desktopWide: 1920      // Wide screens
}
```

**Design Tokens**:
```javascript
{
  spacing: {
    mobile: 8,      // Base grid unit
    tablet: 12,
    desktop: 16
  },
  fontSize: {
    mobile: { h1: 28, h2: 24, body: 16, small: 14 },
    tablet: { h1: 36, h2: 30, body: 18, small: 16 },
    desktop: { h1: 48, h2: 36, body: 16, small: 14 }
  },
  touchTarget: {
    mobile: 44,     // WCAG compliant
    tablet: 44,
    desktop: 32
  }
}
```

### 2. AudioManager

**Purpose**: Audio/sound management

**Features**:
- Web Audio API integration with gain nodes
- SFX and music management
- Fade in/out support
- Volume controls (master, music, SFX)
- Mute/unmute functionality
- Audio preloading and caching

### 3. ProgressManager

**Purpose**: Save/load player progress

**Features**:
- User profile management
- Game result tracking (scores, stars, completions)
- Achievement system
- Streak tracking
- Learning analytics
- Auto-save every 30 seconds
- Export/import progress data

### 4. AnalyticsService

**Purpose**: Learning analytics tracking

**Features**:
- Game statistics (play time, accuracy, sessions)
- Progress insights
- Strengths and weaknesses identification
- Performance trends
- Integration with middleware

### 5. I18nService

**Purpose**: Internationalization

**Features**:
- Bilingual support (Kannada/English)
- 100+ built-in translations
- Dynamic language switching
- Variable interpolation with {{var}} syntax
- Language preference persistence

### 6. PWAService

**Purpose**: PWA installation and updates

**Features**:
- Service worker registration and updates
- Install prompt handling
- Update notifications
- Online/offline detection
- Install status tracking

---

## Middleware System

**Purpose**: Handle cross-cutting concerns in state management

### Available Middleware

**1. loggerMiddleware** (Development)
- Log all state changes to console
- Color-coded output
- Shows: prev state → action → next state

**2. persistenceMiddleware**
- Auto-save to localStorage
- Debounced saves (500ms)
- Selective persistence (user progress, preferences)
- State restoration on load

**3. analyticsMiddleware**
- Learning analytics tracking
- Game statistics (play time, accuracy)
- Progress insights
- Strengths/weaknesses identification

### Usage

```javascript
const store = new StateStore(
  createInitialState(),
  rootReducer,
  [loggerMiddleware, persistenceMiddleware, analyticsMiddleware]
);
```

---

## Preact Application Shell

**Purpose**: Lightweight UI framework for app features outside of games

**Why Preact**:
- ✅ Lightweight: 3KB gzipped (vs React's 45KB)
- ✅ Fast: Virtual DOM optimized for performance
- ✅ Familiar: React-like API, easy to learn
- ✅ Mobile-Optimized: Small bundle size critical for mobile
- ✅ PWA-Friendly: Works great with service workers
- ✅ Component-Based: Matches our UI architecture

### Application Routes

- `/` - Home/Landing page
- `/dashboard` - Progress dashboard with analytics
- `/games` - Game selection hub
- `/games/:id` - Individual game view (Phaser container)
- `/profile` - User profile management
- `/settings` - Application settings
- `/onboarding` - Multi-step onboarding flow (first-time users)

### Custom Hooks

```javascript
usePWA()         // PWA install, updates, offline status
useProfile()     // User profile state and actions
useProgress()    // Learning progress and analytics
useResponsive()  // Viewport utilities
useGameState()   // Phaser game integration
useAnalytics()   // Analytics tracking
```

### Component Structure

```
app/
├── App.jsx                 # Root component with routing
├── AppShell.jsx            # Main layout shell
├── routes/                 # Route components
│   ├── Home.jsx
│   ├── Onboarding.jsx      # Multi-step flow
│   ├── Dashboard.jsx       # Analytics dashboard
│   ├── GameHub.jsx         # Game selection
│   ├── GameView.jsx        # Phaser container
│   ├── Profile.jsx
│   └── Settings.jsx
├── components/             # UI component library
│   ├── common/             # Button, Card, Modal, Loading
│   ├── profile/            # ProfileCard, AvatarSelector
│   ├── onboarding/         # WelcomeStep, LanguageStep
│   ├── pwa/                # InstallPrompt, UpdateNotification
│   ├── dashboard/          # ProgressChart, AchievementsList
│   └── game/               # GameCard, GameContainer
├── hooks/                  # Custom Preact hooks
└── styles/                 # Component styles
```

---

## Phaser Game Engine

### Game Layer Architecture

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

### 1. BaseGame

**Purpose**: Foundation for all 25+ games

**Features**:
- Lifecycle management (init, start, pause, resume, end)
- Score tracking with state dispatch
- Lives system with game over detection
- Timer functionality with countdown
- Star calculation (1-3 based on performance)
- Automatic progress saving
- Service integration (viewport, audio, progress, i18n)

**Event Callbacks**:
```javascript
gameLogic.onScoreChange = (score) => {};
gameLogic.onLivesChange = (lives) => {};
gameLogic.onGameOver = (data) => {};
gameLogic.onGameComplete = (data) => {};
gameLogic.onPause = () => {};
gameLogic.onResume = () => {};
```

### 2. BaseScene

**Purpose**: Foundation for all Phaser scenes

**Features**:
- Responsive camera setup with optimal dimensions
- Three rendering layers:
  - Background layer (z-index: 0)
  - Game layer (z-index: 10)
  - UI layer (z-index: 100)
- Touch and keyboard input handling
- Dynamic resize handling
- Helper methods:
  - `createButton()` - Touch-friendly buttons
  - `createText()` - Responsive text with Kannada font
  - `createBackground()` - Full-screen backgrounds
- Scene transitions with fade effects
- Safe area handling for notched devices

### 3. PhaserBridge

**Purpose**: Communication layer between Phaser and Preact

**Features**:
- Phaser game instance lifecycle management
- API for Preact to control games
- Event system for state synchronization
- Automatic resize handling
- Performance monitoring (FPS, delta)
- Screenshot capture capability
- Clean DOM integration

**Events**:
- `init`, `ready`, `resize`, `pause`, `resume`
- `score-change`, `lives-change`
- `game-over`, `game-complete`
- `scene-start`, `step`, `destroy`

### 4. GameContainer (Preact Component)

**Purpose**: Preact component for hosting Phaser games

**Features**:
- Mounts and manages Phaser instances
- Game HUD (score, lives, level, pause button)
- Overlay screens:
  - Pause Menu: Resume, Restart, Exit
  - Game Over: Try Again, Exit with score
  - Game Complete: Continue, Play Again with stars
- Fully responsive layout
- Touch-friendly controls (44px minimum)
- Automatic cleanup on unmount

---

## State Management

### Global State Structure

```javascript
{
  // Application state
  app: {
    initialized: false,
    loading: false,
    error: null,
    viewport: {
      width: 0,
      height: 0,
      breakpoint: 'mobile',
      orientation: 'portrait',
      isMobile: true,
      isTablet: false,
      isDesktop: false,
      scaleFactor: 1,
      gameDimensions: { width: 800, height: 600 }
    }
  },

  // User state
  user: {
    profile: {
      name: '',
      age: null,
      avatarId: 1
    },
    preferences: {
      language: 'kn',
      soundEnabled: true,
      musicEnabled: true,
      musicVolume: 0.7,
      sfxVolume: 1.0,
      difficulty: 'auto',
      showHints: true
    },
    progress: {
      gamesCompleted: [],
      currentLevel: {},
      totalStars: 0,
      achievements: [],
      learningAnalytics: {
        timeSpent: {},
        accuracy: {},
        strengths: [],
        weaknesses: []
      }
    }
  },

  // Current game state
  game: {
    currentGame: null,
    currentScene: null,
    isPaused: false,
    score: 0,
    lives: 3,
    level: 1,
    timeRemaining: 60
  },

  // UI state
  ui: {
    modal: { isOpen: false, type: null, data: null },
    notification: { isVisible: false, message: '', type: 'info' },
    loading: { isVisible: false, progress: 0, message: '' }
  }
}
```

### State Updates

```javascript
// Dispatch actions
window.store.dispatch({
  type: 'GAME_SET_SCORE',
  payload: { score: 100 }
});

// Subscribe to changes
const unsubscribe = window.store.subscribe((state) => {
  console.log('State updated:', state);
});

// Get current state
const state = window.store.getState();
```

---

## Responsive Design System

### Breakpoint Strategy

```javascript
const BREAKPOINTS = {
  mobile: 320,           // Phones (portrait) - 320px to 567px
  mobileLandscape: 568,  // Phones (landscape) - 568px to 767px
  tablet: 768,           // Tablets (portrait) - 768px to 1023px
  tabletLandscape: 1024, // Tablets (landscape) - 1024px to 1279px
  desktop: 1280,         // Desktop - 1280px to 1919px
  desktopWide: 1920      // Wide screens - 1920px+
};
```

### Design Tokens

**Spacing System**:
```javascript
{
  mobile: 8,      // 8px base grid
  tablet: 12,     // 12px base grid
  desktop: 16     // 16px base grid
}
```

**Typography Scale**:
```javascript
{
  mobile: {
    h1: 28,
    h2: 24,
    body: 16,
    small: 14
  },
  tablet: {
    h1: 36,
    h2: 30,
    body: 18,
    small: 16
  },
  desktop: {
    h1: 48,
    h2: 36,
    body: 16,
    small: 14
  }
}
```

**Touch Targets** (WCAG Compliant):
```javascript
{
  mobile: 44,     // 44px minimum (WCAG AAA)
  tablet: 44,     // 44px minimum
  desktop: 32     // 32px for mouse input
}
```

### Responsive Utilities

```javascript
// In Phaser scenes
const viewport = window.services.get('viewport');

// Get responsive values
const fontSize = viewport.getResponsiveFontSize('h1');
const spacing = viewport.getResponsiveSpacing(2);
const buttonSize = viewport.getTouchTargetSize();

// Check device type
if (viewport.isMobile()) {
  // Mobile-specific code
}

// Get breakpoint
const breakpoint = viewport.getCurrentBreakpoint();
// Returns: 'mobile' | 'tablet' | 'desktop' etc.
```

---

## Application Bootstrap

### Complete Initialization Flow

```javascript
// src/index.js

import { h, render } from 'preact';
import App from './app/App';

import GameManager from './core/GameManager';
import { StateStore, createInitialState, rootReducer } from './core/StateStore';
import ServiceRegistry from './core/ServiceRegistry';

import ViewportManager from './services/ViewportManager';
import AudioManager from './services/AudioManager';
import ProgressManager from './services/ProgressManager';
import AnalyticsService from './services/AnalyticsService';
import I18nService from './services/I18nService';
import PWAService from './services/PWAService';

import loggerMiddleware from './middleware/loggerMiddleware';
import persistenceMiddleware from './middleware/persistenceMiddleware';
import analyticsMiddleware from './middleware/analyticsMiddleware';

async function bootstrap() {
  // 1. Create core systems
  const gameManager = GameManager.getInstance();
  const store = new StateStore(
    createInitialState(),
    rootReducer,
    [loggerMiddleware, persistenceMiddleware, analyticsMiddleware]
  );
  const registry = new ServiceRegistry();

  // 2. Register services (order matters for dependencies)
  registry.register('viewport', new ViewportManager());
  registry.register('i18n', new I18nService());
  registry.register('audio', new AudioManager());
  registry.register('progress', new ProgressManager());
  registry.register('pwa', new PWAService());

  // Analytics depends on other services (lazy loaded)
  registry.registerFactory('analytics', (reg) => {
    return new AnalyticsService(
      reg.get('viewport'),
      reg.get('progress')
    );
  });

  // 3. Connect systems
  gameManager.setStateStore(store);
  gameManager.setServiceRegistry(registry);

  // 4. Initialize all services
  await registry.initializeAll();
  await gameManager.initialize();

  // 5. Set up global event listeners
  const viewport = registry.get('viewport');
  viewport.onResize((state) => {
    store.dispatch({
      type: 'APP_SET_VIEWPORT',
      payload: state
    });
  });

  // 6. Load saved progress
  const progress = registry.get('progress');
  await progress.load();

  // 7. Make systems globally accessible
  window.gameManager = gameManager;
  window.store = store;
  window.services = registry;

  // 8. Render Preact app
  render(<App />, document.getElementById('app'));
}

// Start application
bootstrap().catch(console.error);
```

---

## Folder Structure

```
kannada-learning-games/
├── src/
│   ├── app/                        # Preact application shell
│   │   ├── App.jsx                 # Root component
│   │   ├── AppShell.jsx            # Main layout
│   │   ├── routes/                 # Route components
│   │   │   ├── Home.jsx
│   │   │   ├── Onboarding.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── GameHub.jsx
│   │   │   ├── GameView.jsx        # Phaser container
│   │   │   ├── Profile.jsx
│   │   │   └── Settings.jsx
│   │   ├── components/             # UI component library
│   │   │   ├── common/             # Button, Card, Modal
│   │   │   ├── profile/            # ProfileCard, AvatarSelector
│   │   │   ├── onboarding/         # WelcomeStep, LanguageStep
│   │   │   ├── pwa/                # InstallPrompt, UpdateNotification
│   │   │   ├── dashboard/          # ProgressChart, AchievementsList
│   │   │   └── game/               # GameCard, GameContainer
│   │   ├── hooks/                  # Custom Preact hooks
│   │   │   ├── usePWA.js
│   │   │   ├── useProfile.js
│   │   │   └── useProgress.js
│   │   └── styles/                 # Component styles
│   │
│   ├── core/                       # Core framework
│   │   ├── GameManager.js          # Application coordinator
│   │   ├── StateStore.js           # Redux-like state management
│   │   ├── ServiceRegistry.js      # Dependency injection container
│   │   ├── BaseService.js          # Service base class
│   │   ├── BaseGame.js             # Game base class
│   │   └── BaseScene.js            # Scene base class
│   │
│   ├── services/                   # Service layer
│   │   ├── ViewportManager.js      # Responsive viewport management
│   │   ├── AudioManager.js         # Audio/sound management
│   │   ├── ProgressManager.js      # Save/load player progress
│   │   ├── AnalyticsService.js     # Learning analytics tracking
│   │   ├── I18nService.js          # Internationalization
│   │   └── PWAService.js           # PWA management
│   │
│   ├── middleware/                 # State middleware
│   │   ├── loggerMiddleware.js     # State change logging
│   │   ├── persistenceMiddleware.js# Auto-save to localStorage
│   │   └── analyticsMiddleware.js  # Track learning analytics
│   │
│   ├── phaser/                     # Phaser game engine
│   │   ├── games/                  # Individual game implementations
│   │   │   ├── AksharaCatcher/
│   │   │   │   ├── AksharaCatcherScene.js
│   │   │   │   └── config.js
│   │   │   ├── BalloonPop/
│   │   │   └── [25+ more games...]
│   │   ├── scenes/                 # Phaser scenes
│   │   │   ├── BootScene.js
│   │   │   ├── PreloadScene.js
│   │   │   └── MainMenuScene.js
│   │   ├── components/             # Phaser game objects
│   │   │   ├── Button.js
│   │   │   ├── Dialog.js
│   │   │   └── ProgressBar.js
│   │   └── plugins/                # Phaser plugins
│   │       ├── TouchControlsPlugin.js
│   │       └── ParticleEffectsPlugin.js
│   │
│   ├── data/                       # Language data
│   │   └── kannada/
│   │       ├── letters.json        # Alphabet data
│   │       ├── words.json          # Vocabulary data
│   │       ├── sentences.json      # Sentence data
│   │       └── audio-map.json      # Audio file mapping
│   │
│   ├── config/                     # Configuration files
│   │   ├── game.config.js          # Phaser configuration
│   │   ├── responsive.config.js    # Responsive breakpoints
│   │   └── constants.js            # Global constants
│   │
│   ├── utils/                      # Utility functions
│   │   ├── responsive.js
│   │   ├── animation.js
│   │   └── kannadaHelpers.js
│   │
│   └── index.js                    # Entry point
│
├── public/
│   ├── index.html
│   ├── manifest.json               # PWA manifest
│   ├── sw.js                       # Service worker
│   └── assets/
│       ├── images/
│       │   ├── ui/                 # UI elements
│       │   ├── sprites/            # Game sprites
│       │   └── backgrounds/        # Background images
│       ├── audio/
│       │   ├── music/              # Background music
│       │   ├── sfx/                # Sound effects
│       │   └── voice/              # Voice recordings
│       │       ├── letters/        # Letter pronunciations
│       │       ├── words/          # Word pronunciations
│       │       └── sentences/      # Sentence recordings
│       └── fonts/
│           ├── Nudi.ttf            # Kannada fonts
│           └── Tunga.ttf
│
├── webpack.config.js
├── package.json
└── README.md
```

---

## Architecture Benefits

### 1. Maintainability ✅

**Clear Structure**:
- Organized by concern (app, core, services, phaser)
- Consistent patterns across all games
- Well-documented with inline comments

**Service-Oriented**:
- DI makes dependencies explicit
- Easy to replace or mock services
- Clear interfaces between layers

**State Management**:
- Redux pattern ensures predictable updates
- Single source of truth prevents bugs
- Middleware handles cross-cutting concerns

### 2. Extensibility ✅

**Plugin System**:
- Easy to add cross-cutting features
- Phaser plugins for game mechanics
- Service plugins for app features

**Middleware**:
- Add functionality without changing core
- Stack multiple middleware for combined effects
- Easy to enable/disable features

**Service Registry**:
- Register new services without refactoring
- Lazy loading for on-demand features
- Circular dependency detection

**Config-Driven**:
- Add games via JSON, no code changes
- Update content without rebuilding
- Easy A/B testing of game parameters

### 3. Mobile/Tablet Excellence ✅

**Preact Shell**:
- 3KB for instant load
- Progressive enhancement
- Code splitting for games

**6 Breakpoints**:
- Comprehensive device coverage
- Orientation-aware (portrait/landscape)
- Industry-standard sizes

**Touch Targets**:
- 44px WCAG compliance
- Visual feedback on tap
- No accidental clicks

**PWA**:
- Install to home screen
- Offline support
- Update notifications
- Native app feel

### 4. Performance ✅

**Code Splitting**:
- Preact shell loads first
- Phaser loaded separately
- Games loaded on demand

**Lazy Loading**:
- Services initialized on demand
- Assets loaded when needed
- Reduced initial bundle size

**Asset Management**:
- Sprite atlases for efficiency
- Audio sprites for mobile
- Object pooling for frequent objects

**Small Bundle**:
- Preact: 3KB (vs React: 45KB)
- Tree shaking removes unused code
- Webpack optimization

### 5. Developer Experience ✅

**Type-Safe Patterns**:
- Consistent interfaces
- Clear API contracts
- Predictable behavior

**Hot Reload**:
- Fast development cycle
- Instant feedback
- No full page refreshes

**Component-Based**:
- Reusable UI components
- Easy to test in isolation
- Storybook-ready

**Well Documented**:
- Architecture guides
- API references
- Code examples
- Best practices

**Easy Testing**:
- Mockable services
- Isolated components
- Redux DevTools support

### 6. Educational Focus ✅

**Analytics Built-In**:
- Track learning progress automatically
- Identify strengths and weaknesses
- Generate insights from gameplay

**Adaptive Difficulty**:
- Respond to student performance
- Personalize learning path
- Keep students in flow state

**Progress Tracking**:
- Automatic via middleware
- No manual save required
- Cloud sync ready

**Onboarding**:
- Guided introduction for new users
- Progressive disclosure of features
- Age-appropriate UX

**Accessibility**:
- WCAG compliant
- Keyboard navigation
- Screen reader support
- Adjustable difficulty

---

## Summary

This architecture provides:

✅ **Maintainability**: Clear structure, separation of concerns
✅ **Extensibility**: Plugin system, base classes, configuration-driven
✅ **Mobile Support**: 6 breakpoints, touch controls, PWA
✅ **Scalability**: Supports 25+ games efficiently
✅ **Developer Experience**: Clear patterns, reusable components
✅ **User Experience**: Smooth performance, accessible, engaging

The modular design allows developers to:
- Add new games quickly using templates
- Extend functionality via plugins
- Update content without code changes
- Test components independently
- Scale to hundreds of games if needed

**Built for the future, optimized for mobile, designed for learning.**

---

**Next**: See `CONSOLIDATED_DESIGN.md` for game design details, learning objectives, and UI/UX patterns.
