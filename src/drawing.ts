import { Game } from "./game.js";

export function resizeCanvas(game: Game) {
  const canvas = game.canvas;

  // Update the canvas dimensions to fill the window
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // Trigger a redraw of the current game state/screen
  game.gameLoop();
}
