/**
 * Akshara Catcher Game Configuration
 * Catch falling Kannada letters
 */

import AksharaCatcherScene from './AksharaCatcherScene';

const aksharaCatcherConfig = {
  // Game metadata
  id: 'akshara-catcher',
  name: 'Akshara Catcher',
  nameKannada: 'ಅಕ್ಷರ ಕ್ಯಾಚರ್',
  description: 'Catch falling Kannada letters by moving your basket',
  descriptionKannada: 'ನಿಮ್ಮ ಬುಟ್ಟಿಯನ್ನು ಚಲಿಸುವ ಮೂಲಕ ಬೀಳುವ ಕನ್ನಡ ಅಕ್ಷರಗಳನ್ನು ಹಿಡಿಯಿರಿ',
  category: 'vowels',
  difficulty: 'beginner',

  // Game mechanics
  lives: 3,
  targetScore: 100,
  timeLimit: null, // No time limit

  // Learning objectives
  skills: [
    'vowel-recognition',
    'consonant-recognition',
    'quick-recognition',
    'visual-discrimination'
  ],

  // Levels
  levels: [
    {
      level: 1,
      name: 'Easy',
      letters: 'First 5 vowels (ಅ, ಆ, ಇ, ಈ, ಉ)',
      speed: 'Slow',
      targetScore: 50
    },
    {
      level: 2,
      name: 'Medium',
      letters: 'All vowels (ಅ-ಅಃ)',
      speed: 'Medium',
      targetScore: 100
    },
    {
      level: 3,
      name: 'Hard',
      letters: 'Vowels + Consonants',
      speed: 'Fast',
      targetScore: 150
    }
  ],

  // Phaser configuration
  scenes: [AksharaCatcherScene],
  startScene: 'AksharaCatcherScene',
  backgroundColor: '#87CEEB', // Sky blue

  // Physics (arcade for collision detection)
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  },

  // Assets
  assets: {
    audio: {
      'correct': '/audio/sfx/correct.mp3',
      'wrong': '/audio/sfx/wrong.mp3',
      'level-up': '/audio/sfx/level-up.mp3',
      'background-music': '/audio/music/game-bg-happy.mp3'
    },
    images: {
      // No images needed, using graphics
    },
    particles: {
      'particle': '/images/particle.png' // Simple white circle
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
  },

  // Instructions
  instructions: {
    en: [
      'Move the basket left and right',
      'Catch the letter shown at the top',
      'Avoid catching wrong letters',
      'Green letters are correct',
      'Red letters are wrong'
    ],
    kn: [
      'ಬುಟ್ಟಿಯನ್ನು ಎಡಕ್ಕೆ ಮತ್ತು ಬಲಕ್ಕೆ ಚಲಿಸಿ',
      'ಮೇಲೆ ತೋರಿಸಿದ ಅಕ್ಷರವನ್ನು ಹಿಡಿಯಿರಿ',
      'ತಪ್ಪು ಅಕ್ಷರಗಳನ್ನು ಹಿಡಿಯುವುದನ್ನು ತಪ್ಪಿಸಿ',
      'ಹಸಿರು ಅಕ್ಷರಗಳು ಸರಿ',
      'ಕೆಂಪು ಅಕ್ಷರಗಳು ತಪ್ಪು'
    ]
  },

  // Controls
  controls: {
    desktop: 'Mouse drag or arrow keys',
    mobile: 'Touch and drag',
    tablet: 'Touch and drag'
  }
};

export default aksharaCatcherConfig;
