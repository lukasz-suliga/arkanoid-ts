import { Paddle } from "./paddle";
import { InputHandler } from "./input"; // Make sure the file name matches the case sensitivity and naming convention
import { Player } from "./player";
import { Ball } from "./ball";
import { Level } from "./level";
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
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    console.log(this.canvas.width, " - canvas width when starting");
    console.log(this.canvas.height, " - canvas height when starting");

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

  drawUI(): void {
    // Define UI zones
    const topUIHeight = 40; // Height of the top UI area
    const bottomUIHeight = 40; // Height of the bottom UI area
    const gameAreaHeight = this.canvas.height - topUIHeight - bottomUIHeight;

    // Prepare common styles
    this.ctx.font = "30px 'Bangers', cursive";
    this.ctx.textBaseline = "top";

    // Draw the score in the top left corner of the top UI zone
    this.ctx.textAlign = "left";
    this.ctx.fillStyle = "white"; // Color for the score
    this.ctx.fillText(`Score: ${this.player.score}`, 10, 5);

    // Draw the high score in the top right corner of the top UI zone
    this.ctx.textAlign = "right";
    this.ctx.fillText(
      `High Score: ${this.player.highScore}`,
      this.canvas.width - 10,
      5
    );

    // Draw the lives in the bottom left corner of the bottom UI zone
    this.ctx.textAlign = "left";
    this.ctx.fillStyle = "white"; // Keep white color for the text "Lives"
    this.ctx.fillText("Lives:", 10, gameAreaHeight + topUIHeight + 5);

    // Draw the hearts for lives in red, below the gameplay area
    this.ctx.fillStyle = "red"; // Set color to red for hearts
    for (let i = 0; i < this.player.lives; i++) {
      // Adjust positioning and size as needed for the hearts
      this.ctx.fillText("❤", 80 + i * 30, gameAreaHeight + topUIHeight + 5); // Start after "Lives:" text
    }

    // Draw the level in the bottom right corner of the bottom UI zone
    this.ctx.textAlign = "right";
    this.ctx.fillStyle = "white"; // Color for the level
    this.ctx.fillText(
      `Level: ${this.player.level}`,
      this.canvas.width - 10,
      gameAreaHeight + topUIHeight + 5
    );
  }

  // Now call drawUI in drawGame
  drawGame(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.level.draw(this.ctx);
    this.ball.draw(this.ctx);
    this.paddle.draw(this.ctx);
    this.drawUI(); // Now drawing all UI elements on the canvas
  }

  drawBackground(
    image: HTMLImageElement,
    focusStartX: number,
    focusEndX: number
  ): void {
    const imageAspectRatio = image.width / image.height;
    const canvasAspectRatio = this.canvas.width / this.canvas.height;

    let scale: number, sx: number, sy: number, sWidth: number, sHeight: number;

    if (canvasAspectRatio > imageAspectRatio) {
      // Window is wider than the image's aspect ratio, scale based on width
      scale = this.canvas.width / image.width;
      sWidth = image.width;
      sHeight = this.canvas.height / scale;
      sx = 0; // Start from the beginning of the image
      sy = (image.height - sHeight) / 2; // Vertically center the drawing
    } else {
      // Window is taller than the image's aspect ratio, scale based on height
      scale = this.canvas.height / image.height;
      sHeight = image.height;
      const focusWidth = focusEndX - focusStartX;
      sx = focusStartX + (focusWidth - this.canvas.width / scale) / 2;
      sx = Math.max(sx, 0);
      sx = Math.min(sx, image.width - this.canvas.width / scale);
      sy = 0; // Start from the top of the image
      sWidth = this.canvas.width / scale;
    }

    this.ctx.drawImage(
      image,
      sx,
      sy,
      sWidth,
      sHeight,
      0,
      0,
      this.canvas.width,
      this.canvas.height
    );
  }

  drawMenuText(menuItems: string[], activeItemIndex: number): void {
    const startX = this.canvas.width / 2; // Center horizontally
    const startY = this.canvas.height / 2 - (menuItems.length * 35) / 2; // Start in the middle vertically
    const itemSpacing = 70; // Space between items

    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    this.ctx.font = "80px 'Bangers', cursive"; // Adjust as needed

    menuItems.forEach((item, index) => {
      this.ctx.fillStyle = index === activeItemIndex ? "white" : "grey"; // Highlight the active item
      const yOffset = startY + index * itemSpacing; // Calculate the Y position for each item
      this.ctx.fillText(item, startX, yOffset);
    });
  }

  // Adjust drawStartScreen and redrawCurrentState to use drawBackground
  drawStartScreen(): void {
    const splashImg = new Image();
    splashImg.src = "./images/splash_screen_32x9_1.png";
    splashImg.onload = () => {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      // Specify the desired focus area for this background
      const focusStartX = 1150;
      const focusEndX = 1550;
      this.drawBackground(splashImg, focusStartX, focusEndX);
      this.drawMenuText(this.startMenuItems, this.activeStartMenuItem);
    };
  }

  drawOptionsScreen(): void {
    const splashImg = new Image();
    splashImg.src = "./images/splash_screen_32x9_2.png";
    splashImg.onload = () => {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      // Specify the desired focus area for this background
      this.drawBackground(splashImg, 950, 1350);
      // Draw text and other UI elements as needed

      // Update the options text based on current settings
      this.optionsMenuItems[0] = `Music: ${
        this.soundManager.musicOn ? "on" : "off"
      }`;
      this.optionsMenuItems[1] = `Sound: ${
        this.soundManager.soundOn ? "on" : "off"
      }`;

      this.drawMenuText(this.optionsMenuItems, this.activeOptionsMenuItem);
    };
  }

  drawGameOver(): void {
    if (this.animationFrameId !== undefined) {
      cancelAnimationFrame(this.animationFrameId);
    }
    const gameOverImg = new Image();
    gameOverImg.src = "./images/splash_screen_32x9_3.png"; // Use the specified image

    gameOverImg.onload = () => {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // Clear the canvas
      const focusStartX = 1150;
      const focusEndX = 1550;
      this.drawBackground(gameOverImg, focusStartX, focusEndX);

      this.ctx.textAlign = "center";
      this.ctx.textBaseline = "middle";
      this.ctx.font = "80px 'Bangers', cursive"; // Adjust font size and family as needed

      const centerX = this.canvas.width / 2;
      const centerY = this.canvas.height / 2;

      // Draw the text at the center of the canvas
      this.ctx.fillStyle = "white"; // Set text color
      this.ctx.fillText("Game Over!", centerX, centerY); // Adjust the text as needed
    };
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
