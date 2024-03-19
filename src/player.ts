export class Player {
  name: string;
  highScore: number;
  score: number;
  level: number;
  lives: number;

  constructor(name: string) {
    this.name = name;
    // The localStorage.getItem() method returns a string. You need to convert it to a number.
    // Using `Number()` or the unary plus operator `+` converts the string to a number. If `localStorage.getItem()` returns `null`, the fallback value (`0`) is used.
    this.highScore = Number(localStorage.getItem("highScore")) || 0;
    this.score = 0;
    this.level = 0;
    this.lives = 0;
    this.reset();
  }

  increaseScore(points: number): void {
    this.score += points;
    if (this.score > this.highScore) {
      this.highScore = this.score;
      this.saveHighScore();
    }
  }

  getHighScore(): number {
    // Ensure the method returns a number
    return Number(localStorage.getItem("highScore")) || 0;
  }

  saveHighScore(): void {
    // localStorage.setItem() needs a string value, so convert this.score to string
    // The score comparison check here might be redundant since you're already checking before calling saveHighScore() in increaseScore()
    localStorage.setItem("highScore", this.score.toString());
  }

  reset(): void {
    this.score = 0;
    this.level = 1;
    this.lives = 3;
  }

  levelUp(): void {
    this.level++;
    // Uncommenting this line will increase the score by 10 points every level up.
    // this.increaseScore(10);
  }
}
