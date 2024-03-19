import { game } from "./game.js";
import { resizeCanvas } from "./drawing.js";

document.addEventListener("DOMContentLoaded", () => {
  game.gameLoop();
});

window.addEventListener("resize", resizeCanvas);
