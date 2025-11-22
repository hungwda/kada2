/**
 * Dashboard - User dashboard (stub)
 */

import { h } from 'preact';
import { route } from 'preact-router';

const Dashboard = () => {
  return (
    <div style={{ padding: '20px' }}>
      <button onClick={() => route('/')}>← Back</button>
      <h1>Dashboard</h1>
      <p>Coming soon...</p>
    </div>
  );
};

export default Dashboard;
