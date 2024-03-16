import { playMusic } from "./sound.js";
import { Paddle } from "./paddle.js"; // Assuming you have a Paddle class

type GameState = "playing" | "gameOver" | "starting";

export class InputHandler {
  paddle: Paddle;
  getCurrentState: () => GameState;
  restartGame: () => void;
  startGame: () => void;

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
