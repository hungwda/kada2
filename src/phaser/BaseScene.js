/**
 * BaseScene - Foundation for all Phaser scenes
 *
 * Features:
 * - Responsive camera setup
 * - Input handling (touch + mouse)
 * - UI layer management
 * - Scene transitions
 * - Background setup
 * - Safe area handling
 */

import Phaser from 'phaser';

class BaseScene extends Phaser.Scene {
  constructor(config) {
    super(config);

    this.viewport = null;
    this.audio = null;
    this.i18n = null;

    // Responsive dimensions
    this.gameWidth = 800;
    this.gameHeight = 600;

    // Layers
    this.backgroundLayer = null;
    this.gameLayer = null;
    this.uiLayer = null;

    // Input
    this.isTouchDevice = false;
  }

  /**
   * Initialize scene
   */
  init(data) {
    // Get services
    this.viewport = window.services.get('viewport');
    this.audio = window.services.get('audio');
    this.i18n = window.services.get('i18n');

    // Get optimal dimensions
    const dims = this.viewport.getOptimalGameDimensions();
    this.gameWidth = dims.width;
    this.gameHeight = dims.height;

    // Detect touch device
    this.isTouchDevice = this.viewport.isMobileDevice();

    // Store passed data
    this.sceneData = data || {};

    console.log(`Scene ${this.scene.key} initialized:`, {
      width: this.gameWidth,
      height: this.gameHeight,
      isTouchDevice: this.isTouchDevice
    });
  }

  /**
   * Create scene
   * Sets up camera, layers, and input
   */
  create() {
    // Set up camera
    this.setupCamera();

    // Create layers
    this.createLayers();

    // Set up input
    this.setupInput();

    // Set up responsive resize
    this.setupResize();

    console.log(`Scene ${this.scene.key} created`);
  }

  /**
   * Set up camera with responsive bounds
   */
  setupCamera() {
    this.cameras.main.setBounds(0, 0, this.gameWidth, this.gameHeight);
    this.cameras.main.setBackgroundColor('#FFFFFF');
  }

  /**
   * Create rendering layers
   */
  createLayers() {
    // Background layer (z-index: 0)
    this.backgroundLayer = this.add.container(0, 0);
    this.backgroundLayer.setDepth(0);

    // Game layer (z-index: 10)
    this.gameLayer = this.add.container(0, 0);
    this.gameLayer.setDepth(10);

    // UI layer (z-index: 100)
    this.uiLayer = this.add.container(0, 0);
    this.uiLayer.setDepth(100);
  }

  /**
   * Set up input handlers
   */
  setupInput() {
    // Enable input
    this.input.enabled = true;

    // Touch/mouse cursor
    if (this.isTouchDevice) {
      this.input.setDefaultCursor('default');
    } else {
      this.input.setDefaultCursor('pointer');
    }

    // Add keyboard support if desktop
    if (!this.isTouchDevice) {
      this.cursors = this.input.keyboard.createCursorKeys();

      // ESC key to pause
      this.input.keyboard.on('keydown-ESC', () => {
        this.handlePause();
      });
    }
  }

  /**
   * Set up resize handling
   */
  setupResize() {
    // Listen for viewport changes
    this.viewport.onResize((state) => {
      this.handleResize(state);
    });

    // Initial resize
    this.handleResize(this.viewport.getViewportState());
  }

  /**
   * Handle viewport resize
   * @param {object} viewportState - New viewport state
   */
  handleResize(viewportState) {
    const dims = viewportState.gameDimensions;

    this.gameWidth = dims.width;
    this.gameHeight = dims.height;

    // Update camera
    this.cameras.main.setBounds(0, 0, this.gameWidth, this.gameHeight);

    // Update scale (resize game canvas handled by Phaser config)
    this.scale.resize(this.gameWidth, this.gameHeight);

    console.log(`Scene resized:`, dims);
  }

  /**
   * Create responsive background
   * @param {string} color - Background color
   */
  createBackground(color = '#F5F5F5') {
    const bg = this.add.rectangle(
      0,
      0,
      this.gameWidth,
      this.gameHeight,
      Phaser.Display.Color.HexStringToColor(color).color
    );

    bg.setOrigin(0, 0);
    this.backgroundLayer.add(bg);

    return bg;
  }

  /**
   * Create responsive text
   * @param {number} x - X position
   * @param {number} y - Y position
   * @param {string} text - Text content
   * @param {object} style - Text style
   * @returns {Phaser.GameObjects.Text}
   */
  createText(x, y, text, style = {}) {
    const fontSize = this.viewport.getResponsiveFontSize(style.variant || 'body');

    const textObj = this.add.text(x, y, text, {
      fontSize: `${fontSize}px`,
      fontFamily: style.kannada ? 'Nudi' : 'Arial',
      color: style.color || '#000000',
      align: style.align || 'left',
      ...style
    });

    return textObj;
  }

  /**
   * Create responsive button
   * @param {number} x - X position
   * @param {number} y - Y position
   * @param {string} text - Button text
   * @param {function} callback - Click callback
   * @param {object} style - Button style
   * @returns {Phaser.GameObjects.Container}
   */
  createButton(x, y, text, callback, style = {}) {
    const width = style.width || this.viewport.getResponsiveValue({
      mobile: 200,
      tablet: 250,
      desktop: 300
    });

    const height = style.height || this.viewport.getTouchTargetSize();

    const button = this.add.container(x, y);

    // Background
    const bg = this.add.rectangle(0, 0, width, height, 0x4CAF50);
    bg.setInteractive({ useHandCursor: true });

    // Text
    const label = this.createText(0, 0, text, {
      ...style,
      color: '#FFFFFF'
    });
    label.setOrigin(0.5);

    button.add([bg, label]);

    // Hover effect (desktop only)
    if (!this.isTouchDevice) {
      bg.on('pointerover', () => {
        bg.setFillStyle(0x388E3C);
      });

      bg.on('pointerout', () => {
        bg.setFillStyle(0x4CAF50);
      });
    }

    // Click/tap
    bg.on('pointerdown', () => {
      bg.setScale(0.95);
      this.audio.playSfx('button-click');
    });

    bg.on('pointerup', () => {
      bg.setScale(1);
      if (callback) {
        callback();
      }
    });

    return button;
  }

  /**
   * Transition to another scene
   * @param {string} sceneKey - Target scene key
   * @param {object} data - Data to pass to next scene
   */
  transitionTo(sceneKey, data = {}) {
    this.cameras.main.fadeOut(300);

    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.start(sceneKey, data);
    });
  }

  /**
   * Handle pause (override in subclasses)
   */
  handlePause() {
    console.log('Pause requested');
    // To be implemented by game-specific scenes
  }

  /**
   * Show loading indicator
   */
  showLoading() {
    const loading = this.add.container(
      this.gameWidth / 2,
      this.gameHeight / 2
    );

    const bg = this.add.rectangle(0, 0, this.gameWidth, this.gameHeight, 0x000000, 0.5);
    bg.setOrigin(0.5);

    const text = this.createText(0, 0, this.i18n.t('common.loading'), {
      color: '#FFFFFF',
      variant: 'h2'
    });
    text.setOrigin(0.5);

    loading.add([bg, text]);
    loading.setDepth(1000);

    return loading;
  }

  /**
   * Get center position
   * @returns {object} - { x, y }
   */
  getCenter() {
    return {
      x: this.gameWidth / 2,
      y: this.gameHeight / 2
    };
  }

  /**
   * Get safe area bounds (accounts for notches)
   * @returns {object} - { top, bottom, left, right }
   */
  getSafeArea() {
    return {
      top: 40,
      bottom: 40,
      left: 20,
      right: 20
    };
  }

  /**
   * Translate text key
   * @param {string} key - Translation key
   * @param {object} vars - Variables
   * @returns {string}
   */
  t(key, vars) {
    return this.i18n.t(key, vars);
  }

  /**
   * Play sound effect
   * @param {string} key - Sound key
   * @param {object} options - Playback options
   */
  playSfx(key, options = {}) {
    this.audio.playSfx(key, options);
  }

  /**
   * Clean up on scene shutdown
   */
  shutdown() {
    console.log(`Scene ${this.scene.key} shutdown`);
  }
}

export default BaseScene;
