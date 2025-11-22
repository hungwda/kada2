/**
 * LetterMatchScene - Example game demonstrating BaseScene usage
 *
 * Gameplay:
 * - Match Kannada letters with their romanized equivalents
 * - Click correct match to score points
 * - Wrong matches lose a life
 * - Complete all matches to win
 *
 * Demonstrates:
 * - BaseScene responsive features
 * - BaseGame integration
 * - Service usage (audio, i18n, viewport)
 * - Touch-friendly UI
 */

import BaseScene from '../../phaser/BaseScene';
import BaseGame from '../../phaser/BaseGame';

class LetterMatchScene extends BaseScene {
  constructor() {
    super({ key: 'LetterMatchScene' });

    this.gameLogic = null;
    this.currentQuestion = null;
    this.options = [];
    this.questionText = null;
    this.optionButtons = [];
    this.feedbackText = null;

    // Letter pairs (Kannada → Roman)
    this.letterPairs = [
      { kannada: 'ಅ', roman: 'a', sound: 'a' },
      { kannada: 'ಆ', roman: 'aa', sound: 'aa' },
      { kannada: 'ಇ', roman: 'i', sound: 'i' },
      { kannada: 'ಈ', roman: 'ii', sound: 'ii' },
      { kannada: 'ಉ', roman: 'u', sound: 'u' },
      { kannada: 'ಊ', roman: 'uu', sound: 'uu' },
      { kannada: 'ಎ', roman: 'e', sound: 'e' },
      { kannada: 'ಏ', roman: 'ee', sound: 'ee' },
      { kannada: 'ಒ', roman: 'o', sound: 'o' },
      { kannada: 'ಓ', roman: 'oo', sound: 'oo' }
    ];

    this.questionsAnswered = 0;
    this.totalQuestions = 10;
  }

  /**
   * Initialize scene
   */
  init(data) {
    super.init(data);

    // Create game logic instance
    this.gameLogic = new BaseGame(this, {
      id: 'letter-match',
      lives: 3,
      level: data.level || 1,
      targetScore: 100,
      music: 'background-music'
    });

    console.log('LetterMatchScene initialized');
  }

  /**
   * Preload assets
   */
  preload() {
    // Load assets (fonts, sounds, etc.)
    // For now using built-in rendering
  }

  /**
   * Create scene
   */
  create() {
    super.create();

    // Create background
    this.createBackground('#E3F2FD');

    // Initialize game
    this.gameLogic.init();

    // Create UI
    this.createUI();

    // Start game
    this.gameLogic.start();

    // Show first question
    this.showNextQuestion();

    console.log('LetterMatchScene created');
  }

  /**
   * Create game UI
   */
  createUI() {
    const center = this.getCenter();
    const safeArea = this.getSafeArea();

    // Title
    const title = this.createText(
      center.x,
      safeArea.top + 60,
      this.t('games.letterMatch.title'),
      {
        variant: 'h2',
        color: '#1976D2',
        align: 'center'
      }
    );
    title.setOrigin(0.5);
    this.uiLayer.add(title);

    // Progress text
    this.progressText = this.createText(
      center.x,
      safeArea.top + 100,
      `Question ${this.questionsAnswered + 1}/${this.totalQuestions}`,
      {
        variant: 'body',
        color: '#666',
        align: 'center'
      }
    );
    this.progressText.setOrigin(0.5);
    this.uiLayer.add(this.progressText);

    // Question area
    const questionY = center.y - 100;

    const questionLabel = this.createText(
      center.x,
      questionY - 40,
      'Match this letter:',
      {
        variant: 'body',
        color: '#333',
        align: 'center'
      }
    );
    questionLabel.setOrigin(0.5);
    this.uiLayer.add(questionLabel);

    // Question text (Kannada letter)
    this.questionText = this.createText(
      center.x,
      questionY,
      '',
      {
        variant: 'h1',
        color: '#1976D2',
        align: 'center',
        kannada: true
      }
    );
    this.questionText.setOrigin(0.5);
    this.uiLayer.add(this.questionText);

    // Options area
    const optionsY = center.y + 80;
    const buttonWidth = this.viewport.getResponsiveValue({
      mobile: 150,
      tablet: 180,
      desktop: 200
    });
    const spacing = 20;

    // Create 4 option buttons (2 rows of 2)
    for (let i = 0; i < 4; i++) {
      const row = Math.floor(i / 2);
      const col = i % 2;

      const x = center.x - buttonWidth / 2 - spacing / 2 + col * (buttonWidth + spacing);
      const y = optionsY + row * 70;

      const button = this.createButton(
        x,
        y,
        '',
        () => this.handleAnswer(i),
        {
          width: buttonWidth,
          color: '#000000',
          variant: 'body'
        }
      );

      this.optionButtons.push(button);
      this.uiLayer.add(button);
    }

    // Feedback text
    this.feedbackText = this.createText(
      center.x,
      this.gameHeight - safeArea.bottom - 60,
      '',
      {
        variant: 'h3',
        color: '#4CAF50',
        align: 'center'
      }
    );
    this.feedbackText.setOrigin(0.5);
    this.feedbackText.setVisible(false);
    this.uiLayer.add(this.feedbackText);
  }

  /**
   * Show next question
   */
  showNextQuestion() {
    // Check if game complete
    if (this.questionsAnswered >= this.totalQuestions) {
      this.gameLogic.end(true);
      return;
    }

    // Select random letter
    const correctAnswer = Phaser.Utils.Array.GetRandom(this.letterPairs);
    this.currentQuestion = correctAnswer;

    // Update question text
    this.questionText.setText(correctAnswer.kannada);

    // Generate options (1 correct + 3 wrong)
    this.options = [correctAnswer];

    // Add 3 wrong options
    const wrongOptions = this.letterPairs.filter(
      pair => pair.roman !== correctAnswer.roman
    );

    for (let i = 0; i < 3; i++) {
      const wrong = Phaser.Utils.Array.GetRandom(wrongOptions);
      if (!this.options.includes(wrong)) {
        this.options.push(wrong);
      }
    }

    // Shuffle options
    Phaser.Utils.Array.Shuffle(this.options);

    // Update button labels
    this.optionButtons.forEach((button, index) => {
      if (index < this.options.length) {
        const label = button.list[1]; // Get text from container
        label.setText(this.options[index].roman);
        button.setVisible(true);
      } else {
        button.setVisible(false);
      }
    });

    // Update progress
    this.progressText.setText(
      `Question ${this.questionsAnswered + 1}/${this.totalQuestions}`
    );

    // Hide feedback
    this.feedbackText.setVisible(false);
  }

  /**
   * Handle answer selection
   * @param {number} optionIndex - Selected option index
   */
  handleAnswer(optionIndex) {
    const selected = this.options[optionIndex];
    const isCorrect = selected.roman === this.currentQuestion.roman;

    if (isCorrect) {
      // Correct answer
      this.gameLogic.addScore(10);
      this.questionsAnswered++;

      this.feedbackText.setText('✓ Correct!');
      this.feedbackText.setColor('#4CAF50');
      this.feedbackText.setVisible(true);

      this.playSfx('correct');

      // Show next question after delay
      this.time.delayedCall(1000, () => {
        this.showNextQuestion();
      });
    } else {
      // Wrong answer
      const gameOver = this.gameLogic.loseLife();

      this.feedbackText.setText(`✗ Wrong! Correct: ${this.currentQuestion.roman}`);
      this.feedbackText.setColor('#F44336');
      this.feedbackText.setVisible(true);

      this.playSfx('wrong');

      if (!gameOver) {
        // Try again after delay
        this.time.delayedCall(2000, () => {
          this.showNextQuestion();
        });
      }
    }
  }

  /**
   * Update loop
   */
  update(time, delta) {
    // Game update logic
  }

  /**
   * Clean up
   */
  shutdown() {
    super.shutdown();

    if (this.gameLogic) {
      this.gameLogic.destroy();
    }
  }
}

export default LetterMatchScene;
