/**
 * Settings - App settings (stub)
 */

import { h } from 'preact';
import { route } from 'preact-router';

const Settings = () => {
  return (
    <div style={{ padding: '20px' }}>
      <button onClick={() => route('/')}>← Back</button>
      <h1>Settings</h1>
      <p>Coming soon...</p>
    </div>
  );
};

export default Settings;
