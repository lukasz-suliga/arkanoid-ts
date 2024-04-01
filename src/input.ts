import { Game } from "./game.js";

export class InputHandler {
  private game: Game;

  constructor(game: Game) {
    this.game = game;

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

  private touchStartHandler(event: TouchEvent): void {
    const state = this.game.currentState;
    if (state === "starting") {
      this.game.startGame();
    } else if (state === "gameOver") {
      this.game.restartGame();
    }
    this.game.paddle.lastTouchX = event.touches[0].clientX;
  }

  private touchMoveHandler(event: TouchEvent): void {
    if (!this.game.paddle.lastTouchX) return;
    const currentTouchX = event.touches[0].clientX;
    const deltaX = currentTouchX - this.game.paddle.lastTouchX;

    if (deltaX < 0) {
      this.game.paddle.movingLeft = true;
      this.game.paddle.movingRight = false;
    } else if (deltaX > 0) {
      this.game.paddle.movingLeft = false;
      this.game.paddle.movingRight = true;
    }
    this.game.paddle.lastTouchX = currentTouchX;
  }

  private touchEndHandler(): void {
    this.game.paddle.movingLeft = false;
    this.game.paddle.movingRight = false;
    this.game.paddle.lastTouchX = null;
  }

  private keyDownHandler(event: KeyboardEvent): void {
    const state = this.game.currentState;

    if (state === "playing") {
      switch (event.key) {
        case "ArrowLeft":
          this.game.paddle.movingLeft = true;
          break;
        case "ArrowRight":
          this.game.paddle.movingRight = true;
          break;
        case "Escape":
          this.game.paddle.movingRight = false;
          this.game.paddle.movingLeft = false;
          this.game.previousState = "playing";
          this.game.currentState = "options";
          break;
      }
    } else if (state === "gameOver") {
      this.game.restartGame();
    } else if (state === "starting") {
      if (this.game.soundManager.musicOn) {
        // FIXME: shouldn't run each time
        this.game.soundManager.tryPlayMusic();
      }

      switch (event.key) {
        case "ArrowUp":
          this.game.activeStartMenuItem =
            (this.game.activeStartMenuItem -
              1 +
              this.game.startMenuItems.length) %
            this.game.startMenuItems.length;
          this.game.drawStartScreen();
          break;
        case "ArrowDown":
          this.game.activeStartMenuItem =
            (this.game.activeStartMenuItem + 1) %
            this.game.startMenuItems.length;
          this.game.drawStartScreen();
          break;
        case "Enter":
          if (this.game.activeStartMenuItem === 0) {
            this.game.startGame();
          } else if (this.game.activeStartMenuItem === 1) {
            this.game.previousState = "starting";
            this.game.currentState = "options";
            this.game.drawOptionsScreen();
          }
          break;
      }
    } else if (state === "options") {
      switch (event.key) {
        case "ArrowUp":
          this.game.activeOptionsMenuItem =
            (this.game.activeOptionsMenuItem -
              1 +
              this.game.optionsMenuItems.length) %
            this.game.optionsMenuItems.length;
          break;
        case "ArrowDown":
          this.game.activeOptionsMenuItem =
            (this.game.activeOptionsMenuItem + 1) %
            this.game.optionsMenuItems.length;
          break;
        case "Enter":
          if (this.game.activeOptionsMenuItem === 0) {
            this.game.soundManager.toggleMusic();
          } else if (this.game.activeOptionsMenuItem === 1) {
            this.game.soundManager.toggleSound();
          } else if (this.game.activeOptionsMenuItem === 2) {
            this.game.currentState = this.game.previousState;
          }
          break;
        case "Escape":
          this.game.currentState = this.game.previousState;
          break;
      }
      if (this.game.currentState === "options") {
        this.game.drawOptionsScreen(); // Redraw options screen only if still in "options" state
      } else if (this.game.currentState === "starting") {
        this.game.drawStartScreen(); // Draw start screen if the state has changed to "starting"
      } else if (this.game.currentState === "playing") {
        this.game.updateGame();
        this.game.drawGame();
        this.game.animationFrameId = requestAnimationFrame(() =>
          this.game.gameLoop()
        );
      }
    }
  }

  private keyUpHandler(event: KeyboardEvent): void {
    const state = this.game.currentState;

    if (state === "playing") {
      switch (event.key) {
        case "ArrowLeft":
          this.game.paddle.movingLeft = false;
          break;
        case "ArrowRight":
          this.game.paddle.movingRight = false;
          break;
      }
    }
  }
}
