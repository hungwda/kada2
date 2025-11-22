/**
 * Profile - User profile (stub)
 */

import { h } from 'preact';
import { route } from 'preact-router';

const Profile = () => {
  return (
    <div style={{ padding: '20px' }}>
      <button onClick={() => route('/')}>← Back</button>
      <h1>Profile</h1>
      <p>Coming soon...</p>
    </div>
  );
};

export default Profile;
