export class Paddle {
  width: number;
  height: number;
  x: number;
  y: number;
  canvasWidth: number;
  canvasHeight: number;
  speed: number;
  movingLeft: boolean;
  movingRight: boolean;
  paddleImages: HTMLImageElement[];
  animationFrame: number;
  frameDelay: number;
  frameDelayCounter: number;

  constructor(canvasWidth: number, canvasHeight: number) {
    this.width = 90;
    this.height = 10;
    this.x = (canvasWidth - this.width) / 2;
    this.y = canvasHeight - this.height - 10; // Adjust the paddle's position from the bottom
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.speed = 6;
    this.movingLeft = false;
    this.movingRight = false;
    this.paddleImages = [];
    this.animationFrame = 0;
    this.frameDelay = 10; // Number of game loops to wait before switching frames
    this.frameDelayCounter = 0; // Counter for the delay
    this.preloadPaddleImages();
  }

  preloadPaddleImages(): void {
    for (let i = 0; i < 3; i++) {
      // Assuming you have 3 frames for each animation
      const image = new Image();
      image.src = `./images/paddle_${i}.png`;
      this.paddleImages.push(image);
    }
  }

  moveLeft(): void {
    if (this.x > 0) {
      this.x -= this.speed;
    }
  }

  moveRight(): void {
    if (this.x + this.width < this.canvasWidth) {
      this.x += this.speed;
    }
  }

  update(): void {
    if (this.movingLeft) {
      this.moveLeft();
    }
    if (this.movingRight) {
      this.moveRight();
    }
    // Animation logic
    this.frameDelayCounter++;
    if (this.frameDelayCounter >= this.frameDelay) {
      this.animationFrame =
        (this.animationFrame + 1) % this.paddleImages.length;
      this.frameDelayCounter = 0; // Reset the counter
    }
  }

  draw(ctx: CanvasRenderingContext2D): void {
    const originalWidth = 485;
    const originalHeight = 128;
    const aspectRatio = originalWidth / originalHeight;
    const newHeight = this.width / aspectRatio;
    const adjustedYPosition = this.y - newHeight + this.height; // Adjusted to align with the bottom of the paddle position

    ctx.drawImage(
      this.paddleImages[this.animationFrame],
      this.x,
      adjustedYPosition,
      this.width,
      newHeight
    );
  }
}
