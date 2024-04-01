import { Paddle } from "./paddle";
import { InputHandler } from "./input"; // Make sure the file name matches the case sensitivity and naming convention
import { Player } from "./player";
import { Ball } from "./ball";
import { Level } from "./level";
import {
  drawLevel,
  drawScore,
  updateLivesDisplay,
  drawHighScore,
} from "./drawing";
import { SoundManager } from "./sound";
import { resizeCanvas } from "./drawing.js";

export type GameState = "playing" | "gameOver" | "starting" | "options";

export class Game {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  player: Player;
  paddle: Paddle;
  level: Level;
  ball: Ball;
  inputHandler: InputHandler;
  currentState: GameState;
  previousState: GameState;
  animationFrameId?: number;
  scale: number;
  startMenuItems: string[] = ["Start", "Options"];
  activeStartMenuItem: number = 0; // Index of the active menu item, 0 for "Start"
  activeOptionsMenuItem: number = 0; // 0 for Music, 1 for Sound, 2 for Back
  optionsMenuItems: string[] = ["Music: on", "Sound: on", "Back"];
  soundManager: SoundManager;

  constructor(canvasId: string) {
    const canvas = document.getElementById(canvasId);
    if (!(canvas instanceof HTMLCanvasElement)) {
      throw new Error("Canvas element not found");
    }
    this.canvas = canvas;
    this.canvas.width = 800;
    this.canvas.height = 600;

    window.addEventListener("resize", () => resizeCanvas(this));

    const scaleWidth = window.innerWidth / canvas.width;
    const scaleHeight = window.innerHeight / canvas.height;

    this.scale = Math.min(scaleWidth, scaleHeight);

    this.ctx = this.canvas.getContext("2d")!;

    this.player = new Player("Player1");
    this.paddle = new Paddle(this.canvas.width, this.canvas.height);
    this.level = new Level(this);
    this.ball = new Ball(this);

    this.currentState = "starting";
    this.previousState = "starting";

    this.inputHandler = new InputHandler(this);

    this.soundManager = new SoundManager();
  }

  startGame(): void {
    this.currentState = "playing";
    this.soundManager.playSound("go");
    this.gameLoop();
  }

  checkBallBottomCollision(): void {
    if (this.ball.y + this.ball.dy > this.canvas.height - this.ball.radius) {
      this.loseLife();
    }
  }

  loseLife(): void {
    this.player.lives -= 1;
    updateLivesDisplay(this.player.lives);
    if (this.player.lives <= 0) {
      this.currentState = "gameOver";
      this.soundManager.playSound("gameover");
    } else {
      this.resetBallAndPaddle();
      this.soundManager.playSound("loselife");
    }
  }

  resetBallAndPaddle(): void {
    this.ball.reset(this.canvas.width / 2, this.canvas.height - 30);
    this.paddle.x = (this.canvas.width - this.paddle.width) / 2;
  }

  updateGame(): void {
    this.paddle.update();
    this.ball.update(this.canvas.width, this.paddle);
    this.level.checkBallBrickCollision();
    this.checkBallBottomCollision();
  }

  drawGame(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.level.draw(this.ctx);
    updateLivesDisplay(this.player.lives);
    this.ball.draw(this.ctx);
    this.paddle.draw(this.ctx);
    drawLevel(this.player.level);
    drawScore(this.player.score);
    drawHighScore(this.player.highScore);
  }

  drawStartScreen(): void {
    const splashImg = new Image();
    splashImg.onload = () => {
      // Set font for the text
      this.ctx.font = "80px 'Bangers', cursive";
      this.ctx.textAlign = "center";
      this.ctx.textBaseline = "middle";

      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // Clear the canvas first
      this.ctx.drawImage(
        splashImg,
        0,
        0,
        this.canvas.width, // Scale width
        this.canvas.height // Scale height
      );

      // Loop through menu items to draw them
      this.startMenuItems.forEach((item, index) => {
        this.ctx.fillStyle =
          index === this.activeStartMenuItem ? "white" : "grey"; // Highlight active item
        let yOffset = (index - 1) * 70; // Adjust based on your layout
        this.ctx.fillText(
          item,
          this.canvas.width / 2,
          this.canvas.height / 2 + yOffset
        );
      });
    };
    splashImg.src = "./images/splash_screen_3.png";
  }

  drawOptionsScreen(): void {
    const optionsImg = new Image();
    optionsImg.src = "./images/splash_screen_2.png";
    optionsImg.onload = () => {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.drawImage(
        optionsImg,
        0,
        0,
        this.canvas.width,
        this.canvas.height
      );

      // Update the options text based on current settings
      this.optionsMenuItems[0] = `Music: ${
        this.soundManager.musicOn ? "on" : "off"
      }`;
      this.optionsMenuItems[1] = `Sound: ${
        this.soundManager.soundOn ? "on" : "off"
      }`;

      this.ctx.textAlign = "center";
      this.ctx.textBaseline = "middle";

      // Draw options menu items
      this.optionsMenuItems.forEach((item, index) => {
        this.ctx.fillStyle =
          index === this.activeOptionsMenuItem ? "white" : "grey";
        let yOffset = index * 70 + 200; // Adjust based on layout, starting at a different point
        this.ctx.fillText(item, this.canvas.width / 2, yOffset);
      });
    };
  }

  drawGameOver(): void {
    if (this.animationFrameId !== undefined) {
      cancelAnimationFrame(this.animationFrameId);
    }
    const gameOverImg = new Image();
    gameOverImg.onload = () => {
      // Clear the canvas
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      // Draw the image now that it's loaded
      this.ctx.drawImage(
        gameOverImg,
        0,
        0,
        this.canvas.width,
        this.canvas.height
      );

      // Optionally draw the text
      //   this.ctx.font = "48px Arial";
      //   this.ctx.fillStyle = "#0095DD";
      //   this.ctx.fillText(
      //     "Game Over!",
      //     this.canvas.width / 4,
      //     this.canvas.height / 2
      //   );
      //   this.ctx.font = "24px Arial";
      //   this.ctx.fillText(
      //     "Press any key to restart",
      //     this.canvas.width / 4,
      //     this.canvas.height / 2 + 50
      //   );
    };
    gameOverImg.src = "./images/game_over_screen_3.png";
  }

  gameLoop(): void {
    // Handle the current state
    switch (this.currentState) {
      case "starting":
        this.drawStartScreen();
        break;
      case "playing":
        // Perform updates and drawings for the playing state
        this.updateGame();
        this.drawGame();
        // Schedule the next frame
        this.animationFrameId = requestAnimationFrame(() => this.gameLoop());
        break;
      case "options":
        this.drawOptionsScreen();
        break;
      case "gameOver":
        // Draw the game over screen but do not schedule a new frame
        this.drawGameOver();
        break;
    }
  }

  restartGame(): void {
    if (typeof this.animationFrameId !== "undefined") {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = undefined;
    }
    this.player.reset();
    this.level = new Level(this);
    this.resetBallAndPaddle();
    this.currentState = "playing";
    this.gameLoop();
  }
}

export const game = new Game("gameCanvas");
