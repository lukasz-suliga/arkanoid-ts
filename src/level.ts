// Level.ts
import { Brick } from "./brick";
import { sounds, playSound } from "./sound";
import levels from "./levels.json";

export class Level {
  private game: any;
  private backgroundImage: HTMLImageElement;
  private backgroundImages: string[];
  private bricks: Brick[] = [];
  private brickImages: {
    [key: number]: { new: HTMLImageElement; broken: HTMLImageElement };
  } = {};
  private width: number;
  private height: number;
  private padding: number;
  private offsetTop: number;

  constructor(game: any) {
    this.game = game;
    this.backgroundImages = [
      "./images/background_6.png",
      "./images/background_7.png",
      "./images/background_8.jpeg",
      "./images/background_9.jpeg",
      "./images/background_10.jpeg",
      "./images/background_11.jpeg",
      "./images/background_12.jpeg",
      "./images/background_13.jpeg",
      "./images/background_14.jpeg",
    ];
    this.backgroundImage = this.loadBackgroundImage();
    this.preloadBrickImages().then(() => this.generateBricks());
    this.width = 75;
    this.height = 20;
    this.padding = 10;
    this.offsetTop = 30;
  }

  private async preloadBrickImages(): Promise<void> {
    const colors = 10;
    const loadImage = (src: string): Promise<HTMLImageElement> => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.src = src;
      });
    };

    const promises: Promise<void>[] = [];
    for (let i = 0; i < colors; i++) {
      const newIndex = `./images/brick_0${i}_new.png`;
      const brokenIndex = `./images/brick_0${i}_broken.png`;

      promises.push(
        Promise.all([loadImage(newIndex), loadImage(brokenIndex)]).then(
          ([newImg, brokenImg]) => {
            this.brickImages[i] = { new: newImg, broken: brokenImg };
          }
        )
      );
    }
    await Promise.all(promises);
  }

  private loadBackgroundImage(): HTMLImageElement {
    const levelIndex =
      (this.game.player.level % this.backgroundImages.length) - 1; // Loop through backgrounds
    let backgroundImage = new Image();
    backgroundImage.src = this.backgroundImages[levelIndex];
    return backgroundImage;
  }

  private generateBricks(): void {
    const currentLevel = this.game.player.level - 1;
    const levelInfo = levels[currentLevel]; // Assuming 'levels' is accessible here
    this.backgroundImage.src = levelInfo.backgroundImage;

    let offsetX =
      (this.game.canvas.width -
        (levelInfo.columnCount * (this.width + this.padding) - this.padding)) /
      2;

    levelInfo.bricks.forEach((brickInfo, r) => {
      let y = r * (this.height + this.padding) + this.offsetTop;
      const images = {
        new: this.brickImages[brickInfo.colorIndex].new,
        broken: this.brickImages[brickInfo.colorIndex].broken,
      };
      for (let c = 0; c < levelInfo.columnCount; c++) {
        let x = c * (this.width + this.padding) + offsetX;
        this.bricks.push(
          new Brick(
            x,
            y,
            this.width,
            this.height,
            brickInfo.colorIndex,
            images,
            brickInfo.health
          )
        );
      }
    });
  }

  private checkLevelProgression(): void {
    const allBricksDestroyed = this.bricks.every((brick) => brick.health <= 0);

    if (allBricksDestroyed) {
      this.game.player.levelUp();
      this.generateBricks();
      this.game.resetBallAndPaddle();
      playSound(sounds.levelup);
      this.loadBackgroundImage();
    }
  }

  public checkBallBrickCollision(): void {
    this.bricks.forEach((brick) => {
      if (brick.health > 0) {
        if (
          this.game.ball.x > brick.x &&
          this.game.ball.x < brick.x + brick.width &&
          this.game.ball.y > brick.y &&
          this.game.ball.y < brick.y + brick.height
        ) {
          this.game.ball.dy *= -1;
          brick.hit();
          this.game.player.increaseScore(1);
          playSound(sounds.brick);
          this.checkLevelProgression();
        }
      }
    });
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    if (this.backgroundImage.complete) {
      // Ensure the image is loaded before drawing
      ctx.drawImage(
        this.backgroundImage,
        0,
        0,
        ctx.canvas.width,
        ctx.canvas.height
      );
    } else {
      // If the image is not loaded yet, add an onload handler
      this.backgroundImage.onload = () => {
        ctx.drawImage(
          this.backgroundImage,
          0,
          0,
          ctx.canvas.width,
          ctx.canvas.height
        );
      };
    }
    this.bricks.forEach((brick) => brick.draw(ctx));
  }
}
