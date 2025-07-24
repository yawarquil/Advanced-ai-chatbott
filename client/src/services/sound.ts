// client/src/services/sound.ts

// --- Click Sound ---
const clickSound = new Audio('/assets/click-sound.wav');
clickSound.preload = 'auto';
let isClickSoundLoaded = false;
clickSound.addEventListener('canplaythrough', () => {
  isClickSoundLoaded = true;
});

export const playClickSound = () => {
  if (isClickSoundLoaded) {
    const soundToPlay = clickSound.cloneNode(true) as HTMLAudioElement;
    soundToPlay.play().catch(error => {
      console.error("Click sound playback failed:", error);
    });
  }
};

// --- Task Complete Sound ---
const taskCompleteSound = new Audio('/assets/task-complete.mp3');
taskCompleteSound.preload = 'auto';
let isTaskCompleteSoundLoaded = false;
taskCompleteSound.addEventListener('canplaythrough', () => {
  isTaskCompleteSoundLoaded = true;
});

export const playTaskCompleteSound = () => {
  if (isTaskCompleteSoundLoaded) {
    taskCompleteSound.currentTime = 0;
    taskCompleteSound.play().catch(error => {
      console.error("Task complete sound playback failed:", error);
    });
  }
};