export class SoundManager {
  musicOn: boolean;
  soundOn: boolean;
  private music: HTMLAudioElement;

  constructor() {
    this.musicOn =
      localStorage.getItem("musicOn") !== null
        ? localStorage.getItem("musicOn") === "true"
        : true;
    this.soundOn =
      localStorage.getItem("soundOn") !== null
        ? localStorage.getItem("soundOn") === "true"
        : true;

    this.music = this.loadSound("sounds/music.wav");
    this.initializeMusic();
  }

  private loadSound(url: string): HTMLAudioElement {
    const sound = new Audio(url);
    sound.load();
    return sound;
  }

  private initializeMusic(): void {
    this.music.loop = true;
    this.music.volume = 0.15;

    this.music.addEventListener(
      "timeupdate",
      function () {
        const buffer = 0.3;
        if (this.currentTime > this.duration - buffer) {
          this.currentTime = 0;
          this.play();
        }
      },
      false
    );
  }

  public tryPlayMusic(): void {
    if (this.musicOn) {
      const playPromise = this.music.play();

      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            // Playback was successful.
            console.log("Music playback started");
          })
          .catch((error) => {
            console.error("Failed to start music playback:", error);
          });
      }
    }
  }

  public toggleMusic(): void {
    this.musicOn = !this.musicOn;
    localStorage.setItem("musicOn", this.musicOn.toString()); // Update local storage

    if (this.musicOn) {
      this.tryPlayMusic();
    } else {
      this.music.pause();
    }
  }

  public toggleSound(): void {
    this.soundOn = !this.soundOn;
    localStorage.setItem("soundOn", this.soundOn.toString()); // Update local storage
  }

  public playSound(soundName: string): void {
    if (!this.soundOn) return;

    const sound = this.loadSound(`sounds/${soundName}.mp3`);
    sound.play();
  }
}
