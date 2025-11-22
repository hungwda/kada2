# Kannada Learning Games - Consolidated Design Document

**Version**: 1.0
**Last Updated**: 2025-11-22
**Status**: Design Complete, Implementation Ready ✅

---

## Table of Contents

1. [Overview](#overview)
2. [Game Portfolio](#game-portfolio)
3. [Learning Objectives](#learning-objectives)
4. [Design Principles](#design-principles)
5. [Game Layer Architecture](#game-layer-architecture)
6. [Building a New Game](#building-a-new-game)
7. [Component Library](#component-library)
8. [UI/UX Patterns](#uiux-patterns)
9. [Responsive Design Guidelines](#responsive-design-guidelines)
10. [Accessibility](#accessibility)
11. [Asset Requirements](#asset-requirements)
12. [Best Practices](#best-practices)

---

## Overview

This document provides comprehensive design specifications for the **25+ Phaser.js educational games** designed to teach Kannada language to children through interactive, mobile-friendly experiences.

### Target Audience

- **Age Range**: 5-15 years old
- **Language Level**: Beginners to intermediate Kannada learners
- **Devices**: Mobile phones, tablets, and desktops
- **Context**: Home learning, school, and tutoring

### Design Goals

🎯 **Educational**: Effective learning through gameplay
📱 **Mobile-First**: Optimized for touch devices
🎨 **Engaging**: Fun and motivating experiences
♿ **Accessible**: WCAG compliant, inclusive design
🌍 **Cultural**: Karnataka-specific content and themes

---

## Game Portfolio

### Complete Game List (33 Games)

#### Category 1: Alphabet & Letter Recognition (5 games)

**1. Akshara Catcher** (Letter Catcher)
- **Concept**: Letters fall from the sky, player must catch the correct letter
- **Learning**: Vowels (ಅ-ಅಃ) and consonants (ಕ-ಹ) recognition
- **Mechanics**: Drag basket/character to catch falling letters
- **Difficulty**: Beginner

**2. Varna Mala Balloon Pop** (Alphabet Balloon Pop)
- **Concept**: Pop balloons in alphabetical order
- **Learning**: Letter sequence and order
- **Mechanics**: Click/tap balloons in correct sequence
- **Difficulty**: Beginner

**3. Letter Trace Master**
- **Concept**: Trace Kannada letters with finger/mouse
- **Learning**: Letter formation and writing
- **Mechanics**: Follow the path to draw letters correctly
- **Difficulty**: Beginner

**4. Gunithakshara Builder** (Combined Character Builder)
- **Concept**: Combine consonants with vowel signs to form syllables
- **Learning**: How ಕ + ಾ = ಕಾ, etc.
- **Mechanics**: Drag and drop vowel signs onto consonants
- **Difficulty**: Intermediate

**5. Sound Match**
- **Concept**: Match letter to its pronunciation
- **Learning**: Letter sounds and phonetics
- **Mechanics**: Listen to sound, click matching letter
- **Difficulty**: Beginner

#### Category 2: Vocabulary Building (8 games)

**6. Fruit Basket Bonanza** (ಹಣ್ಣು)
- **Concept**: Match Kannada fruit names to images
- **Learning**: Fruit vocabulary (ಮಾವು, ಬಾಳೆ, ಸೀಬೆ, etc.)
- **Mechanics**: Drag fruit names to matching images
- **Difficulty**: Beginner

**7. Animal Safari** (ಪ್ರಾಣಿಗಳು)
- **Concept**: Identify animals by their Kannada names
- **Learning**: Animal vocabulary (ಆನೆ, ಹುಲಿ, ಕರಡಿ, etc.)
- **Mechanics**: Click on animals when name is called
- **Difficulty**: Beginner

**8. Color Splash** (ಬಣ್ಣಗಳು)
- **Concept**: Paint objects with correct colors
- **Learning**: Color names (ಕೆಂಪು, ನೀಲಿ, ಹಸಿರು, etc.)
- **Mechanics**: Select color and paint matching objects
- **Difficulty**: Beginner

**9. Body Parts Puzzle** (ಅಂಗಗಳು)
- **Concept**: Label body parts correctly
- **Learning**: Body part vocabulary (ತಲೆ, ಕೈ, ಕಾಲು, etc.)
- **Mechanics**: Drag labels to correct body parts
- **Difficulty**: Beginner

**10. Kitchen Quest** (ಅಡಿಗೆ ಮನೆ)
- **Concept**: Find kitchen items by name
- **Learning**: Kitchen/cooking vocabulary
- **Mechanics**: Hidden object game with Kannada clues
- **Difficulty**: Intermediate

**11. Number Ninja** (ಸಂಖ್ಯೆಗಳು)
- **Concept**: Match numbers to quantities
- **Learning**: Numbers 1-100 in Kannada
- **Mechanics**: Count objects and select correct number
- **Difficulty**: Beginner

**12. Opposite Odyssey** (ವಿರುದ್ಧ ಪದಗಳು)
- **Concept**: Match opposite words
- **Learning**: Antonyms (ದೊಡ್ಡ-ಚಿಕ್ಕ, ಎತ್ತರ-ತಗ್ಗು, etc.)
- **Mechanics**: Connect matching pairs
- **Difficulty**: Intermediate

**13. Verb Action Arena** (ಕ್ರಿಯಾಪದಗಳು)
- **Concept**: Match verbs to animations
- **Learning**: Common verbs (ಓಡು, ಜಿಗಿ, ತಿನ್ನು, etc.)
- **Mechanics**: Watch animation, select correct verb
- **Difficulty**: Intermediate

#### Category 3: Memory & Matching (3 games)

**14. Akshara Memory Match**
- **Concept**: Classic memory card game with letters
- **Learning**: Letter recognition and memory
- **Mechanics**: Flip cards to find matching pairs
- **Difficulty**: Beginner

**15. Word-Picture Memory**
- **Concept**: Match Kannada words to pictures
- **Learning**: Word-image association
- **Mechanics**: Find matching word-picture pairs
- **Difficulty**: Intermediate

**16. Rhyme Time Memory**
- **Concept**: Match rhyming Kannada words
- **Learning**: Sound patterns and phonetics
- **Mechanics**: Memory matching with audio
- **Difficulty**: Advanced

#### Category 4: Word Formation & Spelling (4 games)

**17. Akshara Scramble**
- **Concept**: Unscramble letters to form words
- **Learning**: Spelling and word formation
- **Mechanics**: Drag letters to correct positions
- **Difficulty**: Intermediate

**18. Word Builder Workshop**
- **Concept**: Build words letter by letter
- **Learning**: Spelling and vocabulary
- **Mechanics**: Select letters in sequence to spell words
- **Difficulty**: Intermediate

**19. Crossword Kids**
- **Concept**: Simple crossword puzzles
- **Learning**: Spelling, vocabulary, and clues
- **Mechanics**: Fill in crossword with Kannada words
- **Difficulty**: Advanced

**20. Word Search Safari**
- **Concept**: Find hidden Kannada words in grid
- **Learning**: Word recognition and vocabulary
- **Mechanics**: Select letter sequences to find words
- **Difficulty**: Intermediate

#### Category 5: Sentence Construction & Grammar (3 games)

**21. Sentence Builder**
- **Concept**: Arrange words to make correct sentences
- **Learning**: Sentence structure and grammar
- **Mechanics**: Drag words into correct order
- **Difficulty**: Advanced

**22. Story Sequencer**
- **Concept**: Arrange story panels in correct order
- **Learning**: Reading comprehension and sequence
- **Mechanics**: Drag panels to create story
- **Difficulty**: Advanced

**23. Question Answer Quest**
- **Concept**: Match questions with correct answers
- **Learning**: Question formation and comprehension
- **Mechanics**: Connect questions to answers
- **Difficulty**: Advanced

#### Category 6: Speed & Reflex (3 games)

**24. Rapid Fire Reader**
- **Concept**: Read word and select matching image quickly
- **Learning**: Fast word recognition
- **Mechanics**: Timed multiple choice
- **Difficulty**: Intermediate

**25. Letter Rush**
- **Concept**: Type/select letter before time runs out
- **Learning**: Letter recognition speed
- **Mechanics**: Quick time events
- **Difficulty**: Beginner

**26. Word Whacker**
- **Concept**: Whack-a-mole style with correct words
- **Learning**: Vocabulary and speed
- **Mechanics**: Click/tap correct words that pop up
- **Difficulty**: Intermediate

#### Category 7: Adventure & Story-Based (3 games)

**27. Kannada Kingdom Adventure**
- **Concept**: RPG-style adventure with language challenges
- **Learning**: Comprehensive language skills
- **Mechanics**: Solve language puzzles to progress
- **Difficulty**: Advanced

**28. Treasure Island Tales**
- **Concept**: Follow story, make choices in Kannada
- **Learning**: Reading comprehension and decision making
- **Mechanics**: Interactive story with choices
- **Difficulty**: Advanced

**29. Market Mania** (ಮಾರುಕಟ್ಟೆ)
- **Concept**: Shopping simulation game
- **Learning**: Numbers, items, basic conversation
- **Mechanics**: Buy/sell items using Kannada
- **Difficulty**: Intermediate

#### Category 8: Special Categories (4 games)

**30. Days & Months Master**
- **Concept**: Calendar-based learning game
- **Learning**: Days of week, months, dates
- **Mechanics**: Answer calendar-related questions
- **Difficulty**: Beginner

**31. Family Tree Explorer** (ಕುಟುಂಬ)
- **Concept**: Learn family relationship terms
- **Learning**: Family vocabulary (ಅಮ್ಮ, ಅಪ್ಪ, ಅಜ್ಜ, etc.)
- **Mechanics**: Build family tree with correct terms
- **Difficulty**: Beginner

**32. Weather Watcher** (ಹವಾಮಾನ)
- **Concept**: Match weather descriptions to scenes
- **Learning**: Weather and season vocabulary
- **Mechanics**: Select matching weather conditions
- **Difficulty**: Beginner

**33. Profession Parade** (ಉದ್ಯೋಗಗಳು)
- **Concept**: Match professions to tools/locations
- **Learning**: Occupation vocabulary
- **Mechanics**: Connect professionals to their workplaces
- **Difficulty**: Intermediate

### Implementation Priority

**Phase 1 - Core Games (6 beginner games)**
1. Akshara Catcher
2. Sound Match
3. Fruit Basket Bonanza
4. Animal Safari
5. Color Splash
6. Number Ninja

**Phase 2 - Vocabulary Expansion (6 games)**
7. Kitchen Quest
8. Body Parts Puzzle
9. Days & Months Master
10. Family Tree Explorer
11. Weather Watcher
12. Profession Parade

**Phase 3 - Intermediate Skills (7 games)**
13. Gunithakshara Builder
14. Word Builder Workshop
15. Akshara Memory Match
16. Word-Picture Memory
17. Akshara Scramble
18. Opposite Odyssey
19. Verb Action Arena

**Phase 4 - Advanced Learning (5 games)**
20. Sentence Builder
21. Story Sequencer
22. Crossword Kids
23. Word Search Safari
24. Question Answer Quest

**Phase 5 - Engagement Games (6 games)**
25. Rapid Fire Reader
26. Letter Rush
27. Word Whacker
28. Varna Mala Balloon Pop
29. Letter Trace Master
30. Market Mania

**Phase 6 - Comprehensive Games (3 games)**
31. Kannada Kingdom Adventure
32. Treasure Island Tales
33. Rhyme Time Memory

---

## Learning Objectives

### Literacy Skills

**Letter Recognition**
- Identify all vowels (ಅ-ಅಃ)
- Identify all consonants (ಕ-ಹ)
- Distinguish between similar-looking letters
- Recognize letters in different contexts

**Letter Formation**
- Trace letters correctly
- Understand stroke order
- Write letters independently
- Develop fine motor skills

**Combined Characters (Gunithakshara)**
- Understand consonant + vowel combinations
- Form common syllables
- Read combined characters
- Write combined characters

**Phonetic Awareness**
- Associate letters with sounds
- Identify similar sounds
- Distinguish between sounds
- Blend sounds to form words

### Vocabulary

**Common Nouns**
- Fruits (ಹಣ್ಣು): 20+ fruit names
- Animals (ಪ್ರಾಣಿಗಳು): 30+ animal names
- Colors (ಬಣ್ಣಗಳು): 10+ color names
- Numbers (ಸಂಖ್ಯೆಗಳು): 1-100
- Body Parts (ಅಂಗಗಳು): 15+ body parts
- Kitchen Items: 20+ items
- Family Members: 15+ relationships

**Verbs and Actions**
- Common verbs (ಓಡು, ಜಿಗಿ, ತಿನ್ನು)
- Action words in context
- Verb conjugations (basic)

**Adjectives and Opposites**
- Size (ದೊಡ್ಡ-ಚಿಕ್ಕ)
- Height (ಎತ್ತರ-ತಗ್ಗು)
- Speed (ವೇಗ-ನಿಧಾನ)
- Temperature (ಬಿಸಿ-ತಂಪು)

**Temporal and Spatial**
- Days of week
- Months of year
- Seasons
- Weather conditions
- Locations and directions

### Grammar

**Sentence Structure**
- Subject-Object-Verb order
- Basic sentence construction
- Question formation
- Negation

**Word Formation**
- Compound words
- Prefixes and suffixes (basic)
- Plural forms

**Reading Comprehension**
- Understand simple sentences
- Follow short stories
- Answer questions about text
- Make predictions

---

## Design Principles

### 1. Age Appropriate

**For Ages 5-8**:
- Simple, colorful graphics
- Large touch targets (44px minimum)
- Clear audio instructions
- Short game sessions (2-5 minutes)
- Immediate feedback
- Generous time limits

**For Ages 9-12**:
- More detailed graphics
- Complex game mechanics
- Longer game sessions (5-10 minutes)
- Strategy elements
- Competitive features

**For Ages 13-15**:
- Advanced challenges
- Time pressure
- Achievement systems
- Leaderboards (optional)
- Story-based games

### 2. Cultural Context

**Karnataka-Specific Content**:
- Local fruits and vegetables
- Regional animals and birds
- Traditional festivals
- Local landmarks
- Cultural practices

**Visual Design**:
- Karnataka-inspired color palettes
- Traditional art styles (optional)
- Culturally appropriate characters
- Local architecture in backgrounds

### 3. Progressive Difficulty

**Easy Mode**:
- Limited options (2-3 choices)
- Generous time limits
- Unlimited retries
- Helpful hints available
- Clear feedback

**Medium Mode**:
- More options (4-5 choices)
- Standard time limits
- Limited retries
- Hints available
- Performance tracking

**Hard Mode**:
- Many options (6+ choices)
- Tight time limits
- Limited lives
- No hints
- Star ratings

### 4. Immediate Feedback

**Visual Feedback**:
- ✅ Green checkmark for correct
- ❌ Red X for incorrect
- ⭐ Stars for excellent
- 🎉 Celebration animations
- Color changes

**Audio Feedback**:
- Pleasant sound for correct
- Gentle sound for incorrect
- Encouraging voice-overs
- Background music

**Haptic Feedback** (mobile):
- Light vibration on tap
- Success vibration pattern
- Error vibration pattern

### 5. Positive Reinforcement

**Reward Systems**:
- Stars (1-3 per game)
- Achievements/badges
- Streak counters
- Progress bars
- Unlockable content

**Encouraging Language**:
- "Great job!" (ಉತ್ತಮ!)
- "Try again!" (ಮತ್ತೊಮ್ಮೆ ಪ್ರಯತ್ನಿಸಿ!)
- "You're learning!" (ನೀವು ಕಲಿಯುತ್ತಿದ್ದೀರಿ!)
- Never negative or punishing

### 6. Repetition with Variation

**Spaced Repetition**:
- Review previously learned content
- Gradual introduction of new items
- Mix of old and new in each session

**Variety**:
- Same concept, different games
- Different contexts for same vocabulary
- Multiple learning modalities

### 7. Fun First

**Engaging Gameplay**:
- Game mechanics that are inherently fun
- Learning happens naturally through play
- Not "edutainment" but "education through entertainment"

**Visual Appeal**:
- Bright, cheerful colors
- Smooth animations
- Delightful characters
- Appealing art style

---

## Game Layer Architecture

### Component Responsibilities

```
┌─────────────────────────────────────────┐
│          Preact UI Layer                │
│  ┌───────────────────────────────────┐  │
│  │     GameContainer.jsx             │  │
│  │  (HUD, Overlays, Controls)        │  │
│  └───────────┬───────────────────────┘  │
│              │                           │
│  ┌───────────▼───────────────────────┐  │
│  │     PhaserBridge.js               │  │
│  │  (Phaser ↔ Preact Communication)  │  │
│  └───────────┬───────────────────────┘  │
└──────────────┼───────────────────────────┘
               │
┌──────────────▼───────────────────────────┐
│          Phaser Game Layer               │
│  ┌───────────────────────────────────┐  │
│  │     BaseScene.js                  │  │
│  │  (Responsive Phaser Scene)        │  │
│  └───────────┬───────────────────────┘  │
│              │                           │
│  ┌───────────▼───────────────────────┐  │
│  │     BaseGame.js                   │  │
│  │  (Game Logic & Lifecycle)         │  │
│  └───────────────────────────────────┘  │
└──────────────────────────────────────────┘
```

**BaseGame.js** - Foundation for all games
- Game lifecycle (init, start, pause, resume, end)
- Score tracking and lives management
- Timer functionality
- Star calculation
- Progress saving
- Service integration

**BaseScene.js** - Responsive Phaser scene setup
- Camera and layer management
- Input handling (touch + keyboard)
- Resize handling
- UI helpers (buttons, text, backgrounds)
- Scene transitions

**PhaserBridge.js** - Phaser ↔ Preact communication
- Creates and manages Phaser game instances
- Provides API for Preact to control games
- Emits events for state changes
- Handles DOM integration and cleanup

**GameContainer.jsx** - Preact component
- Renders Phaser game canvas
- Displays game HUD (score, lives, level)
- Shows overlays (pause, game over, complete)
- Provides pause/resume controls
- Handles game lifecycle from UI

---

## Building a New Game

### Step 1: Create Game Directory

```bash
src/phaser/games/YourGame/
├── YourGameScene.js     # Phaser scene
├── config.js            # Game configuration
└── assets/              # Game-specific assets
```

### Step 2: Create Game Scene

```javascript
// src/phaser/games/YourGame/YourGameScene.js

import BaseScene from '../../BaseScene';
import BaseGame from '../../BaseGame';

class YourGameScene extends BaseScene {
  constructor() {
    super({ key: 'YourGameScene' });
    this.gameLogic = null;
  }

  init(data) {
    super.init(data);

    // Create game logic
    this.gameLogic = new BaseGame(this, {
      id: 'your-game',
      lives: 3,
      level: data.level || 1,
      targetScore: 100
    });

    // Set up callbacks
    this.gameLogic.onScoreChange = (score) => {
      this.updateScore(score);
    };

    this.gameLogic.onGameComplete = (data) => {
      console.log('Stars:', data.stars);
    };
  }

  preload() {
    // Load assets
    this.load.image('background', '/assets/images/bg.png');
    this.load.audio('correct', '/assets/audio/correct.mp3');
  }

  create() {
    super.create(); // IMPORTANT: Call parent create()

    // Create background
    this.createBackground('#F5F5F5');

    // Initialize game
    this.gameLogic.init();

    // Create your game UI
    this.createGameUI();

    // Start game
    this.gameLogic.start();
  }

  createGameUI() {
    const center = this.getCenter();

    // Create title
    const title = this.createText(
      center.x,
      100,
      'Your Game Title',
      { variant: 'h1', color: '#000' }
    );
    title.setOrigin(0.5);
    this.uiLayer.add(title);

    // Create buttons
    const playButton = this.createButton(
      center.x,
      center.y,
      'Play',
      () => this.handlePlay(),
      { width: 200 }
    );
    this.uiLayer.add(playButton);
  }

  handlePlay() {
    // Game logic
    this.gameLogic.addScore(10);
  }

  update(time, delta) {
    // Game update logic
  }

  shutdown() {
    super.shutdown();
    if (this.gameLogic) {
      this.gameLogic.destroy();
    }
  }
}

export default YourGameScene;
```

### Step 3: Create Game Configuration

```javascript
// src/phaser/games/YourGame/config.js

import YourGameScene from './YourGameScene';

const yourGameConfig = {
  // Metadata
  id: 'your-game',
  name: 'Your Game Name',
  nameKannada: 'ನಿಮ್ಮ ಆಟದ ಹೆಸರು',
  description: 'Game description',
  category: 'vowels', // vowels, consonants, words, etc.
  difficulty: 'beginner', // beginner, intermediate, advanced

  // Mechanics
  lives: 3,
  targetScore: 100,
  timeLimit: null, // or number in seconds

  // Learning
  skills: ['skill-1', 'skill-2'],

  // Phaser config
  scenes: [YourGameScene],
  startScene: 'YourGameScene',
  backgroundColor: '#FFFFFF',

  // Assets
  assets: {
    audio: {
      // 'sound-key': '/path/to/sound.mp3'
    },
    images: {
      // 'image-key': '/path/to/image.png'
    }
  },

  // Scene data
  sceneData: {
    level: 1
  }
};

export default yourGameConfig;
```

### Step 4: Register Game

```javascript
// src/app/pages/GameView.jsx

import yourGameConfig from '../../phaser/games/YourGame/config';

const GAME_CONFIGS = {
  'letter-match': letterMatchConfig,
  'your-game': yourGameConfig, // Add your game here
};
```

---

## Component Library

### BaseScene API

#### Properties

```javascript
// Viewport & dimensions
this.viewport          // ViewportManager instance
this.gameWidth         // Current game width
this.gameHeight        // Current game height

// Services
this.audio             // AudioManager instance
this.i18n              // I18nService instance

// Layers (containers)
this.backgroundLayer   // z-index: 0
this.gameLayer         // z-index: 10
this.uiLayer           // z-index: 100

// Input
this.isTouchDevice     // Boolean
this.cursors           // Keyboard cursors (desktop only)
```

#### Methods

```javascript
// UI Helpers
createBackground(color)
// Returns: Phaser.GameObjects.Rectangle

createText(x, y, text, style)
// style: { variant, kannada, color, align }
// Returns: Phaser.GameObjects.Text

createButton(x, y, text, callback, style)
// style: { width, height, color }
// Returns: Phaser.GameObjects.Container

// Utilities
getCenter()
// Returns: { x, y }

getSafeArea()
// Returns: { top, bottom, left, right }

transitionTo(sceneKey, data)
// Scene transition with fade

playSfx(key, options)
// Play sound effect

t(key, vars)
// Translate text
// Returns: string
```

### BaseGame API

#### Properties

```javascript
// State
this.isInitialized     // Boolean
this.isPlaying         // Boolean
this.isPaused          // Boolean
this.isComplete        // Boolean

// Data
this.score             // Number
this.lives             // Number
this.level             // Number
this.stars             // Number (0-3)
this.startTime         // Timestamp
this.playTime          // Duration in ms

// Services
this.viewport          // ViewportManager
this.audio             // AudioManager
this.progress          // ProgressManager
this.i18n              // I18nService
this.store             // StateStore
```

#### Methods

```javascript
// Lifecycle
init()                  // Initialize game
start()                 // Start gameplay
pause()                 // Pause game
resume()                // Resume game
end(completed)          // End game (true if completed)
destroy()               // Cleanup

// Scoring & Lives
addScore(points)        // Add points
setScore(score)         // Set score
loseLife()              // Lose a life (returns true if game over)
gainLife()              // Gain a life

// Timer
startTimer(seconds)     // Start countdown timer

// State
getState()              // Get current game state
calculateStars()        // Calculate stars (1-3)
saveProgress()          // Save to ProgressManager (async)
```

#### Event Callbacks

```javascript
this.gameLogic.onScoreChange = (score) => {};
this.gameLogic.onLivesChange = (lives) => {};
this.gameLogic.onGameOver = (data) => {};
this.gameLogic.onGameComplete = (data) => {};
this.gameLogic.onPause = () => {};
this.gameLogic.onResume = () => {};
```

---

## UI/UX Patterns

### Game HUD

**Always Visible**:
- Score (top left)
- Lives (top right as hearts ❤️)
- Level (top center)
- Pause button (top right corner)

**Responsive Layout**:
- Mobile: Compact HUD with smaller fonts
- Tablet: Medium sizing
- Desktop: Full-size UI

### Overlays

**Pause Menu**:
- Semi-transparent backdrop
- Resume button (primary)
- Restart button (secondary)
- Exit button (secondary)

**Game Over Screen**:
- Final score display
- Stars earned
- Try Again button (primary)
- Exit button (secondary)

**Game Complete Screen**:
- Celebration animation
- Stars earned (1-3)
- Final score
- Performance stats
- Continue button (primary)
- Play Again button (secondary)

### Buttons

**Touch-Friendly**:
- Minimum 44px tap target (mobile/tablet)
- 32px tap target (desktop)
- Visual press effect (scale down 5%)
- Audio feedback on tap

**States**:
- Normal: Full opacity, scale 1
- Hover (desktop): Slightly brighter
- Pressed: Scale 0.95, slightly darker
- Disabled: 50% opacity, grayscale

### Animations

**Entrance Animations**:
- Fade in (200ms)
- Slide up (300ms)
- Scale up (250ms)

**Feedback Animations**:
- Correct answer: Green glow + scale bounce
- Incorrect answer: Red flash + shake
- Score increase: Number float up + fade
- Life lost: Heart shake + fade

**Transitions**:
- Scene transitions: Fade to black (300ms)
- Overlay show: Fade in + slide up (300ms)
- Overlay hide: Fade out (200ms)

---

## Responsive Design Guidelines

### Breakpoint-Specific Design

**Mobile Portrait (320px - 567px)**:
- Vertical layout
- Large touch targets (44px)
- Minimal text
- Single column
- Bottom-aligned buttons

**Mobile Landscape (568px - 767px)**:
- Horizontal layout
- Spread UI to edges
- Compact top bar
- Side-by-side elements

**Tablet Portrait (768px - 1023px)**:
- More breathing room
- Medium fonts
- 2-column layout possible
- Larger game area

**Tablet Landscape (1024px - 1279px)**:
- Wide layout
- Side panels possible
- Landscape-optimized gameplay
- More visual elements

**Desktop (1280px - 1919px)**:
- Full-featured UI
- Keyboard controls
- Mouse hover effects
- Multiple panels

**Desktop Wide (1920px+)**:
- Maximum detail
- Extra visual flourishes
- Wide aspect ratio support

### Orientation Handling

**Portrait Mode**:
- Stack UI vertically
- Larger buttons
- More vertical space for gameplay
- Scrollable content if needed

**Landscape Mode**:
- Horizontal layout
- More screen space for gameplay
- Side-aligned UI
- Compact HUD

### Font Scaling

```javascript
// Use responsive font sizes
const fontSize = viewport.getResponsiveFontSize('h1');

// Breakpoint-specific sizes
{
  mobile: { h1: 28, h2: 24, body: 16 },
  tablet: { h1: 36, h2: 30, body: 18 },
  desktop: { h1: 48, h2: 36, body: 16 }
}
```

### Spacing System

```javascript
// Use responsive spacing
const spacing = viewport.getResponsiveSpacing(2);

// Breakpoint-specific spacing
{
  mobile: 8px base grid,
  tablet: 12px base grid,
  desktop: 16px base grid
}
```

---

## Accessibility

### WCAG Compliance

**Level AA Minimum**:
- ✅ Minimum 44px touch targets (AAA on mobile)
- ✅ Minimum 4.5:1 color contrast for text
- ✅ Minimum 3:1 contrast for UI elements
- ✅ Keyboard navigation support
- ✅ Screen reader support

### Visual Accessibility

**High Contrast Mode**:
- Toggle for increased contrast
- Black text on white background
- Bold outlines

**Font Size Adjustment**:
- Small, Medium, Large options
- Scales all text consistently
- Maintains layout

**Color-Blind Friendly**:
- Don't rely on color alone
- Use shapes and patterns
- Deuteranopia-tested palettes

### Audio Accessibility

**Text-to-Speech**:
- All text read aloud option
- Adjustable speech rate
- Clear pronunciation

**Visual Alternatives**:
- Subtitles for all audio
- Visual indicators for sounds
- Closed captions

**Volume Controls**:
- Separate music and SFX volume
- Master volume control
- Mute option

### Motor Accessibility

**Adjustable Game Speed**:
- Slow, Normal, Fast options
- No time pressure mode
- Extended time limits

**Alternative Inputs**:
- Touch, mouse, keyboard
- Single-switch support (future)
- Voice control (future)

**Large Touch Targets**:
- 44px minimum (WCAG AAA)
- Generous spacing between targets
- Visual press feedback

### Cognitive Accessibility

**Simple Instructions**:
- Clear, concise language
- Step-by-step tutorials
- Visual demonstrations

**Hints and Help**:
- Context-sensitive hints
- Tutorial mode
- Progress tracking

**Frequent Saves**:
- Auto-save every action
- No progress lost
- Resume anytime

---

## Asset Requirements

### Images

**Sprites**:
- PNG format with transparency
- 2x resolution for retina displays
- Consistent art style across games
- Organized in sprite atlases

**Backgrounds**:
- JPG or PNG
- Multiple resolutions (mobile, tablet, desktop)
- Optimized file sizes
- Culturally appropriate themes

**UI Elements**:
- Buttons, icons, decorations
- Vector-based when possible (SVG)
- Consistent design language
- Touch-friendly sizing

### Audio

**Voice Recordings** (Native Kannada Speakers):
- Letter pronunciations (ಅ-ಹ)
- Word pronunciations (500+ words)
- Sentence recordings (100+ sentences)
- Instructions and feedback
- Format: MP3 (128kbps)

**Sound Effects**:
- Correct answer (pleasant chime)
- Incorrect answer (gentle buzz)
- Button click
- Score increase
- Life lost
- Game over
- Game complete
- Format: MP3 or OGG

**Background Music**:
- Karnataka-inspired melodies
- Loopable tracks
- Non-distracting
- Adjustable volume
- Format: MP3 (192kbps)

### Fonts

**Kannada Fonts**:
- Nudi (primary)
- Tunga (fallback)
- Clear and legible
- Proper rendering of combined characters

**English Fonts**:
- Sans-serif for UI (system fonts)
- Consistent across devices
- Web-safe fallbacks

### Organization

```
public/assets/
├── images/
│   ├── ui/                 # UI elements
│   │   ├── buttons/
│   │   ├── icons/
│   │   └── decorations/
│   ├── sprites/            # Game sprites
│   │   ├── characters/
│   │   ├── objects/
│   │   └── effects/
│   ├── backgrounds/        # Background images
│   │   ├── mobile/
│   │   ├── tablet/
│   │   └── desktop/
│   └── atlases/            # Sprite atlases (performance)
│
├── audio/
│   ├── music/              # Background music
│   │   ├── menu.mp3
│   │   ├── gameplay.mp3
│   │   └── victory.mp3
│   ├── sfx/                # Sound effects
│   │   ├── correct.mp3
│   │   ├── incorrect.mp3
│   │   ├── click.mp3
│   │   └── complete.mp3
│   └── voice/              # Voice recordings
│       ├── letters/        # Letter pronunciations
│       │   ├── a.mp3
│       │   ├── aa.mp3
│       │   └── ...
│       ├── words/          # Word pronunciations
│       │   ├── mavu.mp3
│       │   ├── baale.mp3
│       │   └── ...
│       └── sentences/      # Sentence recordings
│
└── fonts/
    ├── Nudi.ttf            # Kannada font (primary)
    └── Tunga.ttf           # Kannada font (fallback)
```

---

## Best Practices

### 1. Always Call Parent Methods

```javascript
init(data) {
  super.init(data); // REQUIRED
  // Your init code
}

create() {
  super.create(); // REQUIRED
  // Your create code
}

shutdown() {
  super.shutdown(); // REQUIRED
  if (this.gameLogic) {
    this.gameLogic.destroy();
  }
}
```

### 2. Use Layers for Z-Index Management

```javascript
// Background elements
this.backgroundLayer.add(bgImage);

// Game objects
this.gameLayer.add(player);
this.gameLayer.add(enemy);

// UI elements (always on top)
this.uiLayer.add(button);
this.uiLayer.add(scoreText);
```

### 3. Responsive Design

```javascript
// Use viewport helpers
const buttonWidth = this.viewport.getResponsiveValue({
  mobile: 150,
  tablet: 200,
  desktop: 250
});

const fontSize = this.viewport.getResponsiveFontSize('h1');
const spacing = this.viewport.getResponsiveSpacing(2);
const touchSize = this.viewport.getTouchTargetSize(); // 44px mobile
```

### 4. Handle Resize

```javascript
handleResize(viewportState) {
  super.handleResize(viewportState);

  // Reposition your game elements
  const center = this.getCenter();
  this.title.setPosition(center.x, 100);
}
```

### 5. Clean Up Resources

```javascript
shutdown() {
  super.shutdown();

  // Destroy game logic
  if (this.gameLogic) {
    this.gameLogic.destroy();
  }

  // Clear timers
  if (this.myTimer) {
    this.myTimer.destroy();
  }

  // Remove event listeners
  // etc.
}
```

### 6. Use Event Callbacks

```javascript
// Connect BaseGame to UI
this.gameLogic.onScoreChange = (score) => {
  this.scoreText.setText(`Score: ${score}`);
};

this.gameLogic.onLivesChange = (lives) => {
  this.livesText.setText('❤️'.repeat(lives));
};
```

### 7. Touch-Friendly UI

```javascript
// Use createButton for touch-friendly buttons
const button = this.createButton(
  x,
  y,
  'Play',
  () => this.handlePlay(),
  {
    width: 200,
    // height automatically uses touch target size (44px)
  }
);

// Manual interactive objects
gameObject.setInteractive({ useHandCursor: true });
gameObject.on('pointerdown', () => {
  // Handle tap/click
});
```

### 8. Kannada Font Support

```javascript
// Use kannada flag for Kannada text
const kannadaText = this.createText(
  x,
  y,
  'ಕನ್ನಡ',
  {
    variant: 'h1',
    kannada: true, // Uses Nudi font
    color: '#000'
  }
);
```

### 9. Performance Optimization

```javascript
// Use object pooling for frequently created objects
this.letterPool = this.add.group({
  classType: Letter,
  maxSize: 20,
  runChildUpdate: true
});

// Get from pool
const letter = this.letterPool.get(x, y);

// Return to pool
this.letterPool.killAndHide(letter);

// Use sprite atlases
this.load.atlas('letters', 'letters.png', 'letters.json');

// Limit particle effects on mobile
if (this.viewport.isMobile()) {
  particleEmitter.setQuantity(5); // Fewer particles
} else {
  particleEmitter.setQuantity(20); // More particles
}
```

### 10. Audio Best Practices

```javascript
// Preload audio
preload() {
  this.load.audio('correct', '/assets/audio/correct.mp3');
  this.load.audio('wrong', '/assets/audio/wrong.mp3');
}

// Play with volume
this.playSfx('correct', { volume: 0.5 });

// Background music with fade
this.audio.playMusic('gameplay', {
  loop: true,
  fadeIn: 1000 // 1 second fade in
});

// Stop music with fade
this.audio.stopMusic({ fadeOut: 1000 });
```

---

## Summary

This design document provides:

✅ **Complete game portfolio** with 33 games across 8 categories
✅ **Clear learning objectives** for literacy, vocabulary, and grammar
✅ **Design principles** for age-appropriate, engaging experiences
✅ **Game layer architecture** with BaseGame, BaseScene, PhaserBridge
✅ **Step-by-step guide** for building new games
✅ **Component library** with complete API reference
✅ **UI/UX patterns** for consistent user experience
✅ **Responsive design** guidelines for all devices
✅ **Accessibility** features for inclusive learning
✅ **Asset requirements** for production-ready games
✅ **Best practices** for performance and maintainability

**Ready to build engaging, educational Kannada learning games!** 🎮

---

**Next**: Start implementing Phase 1 games (Akshara Catcher, Sound Match, etc.)
