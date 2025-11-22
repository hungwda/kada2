/**
 * GameHub - Game selection page
 */

import { h } from 'preact';
import { route } from 'preact-router';

const games = [
  {
    id: 'akshara-catcher',
    name: 'Akshara Catcher',
    nameKannada: 'ಅಕ್ಷರ ಕ್ಯಾಚರ್',
    description: 'Catch falling Kannada letters',
    difficulty: 'Beginner',
    icon: '🎯'
  },
  {
    id: 'letter-match',
    name: 'Letter Match',
    nameKannada: 'ಅಕ್ಷರ ಹೊಂದಾಣಿಕೆ',
    description: 'Match Kannada letters with romanization',
    difficulty: 'Beginner',
    icon: '🔤'
  }
];

const GameHub = () => {
  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '30px' }}>
        <button
          onClick={() => route('/')}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#666',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          ← Back to Home
        </button>
      </div>

      <h1>Choose a Game</h1>
      <p style={{ fontSize: '18px', color: '#666' }}>Select a game to start learning Kannada!</p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '20px',
        marginTop: '30px'
      }}>
        {games.map(game => (
          <div
            key={game.id}
            onClick={() => route(`/games/${game.id}`)}
            style={{
              padding: '30px',
              backgroundColor: 'white',
              border: '2px solid #e0e0e0',
              borderRadius: '12px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.15)';
              e.currentTarget.style.borderColor = '#1976D2';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
              e.currentTarget.style.borderColor = '#e0e0e0';
            }}
          >
            <div style={{ fontSize: '48px', marginBottom: '15px' }}>
              {game.icon}
            </div>
            <h3 style={{ margin: '10px 0', fontSize: '22px' }}>
              {game.name}
            </h3>
            <p style={{ fontSize: '16px', color: '#666', fontFamily: 'Nudi, sans-serif' }}>
              {game.nameKannada}
            </p>
            <p style={{ fontSize: '14px', color: '#888', margin: '10px 0' }}>
              {game.description}
            </p>
            <div style={{
              marginTop: '15px',
              padding: '5px 15px',
              backgroundColor: '#E3F2FD',
              color: '#1976D2',
              borderRadius: '20px',
              display: 'inline-block',
              fontSize: '12px',
              fontWeight: 'bold'
            }}>
              {game.difficulty}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameHub;
