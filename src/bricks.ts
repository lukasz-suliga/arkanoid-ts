// bricks.ts
type BrickConfig = {
  canvasWidth: number;
  rowCount: number;
  columnCount: number;
  width: number;
  height: number;
  padding: number;
  offsetTop: number;
};

type BrickImage = {
  new: HTMLImageElement;
  broken: HTMLImageElement;
};

export class Bricks {
  brickRowCount: number;
  brickColumnCount: number;
  brickWidth: number;
  brickHeight: number;
  brickPadding: number;
  brickOffsetTop: number;
  brickOffsetLeft: number;
  bricksArray: { x: number; y: number; health: number; colorIndex: number }[][];
  bricksImages: BrickImage[];
  bricksImagesLoaded: boolean;

  constructor(config: BrickConfig) {
    const {
      canvasWidth,
      rowCount,
      columnCount,
      width,
      height,
      padding,
      offsetTop,
    } = config;
    this.brickRowCount = rowCount;
    this.brickColumnCount = columnCount;
    this.brickWidth = width;
    this.brickHeight = height;
    this.brickPadding = padding;
    this.brickOffsetTop = offsetTop;
    this.brickOffsetLeft =
      (canvasWidth - (columnCount * (width + padding) - padding)) / 2;
    this.bricksArray = [];
    this.bricksImages = [];
    this.bricksImagesLoaded = false;
    this.preloadBrickImages();
    this.resetBricks();
  }

  preloadBrickImages(): void {
    const colors = 10; // Assuming 10 colors
    let loadedImages = 0;
    for (let i = 0; i < colors; i++) {
      this.bricksImages[i] = { new: new Image(), broken: new Image() };
      // Load new brick image
      this.bricksImages[i].new.onload = () => {
        if (++loadedImages === colors * 2) {
          // Both new and broken images for each color
          this.bricksImagesLoaded = true;
        }
      };
      this.bricksImages[i].new.src = `./images/brick_0${i}_new.png`;
      // Load broken brick image
      this.bricksImages[i].broken.onload = () => {
        if (++loadedImages === colors * 2) {
          this.bricksImagesLoaded = true;
        }
      };
      this.bricksImages[i].broken.src = `./images/brick_0${i}_broken.png`;
    }
  }

  resetBricks(): void {
    for (let c = 0; c < this.brickColumnCount; c++) {
      this.bricksArray[c] = [];
      for (let r = 0; r < this.brickRowCount; r++) {
        const colorIndex = r % 10; // Cycling through 10 colors
        let brickX =
          c * (this.brickWidth + this.brickPadding) + this.brickOffsetLeft;
        let brickY =
          r * (this.brickHeight + this.brickPadding) + this.brickOffsetTop;
        this.bricksArray[c][r] = {
          x: brickX,
          y: brickY,
          health: 1,
          colorIndex,
        };
      }
    }
  }

  draw(ctx: CanvasRenderingContext2D): void {
    for (let c = 0; c < this.brickColumnCount; c++) {
      for (let r = 0; r < this.brickRowCount; r++) {
        let b = this.bricksArray[c][r];
        if (b.health > 0) {
          let brickX = b.x;
          let brickY = b.y;
          let image =
            b.health === 2
              ? this.bricksImages[b.colorIndex].new
              : this.bricksImages[b.colorIndex].broken;
          ctx.drawImage(
            image,
            brickX,
            brickY,
            this.brickWidth,
            this.brickHeight
          );
        }
      }
    }
  }
}
