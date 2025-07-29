// client/src/services/sound.ts

// --- Click Sound Pool for Instant Playback ---
const clickSoundPool: HTMLAudioElement[] = [];
const CLICK_POOL_SIZE = 5;

const initializeClickSounds = () => {
  for (let i = 0; i < CLICK_POOL_SIZE; i++) {
    const audio = new Audio('/assets/click-sound.wav');
    audio.preload = 'auto';
    audio.volume = 0.3; // Slightly quieter for better UX
    clickSoundPool.push(audio);
  }
};

// Initialize click sound pool immediately
initializeClickSounds();

let clickSoundIndex = 0;
export const playClickSound = () => {
  try {
    const sound = clickSoundPool[clickSoundIndex];
    sound.currentTime = 0; // Reset to start
    sound.play().catch(error => {
      console.debug("Click sound playback failed:", error);
    });
    clickSoundIndex = (clickSoundIndex + 1) % CLICK_POOL_SIZE; // Cycle through pool
  } catch (error) {
    console.debug("Click sound error:", error);
  }
};

// --- Task Complete Sound Pool for Instant Playback ---
const taskCompleteSoundPool: HTMLAudioElement[] = [];
const TASK_COMPLETE_POOL_SIZE = 3;

const initializeTaskCompleteSounds = () => {
  for (let i = 0; i < TASK_COMPLETE_POOL_SIZE; i++) {
    const audio = new Audio('/assets/task-complete.mp3');
    audio.preload = 'auto';
    audio.volume = 1.0; // Maximum volume for task completion (200% increase from 0.4)
    taskCompleteSoundPool.push(audio);
  }
};

// Initialize task complete sound pool immediately
initializeTaskCompleteSounds();

let taskCompleteSoundIndex = 0;
export const playTaskCompleteSound = () => {
  try {
    const sound = taskCompleteSoundPool[taskCompleteSoundIndex];
    sound.currentTime = 0; // Reset to start for instant playback
    sound.play().catch(error => {
      console.debug("Task complete sound playback failed:", error);
    });
    taskCompleteSoundIndex = (taskCompleteSoundIndex + 1) % TASK_COMPLETE_POOL_SIZE; // Cycle through pool
  } catch (error) {
    console.debug("Task complete sound error:", error);
  }
};