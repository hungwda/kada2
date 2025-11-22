/**
 * Application Entry Point
 * Initializes core systems and renders Preact app
 */

import { h, render } from 'preact';
import App from './app/App';

import GameManager from './core/GameManager';
import { StateStore, createInitialState, rootReducer } from './core/StateStore';
import ServiceRegistry from './core/ServiceRegistry';

import ViewportManager from './services/ViewportManager';
import AudioManager from './services/AudioManager';
import ProgressManager from './services/ProgressManager';
import PWAService from './services/PWAService';
import I18nService from './services/I18nService';

import loggerMiddleware from './middleware/loggerMiddleware';
import persistenceMiddleware, { loadPersistedState } from './middleware/persistenceMiddleware';
import analyticsMiddleware from './middleware/analyticsMiddleware';

import './app/styles/global.css';

/**
 * Bootstrap the application
 */
async function bootstrap() {
  console.log('🚀 Bootstrapping Kannada Learning Games...');

  try {
    // 1. Create core systems
    const gameManager = GameManager.getInstance();

    // Load persisted state
    const persistedState = loadPersistedState();
    const initialState = persistedState
      ? { ...createInitialState(), ...persistedState }
      : createInitialState();

    const store = new StateStore(
      initialState,
      rootReducer,
      [loggerMiddleware, persistenceMiddleware, analyticsMiddleware]
    );

    const registry = new ServiceRegistry();

    // 2. Register services
    console.log('📦 Registering services...');
    registry.register('viewport', new ViewportManager());
    registry.register('i18n', new I18nService());
    registry.register('audio', new AudioManager());
    registry.register('progress', new ProgressManager());
    registry.register('pwa', new PWAService());

    // 3. Connect systems
    gameManager.setStateStore(store);
    gameManager.setServiceRegistry(registry);

    // 4. Initialize services
    console.log('⚙️  Initializing services...');
    await registry.initializeAll();
    await gameManager.initialize();

    // 5. Make globally accessible
    window.gameManager = gameManager;
    window.store = store;
    window.services = registry;

    // 6. Set up viewport state sync
    const viewport = registry.get('viewport');
    viewport.onResize((state) => {
      store.dispatch({
        type: 'APP_SET_VIEWPORT',
        payload: state
      });
    });

    // Initial viewport dispatch
    store.dispatch({
      type: 'APP_SET_VIEWPORT',
      payload: viewport.getViewportState()
    });

    console.log('✅ Application initialized successfully');
    console.log('📊 Services:', registry.getServiceNames());

    // 7. Render Preact app
    const root = document.getElementById('app');
    render(<App />, root);

    console.log('🎨 UI rendered');

  } catch (error) {
    console.error('❌ Bootstrap failed:', error);

    // Show error screen
    const root = document.getElementById('app');
    root.innerHTML = `
      <div style="
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100vh;
        padding: 20px;
        text-align: center;
        background: #f5f5f5;
      ">
        <h1 style="color: #d32f2f; margin-bottom: 10px;">Failed to Load</h1>
        <p style="color: #666; max-width: 400px;">
          ${error.message}
        </p>
        <button
          onclick="window.location.reload()"
          style="
            margin-top: 20px;
            padding: 12px 24px;
            background: #4CAF50;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
          "
        >
          Reload
        </button>
      </div>
    `;
  }
}

// Start the application
bootstrap();
