// Game configuration
export const GUESS_LIMIT = 6;
export const WORD_LENGTH = 5;

// Animation timings (in milliseconds)
export const ANIMATION_TIMINGS = {
  POP_DURATION: 50,
  FLIP_HALF_DURATION: 300,
  FLIP_FULL_DURATION: 600,
  SHAKE_DURATION: 400,
  LETTER_REVEAL_DELAY: 300,
} as const;

// Storage keys
export const STORAGE_KEYS = {
  WORDLE_STREAKS: "wordle-streaks",
  WORDLE_PREFIX: "wordle-",
} as const;
