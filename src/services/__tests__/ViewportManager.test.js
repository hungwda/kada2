/**
 * ViewportManager Tests
 * Tests for responsive viewport management
 */

import ViewportManager from '../ViewportManager';

describe('ViewportManager', () => {
  let viewport;

  beforeEach(() => {
    // Mock window dimensions
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024
    });

    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 768
    });

    viewport = new ViewportManager();
  });

  afterEach(() => {
    if (viewport) {
      viewport.destroy();
    }
    viewport = null;
  });

  describe('initialization', () => {
    test('should initialize with current dimensions', async () => {
      await viewport.initialize();

      const state = viewport.getState();
      expect(state.width).toBe(1024);
      expect(state.height).toBe(768);
    });

    test('should detect correct breakpoint', async () => {
      window.innerWidth = 768;
      viewport = new ViewportManager();
      await viewport.initialize();

      expect(viewport.getCurrentBreakpoint()).toBe('tablet');
    });

    test('should detect orientation', async () => {
      window.innerWidth = 1024;
      window.innerHeight = 768;

      viewport = new ViewportManager();
      await viewport.initialize();

      expect(viewport.getOrientation()).toBe('landscape');
    });
  });

  describe('breakpoints', () => {
    test('should detect mobile breakpoint', async () => {
      window.innerWidth = 375;
      viewport = new ViewportManager();
      await viewport.initialize();

      expect(viewport.getCurrentBreakpoint()).toBe('mobile');
    });

    test('should detect mobileLandscape breakpoint', async () => {
      window.innerWidth = 600;
      viewport = new ViewportManager();
      await viewport.initialize();

      expect(viewport.getCurrentBreakpoint()).toBe('mobileLandscape');
    });

    test('should detect tablet breakpoint', async () => {
      window.innerWidth = 768;
      viewport = new ViewportManager();
      await viewport.initialize();

      expect(viewport.getCurrentBreakpoint()).toBe('tablet');
    });

    test('should detect tabletLandscape breakpoint', async () => {
      window.innerWidth = 1024;
      viewport = new ViewportManager();
      await viewport.initialize();

      expect(viewport.getCurrentBreakpoint()).toBe('tabletLandscape');
    });

    test('should detect desktop breakpoint', async () => {
      window.innerWidth = 1280;
      viewport = new ViewportManager();
      await viewport.initialize();

      expect(viewport.getCurrentBreakpoint()).toBe('desktop');
    });

    test('should detect desktopWide breakpoint', async () => {
      window.innerWidth = 1920;
      viewport = new ViewportManager();
      await viewport.initialize();

      expect(viewport.getCurrentBreakpoint()).toBe('desktopWide');
    });
  });

  describe('responsive values', () => {
    test('should return correct value for current breakpoint', async () => {
      window.innerWidth = 768;
      viewport = new ViewportManager();
      await viewport.initialize();

      const value = viewport.getResponsiveValue({
        mobile: 10,
        tablet: 20,
        desktop: 30
      });

      expect(value).toBe(20);
    });

    test('should fallback to smaller breakpoint if not defined', async () => {
      window.innerWidth = 1280;
      viewport = new ViewportManager();
      await viewport.initialize();

      const value = viewport.getResponsiveValue({
        mobile: 10,
        tablet: 20
        // desktop not defined
      });

      expect(value).toBe(20); // Falls back to tablet
    });

    test('should return mobile value as default', async () => {
      window.innerWidth = 2000;
      viewport = new ViewportManager();
      await viewport.initialize();

      const value = viewport.getResponsiveValue({
        mobile: 10
      });

      expect(value).toBe(10);
    });

    test('should handle numeric values', async () => {
      window.innerWidth = 1024;
      viewport = new ViewportManager();
      await viewport.initialize();

      const value = viewport.getResponsiveValue({
        mobile: 100,
        tablet: 200,
        desktop: 300
      });

      expect(value).toBe(200); // tabletLandscape falls back to tablet
    });
  });

  describe('responsive font sizes', () => {
    test('should return h1 size for current breakpoint', async () => {
      window.innerWidth = 375;
      viewport = new ViewportManager();
      await viewport.initialize();

      expect(viewport.getResponsiveFontSize('h1')).toBe(28);
    });

    test('should return h2 size for tablet', async () => {
      window.innerWidth = 768;
      viewport = new ViewportManager();
      await viewport.initialize();

      expect(viewport.getResponsiveFontSize('h2')).toBe(30);
    });

    test('should return body size for desktop', async () => {
      window.innerWidth = 1280;
      viewport = new ViewportManager();
      await viewport.initialize();

      expect(viewport.getResponsiveFontSize('body')).toBe(16);
    });

    test('should handle all font variants', async () => {
      window.innerWidth = 1024;
      viewport = new ViewportManager();
      await viewport.initialize();

      expect(viewport.getResponsiveFontSize('h1')).toBeGreaterThan(0);
      expect(viewport.getResponsiveFontSize('h2')).toBeGreaterThan(0);
      expect(viewport.getResponsiveFontSize('h3')).toBeGreaterThan(0);
      expect(viewport.getResponsiveFontSize('body')).toBeGreaterThan(0);
      expect(viewport.getResponsiveFontSize('small')).toBeGreaterThan(0);
    });
  });

  describe('responsive spacing', () => {
    test('should return spacing for mobile', async () => {
      window.innerWidth = 375;
      viewport = new ViewportManager();
      await viewport.initialize();

      expect(viewport.getResponsiveSpacing(2)).toBe(16); // 8px * 2
    });

    test('should return spacing for tablet', async () => {
      window.innerWidth = 768;
      viewport = new ViewportManager();
      await viewport.initialize();

      expect(viewport.getResponsiveSpacing(2)).toBe(24); // 12px * 2
    });

    test('should return spacing for desktop', async () => {
      window.innerWidth = 1280;
      viewport = new ViewportManager();
      await viewport.initialize();

      expect(viewport.getResponsiveSpacing(2)).toBe(32); // 16px * 2
    });

    test('should handle different multipliers', async () => {
      window.innerWidth = 1024;
      viewport = new ViewportManager();
      await viewport.initialize();

      expect(viewport.getResponsiveSpacing(0)).toBe(0);
      expect(viewport.getResponsiveSpacing(1)).toBeGreaterThan(0);
      expect(viewport.getResponsiveSpacing(3)).toBeGreaterThan(viewport.getResponsiveSpacing(2));
    });
  });

  describe('touch target size', () => {
    test('should return 44px for mobile', async () => {
      window.innerWidth = 375;
      viewport = new ViewportManager();
      await viewport.initialize();

      expect(viewport.getTouchTargetSize()).toBe(44);
    });

    test('should return 44px for tablet', async () => {
      window.innerWidth = 768;
      viewport = new ViewportManager();
      await viewport.initialize();

      expect(viewport.getTouchTargetSize()).toBe(44);
    });

    test('should return 32px for desktop', async () => {
      window.innerWidth = 1280;
      viewport = new ViewportManager();
      await viewport.initialize();

      expect(viewport.getTouchTargetSize()).toBe(32);
    });
  });

  describe('game dimensions', () => {
    test('should calculate optimal game dimensions', async () => {
      window.innerWidth = 1024;
      window.innerHeight = 768;

      viewport = new ViewportManager();
      await viewport.initialize();

      const dims = viewport.getOptimalGameDimensions();

      expect(dims).toHaveProperty('width');
      expect(dims).toHaveProperty('height');
      expect(dims.width).toBeGreaterThan(0);
      expect(dims.height).toBeGreaterThan(0);
    });

    test('should maintain aspect ratio', async () => {
      window.innerWidth = 1600;
      window.innerHeight = 900;

      viewport = new ViewportManager();
      await viewport.initialize();

      const dims = viewport.getOptimalGameDimensions();
      const ratio = dims.width / dims.height;

      expect(ratio).toBeCloseTo(16 / 9, 1);
    });

    test('should handle portrait orientation', async () => {
      window.innerWidth = 375;
      window.innerHeight = 667;

      viewport = new ViewportManager();
      await viewport.initialize();

      const dims = viewport.getOptimalGameDimensions();

      expect(dims.width).toBeLessThan(dims.height);
    });
  });

  describe('device detection', () => {
    test('should detect mobile device', async () => {
      window.innerWidth = 375;
      viewport = new ViewportManager();
      await viewport.initialize();

      const state = viewport.getState();
      expect(state.isMobile).toBe(true);
      expect(state.isTablet).toBe(false);
      expect(state.isDesktop).toBe(false);
    });

    test('should detect tablet device', async () => {
      window.innerWidth = 768;
      viewport = new ViewportManager();
      await viewport.initialize();

      const state = viewport.getState();
      expect(state.isMobile).toBe(false);
      expect(state.isTablet).toBe(true);
      expect(state.isDesktop).toBe(false);
    });

    test('should detect desktop device', async () => {
      window.innerWidth = 1280;
      viewport = new ViewportManager();
      await viewport.initialize();

      const state = viewport.getState();
      expect(state.isMobile).toBe(false);
      expect(state.isTablet).toBe(false);
      expect(state.isDesktop).toBe(true);
    });
  });

  describe('resize handling', () => {
    test('should call resize listeners on window resize', async () => {
      await viewport.initialize();

      const listener = jest.fn();
      viewport.onResize(listener);

      // Trigger resize
      window.innerWidth = 1280;
      window.dispatchEvent(new Event('resize'));

      // Wait for debounce
      await new Promise(resolve => setTimeout(resolve, 200));

      expect(listener).toHaveBeenCalled();
    });

    test('should debounce resize events', async () => {
      await viewport.initialize();

      const listener = jest.fn();
      viewport.onResize(listener);

      // Trigger multiple resizes quickly
      window.dispatchEvent(new Event('resize'));
      window.dispatchEvent(new Event('resize'));
      window.dispatchEvent(new Event('resize'));

      // Should only call once after debounce
      await new Promise(resolve => setTimeout(resolve, 200));

      expect(listener.mock.calls.length).toBeLessThan(3);
    });

    test('should update state on resize', async () => {
      await viewport.initialize();

      const initialWidth = viewport.getState().width;

      window.innerWidth = 1600;
      window.dispatchEvent(new Event('resize'));

      await new Promise(resolve => setTimeout(resolve, 200));

      expect(viewport.getState().width).not.toBe(initialWidth);
    });
  });

  describe('state management', () => {
    test('should return current state', async () => {
      await viewport.initialize();

      const state = viewport.getState();

      expect(state).toHaveProperty('width');
      expect(state).toHaveProperty('height');
      expect(state).toHaveProperty('breakpoint');
      expect(state).toHaveProperty('orientation');
      expect(state).toHaveProperty('isMobile');
      expect(state).toHaveProperty('isTablet');
      expect(state).toHaveProperty('isDesktop');
    });

    test('should emit state change events', async () => {
      await viewport.initialize();

      const listener = jest.fn();
      viewport.on('state-change', listener);

      window.innerWidth = 1600;
      window.dispatchEvent(new Event('resize'));

      await new Promise(resolve => setTimeout(resolve, 200));

      expect(listener).toHaveBeenCalled();
    });
  });
});
