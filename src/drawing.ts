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
