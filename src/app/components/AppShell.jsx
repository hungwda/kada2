/**
 * AppShell - Main layout wrapper
 */

import { h } from 'preact';

const AppShell = ({ children }) => {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f5f5f5'
    }}>
      {children}
    </div>
  );
};

export default AppShell;
