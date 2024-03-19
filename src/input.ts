import { playMusic } from "./sound.js";
import { Paddle } from "./paddle.js"; // Assuming you have a Paddle class

type GameState = "playing" | "gameOver" | "starting";

export class InputHandler {
  paddle: Paddle;
  getCurrentState: () => GameState;
  restartGame: () => void;
  startGame: () => void;
  lastTouchX: number | null = null;

  constructor(
    paddle: Paddle,
    getCurrentState: () => GameState,
    restartGame: () => void,
    startGame: () => void
  ) {
    this.paddle = paddle;
    this.getCurrentState = getCurrentState;
    this.restartGame = restartGame;
    this.startGame = startGame;

    document.addEventListener("keydown", (event) => this.keyDownHandler(event));
    document.addEventListener("keyup", (event) => this.keyUpHandler(event));
    document.addEventListener("touchstart", (event) =>
      this.touchStartHandler(event)
    );
    document.addEventListener("touchmove", (event) =>
      this.touchMoveHandler(event)
    );
    document.addEventListener("touchend", () => this.touchEndHandler());
  }

  touchStartHandler(event: TouchEvent): void {
    const state = this.getCurrentState();
    if (state === "starting") {
      playMusic();
      this.startGame();
    } else if (state === "gameOver") {
      this.restartGame();
    }
    // Store the initial touch position
    this.lastTouchX = event.touches[0].clientX;
  }

  touchMoveHandler(event: TouchEvent): void {
    if (!this.lastTouchX) return; // Ensure we have a starting point
    const currentTouchX = event.touches[0].clientX;
    const deltaX = currentTouchX - this.lastTouchX;

    if (deltaX < 0) {
      this.paddle.movingLeft = true;
      this.paddle.movingRight = false;
    } else if (deltaX > 0) {
      this.paddle.movingLeft = false;
      this.paddle.movingRight = true;
    }
    this.lastTouchX = currentTouchX; // Update the last touch position for the next move event
  }

  touchEndHandler(): void {
    // Reset paddle movement and last touch position on touch end
    this.paddle.movingLeft = false;
    this.paddle.movingRight = false;
    this.lastTouchX = null;
  }

  keyDownHandler(event: KeyboardEvent): void {
    const state = this.getCurrentState();

    if (state === "playing") {
      switch (event.key) {
        case "ArrowLeft":
          this.paddle.movingLeft = true;
          break;
        case "ArrowRight":
          this.paddle.movingRight = true;
          break;
      }
    } else if (state === "gameOver") {
      // Call the restart game method on any key press when the game is over
      this.restartGame();
    } else if (state === "starting") {
      playMusic();
      this.startGame();
    }
  }

  keyUpHandler(event: KeyboardEvent): void {
    const state = this.getCurrentState();

    if (state === "playing") {
      switch (event.key) {
        case "ArrowLeft":
          this.paddle.movingLeft = false;
          break;
        case "ArrowRight":
          this.paddle.movingRight = false;
          break;
      }
    }
  }
}
