/**
 * Akshara Catcher Config Tests
 */

import aksharaCatcherConfig from '../config';
import AksharaCatcherScene from '../AksharaCatcherScene';

describe('AksharaCatcher Config', () => {
  test('should have correct game metadata', () => {
    expect(aksharaCatcherConfig.id).toBe('akshara-catcher');
    expect(aksharaCatcherConfig.name).toBe('Akshara Catcher');
    expect(aksharaCatcherConfig.nameKannada).toBe('ಅಕ್ಷರ ಕ್ಯಾಚರ್');
    expect(aksharaCatcherConfig.difficulty).toBe('beginner');
  });

  test('should have game mechanics defined', () => {
    expect(aksharaCatcherConfig.lives).toBe(3);
    expect(aksharaCatcherConfig.targetScore).toBe(100);
    expect(aksharaCatcherConfig.timeLimit).toBeNull();
  });

  test('should have learning objectives', () => {
    expect(aksharaCatcherConfig.skills).toBeInstanceOf(Array);
    expect(aksharaCatcherConfig.skills.length).toBeGreaterThan(0);
    expect(aksharaCatcherConfig.skills).toContain('vowel-recognition');
  });

  test('should have correct scene configuration', () => {
    expect(aksharaCatcherConfig.scenes).toBeInstanceOf(Array);
    expect(aksharaCatcherConfig.scenes[0]).toBe(AksharaCatcherScene);
    expect(aksharaCatcherConfig.startScene).toBe('AksharaCatcherScene');
  });

  test('should have physics configuration', () => {
    expect(aksharaCatcherConfig.physics).toBeDefined();
    expect(aksharaCatcherConfig.physics.default).toBe('arcade');
  });

  test('should have UI configuration', () => {
    expect(aksharaCatcherConfig.ui.showScore).toBe(true);
    expect(aksharaCatcherConfig.ui.showLives).toBe(true);
    expect(aksharaCatcherConfig.ui.showLevel).toBe(true);
  });

  test('should have instructions in both languages', () => {
    expect(aksharaCatcherConfig.instructions.en).toBeInstanceOf(Array);
    expect(aksharaCatcherConfig.instructions.kn).toBeInstanceOf(Array);
    expect(aksharaCatcherConfig.instructions.en.length).toBeGreaterThan(0);
    expect(aksharaCatcherConfig.instructions.kn.length).toBeGreaterThan(0);
  });

  test('should have level progression defined', () => {
    expect(aksharaCatcherConfig.levels).toBeInstanceOf(Array);
    expect(aksharaCatcherConfig.levels.length).toBe(3);

    aksharaCatcherConfig.levels.forEach((level, index) => {
      expect(level.level).toBe(index + 1);
      expect(level.name).toBeDefined();
      expect(level.targetScore).toBeGreaterThan(0);
    });
  });

  test('should have control instructions', () => {
    expect(aksharaCatcherConfig.controls.desktop).toBeDefined();
    expect(aksharaCatcherConfig.controls.mobile).toBeDefined();
    expect(aksharaCatcherConfig.controls.tablet).toBeDefined();
  });
});
