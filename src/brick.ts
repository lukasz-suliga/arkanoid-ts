export class Brick {
  x: number;
  y: number;
  width: number;
  height: number;
  health: number;
  initialHealth: number;
  colorIndex: number;
  image: HTMLImageElement;
  images: { new: HTMLImageElement; broken: HTMLImageElement };

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    colorIndex: number,
    images: { new: HTMLImageElement; broken: HTMLImageElement },
    health = 1
  ) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.colorIndex = colorIndex;
    this.images = images;
    this.image = this.images.new;
    this.health = health;
    this.initialHealth = health;
  }

  public hit(): void {
    this.health -= 1;
    if (this.health === 1 && this.initialHealth > 1) {
      this.image = this.images.broken;
    }
  }

  draw(ctx: CanvasRenderingContext2D): void {
    if (this.health > 0) {
      ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
  }
}
