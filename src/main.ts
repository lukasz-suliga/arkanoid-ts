import { game } from "./game.js";

declare global {
  interface Window {
    WebFont: {
      load: (config: any) => void;
    };
  }
}

document.addEventListener("DOMContentLoaded", () => {
  window.WebFont.load({
    google: {
      families: ["Bangers"],
    },
    active: function () {
      // Start the game once the font is active
      game.gameLoop();
    },
  });
});
