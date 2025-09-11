"use client";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { isValidWord, getWordleKey } from "@/app/wordle/words";
import { Guess, Letter, LetterState } from "@/app/wordle/types";
import Keyboard from "@/app/wordle/Keyboard";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PartyPopper, X, Flame, Trophy } from "lucide-react";
import { twMerge } from "tailwind-merge";

const GUESS_LIMIT = 6;
const WORD_LENGTH = 5;

function LetterCell({ letter, state = "default" }: { letter: string; state?: LetterState }) {
  const [popping, setPopping] = useState(false);

  useEffect(() => {
    if (letter !== "") {
      setPopping(true);
      const t = setTimeout(() => setPopping(false), 50); // reset after animation
      return () => clearTimeout(t);
    }
  }, [letter]);

  const cellClass = twMerge(
    "flex items-center justify-center text-2xl sm:text-3xl rounded-lg w-12 h-12 sm:w-14 sm:h-14 border-2 transition-transform duration-50",
    popping && "scale-110", // pop effect
    letter === "" 
      ? "border-gray-400 dark:border-gray-600" 
      : "border-gray-500 dark:border-gray-800",
    state === "correct" && "border-0 bg-emerald-500 text-white",
    state === "present" && "border-0 bg-yellow-500 text-white",
    state === "absent" && "border-0 bg-gray-600 text-white"
  );



  return <span className={cellClass}>{letter.toUpperCase()}</span>;
}


function WordRow({
  guess,
  isCurrent,
  onUpdate,
  onSubmit,
  gameOver,
}: {
  guess: Guess;
  isCurrent: boolean;
  onUpdate: (letters: Letter[]) => void;
  onSubmit: (letters: Letter[]) => void;
  gameOver: boolean;
}) {
  useEffect(() => {
    if (!isCurrent || gameOver) return;

    const handleKeyDown = async (e: KeyboardEvent) => {
      const nextLetters = [...guess.letters];
      const cursor = nextLetters.findIndex((l) => l.char === "");

      if (e.key.length === 1 && /^[a-zA-Z]$/.test(e.key)) {
        if (cursor !== -1) nextLetters[cursor] = { ...nextLetters[cursor], char: e.key.toUpperCase() };
      } else if (e.key === "Backspace") {
        const deleteIndex = cursor === -1 ? guess.letters.length - 1 : cursor - 1;
        if (deleteIndex >= 0) nextLetters[deleteIndex] = { ...nextLetters[deleteIndex], char: "" };
      }

      onUpdate(nextLetters);

      if (e.key === "Enter" && nextLetters.every((l) => l.char !== "")) {
        onSubmit(nextLetters);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isCurrent, guess, onUpdate, onSubmit, gameOver]);

  return (
    <div className="flex gap-1">
      {guess.letters.map((letter, idx) => (
        <LetterCell key={idx} letter={letter.char} state={letter.state} />
      ))}
    </div>
  );
}

export default function WordleClient() {
  const [guesses, setGuesses] = useState<Guess[]>(
    Array.from({ length: GUESS_LIMIT }, () => ({
      letters: Array.from({ length: WORD_LENGTH }, () => ({ char: "", state: "default" })),
      isValid: false,
      isSolution: false,
    }))
  );
  const [currentRow, setCurrentRow] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isWin, setIsWin] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const [streak, setStreak] = useState(0);
  const [highestStreak, setHighestStreak] = useState(0);
  const [storageKey, setStorageKey] = useState<string | null>(null);

  // --- Load state on mount
  useEffect(() => {
    (async () => {
      const key = await getWordleKey(); // server action
      setStorageKey(key);

      const saved = localStorage.getItem(key);
      if (saved) {
        const state = JSON.parse(saved);
        setGuesses(state.guesses);
        setCurrentRow(state.currentRow);
        setGameOver(state.gameOver);
        setIsWin(state.isWin);
      }

      const streaks = JSON.parse(localStorage.getItem("wordle-streaks") || "{}");
      setStreak(streaks.streak || 0);
      setHighestStreak(streaks.highest || 0);
    })();
  }, []);

  // --- Save state after each change
  useEffect(() => {
    if (!storageKey) return;
    localStorage.setItem(
      storageKey,
      JSON.stringify({
        guesses,
        currentRow,
        gameOver,
        isWin,
      })
    );
    if (gameOver) setDialogOpen(true);

  }, [guesses, currentRow, gameOver, isWin, storageKey]);

  // --- Handle streaks
  useEffect(() => {
    if (!gameOver || !storageKey) return;

    // Extract today's server date from the key
    const today = storageKey.replace("wordle-", "");
    const streaks = JSON.parse(localStorage.getItem("wordle-streaks") || "{}");

    let newStreak = 0;
    let highest = streaks.highest || 0;
    const lastWon = streaks.lastWon || null;

    if (isWin) {
      const [y, m, d] = today.split("-").map(Number);
      const yesterday = new Date(Date.UTC(y, m - 1, d - 1))
        .toISOString()
        .split("T")[0];

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
      "wordle-streaks",
      JSON.stringify({ streak: newStreak, highest, lastWon: isWin ? today : lastWon })
    );
  }, [gameOver, isWin, storageKey]);



  // --- Update guess
  const updateGuess = (idx: number, letters: Letter[]) => {
    setGuesses((prev) =>
      prev.map((g, i) => (i === idx ? { ...g, letters } : g))
    );
  };

  // --- Submit guess
  const submitGuess = async (idx: number, letters: Letter[]) => {
    if (gameOver) return;

    const word = letters.map((l) => l.char).join("");
    const result = await isValidWord(word);

    if (!result.isValid) {
      // invalid word: mark guess invalid instantly
      setGuesses((prev) =>
        prev.map((g, i) =>
          i === idx ? { ...g, isValid: false, isSolution: false } : g
        )
      );
      return;
    }

    // reveal letters gradually
    result.letterStates.forEach((state, i) => {
      setTimeout(() => {
        setGuesses((prev) =>
          prev.map((g, gi) =>
            gi === idx
              ? {
                  ...g,
                  letters: g.letters.map((l, li) =>
                    li === i ? { ...l, state } : l
                  ),
                  isValid: true,
                  isSolution: result.isSolution,
                }
              : g
          )
        );
      }, i * 300); // 300ms delay between letters
    });

    // after last letter finishes, handle win/lose progression
    setTimeout(() => {
      if (result.isSolution) {
        setIsWin(true);
        setGameOver(true);
      } else {
        if (currentRow < GUESS_LIMIT - 1) setCurrentRow(currentRow + 1);
        else setGameOver(true);
      }
    }, result.letterStates.length * 300 + 50);
  };


  function getKeyboardStates(guesses: Guess[]): Record<string, LetterState> {
    const priority: Record<LetterState, number> = {
      correct: 3,
      present: 2,
      absent: 1,
      default: 0,
    };

    const states: Record<string, LetterState> = {};
    for (const guess of guesses) {
      for (const letter of guess.letters) {
        if (!letter.char) continue;
        const current = states[letter.char] ?? "default";
        if (priority[letter.state] > priority[current]) {
          states[letter.char] = letter.state;
        }
      }
    }
    return states;
  }

  const keyboardStates = getKeyboardStates(guesses);

  return (
    <div className="flex justify-center items-center flex-col gap-1">
      {guesses.map((guess, idx) => (
        <WordRow
          key={idx}
          guess={guess}
          isCurrent={idx === currentRow}
          onUpdate={(letters) => updateGuess(idx, letters)}
          onSubmit={(letters) => submitGuess(idx, letters)}
          gameOver={gameOver}
        />
      ))}

      <br />
      <Keyboard states={keyboardStates} />

      {/* Endgame Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-sm rounded-2xl shadow-lg">
          <DialogHeader>
            <DialogTitle>
                           
                {isWin ? (
                    <span className="flex justify-center items-center text-2xl font-bold gap-2"> 
                      <PartyPopper/>
                      You Got it!
                    </span>
                  ) : (
                    <h2 className="flex justify-center items-center text-2xl font-bold gap-2"> 
                      <X/>
                      {'Your guess is wrong :('}
                    </h2>
                  )
                }
              
            </DialogTitle>
          </DialogHeader>
          <div className="text-center mt-2 space-y-2">
            {isWin ? (
              <p className="text-emerald-600 text-lg font-semibold">
                Today's word was "{guesses[currentRow].letters.map(l => l.char).join('')}" come back tomorrow for a new word 🤙
              </p>
            ) : (
              <p className="text-red-600 text-lg font-semibold">
                Better luck next time — try again tomorrow!
              </p>
            )}

            <div className="mt-4 flex flex-col text-foreground">
              <span className="flex justify-center items-center gap-1">
                <Flame/> Current Streak: <b>{streak}</b>
              </span>
              <span className="flex justify-center items-center gap-1">
                <Trophy/> Highest Streak: <b>{highestStreak}</b>
              </span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );

}
