// Assuming the sounds are placed in the `public/sounds` folder

function loadSound(url: string): HTMLAudioElement {
  const sound = new Audio(url);
  sound.load();
  return sound;
}

const sounds = {
  brick: loadSound("/sounds/brick.mp3"),
  gameover: loadSound("/sounds/gameover.mp3"),
  go: loadSound("/sounds/go.mp3"),
  levelup: loadSound("/sounds/levelup.mp3"),
  loselife: loadSound("/sounds/loselife.mp3"),
  paddle: loadSound("/sounds/paddle.mp3"),
};

function playSound(sound: HTMLAudioElement): void {
  if (!sound.paused) {
    sound.pause();
    sound.currentTime = 0;
  }
  sound.play();
}

const music = loadSound("/sounds/music.wav");
music.loop = true;
music.volume = 0.15;

let isMusicPlaying = false;

function playMusic(): void {
  if (!isMusicPlaying) {
    music.play();
    isMusicPlaying = true;
    music.addEventListener(
      "timeupdate",
      function () {
        const buffer = 0.3; // Time in seconds before the end of the audio when it should loop.
        if (this.currentTime > this.duration - buffer) {
          this.currentTime = 0;
          this.play();
        }
      },
      false
    );
  }
}

export { sounds, playSound, playMusic };
