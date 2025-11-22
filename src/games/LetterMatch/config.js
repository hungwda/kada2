/**
 * Letter Match Game Configuration
 * Defines game metadata and Phaser configuration
 */

import LetterMatchScene from './LetterMatchScene';

const letterMatchConfig = {
  // Game metadata
  id: 'letter-match',
  name: 'Letter Match',
  nameKannada: 'ಅಕ್ಷರ ಹೊಂದಾಣಿಕೆ',
  description: 'Match Kannada letters with their romanized equivalents',
  category: 'vowels',
  difficulty: 'beginner',

  // Game mechanics
  lives: 3,
  targetScore: 100,
  timeLimit: null, // No time limit

  // Learning objectives
  skills: ['vowel-recognition', 'reading'],

  // Phaser configuration
  scenes: [LetterMatchScene],
  startScene: 'LetterMatchScene',
  backgroundColor: '#E3F2FD',

  // Physics (if needed)
  physics: null,

  // Assets (for preloading)
  assets: {
    audio: {
      // 'correct': '/audio/sfx/correct.mp3',
      // 'wrong': '/audio/sfx/wrong.mp3',
      // 'background-music': '/audio/music/game-bg.mp3'
    },
    images: {
      // Add any image assets here
    },
    fonts: {
      kannada: 'Nudi'
    }
  },

  // UI configuration
  ui: {
    showScore: true,
    showLives: true,
    showTimer: false,
    showLevel: true
  },

  // Scene data to pass
  sceneData: {
    level: 1
  }
};

export default letterMatchConfig;
