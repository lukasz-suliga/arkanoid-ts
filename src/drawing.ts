export function drawLevel(level: number): void {
  const levelContainer = document.getElementById("levelDisplay");
  if (levelContainer) {
    levelContainer.innerHTML = "Level: " + level;
  }
}

export function updateLivesDisplay(lives: number): void {
  const livesContainer = document.getElementById("livesDisplay");
  if (livesContainer) {
    livesContainer.innerHTML = ""; // Clear the current hearts
    for (let i = 0; i < lives; i++) {
      let heart = document.createElement("div");
      heart.classList.add("heart");
      livesContainer.appendChild(heart);
    }
  }
}

export function drawScore(score: number): void {
  const scoreContainer = document.getElementById("scoreDisplay");
  if (scoreContainer) {
    scoreContainer.innerHTML = "Score: " + score;
  }
}

export function drawHighScore(highScore: number): void {
  const highScoreContainer = document.getElementById("highScoreDisplay");
  if (highScoreContainer) {
    highScoreContainer.innerHTML = "High Score: " + highScore;
  }
}

export function resizeCanvas() {
  const canvas = document.getElementById("gameCanvas");
  if (!(canvas instanceof HTMLCanvasElement)) {
    throw new Error("Canvas element not found");
  }
  const canvasAspectRatio = 800 / 600; // Your canvas default size
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  const windowAspectRatio = windowWidth / windowHeight;
  let newCanvasWidth, newCanvasHeight;

  if (windowAspectRatio > canvasAspectRatio) {
    // Window is wider than the desired game ratio
    newCanvasHeight = windowHeight;
    newCanvasWidth = newCanvasHeight * canvasAspectRatio;
  } else {
    // Window is taller than the desired game ratio
    newCanvasWidth = windowWidth;
    newCanvasHeight = newCanvasWidth / canvasAspectRatio;
  }

  // Set new canvas size
  canvas.width = newCanvasWidth;
  canvas.height = newCanvasHeight;

  // Adjust game UI if necessary
}
