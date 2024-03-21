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

export function resizeCanvas(game: any) {
  const maxWidth = 800; // Original width
  const maxHeight = 600; // Original height
  const scaleWidth = window.innerWidth / maxWidth;
  const scaleHeight = window.innerHeight / maxHeight;
  let scale = Math.min(scaleWidth, scaleHeight); // Use the smaller scale factor to maintain aspect ratio

  // Optionally limit the maximum scale to avoid the canvas being too large
  const maxScale = 1; // Change this to allow the canvas to be larger than its original size
  scale = Math.min(scale, maxScale);

  // Save scale for use in drawing
  game.scale = scale;

  // Adjust canvas style to scale to viewport
  game.canvas.style.width = `${maxWidth * scale}px`;
  game.canvas.style.height = `${maxHeight * scale}px`;
}
