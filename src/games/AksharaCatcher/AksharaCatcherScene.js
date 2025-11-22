/**
 * AksharaCatcherScene - Catch falling Kannada letters
 *
 * Gameplay:
 * - Letters fall from the top of the screen
 * - Player controls a basket at the bottom
 * - Catch the target letter to score points
 * - Catching wrong letters loses a life
 * - Speed increases as you progress
 *
 * Learning objectives:
 * - Vowel recognition (ಅ-ಅಃ)
 * - Consonant recognition (ಕ-ಹ)
 * - Letter differentiation
 */

import BaseScene from '../../phaser/BaseScene';
import BaseGame from '../../phaser/BaseGame';

class AksharaCatcherScene extends BaseScene {
  constructor() {
    super({ key: 'AksharaCatcherScene' });

    this.gameLogic = null;
    this.basket = null;
    this.letters = null;
    this.targetLetter = null;
    this.targetText = null;
    this.fallingSpeed = 100;
    this.spawnTimer = null;
    this.letterPool = [];
    this.score = 0;
    this.level = 1;

    // Kannada vowels (Swaras)
    this.vowels = [
      { letter: 'ಅ', sound: 'a' },
      { letter: 'ಆ', sound: 'aa' },
      { letter: 'ಇ', sound: 'i' },
      { letter: 'ಈ', sound: 'ii' },
      { letter: 'ಉ', sound: 'u' },
      { letter: 'ಊ', sound: 'uu' },
      { letter: 'ಋ', sound: 'ru' },
      { letter: 'ಎ', sound: 'e' },
      { letter: 'ಏ', sound: 'ee' },
      { letter: 'ಐ', sound: 'ai' },
      { letter: 'ಒ', sound: 'o' },
      { letter: 'ಓ', sound: 'oo' },
      { letter: 'ಔ', sound: 'au' },
      { letter: 'ಅಂ', sound: 'am' },
      { letter: 'ಅಃ', sound: 'ah' }
    ];

    // Kannada consonants (Vyanjanagalu) - First 10 for beginner level
    this.consonants = [
      { letter: 'ಕ', sound: 'ka' },
      { letter: 'ಖ', sound: 'kha' },
      { letter: 'ಗ', sound: 'ga' },
      { letter: 'ಘ', sound: 'gha' },
      { letter: 'ಚ', sound: 'cha' },
      { letter: 'ಛ', sound: 'chha' },
      { letter: 'ಜ', sound: 'ja' },
      { letter: 'ಝ', sound: 'jha' },
      { letter: 'ಟ', sound: 'ta' },
      { letter: 'ಠ', sound: 'tha' }
    ];
  }

  /**
   * Initialize scene
   */
  init(data) {
    super.init(data);

    this.level = data.level || 1;

    // Create game logic instance
    this.gameLogic = new BaseGame(this, {
      id: 'akshara-catcher',
      lives: 3,
      level: this.level,
      targetScore: 100,
      music: 'background-music'
    });

    // Initialize letter pool based on level
    this.initializeLetterPool();

    console.log('AksharaCatcherScene initialized, level:', this.level);
  }

  /**
   * Initialize letter pool based on difficulty level
   */
  initializeLetterPool() {
    if (this.level === 1) {
      // Level 1: First 5 vowels
      this.letterPool = this.vowels.slice(0, 5);
    } else if (this.level === 2) {
      // Level 2: All vowels
      this.letterPool = this.vowels;
    } else {
      // Level 3+: Vowels + Consonants
      this.letterPool = [...this.vowels, ...this.consonants];
    }
  }

  /**
   * Preload assets
   */
  preload() {
    // Assets loaded in asset manager
  }

  /**
   * Create scene
   */
  create() {
    super.create();

    // Create background
    this.createBackground('#87CEEB'); // Sky blue

    // Initialize game
    this.gameLogic.init();

    // Create game elements
    this.createBasket();
    this.createLetterGroup();
    this.createUI();

    // Start game
    this.gameLogic.start();

    // Select first target letter
    this.selectNewTarget();

    // Start spawning letters
    this.startLetterSpawner();

    console.log('AksharaCatcherScene created');
  }

  /**
   * Create player basket
   */
  createBasket() {
    const center = this.getCenter();
    const safeArea = this.getSafeArea();

    // Basket dimensions
    const basketWidth = this.viewport.getResponsiveValue({
      mobile: 80,
      tablet: 100,
      desktop: 120
    });
    const basketHeight = 60;

    // Create basket container
    this.basket = this.add.container(
      center.x,
      this.gameHeight - safeArea.bottom - basketHeight
    );

    // Basket body (trapezoid shape using graphics)
    const basketGraphics = this.add.graphics();
    basketGraphics.fillStyle(0x8B4513, 1); // Brown color

    // Draw basket shape
    basketGraphics.beginPath();
    basketGraphics.moveTo(-basketWidth / 2 + 10, 0);
    basketGraphics.lineTo(basketWidth / 2 - 10, 0);
    basketGraphics.lineTo(basketWidth / 2, basketHeight);
    basketGraphics.lineTo(-basketWidth / 2, basketHeight);
    basketGraphics.closePath();
    basketGraphics.fillPath();

    // Add handles (simple arcs)
    basketGraphics.lineStyle(3, 0x654321, 1);

    // Left handle
    basketGraphics.beginPath();
    basketGraphics.arc(-basketWidth / 2 + 5, -10, 15, Math.PI, 0, false);
    basketGraphics.strokePath();

    // Right handle
    basketGraphics.beginPath();
    basketGraphics.arc(basketWidth / 2 - 5, -10, 15, Math.PI, 0, false);
    basketGraphics.strokePath();

    this.basket.add(basketGraphics);

    // Store dimensions for collision
    this.basket.width = basketWidth;
    this.basket.height = basketHeight;

    // Add to game layer
    this.gameLayer.add(this.basket);

    // Make basket interactive
    this.basket.setInteractive(
      new Phaser.Geom.Rectangle(-basketWidth / 2, 0, basketWidth, basketHeight),
      Phaser.Geom.Rectangle.Contains
    );

    // Enable dragging on desktop, or follow pointer on mobile
    if (this.isTouchDevice) {
      this.input.on('pointermove', this.moveBasket, this);
    } else {
      this.input.setDraggable(this.basket);
      this.input.on('drag', (pointer, gameObject, dragX) => {
        gameObject.x = Phaser.Math.Clamp(
          dragX,
          basketWidth / 2,
          this.gameWidth - basketWidth / 2
        );
      });
    }
  }

  /**
   * Move basket to pointer position (mobile)
   */
  moveBasket(pointer) {
    if (!this.basket) return;

    const basketWidth = this.basket.width;
    this.basket.x = Phaser.Math.Clamp(
      pointer.x,
      basketWidth / 2,
      this.gameWidth - basketWidth / 2
    );
  }

  /**
   * Create letter group
   */
  createLetterGroup() {
    this.letters = this.add.group();
  }

  /**
   * Create UI elements
   */
  createUI() {
    const center = this.getCenter();
    const safeArea = this.getSafeArea();

    // Target letter display
    const targetY = safeArea.top + 80;

    const instructionText = this.createText(
      center.x,
      targetY - 40,
      this.t('games.aksharaCatcher.instruction'),
      {
        variant: 'body',
        color: '#333',
        align: 'center'
      }
    );
    instructionText.setOrigin(0.5);
    this.uiLayer.add(instructionText);

    // Target letter container
    const targetBox = this.add.rectangle(center.x, targetY, 120, 120, 0xFFFFFF);
    targetBox.setStrokeStyle(4, 0x1976D2);
    this.uiLayer.add(targetBox);

    this.targetText = this.createText(center.x, targetY, '', {
      variant: 'h1',
      color: '#1976D2',
      kannada: true
    });
    this.targetText.setOrigin(0.5);
    this.targetText.setFontSize(48);
    this.uiLayer.add(this.targetText);
  }

  /**
   * Select new target letter
   */
  selectNewTarget() {
    this.targetLetter = Phaser.Utils.Array.GetRandom(this.letterPool);
    this.targetText.setText(this.targetLetter.letter);

    console.log('New target:', this.targetLetter.letter);
  }

  /**
   * Start spawning letters
   */
  startLetterSpawner() {
    // Calculate spawn interval based on level
    const spawnInterval = Math.max(1000 - this.level * 100, 500);

    this.spawnTimer = this.time.addEvent({
      delay: spawnInterval,
      callback: this.spawnLetter,
      callbackScope: this,
      loop: true
    });
  }

  /**
   * Spawn a falling letter
   */
  spawnLetter() {
    if (!this.gameLogic.isPlaying) return;

    // 60% chance of target letter, 40% chance of wrong letter
    const isTarget = Math.random() < 0.6;
    const letterData = isTarget
      ? this.targetLetter
      : Phaser.Utils.Array.GetRandom(
          this.letterPool.filter(l => l.letter !== this.targetLetter.letter)
        );

    // Random X position
    const x = Phaser.Math.Between(50, this.gameWidth - 50);
    const y = -50;

    // Create letter container
    const letterContainer = this.add.container(x, y);

    // Background circle
    const bg = this.add.circle(0, 0, 30, isTarget ? 0x4CAF50 : 0xF44336);
    letterContainer.add(bg);

    // Letter text
    const letterText = this.createText(0, 0, letterData.letter, {
      variant: 'h2',
      color: '#FFFFFF',
      kannada: true
    });
    letterText.setOrigin(0.5);
    letterContainer.add(letterText);

    // Store letter data
    letterContainer.setData('letter', letterData);
    letterContainer.setData('isTarget', isTarget);

    // Add to group
    this.letters.add(letterContainer);
    this.gameLayer.add(letterContainer);

    // Calculate falling speed based on level
    const speed = this.fallingSpeed + this.level * 20;

    // Add tween for falling
    this.tweens.add({
      targets: letterContainer,
      y: this.gameHeight + 100,
      duration: speed * 15,
      ease: 'Linear',
      onComplete: () => {
        // Letter reached bottom without being caught
        if (isTarget) {
          // Missed target letter - lose life
          this.handleMissedLetter();
        }
        letterContainer.destroy();
      }
    });
  }

  /**
   * Handle missed target letter
   */
  handleMissedLetter() {
    const gameOver = this.gameLogic.loseLife();
    this.playSfx('wrong');

    // Flash basket red
    this.tweens.add({
      targets: this.basket,
      alpha: 0.5,
      duration: 100,
      yoyo: true,
      repeat: 2
    });
  }

  /**
   * Update loop
   */
  update(time, delta) {
    if (!this.gameLogic.isPlaying) return;

    // Check collisions between basket and letters
    this.letters.children.entries.forEach(letter => {
      if (this.checkCollision(this.basket, letter)) {
        this.catchLetter(letter);
      }
    });
  }

  /**
   * Check collision between basket and letter
   */
  checkCollision(basket, letter) {
    const basketBounds = new Phaser.Geom.Rectangle(
      basket.x - basket.width / 2,
      basket.y,
      basket.width,
      basket.height
    );

    const letterBounds = new Phaser.Geom.Rectangle(
      letter.x - 30,
      letter.y - 30,
      60,
      60
    );

    return Phaser.Geom.Intersects.RectangleToRectangle(basketBounds, letterBounds);
  }

  /**
   * Handle catching a letter
   */
  catchLetter(letter) {
    const isTarget = letter.getData('isTarget');

    // Remove letter
    letter.destroy();

    if (isTarget) {
      // Caught correct letter!
      this.gameLogic.addScore(10);
      this.playSfx('correct');

      // Particle effect
      this.createCatchEffect(letter.x, letter.y, 0x4CAF50);

      // Flash basket green
      this.tweens.add({
        targets: this.basket,
        alpha: 1.2,
        duration: 100,
        yoyo: true
      });

      // Select new target
      this.selectNewTarget();

      // Check level up
      if (this.score > 0 && this.score % 50 === 0) {
        this.levelUp();
      }
    } else {
      // Caught wrong letter!
      const gameOver = this.gameLogic.loseLife();
      this.playSfx('wrong');

      // Particle effect
      this.createCatchEffect(letter.x, letter.y, 0xF44336);

      // Flash basket red
      this.tweens.add({
        targets: this.basket,
        alpha: 0.5,
        duration: 100,
        yoyo: true,
        repeat: 2
      });
    }
  }

  /**
   * Create particle effect when catching letter
   */
  createCatchEffect(x, y, color) {
    const particles = this.add.particles(x, y, 'particle', {
      speed: { min: 50, max: 150 },
      angle: { min: 0, max: 360 },
      scale: { start: 1, end: 0 },
      alpha: { start: 1, end: 0 },
      tint: color,
      lifespan: 500,
      quantity: 10
    });

    // Clean up after animation
    this.time.delayedCall(600, () => {
      particles.destroy();
    });
  }

  /**
   * Level up
   */
  levelUp() {
    this.level++;
    this.gameLogic.level = this.level;

    // Update letter pool
    this.initializeLetterPool();

    // Show level up message
    const levelUpText = this.createText(
      this.getCenter().x,
      this.getCenter().y,
      `Level ${this.level}!`,
      {
        variant: 'h1',
        color: '#FFD700'
      }
    );
    levelUpText.setOrigin(0.5);
    levelUpText.setScale(0);
    this.uiLayer.add(levelUpText);

    this.tweens.add({
      targets: levelUpText,
      scale: 1.5,
      alpha: 0,
      duration: 1500,
      ease: 'Power2',
      onComplete: () => {
        levelUpText.destroy();
      }
    });

    console.log('Level up!', this.level);
  }

  /**
   * Clean up
   */
  shutdown() {
    super.shutdown();

    // Stop spawner
    if (this.spawnTimer) {
      this.spawnTimer.destroy();
    }

    // Destroy game logic
    if (this.gameLogic) {
      this.gameLogic.destroy();
    }

    // Clear input
    this.input.off('pointermove', this.moveBasket, this);
  }
}

export default AksharaCatcherScene;
