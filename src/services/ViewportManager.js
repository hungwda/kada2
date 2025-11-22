/**
 * ViewportManager - Responsive Design Hub
 *
 * Features:
 * - Breakpoint detection (6 breakpoints)
 * - Orientation detection
 * - Responsive value calculation
 * - Design token access
 * - Touch target sizing
 * - Font size calculation
 * - Spacing calculation
 */

import BaseService from '../core/BaseService.js';

// Breakpoint definitions (in pixels)
const BREAKPOINTS = {
  mobile: 320,           // Phones (portrait)
  mobileLandscape: 568,  // Phones (landscape)
  tablet: 768,           // Tablets (portrait)
  tabletLandscape: 1024, // Tablets (landscape)
  desktop: 1280,         // Desktop
  desktopWide: 1920      // Wide screens
};

// Design tokens
const DESIGN_TOKENS = {
  spacing: {
    mobile: 8,      // Base grid unit
    tablet: 12,
    desktop: 16
  },
  fontSize: {
    mobile: { h1: 28, h2: 24, h3: 20, body: 16, small: 14 },
    tablet: { h1: 36, h2: 30, h3: 24, body: 18, small: 16 },
    desktop: { h1: 48, h2: 36, h3: 28, body: 16, small: 14 }
  },
  touchTarget: {
    mobile: 44,     // WCAG compliant
    tablet: 44,
    desktop: 32
  }
};

// Game dimensions for different breakpoints
const GAME_DIMENSIONS = {
  mobile: { width: 360, height: 640 },
  mobileLandscape: { width: 640, height: 360 },
  tablet: { width: 768, height: 1024 },
  tabletLandscape: { width: 1024, height: 768 },
  desktop: { width: 800, height: 600 },
  desktopWide: { width: 1200, height: 800 }
};

class ViewportManager extends BaseService {
  constructor() {
    super('ViewportManager');

    this.width = 0;
    this.height = 0;
    this.breakpoint = 'mobile';
    this.orientation = 'portrait';
    this.isMobile = false;
    this.isTablet = false;
    this.isDesktop = false;
    this.scaleFactor = 1;

    this.resizeHandler = null;
    this.resizeDebounceTimer = null;
  }

  /**
   * Initialize viewport manager
   */
  async initialize() {
    await super.initialize();

    // Set initial viewport state
    this.updateViewport();

    // Listen for resize events
    this.resizeHandler = () => this.handleResize();
    window.addEventListener('resize', this.resizeHandler);

    // Listen for orientation change
    window.addEventListener('orientationchange', this.resizeHandler);

    console.log('ViewportManager initialized:', this.getViewportState());
  }

  /**
   * Destroy viewport manager
   */
  async destroy() {
    // Remove event listeners
    if (this.resizeHandler) {
      window.removeEventListener('resize', this.resizeHandler);
      window.removeEventListener('orientationchange', this.resizeHandler);
    }

    // Clear debounce timer
    if (this.resizeDebounceTimer) {
      clearTimeout(this.resizeDebounceTimer);
    }

    await super.destroy();
  }

  /**
   * Handle window resize (debounced)
   */
  handleResize() {
    // Debounce resize events
    if (this.resizeDebounceTimer) {
      clearTimeout(this.resizeDebounceTimer);
    }

    this.resizeDebounceTimer = setTimeout(() => {
      this.updateViewport();
      this.emit('resize', this.getViewportState());
    }, 150);
  }

  /**
   * Update viewport state
   */
  updateViewport() {
    // Get current dimensions
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    // Determine breakpoint
    this.breakpoint = this.calculateBreakpoint();

    // Determine orientation
    this.orientation = this.width > this.height ? 'landscape' : 'portrait';

    // Determine device type
    this.isMobile = this.breakpoint === 'mobile' || this.breakpoint === 'mobileLandscape';
    this.isTablet = this.breakpoint === 'tablet' || this.breakpoint === 'tabletLandscape';
    this.isDesktop = this.breakpoint === 'desktop' || this.breakpoint === 'desktopWide';

    // Calculate scale factor
    this.scaleFactor = this.calculateScaleFactor();
  }

  /**
   * Calculate current breakpoint
   * @returns {string} Breakpoint name
   */
  calculateBreakpoint() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const isLandscape = width > height;

    if (width >= BREAKPOINTS.desktopWide) {
      return 'desktopWide';
    } else if (width >= BREAKPOINTS.desktop) {
      return 'desktop';
    } else if (width >= BREAKPOINTS.tabletLandscape) {
      return isLandscape ? 'tabletLandscape' : 'desktop';
    } else if (width >= BREAKPOINTS.tablet) {
      return isLandscape ? 'tabletLandscape' : 'tablet';
    } else if (width >= BREAKPOINTS.mobileLandscape) {
      return isLandscape ? 'mobileLandscape' : 'tablet';
    } else {
      return 'mobile';
    }
  }

  /**
   * Calculate scale factor based on viewport
   * @returns {number}
   */
  calculateScaleFactor() {
    const baseWidth = 1280; // Desktop base width
    return this.width / baseWidth;
  }

  /**
   * Get current breakpoint
   * @returns {string} Breakpoint name
   */
  getCurrentBreakpoint() {
    return this.breakpoint;
  }

  /**
   * Get optimal game dimensions for current viewport
   * @returns {object} { width, height }
   */
  getOptimalGameDimensions() {
    return { ...GAME_DIMENSIONS[this.breakpoint] };
  }

  /**
   * Get responsive value based on breakpoint
   * @param {object} config - { mobile, tablet, desktop }
   * @returns {any} Value for current breakpoint
   */
  getResponsiveValue(config) {
    if (this.isMobile) {
      return config.mobile !== undefined ? config.mobile : config.tablet || config.desktop;
    } else if (this.isTablet) {
      return config.tablet !== undefined ? config.tablet : config.desktop || config.mobile;
    } else {
      return config.desktop !== undefined ? config.desktop : config.tablet || config.mobile;
    }
  }

  /**
   * Get responsive font size
   * @param {string} variant - 'h1', 'h2', 'h3', 'body', 'small'
   * @returns {number} Font size in pixels
   */
  getResponsiveFontSize(variant) {
    const category = this.isMobile ? 'mobile' : this.isTablet ? 'tablet' : 'desktop';
    const sizes = DESIGN_TOKENS.fontSize[category];

    return sizes[variant] || sizes.body;
  }

  /**
   * Get responsive spacing
   * @param {number} multiplier - Spacing multiplier (default: 1)
   * @returns {number} Spacing in pixels
   */
  getResponsiveSpacing(multiplier = 1) {
    const category = this.isMobile ? 'mobile' : this.isTablet ? 'tablet' : 'desktop';
    const baseSpacing = DESIGN_TOKENS.spacing[category];

    return baseSpacing * multiplier;
  }

  /**
   * Get touch target size
   * @returns {number} Touch target size in pixels
   */
  getTouchTargetSize() {
    const category = this.isMobile || this.isTablet ? 'mobile' : 'desktop';
    return DESIGN_TOKENS.touchTarget[category];
  }

  /**
   * Check if viewport matches breakpoint
   * @param {string} breakpoint - Breakpoint name
   * @returns {boolean}
   */
  matches(breakpoint) {
    return this.breakpoint === breakpoint;
  }

  /**
   * Check if viewport is at least breakpoint
   * @param {string} breakpoint - Breakpoint name
   * @returns {boolean}
   */
  isAtLeast(breakpoint) {
    const breakpointOrder = [
      'mobile',
      'mobileLandscape',
      'tablet',
      'tabletLandscape',
      'desktop',
      'desktopWide'
    ];

    const currentIndex = breakpointOrder.indexOf(this.breakpoint);
    const targetIndex = breakpointOrder.indexOf(breakpoint);

    return currentIndex >= targetIndex;
  }

  /**
   * Check if viewport is mobile
   * @returns {boolean}
   */
  isMobileDevice() {
    return this.isMobile;
  }

  /**
   * Check if viewport is tablet
   * @returns {boolean}
   */
  isTabletDevice() {
    return this.isTablet;
  }

  /**
   * Check if viewport is desktop
   * @returns {boolean}
   */
  isDesktopDevice() {
    return this.isDesktop;
  }

  /**
   * Get current orientation
   * @returns {string} 'portrait' or 'landscape'
   */
  getOrientation() {
    return this.orientation;
  }

  /**
   * Check if portrait orientation
   * @returns {boolean}
   */
  isPortrait() {
    return this.orientation === 'portrait';
  }

  /**
   * Check if landscape orientation
   * @returns {boolean}
   */
  isLandscape() {
    return this.orientation === 'landscape';
  }

  /**
   * Add resize listener
   * @param {function} callback - Resize callback
   * @returns {function} Unsubscribe function
   */
  onResize(callback) {
    return this.on('resize', callback);
  }

  /**
   * Get viewport state
   * @returns {object}
   */
  getViewportState() {
    return {
      width: this.width,
      height: this.height,
      breakpoint: this.breakpoint,
      orientation: this.orientation,
      isMobile: this.isMobile,
      isTablet: this.isTablet,
      isDesktop: this.isDesktop,
      scaleFactor: this.scaleFactor,
      gameDimensions: this.getOptimalGameDimensions()
    };
  }

  /**
   * Get breakpoint values
   * @returns {object}
   */
  static getBreakpoints() {
    return { ...BREAKPOINTS };
  }

  /**
   * Get design tokens
   * @returns {object}
   */
  static getDesignTokens() {
    return JSON.parse(JSON.stringify(DESIGN_TOKENS));
  }

  /**
   * Get debug information
   * @returns {object}
   */
  getDebugInfo() {
    const baseInfo = super.getDebugInfo();

    return {
      ...baseInfo,
      viewport: this.getViewportState(),
      breakpoints: BREAKPOINTS,
      designTokens: DESIGN_TOKENS
    };
  }
}

export default ViewportManager;
