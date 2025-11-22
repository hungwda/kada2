/**
 * Home - Landing page
 */

import { h } from 'preact';
import { route } from 'preact-router';

const Home = () => {
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>🎮 Kannada Learning Games</h1>
      <h2>ಕನ್ನಡ ಕಲಿಕಾ ಆಟಗಳು</h2>

      <p style={{ fontSize: '18px', margin: '30px 0' }}>
        Learn Kannada through fun, interactive games!
      </p>

      <button
        onClick={() => route('/games')}
        style={{
          padding: '15px 40px',
          fontSize: '18px',
          backgroundColor: '#1976D2',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
        }}
      >
        Start Playing
      </button>
    </div>
  );
};

export default Home;
