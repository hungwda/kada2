// Mock Phaser for testing

const Phaser = {
  Scene: class Scene {
    constructor(config) {
      this.config = config;
      this.add = {
        container: jest.fn(),
        circle: jest.fn(),
        rectangle: jest.fn(),
        text: jest.fn(),
        graphics: jest.fn(),
        particles: jest.fn(),
        group: jest.fn()
      };
      this.input = {
        on: jest.fn(),
        off: jest.fn(),
        setDraggable: jest.fn()
      };
      this.time = {
        addEvent: jest.fn(),
        delayedCall: jest.fn()
      };
      this.tweens = {
        add: jest.fn()
      };
      this.cameras = {
        main: {
          setBounds: jest.fn(),
          setZoom: jest.fn()
        }
      };
      this.physics = {
        world: {
          setBounds: jest.fn()
        }
      };
      this.game = {};
      this.sys = {};
    }

    init(data) {}
    preload() {}
    create() {}
    update(time, delta) {}
    shutdown() {}
  },

  Game: class Game {
    constructor(config) {
      this.config = config;
      this.scale = {
        resize: jest.fn()
      };
      this.scene = {
        getScene: jest.fn(),
        start: jest.fn(),
        pause: jest.fn(),
        resume: jest.fn(),
        getScenes: jest.fn(() => [])
      };
      this.events = {
        on: jest.fn(),
        off: jest.fn()
      };
      this.loop = {
        actualFps: 60,
        delta: 16,
        frame: 0
      };
      this.canvas = {
        toDataURL: jest.fn(() => 'data:image/png;base64,mock')
      };
    }

    destroy() {}
  },

  Math: {
    Between: jest.fn((min, max) => Math.floor(Math.random() * (max - min + 1)) + min),
    Clamp: jest.fn((value, min, max) => Math.max(min, Math.min(max, value)))
  },

  Utils: {
    Array: {
      GetRandom: jest.fn((array) => array[Math.floor(Math.random() * array.length)]),
      Shuffle: jest.fn((array) => array)
    }
  },

  Scale: {
    FIT: 'fit',
    CENTER_BOTH: 'center',
    RESIZE: 'resize'
  },

  AUTO: 'auto',
  CANVAS: 'canvas',
  WEBGL: 'webgl',

  Geom: {
    Rectangle: class Rectangle {
      constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
      }

      static Contains(rect, x, y) {
        return x >= rect.x && x <= rect.x + rect.width &&
               y >= rect.y && y <= rect.y + rect.height;
      }
    },
    Intersects: {
      RectangleToRectangle: jest.fn(() => false)
    }
  },

  GameObjects: {
    Container: class Container {
      constructor() {
        this.list = [];
      }
      add(obj) {
        this.list.push(obj);
      }
    },
    Text: class Text {},
    Graphics: class Graphics {},
    Rectangle: class Rectangle {},
    Circle: class Circle {}
  }
};

module.exports = Phaser;
module.exports.default = Phaser;
