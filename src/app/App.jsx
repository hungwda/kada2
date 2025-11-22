/**
 * App - Root Preact Component
 * Main application shell with routing
 */

import { h } from 'preact';
import { Router } from 'preact-router';
import { useState, useEffect } from 'preact/hooks';

// Routes
import Home from './routes/Home';
import Onboarding from './routes/Onboarding';
import Dashboard from './routes/Dashboard';
import GameHub from './routes/GameHub';
import Profile from './routes/Profile';
import Settings from './routes/Settings';

// Pages
import GameView from './pages/GameView';

// Components
import AppShell from './components/AppShell';
import InstallPrompt from './components/pwa/InstallPrompt';
import UpdateNotification from './components/pwa/UpdateNotification';
import OfflineIndicator from './components/pwa/OfflineIndicator';

const App = () => {
  const [isOnboarded, setIsOnboarded] = useState(true); // Will check from state
  const [isInstalled, setIsInstalled] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    // Check if user has completed onboarding
    if (window.store) {
      const store = window.store;
      const state = store.getState();

      const hasProfile = state.user.profile.name && state.user.profile.name.length > 0;
      setIsOnboarded(hasProfile);

      // Listen for state changes
      const unsubscribe = store.subscribe((newState) => {
        const hasProfile = newState.user.profile.name && newState.user.profile.name.length > 0;
        setIsOnboarded(hasProfile);
      });

      return () => {
        unsubscribe();
      };
    }
  }, []);

  // Handle onboarding completion
  const handleOnboardingComplete = () => {
    setIsOnboarded(true);
  };

  // If not onboarded, show onboarding
  if (!isOnboarded) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  return (
    <AppShell>
      <Router>
        <Home path="/" />
        <Dashboard path="/dashboard" />
        <GameHub path="/games" />
        <GameView path="/games/:gameId" />
        <Profile path="/profile" />
        <Settings path="/settings" />
      </Router>

      {/* PWA Components - Coming soon */}
      {/* {!isInstalled && <InstallPrompt />} */}
      {/* {updateAvailable && <UpdateNotification />} */}
      {/* {!isOnline && <OfflineIndicator />} */}
    </AppShell>
  );
};

export default App;
