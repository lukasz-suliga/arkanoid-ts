import { sounds, playSound } from "./sound.js";

export class Ball {
  x: number;
  y: number;
  radius: number;
  dx: number = 0; // Horizontal velocity
  dy: number = 0; // Vertical velocity
  baseSpeed: number;
  speedIncrease: number;
  ballImage: HTMLImageElement;

  constructor(x: number, y: number, radius: number) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.baseSpeed = 5; // Starting speed of the ball
    this.speedIncrease = 0; // Speed increase that can be adjusted during the game
    this.ballImage = new Image();
    this.preloadBallImage();
    this.setInitialVelocity();
  }

  preloadBallImage(): void {
    this.ballImage.src = `./images/ball.png`;
  }

  setInitialVelocity(): void {
    // Use the base speed and speed increase to determine the ball's initial velocities
    const speed = this.baseSpeed + this.speedIncrease;
    // Randomly adjust dx within a range, ensuring it's scaled by the current speed
    this.dx = (Math.random() * 2 - 1) * speed; // Random initial horizontal velocity
    this.dy = -speed; // Initial vertical velocity
  }

  draw(ctx: CanvasRenderingContext2D): void {
    const diameter = this.radius * 2;
    ctx.drawImage(
      this.ballImage,
      this.x - this.radius,
      this.y - this.radius,
      diameter,
      diameter
    );
  }

  reset(x: number, y: number): void {
    this.x = x;
    this.y = y;
    this.speedIncrease = 0; // Reset any speed increase
    this.setInitialVelocity();
  }

  increaseSpeed(amount: number): void {
    this.speedIncrease += amount;
    this.setInitialVelocity(); // Reset velocity to account for new speed
  }

  update(
    canvasWidth: number,
    paddle: { x: number; width: number; y: number }
  ): void {
    // Check for collision with the left or right walls
    if (
      this.x + this.dx > canvasWidth - this.radius ||
      this.x + this.dx < this.radius
    ) {
      this.dx = -this.dx;
    }

    // Check for collision with the top wall
    if (this.y + this.dy < this.radius) {
      this.dy = -this.dy;
    }

    // Check for collision with the paddle
    if (
      this.x > paddle.x &&
      this.x < paddle.x + paddle.width &&
      this.y + this.radius > paddle.y
    ) {
      this.dy = -this.dy;
      const deltaX = this.x - (paddle.x + paddle.width / 2);
      this.dx = deltaX * 0.1; // Adjust for more responsive control based on collision point
      playSound(sounds.paddle);
    }

    this.x += this.dx;
    this.y += this.dy;
  }
}
