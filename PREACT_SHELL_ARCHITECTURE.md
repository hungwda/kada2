# Preact Shell Architecture Integration

## Overview

Adding **Preact** as the outer application shell provides a lightweight UI framework for:
- User profile management
- Onboarding flows
- PWA installation and management
- Settings and preferences
- Progress dashboard
- Non-game UI interactions

## Why Preact?

✅ **Lightweight**: 3KB gzipped (vs React's 45KB)
✅ **Fast**: Virtual DOM optimized for performance
✅ **Familiar**: React-like API, easy to learn
✅ **Mobile-Optimized**: Small bundle size critical for mobile
✅ **PWA-Friendly**: Works great with service workers
✅ **Component-Based**: Matches our UI architecture

## Architecture Layers

```
┌─────────────────────────────────────────────┐
│         Preact Application Shell            │
│  (User Profile, Onboarding, PWA, Settings)  │
│                                             │
│  ┌───────────────────────────────────────┐ │
│  │      Phaser Game Container            │ │
│  │   (25+ Kannada Learning Games)        │ │
│  │                                       │ │
│  │  ┌─────────────────────────────────┐ │ │
│  │  │    Individual Game Instance     │ │ │
│  │  │  (AksharaCatcher, BalloonPop)   │ │ │
│  │  └─────────────────────────────────┘ │ │
│  └───────────────────────────────────────┘ │
└─────────────────────────────────────────────┘
         │                    │
         ▼                    ▼
   StateStore          ServiceRegistry
   (Redux-like)        (DI Container)
```

## Enhanced Folder Structure

```
kannada-learning-games/
├── src/
│   ├── index.js                    # App entry (Preact bootstrap)
│   │
│   ├── app/                        # ✨ NEW: Preact application shell
│   │   ├── App.jsx                 # Root Preact component
│   │   ├── AppShell.jsx            # Main layout shell
│   │   │
│   │   ├── routes/                 # Route components
│   │   │   ├── Home.jsx            # Landing page
│   │   │   ├── Onboarding.jsx      # Multi-step onboarding
│   │   │   ├── Profile.jsx         # User profile
│   │   │   ├── Dashboard.jsx       # Progress dashboard
│   │   │   ├── GameHub.jsx         # Game selection
│   │   │   ├── GameView.jsx        # Phaser game container
│   │   │   └── Settings.jsx        # App settings
│   │   │
│   │   ├── components/             # Preact UI components
│   │   │   ├── common/
│   │   │   │   ├── Button.jsx
│   │   │   │   ├── Card.jsx
│   │   │   │   ├── Modal.jsx
│   │   │   │   ├── Loading.jsx
│   │   │   │   └── Toast.jsx
│   │   │   │
│   │   │   ├── profile/
│   │   │   │   ├── ProfileCard.jsx
│   │   │   │   ├── ProfileForm.jsx
│   │   │   │   ├── AvatarSelector.jsx
│   │   │   │   └── ProgressStats.jsx
│   │   │   │
│   │   │   ├── onboarding/
│   │   │   │   ├── WelcomeStep.jsx
│   │   │   │   ├── LanguageStep.jsx
│   │   │   │   ├── AgeStep.jsx
│   │   │   │   ├── ParentalControls.jsx
│   │   │   │   └── TutorialStep.jsx
│   │   │   │
│   │   │   ├── pwa/
│   │   │   │   ├── InstallPrompt.jsx
│   │   │   │   ├── UpdateNotification.jsx
│   │   │   │   └── OfflineIndicator.jsx
│   │   │   │
│   │   │   ├── dashboard/
│   │   │   │   ├── ProgressChart.jsx
│   │   │   │   ├── AchievementsList.jsx
│   │   │   │   ├── RecentGames.jsx
│   │   │   │   ├── StreakCounter.jsx
│   │   │   │   └── LearningPath.jsx
│   │   │   │
│   │   │   └── game/
│   │   │       ├── GameCard.jsx
│   │   │       ├── GameGrid.jsx
│   │   │       ├── GameDetails.jsx
│   │   │       ├── GameContainer.jsx
│   │   │       └── GameControls.jsx
│   │   │
│   │   ├── hooks/                  # Custom Preact hooks
│   │   │   ├── useProfile.js
│   │   │   ├── useProgress.js
│   │   │   ├── usePWA.js
│   │   │   ├── useResponsive.js
│   │   │   ├── useGameState.js
│   │   │   └── useAnalytics.js
│   │   │
│   │   └── styles/                 # Component styles
│   │       ├── global.css
│   │       ├── variables.css
│   │       ├── responsive.css
│   │       └── themes.css
│   │
│   ├── core/                       # Core framework (unchanged)
│   │   ├── GameManager.js
│   │   ├── StateStore.js
│   │   ├── ServiceRegistry.js
│   │   ├── BaseService.js
│   │   ├── BaseGame.js
│   │   └── BaseScene.js
│   │
│   ├── services/                   # Services (unchanged)
│   │   ├── ViewportManager.js
│   │   ├── AudioManager.js
│   │   ├── ProgressManager.js
│   │   ├── AnalyticsService.js
│   │   ├── I18nService.js
│   │   └── PWAService.js           # ✨ NEW: PWA management
│   │
│   ├── middleware/                 # State middleware (unchanged)
│   │
│   ├── phaser/                     # ✨ RENAMED: Phaser-specific code
│   │   ├── scenes/                 # Phaser scenes
│   │   │   ├── BootScene.js
│   │   │   ├── PreloadScene.js
│   │   │   └── ...
│   │   │
│   │   ├── games/                  # Individual games
│   │   │   ├── AksharaCatcher/
│   │   │   ├── BalloonPop/
│   │   │   └── ...
│   │   │
│   │   ├── components/             # Phaser game objects
│   │   │   ├── Button.js
│   │   │   ├── Dialog.js
│   │   │   └── ...
│   │   │
│   │   └── plugins/                # Phaser plugins
│   │
│   ├── router/                     # ✨ NEW: Client-side routing
│   │   ├── Router.jsx
│   │   └── routes.js
│   │
│   └── utils/                      # Utilities (unchanged)
│
├── public/
│   ├── index.html
│   ├── manifest.json               # PWA manifest
│   ├── sw.js                       # Service worker
│   └── assets/
│
└── package.json
```

## Updated package.json

```json
{
  "name": "kannada-learning-games",
  "version": "1.0.0",
  "dependencies": {
    "phaser": "^3.70.0",
    "preact": "^10.19.0",
    "preact-router": "^4.1.2",
    "preact-compat": "^3.19.0"
  },
  "devDependencies": {
    "@babel/core": "^7.23.0",
    "@babel/preset-env": "^7.23.0",
    "@babel/preset-react": "^7.23.0",
    "babel-loader": "^9.1.3",
    "copy-webpack-plugin": "^11.0.0",
    "css-loader": "^6.8.1",
    "html-webpack-plugin": "^5.5.3",
    "style-loader": "^3.3.3",
    "webpack": "^5.89.0",
    "webpack-cli": "^5.1.4",
    "webpack-dev-server": "^4.15.1",
    "workbox-webpack-plugin": "^7.0.0"
  }
}
```

## Application Shell Components

### 1. App.jsx (Root Component)

```jsx
import { h } from 'preact';
import { Router } from 'preact-router';
import { useEffect } from 'preact/hooks';

import AppShell from './AppShell';
import Home from './routes/Home';
import Onboarding from './routes/Onboarding';
import Profile from './routes/Profile';
import Dashboard from './routes/Dashboard';
import GameHub from './routes/GameHub';
import GameView from './routes/GameView';
import Settings from './routes/Settings';

import { useProfile } from './hooks/useProfile';
import { usePWA } from './hooks/usePWA';

const App = () => {
  const { profile, isOnboarded } = useProfile();
  const { isInstalled, promptInstall, updateAvailable } = usePWA();

  useEffect(() => {
    // Initialize core systems
    window.gameManager?.initialize();
  }, []);

  // Redirect to onboarding if not completed
  if (!isOnboarded) {
    return <Onboarding />;
  }

  return (
    <AppShell profile={profile} isInstalled={isInstalled}>
      <Router>
        <Home path="/" />
        <Dashboard path="/dashboard" />
        <GameHub path="/games" />
        <GameView path="/games/:gameId" />
        <Profile path="/profile" />
        <Settings path="/settings" />
      </Router>

      {/* PWA Install Prompt */}
      {!isInstalled && (
        <InstallPrompt onInstall={promptInstall} />
      )}

      {/* Update Notification */}
      {updateAvailable && (
        <UpdateNotification />
      )}
    </AppShell>
  );
};

export default App;
```

### 2. AppShell.jsx (Main Layout)

```jsx
import { h } from 'preact';
import { useState } from 'preact/hooks';
import Header from './components/common/Header';
import Navigation from './components/common/Navigation';
import OfflineIndicator from './components/pwa/OfflineIndicator';

const AppShell = ({ children, profile, isInstalled }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div class="app-shell">
      <Header
        profile={profile}
        onMenuToggle={() => setMenuOpen(!menuOpen)}
      />

      <Navigation
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
      />

      <main class="app-content">
        {children}
      </main>

      <OfflineIndicator />
    </div>
  );
};

export default AppShell;
```

### 3. Onboarding.jsx (Multi-Step Onboarding)

```jsx
import { h } from 'preact';
import { useState } from 'preact/hooks';
import WelcomeStep from '../components/onboarding/WelcomeStep';
import LanguageStep from '../components/onboarding/LanguageStep';
import AgeStep from '../components/onboarding/AgeStep';
import AvatarStep from '../components/onboarding/AvatarStep';
import ParentalControls from '../components/onboarding/ParentalControls';

const STEPS = [
  { id: 'welcome', component: WelcomeStep },
  { id: 'language', component: LanguageStep },
  { id: 'age', component: AgeStep },
  { id: 'avatar', component: AvatarStep },
  { id: 'parental', component: ParentalControls }
];

const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [userData, setUserData] = useState({});

  const handleNext = (data) => {
    setUserData({ ...userData, ...data });

    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete onboarding
      completeOnboarding(userData);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const completeOnboarding = async (data) => {
    // Save profile
    await window.services.get('progress').createProfile(data);

    // Dispatch to state
    window.store.dispatch({
      type: 'USER_SET_PROFILE',
      payload: data
    });

    // Redirect to dashboard
    route('/dashboard');
  };

  const StepComponent = STEPS[currentStep].component;

  return (
    <div class="onboarding">
      <div class="onboarding-progress">
        <span>{currentStep + 1} / {STEPS.length}</span>
      </div>

      <StepComponent
        data={userData}
        onNext={handleNext}
        onBack={handleBack}
        isFirst={currentStep === 0}
        isLast={currentStep === STEPS.length - 1}
      />
    </div>
  );
};

export default Onboarding;
```

### 4. GameView.jsx (Phaser Game Container)

```jsx
import { h } from 'preact';
import { useEffect, useRef, useState } from 'preact/hooks';
import GameControls from '../components/game/GameControls';

const GameView = ({ gameId }) => {
  const gameRef = useRef(null);
  const phaserGameRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    // Load game configuration
    const gameConfig = getGameConfig(gameId);

    // Initialize Phaser game
    initializePhaserGame(gameConfig);

    return () => {
      // Cleanup Phaser game on unmount
      if (phaserGameRef.current) {
        phaserGameRef.current.destroy(true);
      }
    };
  }, [gameId]);

  const initializePhaserGame = async (config) => {
    setIsLoading(true);

    const viewport = window.services.get('viewport');
    const dims = viewport.getOptimalGameDimensions();

    const phaserConfig = {
      type: Phaser.AUTO,
      parent: gameRef.current,
      width: dims.width,
      height: dims.height,
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
      },
      scene: config.scenes
    };

    phaserGameRef.current = new Phaser.Game(phaserConfig);

    // Listen for game events
    phaserGameRef.current.events.on('ready', () => {
      setIsLoading(false);
    });

    phaserGameRef.current.events.on('game-over', (result) => {
      handleGameOver(result);
    });
  };

  const handlePause = () => {
    if (phaserGameRef.current) {
      phaserGameRef.current.scene.pause();
      setIsPaused(true);
    }
  };

  const handleResume = () => {
    if (phaserGameRef.current) {
      phaserGameRef.current.scene.resume();
      setIsPaused(false);
    }
  };

  const handleExit = () => {
    // Navigate back to game hub
    route('/games');
  };

  const handleGameOver = (result) => {
    // Save progress
    window.services.get('progress').saveGameResult(gameId, result);

    // Dispatch to state
    window.store.dispatch({
      type: 'GAME_COMPLETE',
      payload: { gameId, result }
    });
  };

  return (
    <div class="game-view">
      {isLoading && (
        <div class="loading-overlay">
          <Loading message="Loading game..." />
        </div>
      )}

      <div
        ref={gameRef}
        class="game-container"
        style={{ display: isLoading ? 'none' : 'block' }}
      />

      <GameControls
        isPaused={isPaused}
        onPause={handlePause}
        onResume={handleResume}
        onExit={handleExit}
      />
    </div>
  );
};

export default GameView;
```

### 5. Dashboard.jsx (Progress Dashboard)

```jsx
import { h } from 'preact';
import { useProgress } from '../hooks/useProgress';
import ProgressChart from '../components/dashboard/ProgressChart';
import AchievementsList from '../components/dashboard/AchievementsList';
import RecentGames from '../components/dashboard/RecentGames';
import StreakCounter from '../components/dashboard/StreakCounter';
import LearningPath from '../components/dashboard/LearningPath';

const Dashboard = () => {
  const {
    totalStars,
    gamesCompleted,
    achievements,
    recentGames,
    currentStreak,
    analytics
  } = useProgress();

  return (
    <div class="dashboard">
      <header class="dashboard-header">
        <h1>ನಿಮ್ಮ ಪ್ರಗತಿ</h1>
        <p>Your Learning Journey</p>
      </header>

      <div class="dashboard-stats">
        <div class="stat-card">
          <span class="stat-value">{totalStars}</span>
          <span class="stat-label">Stars Earned</span>
        </div>
        <div class="stat-card">
          <span class="stat-value">{gamesCompleted.length}</span>
          <span class="stat-label">Games Completed</span>
        </div>
        <div class="stat-card">
          <StreakCounter days={currentStreak} />
        </div>
      </div>

      <ProgressChart data={analytics.timeSpent} />

      <div class="dashboard-grid">
        <RecentGames games={recentGames} />
        <AchievementsList achievements={achievements} />
      </div>

      <LearningPath
        completed={gamesCompleted}
        analytics={analytics}
      />
    </div>
  );
};

export default Dashboard;
```

## Custom Preact Hooks

### usePWA Hook

```javascript
import { useState, useEffect } from 'preact/hooks';

export const usePWA = () => {
  const [isInstalled, setIsInstalled] = useState(false);
  const [installPrompt, setInstallPrompt] = useState(null);
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    // Listen for install prompt
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setInstallPrompt(e);
    });

    // Listen for app installed
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setInstallPrompt(null);
    });

    // Listen for service worker updates
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        setUpdateAvailable(true);
      });
    }
  }, []);

  const promptInstall = async () => {
    if (!installPrompt) return;

    installPrompt.prompt();
    const result = await installPrompt.userChoice;

    if (result.outcome === 'accepted') {
      setInstallPrompt(null);
    }
  };

  const applyUpdate = () => {
    window.location.reload();
  };

  return {
    isInstalled,
    canInstall: !!installPrompt,
    promptInstall,
    updateAvailable,
    applyUpdate
  };
};
```

### useProfile Hook

```javascript
import { useState, useEffect } from 'preact/hooks';

export const useProfile = () => {
  const [profile, setProfile] = useState(null);
  const [isOnboarded, setIsOnboarded] = useState(false);

  useEffect(() => {
    // Subscribe to state changes
    const unsubscribe = window.store.subscribe((state) => {
      setProfile(state.user.profile);
      setIsOnboarded(!!state.user.profile.name);
    });

    // Get initial state
    const state = window.store.getState();
    setProfile(state.user.profile);
    setIsOnboarded(!!state.user.profile.name);

    return unsubscribe;
  }, []);

  const updateProfile = (data) => {
    window.store.dispatch({
      type: 'USER_UPDATE_PROFILE',
      payload: data
    });
  };

  return {
    profile,
    isOnboarded,
    updateProfile
  };
};
```

### useProgress Hook

```javascript
import { useState, useEffect } from 'preact/hooks';

export const useProgress = () => {
  const [progress, setProgress] = useState(null);

  useEffect(() => {
    const unsubscribe = window.store.subscribe((state) => {
      setProgress(state.user.progress);
    });

    const state = window.store.getState();
    setProgress(state.user.progress);

    return unsubscribe;
  }, []);

  return progress || {
    totalStars: 0,
    gamesCompleted: [],
    achievements: [],
    recentGames: [],
    currentStreak: 0,
    analytics: {}
  };
};
```

## PWA Service (New Service)

```javascript
import { BaseService } from '../core/BaseService.js';

class PWAService extends BaseService {
  constructor() {
    super();
    this.registration = null;
    this.updateAvailable = false;
  }

  async initialize() {
    await super.initialize();

    if ('serviceWorker' in navigator) {
      await this.registerServiceWorker();
    }
  }

  async registerServiceWorker() {
    try {
      this.registration = await navigator.serviceWorker.register('/sw.js');

      // Check for updates
      this.registration.addEventListener('updatefound', () => {
        const newWorker = this.registration.installing;

        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            this.updateAvailable = true;
            this.emit('update-available');
          }
        });
      });
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  }

  async checkForUpdates() {
    if (this.registration) {
      await this.registration.update();
    }
  }

  async applyUpdate() {
    if (this.registration && this.registration.waiting) {
      this.registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      window.location.reload();
    }
  }
}

export default PWAService;
```

## Updated Application Bootstrap

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

import './app/styles/global.css';

async function bootstrap() {
  // 1. Initialize core systems
  const gameManager = GameManager.getInstance();
  const store = new StateStore(
    createInitialState(),
    rootReducer,
    [loggerMiddleware, persistenceMiddleware, analyticsMiddleware]
  );
  const registry = new ServiceRegistry();

  // 2. Register services
  registry.register('viewport', new ViewportManager());
  registry.register('i18n', new I18nService());
  registry.register('audio', new AudioManager());
  registry.register('progress', new ProgressManager());
  registry.register('pwa', new PWAService());

  registry.registerFactory('analytics', (reg) => {
    return new AnalyticsService(
      reg.get('viewport'),
      reg.get('progress')
    );
  });

  // 3. Connect systems
  gameManager.setStateStore(store);
  gameManager.setServiceRegistry(registry);

  // 4. Initialize services
  await registry.initializeAll();
  await gameManager.initialize();

  // 5. Make globally accessible
  window.gameManager = gameManager;
  window.store = store;
  window.services = registry;

  // 6. Render Preact app
  render(<App />, document.getElementById('app'));
}

// Start application
bootstrap().catch(console.error);
```

## Benefits of Preact Shell

### 1. Clean Separation of Concerns ✅
- **Preact**: App UI (profiles, onboarding, settings)
- **Phaser**: Game engine and gameplay
- **Services**: Shared business logic

### 2. Better User Experience ✅
- **Fast Loading**: Preact loads first, shows UI immediately
- **Progressive Enhancement**: Phaser loads only when needed
- **Responsive**: Preact components adapt to all screens
- **Native Feel**: PWA provides app-like experience

### 3. Developer Experience ✅
- **Component Reusability**: Share UI components across app
- **State Management**: Single StateStore for everything
- **Routing**: Clean URL structure
- **Hot Reload**: Fast development cycle

### 4. Mobile Optimization ✅
- **Small Bundle**: Preact adds only 3KB
- **Code Splitting**: Load games on demand
- **Offline First**: Service Worker caching
- **Install Prompt**: PWA installation

### 5. Maintainability ✅
- **Clear Structure**: App shell vs. game code
- **Easy Testing**: Component-based testing
- **Scalability**: Add features without touching games
- **Documentation**: Component-based docs

## Summary

Adding Preact as the outer shell provides:

✅ **Lightweight** UI framework (3KB)
✅ **Clean separation** between app and games
✅ **Better UX** with onboarding and profiles
✅ **PWA management** built-in
✅ **Mobile-optimized** bundle size
✅ **Component-based** architecture
✅ **Easy to extend** with new features

This architecture gives you the best of both worlds:
- **Preact** for reactive UI and app features
- **Phaser** for high-performance games
- **Shared services** for business logic

Ready to implement! 🚀
