import { useState, useEffect } from "react";
import { getWordleKey } from "../lib/words";
import { Guess } from "../types";
import { GUESS_LIMIT, WORD_LENGTH, STORAGE_KEYS } from "../lib/constants";
import dayjs from "dayjs";

interface GameState {
  guesses: Guess[];
  currentRow: number;
  gameOver: boolean;
  isWin: boolean;
}

interface StreakData {
  streak: number;
  highest: number;
  lastWon?: string;
}

interface UseWordleStorageReturn {
  // Game state
  guesses: Guess[];
  currentRow: number;
  gameOver: boolean;
  isWin: boolean;
  
  // Streak data
  streak: number;
  highestStreak: number;
  
  // Storage key
  storageKey: string | null;
  
  // State setters
  setGuesses: React.Dispatch<React.SetStateAction<Guess[]>>;
  setCurrentRow: React.Dispatch<React.SetStateAction<number>>;
  setGameOver: React.Dispatch<React.SetStateAction<boolean>>;
  setIsWin: React.Dispatch<React.SetStateAction<boolean>>;
  
  // Utility
  isLoaded: boolean;
}


const createInitialGuesses = (): Guess[] =>
  Array.from({ length: GUESS_LIMIT }, () => ({
    letters: Array.from({ length: WORD_LENGTH }, () => ({ char: "", state: "default" as const })),
    isValid: false,
    isSolution: false,
  }));

export function useWordleStorage(): UseWordleStorageReturn {
    const [guesses, setGuesses] = useState<Guess[]>(createInitialGuesses());
    const [currentRow, setCurrentRow] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [isWin, setIsWin] = useState(false);
    const [streak, setStreak] = useState(0);
    const [highestStreak, setHighestStreak] = useState(0);
    const [storageKey, setStorageKey] = useState<string | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        (async () => {
        const key = await getWordleKey(); // server action
        setStorageKey(key);

        const saved = localStorage.getItem(key);
        if (saved) {
            const state: GameState = JSON.parse(saved);
            setGuesses(state.guesses);
            setCurrentRow(state.currentRow);
            setGameOver(state.gameOver);
            setIsWin(state.isWin);
        }

        const streaks: StreakData = JSON.parse(localStorage.getItem(STORAGE_KEYS.WORDLE_STREAKS) || "{}");
        setStreak(streaks.streak || 0);
        setHighestStreak(streaks.highest || 0);
        
        setIsLoaded(true);
        })();
    }, []);

    useEffect(() => {
        if (!storageKey || !isLoaded) return;
        
        localStorage.setItem(
        storageKey,
        JSON.stringify({
            guesses,
            currentRow,
            gameOver,
            isWin,
        })
        );
    }, [guesses, currentRow, gameOver, isWin, storageKey, isLoaded]);

    // Update streaks when game ends
    useEffect(() => {
        if (!gameOver || !storageKey || !isLoaded) return;

        // Extract today's server date from the key
        const today = storageKey.replace(STORAGE_KEYS.WORDLE_PREFIX, "");
        const streaks: StreakData = JSON.parse(localStorage.getItem(STORAGE_KEYS.WORDLE_STREAKS) || "{}");

        let newStreak = 0;
        let highest = streaks.highest || 0;
        const lastWon = streaks.lastWon || null;

        if (isWin) {
            const yesterday = dayjs(today).subtract(1, "day").format("YYYY-MM-DD");


            if (!lastWon) {
                newStreak = 1;
            } else if (lastWon === today) {
                newStreak = streaks.streak || 1;
            } else if (lastWon === yesterday) {
                newStreak = (streaks.streak || 0) + 1;
            } else {
                newStreak = 1;
            }

            highest = Math.max(highest, newStreak);
        } else {
            newStreak = 0; // lose breaks streak
        }

        setStreak(newStreak);
        setHighestStreak(highest);

        localStorage.setItem(
        STORAGE_KEYS.WORDLE_STREAKS,
        JSON.stringify({ streak: newStreak, highest, lastWon: isWin ? today : lastWon })
        );
    }, [gameOver, isWin, storageKey, isLoaded]);

    return {
        guesses,
        currentRow,
        gameOver,
        isWin,
        streak,
        highestStreak,
        storageKey,
        setGuesses,
        setCurrentRow,
        setGameOver,
        setIsWin,
        isLoaded,
    };
}
