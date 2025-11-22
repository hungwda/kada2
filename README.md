# Kannada Learning Games

25+ Phaser.js games designed to teach Kannada language to children through interactive, mobile-friendly experiences.

## 🎯 Project Overview

This project provides a comprehensive suite of educational games covering:
- **Alphabet & Letter Recognition** (ಅಕ್ಷರ ಪರಿಚಯ)
- **Vocabulary Building** (ಶಬ್ದ ಸಂಪತ್ತು)
- **Memory & Matching Games**
- **Word Formation & Spelling**
- **Sentence Construction & Grammar**
- **Speed & Reflex Games**
- **Adventure & Story-Based Learning**

## 📱 Key Features

- **Mobile-First Design**: Optimized for phones, tablets, and desktops
- **Responsive Architecture**: Adapts to any screen size (320px - 1920px+)
- **Touch-Friendly**: 44px minimum touch targets (WCAG compliant)
- **Native Audio**: Pronunciation by native Kannada speakers
- **Progress Tracking**: Save and resume learning progress
- **Learning Analytics**: Track student performance and adapt difficulty
- **Offline Support**: Progressive Web App (PWA) capabilities

## 🏗️ Architecture Highlights

### Modern, Scalable Design

✅ **Redux-like State Management**
- Single source of truth
- Time-travel debugging
- Middleware support (logging, persistence, analytics)

✅ **Service-Oriented Architecture**
- Dependency injection via ServiceRegistry
- Clean separation of concerns
- Easy testing and mocking

✅ **Responsive Design System**
- ViewportManager with intelligent breakpoints
- Design tokens for consistency
- Orientation-aware layouts

✅ **Component-Based UI**
- Reusable, responsive components
- Consistent design across 25+ games

✅ **Configuration-Driven**
- JSON-based game definitions
- Easy content updates
- No code changes needed for new levels

## 📂 Project Structure

```
kannada-learning-games/
├── src/
│   ├── core/               # Core framework (StateStore, GameManager, etc.)
│   ├── services/           # Application services (Viewport, Audio, Progress)
│   ├── middleware/         # State middleware (logging, persistence, analytics)
│   ├── games/              # Individual game implementations
│   ├── components/         # Reusable UI components
│   ├── scenes/             # Phaser scenes
│   ├── data/               # Language data (letters, words, sentences)
│   └── config/             # Configuration files
│
├── public/
│   └── assets/             # Images, audio, fonts
│
├── GAME_IDEAS.md           # Complete list of 33 game concepts
├── ARCHITECTURE.md         # Detailed architecture documentation
└── ARCHITECTURE_COMPARISON.md # Analysis of architecture patterns
```

## 🎮 Game Categories

### Beginner Level (6 games)
1. Akshara Catcher - Catch falling letters
2. Sound Match - Match letters to sounds
3. Fruit Basket - Learn fruit vocabulary
4. Animal Safari - Identify animals
5. Color Splash - Color recognition
6. Number Ninja - Number learning

### Intermediate Level (13 games)
7-19: Kitchen Quest, Body Parts, Word Builder, Memory games, and more

### Advanced Level (6 games)
20-25: Sentence construction, story sequencing, comprehension

### Engagement Games (8 games)
26-33: Speed-based, adventure, and comprehensive learning

See [GAME_IDEAS.md](./GAME_IDEAS.md) for complete game descriptions.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 📱 Responsive Breakpoints

- **Mobile**: 320px (portrait), 568px (landscape)
- **Tablet**: 768px (portrait), 1024px (landscape)
- **Desktop**: 1280px standard, 1920px wide
- **Touch Targets**: 44px (mobile/tablet), 32px (desktop)
- **Font Sizes**: Responsive scaling (16px - 48px)

## 🔧 Technology Stack

- **Phaser 3.70+**: Game framework
- **Webpack 5**: Module bundling
- **Babel**: ES6+ support
- **Service Workers**: Offline support
- **LocalStorage**: Progress persistence

## 📖 Documentation

- **[GAME_IDEAS.md](./GAME_IDEAS.md)**: All 33 game concepts with descriptions
- **[ARCHITECTURE.md](./ARCHITECTURE.md)**: Complete architecture guide
  - Core systems (StateStore, ServiceRegistry, ViewportManager)
  - Service architecture
  - Responsive design system
  - Component library
  - Implementation examples
- **[ARCHITECTURE_COMPARISON.md](./ARCHITECTURE_COMPARISON.md)**: Architecture analysis
  - Pattern recommendations
  - Integration strategy
  - Best practices

## 🎨 Design Principles

1. **Mobile-First**: Start with smallest screens, scale up
2. **Accessibility**: WCAG compliant, keyboard and touch support
3. **Progressive Enhancement**: Core functionality works everywhere
4. **Performance**: 60 FPS target, optimized asset loading
5. **Culturally Relevant**: Karnataka-specific content and themes

## 🧪 Development Workflow

### Adding a New Game

1. Create game folder in `src/games/YourGame/`
2. Extend `BaseGame` class
3. Create `config.json` with game metadata
4. Add assets to `public/assets/`
5. Register in `data/gameRegistry.json`
6. Test on mobile and desktop

Example:
```javascript
import BaseGame from '../../core/BaseGame.js';

class MyGame extends BaseGame {
  constructor(scene, config) {
    super(scene, config);
  }

  create() {
    super.create();
    // Game-specific setup
  }
}
```

### Using Responsive Utilities

```javascript
// In any scene
const viewport = window.services.get('viewport');

// Get responsive values
const fontSize = viewport.getResponsiveFontSize('h1');
const spacing = viewport.getResponsiveSpacing(2);
const buttonSize = viewport.getTouchTargetSize();

// Check device type
if (viewport.isMobile()) {
  // Mobile-specific code
}

// Get breakpoint
const breakpoint = viewport.getCurrentBreakpoint();
// Returns: 'mobile' | 'tablet' | 'desktop' etc.
```

### Managing State

```javascript
// Get current state
const state = window.store.getState();

// Dispatch actions
window.store.dispatch({
  type: 'GAME_SET_SCORE',
  payload: { score: 100 }
});

// Subscribe to changes
const unsubscribe = window.store.subscribe((state) => {
  console.log('State updated:', state);
});
```

## 🎯 Learning Objectives

### Literacy Skills
- Letter recognition (vowels and consonants)
- Letter formation and writing
- Combined characters (gunithakshara)
- Phonetic awareness

### Vocabulary
- Common nouns (fruits, animals, colors, numbers)
- Verbs and actions
- Adjectives and opposites
- Family and social terms

### Grammar
- Sentence structure
- Word formation
- Question construction
- Reading comprehension

## 🌟 Features Roadmap

### Phase 1: Foundation (Current)
- ✅ Architecture design
- ✅ Core systems implementation
- ✅ Responsive framework
- ⏳ First 6 games (beginner level)

### Phase 2: Content Expansion
- ⏳ 13 intermediate games
- ⏳ Audio recordings
- ⏳ Kannada font integration

### Phase 3: Advanced Features
- ⏳ 6 advanced games
- ⏳ Learning analytics dashboard
- ⏳ Teacher/parent portal

### Phase 4: Enhancement
- ⏳ 8 engagement games
- ⏳ Multiplayer support
- ⏳ Cloud sync
- ⏳ Additional languages

## 🤝 Contributing

Contributions welcome! Areas of focus:
- New game ideas
- Audio recordings (native speakers)
- Translation improvements
- Bug fixes and optimizations
- Accessibility enhancements

## 📄 License

MIT License - See LICENSE file for details

## 🙏 Acknowledgments

- Phaser.js community
- Kannada language educators
- Open source contributors

---

**Built with ❤️ for Kannada learners everywhere**

ಕನ್ನಡವನ್ನು ಕಲಿಯೋಣ! (Let's learn Kannada!)
